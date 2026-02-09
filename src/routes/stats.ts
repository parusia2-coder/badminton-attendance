import { Hono } from 'hono'

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

// 공개 통계 API (인증 불필요)
app.get('/public', async (c) => {
  try {
    const { env } = c

    // 전체 회원 수
    const totalMembers = await env.DB.prepare('SELECT COUNT(*) as count FROM members').first()
    
    // 소속 클럽 수 (중복 제거)
    const totalClubs = await env.DB.prepare(
      'SELECT COUNT(DISTINCT club) as count FROM members WHERE club IS NOT NULL AND club != ""'
    ).first()
    
    // 활동 연수 (가장 오래된 회원의 가입일 기준, 최소 20년)
    const oldestMember = await env.DB.prepare(
      'SELECT MIN(created_at) as oldest_date FROM members'
    ).first()
    
    let yearsActive = 20 // 기본값
    if (oldestMember?.oldest_date) {
      const oldestDate = new Date(oldestMember.oldest_date as string)
      const now = new Date()
      const calculatedYears = now.getFullYear() - oldestDate.getFullYear()
      // 최소 20년 보장 (조직 역사)
      yearsActive = Math.max(calculatedYears, 20)
    }

    return c.json({
      totalMembers: totalMembers?.count || 0,
      totalClubs: totalClubs?.count || 0,
      yearsActive: yearsActive
    })
  } catch (error: any) {
    console.error('공개 통계 조회 오류:', error)
    // 에러 시 기본값 반환
    return c.json({
      totalMembers: 500,
      totalClubs: 20,
      yearsActive: 20
    })
  }
})

export default app
