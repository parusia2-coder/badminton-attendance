# 📱 문자발송(SMS) 기능 사용 가이드

## 🎯 개요
NHN Cloud SMS API를 연동하여 회원들에게 일괄 문자를 발송할 수 있는 기능입니다.

## 📋 준비사항

### 1. NHN Cloud 계정 생성 및 설정

#### 1단계: NHN Cloud 회원가입
1. [NHN Cloud 콘솔](https://console.nhncloud.com/) 접속
2. 회원가입 진행
3. 조직(Organization) 생성
4. 프로젝트 생성

#### 2단계: SMS 서비스 활성화
1. NHN Cloud 콘솔 로그인
2. 프로젝트 선택
3. **Notification > SMS** 메뉴 클릭
4. **상품 이용** 클릭하여 SMS 서비스 활성화

#### 3단계: 발신번호 등록
1. SMS 서비스 화면에서 **발신번호 관리** 클릭
2. **발신번호 등록** 버튼 클릭
3. 발신번호 입력 (예: 010-1234-5678)
4. 서류 업로드 (사업자등록증 또는 신분증)
5. 승인 대기 (2-3 영업일 소요)

#### 4단계: API 키 발급
1. 프로젝트 설정 아이콘 클릭
2. **API 보안 설정** 메뉴
3. **AppKey** 확인 (상단에 표시됨)
4. **Secret Key** 생성
   - **User Access Key ID** 생성 버튼 클릭
   - 생성된 **Secret Key** 복사 (한 번만 표시됨!)

#### 5단계: 충전
1. **결제 관리** 메뉴
2. **충전** 버튼 클릭
3. 필요한 금액 충전
   - 테스트: 5,000원 (약 550건)
   - 운영: 월 예상 발송량에 따라

---

## 🔧 로컬 개발 환경 설정

### `.dev.vars` 파일 생성
프로젝트 루트에 `.dev.vars` 파일을 생성하고 아래 내용을 입력하세요:

```env
# NHN Cloud SMS 설정
NHN_APP_KEY=your-app-key-here
NHN_SECRET_KEY=your-secret-key-here
NHN_SENDER=01012345678
```

**⚠️ 주의**: `.dev.vars` 파일은 `.gitignore`에 포함되어 있어 Git에 업로드되지 않습니다.

**값 입력 예시**:
```env
NHN_APP_KEY=abcdefgh12345678
NHN_SECRET_KEY=1a2b3c4d5e6f7g8h9i0j
NHN_SENDER=01012345678
```

---

## 🚀 프로덕션 배포 설정

### Cloudflare Pages Secrets 등록

```bash
# 프로젝트 디렉토리에서 실행
cd /home/user/webapp

# AppKey 등록
npx wrangler pages secret put NHN_APP_KEY --project-name badminton-manager
# 입력 프롬프트에서 실제 AppKey 입력

# Secret Key 등록
npx wrangler pages secret put NHN_SECRET_KEY --project-name badminton-manager
# 입력 프롬프트에서 실제 Secret Key 입력

# 발신번호 등록
npx wrangler pages secret put NHN_SENDER --project-name badminton-manager
# 입력 프롬프트에서 발신번호 입력 (예: 01012345678)
```

### Secrets 확인
```bash
npx wrangler pages secret list --project-name badminton-manager
```

---

## 📱 사용 방법

### 1. 회원 선택 문자발송

#### 전체 회원에게 발송
1. **회원관리** 메뉴 클릭
2. 체크박스 선택하지 않고 **문자발송** 버튼 클릭
3. 모든 회원이 수신자로 자동 선택됨

#### 특정 회원에게 발송
1. **회원관리** 메뉴 클릭
2. 발송하고 싶은 회원의 **체크박스 선택**
3. **문자발송** 버튼 클릭

#### 전체 선택
1. 테이블 헤더의 **체크박스** 클릭 (전체 선택/해제)
2. **문자발송** 버튼 클릭

### 2. 문자 내용 작성

#### 템플릿 사용
문자발송 모달에서 **템플릿 선택** 드롭다운에서 선택:
- **정기모임 안내**: 모임 일정 안내 템플릿
- **회비 납부 안내**: 회비 납부 요청 템플릿
- **일정 리마인더**: 다가오는 일정 알림 템플릿
- **공지사항**: 일반 공지사항 템플릿

템플릿을 선택하면 자동으로 내용이 입력되며, 수정 가능합니다.

#### 직접 입력
- 템플릿 선택을 **"직접 입력"**으로 두고
- 문자 내용 입력 (최대 2000자)
- 글자 수가 실시간으로 표시됨

### 3. 발송 전 확인
- **수신자 목록**: 발송 대상 회원 확인
- **발송 건수**: 총 몇 명에게 발송되는지 표시
- **예상 비용**: 건당 약 9원으로 계산된 예상 비용

### 4. 발송
1. **발송** 버튼 클릭
2. 확인 메시지에서 **확인** 클릭
3. 발송 완료 토스트 메시지 확인

---

## 💰 요금 안내

### NHN Cloud SMS 요금 (2024년 기준)
- **SMS (단문)**: 약 8-9원/건
- **LMS (장문)**: 약 25-30원/건 (90바이트 초과 시 자동 LMS)
- **부가세 별도**

### 예상 비용 계산
- 50명 발송: 약 450원
- 100명 발송: 약 900원
- 200명 발송: 약 1,800원

**💡 Tip**: 테스트 발송은 자신의 번호로 먼저 보내보세요!

---

## 🔍 발송 이력 확인

### API 엔드포인트
문자 발송 이력은 데이터베이스에 자동 저장됩니다.

```bash
# 최근 발송 이력 조회
curl http://localhost:3000/api/sms/logs?page=1&limit=50

# 특정 회원의 발송 이력
curl http://localhost:3000/api/sms/logs/member/1

# 발송 통계
curl http://localhost:3000/api/sms/stats
```

### 발송 상태
- **success**: 발송 성공
- **failed**: 발송 실패
- **pending**: 발송 대기 (일반적으로 즉시 처리됨)

---

## ⚠️ 주의사항

### 1. 발신번호 승인 필수
- NHN Cloud에서 발신번호가 승인되지 않으면 문자 발송 불가
- 승인까지 2-3 영업일 소요

### 2. 충전 잔액 확인
- 잔액 부족 시 발송 실패
- 정기적으로 잔액 확인 필요

### 3. 스팸 방지
- 동일 내용 반복 발송 금지
- 수신거부 처리 기능 고려

### 4. 개인정보 보호
- API 키는 절대 공개하지 마세요
- `.dev.vars` 파일은 Git에 업로드하지 마세요 (자동으로 ignore됨)

### 5. 비용 관리
- 발송 전 수신자 수와 예상 비용 확인
- 실수로 전체 발송하지 않도록 주의

---

## 🐛 문제 해결

### "SMS 서비스가 설정되지 않았습니다"
➡️ `.dev.vars` 파일이 제대로 설정되지 않았습니다.
- 파일 위치 확인: `/home/user/webapp/.dev.vars`
- 환경변수 값 확인
- PM2 재시작: `pm2 restart badminton-manager`

### "문자 발송에 실패했습니다"
원인:
1. **발신번호 미승인**: NHN Cloud에서 발신번호 승인 여부 확인
2. **잔액 부족**: NHN Cloud 콘솔에서 잔액 확인
3. **API 키 오류**: AppKey, SecretKey 다시 확인
4. **수신번호 형식 오류**: 휴대폰 번호에 특수문자 제거됨 (자동 처리)

### 로그 확인
```bash
# PM2 로그 확인
pm2 logs badminton-manager --nostream --lines 50

# 브라우저 콘솔 확인 (F12)
```

---

## 📊 데이터베이스 구조

### sms_logs 테이블
```sql
CREATE TABLE sms_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  recipient TEXT NOT NULL,        -- 수신번호
  message TEXT NOT NULL,           -- 발송 내용
  sender TEXT NOT NULL,            -- 발신번호
  status TEXT DEFAULT 'pending',  -- 상태
  error_message TEXT,             -- 오류 메시지
  request_id TEXT,                -- NHN Cloud 요청 ID
  result_code TEXT,               -- NHN Cloud 결과 코드
  sent_at DATETIME,               -- 발송 시각
  member_id INTEGER,              -- 회원 ID
  schedule_id INTEGER             -- 일정 ID
);
```

---

## 🔗 참고 링크

- [NHN Cloud 콘솔](https://console.nhncloud.com/)
- [NHN Cloud SMS API 문서](https://docs.nhncloud.com/ko/Notification/SMS/ko/api-guide/)
- [Cloudflare Pages Secrets 관리](https://developers.cloudflare.com/pages/configuration/secrets/)

---

## 📞 기술 지원
문제가 발생하면:
1. 이 가이드의 문제 해결 섹션 확인
2. PM2 로그 확인
3. NHN Cloud 콘솔에서 발송 상태 확인

---

**작성일**: 2026-01-30  
**버전**: 1.0.0
