import { Hono } from 'hono'

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

// 전체 게시판 목록
app.get('/', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(
      'SELECT * FROM boards ORDER BY created_at ASC'
    ).all()
    
    return c.json({ boards: results })
  } catch (error) {
    return c.json({ error: '게시판 조회 중 오류가 발생했습니다' }, 500)
  }
})

// 게시판 생성
app.post('/', async (c) => {
  try {
    const { name, description } = await c.req.json()
    
    const result = await c.env.DB.prepare(
      'INSERT INTO boards (name, description) VALUES (?, ?)'
    ).bind(name, description || '').run()
    
    return c.json({ 
      message: '게시판이 생성되었습니다', 
      id: result.meta.last_row_id 
    }, 201)
  } catch (error) {
    return c.json({ error: '게시판 생성 중 오류가 발생했습니다' }, 500)
  }
})

// 게시판 수정
app.put('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const { name, description } = await c.req.json()
    
    await c.env.DB.prepare(
      'UPDATE boards SET name = ?, description = ? WHERE id = ?'
    ).bind(name, description, id).run()
    
    return c.json({ message: '게시판이 수정되었습니다' })
  } catch (error) {
    return c.json({ error: '게시판 수정 중 오류가 발생했습니다' }, 500)
  }
})

// 게시판 삭제
app.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    await c.env.DB.prepare('DELETE FROM boards WHERE id = ?').bind(id).run()
    return c.json({ message: '게시판이 삭제되었습니다' })
  } catch (error) {
    return c.json({ error: '게시판 삭제 중 오류가 발생했습니다' }, 500)
  }
})

// 특정 게시판의 게시글 목록
app.get('/:boardId/posts', async (c) => {
  try {
    const boardId = c.req.param('boardId')
    const { search, page = '1', limit = '20' } = c.req.query()
    
    let query = 'SELECT * FROM posts WHERE board_id = ?'
    const params: any[] = [boardId]
    
    if (search) {
      query += ' AND (title LIKE ? OR content LIKE ?)'
      params.push(`%${search}%`, `%${search}%`)
    }
    
    query += ' ORDER BY is_notice DESC, created_at DESC'
    
    const offset = (parseInt(page) - 1) * parseInt(limit)
    query += ` LIMIT ${limit} OFFSET ${offset}`
    
    const { results } = await c.env.DB.prepare(query).bind(...params).all()
    
    // 전체 개수 조회
    const countQuery = search 
      ? 'SELECT COUNT(*) as count FROM posts WHERE board_id = ? AND (title LIKE ? OR content LIKE ?)'
      : 'SELECT COUNT(*) as count FROM posts WHERE board_id = ?'
    const countParams = search ? [boardId, `%${search}%`, `%${search}%`] : [boardId]
    const total = await c.env.DB.prepare(countQuery).bind(...countParams).first()
    
    return c.json({ 
      posts: results,
      total: total?.count || 0,
      page: parseInt(page),
      limit: parseInt(limit)
    })
  } catch (error) {
    return c.json({ error: '게시글 조회 중 오류가 발생했습니다' }, 500)
  }
})

// 게시글 상세 조회 (조회수 증가)
app.get('/:boardId/posts/:postId', async (c) => {
  try {
    const postId = c.req.param('postId')
    
    // 조회수 증가
    await c.env.DB.prepare(
      'UPDATE posts SET view_count = view_count + 1 WHERE id = ?'
    ).bind(postId).run()
    
    const post = await c.env.DB.prepare(
      'SELECT * FROM posts WHERE id = ?'
    ).bind(postId).first()
    
    if (!post) {
      return c.json({ error: '게시글을 찾을 수 없습니다' }, 404)
    }
    
    return c.json({ post })
  } catch (error) {
    return c.json({ error: '게시글 조회 중 오류가 발생했습니다' }, 500)
  }
})

// 게시글 작성
app.post('/:boardId/posts', async (c) => {
  try {
    const boardId = c.req.param('boardId')
    const { title, content, author, is_notice } = await c.req.json()
    
    const result = await c.env.DB.prepare(
      'INSERT INTO posts (board_id, title, content, author, is_notice) VALUES (?, ?, ?, ?, ?)'
    ).bind(boardId, title, content, author, is_notice || 0).run()
    
    return c.json({ 
      message: '게시글이 작성되었습니다', 
      id: result.meta.last_row_id 
    }, 201)
  } catch (error) {
    return c.json({ error: '게시글 작성 중 오류가 발생했습니다' }, 500)
  }
})

// 게시글 수정
app.put('/:boardId/posts/:postId', async (c) => {
  try {
    const postId = c.req.param('postId')
    const { title, content, is_notice } = await c.req.json()
    
    await c.env.DB.prepare(
      'UPDATE posts SET title = ?, content = ?, is_notice = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(title, content, is_notice, postId).run()
    
    return c.json({ message: '게시글이 수정되었습니다' })
  } catch (error) {
    return c.json({ error: '게시글 수정 중 오류가 발생했습니다' }, 500)
  }
})

// 게시글 삭제
app.delete('/:boardId/posts/:postId', async (c) => {
  try {
    const postId = c.req.param('postId')
    await c.env.DB.prepare('DELETE FROM posts WHERE id = ?').bind(postId).run()
    return c.json({ message: '게시글이 삭제되었습니다' })
  } catch (error) {
    return c.json({ error: '게시글 삭제 중 오류가 발생했습니다' }, 500)
  }
})

export default app
