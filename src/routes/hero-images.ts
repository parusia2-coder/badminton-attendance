import { Hono } from 'hono'

type Bindings = {
  DB: D1Database
  R2: R2Bucket
}

const app = new Hono<{ Bindings: Bindings }>()

// 히어로 이미지 목록 조회
app.get('/', async (c) => {
  try {
    const { env } = c
    const { status = 'all' } = c.req.query()

    let query = 'SELECT * FROM hero_images'
    const params: any[] = []

    if (status === 'active') {
      query += ' WHERE is_active = 1'
    } else if (status === 'inactive') {
      query += ' WHERE is_active = 0'
    }

    query += ' ORDER BY display_order ASC, id DESC'

    const result = await env.DB.prepare(query).bind(...params).all()

    return c.json({ 
      images: result.results,
      total: result.results.length 
    })
  } catch (error: any) {
    console.error('히어로 이미지 목록 조회 오류:', error)
    return c.json({ error: '히어로 이미지 목록 조회 실패', message: error.message }, 500)
  }
})

// 히어로 이미지 추가
app.post('/', async (c) => {
  try {
    const { env } = c
    const { image_url, title, subtitle, display_order = 0 } = await c.req.json()

    if (!image_url) {
      return c.json({ error: '이미지 URL은 필수입니다.' }, 400)
    }

    const result = await env.DB.prepare(`
      INSERT INTO hero_images (image_url, title, subtitle, display_order, is_active)
      VALUES (?, ?, ?, ?, 1)
    `).bind(image_url, title || '', subtitle || '', display_order).run()

    return c.json({ 
      id: result.meta.last_row_id,
      message: '히어로 이미지가 추가되었습니다.' 
    })
  } catch (error: any) {
    console.error('히어로 이미지 추가 오류:', error)
    return c.json({ error: '히어로 이미지 추가 실패', message: error.message }, 500)
  }
})

// 히어로 이미지 수정
app.put('/:id', async (c) => {
  try {
    const { env } = c
    const id = c.req.param('id')
    const { image_url, title, subtitle, display_order, is_active } = await c.req.json()

    const updates: string[] = []
    const params: any[] = []

    if (image_url !== undefined) {
      updates.push('image_url = ?')
      params.push(image_url)
    }
    if (title !== undefined) {
      updates.push('title = ?')
      params.push(title)
    }
    if (subtitle !== undefined) {
      updates.push('subtitle = ?')
      params.push(subtitle)
    }
    if (display_order !== undefined) {
      updates.push('display_order = ?')
      params.push(display_order)
    }
    if (is_active !== undefined) {
      updates.push('is_active = ?')
      params.push(is_active)
    }

    if (updates.length === 0) {
      return c.json({ error: '수정할 내용이 없습니다.' }, 400)
    }

    updates.push('updated_at = CURRENT_TIMESTAMP')
    params.push(id)

    await env.DB.prepare(`
      UPDATE hero_images
      SET ${updates.join(', ')}
      WHERE id = ?
    `).bind(...params).run()

    return c.json({ message: '히어로 이미지가 수정되었습니다.' })
  } catch (error: any) {
    console.error('히어로 이미지 수정 오류:', error)
    return c.json({ error: '히어로 이미지 수정 실패', message: error.message }, 500)
  }
})

// 히어로 이미지 삭제
app.delete('/:id', async (c) => {
  try {
    const { env } = c
    const id = c.req.param('id')

    await env.DB.prepare('DELETE FROM hero_images WHERE id = ?').bind(id).run()

    return c.json({ message: '히어로 이미지가 삭제되었습니다.' })
  } catch (error: any) {
    console.error('히어로 이미지 삭제 오류:', error)
    return c.json({ error: '히어로 이미지 삭제 실패', message: error.message }, 500)
  }
})

// 이미지 순서 일괄 업데이트
app.put('/batch/reorder', async (c) => {
  try {
    const { env } = c
    const { orders } = await c.req.json() // [{ id: 1, display_order: 1 }, ...]

    if (!Array.isArray(orders) || orders.length === 0) {
      return c.json({ error: '순서 정보가 필요합니다.' }, 400)
    }

    // 트랜잭션으로 일괄 업데이트
    for (const item of orders) {
      await env.DB.prepare(`
        UPDATE hero_images
        SET display_order = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(item.display_order, item.id).run()
    }

    return c.json({ message: '이미지 순서가 변경되었습니다.' })
  } catch (error: any) {
    console.error('이미지 순서 변경 오류:', error)
    return c.json({ error: '이미지 순서 변경 실패', message: error.message }, 500)
  }
})

export default app
