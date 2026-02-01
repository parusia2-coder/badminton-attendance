-- 재고 입출고 내역에 단가 컬럼 추가
ALTER TABLE inventory_logs ADD COLUMN unit_price INTEGER DEFAULT 0;

-- 기존 데이터는 단가 0원으로 설정 (이미 DEFAULT 0으로 설정됨)
