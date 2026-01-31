# 안양시배드민턴연합회 장년부 회원관리시스템
## 사용자 매뉴얼 및 설치 가이드

**버전**: 1.0.0  
**제작일**: 2026년 1월 31일  
**제작**: AI Developer (Claude)

---

# 목차

1. [시스템 개요](#1-시스템-개요)
2. [프로그램 구조](#2-프로그램-구조)
3. [기능별 사용 설명서](#3-기능별-사용-설명서)
4. [설치 및 배포 가이드](#4-설치-및-배포-가이드)
5. [데이터베이스 구조](#5-데이터베이스-구조)
6. [문제 해결 가이드](#6-문제-해결-가이드)
7. [부록](#7-부록)

---

# 1. 시스템 개요

## 1.1 프로젝트 소개

**안양시배드민턴연합회 장년부 회원관리시스템**은 200명 규모의 배드민턴 동호회를 효율적으로 관리하기 위한 웹 기반 통합 관리 시스템입니다.

### 주요 특징
- ✅ **완전 무료**: 오픈소스 기반으로 별도 라이선스 비용 없음
- ✅ **클라우드 기반**: Cloudflare Pages로 안정적인 서비스 제공
- ✅ **모바일 최적화**: PC, 태블릿, 스마트폰 모두 지원
- ✅ **실시간 동기화**: 여러 관리자가 동시에 접근 가능
- ✅ **데이터 백업**: 자동 백업으로 안전한 데이터 관리

### 기술 스택
- **백엔드**: Hono (TypeScript)
- **데이터베이스**: Cloudflare D1 (SQLite)
- **파일 저장소**: Cloudflare R2
- **프론트엔드**: TailwindCSS, Chart.js
- **배포 플랫폼**: Cloudflare Pages

### 시스템 요구사항
- **웹 브라우저**: Chrome, Edge, Safari, Firefox (최신 버전)
- **인터넷 연결**: 필수 (클라우드 기반)
- **화면 해상도**: 최소 320px (모바일) ~ 권장 1920px (PC)

---

## 1.2 주요 기능 목록

### 7대 핵심 기능

| 번호 | 기능명 | 설명 |
|------|--------|------|
| 1 | 회원관리 | 회원 정보 등록, 수정, 삭제, 엑셀 업로드/다운로드 |
| 2 | 일정관리 | 정기모임 자동 생성, 일정 추가/수정/삭제 |
| 3 | 출석관리 | 일정별 출석 체크, 통계, TOP 20 랭킹 |
| 4 | 회비관리 | 회비 설정, 납부 등록, 미납자 관리 |
| 5 | 재고관리 | 비품 입출고, 재고 부족 알림 |
| 6 | 게시판 | 공지사항, 자유게시판, 파일 첨부 |
| 7 | 문자발송 | SMS 일괄 발송, 템플릿 관리 |

### 부가 기능
- 대시보드 (전체 현황)
- 통계 차트 (급수별 분포, 출석률)
- 관리자 권한 관리
- 데이터 내보내기 (CSV)

---

# 2. 프로그램 구조

## 2.1 시스템 아키텍처

```
┌─────────────────────────────────────────────────────────┐
│                    사용자 (관리자)                        │
│              (PC / 모바일 / 태블릿)                       │
└─────────────────────┬───────────────────────────────────┘
                      │ HTTPS
                      ▼
┌─────────────────────────────────────────────────────────┐
│           Cloudflare Pages (CDN + Edge Network)          │
│  ┌──────────────────────────────────────────────────┐   │
│  │         Hono Web Application (TypeScript)        │   │
│  │  ┌───────────┐  ┌──────────┐  ┌──────────────┐  │   │
│  │  │  인증/세션 │  │ API 라우터 │  │ 미들웨어    │  │   │
│  │  └───────────┘  └──────────┘  └──────────────┘  │   │
│  └──────────────────────┬───────────────────────────┘   │
└─────────────────────────┼───────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
┌───────────────┐  ┌─────────────┐  ┌──────────────┐
│ Cloudflare D1 │  │Cloudflare R2│  │ NHN Cloud SMS│
│  (Database)   │  │(File Storage)│  │ (문자발송)    │
└───────────────┘  └─────────────┘  └──────────────┘
```

## 2.2 디렉토리 구조

```
webapp/
├── src/                          # 백엔드 소스 코드
│   ├── index.tsx                 # 메인 애플리케이션
│   └── routes/                   # API 라우트
│       ├── auth.ts               # 인증 API
│       ├── members.ts            # 회원 관리 API
│       ├── schedules.ts          # 일정 관리 API
│       ├── attendances.ts        # 출석 관리 API
│       ├── fees.ts               # 회비 관리 API
│       ├── inventory.ts          # 재고 관리 API
│       ├── boards.ts             # 게시판 API
│       ├── files.ts              # 파일 업로드 API
│       ├── sms.ts                # 문자발송 API
│       └── dashboard.ts          # 대시보드 API
│
├── public/                       # 정적 파일
│   └── static/
│       ├── app.js                # 프론트엔드 JavaScript
│       ├── style.css             # 커스텀 CSS
│       └── sample_members.csv    # 샘플 CSV 파일
│
├── migrations/                   # 데이터베이스 마이그레이션
│   ├── 0001_initial_schema.sql
│   ├── 0002_add_inventory.sql
│   ├── 0003_add_boards.sql
│   ├── 0004_add_sms_logs.sql
│   └── 0005_add_fees.sql
│
├── docs/                         # 문서
│   ├── MANUAL.md                 # 사용자 매뉴얼 (본 문서)
│   ├── API.md                    # API 문서
│   └── DATABASE.md               # 데이터베이스 스키마
│
├── dist/                         # 빌드 결과물 (자동 생성)
├── .wrangler/                    # 로컬 개발 데이터 (자동 생성)
│
├── wrangler.jsonc                # Cloudflare 설정
├── package.json                  # 의존성 관리
├── tsconfig.json                 # TypeScript 설정
├── ecosystem.config.cjs          # PM2 설정 (개발용)
├── .dev.vars                     # 환경변수 (로컬, Git 제외)
└── README.md                     # 프로젝트 README
```

## 2.3 데이터 흐름

### 일반적인 요청 흐름
```
1. 사용자가 브라우저에서 작업 수행 (예: 회원 등록 버튼 클릭)
   ↓
2. JavaScript (app.js)가 API 호출 (axios)
   ↓
3. Hono 서버가 요청 수신 (src/routes/*.ts)
   ↓
4. 비즈니스 로직 처리
   ↓
5. Cloudflare D1 데이터베이스 조회/수정
   ↓
6. JSON 응답 반환
   ↓
7. 브라우저가 UI 업데이트
```

### 파일 업로드 흐름
```
1. 사용자가 파일 선택
   ↓
2. JavaScript가 파일을 Base64 인코딩
   ↓
3. /api/files/upload로 POST 요청
   ↓
4. Hono 서버가 파일 검증 (크기, 타입)
   ↓
5. Cloudflare R2에 파일 저장
   ↓
6. R2 키 반환 (예: attachments/abc123.jpg)
   ↓
7. 브라우저에서 R2 URL로 파일 접근 가능
```

---

# 3. 기능별 사용 설명서

## 3.1 로그인 및 대시보드

### 로그인 방법

1. **웹 브라우저에서 서비스 URL 접속**
   - 예시: `https://your-app.pages.dev`

2. **로그인 정보 입력**
   - 아이디: `admin`
   - 비밀번호: `admin1234`
   - 🔒 **보안 권장사항**: 최초 로그인 후 비밀번호 변경 필수

3. **로그인 버튼 클릭**
   - 성공 시 대시보드로 자동 이동
   - 실패 시 에러 메시지 표시

### 대시보드 화면 구성

#### 상단 통계 카드 (4개)
1. **전체 회원**
   - 총 회원 수
   - 회비 납부 회원 / 미납 회원

2. **다가오는 일정**
   - 예정된 일정 수
   - 전체 일정 수

3. **출석률**
   - 평균 출석률 (%)
   - 총 출석 건수

4. **재고 부족 알림**
   - 재고 부족 품목 수
   - 빨간색으로 강조 표시

#### 급수별 회원 분포 차트
- 막대 그래프로 S, A, B, C, D 급수별 회원 수 표시
- 마우스 오버 시 정확한 수치 표시

#### 최다 출석 회원 TOP 5
- 이름, 클럽, 출석 횟수
- 시상식 대비용 데이터

#### 최근 일정 3개
- 일정명, 날짜, 시간, 장소
- 클릭 시 출석관리로 이동

#### 재고 부족 알림
- 최소 수량 미만 품목 목록
- 현재 수량 표시

---

## 3.2 회원관리

### 회원 정보 항목
- **이름** (필수)
- **성별** (남/여)
- **출생년도** (예: 1972)
- **클럽** (예: 부림, 인덕원, 범계 등)
- **급수** (S/A/B/C/D)
- **연락처** (예: 010-1234-5678)
- **회비 납부 여부** (O/X)
- **차량 등록 여부** (O/X)

### 3.2.1 회원 등록 (개별)

1. **회원관리 메뉴 클릭**

2. **"회원 등록" 버튼 클릭**

3. **정보 입력**
   ```
   이름: 홍길동
   성별: 남
   출생년도: 1975
   클럽: 부림
   급수: A
   연락처: 010-1234-5678
   회비 납부: 체크
   차량 등록: 체크
   ```

4. **"등록" 버튼 클릭**
   - ✅ 성공 메시지 표시
   - 회원 목록에 자동 추가

### 3.2.2 회원 일괄 업로드

#### 방법 1: 복사-붙여넣기

1. **엑셀 파일 준비**
   ```
   이름    성별  출생년도  클럽    급수  연락처          회비  차량
   홍길동  남    1975     부림    A     010-1234-5678   O     O
   김영희  여    1980     인덕원  S     010-2345-6789   O     X
   ```

2. **엑셀에서 데이터 복사** (Ctrl+C)

3. **"일괄 업로드" 버튼 클릭**

4. **텍스트 영역에 붙여넣기** (Ctrl+V)

5. **"업로드" 버튼 클릭**
   - ✅ 성공한 행 수 표시
   - ❌ 실패한 행 오류 메시지

#### 방법 2: CSV 파일 업로드

1. **CSV 파일 준비** (UTF-8 인코딩)
   ```csv
   이름,성별,출생년도,클럽,급수,연락처,회비,차량
   홍길동,남,1975,부림,A,010-1234-5678,O,O
   김영희,여,1980,인덕원,S,010-2345-6789,O,X
   ```

2. **"CSV 파일 업로드" 버튼 클릭**

3. **파일 선택** 또는 **드래그앤드롭**

4. **자동 업로드**
   - ✅ 파싱 성공 시 즉시 반영
   - ❌ 오류 발생 시 상세 메시지

📥 **샘플 CSV 다운로드**: "샘플 CSV 다운로드" 버튼 클릭

### 3.2.3 회원 수정

1. **회원 목록에서 수정할 회원 찾기**
   - 검색 기능 활용

2. **"수정" 버튼 클릭** (연필 아이콘)

3. **정보 수정**
   - 모든 항목 수정 가능

4. **"저장" 버튼 클릭**
   - ✅ 변경 사항 즉시 반영

### 3.2.4 회원 삭제

#### 개별 삭제
1. **"삭제" 버튼 클릭** (휴지통 아이콘)
2. **확인 팝업에서 "확인"**
   - ⚠️ 관련 출석 기록, 회비 기록도 함께 삭제됨

#### 전체 삭제
1. **"전체 회원 삭제" 버튼 클릭** (위험한 작업)
2. **확인 문구 입력**: "모든 회원을 삭제합니다"
3. **"삭제" 버튼 클릭**
   - ⚠️⚠️⚠️ 되돌릴 수 없음!
   - 모든 회원 데이터 영구 삭제
   - 출석, 회비 기록도 모두 삭제

### 3.2.5 회원 검색 및 필터링

#### 검색
- 이름으로 검색 (부분 일치)
- 실시간 검색 (입력 중 자동 필터링)

#### 필터
1. **클럽 필터**
   - 드롭다운에서 클럽 선택
   - "전체"로 필터 해제

2. **급수 필터**
   - S, A, B, C, D 선택
   - "전체"로 필터 해제

3. **회비 납부 필터**
   - "납부 완료"
   - "미납"
   - "전체"

#### 복합 필터 예시
```
클럽: 부림
급수: A
회비: 미납
→ 부림 클럽의 A급수 중 회비 미납자만 표시
```

### 3.2.6 회원 데이터 내보내기

1. **"엑셀 내보내기" 버튼 클릭**

2. **CSV 파일 자동 다운로드**
   - 파일명: `회원목록_YYYYMMDD_HHMMSS.csv`
   - 예시: `회원목록_20260131_143025.csv`

3. **엑셀에서 열기**
   - UTF-8 인코딩으로 저장됨
   - 엑셀에서 바로 편집 가능

---

## 3.3 일정관리

### 일정 유형
- **정기모임**: 매월 첫째, 셋째 토요일 자동 생성
- **특별모임**: 수동으로 생성하는 일정
- **기타**: 행사, 총회 등

### 3.3.1 정기모임 자동 생성

1. **일정관리 메뉴 클릭**

2. **"정기모임 생성" 버튼 클릭**

3. **설정 입력**
   ```
   년도: 2026
   월 선택: 1월, 2월, 3월... (체크박스)
   ```

4. **"생성" 버튼 클릭**

5. **자동 생성 규칙**
   - **1주째 토요일**: "정기모임 (1월 1주)"
     - 시간: 17:00 - 20:00
     - 장소: 비산노인복지회관 5층
   
   - **3주째 토요일**: "특별모임 (1월 3주)"
     - 시간: 17:00 - 20:00
     - 장소: 비산노인복지회관 5층

6. **결과 확인**
   - 선택한 모든 월의 일정이 자동 생성됨
   - 중복 확인 (이미 있는 일정은 건너뜀)

### 3.3.2 개별 일정 추가

1. **"일정 추가" 버튼 클릭**

2. **정보 입력**
   ```
   일정명: 신년 총회
   날짜: 2026-02-15
   시작 시간: 14:00
   종료 시간: 16:00
   장소: 비산노인복지회관 3층 대강당
   일정 유형: 특별모임
   ```

3. **"추가" 버튼 클릭**

### 3.3.3 일정 수정

1. **일정 카드에서 "수정" 버튼 클릭**

2. **정보 수정**

3. **"저장" 버튼 클릭**

### 3.3.4 일정 삭제

1. **"삭제" 버튼 클릭**

2. **확인**
   - ⚠️ 해당 일정의 출석 기록도 함께 삭제됨

### 3.3.5 월별 일정 조회

1. **월 선택** (드롭다운)
   - 예: 2026년 1월

2. **해당 월의 일정만 표시**
   - 날짜 순 정렬
   - 일정 유형별 색상 구분

---

## 3.4 출석관리

### 3.4.1 출석 체크

1. **출석관리 메뉴 클릭**

2. **좌측에서 일정 선택**
   - 예: "정기모임 (1월 1주) - 2026-01-04"

3. **우측에 회원 목록 표시**
   - 클럽별로 자동 그룹화
   - 접기/펼치기 가능

4. **출석 체크**
   - **출석 버튼** (초록색): 클릭 시 출석 처리
   - **결석 버튼** (회색): 클릭 시 결석 처리
   - **현재 상태 강조**: 선택된 버튼 진하게 표시

5. **실시간 통계 업데이트**
   - 클럽 헤더에 "출석 X명" 표시
   - 출석 시 초록색으로 강조

### 3.4.2 회원 검색

1. **검색창에 이름 입력**
   - 예: "홍길동"

2. **클럽 구분 유지하며 필터링**
   - 일치하는 회원만 표시
   - 클럽 헤더는 유지

3. **검색어 삭제 시 전체 목록 복원**

### 3.4.3 출석 통계 보기

1. **"통계 보기" 버튼 클릭**

2. **TOP 20 랭킹 모달 표시**
   ```
   순위  이름     클럽    출석 횟수
   1     홍길동   부림    15회
   2     김영희   인덕원  14회
   3     이철수   범계    13회
   ...
   ```

3. **활용**
   - 연말 시상식 자료
   - 우수 회원 선정
   - 출석 독려 자료

### 3.4.4 클럽별 그룹화

1. **자동 그룹화**
   - 회원 클럽별로 자동 분류
   - 가나다순 정렬

2. **클럽 헤더 정보**
   ```
   🏸 부림 (10명) 출석 7명
   ```
   - 클럽명
   - 총 회원 수
   - 현재 출석 인원 (초록색 강조)

3. **접기/펼치기**
   - 클럭 헤더 클릭
   - 회원 목록 토글

---

## 3.5 회비관리

### 3.5.1 회비 설정

1. **회비관리 메뉴 클릭**

2. **"회비 설정" 버튼 클릭** (보라색)

3. **설정 입력**
   ```
   회비 년도: 2026
   연회비 금액: 50,000원
   설명: 2026년 연회비 (선택사항)
   ```

4. **"저장" 버튼 클릭**
   - ✅ 설정 저장 완료
   - 이후 납부 등록 시 자동으로 금액 입력됨

### 3.5.2 납부 등록

#### 개별 등록
1. **"납부 등록" 버튼 클릭** (파란색)

2. **회원 선택**
   - 드롭다운에서 회원 선택 (164명)
   - 예: "홍길동 (부림)"

3. **정보 입력**
   ```
   연도: 2026 (자동)
   금액: 50,000원 (자동, 수정 가능)
   납부일: 2026-01-31 (오늘 날짜, 수정 가능)
   메모: 현금 납부 (선택사항)
   ```

4. **"등록" 버튼 클릭**
   - ✅ 납부 기록 저장
   - 회원 정보에 "회비 납부" 자동 체크
   - 납부 내역 탭에 추가

#### 미납자 목록에서 등록
1. **"미납자 목록" 탭 클릭**

2. **미납 회원 목록 확인**
   ```
   이름     성별  클럽    급수  연락처
   김영희   여    인덕원  S     010-2345-6789  [납부 등록]
   ```

3. **"납부 등록" 버튼 클릭**
   - 해당 회원 자동 선택된 모달 열림
   - 금액, 날짜 입력 후 등록

### 3.5.3 납부 내역 조회

1. **"납부 내역" 탭 클릭**

2. **내역 목록**
   ```
   이름     클럽    납부일      금액      메모        액션
   홍길동   부림    2026-01-31  50,000원  현금 납부   [삭제]
   ```

3. **삭제**
   - 휴지통 아이콘 클릭
   - 확인 후 삭제
   - ⚠️ 회원의 "회비 납부" 체크 자동 해제

### 3.5.4 클럽별 현황

1. **"클럽별 현황" 탭 클릭**

2. **클럽별 통계 테이블**
   ```
   클럽      전체  납부  미납  납부율
   부림      30    25    5     83.3%
   인덕원    28    20    8     71.4%
   범계      25    22    3     88.0%
   ```

3. **활용**
   - 클럽별 회비 징수 현황 파악
   - 미납자가 많은 클럽 독려

### 3.5.5 미납자 문자 발송

1. **"미납자 문자발송" 버튼 클릭** (주황색)

2. **확인 팝업**
   ```
   미납자 XX명에게 문자를 발송하시겠습니까?
   예상 비용: 약 XXX원
   ```

3. **"확인" 클릭**
   - NHN Cloud SMS API 호출
   - 미납자 전원에게 문자 발송
   - 발송 결과 토스트 메시지

4. **문자 내용 (기본)**
   ```
   [안양시배드민턴연합회]
   
   2026년도 연회비 50,000원이 미납되었습니다.
   
   입금 계좌: 농협 123-4567-8901
   예금주: 안양시배드민턴연합회
   
   감사합니다.
   ```

---

## 3.6 재고관리

### 재고 품목
- 셔틀콕
- 양말
- 수건
- 음료수
- 종이컵
- 커피
- 명찰여분
- 포스트잇

### 3.6.1 재고 현황 확인

1. **재고관리 메뉴 클릭**

2. **재고 카드 목록**
   ```
   ┌─────────────────┐
   │ 🏸 셔틀콕       │
   │ 현재: 50개      │
   │ 최소: 30개      │
   │ [입고] [출고]   │
   └─────────────────┘
   ```

3. **재고 부족 알림**
   - 현재 수량 < 최소 수량 → 빨간 테두리
   - 대시보드에도 알림 표시

### 3.6.2 입고 처리

1. **재고 카드에서 "입고" 버튼 클릭**

2. **입고 정보 입력**
   ```
   입고 수량: 30
   메모: 2026년 1월 구매 (선택사항)
   ```

3. **"입고" 버튼 클릭**
   - ✅ 재고 증가
   - 입고 내역 기록
   - 카드 실시간 업데이트

### 3.6.3 출고 처리

1. **"출고" 버튼 클릭**

2. **출고 정보 입력**
   ```
   출고 수량: 10
   메모: 1월 1주 정기모임 사용 (선택사항)
   ```

3. **"출고" 버튼 클릭**
   - ✅ 재고 감소
   - 출고 내역 기록

4. **재고 부족 경고**
   - 현재 수량 - 출고 수량 < 0 → 출고 불가
   - "재고가 부족합니다" 메시지

### 3.6.4 입출고 내역 조회

1. **재고 카드 클릭** (카드 전체 영역)

2. **상세 내역 모달**
   ```
   날짜         유형  수량  변경후  메모
   2026-01-31   입고  +30   50     2026년 1월 구매
   2026-01-28   출고  -10   20     1월 1주 정기모임
   2026-01-21   입고  +50   30     초기 재고
   ```

3. **최근 10건 표시**
   - 날짜 역순 정렬
   - 입고(+), 출고(-) 표시

---

## 3.7 게시판

### 기본 게시판
1. **공지사항**: 중요 공지 (공지 고정 기능)
2. **자유게시판**: 회원 간 소통
3. **사진첩**: 모임 사진 공유

### 3.7.1 게시판 관리

#### 게시판 생성
1. **게시판 메뉴 클릭**

2. **"게시판 추가" 버튼 클릭**

3. **정보 입력**
   ```
   게시판명: 회원 소식
   설명: 회원들의 소식을 공유하는 게시판
   ```

4. **"추가" 버튼 클릭**

#### 게시판 수정/삭제
1. **게시판 카드에서 "수정" 또는 "삭제" 버튼**
2. **⚠️ 게시판 삭제 시 모든 게시글도 함께 삭제됨**

### 3.7.2 게시글 작성

1. **게시판 선택 후 "게시글 보기"**

2. **"글쓰기" 버튼 클릭**

3. **정보 입력**
   ```
   제목: 2월 정기모임 안내
   내용: 
   안녕하세요.
   2월 첫째주 정기모임은 2월 1일 토요일에 진행됩니다.
   
   일시: 2026-02-01 (토) 17:00-20:00
   장소: 비산노인복지회관 5층
   
   많은 참석 바랍니다.
   
   공지사항 고정: ☑ (체크)
   ```

4. **파일 첨부** (선택)
   - "파일 선택" 버튼 클릭
   - 이미지, PDF, Word, Excel 선택 (최대 10MB)
   - 여러 파일 첨부 가능

5. **"등록" 버튼 클릭**

### 3.7.3 게시글 조회

1. **게시글 목록**
   ```
   제목                       작성자  조회수  작성일
   [공지] 2월 정기모임 안내   관리자  15      2026-01-31
   신년 인사                  관리자  8       2026-01-25
   ```

2. **공지사항 고정**
   - 상단에 [공지] 태그와 함께 고정
   - 일반 게시글과 구분

3. **게시글 클릭**
   - 상세 내용 표시
   - 조회수 자동 증가
   - 첨부파일 목록 표시

### 3.7.4 첨부파일 다운로드

1. **게시글 하단 첨부파일 목록**
   ```
   📎 첨부파일:
   - 정기모임_안내문.pdf (1.2MB) [다운로드]
   - 장소_약도.jpg (450KB) [다운로드]
   ```

2. **"다운로드" 버튼 클릭**
   - 원본 파일명으로 다운로드
   - Cloudflare R2에서 직접 다운로드

3. **이미지 미리보기**
   - 이미지 파일은 게시글 내에 미리보기 표시
   - 클릭 시 원본 크기로 보기

### 3.7.5 게시글 수정/삭제

1. **본인 게시글에 "수정", "삭제" 버튼 표시**

2. **수정**
   - 제목, 내용 수정
   - 첨부파일 추가/삭제
   - "저장" 버튼 클릭

3. **삭제**
   - "삭제" 버튼 클릭
   - 확인
   - ⚠️ 첨부파일도 함께 삭제됨

---

## 3.8 문자발송 (SMS)

### 사전 준비
- NHN Cloud 가입 및 SMS 서비스 신청
- AppKey, SecretKey, 발신번호 발급
- 환경변수 설정 (로컬: `.dev.vars`, 프로덕션: Cloudflare Secrets)

### 3.8.1 회원 선택 문자발송

1. **회원관리 메뉴 클릭**

2. **원하는 회원 선택**
   - 체크박스 개별 선택
   - 또는 필터 후 선택

3. **"문자발송" 버튼 클릭**

4. **문자 작성**
   ```
   템플릿 선택: 정기모임 안내 / 회비 납부 / 직접 입력
   
   메시지:
   [안양시배드민턴연합회]
   
   2월 첫째주 정기모임을 안내드립니다.
   
   일시: 2026-02-01 (토) 17:00-20:00
   장소: 비산노인복지회관 5층
   
   많은 참석 바랍니다.
   ```

5. **발송 정보 확인**
   ```
   수신자: 15명
   예상 비용: 약 135원 (건당 9원)
   ```

6. **"발송" 버튼 클릭**
   - ✅ 발송 성공 메시지
   - 발송 이력 자동 기록

### 3.8.2 전체 회원 발송

1. **회원관리에서 아무도 선택하지 않음**

2. **"문자발송" 버튼 클릭**

3. **확인 메시지**
   ```
   선택된 회원이 없습니다.
   전체 164명에게 발송하시겠습니까?
   
   예상 비용: 약 1,476원
   ```

4. **"확인" 후 문자 작성 및 발송**

### 3.8.3 필터링 후 발송

1. **필터 적용**
   ```
   클럽: 부림
   급수: A
   회비: 미납
   → 5명 필터링
   ```

2. **"문자발송" 버튼 클릭**
   - 필터링된 5명에게만 발송

3. **예시: 회비 미납자 독려**
   ```
   [안양시배드민턴연합회]
   
   2026년도 연회비 미납 안내드립니다.
   
   납부 금액: 50,000원
   입금 계좌: 농협 123-4567-8901
   예금주: 안양시배드민턴연합회
   
   빠른 시일 내에 납부 부탁드립니다.
   ```

### 3.8.4 템플릿 활용

#### 기본 템플릿 (4종)

1. **정기모임 안내**
   ```
   [안양시배드민턴연합회]
   
   {월} {주차} 정기모임 안내드립니다.
   
   일시: {날짜} (토) 17:00-20:00
   장소: 비산노인복지회관 5층
   
   많은 참석 바랍니다.
   ```

2. **회비 납부 안내**
   ```
   [안양시배드민턴연합회]
   
   {년도}년도 연회비 납부 안내드립니다.
   
   금액: {금액}원
   입금 계좌: 농협 123-4567-8901
   예금주: 안양시배드민턴연합회
   
   감사합니다.
   ```

3. **일정 리마인더**
   ```
   [안양시배드민턴연합회]
   
   내일({날짜}) 모임이 있습니다.
   
   일시: {시간}
   장소: {장소}
   
   잊지 마시고 참석 부탁드립니다.
   ```

4. **공지사항**
   ```
   [안양시배드민턴연합회]
   
   {공지 내용}
   
   문의: 010-1234-5678
   ```

### 3.8.5 발송 이력 조회

1. **문자발송 관리 페이지** (개발 예정)
   - 발송 일시
   - 수신자 목록
   - 메시지 내용
   - 발송 상태 (성공/실패)
   - 실패 사유

2. **통계**
   - 일별 발송 건수
   - 월별 발송 통계
   - 총 발송 비용

---

# 4. 설치 및 배포 가이드

## 4.1 시스템 요구사항

### 개발 환경
- **운영체제**: Windows 10/11, macOS, Linux
- **Node.js**: v20 이상
- **npm**: v9 이상
- **Git**: 버전 관리용

### 프로덕션 환경
- **Cloudflare 계정**: 필수 (무료 플랜 가능)
- **도메인**: 선택사항 (Cloudflare가 기본 도메인 제공)
- **NHN Cloud 계정**: SMS 기능 사용 시 필요

---

## 4.2 로컬 개발 환경 구축

### 4.2.1 소스 코드 다운로드

#### 방법 1: GitHub에서 Clone
```bash
# Git이 설치되어 있어야 함
git clone https://github.com/your-username/badminton-manager.git
cd badminton-manager
```

#### 방법 2: ZIP 파일 다운로드
1. GitHub 페이지에서 "Code" → "Download ZIP"
2. 압축 해제
3. 명령 프롬프트(CMD) 또는 터미널에서 폴더로 이동

### 4.2.2 의존성 설치

```bash
# Node.js 패키지 설치
npm install

# 설치 시간: 약 2-3분
# 완료 후 node_modules/ 폴더 생성됨
```

### 4.2.3 환경변수 설정

`.dev.vars` 파일 생성 (로컬 개발용):
```bash
# .dev.vars 파일 내용
NHN_APP_KEY=your-nhn-app-key
NHN_SECRET_KEY=your-nhn-secret-key
NHN_SENDER=01012345678
```

⚠️ **주의**: `.dev.vars`는 Git에 커밋되지 않음 (`.gitignore`에 포함)

### 4.2.4 데이터베이스 초기화

```bash
# 마이그레이션 실행 (로컬 SQLite 생성)
npm run db:migrate:local

# 결과:
# .wrangler/state/v3/d1/ 폴더에 SQLite 파일 생성
# 테이블 생성 완료
```

### 4.2.5 빌드

```bash
npm run build

# 결과:
# dist/ 폴더에 빌드 파일 생성
# dist/_worker.js (약 66KB)
# dist/static/ (정적 파일)
```

### 4.2.6 개발 서버 실행

#### PM2 사용 (권장)
```bash
# PM2로 서비스 시작
npm run dev:sandbox
# 또는
pm2 start ecosystem.config.cjs

# 서비스 확인
pm2 list

# 로그 확인
pm2 logs badminton-manager --nostream

# 서비스 중지
pm2 stop badminton-manager

# 서비스 재시작
pm2 restart badminton-manager
```

#### 직접 실행
```bash
# Wrangler Pages Dev 실행
npx wrangler pages dev dist --ip 0.0.0.0 --port 3000

# 브라우저에서 접속:
# http://localhost:3000
```

### 4.2.7 초기 계정 로그인

```
URL: http://localhost:3000
아이디: admin
비밀번호: admin1234
```

---

## 4.3 Cloudflare Pages 배포

### 4.3.1 사전 준비

1. **Cloudflare 계정 생성**
   - https://cloudflare.com 가입 (무료)
   - 이메일 인증 완료

2. **Cloudflare API 토큰 발급**
   - 로그인 후 "My Profile" → "API Tokens"
   - "Create Token" 클릭
   - "Edit Cloudflare Workers" 템플릿 선택
   - 권한:
     - Account: Cloudflare Pages (Edit)
     - Zone: Cloudflare Pages (Edit)
   - "Continue to summary" → "Create Token"
   - **토큰 복사 및 안전하게 보관**

3. **환경변수 설정**
   ```bash
   # Linux/macOS
   export CLOUDFLARE_API_TOKEN=your-token-here
   
   # Windows (PowerShell)
   $env:CLOUDFLARE_API_TOKEN="your-token-here"
   
   # Windows (CMD)
   set CLOUDFLARE_API_TOKEN=your-token-here
   ```

### 4.3.2 Cloudflare D1 데이터베이스 생성

```bash
# 프로덕션 데이터베이스 생성
npx wrangler d1 create badminton-db

# 출력 예시:
# ✅ Successfully created DB 'badminton-db'
# 
# [[d1_databases]]
# binding = "DB"
# database_name = "badminton-db"
# database_id = "abc123-def456-ghi789"
```

### 4.3.3 wrangler.jsonc 수정

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "badminton-manager",
  "compatibility_date": "2026-01-31",
  "pages_build_output_dir": "./dist",
  "compatibility_flags": ["nodejs_compat"],
  
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "badminton-db",
      "database_id": "abc123-def456-ghi789"  // ← 위에서 받은 ID로 교체
    }
  ],
  
  "r2_buckets": [
    {
      "binding": "R2",
      "bucket_name": "badminton-files"
    }
  ]
}
```

### 4.3.4 Cloudflare R2 버킷 생성

```bash
# R2 버킷 생성 (파일 저장용)
npx wrangler r2 bucket create badminton-files

# 결과:
# ✅ Successfully created bucket 'badminton-files'
```

### 4.3.5 프로덕션 데이터베이스 마이그레이션

```bash
# 프로덕션 DB에 테이블 생성
npm run db:migrate:prod
# 또는
npx wrangler d1 migrations apply badminton-db

# 결과:
# ✅ 5 migrations applied
```

### 4.3.6 Cloudflare Pages 프로젝트 생성

```bash
# Pages 프로젝트 생성
npx wrangler pages project create badminton-manager \
  --production-branch main \
  --compatibility-date 2026-01-31

# 결과:
# ✅ Successfully created project 'badminton-manager'
```

### 4.3.7 배포

```bash
# 빌드 및 배포
npm run deploy:prod
# 또는
npm run build
npx wrangler pages deploy dist --project-name badminton-manager

# 배포 시간: 약 1-2분

# 결과:
# ✅ Deployment complete!
# URL: https://badminton-manager.pages.dev
# Branch: https://main.badminton-manager.pages.dev
```

### 4.3.8 환경변수 설정 (프로덕션)

```bash
# NHN Cloud SMS 키 설정
npx wrangler pages secret put NHN_APP_KEY --project-name badminton-manager
# 프롬프트에서 키 입력

npx wrangler pages secret put NHN_SECRET_KEY --project-name badminton-manager
# 프롬프트에서 키 입력

npx wrangler pages secret put NHN_SENDER --project-name badminton-manager
# 프롬프트에서 발신번호 입력 (예: 01012345678)

# 설정 확인
npx wrangler pages secret list --project-name badminton-manager
```

### 4.3.9 커스텀 도메인 연결 (선택)

```bash
# 도메인 추가 (예: badminton.your-domain.com)
npx wrangler pages domain add badminton.your-domain.com \
  --project-name badminton-manager

# DNS 설정:
# CNAME 레코드 추가
# 이름: badminton
# 값: badminton-manager.pages.dev

# SSL/TLS 자동 발급 (약 10분)
```

---

## 4.4 업데이트 및 유지보수

### 4.4.1 코드 수정 후 재배포

```bash
# 1. 코드 수정
# 2. 빌드
npm run build

# 3. 배포
npm run deploy:prod

# 자동으로 이전 버전 대체
# 롤백 가능 (Cloudflare Pages 대시보드에서)
```

### 4.4.2 데이터베이스 마이그레이션 추가

```bash
# 새 마이그레이션 파일 생성
# migrations/0006_add_new_feature.sql

# 로컬 적용
npm run db:migrate:local

# 프로덕션 적용
npm run db:migrate:prod
```

### 4.4.3 데이터 백업

#### 로컬 데이터베이스 백업
```bash
# SQLite 파일 복사
cp .wrangler/state/v3/d1/badminton-db.sqlite3 backup_20260131.sqlite3
```

#### 프로덕션 데이터베이스 백업
```bash
# D1 데이터 내보내기
npx wrangler d1 execute badminton-db \
  --command="SELECT * FROM members" \
  --json > backup_members.json

# 또는 전체 테이블 백업 스크립트 작성
```

### 4.4.4 로그 확인

#### 로컬 개발
```bash
# PM2 로그
pm2 logs badminton-manager

# 실시간 로그
pm2 logs badminton-manager --lines 100
```

#### 프로덕션
```bash
# Wrangler 로그 확인
npx wrangler pages deployment tail --project-name badminton-manager

# Cloudflare Dashboard에서 확인
# Pages → badminton-manager → Functions → Logs
```

---

## 4.5 다른 서버/호스팅으로 이전

### 4.5.1 시스템 아키텍처 이해

현재 시스템은 **Cloudflare Workers/Pages** 환경에 최적화되어 있습니다:
- **Cloudflare D1**: SQLite 기반 데이터베이스
- **Cloudflare R2**: S3 호환 객체 스토리지
- **Edge Runtime**: Node.js 일부 API 미지원

### 4.5.2 이전 가능한 호스팅 옵션

#### 옵션 1: Cloudflare Pages (권장)
- ✅ 추가 수정 불필요
- ✅ 무료 플랜 사용 가능
- ✅ 글로벌 CDN 자동 지원
- **절차**: 위의 4.3절 참조

#### 옵션 2: Vercel
- ⚠️ 데이터베이스 변경 필요
  - Cloudflare D1 → Vercel Postgres / Supabase
- ⚠️ 파일 저장소 변경 필요
  - Cloudflare R2 → Vercel Blob Storage / AWS S3
- **난이도**: 중급

#### 옵션 3: Netlify
- ⚠️ 유사한 변경 필요
- Netlify Functions로 API 변환
- **난이도**: 중급

#### 옵션 4: 전통적인 서버 (Node.js)
- ⚠️ 대규모 수정 필요
  - Hono → Express / Fastify
  - Cloudflare D1 → PostgreSQL / MySQL
  - Cloudflare R2 → 로컬 파일 시스템 / AWS S3
- **난이도**: 고급

### 4.5.3 권장 사항

**Cloudflare Pages를 계속 사용하는 것을 강력히 권장합니다:**

1. **비용**
   - 무료 플랜으로도 충분 (월 100,000 요청)
   - D1: 무료 (일 500만 읽기, 10만 쓰기)
   - R2: 무료 (월 10GB 저장, 100만 Class A 작업)

2. **성능**
   - 글로벌 CDN (200+ 도시)
   - Edge 실행으로 빠른 응답

3. **관리 편의성**
   - 서버 관리 불필요
   - 자동 확장
   - SSL 자동 갱신

4. **안정성**
   - 99.99% 가용성
   - DDoS 방어 기본 제공

---

## 4.6 외부 개발자를 위한 인수인계 가이드

### 4.6.1 프로젝트 구조 이해

```
webapp/
├── src/routes/           ← 백엔드 API (TypeScript)
├── public/static/        ← 프론트엔드 (JavaScript, Vanilla)
├── migrations/           ← 데이터베이스 스키마
├── wrangler.jsonc        ← Cloudflare 설정
└── package.json          ← 의존성 및 스크립트
```

### 4.6.2 개발 시작하기

```bash
# 1. 저장소 클론
git clone <repository-url>
cd badminton-manager

# 2. 의존성 설치
npm install

# 3. 로컬 DB 초기화
npm run db:migrate:local

# 4. 빌드
npm run build

# 5. 개발 서버 실행
pm2 start ecosystem.config.cjs

# 6. 브라우저에서 확인
# http://localhost:3000
```

### 4.6.3 주요 파일 설명

| 파일 | 역할 | 주요 코드 |
|------|------|-----------|
| `src/index.tsx` | 메인 애플리케이션 | HTML 렌더링, 라우트 연결 |
| `src/routes/members.ts` | 회원 API | CRUD, 엑셀 업로드 |
| `src/routes/fees.ts` | 회비 API | 설정, 납부, 통계 |
| `public/static/app.js` | 프론트엔드 로직 | UI 렌더링, API 호출 |
| `migrations/*.sql` | DB 스키마 | 테이블 정의, 인덱스 |

### 4.6.4 새 기능 추가 절차

**예: 출석 통계 그래프 추가**

1. **백엔드 API 추가**
   ```typescript
   // src/routes/attendances.ts
   app.get('/stats', async (c) => {
     const { env } = c
     const result = await env.DB.prepare(`
       SELECT date, COUNT(*) as count
       FROM attendances
       WHERE status = 'present'
       GROUP BY date
       ORDER BY date
     `).all()
     
     return c.json({ stats: result.results })
   })
   ```

2. **프론트엔드 함수 추가**
   ```javascript
   // public/static/app.js
   async function loadAttendanceStats() {
     const response = await axios.get(`${API_BASE}/attendances/stats`)
     app.data.attendanceStats = response.data.stats
   }
   ```

3. **UI 렌더링**
   ```javascript
   function renderAttendanceChart() {
     const ctx = document.getElementById('attendanceChart')
     new Chart(ctx, {
       type: 'line',
       data: {
         labels: app.data.attendanceStats.map(s => s.date),
         datasets: [{
           label: '출석 인원',
           data: app.data.attendanceStats.map(s => s.count)
         }]
       }
     })
   }
   ```

4. **빌드 및 테스트**
   ```bash
   npm run build
   pm2 restart badminton-manager
   ```

### 4.6.5 디버깅 팁

#### 브라우저 콘솔
```javascript
// 전역 app 객체 확인
console.log(app)

// 현재 세션 확인
console.log(app.session)

// 데이터 확인
console.log(app.data.members)
```

#### 서버 로그
```bash
# PM2 로그 실시간 확인
pm2 logs badminton-manager

# 특정 에러 필터링
pm2 logs badminton-manager | grep ERROR
```

#### 데이터베이스 직접 쿼리
```bash
# 로컬 DB 쿼리
npx wrangler d1 execute badminton-db --local \
  --command="SELECT * FROM members LIMIT 5"

# 프로덕션 DB 쿼리
npx wrangler d1 execute badminton-db \
  --command="SELECT COUNT(*) FROM members"
```

### 4.6.6 코드 스타일 가이드

#### TypeScript (백엔드)
```typescript
// 함수명: camelCase
async function getMemberList() { }

// 타입 정의: PascalCase
type Member = {
  id: number
  name: string
}

// 상수: UPPER_SNAKE_CASE
const MAX_FILE_SIZE = 10 * 1024 * 1024
```

#### JavaScript (프론트엔드)
```javascript
// 전역 함수: camelCase
function renderMembersPage() { }

// 이벤트 핸들러: attach prefix
function attachMembersHandlers() { }

// 모달: show/close prefix
function showMemberModal() { }
function closeMemberModal() { }
```

### 4.6.7 테스트 체크리스트

배포 전 다음 항목을 반드시 확인:

- [ ] 로그인/로그아웃 정상 작동
- [ ] 회원 CRUD 정상 작동
- [ ] 일정 생성/수정/삭제 정상 작동
- [ ] 출석 체크 정상 작동
- [ ] 회비 납부 등록 정상 작동
- [ ] 재고 입출고 정상 작동
- [ ] 게시판 글쓰기/수정/삭제 정상 작동
- [ ] 파일 업로드/다운로드 정상 작동
- [ ] 문자발송 정상 작동 (테스트 모드)
- [ ] 모바일 화면 정상 표시
- [ ] 브라우저 콘솔 에러 없음

---

# 5. 데이터베이스 구조

## 5.1 ERD (Entity Relationship Diagram)

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   admins    │         │   members    │         │  schedules  │
├─────────────┤         ├──────────────┤         ├─────────────┤
│ id (PK)     │         │ id (PK)      │         │ id (PK)     │
│ username    │         │ name         │         │ title       │
│ password    │         │ gender       │         │ date        │
│ name        │         │ birth_year   │         │ start_time  │
│ created_at  │         │ club         │         │ end_time    │
└─────────────┘         │ grade        │         │ location    │
                        │ phone        │         │ type        │
                        │ fee_paid     │         │ created_at  │
                        │ car_reg...   │         └──────┬──────┘
                        │ created_at   │                │
                        │ updated_at   │                │
                        └──────┬───────┘                │
                               │                        │
                               │                        │
                        ┌──────┴───────────────────────┴───┐
                        │        attendances               │
                        ├──────────────────────────────────┤
                        │ id (PK)                          │
                        │ schedule_id (FK) ────────────────┘
                        │ member_id (FK) ──────────────┐
                        │ status (present/absent)      │
                        │ created_at                   │
                        └──────────────────────────────┘
                                       │
                        ┌──────────────┴────────────┐
                        │     fee_payments          │
                        ├───────────────────────────┤
                        │ id (PK)                   │
                        │ member_id (FK) ───────────┘
                        │ year                      
                        │ amount                    
                        │ payment_date              
                        │ note                      
                        │ created_at                
                        └───────────────────────────┘

┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│  inventory  │         │    boards    │         │    posts    │
├─────────────┤         ├──────────────┤         ├─────────────┤
│ id (PK)     │         │ id (PK)      │         │ id (PK)     │
│ name        │         │ name         │         │ board_id(FK)│
│ quantity    │         │ description  │ ────────┤ title       │
│ min_quantity│         │ created_at   │         │ content     │
│ created_at  │         └──────────────┘         │ author      │
│ updated_at  │                                  │ is_notice   │
└──────┬──────┘                                  │ views       │
       │                                         │ created_at  │
       │                                         │ updated_at  │
       │                                         └──────┬──────┘
       │                                                │
┌──────┴────────┐                            ┌─────────┴──────┐
│inventory_logs │                            │  attachments   │
├───────────────┤                            ├────────────────┤
│ id (PK)       │                            │ id (PK)        │
│ inventory_id  │ ───────────────────────────┤ post_id (FK) ──┘
│ type (in/out) │                            │ filename       │
│ quantity      │                            │ r2_key         │
│ note          │                            │ size           │
│ created_at    │                            │ created_at     │
└───────────────┘                            └────────────────┘

┌─────────────┐         ┌──────────────┐
│  sms_logs   │         │fee_settings  │
├─────────────┤         ├──────────────┤
│ id (PK)     │         │ id (PK)      │
│ recipient   │         │ year         │
│ message     │         │ amount       │
│ status      │         │ description  │
│ error       │         │ created_at   │
│ created_at  │         │ updated_at   │
└─────────────┘         └──────────────┘
```

## 5.2 테이블 상세 설명

### admins (관리자)
| 컬럼명 | 타입 | 제약 | 설명 |
|--------|------|------|------|
| id | INTEGER | PK | 관리자 ID |
| username | TEXT | UNIQUE | 로그인 아이디 |
| password | TEXT | NOT NULL | 비밀번호 (해시) |
| name | TEXT | NOT NULL | 관리자 이름 |
| created_at | DATETIME | DEFAULT NOW | 생성일시 |

**샘플 데이터**:
```sql
INSERT INTO admins (username, password, name) VALUES
('admin', 'admin1234', '시스템 관리자');
```

### members (회원)
| 컬럼명 | 타입 | 제약 | 설명 |
|--------|------|------|------|
| id | INTEGER | PK | 회원 ID |
| name | TEXT | NOT NULL | 이름 |
| gender | TEXT | NOT NULL | 성별 (남/여) |
| birth_year | INTEGER | NOT NULL | 출생년도 |
| club | TEXT | NOT NULL | 소속 클럽 |
| grade | TEXT | NOT NULL | 급수 (S/A/B/C/D) |
| phone | TEXT | NOT NULL | 연락처 |
| fee_paid | INTEGER | DEFAULT 0 | 회비 납부 (0/1) |
| car_registered | INTEGER | DEFAULT 0 | 차량 등록 (0/1) |
| created_at | DATETIME | DEFAULT NOW | 가입일시 |
| updated_at | DATETIME | DEFAULT NOW | 수정일시 |

**인덱스**:
```sql
CREATE INDEX idx_members_club ON members(club);
CREATE INDEX idx_members_grade ON members(grade);
CREATE INDEX idx_members_fee_paid ON members(fee_paid);
```

### schedules (일정)
| 컬럼명 | 타입 | 제약 | 설명 |
|--------|------|------|------|
| id | INTEGER | PK | 일정 ID |
| title | TEXT | NOT NULL | 일정명 |
| date | DATE | NOT NULL | 날짜 (YYYY-MM-DD) |
| start_time | TIME | NOT NULL | 시작 시간 |
| end_time | TIME | NOT NULL | 종료 시간 |
| location | TEXT | NOT NULL | 장소 |
| type | TEXT | NOT NULL | 유형 (정기모임/특별모임/기타) |
| created_at | DATETIME | DEFAULT NOW | 생성일시 |

**인덱스**:
```sql
CREATE INDEX idx_schedules_date ON schedules(date);
CREATE INDEX idx_schedules_type ON schedules(type);
```

### attendances (출석)
| 컬럼명 | 타입 | 제약 | 설명 |
|--------|------|------|------|
| id | INTEGER | PK | 출석 ID |
| schedule_id | INTEGER | FK | 일정 ID |
| member_id | INTEGER | FK | 회원 ID |
| status | TEXT | NOT NULL | 상태 (present/absent) |
| created_at | DATETIME | DEFAULT NOW | 체크일시 |

**제약 조건**:
```sql
UNIQUE(schedule_id, member_id)  -- 한 일정에 한 회원은 1번만 체크
FOREIGN KEY(schedule_id) REFERENCES schedules(id) ON DELETE CASCADE
FOREIGN KEY(member_id) REFERENCES members(id) ON DELETE CASCADE
```

**인덱스**:
```sql
CREATE INDEX idx_attendances_schedule ON attendances(schedule_id);
CREATE INDEX idx_attendances_member ON attendances(member_id);
CREATE INDEX idx_attendances_status ON attendances(status);
```

### fee_payments (회비 납부 내역)
| 컬럼명 | 타입 | 제약 | 설명 |
|--------|------|------|------|
| id | INTEGER | PK | 납부 ID |
| member_id | INTEGER | FK | 회원 ID |
| year | INTEGER | NOT NULL | 납부 년도 |
| amount | INTEGER | NOT NULL | 납부 금액 |
| payment_date | DATE | NOT NULL | 납부일 |
| note | TEXT | NULL | 메모 |
| created_at | DATETIME | DEFAULT NOW | 등록일시 |

**인덱스**:
```sql
CREATE INDEX idx_fee_payments_member ON fee_payments(member_id);
CREATE INDEX idx_fee_payments_year ON fee_payments(year);
```

### fee_settings (회비 설정)
| 컬럼명 | 타입 | 제약 | 설명 |
|--------|------|------|------|
| id | INTEGER | PK | 설정 ID |
| year | INTEGER | UNIQUE | 년도 |
| amount | INTEGER | NOT NULL | 연회비 금액 |
| description | TEXT | NULL | 설명 |
| created_at | DATETIME | DEFAULT NOW | 생성일시 |
| updated_at | DATETIME | DEFAULT NOW | 수정일시 |

### inventory (재고)
| 컬럼명 | 타입 | 제약 | 설명 |
|--------|------|------|------|
| id | INTEGER | PK | 재고 ID |
| name | TEXT | UNIQUE | 품목명 |
| quantity | INTEGER | DEFAULT 0 | 현재 수량 |
| min_quantity | INTEGER | DEFAULT 0 | 최소 수량 |
| created_at | DATETIME | DEFAULT NOW | 생성일시 |
| updated_at | DATETIME | DEFAULT NOW | 수정일시 |

### inventory_logs (입출고 내역)
| 컬럼명 | 타입 | 제약 | 설명 |
|--------|------|------|------|
| id | INTEGER | PK | 로그 ID |
| inventory_id | INTEGER | FK | 재고 ID |
| type | TEXT | NOT NULL | 유형 (in/out) |
| quantity | INTEGER | NOT NULL | 수량 (±) |
| note | TEXT | NULL | 메모 |
| created_at | DATETIME | DEFAULT NOW | 처리일시 |

### boards (게시판)
| 컬럼명 | 타입 | 제약 | 설명 |
|--------|------|------|------|
| id | INTEGER | PK | 게시판 ID |
| name | TEXT | UNIQUE | 게시판명 |
| description | TEXT | NULL | 설명 |
| created_at | DATETIME | DEFAULT NOW | 생성일시 |

### posts (게시글)
| 컬럼명 | 타입 | 제약 | 설명 |
|--------|------|------|------|
| id | INTEGER | PK | 게시글 ID |
| board_id | INTEGER | FK | 게시판 ID |
| title | TEXT | NOT NULL | 제목 |
| content | TEXT | NOT NULL | 내용 |
| author | TEXT | NOT NULL | 작성자 |
| is_notice | INTEGER | DEFAULT 0 | 공지 여부 (0/1) |
| views | INTEGER | DEFAULT 0 | 조회수 |
| created_at | DATETIME | DEFAULT NOW | 작성일시 |
| updated_at | DATETIME | DEFAULT NOW | 수정일시 |

**인덱스**:
```sql
CREATE INDEX idx_posts_board ON posts(board_id);
CREATE INDEX idx_posts_is_notice ON posts(is_notice);
```

### attachments (첨부파일)
| 컬럼명 | 타입 | 제약 | 설명 |
|--------|------|------|------|
| id | INTEGER | PK | 첨부파일 ID |
| post_id | INTEGER | FK | 게시글 ID |
| filename | TEXT | NOT NULL | 원본 파일명 |
| r2_key | TEXT | NOT NULL | R2 저장 키 |
| size | INTEGER | NOT NULL | 파일 크기 (bytes) |
| created_at | DATETIME | DEFAULT NOW | 업로드일시 |

### sms_logs (문자 발송 이력)
| 컬럼명 | 타입 | 제약 | 설명 |
|--------|------|------|------|
| id | INTEGER | PK | 로그 ID |
| recipient | TEXT | NOT NULL | 수신자 번호 |
| message | TEXT | NOT NULL | 메시지 내용 |
| status | TEXT | NOT NULL | 상태 (success/fail) |
| error_message | TEXT | NULL | 오류 메시지 |
| created_at | DATETIME | DEFAULT NOW | 발송일시 |

**인덱스**:
```sql
CREATE INDEX idx_sms_logs_status ON sms_logs(status);
CREATE INDEX idx_sms_logs_created ON sms_logs(created_at);
```

---

## 5.3 데이터 관계

### 1:N 관계
- `schedules` 1 → N `attendances`
  - 한 일정에 여러 출석 기록
  
- `members` 1 → N `attendances`
  - 한 회원이 여러 일정에 출석
  
- `members` 1 → N `fee_payments`
  - 한 회원이 여러 회비 납부 (년도별)
  
- `boards` 1 → N `posts`
  - 한 게시판에 여러 게시글
  
- `posts` 1 → N `attachments`
  - 한 게시글에 여러 첨부파일
  
- `inventory` 1 → N `inventory_logs`
  - 한 재고 품목에 여러 입출고 내역

### N:M 관계 (중간 테이블)
- `members` N:M `schedules` → `attendances`
  - 여러 회원이 여러 일정에 참석

---

## 5.4 쿼리 예시

### 회원 통계
```sql
-- 클럽별 회원 수
SELECT club, COUNT(*) as count
FROM members
GROUP BY club
ORDER BY count DESC;

-- 급수별 분포
SELECT grade, COUNT(*) as count
FROM members
GROUP BY grade
ORDER BY 
  CASE grade
    WHEN 'S' THEN 1
    WHEN 'A' THEN 2
    WHEN 'B' THEN 3
    WHEN 'C' THEN 4
    WHEN 'D' THEN 5
  END;
```

### 출석 통계
```sql
-- TOP 20 출석 랭킹
SELECT 
  m.id,
  m.name,
  m.club,
  COUNT(*) as attendance_count
FROM members m
JOIN attendances a ON m.id = a.member_id
WHERE a.status = 'present'
GROUP BY m.id, m.name, m.club
ORDER BY attendance_count DESC, m.name
LIMIT 20;

-- 일정별 출석률
SELECT 
  s.id,
  s.title,
  s.date,
  COUNT(CASE WHEN a.status = 'present' THEN 1 END) as present_count,
  COUNT(*) as total_count,
  ROUND(COUNT(CASE WHEN a.status = 'present' THEN 1 END) * 100.0 / COUNT(*), 1) as attendance_rate
FROM schedules s
LEFT JOIN attendances a ON s.id = a.schedule_id
GROUP BY s.id, s.title, s.date
ORDER BY s.date DESC;
```

### 회비 통계
```sql
-- 년도별 회비 징수 현황
SELECT 
  year,
  COUNT(*) as payment_count,
  SUM(amount) as total_amount,
  AVG(amount) as avg_amount
FROM fee_payments
GROUP BY year
ORDER BY year DESC;

-- 클럽별 회비 납부 현황
SELECT 
  m.club,
  COUNT(DISTINCT m.id) as total_members,
  COUNT(DISTINCT fp.member_id) as paid_members,
  COUNT(DISTINCT m.id) - COUNT(DISTINCT fp.member_id) as unpaid_members,
  ROUND(COUNT(DISTINCT fp.member_id) * 100.0 / COUNT(DISTINCT m.id), 1) as payment_rate
FROM members m
LEFT JOIN fee_payments fp ON m.id = fp.member_id AND fp.year = 2026
GROUP BY m.club
ORDER BY payment_rate DESC;
```

### 재고 부족 알림
```sql
-- 재고 부족 품목
SELECT 
  id,
  name,
  quantity,
  min_quantity,
  min_quantity - quantity as shortage
FROM inventory
WHERE quantity < min_quantity
ORDER BY shortage DESC;
```

---

# 6. 문제 해결 가이드

## 6.1 일반적인 문제

### 로그인 실패

#### 증상
- "로그인 실패" 메시지
- 아이디/비밀번호 입력해도 진입 불가

#### 원인
1. 잘못된 비밀번호
2. 데이터베이스 초기화 안 됨
3. 세션 저장 오류

#### 해결 방법
```sql
-- 1. 기본 계정 확인
npx wrangler d1 execute badminton-db --local \
  --command="SELECT * FROM admins"

-- 2. 계정이 없으면 생성
npx wrangler d1 execute badminton-db --local \
  --command="INSERT INTO admins (username, password, name) VALUES ('admin', 'admin1234', '관리자')"

-- 3. 브라우저 localStorage 초기화
# F12 → Console
localStorage.clear()
location.reload()
```

### 회원 등록 안 됨

#### 증상
- "회원 등록" 버튼 클릭 시 아무 반응 없음
- 에러 메시지 표시

#### 원인
1. 필수 입력 항목 누락
2. 전화번호 형식 오류
3. 데이터베이스 연결 오류

#### 해결 방법
```javascript
// 1. 브라우저 콘솔에서 확인 (F12)
console.log('회원 데이터:', {
  name: document.getElementById('memberName').value,
  phone: document.getElementById('memberPhone').value
})

// 2. 네트워크 탭 확인
// POST /api/members 요청 상태 코드 확인
// 400: 입력 오류
// 500: 서버 오류

// 3. 서버 로그 확인
pm2 logs badminton-manager --lines 50
```

### 파일 업로드 실패

#### 증상
- "파일 업로드 실패" 메시지
- 10MB 이하인데 실패

#### 원인
1. 지원하지 않는 파일 형식
2. R2 버킷 미생성
3. 네트워크 타임아웃

#### 해결 방법
```bash
# 1. R2 버킷 확인
npx wrangler r2 bucket list

# 2. 버킷 생성 (없으면)
npx wrangler r2 bucket create badminton-files

# 3. wrangler.jsonc 확인
cat wrangler.jsonc | grep r2_buckets

# 4. 지원 파일 형식 확인
# 이미지: JPG, PNG, GIF, WebP
# 문서: PDF, DOC, DOCX, XLS, XLSX
```

### 문자 발송 실패

#### 증상
- "문자 발송 실패" 메시지
- 일부만 발송 성공

#### 원인
1. NHN Cloud API 키 미설정
2. 발신번호 미등록
3. 잔액 부족

#### 해결 방법
```bash
# 1. 환경변수 확인
cat .dev.vars

# 2. 프로덕션 환경변수 확인
npx wrangler pages secret list --project-name badminton-manager

# 3. NHN Cloud 콘솔에서 확인
# - 발신번호 등록 상태 (2-3일 소요)
# - 잔액 확인
# - API 키 활성화 상태

# 4. 테스트 발송
curl -X POST https://api-sms.cloud.toast.com/sms/v3.0/appKeys/YOUR_APP_KEY/sender/sms \
  -H "Content-Type: application/json" \
  -d '{
    "body": "테스트 메시지",
    "sendNo": "01012345678",
    "recipientList": [{"recipientNo": "01012345678"}]
  }'
```

---

## 6.2 성능 문제

### 페이지 로딩 느림

#### 증상
- 대시보드 로딩 5초 이상
- 회원 목록 표시 지연

#### 원인
1. 많은 데이터 (회원 200명+)
2. 최적화되지 않은 쿼리
3. 네트워크 지연

#### 해결 방법
```sql
-- 1. 인덱스 확인
npx wrangler d1 execute badminton-db --local \
  --command="SELECT * FROM sqlite_master WHERE type='index'"

-- 2. 쿼리 실행 계획 확인
EXPLAIN QUERY PLAN
SELECT * FROM members WHERE club = '부림';

-- 3. 페이지네이션 적용 (코드 수정)
SELECT * FROM members
ORDER BY name
LIMIT 50 OFFSET 0;  -- 한 페이지에 50명씩
```

### 데이터베이스 잠김

#### 증상
- "database is locked" 에러
- 쓰기 작업 실패

#### 원인
1. SQLite 동시 쓰기 제한
2. 트랜잭션 미완료

#### 해결 방법
```javascript
// 트랜잭션 사용 (권장)
await env.DB.batch([
  env.DB.prepare('INSERT INTO members ...'),
  env.DB.prepare('UPDATE inventory ...'),
])

// 재시도 로직 추가
async function withRetry(fn, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn()
    } catch (error) {
      if (i === retries - 1) throw error
      await new Promise(resolve => setTimeout(resolve, 100 * (i + 1)))
    }
  }
}
```

---

## 6.3 배포 문제

### Cloudflare Pages 배포 실패

#### 증상
- `npm run deploy:prod` 실패
- "Deployment failed" 메시지

#### 원인
1. API 토큰 만료
2. 빌드 오류
3. 프로젝트명 중복

#### 해결 방법
```bash
# 1. 토큰 재확인
npx wrangler whoami

# 2. 토큰 재설정
export CLOUDFLARE_API_TOKEN=new-token

# 3. 빌드 테스트
npm run build
# 에러 없이 완료되어야 함

# 4. 프로젝트명 변경
npx wrangler pages project create badminton-manager-v2

# 5. 단계별 배포
npx wrangler pages deploy dist \
  --project-name badminton-manager \
  --branch main
```

### D1 마이그레이션 실패

#### 증상
- "Migration failed" 에러
- 테이블 생성 안 됨

#### 원인
1. SQL 문법 오류
2. 기존 테이블 충돌
3. 권한 문제

#### 해결 방법
```bash
# 1. SQL 문법 검증
sqlite3 test.db < migrations/0001_initial_schema.sql

# 2. 로컬에서 먼저 테스트
npm run db:migrate:local

# 3. 마이그레이션 상태 확인
npx wrangler d1 migrations list badminton-db

# 4. 강제 재적용 (주의!)
npx wrangler d1 execute badminton-db \
  --command="DROP TABLE IF EXISTS members"
npm run db:migrate:prod
```

### 환경변수 인식 안 됨

#### 증상
- 문자 발송 시 "API key not found"
- R2 접근 오류

#### 원인
1. `.dev.vars` 파일 누락 (로컬)
2. Secrets 미등록 (프로덕션)
3. 변수명 오타

#### 해결 방법
```bash
# 1. 로컬 환경변수 확인
cat .dev.vars

# 예시:
# NHN_APP_KEY=abc123
# NHN_SECRET_KEY=def456
# NHN_SENDER=01012345678

# 2. 프로덕션 Secrets 확인
npx wrangler pages secret list --project-name badminton-manager

# 3. Secret 추가
npx wrangler pages secret put NHN_APP_KEY \
  --project-name badminton-manager
# 프롬프트에서 값 입력

# 4. 재배포
npm run deploy:prod
```

---

## 6.4 데이터 복구

### 실수로 회원 삭제

#### 상황
- "전체 회원 삭제" 버튼을 실수로 클릭
- 중요한 회원 데이터 손실

#### 복구 방법 (백업이 있는 경우)
```bash
# 1. 로컬 백업에서 복구
sqlite3 .wrangler/state/v3/d1/badminton-db.sqlite3 < backup.sql

# 2. CSV 백업에서 복구
# 회원관리 → "일괄 업로드" → CSV 파일 업로드

# 3. 프로덕션 백업에서 복구
# Cloudflare Dashboard → D1 → Backups → Restore
```

#### 예방 방법
```bash
# 정기 백업 스크립트 (cron)
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
sqlite3 .wrangler/state/v3/d1/badminton-db.sqlite3 \
  .dump > backups/backup_$DATE.sql

# 압축
gzip backups/backup_$DATE.sql

# 30일 이상 된 백업 삭제
find backups/ -name "*.sql.gz" -mtime +30 -delete
```

### 데이터베이스 손상

#### 증상
- "database disk image is malformed"
- 데이터 조회 불가

#### 복구 방법
```bash
# 1. SQLite 무결성 검사
sqlite3 .wrangler/state/v3/d1/badminton-db.sqlite3 "PRAGMA integrity_check"

# 2. 복구 시도
sqlite3 .wrangler/state/v3/d1/badminton-db.sqlite3 "PRAGMA writable_schema=ON; UPDATE sqlite_master SET sql=sql; PRAGMA writable_schema=OFF; PRAGMA integrity_check;"

# 3. 백업에서 복구 (최후 수단)
rm .wrangler/state/v3/d1/badminton-db.sqlite3
npm run db:migrate:local
sqlite3 .wrangler/state/v3/d1/badminton-db.sqlite3 < backup.sql
```

---

# 7. 부록

## 7.1 API 엔드포인트 목록

### 인증 API
```
POST   /api/auth/login          로그인
POST   /api/auth/logout         로그아웃
```

### 회원 API
```
GET    /api/members             회원 목록 조회
POST   /api/members             회원 등록
PUT    /api/members/:id         회원 수정
DELETE /api/members/:id         회원 삭제
POST   /api/members/bulk        일괄 등록
GET    /api/members/export      CSV 내보내기
DELETE /api/members/all         전체 삭제
```

### 일정 API
```
GET    /api/schedules           일정 목록 조회
POST   /api/schedules           일정 추가
PUT    /api/schedules/:id       일정 수정
DELETE /api/schedules/:id       일정 삭제
POST   /api/schedules/bulk      정기모임 자동 생성
```

### 출석 API
```
GET    /api/attendances         출석 조회
POST   /api/attendances         출석 체크
GET    /api/attendances/stats   통계 조회
GET    /api/attendances/top     TOP 20 랭킹
```

### 회비 API
```
GET    /api/fees/settings/:year 회비 설정 조회
POST   /api/fees/settings       회비 설정 저장
GET    /api/fees/payments       납부 내역 조회
POST   /api/fees/payments       납부 등록
DELETE /api/fees/payments/:id   납부 내역 삭제
GET    /api/fees/stats          통계 조회
```

### 재고 API
```
GET    /api/inventory           재고 목록 조회
POST   /api/inventory/in        입고 처리
POST   /api/inventory/out       출고 처리
GET    /api/inventory/:id/logs  입출고 내역 조회
```

### 게시판 API
```
GET    /api/boards              게시판 목록
POST   /api/boards              게시판 생성
PUT    /api/boards/:id          게시판 수정
DELETE /api/boards/:id          게시판 삭제
GET    /api/boards/:id/posts    게시글 목록
POST   /api/boards/:id/posts    게시글 작성
PUT    /api/posts/:id           게시글 수정
DELETE /api/posts/:id           게시글 삭제
```

### 파일 API
```
POST   /api/files/upload        파일 업로드
GET    /api/files/download/:key 파일 다운로드
```

### 문자발송 API
```
POST   /api/sms/send            문자 발송
GET    /api/sms/logs            발송 이력 조회
GET    /api/sms/stats           발송 통계
```

### 대시보드 API
```
GET    /api/dashboard           대시보드 데이터
```

---

## 7.2 단축키 및 팁

### 브라우저 단축키
- `F12`: 개발자 도구 열기
- `Ctrl + Shift + R`: 강제 새로고침
- `Ctrl + F`: 페이지 내 검색
- `Esc`: 모달 닫기

### 개발 단축키
```bash
# 빠른 재시작
npm run build && pm2 restart badminton-manager

# 로그 실시간 확인
pm2 logs badminton-manager -f

# 데이터베이스 쿼리
alias db='npx wrangler d1 execute badminton-db --local --command'
db "SELECT COUNT(*) FROM members"
```

### 유용한 npm 스크립트
```json
{
  "dev": "npm run build && pm2 restart badminton-manager",
  "db:reset": "rm -rf .wrangler/state/v3/d1 && npm run db:migrate:local",
  "logs": "pm2 logs badminton-manager --nostream",
  "backup": "sqlite3 .wrangler/state/v3/d1/*.sqlite3 .dump > backup.sql"
}
```

---

## 7.3 추천 도구

### 개발 도구
- **VS Code**: 코드 에디터
  - 확장: Prettier, ESLint, SQLite Viewer
- **DB Browser for SQLite**: 데이터베이스 GUI
- **Postman**: API 테스트
- **Git**: 버전 관리

### 모니터링
- **Cloudflare Dashboard**: 배포 상태, 로그
- **PM2 Monitoring**: 로컬 서비스 모니터링
- **Browser DevTools**: 프론트엔드 디버깅

---

## 7.4 참고 자료

### 공식 문서
- [Cloudflare Pages](https://developers.cloudflare.com/pages/)
- [Cloudflare D1](https://developers.cloudflare.com/d1/)
- [Cloudflare R2](https://developers.cloudflare.com/r2/)
- [Hono Documentation](https://hono.dev/)
- [NHN Cloud SMS](https://docs.toast.com/ko/Notification/SMS/ko/Overview/)

### 커뮤니티
- [Cloudflare Community](https://community.cloudflare.com/)
- [Hono Discord](https://discord.gg/hono)

---

## 7.5 버전 이력

### v1.0.0 (2026-01-31)
- ✅ 초기 릴리스
- ✅ 7대 핵심 기능 완성
- ✅ 모바일 최적화
- ✅ Cloudflare Pages 배포 지원

### 향후 업데이트 계획
- [ ] 회원 프로필 사진
- [ ] 자동 문자 발송 (일정 리마인더)
- [ ] 통계 리포트 (월별/년도별)
- [ ] 다국어 지원 (영어)
- [ ] PWA 지원 (오프라인 모드)

---

## 7.6 라이선스

본 프로그램은 **MIT 라이선스**로 배포됩니다.

```
MIT License

Copyright (c) 2026 안양시배드민턴연합회

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 7.7 문의 및 지원

### 기술 지원
- **GitHub Issues**: 버그 리포트, 기능 제안
- **이메일**: support@your-org.com (실제 이메일로 교체)

### 긴급 문의
- **전화**: 010-XXXX-XXXX (실제 번호로 교체)
- **업무 시간**: 평일 09:00 - 18:00

---

**본 매뉴얼의 끝.**

문서 작성일: 2026년 1월 31일  
최종 수정일: 2026년 1월 31일  
버전: 1.0.0
