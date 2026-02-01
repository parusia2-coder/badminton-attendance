-- 회비 납부 상태에 '면제' 추가
-- SQLite는 CHECK 제약 조건 수정이 어려우므로 새 테이블 생성 후 데이터 이전

-- 1. 임시 테이블 생성
CREATE TABLE members_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  gender TEXT NOT NULL CHECK(gender IN ('남', '여')),
  birth_year INTEGER NOT NULL,
  club TEXT NOT NULL,
  grade TEXT NOT NULL CHECK(grade IN ('S', 'A', 'B', 'C', 'D')),
  phone TEXT NOT NULL,
  fee_paid INTEGER DEFAULT 0 CHECK(fee_paid IN (0, 1, 2)), -- 0: 미납, 1: 납부, 2: 면제
  car_registered INTEGER DEFAULT 0 CHECK(car_registered IN (0, 1)),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. 기존 데이터 복사
INSERT INTO members_new 
SELECT * FROM members;

-- 3. 기존 테이블 삭제
DROP TABLE members;

-- 4. 새 테이블 이름 변경
ALTER TABLE members_new RENAME TO members;

-- 5. 인덱스 재생성
CREATE INDEX IF NOT EXISTS idx_members_club ON members(club);
CREATE INDEX IF NOT EXISTS idx_members_grade ON members(grade);
CREATE INDEX IF NOT EXISTS idx_members_fee_paid ON members(fee_paid);
