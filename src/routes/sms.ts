import { Hono } from 'hono'

type Bindings = {
  DB: D1Database
  NHN_APP_KEY: string
  NHN_SECRET_KEY: string
  NHN_SENDER: string
}

const app = new Hono<{ Bindings: Bindings }>()

// SMS 발송 (단건 또는 대량)
app.post('/send', async (c) => {
  const { env } = c
  const { recipients, message, memberId, scheduleId } = await c.req.json()

  // 환경변수 확인
  if (!env.NHN_APP_KEY || !env.NHN_SECRET_KEY || !env.NHN_SENDER) {
    return c.json({ 
      error: 'SMS 서비스가 설정되지 않았습니다. 관리자에게 문의하세요.' 
    }, 500)
  }

  // recipients가 배열이 아니면 배열로 변환
  const recipientList = Array.isArray(recipients) ? recipients : [recipients]

  try {
    // NHN Cloud SMS API 호출
    const response = await fetch(
      `https://api-sms.cloud.toast.com/sms/v3.0/appKeys/${env.NHN_APP_KEY}/sender/sms`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Secret-Key': env.NHN_SECRET_KEY
        },
        body: JSON.stringify({
          body: message,
          sendNo: env.NHN_SENDER,
          recipientList: recipientList.map((phone: string) => ({
            recipientNo: phone.replace(/[^0-9]/g, ''), // 숫자만 추출
            templateParameter: {}
          }))
        })
      }
    )

    const result = await response.json() as any

    // 각 수신자별로 로그 저장
    for (const phone of recipientList) {
      const status = result.header?.isSuccessful ? 'success' : 'failed'
      const errorMessage = result.header?.isSuccessful ? null : result.header?.resultMessage

      await env.DB.prepare(`
        INSERT INTO sms_logs (recipient, message, sender, status, error_message, request_id, result_code, member_id, schedule_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        phone,
        message,
        env.NHN_SENDER,
        status,
        errorMessage,
        result.header?.requestId || null,
        result.header?.resultCode || null,
        memberId || null,
        scheduleId || null
      ).run()
    }

    if (!result.header?.isSuccessful) {
      return c.json({ 
        error: '문자 발송에 실패했습니다.',
        detail: result.header?.resultMessage 
      }, 500)
    }

    return c.json({ 
      message: `${recipientList.length}명에게 문자가 발송되었습니다.`,
      requestId: result.header?.requestId,
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
        env.NHN_SENDER,
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
