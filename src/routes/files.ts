import { Hono } from 'hono'

type Bindings = {
  DB: D1Database
  R2: R2Bucket
}

const app = new Hono<{ Bindings: Bindings }>()

// 파일 업로드 (게시글 첨부)
app.post('/upload', async (c) => {
  try {
    const formData = await c.req.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return c.json({ error: '파일이 없습니다' }, 400)
    }
    
    // 파일 크기 제한 (10MB)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      return c.json({ error: '파일 크기는 10MB 이하여야 합니다' }, 400)
    }
    
    // 허용된 파일 타입
    const allowedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf',
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]
    
    if (!allowedTypes.includes(file.type)) {
      return c.json({ error: '지원하지 않는 파일 형식입니다' }, 400)
    }
    
    // R2 키 생성 (고유한 파일명)
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(7)
    const extension = file.name.split('.').pop()
    const r2Key = `uploads/${timestamp}-${randomStr}.${extension}`
    
    // R2에 파일 업로드
    const arrayBuffer = await file.arrayBuffer()
    await c.env.R2.put(r2Key, arrayBuffer, {
      httpMetadata: {
        contentType: file.type
      }
    })
    
    return c.json({
      success: true,
      file: {
        name: file.name,
        size: file.size,
        type: file.type,
        r2Key: r2Key
      }
    })
  } catch (error) {
    console.error('파일 업로드 오류:', error)
    return c.json({ error: '파일 업로드 중 오류가 발생했습니다' }, 500)
  }
})

// 파일 다운로드
app.get('/download/:key', async (c) => {
  try {
    const key = c.req.param('key')
    
    // R2에서 파일 가져오기
    const object = await c.env.R2.get(key)
    
    if (!object) {
      return c.json({ error: '파일을 찾을 수 없습니다' }, 404)
    }
    
    return new Response(object.body, {
      headers: {
        'Content-Type': object.httpMetadata?.contentType || 'application/octet-stream',
        'Content-Disposition': `inline; filename="${key.split('/').pop()}"`
      }
    })
  } catch (error) {
    console.error('파일 다운로드 오류:', error)
    return c.json({ error: '파일 다운로드 중 오류가 발생했습니다' }, 500)
  }
})

// 파일 삭제
app.delete('/:key', async (c) => {
  try {
    const key = c.req.param('key')
    await c.env.R2.delete(key)
    return c.json({ success: true, message: '파일이 삭제되었습니다' })
  } catch (error) {
    console.error('파일 삭제 오류:', error)
    return c.json({ error: '파일 삭제 중 오류가 발생했습니다' }, 500)
  }
})

export default app
