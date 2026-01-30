-- SMS 발송 이력 테이블
CREATE TABLE IF NOT EXISTS sms_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  recipient TEXT NOT NULL,              -- 수신번호 (010-1234-5678)
  message TEXT NOT NULL,                -- 발송 내용
  sender TEXT NOT NULL,                 -- 발신번호
  status TEXT DEFAULT 'pending',        -- pending/success/failed
  error_message TEXT,                   -- 오류 메시지
  request_id TEXT,                      -- NHN Cloud 요청 ID
  result_code TEXT,                     -- NHN Cloud 결과 코드
  sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  member_id INTEGER,                    -- 연결된 회원 ID (선택)
  schedule_id INTEGER,                  -- 연결된 일정 ID (선택)
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE SET NULL,
  FOREIGN KEY (schedule_id) REFERENCES schedules(id) ON DELETE SET NULL
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_sms_logs_status ON sms_logs(status);
CREATE INDEX IF NOT EXISTS idx_sms_logs_sent_at ON sms_logs(sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_sms_logs_member_id ON sms_logs(member_id);
CREATE INDEX IF NOT EXISTS idx_sms_logs_schedule_id ON sms_logs(schedule_id);
