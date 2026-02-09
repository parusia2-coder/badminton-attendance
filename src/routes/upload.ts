import { Hono } from 'hono'

type Bindings = {
  DB: D1Database;
  R2: R2Bucket;
  NHN_APP_KEY: string;
  NHN_SECRET_KEY: string;
  NHN_SENDER: string;
}

const app = new Hono<{ Bindings: Bindings }>()

// 파일 업로드 API
app.post('/upload', async (c) => {
  try {
    const { env } = c;
    const formData = await c.req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return c.json({ error: '파일이 없습니다' }, 400);
    }

    // 파일 타입 검증
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return c.json({ error: '지원하지 않는 파일 형식입니다. (JPG, PNG, WEBP, GIF만 가능)' }, 400);
    }

    // 파일 크기 검증 (10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return c.json({ error: '파일 크기는 10MB 이하여야 합니다' }, 400);
    }

    // 고유한 파일명 생성
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const ext = file.name.split('.').pop() || 'jpg';
    const fileName = `hero-images/${timestamp}-${randomStr}.${ext}`;

    // R2에 파일 업로드
    const arrayBuffer = await file.arrayBuffer();
    await env.R2.put(fileName, arrayBuffer, {
      httpMetadata: {
        contentType: file.type,
      },
    });

    // 공개 URL 생성 (R2 public domain 설정 필요)
    // 임시로 상대 경로 반환 (나중에 custom domain으로 변경 가능)
    const publicUrl = `/r2/${fileName}`;

    return c.json({
      success: true,
      url: publicUrl,
      fileName: fileName,
      size: file.size,
      type: file.type
    });

  } catch (error) {
    console.error('파일 업로드 오류:', error);
    return c.json({ error: '파일 업로드 중 오류가 발생했습니다' }, 500);
  }
});

// R2에서 파일 가져오기 (public access)
app.get('/r2/*', async (c) => {
  try {
    const { env } = c;
    const path = c.req.path.replace('/api/r2/', '');
    
    const object = await env.R2.get(path);
    
    if (!object) {
      return c.notFound();
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);
    headers.set('Cache-Control', 'public, max-age=31536000'); // 1년 캐시

    return new Response(object.body, {
      headers,
    });
  } catch (error) {
    console.error('R2 파일 조회 오류:', error);
    return c.notFound();
  }
});

// 파일 삭제 API
app.delete('/upload/:fileName', async (c) => {
  try {
    const { env } = c;
    const fileName = c.req.param('fileName');
    
    await env.R2.delete(fileName);
    
    return c.json({ success: true, message: '파일이 삭제되었습니다' });
  } catch (error) {
    console.error('파일 삭제 오류:', error);
    return c.json({ error: '파일 삭제 중 오류가 발생했습니다' }, 500);
  }
});

export default app
