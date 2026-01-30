import { Hono } from 'hono'

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

// 전체 일정 조회
app.get('/', async (c) => {
  try {
    const { year, month, type } = c.req.query()
    
    let query = 'SELECT * FROM schedules WHERE 1=1'
    const params: any[] = []
    
    if (year && month) {
      query += ' AND strftime("%Y-%m", schedule_date) = ?'
      params.push(`${year}-${month.padStart(2, '0')}`)
    }
    
    if (type) {
      query += ' AND schedule_type = ?'
      params.push(type)
    }
    
    query += ' ORDER BY schedule_date ASC, start_time ASC'
    
    const { results } = await c.env.DB.prepare(query).bind(...params).all()
    return c.json({ schedules: results })
  } catch (error) {
    return c.json({ error: '일정 조회 중 오류가 발생했습니다' }, 500)
  }
})

// 일정 상세 조회
app.get('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const schedule = await c.env.DB.prepare(
      'SELECT * FROM schedules WHERE id = ?'
    ).bind(id).first()
    
    if (!schedule) {
      return c.json({ error: '일정을 찾을 수 없습니다' }, 404)
    }
    
    return c.json({ schedule })
  } catch (error) {
    return c.json({ error: '일정 조회 중 오류가 발생했습니다' }, 500)
  }
})

// 일정 등록
app.post('/', async (c) => {
  try {
    const { title, schedule_type, schedule_date, start_time, end_time, location, description } = await c.req.json()
    
    const result = await c.env.DB.prepare(
      'INSERT INTO schedules (title, schedule_type, schedule_date, start_time, end_time, location, description) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).bind(title, schedule_type, schedule_date, start_time, end_time, location, description || '').run()
    
    return c.json({ 
      message: '일정이 등록되었습니다', 
      id: result.meta.last_row_id 
    }, 201)
  } catch (error) {
    return c.json({ error: '일정 등록 중 오류가 발생했습니다' }, 500)
  }
})

// 정기모임 일괄 생성 (1주째, 3주째 토요일)
app.post('/generate-regular', async (c) => {
  try {
    const { year, months } = await c.req.json()
    
    if (!year || !Array.isArray(months) || months.length === 0) {
      return c.json({ error: '년도와 월 정보가 필요합니다' }, 400)
    }
    
    let createdCount = 0
    
    for (const month of months) {
      // 1주째 토요일 - 정기모임
      const firstSaturday = getWeekSaturday(year, month, 1)
      if (firstSaturday) {
        await c.env.DB.prepare(
          'INSERT INTO schedules (title, schedule_type, schedule_date, start_time, end_time, location, description) VALUES (?, ?, ?, ?, ?, ?, ?)'
        ).bind(
          `${month}월 정기모임`,
          '정기모임',
          firstSaturday,
          '17:00',
          '20:00',
          '비산노인복지회관 5층',
          '장년부 정기모임'
        ).run()
        createdCount++
      }
      
      // 3주째 토요일 - 특별모임
      const thirdSaturday = getWeekSaturday(year, month, 3)
      if (thirdSaturday) {
        await c.env.DB.prepare(
          'INSERT INTO schedules (title, schedule_type, schedule_date, start_time, end_time, location, description) VALUES (?, ?, ?, ?, ?, ?, ?)'
        ).bind(
          `${month}월 특별모임`,
          '특별모임',
          thirdSaturday,
          '17:00',
          '20:00',
          '비산노인복지회관 5층',
          '장년부 특별모임'
        ).run()
        createdCount++
      }
    }
    
    return c.json({ 
      message: `${createdCount}개의 정기모임이 생성되었습니다`, 
      count: createdCount 
    })
  } catch (error) {
    return c.json({ error: '정기모임 생성 중 오류가 발생했습니다' }, 500)
  }
})

// N주째 토요일 구하기 함수
function getWeekSaturday(year: number, month: number, weekNumber: number): string | null {
  const date = new Date(year, month - 1, 1)
  
  // 해당 월의 첫 번째 토요일 찾기
  const dayOfWeek = date.getDay()
  const daysUntilSaturday = (6 - dayOfWeek + 7) % 7
  date.setDate(1 + daysUntilSaturday)
  
  // N주째 토요일로 이동
  date.setDate(date.getDate() + (weekNumber - 1) * 7)
  
  // 같은 달인지 확인
  if (date.getMonth() !== month - 1) {
    return null
  }
  
  return date.toISOString().split('T')[0]
}

// 일정 수정
app.put('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const { title, schedule_type, schedule_date, start_time, end_time, location, description } = await c.req.json()
    
    await c.env.DB.prepare(
      'UPDATE schedules SET title = ?, schedule_type = ?, schedule_date = ?, start_time = ?, end_time = ?, location = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(title, schedule_type, schedule_date, start_time, end_time, location, description, id).run()
    
    return c.json({ message: '일정이 수정되었습니다' })
  } catch (error) {
    return c.json({ error: '일정 수정 중 오류가 발생했습니다' }, 500)
  }
})

// 일정 삭제
app.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    await c.env.DB.prepare('DELETE FROM schedules WHERE id = ?').bind(id).run()
    return c.json({ message: '일정이 삭제되었습니다' })
  } catch (error) {
    return c.json({ error: '일정 삭제 중 오류가 발생했습니다' }, 500)
  }
})

// 전체 일정 삭제 (초기화)
app.delete('/all', async (c) => {
  try {
    await c.env.DB.prepare('DELETE FROM schedules').run()
    return c.json({ message: '모든 일정이 삭제되었습니다' })
  } catch (error) {
    return c.json({ error: '일정 삭제 중 오류가 발생했습니다' }, 500)
  }
})

export default app
