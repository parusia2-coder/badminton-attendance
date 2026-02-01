-- 재고 테이블에 평균 단가 및 총 금액 컬럼 추가
ALTER TABLE inventory ADD COLUMN avg_unit_price INTEGER DEFAULT 0;
ALTER TABLE inventory ADD COLUMN total_value INTEGER DEFAULT 0;

-- 기존 재고의 평균 단가 계산 (입고 내역 기반)
UPDATE inventory 
SET avg_unit_price = (
  SELECT CAST(SUM(il.unit_price * il.quantity) AS REAL) / NULLIF(SUM(il.quantity), 0)
  FROM inventory_logs il
  WHERE il.inventory_id = inventory.id 
    AND il.type = '입고'
    AND il.unit_price > 0
),
total_value = quantity * avg_unit_price
WHERE id IN (
  SELECT DISTINCT inventory_id 
  FROM inventory_logs 
  WHERE type = '입고' AND unit_price > 0
);
