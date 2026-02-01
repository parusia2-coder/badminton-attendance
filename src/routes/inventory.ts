import { Hono } from 'hono'

type Bindings = {
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>()

// 전체 재고 조회
app.get('/', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(
      'SELECT * FROM inventory ORDER BY item_name ASC'
    ).all()
    
    return c.json({ inventory: results })
  } catch (error) {
    return c.json({ error: '재고 조회 중 오류가 발생했습니다' }, 500)
  }
})

// 재고 상세 조회
app.get('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const item = await c.env.DB.prepare(
      'SELECT * FROM inventory WHERE id = ?'
    ).bind(id).first()
    
    if (!item) {
      return c.json({ error: '재고를 찾을 수 없습니다' }, 404)
    }
    
    return c.json({ item })
  } catch (error) {
    return c.json({ error: '재고 조회 중 오류가 발생했습니다' }, 500)
  }
})

// 재고 입출고 내역 조회
app.get('/:id/logs', async (c) => {
  try {
    const id = c.req.param('id')
    const { results } = await c.env.DB.prepare(
      'SELECT * FROM inventory_logs WHERE inventory_id = ? ORDER BY created_at DESC LIMIT 50'
    ).bind(id).all()
    
    return c.json({ logs: results })
  } catch (error) {
    return c.json({ error: '입출고 내역 조회 중 오류가 발생했습니다' }, 500)
  }
})

// 재고 등록
app.post('/', async (c) => {
  try {
    const { item_name, quantity, unit, min_quantity, note } = await c.req.json()
    
    const result = await c.env.DB.prepare(
      'INSERT INTO inventory (item_name, quantity, unit, min_quantity, note) VALUES (?, ?, ?, ?, ?)'
    ).bind(item_name, quantity, unit, min_quantity || 10, note || '').run()
    
    return c.json({ 
      message: '재고가 등록되었습니다', 
      id: result.meta.last_row_id 
    }, 201)
  } catch (error) {
    return c.json({ error: '재고 등록 중 오류가 발생했습니다' }, 500)
  }
})

// 재고 수정
app.put('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const { item_name, quantity, unit, min_quantity, note } = await c.req.json()
    
    await c.env.DB.prepare(
      'UPDATE inventory SET item_name = ?, quantity = ?, unit = ?, min_quantity = ?, note = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(item_name, quantity, unit, min_quantity, note, id).run()
    
    return c.json({ message: '재고가 수정되었습니다' })
  } catch (error) {
    return c.json({ error: '재고 수정 중 오류가 발생했습니다' }, 500)
  }
})

// 재고 입출고 처리
app.post('/:id/transaction', async (c) => {
  try {
    const id = c.req.param('id')
    const { type, quantity, note, unit_price } = await c.req.json()
    
    // 현재 재고 조회
    const item = await c.env.DB.prepare(
      'SELECT * FROM inventory WHERE id = ?'
    ).bind(id).first()
    
    if (!item) {
      return c.json({ error: '재고를 찾을 수 없습니다' }, 404)
    }
    
    // 재고 수량 계산
    const currentQuantity = item.quantity as number
    const currentAvgPrice = (item.avg_unit_price as number) || 0
    const currentTotalValue = (item.total_value as number) || 0
    let newQuantity = currentQuantity
    let newAvgPrice = currentAvgPrice
    let newTotalValue = currentTotalValue
    
    if (type === '입고') {
      newQuantity = currentQuantity + quantity
      const inputPrice = unit_price || 0
      
      // 가중평균 단가 계산
      if (newQuantity > 0) {
        const totalValue = currentTotalValue + (inputPrice * quantity)
        newAvgPrice = Math.round(totalValue / newQuantity)
        newTotalValue = newAvgPrice * newQuantity
      }
    } else if (type === '출고') {
      newQuantity = currentQuantity - quantity
      if (newQuantity < 0) {
        return c.json({ error: '재고가 부족합니다' }, 400)
      }
      
      // 출고 시 평균 단가 유지, 총 가치만 업데이트
      newTotalValue = newAvgPrice * newQuantity
    }
    
    // 재고 업데이트 (수량, 평균 단가, 총 가치)
    await c.env.DB.prepare(
      'UPDATE inventory SET quantity = ?, avg_unit_price = ?, total_value = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(newQuantity, newAvgPrice, newTotalValue, id).run()
    
    // 입출고 내역 기록 (단가 포함)
    // 출고 시에는 현재 평균 단가를 기록
    const recordPrice = type === '입고' ? (unit_price || 0) : currentAvgPrice
    await c.env.DB.prepare(
      'INSERT INTO inventory_logs (inventory_id, type, quantity, note, unit_price) VALUES (?, ?, ?, ?, ?)'
    ).bind(id, type, quantity, note || '', recordPrice).run()
    
    return c.json({ 
      message: `${type}가 처리되었습니다`,
      newQuantity,
      newAvgPrice,
      newTotalValue
    })
  } catch (error) {
    return c.json({ error: '입출고 처리 중 오류가 발생했습니다' }, 500)
  }
})

// 재고 부족 알림 조회
app.get('/alerts/low-stock', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(
      'SELECT * FROM inventory WHERE quantity <= min_quantity ORDER BY quantity ASC'
    ).all()
    
    return c.json({ lowStockItems: results })
  } catch (error) {
    return c.json({ error: '재고 알림 조회 중 오류가 발생했습니다' }, 500)
  }
})

// 월별 입출고 통계
app.get('/stats/monthly', async (c) => {
  try {
    const year = c.req.query('year') || new Date().getFullYear().toString()
    const month = c.req.query('month') || (new Date().getMonth() + 1).toString().padStart(2, '0')
    
    // 해당 월의 입출고 내역 조회
    const { results: logs } = await c.env.DB.prepare(`
      SELECT 
        il.*,
        i.item_name,
        i.unit
      FROM inventory_logs il
      JOIN inventory i ON il.inventory_id = i.id
      WHERE strftime('%Y-%m', il.created_at) = ?
      ORDER BY il.created_at DESC
    `).bind(`${year}-${month}`).all()
    
    // 통계 계산
    const stats = {
      year: parseInt(year),
      month: parseInt(month),
      totalIn: 0,
      totalOut: 0,
      totalInAmount: 0,
      totalOutAmount: 0,
      transactionCount: logs.length,
      byItem: {} as Record<string, any>,
      recentLogs: logs.slice(0, 20)
    }
    
    logs.forEach((log: any) => {
      const amount = (log.unit_price || 0) * log.quantity
      
      if (log.type === '입고') {
        stats.totalIn += log.quantity
        stats.totalInAmount += amount
      } else if (log.type === '출고') {
        stats.totalOut += log.quantity
        stats.totalOutAmount += amount
      }
      
      // 품목별 통계
      if (!stats.byItem[log.item_name]) {
        stats.byItem[log.item_name] = {
          item_name: log.item_name,
          unit: log.unit,
          totalIn: 0,
          totalOut: 0,
          totalInAmount: 0,
          totalOutAmount: 0,
          count: 0
        }
      }
      
      stats.byItem[log.item_name].count++
      if (log.type === '입고') {
        stats.byItem[log.item_name].totalIn += log.quantity
        stats.byItem[log.item_name].totalInAmount += amount
      } else {
        stats.byItem[log.item_name].totalOut += log.quantity
        stats.byItem[log.item_name].totalOutAmount += amount
      }
    })
    
    // 품목별 통계를 배열로 변환
    stats.byItem = Object.values(stats.byItem)
    
    return c.json(stats)
  } catch (error) {
    console.error('Monthly stats error:', error)
    return c.json({ error: '월별 통계 조회 중 오류가 발생했습니다' }, 500)
  }
})

// 재고 삭제
app.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    await c.env.DB.prepare('DELETE FROM inventory WHERE id = ?').bind(id).run()
    return c.json({ message: '재고가 삭제되었습니다' })
  } catch (error) {
    return c.json({ error: '재고 삭제 중 오류가 발생했습니다' }, 500)
  }
})

// 단가 변동 추이 조회
app.get('/:id/price-trend', async (c) => {
  try {
    const id = c.req.param('id')
    const months = parseInt(c.req.query('months') || '6') // 기본 6개월
    
    // 재고 정보 조회
    const item = await c.env.DB.prepare(
      'SELECT * FROM inventory WHERE id = ?'
    ).bind(id).first()
    
    if (!item) {
      return c.json({ error: '재고를 찾을 수 없습니다' }, 404)
    }
    
    // 최근 N개월 입고 내역 조회 (단가 있는 것만)
    const { results: logs } = await c.env.DB.prepare(`
      SELECT 
        strftime('%Y-%m', created_at) as month,
        AVG(unit_price) as avg_price,
        MIN(unit_price) as min_price,
        MAX(unit_price) as max_price,
        SUM(quantity) as total_quantity,
        COUNT(*) as count
      FROM inventory_logs
      WHERE inventory_id = ? 
        AND type = '입고'
        AND unit_price > 0
        AND created_at >= datetime('now', '-' || ? || ' months')
      GROUP BY strftime('%Y-%m', created_at)
      ORDER BY month ASC
    `).bind(id, months).all()
    
    return c.json({ 
      item: {
        id: item.id,
        item_name: item.item_name,
        unit: item.unit,
        current_avg_price: item.avg_unit_price
      },
      trend: logs 
    })
  } catch (error) {
    console.error('Price trend error:', error)
    return c.json({ error: '단가 추이 조회 중 오류가 발생했습니다' }, 500)
  }
})

export default app
