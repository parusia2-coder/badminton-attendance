import { Hono } from 'hono'

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

// 간단한 세션 관리 (실제 프로덕션에서는 JWT나 쿠키 세션 사용)
const sessions = new Map<string, { username: string, name: string }>()

// 로그인
app.post('/login', async (c) => {
  try {
    const { username, password } = await c.req.json()
    
    const admin = await c.env.DB.prepare(
      'SELECT * FROM admins WHERE username = ?'
    ).bind(username).first()
    
    if (!admin) {
      return c.json({ error: '사용자를 찾을 수 없습니다' }, 401)
    }
    
    // 실제 프로덕션에서는 bcrypt로 해시 비교
    // 여기서는 간단히 평문 비교 (데모용)
    if (password !== 'admin1234') {
      return c.json({ error: '비밀번호가 올바르지 않습니다' }, 401)
    }
    
    // 세션 생성
    const sessionId = crypto.randomUUID()
    sessions.set(sessionId, { 
      username: admin.username as string, 
      name: admin.name as string 
    })
    
    return c.json({ 
      sessionId, 
      username: admin.username, 
      name: admin.name 
    })
  } catch (error) {
    return c.json({ error: '로그인 처리 중 오류가 발생했습니다' }, 500)
  }
})

// 로그아웃
app.post('/logout', async (c) => {
  try {
    const { sessionId } = await c.req.json()
    sessions.delete(sessionId)
    return c.json({ message: '로그아웃되었습니다' })
  } catch (error) {
    return c.json({ error: '로그아웃 처리 중 오류가 발생했습니다' }, 500)
  }
})

// 세션 확인
app.post('/verify', async (c) => {
  try {
    const { sessionId } = await c.req.json()
    const session = sessions.get(sessionId)
    
    if (!session) {
      return c.json({ valid: false }, 401)
    }
    
    return c.json({ valid: true, ...session })
  } catch (error) {
    return c.json({ error: '세션 확인 중 오류가 발생했습니다' }, 500)
  }
})

export default app
