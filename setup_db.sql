-- Step 1: 기본 테이블 생성 (관리자, 회원, 일정, 출석)
CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

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

-- Step 2: 회비 관련 테이블
CREATE TABLE IF NOT EXISTS fee_payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  member_id INTEGER NOT NULL,
  payment_date DATE NOT NULL,
  amount INTEGER NOT NULL,
  note TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
);

-- Step 3: 재고 관련 테이블
CREATE TABLE IF NOT EXISTS inventory (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  item_name TEXT NOT NULL UNIQUE,
  quantity INTEGER NOT NULL DEFAULT 0,
  unit TEXT NOT NULL,
  min_quantity INTEGER DEFAULT 10,
  note TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inventory_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  inventory_id INTEGER NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('입고', '출고')),
  quantity INTEGER NOT NULL,
  note TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (inventory_id) REFERENCES inventory(id) ON DELETE CASCADE
);

-- Step 4: 게시판 관련 테이블
CREATE TABLE IF NOT EXISTS boards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

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

-- Step 5: 기타 테이블
CREATE TABLE IF NOT EXISTS attachments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id INTEGER NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS sms_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  recipient_phone TEXT NOT NULL,
  recipient_name TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('pending', 'sent', 'failed')),
  error_message TEXT,
  sent_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS fee_exempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  member_id INTEGER NOT NULL,
  exempt_year INTEGER NOT NULL,
  exempt_month INTEGER NOT NULL,
  reason TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
  UNIQUE(member_id, exempt_year, exempt_month)
);

CREATE TABLE IF NOT EXISTS join_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  birth_year INTEGER NOT NULL,
  gender TEXT NOT NULL CHECK(gender IN ('남', '여')),
  club TEXT NOT NULL,
  grade TEXT NOT NULL CHECK(grade IN ('S', 'A', 'B', 'C', 'D')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
  note TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  processed_at DATETIME
);

CREATE TABLE IF NOT EXISTS hero_images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  image_url TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  link_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1 CHECK(is_active IN (0, 1)),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS popups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content_type TEXT NOT NULL DEFAULT 'html' CHECK(content_type IN ('html', 'image')),
  html_content TEXT,
  image_url TEXT,
  link_url TEXT,
  width INTEGER DEFAULT 400,
  height INTEGER DEFAULT 500,
  position TEXT DEFAULT 'center' CHECK(position IN ('center', 'top', 'bottom')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active INTEGER DEFAULT 1 CHECK(is_active IN (0, 1)),
  display_order INTEGER DEFAULT 0,
  show_close_button INTEGER DEFAULT 1 CHECK(show_close_button IN (0, 1)),
  show_today_hide INTEGER DEFAULT 1 CHECK(show_today_hide IN (0, 1)),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
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

-- 기본 관리자 계정 추가 (비밀번호: admin1234)
INSERT OR IGNORE INTO admins (username, password, name) 
VALUES ('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '관리자');

-- 기본 게시판 생성
INSERT OR IGNORE INTO boards (name, description) VALUES ('공지사항', '협회 공지사항');
INSERT OR IGNORE INTO boards (name, description) VALUES ('자유게시판', '자유로운 의견 교환');
INSERT OR IGNORE INTO boards (name, description) VALUES ('갤러리', '사진 및 동영상 공유');
