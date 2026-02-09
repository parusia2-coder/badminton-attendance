-- Hero Images Table
CREATE TABLE IF NOT EXISTS hero_images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  image_url TEXT NOT NULL,
  title TEXT,
  subtitle TEXT,
  display_order INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 기본 이미지 데이터 삽입
INSERT INTO hero_images (image_url, title, subtitle, display_order, is_active) VALUES
  ('https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=1920&q=80', '건강한 노년, 활기찬 황금기', '안양시배드민턴협회 장년부와 함께하세요', 1, 1),
  ('https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=1920&q=80', '열정으로 하나되는 우리', '500명의 회원이 함께하는 배드민턴 가족', 2, 1),
  ('https://images.unsplash.com/photo-1616426037677-cc6de6891952?w=1920&q=80', '20년 전통, 100% 열정', '안양시 최고의 배드민턴 공동체', 3, 1);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_hero_images_active ON hero_images(is_active);
CREATE INDEX IF NOT EXISTS idx_hero_images_order ON hero_images(display_order);
