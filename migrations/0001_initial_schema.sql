-- 관리자 테이블
CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 회원 테이블
CREATE TABLE IF NOT EXISTS members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  gender TEXT NOT NULL CHECK(gender IN ('남', '여')),
  birth_year INTEGER NOT NULL,
  club TEXT NOT NULL,
  grade TEXT NOT NULL CHECK(grade IN ('S', 'A', 'B', 'C', 'D')),
  phone TEXT NOT NULL,
  fee_paid INTEGER DEFAULT 0 CHECK(fee_paid IN (0, 1)),
  car_registered INTEGER DEFAULT 0 CHECK(car_registered IN (0, 1)),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 회비 납부 내역 테이블
CREATE TABLE IF NOT EXISTS fee_payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  member_id INTEGER NOT NULL,
  payment_date DATE NOT NULL,
  amount INTEGER NOT NULL,
  note TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
);

-- 일정 테이블
CREATE TABLE IF NOT EXISTS schedules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  schedule_type TEXT NOT NULL CHECK(schedule_type IN ('정기모임', '특별모임', '기타')),
  schedule_date DATE NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 출석 테이블
CREATE TABLE IF NOT EXISTS attendances (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  schedule_id INTEGER NOT NULL,
  member_id INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT '출석' CHECK(status IN ('출석', '결석')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (schedule_id) REFERENCES schedules(id) ON DELETE CASCADE,
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
  UNIQUE(schedule_id, member_id)
);

-- 재고 테이블
CREATE TABLE IF NOT EXISTS inventory (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  item_name TEXT NOT NULL UNIQUE,
  quantity INTEGER NOT NULL DEFAULT 0,
  unit TEXT NOT NULL,
  min_quantity INTEGER DEFAULT 10,
  note TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 재고 입출고 내역 테이블
CREATE TABLE IF NOT EXISTS inventory_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  inventory_id INTEGER NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('입고', '출고')),
  quantity INTEGER NOT NULL,
  note TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (inventory_id) REFERENCES inventory(id) ON DELETE CASCADE
);

-- 게시판 테이블
CREATE TABLE IF NOT EXISTS boards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 게시글 테이블
CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  board_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  is_notice INTEGER DEFAULT 0 CHECK(is_notice IN (0, 1)),
  view_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_members_name ON members(name);
CREATE INDEX IF NOT EXISTS idx_members_club ON members(club);
CREATE INDEX IF NOT EXISTS idx_members_grade ON members(grade);
CREATE INDEX IF NOT EXISTS idx_members_fee_paid ON members(fee_paid);
CREATE INDEX IF NOT EXISTS idx_fee_payments_member_id ON fee_payments(member_id);
CREATE INDEX IF NOT EXISTS idx_fee_payments_date ON fee_payments(payment_date);
CREATE INDEX IF NOT EXISTS idx_schedules_date ON schedules(schedule_date);
CREATE INDEX IF NOT EXISTS idx_schedules_type ON schedules(schedule_type);
CREATE INDEX IF NOT EXISTS idx_attendances_schedule_id ON attendances(schedule_id);
CREATE INDEX IF NOT EXISTS idx_attendances_member_id ON attendances(member_id);
CREATE INDEX IF NOT EXISTS idx_inventory_logs_inventory_id ON inventory_logs(inventory_id);
CREATE INDEX IF NOT EXISTS idx_posts_board_id ON posts(board_id);
CREATE INDEX IF NOT EXISTS idx_posts_is_notice ON posts(is_notice);
