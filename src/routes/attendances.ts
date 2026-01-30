import { Hono } from 'hono'

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

// 특정 일정의 출석 현황
app.get('/schedule/:scheduleId', async (c) => {
  try {
    const scheduleId = c.req.param('scheduleId')
    
    const { results } = await c.env.DB.prepare(`
      SELECT a.*, m.name, m.phone, m.club, m.grade
      FROM attendances a
      JOIN members m ON a.member_id = m.id
      WHERE a.schedule_id = ?
      ORDER BY a.status DESC, m.name ASC
    `).bind(scheduleId).all()
    
    return c.json({ attendances: results })
  } catch (error) {
    return c.json({ error: '출석 현황 조회 중 오류가 발생했습니다' }, 500)
  }
})

// 특정 회원의 출석 현황
app.get('/member/:memberId', async (c) => {
  try {
    const memberId = c.req.param('memberId')
    
    const { results } = await c.env.DB.prepare(`
      SELECT a.*, s.title, s.schedule_date, s.schedule_type
      FROM attendances a
      JOIN schedules s ON a.schedule_id = s.id
      WHERE a.member_id = ?
      ORDER BY s.schedule_date DESC
    `).bind(memberId).all()
    
    return c.json({ attendances: results })
  } catch (error) {
    return c.json({ error: '회원 출석 현황 조회 중 오류가 발생했습니다' }, 500)
  }
})

// 출석 체크 (토글)
app.post('/check', async (c) => {
  try {
    const { schedule_id, member_id, status } = await c.req.json()
    
    // 이미 출석 데이터가 있는지 확인
    const existing = await c.env.DB.prepare(
      'SELECT * FROM attendances WHERE schedule_id = ? AND member_id = ?'
    ).bind(schedule_id, member_id).first()
    
    if (existing) {
      // 업데이트
      await c.env.DB.prepare(
        'UPDATE attendances SET status = ? WHERE schedule_id = ? AND member_id = ?'
      ).bind(status, schedule_id, member_id).run()
    } else {
      // 새로 등록
      await c.env.DB.prepare(
        'INSERT INTO attendances (schedule_id, member_id, status) VALUES (?, ?, ?)'
      ).bind(schedule_id, member_id, status).run()
    }
    
    return c.json({ message: '출석이 체크되었습니다' })
  } catch (error) {
    return c.json({ error: '출석 체크 중 오류가 발생했습니다' }, 500)
  }
})

// 일괄 출석 체크 (여러 회원)
app.post('/check-bulk', async (c) => {
  try {
    const { schedule_id, member_ids } = await c.req.json()
    
    for (const member_id of member_ids) {
      const existing = await c.env.DB.prepare(
        'SELECT * FROM attendances WHERE schedule_id = ? AND member_id = ?'
      ).bind(schedule_id, member_id).first()
      
      if (!existing) {
        await c.env.DB.prepare(
          'INSERT INTO attendances (schedule_id, member_id, status) VALUES (?, ?, ?)'
        ).bind(schedule_id, member_id, '출석').run()
      }
    }
    
    return c.json({ message: '일괄 출석 체크가 완료되었습니다' })
  } catch (error) {
    return c.json({ error: '일괄 출석 체크 중 오류가 발생했습니다' }, 500)
  }
})

// 출석 통계 (전체)
app.get('/stats/overall', async (c) => {
  try {
    // 전체 출석률
    const totalAttendances = await c.env.DB.prepare(
      'SELECT COUNT(*) as count FROM attendances WHERE status = "출석"'
    ).first()
    
    const totalRecords = await c.env.DB.prepare(
      'SELECT COUNT(*) as count FROM attendances'
    ).first()
    
    // 회원별 출석 순위
    const { results: memberRanking } = await c.env.DB.prepare(`
      SELECT 
        m.id,
        m.name, 
        m.club,
        m.grade,
        COUNT(CASE WHEN a.status = '출석' THEN 1 END) as attendance_count,
        COUNT(*) as total_count,
        ROUND(COUNT(CASE WHEN a.status = '출석' THEN 1 END) * 100.0 / COUNT(*), 1) as attendance_rate
      FROM members m
      LEFT JOIN attendances a ON m.id = a.member_id
      GROUP BY m.id, m.name, m.club, m.grade
      ORDER BY attendance_count DESC, attendance_rate DESC
      LIMIT 20
    `).all()
    
    // 일정별 출석률
    const { results: scheduleStats } = await c.env.DB.prepare(`
      SELECT 
        s.id,
        s.title,
        s.schedule_date,
        s.schedule_type,
        COUNT(CASE WHEN a.status = '출석' THEN 1 END) as attendance_count,
        COUNT(*) as total_count
      FROM schedules s
      LEFT JOIN attendances a ON s.id = a.schedule_id
      GROUP BY s.id, s.title, s.schedule_date, s.schedule_type
      ORDER BY s.schedule_date DESC
    `).all()
    
    return c.json({
      overall: {
        totalAttendances: totalAttendances?.count || 0,
        totalRecords: totalRecords?.count || 0,
        attendanceRate: totalRecords?.count 
          ? ((totalAttendances?.count || 0) / (totalRecords?.count as number) * 100).toFixed(1)
          : 0
      },
      memberRanking,
      scheduleStats
    })
  } catch (error) {
    return c.json({ error: '출석 통계 조회 중 오류가 발생했습니다' }, 500)
  }
})

// 연도별 출석 통계
app.get('/stats/yearly/:year', async (c) => {
  try {
    const year = c.req.param('year')
    
    const { results } = await c.env.DB.prepare(`
      SELECT 
        m.id,
        m.name, 
        m.club,
        COUNT(CASE WHEN a.status = '출석' THEN 1 END) as attendance_count
      FROM members m
      LEFT JOIN attendances a ON m.id = a.member_id
      LEFT JOIN schedules s ON a.schedule_id = s.id
      WHERE strftime('%Y', s.schedule_date) = ?
      GROUP BY m.id, m.name, m.club
      ORDER BY attendance_count DESC
    `).bind(year).all()
    
    return c.json({ yearlyStats: results })
  } catch (error) {
    return c.json({ error: '연도별 통계 조회 중 오류가 발생했습니다' }, 500)
  }
})

// 전체 출석 데이터 삭제 (초기화)
app.delete('/all', async (c) => {
  try {
    await c.env.DB.prepare('DELETE FROM attendances').run()
    return c.json({ message: '모든 출석 데이터가 삭제되었습니다' })
  } catch (error) {
    return c.json({ error: '출석 데이터 삭제 중 오류가 발생했습니다' }, 500)
  }
})

export default app
