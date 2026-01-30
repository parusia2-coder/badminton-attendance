-- 기본 관리자 계정 생성 (비밀번호: admin1234)
INSERT INTO admins (username, password, name) VALUES 
  ('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '관리자');

-- 기본 게시판 생성
INSERT INTO boards (name, description) VALUES 
  ('공지사항', '장년부 공지사항 게시판'),
  ('자유게시판', '자유롭게 소통하는 게시판'),
  ('사진첩', '모임 사진 공유');

-- 기본 재고 항목 생성
INSERT INTO inventory (item_name, quantity, unit, min_quantity) VALUES 
  ('셔틀콕', 50, '개', 20),
  ('양말', 30, '켤레', 10),
  ('수건', 25, '장', 10),
  ('음료수', 40, '병', 15),
  ('종이컵', 200, '개', 50),
  ('커피', 20, '봉', 5),
  ('명찰여분', 15, '개', 5),
  ('포스트잇', 10, '권', 3);
