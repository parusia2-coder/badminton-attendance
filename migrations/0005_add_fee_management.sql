-- 회비 설정 테이블
CREATE TABLE IF NOT EXISTS fee_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  year INTEGER NOT NULL UNIQUE,              -- 회비년도 (2026, 2027 등)
  amount INTEGER NOT NULL,                   -- 연회비 금액
  description TEXT,                          -- 설명
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 기본 회비 설정 (2026년)
INSERT OR IGNORE INTO fee_settings (year, amount, description) 
VALUES (2026, 50000, '2026년 연회비');

-- fee_payments 테이블에 년도 컬럼 추가
ALTER TABLE fee_payments ADD COLUMN year INTEGER DEFAULT 2026;

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_fee_payments_member_id ON fee_payments(member_id);
CREATE INDEX IF NOT EXISTS idx_fee_payments_year ON fee_payments(year);
CREATE INDEX IF NOT EXISTS idx_fee_payments_payment_date ON fee_payments(payment_date DESC);
