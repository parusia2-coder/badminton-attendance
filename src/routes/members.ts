import { Hono } from 'hono'

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

// 전체 회원 조회 (검색, 필터링 포함)
app.get('/', async (c) => {
  try {
    const { search, club, grade, fee_paid } = c.req.query()
    
    let query = 'SELECT * FROM members WHERE 1=1'
    const params: any[] = []
    
    if (search) {
      query += ' AND (name LIKE ? OR phone LIKE ?)'
      params.push(`%${search}%`, `%${search}%`)
    }
    
    if (club) {
      query += ' AND club = ?'
      params.push(club)
    }
    
    if (grade) {
      query += ' AND grade = ?'
      params.push(grade)
    }
    
    if (fee_paid !== undefined) {
      query += ' AND fee_paid = ?'
      params.push(fee_paid)
    }
    
    query += ' ORDER BY name ASC'
    
    const { results } = await c.env.DB.prepare(query).bind(...params).all()
    return c.json({ members: results })
  } catch (error) {
    return c.json({ error: '회원 조회 중 오류가 발생했습니다' }, 500)
  }
})

// 회원 엑셀 내보내기용 데이터 (/:id 보다 먼저 정의해야 함)
app.get('/export', async (c) => {
  try {
    const { results } = await c.env.DB.prepare('SELECT * FROM members ORDER BY name ASC').all()
    return c.json({ members: results })
  } catch (error) {
    return c.json({ error: '데이터 내보내기 중 오류가 발생했습니다' }, 500)
  }
})

// 회원 상세 조회
app.get('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const member = await c.env.DB.prepare(
      'SELECT * FROM members WHERE id = ?'
    ).bind(id).first()
    
    if (!member) {
      return c.json({ error: '회원을 찾을 수 없습니다' }, 404)
    }
    
    return c.json({ member })
  } catch (error) {
    return c.json({ error: '회원 조회 중 오류가 발생했습니다' }, 500)
  }
})

// 회원 등록
app.post('/', async (c) => {
  try {
    const { name, gender, birth_year, club, grade, phone, fee_paid, car_registered } = await c.req.json()
    
    const result = await c.env.DB.prepare(
      'INSERT INTO members (name, gender, birth_year, club, grade, phone, fee_paid, car_registered) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    ).bind(name, gender, birth_year, club, grade, phone, fee_paid || 0, car_registered || 0).run()
    
    return c.json({ 
      message: '회원이 등록되었습니다', 
      id: result.meta.last_row_id 
    }, 201)
  } catch (error) {
    return c.json({ error: '회원 등록 중 오류가 발생했습니다' }, 500)
  }
})

// 회원 일괄 등록
app.post('/bulk', async (c) => {
  try {
    const { members } = await c.req.json()
    
    if (!Array.isArray(members) || members.length === 0) {
      return c.json({ error: '유효한 회원 데이터가 없습니다' }, 400)
    }
    
    let successCount = 0
    let errorCount = 0
    
    for (const member of members) {
      try {
        await c.env.DB.prepare(
          'INSERT INTO members (name, gender, birth_year, club, grade, phone, fee_paid, car_registered) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
        ).bind(
          member.name, 
          member.gender, 
          member.birth_year, 
          member.club, 
          member.grade, 
          member.phone, 
          member.fee_paid || 0, 
          member.car_registered || 0
        ).run()
        successCount++
      } catch (err) {
        errorCount++
      }
    }
    
    return c.json({ 
      message: `${successCount}명 등록 완료, ${errorCount}명 실패`, 
      successCount, 
      errorCount 
    })
  } catch (error) {
    return c.json({ error: '일괄 등록 중 오류가 발생했습니다' }, 500)
  }
})

// 회원 수정
app.put('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const { name, gender, birth_year, club, grade, phone, fee_paid, car_registered } = await c.req.json()
    
    await c.env.DB.prepare(
      'UPDATE members SET name = ?, gender = ?, birth_year = ?, club = ?, grade = ?, phone = ?, fee_paid = ?, car_registered = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(name, gender, birth_year, club, grade, phone, fee_paid, car_registered, id).run()
    
    return c.json({ message: '회원 정보가 수정되었습니다' })
  } catch (error) {
    return c.json({ error: '회원 수정 중 오류가 발생했습니다' }, 500)
  }
})

// 회원 삭제
app.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    await c.env.DB.prepare('DELETE FROM members WHERE id = ?').bind(id).run()
    return c.json({ message: '회원이 삭제되었습니다' })
  } catch (error) {
    return c.json({ error: '회원 삭제 중 오류가 발생했습니다' }, 500)
  }
})

// 전체 회원 삭제
app.delete('/', async (c) => {
  try {
    await c.env.DB.prepare('DELETE FROM members').run()
    return c.json({ message: '전체 회원이 삭제되었습니다' })
  } catch (error) {
    return c.json({ error: '전체 회원 삭제 중 오류가 발생했습니다' }, 500)
  }
})

// 회원 통계
app.get('/stats/summary', async (c) => {
  try {
    const total = await c.env.DB.prepare('SELECT COUNT(*) as count FROM members').first()
    const feePaid = await c.env.DB.prepare('SELECT COUNT(*) as count FROM members WHERE fee_paid = 1').first()
    const byGrade = await c.env.DB.prepare('SELECT grade, COUNT(*) as count FROM members GROUP BY grade ORDER BY grade').all()
    const byClub = await c.env.DB.prepare('SELECT club, COUNT(*) as count FROM members GROUP BY club ORDER BY count DESC').all()
    
    return c.json({
      total: total?.count || 0,
      feePaid: feePaid?.count || 0,
      byGrade: byGrade.results,
      byClub: byClub.results
    })
  } catch (error) {
    return c.json({ error: '통계 조회 중 오류가 발생했습니다' }, 500)
  }
})

// 회비 납부 내역 조회
app.get('/:id/payments', async (c) => {
  try {
    const id = c.req.param('id')
    const { results } = await c.env.DB.prepare(
      'SELECT * FROM fee_payments WHERE member_id = ? ORDER BY payment_date DESC'
    ).bind(id).all()
    
    return c.json({ payments: results })
  } catch (error) {
    return c.json({ error: '회비 내역 조회 중 오류가 발생했습니다' }, 500)
  }
})

// 회비 납부 등록
app.post('/:id/payments', async (c) => {
  try {
    const id = c.req.param('id')
    const { payment_date, amount, note } = await c.req.json()
    
    await c.env.DB.prepare(
      'INSERT INTO fee_payments (member_id, payment_date, amount, note) VALUES (?, ?, ?, ?)'
    ).bind(id, payment_date, amount, note || '').run()
    
    // 회원의 회비 납부 상태 업데이트
    await c.env.DB.prepare(
      'UPDATE members SET fee_paid = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(id).run()
    
    return c.json({ message: '회비 납부가 등록되었습니다' })
  } catch (error) {
    return c.json({ error: '회비 등록 중 오류가 발생했습니다' }, 500)
  }
})

export default app
