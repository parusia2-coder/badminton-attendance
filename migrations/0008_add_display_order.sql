-- 재고 테이블에 표시 순서 컬럼 추가
ALTER TABLE inventory ADD COLUMN display_order INTEGER DEFAULT 0;

-- 기존 재고에 순서 번호 자동 할당 (ID 순서대로)
UPDATE inventory 
SET display_order = id * 10
WHERE display_order = 0;
