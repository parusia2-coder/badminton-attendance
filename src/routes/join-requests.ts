import { Hono } from 'hono'

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

// 가입 신청 등록 (공개)
app.post('/', async (c) => {
  try {
    const { name, gender, birth_year, phone, club, message } = await c.req.json()

    // 유효성 검사
    if (!name || !gender || !birth_year || !phone) {
      return c.json({ error: '필수 정보를 모두 입력해주세요' }, 400)
    }

    const result = await c.env.DB.prepare(`
      INSERT INTO join_requests (name, gender, birth_year, phone, club, message, status)
      VALUES (?, ?, ?, ?, ?, ?, 'pending')
    `).bind(name, gender, birth_year, phone, club || '', message || '').run()

    return c.json({ 
      id: result.meta.last_row_id,
      message: '가입 신청이 완료되었습니다. 관리자 승인 후 연락드리겠습니다.' 
    })
  } catch (error) {
    console.error('가입 신청 등록 오류:', error)
    return c.json({ error: '가입 신청 등록 실패' }, 500)
  }
})

// 가입 신청 목록 조회 (관리자)
app.get('/', async (c) => {
  try {
    const status = c.req.query('status') || 'all'
    
    let query = 'SELECT * FROM join_requests'
    const params: string[] = []
    
    if (status !== 'all') {
      query += ' WHERE status = ?'
      params.push(status)
    }
    
    query += ' ORDER BY created_at DESC'
    
    const stmt = params.length > 0 
      ? c.env.DB.prepare(query).bind(...params)
      : c.env.DB.prepare(query)
    
    const { results } = await stmt.all()
    
    return c.json(results)
  } catch (error) {
    console.error('가입 신청 목록 조회 오류:', error)
    return c.json({ error: '가입 신청 목록 조회 실패' }, 500)
  }
})

// 가입 신청 상세 조회 (관리자)
app.get('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const { results } = await c.env.DB.prepare(`
      SELECT * FROM join_requests WHERE id = ?
    `).bind(id).all()

    if (results.length === 0) {
      return c.json({ error: '가입 신청을 찾을 수 없습니다' }, 404)
    }

    return c.json(results[0])
  } catch (error) {
    console.error('가입 신청 조회 오류:', error)
    return c.json({ error: '가입 신청 조회 실패' }, 500)
  }
})

// 가입 신청 승인 (관리자)
app.post('/:id/approve', async (c) => {
  try {
    const id = c.req.param('id')
    const { admin_note } = await c.req.json()

    // 가입 신청 정보 가져오기
    const { results } = await c.env.DB.prepare(`
      SELECT * FROM join_requests WHERE id = ?
    `).bind(id).all()

    if (results.length === 0) {
      return c.json({ error: '가입 신청을 찾을 수 없습니다' }, 404)
    }

    const request = results[0] as any

    // 회원 테이블에 추가
    await c.env.DB.prepare(`
      INSERT INTO members (name, gender, birth_year, phone, club, grade)
      VALUES (?, ?, ?, ?, ?, 'C')
    `).bind(
      request.name,
      request.gender,
      request.birth_year,
      request.phone,
      request.club || '미정'
    ).run()

    // 가입 신청 상태 업데이트
    await c.env.DB.prepare(`
      UPDATE join_requests 
      SET status = 'approved', admin_note = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(admin_note || '', id).run()

    return c.json({ message: '가입 신청이 승인되었습니다' })
  } catch (error) {
    console.error('가입 승인 오류:', error)
    return c.json({ error: '가입 승인 실패' }, 500)
  }
})

// 가입 신청 거절 (관리자)
app.post('/:id/reject', async (c) => {
  try {
    const id = c.req.param('id')
    const { admin_note } = await c.req.json()

    await c.env.DB.prepare(`
      UPDATE join_requests 
      SET status = 'rejected', admin_note = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(admin_note || '', id).run()

    return c.json({ message: '가입 신청이 거절되었습니다' })
  } catch (error) {
    console.error('가입 거절 오류:', error)
    return c.json({ error: '가입 거절 실패' }, 500)
  }
})

// 가입 신청 삭제 (관리자)
app.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id')

    await c.env.DB.prepare(`
      DELETE FROM join_requests WHERE id = ?
    `).bind(id).run()

    return c.json({ message: '가입 신청이 삭제되었습니다' })
  } catch (error) {
    console.error('가입 신청 삭제 오류:', error)
    return c.json({ error: '가입 신청 삭제 실패' }, 500)
  }
})

export default app
