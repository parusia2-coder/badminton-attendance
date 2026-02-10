import { Hono } from 'hono'

type Bindings = {
  DB: D1Database;
}

const app = new Hono<{ Bindings: Bindings }>()

// 팝업 목록 조회 (관리자용)
app.get('/', async (c) => {
  try {
    const { env } = c;
    const { status } = c.req.query();

    let query = 'SELECT * FROM popups';
    const params: any[] = [];

    if (status === 'active') {
      query += ' WHERE is_active = 1';
    } else if (status === 'inactive') {
      query += ' WHERE is_active = 0';
    }

    query += ' ORDER BY display_order ASC, created_at DESC';

    const result = await env.DB.prepare(query).bind(...params).all();

    return c.json({
      popups: result.results || [],
      total: result.results?.length || 0
    });
  } catch (error) {
    console.error('팝업 목록 조회 오류:', error);
    return c.json({ error: '팝업 목록 조회 실패' }, 500);
  }
});

// 활성 팝업 조회 (랜딩 페이지용)
app.get('/active', async (c) => {
  try {
    const { env } = c;
    const now = new Date().toISOString();

    const result = await env.DB.prepare(`
      SELECT * FROM popups
      WHERE is_active = 1
        AND (start_date IS NULL OR start_date <= ?)
        AND (end_date IS NULL OR end_date >= ?)
      ORDER BY display_order ASC
    `).bind(now, now).all();

    return c.json({
      popups: result.results || []
    });
  } catch (error) {
    console.error('활성 팝업 조회 오류:', error);
    return c.json({ error: '활성 팝업 조회 실패' }, 500);
  }
});

// 팝업 상세 조회
app.get('/:id', async (c) => {
  try {
    const { env } = c;
    const id = c.req.param('id');

    const result = await env.DB.prepare('SELECT * FROM popups WHERE id = ?').bind(id).first();

    if (!result) {
      return c.json({ error: '팝업을 찾을 수 없습니다' }, 404);
    }

    return c.json(result);
  } catch (error) {
    console.error('팝업 조회 오류:', error);
    return c.json({ error: '팝업 조회 실패' }, 500);
  }
});

// 팝업 추가
app.post('/', async (c) => {
  try {
    const { env } = c;
    const body = await c.req.json();

    const {
      title,
      content_type,
      image_url,
      html_content,
      link_url,
      width,
      height,
      position,
      start_date,
      end_date,
      display_order,
      show_close_button,
      show_today_hide
    } = body;

    // 필수 필드 검증
    if (!title || !content_type) {
      return c.json({ error: '제목과 콘텐츠 타입은 필수입니다' }, 400);
    }

    if (content_type === 'image' && !image_url) {
      return c.json({ error: '이미지 URL은 필수입니다' }, 400);
    }

    if (content_type === 'html' && !html_content) {
      return c.json({ error: 'HTML 콘텐츠는 필수입니다' }, 400);
    }

    const result = await env.DB.prepare(`
      INSERT INTO popups (
        title, content_type, image_url, html_content, link_url,
        width, height, position, start_date, end_date,
        display_order, show_close_button, show_today_hide
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      title,
      content_type,
      image_url || null,
      html_content || null,
      link_url || null,
      width || 500,
      height || 600,
      position || 'center',
      start_date || null,
      end_date || null,
      display_order || 1,
      show_close_button !== undefined ? show_close_button : 1,
      show_today_hide !== undefined ? show_today_hide : 1
    ).run();

    return c.json({
      success: true,
      id: result.meta.last_row_id,
      message: '팝업이 추가되었습니다'
    }, 201);
  } catch (error) {
    console.error('팝업 추가 오류:', error);
    return c.json({ error: '팝업 추가 실패' }, 500);
  }
});

// 팝업 수정
app.put('/:id', async (c) => {
  try {
    const { env } = c;
    const id = c.req.param('id');
    const body = await c.req.json();

    const {
      title,
      content_type,
      image_url,
      html_content,
      link_url,
      width,
      height,
      position,
      start_date,
      end_date,
      is_active,
      display_order,
      show_close_button,
      show_today_hide
    } = body;

    await env.DB.prepare(`
      UPDATE popups SET
        title = ?,
        content_type = ?,
        image_url = ?,
        html_content = ?,
        link_url = ?,
        width = ?,
        height = ?,
        position = ?,
        start_date = ?,
        end_date = ?,
        is_active = ?,
        display_order = ?,
        show_close_button = ?,
        show_today_hide = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      title,
      content_type,
      image_url || null,
      html_content || null,
      link_url || null,
      width || 500,
      height || 600,
      position || 'center',
      start_date || null,
      end_date || null,
      is_active !== undefined ? is_active : 1,
      display_order !== undefined ? display_order : 1,
      show_close_button !== undefined ? show_close_button : 1,
      show_today_hide !== undefined ? show_today_hide : 1,
      id
    ).run();

    return c.json({
      success: true,
      message: '팝업이 수정되었습니다'
    });
  } catch (error) {
    console.error('팝업 수정 오류:', error);
    return c.json({ error: '팝업 수정 실패' }, 500);
  }
});

// 팝업 활성화/비활성화 토글
app.patch('/:id/toggle', async (c) => {
  try {
    const { env } = c;
    const id = c.req.param('id');

    await env.DB.prepare(`
      UPDATE popups SET
        is_active = CASE WHEN is_active = 1 THEN 0 ELSE 1 END,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(id).run();

    return c.json({
      success: true,
      message: '팝업 상태가 변경되었습니다'
    });
  } catch (error) {
    console.error('팝업 토글 오류:', error);
    return c.json({ error: '팝업 상태 변경 실패' }, 500);
  }
});

// 팝업 삭제
app.delete('/:id', async (c) => {
  try {
    const { env } = c;
    const id = c.req.param('id');

    await env.DB.prepare('DELETE FROM popups WHERE id = ?').bind(id).run();

    return c.json({
      success: true,
      message: '팝업이 삭제되었습니다'
    });
  } catch (error) {
    console.error('팝업 삭제 오류:', error);
    return c.json({ error: '팝업 삭제 실패' }, 500);
  }
});

export default app
