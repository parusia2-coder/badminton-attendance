import { Hono } from 'hono'

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

// ========== 회비 설정 관리 ==========

// 회비 설정 조회
app.get('/settings', async (c) => {
  const { env } = c
  
  try {
    const settings = await env.DB.prepare(`
      SELECT * FROM fee_settings 
      ORDER BY year DESC
    `).all()
    
    return c.json({ settings: settings.results })
  } catch (error) {
    console.error('회비 설정 조회 오류:', error)
    return c.json({ error: '회비 설정 조회 중 오류가 발생했습니다.' }, 500)
  }
})

// 특정 년도 회비 설정 조회
app.get('/settings/:year', async (c) => {
  const { env } = c
  const year = parseInt(c.req.param('year'))
  
  try {
    const setting = await env.DB.prepare(`
      SELECT * FROM fee_settings WHERE year = ?
    `).bind(year).first()
    
    if (!setting) {
      return c.json({ error: '해당 년도의 회비 설정을 찾을 수 없습니다.' }, 404)
    }
    
    return c.json(setting)
  } catch (error) {
    console.error('회비 설정 조회 오류:', error)
    return c.json({ error: '회비 설정 조회 중 오류가 발생했습니다.' }, 500)
  }
})

// 회비 설정 생성/수정
app.post('/settings', async (c) => {
  const { env } = c
  const { year, amount, description } = await c.req.json()
  
  if (!year || !amount) {
    return c.json({ error: '년도와 금액은 필수입니다.' }, 400)
  }
  
  try {
    // 기존 설정 확인
    const existing = await env.DB.prepare(`
      SELECT id FROM fee_settings WHERE year = ?
    `).bind(year).first()
    
    if (existing) {
      // 수정
      await env.DB.prepare(`
        UPDATE fee_settings 
        SET amount = ?, description = ?, updated_at = CURRENT_TIMESTAMP
        WHERE year = ?
      `).bind(amount, description || null, year).run()
      
      return c.json({ message: '회비 설정이 수정되었습니다.' })
    } else {
      // 생성
      await env.DB.prepare(`
        INSERT INTO fee_settings (year, amount, description)
        VALUES (?, ?, ?)
      `).bind(year, amount, description || null).run()
      
      return c.json({ message: '회비 설정이 생성되었습니다.' }, 201)
    }
  } catch (error) {
    console.error('회비 설정 저장 오류:', error)
    return c.json({ error: '회비 설정 저장 중 오류가 발생했습니다.' }, 500)
  }
})

// ========== 회비 납부 관리 ==========

// 회비 납부 등록
app.post('/payments', async (c) => {
  const { env } = c
  const { memberId, year, amount, paymentDate, note } = await c.req.json()
  
  if (!memberId || !year || !amount || !paymentDate) {
    return c.json({ error: '회원, 년도, 금액, 납부일은 필수입니다.' }, 400)
  }
  
  try {
    // 납부 등록
    const result = await env.DB.prepare(`
      INSERT INTO fee_payments (member_id, year, amount, payment_date, note)
      VALUES (?, ?, ?, ?, ?)
    `).bind(memberId, year, amount, paymentDate, note || null).run()
    
    // 회원 테이블의 fee_paid 업데이트
    await env.DB.prepare(`
      UPDATE members SET fee_paid = 1, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(memberId).run()
    
    return c.json({ 
      message: '회비 납부가 등록되었습니다.',
      id: result.meta.last_row_id 
    }, 201)
  } catch (error) {
    console.error('회비 납부 등록 오류:', error)
    return c.json({ error: '회비 납부 등록 중 오류가 발생했습니다.' }, 500)
  }
})

// 회비 납부 내역 조회
app.get('/payments', async (c) => {
  const { env } = c
  const year = c.req.query('year')
  const memberId = c.req.query('memberId')
  
  try {
    let query = `
      SELECT 
        fp.*,
        m.name as member_name,
        m.club as member_club,
        m.phone as member_phone
      FROM fee_payments fp
      JOIN members m ON fp.member_id = m.id
      WHERE 1=1
    `
    const bindings: any[] = []
    
    if (year) {
      query += ` AND fp.year = ?`
      bindings.push(parseInt(year))
    }
    
    if (memberId) {
      query += ` AND fp.member_id = ?`
      bindings.push(parseInt(memberId))
    }
    
    query += ` ORDER BY fp.payment_date DESC, fp.created_at DESC`
    
    const payments = await env.DB.prepare(query).bind(...bindings).all()
    
    return c.json({ payments: payments.results })
  } catch (error) {
    console.error('회비 납부 내역 조회 오류:', error)
    return c.json({ error: '회비 납부 내역 조회 중 오류가 발생했습니다.' }, 500)
  }
})

// 특정 회비 납부 내역 조회
app.get('/payments/:id', async (c) => {
  const { env } = c
  const id = parseInt(c.req.param('id'))
  
  try {
    const payment = await env.DB.prepare(`
      SELECT 
        fp.*,
        m.name as member_name,
        m.club as member_club,
        m.phone as member_phone
      FROM fee_payments fp
      JOIN members m ON fp.member_id = m.id
      WHERE fp.id = ?
    `).bind(id).first()
    
    if (!payment) {
      return c.json({ error: '납부 내역을 찾을 수 없습니다.' }, 404)
    }
    
    return c.json(payment)
  } catch (error) {
    console.error('회비 납부 내역 조회 오류:', error)
    return c.json({ error: '회비 납부 내역 조회 중 오류가 발생했습니다.' }, 500)
  }
})

// 회비 납부 수정
app.put('/payments/:id', async (c) => {
  const { env } = c
  const id = parseInt(c.req.param('id'))
  const { year, amount, paymentDate, note } = await c.req.json()
  
  try {
    await env.DB.prepare(`
      UPDATE fee_payments
      SET year = ?, amount = ?, payment_date = ?, note = ?
      WHERE id = ?
    `).bind(year, amount, paymentDate, note || null, id).run()
    
    return c.json({ message: '회비 납부 내역이 수정되었습니다.' })
  } catch (error) {
    console.error('회비 납부 수정 오류:', error)
    return c.json({ error: '회비 납부 수정 중 오류가 발생했습니다.' }, 500)
  }
})

// 회비 납부 삭제
app.delete('/payments/:id', async (c) => {
  const { env } = c
  const id = parseInt(c.req.param('id'))
  
  try {
    // 납부 내역 조회
    const payment = await env.DB.prepare(`
      SELECT member_id, year FROM fee_payments WHERE id = ?
    `).bind(id).first()
    
    if (!payment) {
      return c.json({ error: '납부 내역을 찾을 수 없습니다.' }, 404)
    }
    
    // 납부 내역 삭제
    await env.DB.prepare(`
      DELETE FROM fee_payments WHERE id = ?
    `).bind(id).run()
    
    // 해당 회원의 해당 년도 다른 납부 내역 확인
    const otherPayments = await env.DB.prepare(`
      SELECT id FROM fee_payments 
      WHERE member_id = ? AND year = ?
      LIMIT 1
    `).bind(payment.member_id, payment.year).first()
    
    // 다른 납부 내역이 없으면 fee_paid를 0으로 업데이트
    if (!otherPayments) {
      await env.DB.prepare(`
        UPDATE members SET fee_paid = 0, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(payment.member_id).run()
    }
    
    return c.json({ message: '회비 납부 내역이 삭제되었습니다.' })
  } catch (error) {
    console.error('회비 납부 삭제 오류:', error)
    return c.json({ error: '회비 납부 삭제 중 오류가 발생했습니다.' }, 500)
  }
})

// ========== 회비 통계 ==========

// 회비 납부 통계
app.get('/stats', async (c) => {
  const { env } = c
  const year = parseInt(c.req.query('year') || new Date().getFullYear().toString())
  
  try {
    // 전체 회원 수
    const totalMembers = await env.DB.prepare(`
      SELECT COUNT(*) as count FROM members
    `).first()
    
    // 납부 회원 수
    const paidMembers = await env.DB.prepare(`
      SELECT COUNT(DISTINCT member_id) as count 
      FROM fee_payments 
      WHERE year = ?
    `).bind(year).first()
    
    // 총 납부액
    const totalAmount = await env.DB.prepare(`
      SELECT SUM(amount) as total 
      FROM fee_payments 
      WHERE year = ?
    `).bind(year).first()
    
    // 미납 회원 목록
    const unpaidMembers = await env.DB.prepare(`
      SELECT m.* 
      FROM members m
      WHERE m.id NOT IN (
        SELECT DISTINCT member_id 
        FROM fee_payments 
        WHERE year = ?
      )
      ORDER BY m.club, m.name
    `).bind(year).all()
    
    // 클럽별 납부 현황
    const byClub = await env.DB.prepare(`
      SELECT 
        m.club,
        COUNT(DISTINCT m.id) as total_members,
        COUNT(DISTINCT fp.member_id) as paid_members,
        COALESCE(SUM(fp.amount), 0) as total_amount
      FROM members m
      LEFT JOIN fee_payments fp ON m.id = fp.member_id AND fp.year = ?
      GROUP BY m.club
      ORDER BY m.club
    `).bind(year).all()
    
    const stats = {
      year,
      totalMembers: totalMembers?.count || 0,
      paidMembers: paidMembers?.count || 0,
      unpaidMembers: unpaidMembers.results,
      unpaidCount: unpaidMembers.results.length,
      paymentRate: totalMembers?.count 
        ? Math.round((paidMembers?.count || 0) / totalMembers.count * 100) 
        : 0,
      totalAmount: totalAmount?.total || 0,
      byClub: byClub.results
    }
    
    return c.json(stats)
  } catch (error) {
    console.error('회비 통계 조회 오류:', error)
    return c.json({ error: '회비 통계 조회 중 오류가 발생했습니다.' }, 500)
  }
})

// 회비 미납자 목록
app.get('/unpaid', async (c) => {
  const { env } = c
  const year = parseInt(c.req.query('year') || new Date().getFullYear().toString())
  
  try {
    const unpaidMembers = await env.DB.prepare(`
      SELECT m.* 
      FROM members m
      WHERE m.id NOT IN (
        SELECT DISTINCT member_id 
        FROM fee_payments 
        WHERE year = ?
      )
      ORDER BY m.club, m.name
    `).bind(year).all()
    
    return c.json({ 
      year,
      unpaidMembers: unpaidMembers.results,
      count: unpaidMembers.results.length
    })
  } catch (error) {
    console.error('미납자 조회 오류:', error)
    return c.json({ error: '미납자 조회 중 오류가 발생했습니다.' }, 500)
  }
})

export default app
