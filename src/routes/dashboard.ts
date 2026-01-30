import { Hono } from 'hono'

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

// 대시보드 통합 데이터
app.get('/', async (c) => {
  try {
    // 회원 통계
    const totalMembers = await c.env.DB.prepare('SELECT COUNT(*) as count FROM members').first()
    const feePaidMembers = await c.env.DB.prepare('SELECT COUNT(*) as count FROM members WHERE fee_paid = 1').first()
    const feeUnpaidMembers = await c.env.DB.prepare('SELECT COUNT(*) as count FROM members WHERE fee_paid = 0').first()
    
    // 급수별 회원 분포
    const { results: gradeDistribution } = await c.env.DB.prepare(
      'SELECT grade, COUNT(*) as count FROM members GROUP BY grade ORDER BY grade'
    ).all()
    
    // 클럽별 회원 분포
    const { results: clubDistribution } = await c.env.DB.prepare(
      'SELECT club, COUNT(*) as count FROM members GROUP BY club ORDER BY count DESC LIMIT 10'
    ).all()
    
    // 일정 통계
    const totalSchedules = await c.env.DB.prepare('SELECT COUNT(*) as count FROM schedules').first()
    const upcomingSchedules = await c.env.DB.prepare(
      'SELECT COUNT(*) as count FROM schedules WHERE schedule_date >= DATE("now")'
    ).first()
    
    // 최근 일정 3개
    const { results: recentSchedules } = await c.env.DB.prepare(
      'SELECT * FROM schedules WHERE schedule_date >= DATE("now") ORDER BY schedule_date ASC LIMIT 3'
    ).all()
    
    // 출석 통계
    const totalAttendances = await c.env.DB.prepare(
      'SELECT COUNT(*) as count FROM attendances WHERE status = "출석"'
    ).first()
    const totalAttendanceRecords = await c.env.DB.prepare(
      'SELECT COUNT(*) as count FROM attendances'
    ).first()
    
    const attendanceRate = totalAttendanceRecords?.count
      ? ((totalAttendances?.count || 0) / (totalAttendanceRecords.count as number) * 100).toFixed(1)
      : '0.0'
    
    // 최다 출석 회원 TOP 5
    const { results: topAttenders } = await c.env.DB.prepare(`
      SELECT 
        m.name, 
        m.club,
        COUNT(CASE WHEN a.status = '출석' THEN 1 END) as attendance_count
      FROM members m
      LEFT JOIN attendances a ON m.id = a.member_id
      GROUP BY m.id, m.name, m.club
      ORDER BY attendance_count DESC
      LIMIT 5
    `).all()
    
    // 재고 통계
    const totalInventory = await c.env.DB.prepare('SELECT COUNT(*) as count FROM inventory').first()
    const { results: lowStockItems } = await c.env.DB.prepare(
      'SELECT * FROM inventory WHERE quantity <= min_quantity ORDER BY quantity ASC'
    ).all()
    
    // 최근 게시글 5개
    const { results: recentPosts } = await c.env.DB.prepare(`
      SELECT p.*, b.name as board_name
      FROM posts p
      JOIN boards b ON p.board_id = b.id
      ORDER BY p.created_at DESC
      LIMIT 5
    `).all()
    
    // 월별 출석 추이 (최근 6개월)
    const { results: monthlyAttendance } = await c.env.DB.prepare(`
      SELECT 
        strftime('%Y-%m', s.schedule_date) as month,
        COUNT(CASE WHEN a.status = '출석' THEN 1 END) as attendance_count,
        COUNT(*) as total_count
      FROM schedules s
      LEFT JOIN attendances a ON s.id = a.schedule_id
      WHERE s.schedule_date >= DATE('now', '-6 months')
      GROUP BY month
      ORDER BY month ASC
    `).all()
    
    return c.json({
      members: {
        total: totalMembers?.count || 0,
        feePaid: feePaidMembers?.count || 0,
        feeUnpaid: feeUnpaidMembers?.count || 0,
        gradeDistribution,
        clubDistribution
      },
      schedules: {
        total: totalSchedules?.count || 0,
        upcoming: upcomingSchedules?.count || 0,
        recent: recentSchedules
      },
      attendance: {
        total: totalAttendances?.count || 0,
        rate: attendanceRate,
        topAttenders,
        monthlyTrend: monthlyAttendance
      },
      inventory: {
        total: totalInventory?.count || 0,
        lowStock: lowStockItems.length,
        lowStockItems
      },
      recentPosts
    })
  } catch (error) {
    console.error(error)
    return c.json({ error: '대시보드 데이터 조회 중 오류가 발생했습니다' }, 500)
  }
})

export default app
