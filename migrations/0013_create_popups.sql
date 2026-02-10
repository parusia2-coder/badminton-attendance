-- 팝업 관리 테이블
CREATE TABLE IF NOT EXISTS popups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content_type TEXT NOT NULL DEFAULT 'image', -- 'image' or 'html'
  image_url TEXT, -- 이미지 팝업의 경우
  html_content TEXT, -- HTML 팝업의 경우
  link_url TEXT, -- 클릭 시 이동할 URL (선택사항)
  width INTEGER DEFAULT 500, -- 팝업 너비 (px)
  height INTEGER DEFAULT 600, -- 팝업 높이 (px)
  position TEXT DEFAULT 'center', -- 'center', 'top', 'bottom'
  start_date DATETIME, -- 표시 시작일
  end_date DATETIME, -- 표시 종료일
  is_active INTEGER DEFAULT 1, -- 활성화 여부
  display_order INTEGER DEFAULT 1, -- 표시 순서
  show_close_button INTEGER DEFAULT 1, -- 닫기 버튼 표시
  show_today_hide INTEGER DEFAULT 1, -- "오늘 하루 보지 않기" 버튼 표시
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_popups_active ON popups(is_active);
CREATE INDEX IF NOT EXISTS idx_popups_dates ON popups(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_popups_order ON popups(display_order);

-- 샘플 데이터 (테스트용)
INSERT INTO popups (title, content_type, image_url, width, height, position, start_date, end_date, display_order) VALUES
  ('신규 회원 모집', 'image', 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=500&h=600&fit=crop', 500, 600, 'center', '2026-02-01', '2026-12-31', 1);
