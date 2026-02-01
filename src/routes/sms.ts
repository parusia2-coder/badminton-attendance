import { Hono } from 'hono'

type Bindings = {
  DB: D1Database
  SOLAPI_API_KEY: string
  SOLAPI_API_SECRET: string
  SOLAPI_SENDER: string
}

const app = new Hono<{ Bindings: Bindings }>()

// SMS 발송 (단건 또는 대량)
app.post('/send', async (c) => {
  const { env } = c
  const { recipients, message, memberId, scheduleId } = await c.req.json()

  // recipients가 배열이 아니면 배열로 변환
  const recipientList = Array.isArray(recipients) ? recipients : [recipients]

  // 테스트 모드: API 키가 없으면 시뮬레이션
  const isTestMode = !env.SOLAPI_API_KEY || !env.SOLAPI_API_SECRET || !env.SOLAPI_SENDER

  if (isTestMode) {
    console.log('📱 [테스트 모드] SMS 발송 시뮬레이션')
    console.log('수신자:', recipientList)
    console.log('메시지:', message)

    // 테스트 모드에서는 성공으로 로그만 저장
    for (const phone of recipientList) {
      await env.DB.prepare(`
        INSERT INTO sms_logs (recipient, message, sender, status, error_message, request_id, result_code, member_id, schedule_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        phone,
        message,
        '010-0000-0000',
        'success',
        null,
        'TEST-' + Date.now(),
        'TEST_MODE',
        memberId || null,
        scheduleId || null
      ).run()
    }

    return c.json({ 
      message: `[테스트 모드] ${recipientList.length}명에게 문자 발송 시뮬레이션 완료`,
      requestId: 'TEST-' + Date.now(),
      count: recipientList.length,
      testMode: true
    })
  }

  try {
    // 솔라피 HMAC-SHA256 인증
    const dateTime = new Date().toISOString()
    const salt = Array.from({ length: 16 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('')
    
    // Signature 생성: HMAC-SHA256(API_SECRET, dateTime + salt)
    const data = dateTime + salt
    const encoder = new TextEncoder()
    const keyData = encoder.encode(env.SOLAPI_API_SECRET)
    const messageData = encoder.encode(data)
    
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )
    
    const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, messageData)
    const signature = Array.from(new Uint8Array(signatureBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
    
    const authHeader = `HMAC-SHA256 apiKey=${env.SOLAPI_API_KEY}, date=${dateTime}, salt=${salt}, signature=${signature}`
    
    console.log('📱 인증 헤더 생성 완료:', dateTime, salt.substring(0, 8) + '...')
    
    // 솔라피 SMS API 호출
    const response = await fetch(
      'https://api.solapi.com/messages/v4/send-many/detail',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader
        },
        body: JSON.stringify({
          messages: recipientList.map((phone: string) => ({
            to: phone.replace(/[^0-9]/g, ''), // 숫자만 추출
            from: env.SOLAPI_SENDER.replace(/[^0-9]/g, ''), // 숫자만 추출
            text: message
          }))
        })
      }
    )

    const result = await response.json() as any

    // 디버깅: API 응답 로그
    console.log('📱 솔라피 API 응답:', JSON.stringify(result, null, 2))
    console.log('📱 HTTP 상태:', response.status, response.statusText)

    // 각 수신자별로 로그 저장
    const status = response.ok ? 'success' : 'failed'
    const errorMessage = response.ok ? null : result.errorMessage || result.message || JSON.stringify(result)

    for (const phone of recipientList) {
      await env.DB.prepare(`
        INSERT INTO sms_logs (recipient, message, sender, status, error_message, request_id, result_code, member_id, schedule_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        phone,
        message,
        env.SOLAPI_SENDER,
        status,
        errorMessage,
        result.groupId || null,
        result.statusCode || null,
        memberId || null,
        scheduleId || null
      ).run()
    }

    if (!response.ok) {
      return c.json({ 
        error: '문자 발송에 실패했습니다.',
        detail: result.errorMessage || result.message
      }, 500)
    }

    return c.json({ 
      message: `${recipientList.length}명에게 문자가 발송되었습니다.`,
      requestId: result.groupId,
      count: recipientList.length
    })

  } catch (error) {
    console.error('SMS 발송 오류:', error)
    
    // 오류 발생 시에도 로그 저장
    for (const phone of recipientList) {
      await env.DB.prepare(`
        INSERT INTO sms_logs (recipient, message, sender, status, error_message, member_id, schedule_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).bind(
        phone,
        message,
        env.SOLAPI_SENDER,
        'failed',
        error instanceof Error ? error.message : '알 수 없는 오류',
        memberId || null,
        scheduleId || null
      ).run()
    }

    return c.json({ error: '문자 발송 중 오류가 발생했습니다.' }, 500)
  }
})

// SMS 발송 이력 조회
app.get('/logs', async (c) => {
  const { env } = c
  const page = parseInt(c.req.query('page') || '1')
  const limit = parseInt(c.req.query('limit') || '50')
  const offset = (page - 1) * limit

  try {
    // 전체 개수
    const countResult = await env.DB.prepare(`
      SELECT COUNT(*) as total FROM sms_logs
    `).first()

    // 발송 이력 조회 (회원 정보와 조인)
    const logs = await env.DB.prepare(`
      SELECT 
        s.*,
        m.name as member_name,
        m.club as member_club,
        sc.title as schedule_title,
        sc.schedule_date
      FROM sms_logs s
      LEFT JOIN members m ON s.member_id = m.id
      LEFT JOIN schedules sc ON s.schedule_id = sc.id
      ORDER BY s.sent_at DESC
      LIMIT ? OFFSET ?
    `).bind(limit, offset).all()

    return c.json({
      logs: logs.results,
      total: countResult?.total || 0,
      page,
      limit
    })

  } catch (error) {
    console.error('SMS 로그 조회 오류:', error)
    return c.json({ error: 'SMS 로그 조회 중 오류가 발생했습니다.' }, 500)
  }
})

// 특정 회원의 SMS 발송 이력
app.get('/logs/member/:memberId', async (c) => {
  const { env } = c
  const memberId = c.req.param('memberId')

  try {
    const logs = await env.DB.prepare(`
      SELECT 
        s.*,
        sc.title as schedule_title,
        sc.schedule_date
      FROM sms_logs s
      LEFT JOIN schedules sc ON s.schedule_id = sc.id
      WHERE s.member_id = ?
      ORDER BY s.sent_at DESC
      LIMIT 50
    `).bind(memberId).all()

    return c.json({ logs: logs.results })

  } catch (error) {
    console.error('회원 SMS 로그 조회 오류:', error)
    return c.json({ error: 'SMS 로그 조회 중 오류가 발생했습니다.' }, 500)
  }
})

// SMS 발송 통계
app.get('/stats', async (c) => {
  const { env } = c

  try {
    // 오늘 발송 건수
    const todayResult = await env.DB.prepare(`
      SELECT COUNT(*) as count
      FROM sms_logs
      WHERE DATE(sent_at) = DATE('now')
    `).first()

    // 이번 달 발송 건수
    const monthResult = await env.DB.prepare(`
      SELECT COUNT(*) as count
      FROM sms_logs
      WHERE strftime('%Y-%m', sent_at) = strftime('%Y-%m', 'now')
    `).first()

    // 성공/실패 통계
    const statusResult = await env.DB.prepare(`
      SELECT 
        status,
        COUNT(*) as count
      FROM sms_logs
      GROUP BY status
    `).all()

    return c.json({
      today: todayResult?.count || 0,
      month: monthResult?.count || 0,
      byStatus: statusResult.results
    })

  } catch (error) {
    console.error('SMS 통계 조회 오류:', error)
    return c.json({ error: 'SMS 통계 조회 중 오류가 발생했습니다.' }, 500)
  }
})

export default app
