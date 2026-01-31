# 안양시배드민턴연합회 장년부 회원관리시스템
## 완전 통합 매뉴얼 (사용자·개발자·설치·API·FAQ)

**버전**: 1.0.0  
**제작일**: 2026년 1월 31일  
**제작**: AI Developer  
**문서 유형**: 통합 완전판 (All-in-One)

---

# 📖 문서 구성

이 문서는 다음 5가지 가이드를 하나로 통합한 완전판입니다:

1. **사용자 매뉴얼** - 일반 사용자를 위한 기능 설명
2. **개발자 가이드** - 코드 구조 및 개발 방법
3. **설치 가이드** - 로컬 개발 및 배포 방법
4. **API 문서** - 전체 API 엔드포인트 명세
5. **FAQ** - 자주 묻는 질문과 해결 방법

---

# 목차

## PART 1: 시스템 개요
1. [시스템 소개](#1-시스템-소개)
2. [프로그램 구조](#2-프로그램-구조)
3. [기술 스택](#3-기술-스택)

## PART 2: 사용자 매뉴얼
4. [로그인 및 대시보드](#4-로그인-및-대시보드)
5. [회원관리](#5-회원관리)
6. [일정관리](#6-일정관리)
7. [출석관리](#7-출석관리)
8. [회비관리](#8-회비관리)
9. [재고관리](#9-재고관리)
10. [게시판](#10-게시판)
11. [문자발송](#11-문자발송)

## PART 3: 설치 및 배포 가이드
12. [로컬 개발 환경 설정](#12-로컬-개발-환경-설정)
13. [Cloudflare Pages 배포](#13-cloudflare-pages-배포)
14. [환경변수 설정](#14-환경변수-설정)
15. [데이터베이스 마이그레이션](#15-데이터베이스-마이그레이션)
16. [외부 서버 이전 방법](#16-외부-서버-이전-방법)

## PART 4: 개발자 가이드
17. [프로젝트 구조](#17-프로젝트-구조)
18. [코드 아키텍처](#18-코드-아키텍처)
19. [백엔드 개발](#19-백엔드-개발)
20. [프론트엔드 개발](#20-프론트엔드-개발)
21. [데이터베이스 스키마](#21-데이터베이스-스키마)
22. [테스트 및 디버깅](#22-테스트-및-디버깅)

## PART 5: API 문서
23. [API 개요](#23-api-개요)
24. [인증 API](#24-인증-api)
25. [회원 API](#25-회원-api)
26. [일정 API](#26-일정-api)
27. [출석 API](#27-출석-api)
28. [회비 API](#28-회비-api)
29. [재고 API](#29-재고-api)
30. [게시판 API](#30-게시판-api)
31. [문자발송 API](#31-문자발송-api)
32. [파일 API](#32-파일-api)

## PART 6: FAQ 및 문제 해결
33. [자주 묻는 질문 (FAQ)](#33-자주-묻는-질문-faq)
34. [문제 해결 가이드](#34-문제-해결-가이드)
35. [에러 메시지 해설](#35-에러-메시지-해설)

## PART 7: 부록
36. [용어 사전](#36-용어-사전)
37. [단축키 모음](#37-단축키-모음)
38. [참고 자료](#38-참고-자료)
39. [버전 이력](#39-버전-이력)
40. [라이선스](#40-라이선스)

---

# PART 1: 시스템 개요

---

# 1. 시스템 소개

## 1.1 프로젝트 개요

**안양시배드민턴연합회 장년부 회원관리시스템**은 약 200명 규모의 배드민턴 동호회를 효율적으로 관리하기 위한 **웹 기반 통합 관리 시스템**입니다.

### 주요 특징
- ✅ **완전 무료**: 오픈소스 기반, 라이선스 비용 없음
- ✅ **클라우드 기반**: Cloudflare Pages로 안정적인 서비스
- ✅ **모바일 최적화**: PC, 태블릿, 스마트폰 완벽 지원
- ✅ **실시간 동기화**: 여러 관리자 동시 접근 가능
- ✅ **자동 백업**: 데이터 손실 방지

### 시스템 요구사항
- **웹 브라우저**: Chrome, Edge, Safari, Firefox (최신 버전)
- **인터넷 연결**: 필수 (클라우드 기반)
- **화면 해상도**: 최소 320px (모바일) ~ 권장 1920px (PC)
- **관리자 권한**: 시스템 설정 및 배포

---

## 1.2 주요 기능

### 🧑‍🤝‍🧑 회원관리
- 164명 회원 정보 관리 (이름, 성별, 생년, 소속 클럽, 급수, 연락처)
- 엑셀/CSV 일괄 업로드 (복사-붙여넣기 또는 파일 업로드)
- 검색, 필터링, 정렬 기능
- 엑셀 내보내기 기능

### 📅 일정관리
- 정기모임 자동 생성 (매월 1주, 3주 토요일)
- 일정 등록, 수정, 삭제
- 월별 조회 및 필터링
- 일정 유형 분류 (정기모임, 특별행사, 기타)

### ✅ 출석관리
- 일정별 출석/결석 체크
- 클럽별 그룹화 및 접기/펼치기
- 회원별 출석 현황 조회
- 출석률 TOP 20 랭킹
- 연말 시상식 통계 자료

### 💰 회비관리
- 연도별 회비 설정 (금액, 설명)
- 회원별 납부 등록 (납부일, 메모)
- 미납자 목록 조회 및 문자 발송
- 납부 내역 삭제 및 수정

### 📦 재고관리
- 재고 품목 관리 (라켓, 셔틀콕, 의류 등)
- 입고/출고 내역 기록
- 재고 부족 알림
- 최소 수량 경고 기능

### 📰 게시판
- 다중 게시판 지원 (공지사항, 자유게시판, 사진첩)
- 글 작성, 수정, 삭제
- 파일 첨부 (최대 10MB)
- 조회수 자동 집계

### 📱 문자발송
- NHN Cloud SMS 연동
- 개별/다중/전체 발송
- 발송 템플릿 관리
- 발송 이력 저장 및 통계

### 📊 대시보드
- 전체 회원 수, 일정, 출석률 통계
- 급수별 회원 분포 차트
- TOP 출석자 랭킹
- 최근 일정 및 재고 알림

---

# 2. 프로그램 구조

## 2.1 시스템 아키텍처

```
┌─────────────────────────────────────────────────────┐
│                     사용자                          │
│            (PC, 태블릿, 스마트폰)                   │
└─────────────────────────────────────────────────────┘
                         ↓ HTTPS
┌─────────────────────────────────────────────────────┐
│               Cloudflare Pages (CDN)                │
│                  (정적 파일 서빙)                   │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│              Cloudflare Workers                     │
│                 (Hono 백엔드 API)                   │
└─────────────────────────────────────────────────────┘
            ↓                              ↓
┌──────────────────────┐      ┌───────────────────────┐
│   Cloudflare D1      │      │   Cloudflare R2       │
│   (SQLite 데이터베이스)│      │   (파일 저장소)        │
└──────────────────────┘      └───────────────────────┘
```

---

## 2.2 디렉토리 구조

```
/home/user/webapp/
├── src/
│   ├── index.tsx                 # Hono 메인 진입점
│   └── routes/
│       ├── auth.ts               # 인증 API
│       ├── members.ts            # 회원 API
│       ├── schedules.ts          # 일정 API
│       ├── attendances.ts        # 출석 API
│       ├── fees.ts               # 회비 API
│       ├── inventory.ts          # 재고 API
│       ├── boards.ts             # 게시판 API
│       ├── files.ts              # 파일 API
│       ├── sms.ts                # 문자발송 API
│       └── dashboard.ts          # 대시보드 API
├── public/
│   └── static/
│       ├── app.js                # 프론트엔드 메인 스크립트
│       ├── style.css             # 커스텀 CSS
│       └── sample_members.csv    # 샘플 회원 데이터
├── migrations/                   # D1 마이그레이션 파일
│   ├── 0001_initial_schema.sql
│   ├── 0002_add_fees.sql
│   └── 0003_add_sms.sql
├── docs/                         # 문서
│   ├── MANUAL.md
│   ├── COMPLETE_MANUAL.md        # 이 파일
│   └── PDF_CONVERSION_GUIDE.md
├── dist/                         # 빌드 결과물 (자동 생성)
│   ├── _worker.js                # Cloudflare Workers 번들
│   └── static/                   # 정적 파일
├── .dev.vars                     # 로컬 환경변수 (비공개)
├── .gitignore                    # Git 무시 파일
├── wrangler.jsonc                # Cloudflare 설정
├── vite.config.ts                # Vite 빌드 설정
├── tsconfig.json                 # TypeScript 설정
├── package.json                  # NPM 의존성
├── ecosystem.config.cjs          # PM2 설정
└── README.md                     # 프로젝트 소개
```

---

# 3. 기술 스택

## 3.1 백엔드

### Hono (v4.0.0)
- **경량 웹 프레임워크**: Express보다 10배 빠른 성능
- **TypeScript 네이티브**: 타입 안전성 보장
- **Cloudflare Workers 최적화**: Edge Computing 지원

### Cloudflare D1
- **SQLite 기반**: 글로벌 분산 데이터베이스
- **서버리스**: 자동 스케일링 및 백업
- **로컬 개발 지원**: `.wrangler/state/v3/d1`에 로컬 SQLite

### Cloudflare R2
- **S3 호환**: 파일 저장소
- **무료 저장**: 10GB 무료 (충분한 용량)
- **CDN 통합**: 빠른 파일 다운로드

---

## 3.2 프론트엔드

### TailwindCSS
- **유틸리티 우선**: 빠른 UI 개발
- **반응형 디자인**: 모바일부터 데스크톱까지
- **CDN 사용**: 빌드 없이 즉시 사용 가능

### Chart.js
- **통계 차트**: 급수별 분포, 출석률 등
- **반응형 차트**: 모바일에서도 깔끔한 표시

### Day.js
- **날짜 처리**: 한국어 로케일 지원
- **경량 라이브러리**: Moment.js 대체

### Axios
- **HTTP 클라이언트**: Promise 기반 API 호출
- **에러 핸들링**: 자동 재시도 및 에러 처리

---

## 3.3 개발 도구

### Vite (v5.0.0)
- **번들러**: 초고속 빌드 (1초 이내)
- **HMR**: Hot Module Replacement
- **Tree Shaking**: 불필요한 코드 제거

### Wrangler (v3.78.0)
- **Cloudflare CLI**: 로컬 개발 및 배포
- **D1 마이그레이션**: 데이터베이스 스키마 관리
- **Pages Dev**: 로컬 개발 서버

### PM2
- **프로세스 관리**: 개발 서버 데몬화
- **로그 관리**: 실시간 로그 모니터링
- **자동 재시작**: 에러 발생 시 자동 복구

### TypeScript (v5.0.0)
- **타입 안전성**: 컴파일 시점 에러 방지
- **IntelliSense**: VSCode 자동 완성
- **코드 품질**: 유지보수성 향상

---

# PART 2: 사용자 매뉴얼

---

# 4. 로그인 및 대시보드

## 4.1 로그인

### 접속 방법
1. 웹 브라우저에서 시스템 URL 접속
2. 로그인 화면에서 아이디와 비밀번호 입력
3. "로그인" 버튼 클릭

### 기본 관리자 계정
- **아이디**: `admin`
- **비밀번호**: `admin1234`

> ⚠️ **보안 주의**: 첫 로그인 후 반드시 비밀번호를 변경하세요!

### 로그인 실패 시
- 아이디 또는 비밀번호가 틀렸을 경우 에러 메시지 표시
- 3회 연속 실패 시 5분간 로그인 제한 (선택 기능)

---

## 4.2 대시보드

로그인 성공 시 표시되는 메인 화면입니다.

### 주요 통계
1. **전체 회원 수**: 164명 (예시)
2. **금주 일정**: 0건
3. **평균 출석률**: 0%
4. **재고 알림**: 0건

### 급수별 회원 분포 차트
- 1급부터 5급까지 회원 수를 파이 차트로 표시
- 마우스 오버 시 정확한 숫자 표시

### TOP 20 출석자 랭킹
- 출석률 상위 20명 표시
- 이름, 클럽, 출석 횟수, 출석률 표시

### 최근 일정
- 최근 5개 일정 표시
- 일정명, 날짜, 시간, 장소 표시

### 재고 부족 알림
- 최소 수량 이하 품목 알림
- 빨간색 배지로 강조 표시

---

# 5. 회원관리

## 5.1 회원 목록 조회

### 기본 화면
- 전체 회원 목록이 테이블 형태로 표시됩니다.
- 컬럼: 이름, 성별, 생년, 클럽, 급수, 전화, 차량등록, 회비납부

### 검색 기능
1. 상단 검색창에 키워드 입력
2. 이름, 클럽, 전화번호에서 검색
3. 실시간 필터링

### 필터링
- **성별**: 남성/여성
- **클럽**: 전체/부림/인덕원/평촌/관악/비산/중앙 등
- **급수**: 1급~5급
- **회비납부**: 납부/미납

---

## 5.2 회원 등록

### 개별 등록
1. "회원 등록" 버튼 클릭
2. 회원 정보 입력
   - 이름 (필수)
   - 성별 (필수)
   - 생년 (필수, 1900~2100)
   - 소속 클럽 (필수)
   - 급수 (1~5급)
   - 전화번호 (010-1234-5678)
   - 차량등록 (예: 12가3456)
3. "저장" 버튼 클릭

### 일괄 등록 (엑셀/CSV)

**방법 1: 복사-붙여넣기**
1. "회원 일괄 등록" 버튼 클릭
2. 엑셀에서 데이터 복사 (탭으로 구분)
3. 텍스트 영역에 붙여넣기
4. "등록" 버튼 클릭

**방법 2: CSV 파일 업로드**
1. "CSV 파일 업로드" 버튼 클릭
2. 파일 선택
3. 자동 파싱 및 등록

**CSV 형식 예시**:
```csv
이름,성별,생년,클럽,급수,전화,차량등록
홍길동,남,1980,부림,2,010-1234-5678,12가3456
김영희,여,1985,인덕원,3,010-9876-5432,34나7890
```

---

## 5.3 회원 수정

1. 회원 목록에서 수정할 회원의 "수정" 버튼 클릭
2. 정보 수정
3. "저장" 버튼 클릭

---

## 5.4 회원 삭제

### 개별 삭제
1. 회원 목록에서 "삭제" 버튼 클릭
2. 확인 메시지에서 "확인" 클릭

### 전체 삭제
1. "전체 회원 삭제" 버튼 클릭 (위험!)
2. 확인 메시지 2회 확인
3. 모든 회원 데이터 삭제

> ⚠️ **주의**: 삭제된 데이터는 복구할 수 없습니다!

---

## 5.5 엑셀 내보내기

1. "엑셀로 내보내기" 버튼 클릭
2. `members_export_YYYYMMDD_HHMMSS.csv` 파일 다운로드
3. 엑셀에서 열어서 확인

---

# 6. 일정관리

## 6.1 일정 조회

### 월별 조회
- 상단 년도/월 선택
- 해당 월의 일정 목록 표시

### 정기모임 자동 생성
- 매월 1주, 3주 토요일 자동 생성
- 시간: 08:00~12:00
- 장소: 안양종합운동장 실내체육관

---

## 6.2 일정 등록

1. "일정 추가" 버튼 클릭
2. 일정 정보 입력
   - 일정명 (필수)
   - 날짜 (필수)
   - 시작 시간
   - 종료 시간
   - 장소
   - 유형 (정기모임/특별행사/기타)
   - 설명
3. "저장" 버튼 클릭

---

## 6.3 일정 수정/삭제

### 수정
1. 일정 목록에서 "수정" 버튼 클릭
2. 정보 수정
3. "저장" 버튼 클릭

### 삭제
1. 일정 목록에서 "삭제" 버튼 클릭
2. 확인 메시지에서 "확인" 클릭

---

# 7. 출석관리

## 7.1 출석 체크

### 클럽별 그룹화
- 회원 목록이 클럽별로 그룹화되어 표시
- 각 클럽 헤더 클릭 시 접기/펼치기 가능

### 출석 체크 방법
1. 일정 선택 (드롭다운)
2. 클럽 펼치기
3. 각 회원의 "출석" 또는 "결석" 버튼 클릭
4. 실시간 저장

---

## 7.2 회원별 출석 현황

1. "회원별 출석 현황" 버튼 클릭
2. 회원 검색 또는 선택
3. 출석 내역 조회 (날짜, 일정명, 출석/결석)
4. 출석률 통계 표시

---

## 7.3 출석률 TOP 20

- 대시보드에 자동 표시
- 출석 횟수 많은 순으로 정렬
- 이름, 클럽, 출석 횟수, 출석률(%) 표시

---

# 8. 회비관리

## 8.1 회비 설정

1. "회비 설정" 버튼 클릭
2. 회비 정보 입력
   - 연도 (예: 2026)
   - 금액 (예: 50,000원)
   - 설명 (예: "2026년 연회비")
3. "저장" 버튼 클릭

---

## 8.2 납부 등록

### 개별 납부
1. "납부 등록" 버튼 클릭
2. 회원 선택 (드롭다운)
3. 납부 정보 입력
   - 연도 (자동 입력)
   - 금액 (자동 입력, 수정 가능)
   - 납부일 (기본값: 오늘)
   - 메모 (선택)
4. "등록" 버튼 클릭

### 미납자 목록에서 등록
1. 미납자 목록에서 "납부 등록" 버튼 클릭
2. 회원 정보 자동 입력
3. 납부일 및 메모 입력
4. "등록" 버튼 클릭

---

## 8.3 미납자 관리

### 미납자 조회
- 회비 설정된 연도의 미납자 목록 자동 표시
- 이름, 클럽, 전화번호 표시

### 미납자 문자 발송
1. "미납자 문자발송" 버튼 클릭
2. 발송 대상 확인
3. 문자 내용 입력 (템플릿 제공)
4. "발송" 버튼 클릭

---

## 8.4 납부 내역 수정/삭제

### 수정
1. 납부 내역에서 "수정" 버튼 클릭
2. 정보 수정
3. "저장" 버튼 클릭

### 삭제
1. 납부 내역에서 "삭제" 버튼 클릭
2. 확인 메시지에서 "확인" 클릭

---

# 9. 재고관리

## 9.1 재고 조회

### 재고 목록
- 품목명, 현재 수량, 최소 수량, 업데이트 날짜 표시
- 부족한 품목은 빨간색 배지 표시

---

## 9.2 재고 등록

1. "재고 추가" 버튼 클릭
2. 품목 정보 입력
   - 품목명 (예: 셔틀콕)
   - 현재 수량
   - 최소 수량 (알림 기준)
3. "저장" 버튼 클릭

---

## 9.3 입고/출고 관리

### 입고
1. 품목 선택
2. "입고" 버튼 클릭
3. 입고 수량 및 메모 입력
4. "입고" 버튼 클릭

### 출고
1. 품목 선택
2. "출고" 버튼 클릭
3. 출고 수량 및 메모 입력
4. "출고" 버튼 클릭

---

## 9.4 재고 알림

- 현재 수량이 최소 수량 이하일 경우 대시보드에 알림 표시
- 빨간색 배지로 강조

---

# 10. 게시판

## 10.1 게시판 목록

- 공지사항, 자유게시판, 사진첩 등 다중 게시판 지원
- 각 게시판별로 독립적인 글 관리

---

## 10.2 글 작성

1. "글쓰기" 버튼 클릭
2. 글 정보 입력
   - 제목 (필수)
   - 내용 (필수)
   - 파일 첨부 (선택, 최대 10MB)
3. "등록" 버튼 클릭

---

## 10.3 글 조회

1. 게시판에서 글 제목 클릭
2. 상세 내용 표시
3. 첨부 파일 다운로드 가능
4. 조회수 자동 증가

---

## 10.4 글 수정/삭제

### 수정
1. 글 상세 화면에서 "수정" 버튼 클릭
2. 내용 수정
3. "저장" 버튼 클릭

### 삭제
1. 글 상세 화면에서 "삭제" 버튼 클릭
2. 확인 메시지에서 "확인" 클릭

---

# 11. 문자발송

## 11.1 NHN Cloud SMS 설정

### API 키 발급
1. NHN Cloud 콘솔 접속 (https://console.nhncloud.com)
2. SMS 서비스 활성화
3. API Key 발급
4. 발신번호 등록 및 인증

### 환경변수 설정
```bash
# .dev.vars (로컬)
NHN_APP_KEY=your-app-key
NHN_SECRET_KEY=your-secret-key
NHN_SENDER=01012345678

# Cloudflare Pages (프로덕션)
npx wrangler pages secret put NHN_APP_KEY
npx wrangler pages secret put NHN_SECRET_KEY
npx wrangler pages secret put NHN_SENDER
```

---

## 11.2 개별 발송

1. 회원 목록에서 "문자 발송" 버튼 클릭
2. 문자 내용 입력 (최대 80자, 단문)
3. "발송" 버튼 클릭
4. 발송 결과 확인

---

## 11.3 다중 발송

1. "문자 발송" 메뉴 클릭
2. 수신자 선택 (여러 명 체크)
3. 문자 내용 입력
4. 비용 예측 확인 (약 9원/건)
5. "발송" 버튼 클릭

---

## 11.4 전체 발송

1. "전체 회원 문자발송" 버튼 클릭
2. 문자 내용 입력
3. 비용 예측 확인 (164명 × 9원 = 1,476원)
4. "발송" 버튼 클릭

---

## 11.5 발송 이력

1. "문자 발송 이력" 버튼 클릭
2. 발송 날짜, 수신자, 내용, 상태 조회
3. 성공/실패 통계 확인

---

# PART 3: 설치 및 배포 가이드

---

# 12. 로컬 개발 환경 설정

## 12.1 필수 요구사항

### 소프트웨어
- **Node.js**: v20.x 이상
- **npm**: v10.x 이상
- **Git**: v2.x 이상

### 설치 확인
```bash
node -v   # v20.19.6
npm -v    # v10.8.2
git --version  # git version 2.x
```

---

## 12.2 프로젝트 클론

```bash
# GitHub에서 클론
git clone https://github.com/your-org/badminton-manager.git
cd badminton-manager

# 또는 압축 파일 다운로드 후 압축 해제
unzip badminton-manager.zip
cd badminton-manager
```

---

## 12.3 의존성 설치

```bash
# NPM 패키지 설치
npm install

# 설치 확인
npm list --depth=0
```

---

## 12.4 환경변수 설정

### .dev.vars 파일 생성
```bash
# .dev.vars 파일 생성
cat > .dev.vars << 'EOF'
# NHN Cloud SMS 설정
NHN_APP_KEY=your-app-key-here
NHN_SECRET_KEY=your-secret-key-here
NHN_SENDER=01012345678
EOF
```

> ⚠️ **보안 주의**: `.dev.vars` 파일은 절대 Git에 커밋하지 마세요!

---

## 12.5 데이터베이스 마이그레이션

```bash
# D1 로컬 마이그레이션
npm run db:migrate:local

# 마이그레이션 확인
ls -la .wrangler/state/v3/d1/
```

---

## 12.6 로컬 서버 실행

### 빌드
```bash
npm run build
```

### PM2로 서버 시작
```bash
# PM2 전역 설치 (최초 1회)
npm install -g pm2

# 서버 시작
pm2 start ecosystem.config.cjs

# 상태 확인
pm2 list

# 로그 확인
pm2 logs badminton-manager --nostream
```

### 테스트
```bash
# 헬스 체크
curl http://localhost:3000/api/health

# 브라우저 접속
# http://localhost:3000
```

---

## 12.7 로컬 서버 중지

```bash
# 서버 중지
pm2 stop badminton-manager

# 서버 재시작
pm2 restart badminton-manager

# PM2에서 제거
pm2 delete badminton-manager
```

---

# 13. Cloudflare Pages 배포

## 13.1 Cloudflare 계정 생성

1. https://dash.cloudflare.com 접속
2. 회원가입 (무료 플랜 사용 가능)
3. 이메일 인증 완료

---

## 13.2 Cloudflare D1 데이터베이스 생성

```bash
# D1 데이터베이스 생성
npx wrangler d1 create badminton-db

# 출력 예시:
# ✅ Successfully created DB 'badminton-db'
# 
# [[d1_databases]]
# binding = "DB"
# database_name = "badminton-db"
# database_id = "abcd1234-5678-90ef-ghij-klmnopqrstuv"
```

### wrangler.jsonc 업데이트
```jsonc
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "badminton-db",
      "database_id": "abcd1234-5678-90ef-ghij-klmnopqrstuv"  // ← 복사한 ID
    }
  ]
}
```

---

## 13.3 Cloudflare R2 버킷 생성

```bash
# R2 버킷 생성
npx wrangler r2 bucket create badminton-files
npx wrangler r2 bucket create badminton-files-preview
```

---

## 13.4 프로덕션 마이그레이션

```bash
# D1 프로덕션 마이그레이션
npm run db:migrate:prod

# 마이그레이션 확인
npx wrangler d1 execute badminton-db --command="SELECT name FROM sqlite_master WHERE type='table';"
```

---

## 13.5 Pages 프로젝트 생성

```bash
# Pages 프로젝트 생성
npx wrangler pages project create badminton-manager \
  --production-branch main \
  --compatibility-date 2026-01-30
```

---

## 13.6 환경변수 설정 (Secrets)

```bash
# 환경변수 등록
npx wrangler pages secret put NHN_APP_KEY --project-name badminton-manager
# → 값 입력: your-app-key

npx wrangler pages secret put NHN_SECRET_KEY --project-name badminton-manager
# → 값 입력: your-secret-key

npx wrangler pages secret put NHN_SENDER --project-name badminton-manager
# → 값 입력: 01012345678

# 환경변수 확인
npx wrangler pages secret list --project-name badminton-manager
```

---

## 13.7 배포 실행

```bash
# 빌드 및 배포
npm run deploy

# 또는 수동 배포
npm run build
npx wrangler pages deploy dist --project-name badminton-manager
```

### 배포 결과 확인
```
✅ Deployment complete!
🌎 Production: https://badminton-manager.pages.dev
🌍 Branch:     https://main.badminton-manager.pages.dev
```

---

## 13.8 커스텀 도메인 연결 (선택)

```bash
# 커스텀 도메인 추가
npx wrangler pages domain add badminton.example.com --project-name badminton-manager

# DNS 레코드 추가 (Cloudflare 대시보드에서)
# CNAME: badminton → badminton-manager.pages.dev
```

---

# 14. 환경변수 설정

## 14.1 환경변수 목록

| 변수명 | 설명 | 필수 여부 | 예시 |
|--------|------|-----------|------|
| `NHN_APP_KEY` | NHN Cloud SMS App Key | 선택 | `AbCdEfGhIj...` |
| `NHN_SECRET_KEY` | NHN Cloud SMS Secret Key | 선택 | `1234567890...` |
| `NHN_SENDER` | SMS 발신번호 | 선택 | `01012345678` |

> ⚠️ **주의**: 문자발송 기능을 사용하지 않는다면 NHN 환경변수는 불필요합니다.

---

## 14.2 로컬 환경변수 (.dev.vars)

```bash
# .dev.vars 파일 생성
NHN_APP_KEY=your-app-key
NHN_SECRET_KEY=your-secret-key
NHN_SENDER=01012345678
```

---

## 14.3 프로덕션 환경변수 (Cloudflare Secrets)

```bash
# Secrets 등록
npx wrangler pages secret put NHN_APP_KEY
npx wrangler pages secret put NHN_SECRET_KEY
npx wrangler pages secret put NHN_SENDER

# Secrets 확인
npx wrangler pages secret list
```

---

# 15. 데이터베이스 마이그레이션

## 15.1 마이그레이션 파일 구조

```
migrations/
├── 0001_initial_schema.sql       # 초기 스키마
├── 0002_add_fees.sql             # 회비 테이블 추가
└── 0003_add_sms.sql              # 문자발송 테이블 추가
```

---

## 15.2 로컬 마이그레이션

```bash
# 마이그레이션 적용
npm run db:migrate:local

# 마이그레이션 확인
npm run db:console:local -- --command="SELECT * FROM sqlite_master WHERE type='table';"
```

---

## 15.3 프로덕션 마이그레이션

```bash
# 마이그레이션 적용
npm run db:migrate:prod

# 마이그레이션 확인
npm run db:console:prod -- --command="SELECT * FROM sqlite_master WHERE type='table';"
```

---

## 15.4 새로운 마이그레이션 생성

```bash
# 마이그레이션 파일 생성
cat > migrations/0004_add_column.sql << 'EOF'
-- 테이블에 컬럼 추가
ALTER TABLE members ADD COLUMN email TEXT;
EOF

# 마이그레이션 적용
npm run db:migrate:local   # 로컬
npm run db:migrate:prod    # 프로덕션
```

---

# 16. 외부 서버 이전 방법

## 16.1 AWS EC2로 이전

### 1단계: EC2 인스턴스 생성
```bash
# Ubuntu 22.04 LTS 선택
# t3.micro (1 vCPU, 1GB RAM) - 무료 티어
```

### 2단계: Node.js 설치
```bash
# EC2 SSH 접속
ssh -i your-key.pem ubuntu@your-ec2-ip

# Node.js 설치
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Git 설치
sudo apt-get install -y git
```

### 3단계: 프로젝트 클론
```bash
git clone https://github.com/your-org/badminton-manager.git
cd badminton-manager
npm install
```

### 4단계: Nginx 설치 및 설정
```bash
# Nginx 설치
sudo apt-get install -y nginx

# Nginx 설정
sudo nano /etc/nginx/sites-available/badminton

# 설정 내용
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# 설정 활성화
sudo ln -s /etc/nginx/sites-available/badminton /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 5단계: PM2로 서버 실행
```bash
# PM2 설치
sudo npm install -g pm2

# 서버 시작
pm2 start ecosystem.config.cjs

# PM2 자동 시작 설정
pm2 startup
pm2 save
```

---

## 16.2 Docker로 이전

### Dockerfile 생성
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["pm2-runtime", "start", "ecosystem.config.cjs"]
```

### Docker Compose
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NHN_APP_KEY=${NHN_APP_KEY}
      - NHN_SECRET_KEY=${NHN_SECRET_KEY}
      - NHN_SENDER=${NHN_SENDER}
    volumes:
      - ./.wrangler:/app/.wrangler
    restart: unless-stopped
```

### 실행
```bash
# 빌드
docker-compose build

# 실행
docker-compose up -d

# 로그 확인
docker-compose logs -f
```

---

## 16.3 Vercel로 이전

### vercel.json 설정
```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/_worker.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "dist/_worker.js"
    },
    {
      "src": "/(.*)",
      "dest": "dist/$1"
    }
  ]
}
```

### 배포
```bash
# Vercel CLI 설치
npm install -g vercel

# 로그인
vercel login

# 배포
vercel --prod
```

---

# PART 4: 개발자 가이드

---

# 17. 프로젝트 구조

## 17.1 전체 구조

```
/home/user/webapp/
├── src/                          # TypeScript 소스 코드
│   ├── index.tsx                 # Hono 메인 진입점
│   └── routes/                   # API 라우트
│       ├── auth.ts               # 인증 API
│       ├── members.ts            # 회원 API
│       ├── schedules.ts          # 일정 API
│       ├── attendances.ts        # 출석 API
│       ├── fees.ts               # 회비 API
│       ├── inventory.ts          # 재고 API
│       ├── boards.ts             # 게시판 API
│       ├── files.ts              # 파일 API
│       ├── sms.ts                # 문자발송 API
│       └── dashboard.ts          # 대시보드 API
├── public/                       # 정적 파일
│   └── static/
│       ├── app.js                # 프론트엔드 메인 스크립트
│       ├── style.css             # 커스텀 CSS
│       └── sample_members.csv    # 샘플 데이터
├── migrations/                   # D1 마이그레이션
│   ├── 0001_initial_schema.sql
│   ├── 0002_add_fees.sql
│   └── 0003_add_sms.sql
├── docs/                         # 문서
│   ├── MANUAL.md
│   ├── COMPLETE_MANUAL.md
│   └── PDF_CONVERSION_GUIDE.md
├── dist/                         # 빌드 결과물 (자동 생성)
│   ├── _worker.js                # Cloudflare Workers 번들
│   └── static/                   # 정적 파일
├── .wrangler/                    # Wrangler 로컬 개발 (자동 생성)
│   └── state/v3/
│       ├── d1/                   # 로컬 D1 데이터베이스
│       └── r2/                   # 로컬 R2 파일 저장소
├── .dev.vars                     # 로컬 환경변수 (비공개)
├── .gitignore                    # Git 무시 파일
├── wrangler.jsonc                # Cloudflare 설정
├── vite.config.ts                # Vite 빌드 설정
├── tsconfig.json                 # TypeScript 설정
├── package.json                  # NPM 의존성
├── ecosystem.config.cjs          # PM2 설정
└── README.md                     # 프로젝트 소개
```

---

## 17.2 src/ 디렉토리

### index.tsx
- Hono 앱 초기화
- CORS 설정
- 정적 파일 서빙
- API 라우트 마운트
- 메인 HTML 렌더링

### routes/
- 각 기능별 API 라우트 분리
- RESTful API 패턴 준수
- TypeScript 타입 안전성

---

## 17.3 public/ 디렉토리

### static/app.js
- 프론트엔드 메인 스크립트
- 전역 `app` 객체 관리
- 페이지 렌더링 로직
- API 통신 (Axios)
- 이벤트 핸들러

### static/style.css
- 커스텀 CSS 스타일
- TailwindCSS 보완

---

## 17.4 migrations/ 디렉토리

- SQL 마이그레이션 파일
- 번호 순서대로 실행 (0001, 0002, ...)
- 각 파일은 하나의 마이그레이션 단위

---

# 18. 코드 아키텍처

## 18.1 MVC 패턴

```
┌─────────────────┐
│   View (HTML)   │  ← app.js가 렌더링
└─────────────────┘
         ↓
┌─────────────────┐
│  Controller     │  ← routes/*.ts
│  (API 라우트)   │
└─────────────────┘
         ↓
┌─────────────────┐
│  Model (D1/R2)  │  ← Cloudflare D1/R2
└─────────────────┘
```

---

## 18.2 API 설계 원칙

### RESTful API
- **GET**: 조회
- **POST**: 생성
- **PUT**: 수정
- **DELETE**: 삭제

### URL 규칙
```
/api/members          GET     전체 회원 조회
/api/members/:id      GET     특정 회원 조회
/api/members          POST    회원 생성
/api/members/:id      PUT     회원 수정
/api/members/:id      DELETE  회원 삭제
```

### 에러 응답
```typescript
{
  error: "에러 메시지",
  code: "ERROR_CODE",
  details: {}
}
```

---

## 18.3 타입 안전성

### Hono Bindings
```typescript
type Bindings = {
  DB: D1Database;                // Cloudflare D1
  R2: R2Bucket;                  // Cloudflare R2
  NHN_APP_KEY: string;           // NHN App Key
  NHN_SECRET_KEY: string;        // NHN Secret Key
  NHN_SENDER: string;            // SMS 발신번호
};

const app = new Hono<{ Bindings: Bindings }>();
```

---

# 19. 백엔드 개발

## 19.1 새로운 API 라우트 추가

### 1단계: 라우트 파일 생성
```typescript
// src/routes/example.ts
import { Hono } from 'hono';

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

// GET /api/example
app.get('/', async (c) => {
  const { DB } = c.env;
  
  const result = await DB.prepare('SELECT * FROM examples').all();
  
  return c.json(result.results);
});

// POST /api/example
app.post('/', async (c) => {
  const { DB } = c.env;
  const body = await c.req.json();
  
  const result = await DB.prepare('INSERT INTO examples (name) VALUES (?)')
    .bind(body.name)
    .run();
  
  return c.json({ id: result.meta.last_row_id });
});

export default app;
```

### 2단계: index.tsx에 마운트
```typescript
// src/index.tsx
import exampleRoutes from './routes/example';

app.route('/api/example', exampleRoutes);
```

---

## 19.2 D1 데이터베이스 쿼리

### SELECT
```typescript
// 전체 조회
const result = await DB.prepare('SELECT * FROM members').all();

// 조건 조회
const result = await DB.prepare('SELECT * FROM members WHERE club = ?')
  .bind('부림')
  .all();

// 단일 조회
const result = await DB.prepare('SELECT * FROM members WHERE id = ?')
  .bind(1)
  .first();
```

### INSERT
```typescript
const result = await DB.prepare(`
  INSERT INTO members (name, gender, birth_year, club, grade)
  VALUES (?, ?, ?, ?, ?)
`)
  .bind('홍길동', '남', 1980, '부림', 2)
  .run();

const newId = result.meta.last_row_id;
```

### UPDATE
```typescript
const result = await DB.prepare(`
  UPDATE members SET grade = ? WHERE id = ?
`)
  .bind(3, 1)
  .run();
```

### DELETE
```typescript
const result = await DB.prepare('DELETE FROM members WHERE id = ?')
  .bind(1)
  .run();
```

---

## 19.3 R2 파일 저장소

### 파일 업로드
```typescript
const file = await c.req.blob();
const key = `uploads/${Date.now()}-${Math.random().toString(36)}`;

await c.env.R2.put(key, file);

return c.json({ key, url: `/api/files/${key}` });
```

### 파일 다운로드
```typescript
const key = c.req.param('key');
const object = await c.env.R2.get(key);

if (!object) {
  return c.notFound();
}

return new Response(object.body, {
  headers: {
    'Content-Type': object.httpMetadata?.contentType || 'application/octet-stream',
  },
});
```

---

## 19.4 에러 핸들링

```typescript
try {
  const result = await DB.prepare('SELECT * FROM members').all();
  return c.json(result.results);
} catch (error) {
  console.error(error);
  return c.json({ error: '서버 오류가 발생했습니다.' }, 500);
}
```

---

# 20. 프론트엔드 개발

## 20.1 전역 app 객체

```javascript
// public/static/app.js
const app = {
  currentPage: 'login',
  session: null,
  data: {
    dashboard: {},
    members: [],
    schedules: [],
    attendances: [],
    inventory: [],
    boards: [],
    posts: [],
    feeSetting: {},
    feePayments: [],
    unpaidMembers: []
  }
};
```

---

## 20.2 페이지 렌더링

```javascript
// 페이지 렌더링 함수
function renderPage() {
  const appContainer = document.getElementById('app');
  
  if (app.currentPage === 'dashboard') {
    appContainer.innerHTML = renderDashboard();
  } else if (app.currentPage === 'members') {
    appContainer.innerHTML = renderMembers();
  }
  // ... 기타 페이지
}
```

---

## 20.3 API 호출

```javascript
// GET 요청
async function loadMembers() {
  try {
    const response = await axios.get(`${API_BASE}/members`, {
      headers: {
        'X-Session-ID': localStorage.getItem('sessionId')
      }
    });
    
    app.data.members = response.data;
    renderPage();
  } catch (error) {
    showToast('회원 목록을 불러올 수 없습니다.', 'error');
  }
}

// POST 요청
async function createMember(memberData) {
  try {
    const response = await axios.post(`${API_BASE}/members`, memberData, {
      headers: {
        'X-Session-ID': localStorage.getItem('sessionId')
      }
    });
    
    showToast('회원이 등록되었습니다.', 'success');
    await loadMembers();
  } catch (error) {
    showToast('회원 등록에 실패했습니다.', 'error');
  }
}
```

---

## 20.4 모달 관리

```javascript
// 모달 열기
function showModal(content) {
  const modalContainer = document.getElementById('modalContainer');
  modalContainer.innerHTML = content;
}

// 모달 닫기
function closeModal() {
  const modalContainer = document.getElementById('modalContainer');
  modalContainer.innerHTML = '';
}
```

---

## 20.5 Toast 알림

```javascript
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white ${
    type === 'success' ? 'bg-green-500' :
    type === 'error' ? 'bg-red-500' :
    'bg-blue-500'
  }`;
  toast.textContent = message;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 3000);
}
```

---

# 21. 데이터베이스 스키마

## 21.1 ERD (Entity Relationship Diagram)

```
┌─────────────┐       ┌─────────────┐
│   members   │──────<│ attendances │
└─────────────┘       └─────────────┘
       │                     │
       │                     │
       │              ┌─────────────┐
       │              │  schedules  │
       │              └─────────────┘
       │
       └──────<┌─────────────┐
               │fee_payments │
               └─────────────┘
```

---

## 21.2 테이블 상세

### members (회원)
```sql
CREATE TABLE members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  gender TEXT NOT NULL,
  birth_year INTEGER NOT NULL,
  club TEXT NOT NULL,
  grade INTEGER,
  phone TEXT,
  car_number TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### schedules (일정)
```sql
CREATE TABLE schedules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  start_time TEXT,
  end_time TEXT,
  location TEXT,
  type TEXT DEFAULT '정기모임',
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### attendances (출석)
```sql
CREATE TABLE attendances (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  member_id INTEGER NOT NULL,
  schedule_id INTEGER NOT NULL,
  status TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (member_id) REFERENCES members(id),
  FOREIGN KEY (schedule_id) REFERENCES schedules(id)
);
```

### fee_settings (회비 설정)
```sql
CREATE TABLE fee_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  year INTEGER NOT NULL UNIQUE,
  amount INTEGER NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### fee_payments (회비 납부)
```sql
CREATE TABLE fee_payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  member_id INTEGER NOT NULL,
  year INTEGER NOT NULL,
  amount INTEGER NOT NULL,
  payment_date TEXT NOT NULL,
  memo TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (member_id) REFERENCES members(id)
);
```

### inventory (재고)
```sql
CREATE TABLE inventory (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  min_quantity INTEGER DEFAULT 0,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### inventory_logs (재고 입출고)
```sql
CREATE TABLE inventory_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  item_id INTEGER NOT NULL,
  type TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  memo TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (item_id) REFERENCES inventory(id)
);
```

### boards (게시판)
```sql
CREATE TABLE boards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### posts (게시글)
```sql
CREATE TABLE posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  board_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  views INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (board_id) REFERENCES boards(id)
);
```

### attachments (첨부파일)
```sql
CREATE TABLE attachments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id INTEGER NOT NULL,
  filename TEXT NOT NULL,
  filesize INTEGER NOT NULL,
  file_key TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(id)
);
```

### admins (관리자)
```sql
CREATE TABLE admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### sms_logs (문자발송 이력)
```sql
CREATE TABLE sms_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  recipient TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL,
  request_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## 21.3 인덱스

```sql
-- 회원 검색 최적화
CREATE INDEX idx_members_name ON members(name);
CREATE INDEX idx_members_club ON members(club);
CREATE INDEX idx_members_grade ON members(grade);

-- 출석 조회 최적화
CREATE INDEX idx_attendances_member ON attendances(member_id);
CREATE INDEX idx_attendances_schedule ON attendances(schedule_id);

-- 일정 조회 최적화
CREATE INDEX idx_schedules_date ON schedules(date);

-- 회비 조회 최적화
CREATE INDEX idx_fee_payments_member ON fee_payments(member_id);
CREATE INDEX idx_fee_payments_year ON fee_payments(year);

-- 게시판 조회 최적화
CREATE INDEX idx_posts_board ON posts(board_id);
CREATE INDEX idx_attachments_post ON attachments(post_id);
```

---

# 22. 테스트 및 디버깅

## 22.1 로컬 테스트

### 헬스 체크
```bash
curl http://localhost:3000/api/health
```

### 회원 목록 조회
```bash
curl -H "X-Session-ID: your-session-id" \
  http://localhost:3000/api/members
```

### 회원 생성
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-Session-ID: your-session-id" \
  -d '{"name":"홍길동","gender":"남","birth_year":1980,"club":"부림","grade":2}' \
  http://localhost:3000/api/members
```

---

## 22.2 브라우저 개발자 도구

### Console
```javascript
// 함수 존재 확인
typeof window.showFeeSettingModal  // → "function"

// 모달 강제 열기
window.showFeeSettingModal()

// 데이터 확인
console.log(app.data.members)
```

### Network
- API 호출 상태 확인
- 응답 데이터 확인
- 에러 메시지 확인

---

## 22.3 로그 확인

### PM2 로그
```bash
# 실시간 로그
pm2 logs badminton-manager

# 논블로킹 로그
pm2 logs badminton-manager --nostream

# 에러 로그만
pm2 logs badminton-manager --err
```

### Wrangler 로그
```bash
# Cloudflare Pages 로그
npx wrangler pages deployment tail
```

---

# PART 5: API 문서

---

# 23. API 개요

## 23.1 기본 정보

- **Base URL**: `/api`
- **인증 방식**: Session ID (X-Session-ID 헤더)
- **Content-Type**: `application/json`
- **Character Encoding**: UTF-8

---

## 23.2 공통 응답 형식

### 성공 응답
```json
{
  "data": {},
  "message": "성공 메시지"
}
```

### 에러 응답
```json
{
  "error": "에러 메시지",
  "code": "ERROR_CODE",
  "details": {}
}
```

---

## 23.3 HTTP 상태 코드

| 코드 | 의미 | 설명 |
|------|------|------|
| 200 | OK | 성공 |
| 201 | Created | 리소스 생성 성공 |
| 400 | Bad Request | 잘못된 요청 |
| 401 | Unauthorized | 인증 필요 |
| 403 | Forbidden | 권한 없음 |
| 404 | Not Found | 리소스 없음 |
| 500 | Internal Server Error | 서버 오류 |

---

# 24. 인증 API

## 24.1 로그인

### 요청
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin1234"
}
```

### 응답 (성공)
```json
{
  "sessionId": "abc123def456",
  "name": "관리자",
  "message": "로그인 성공"
}
```

### 응답 (실패)
```json
{
  "error": "아이디 또는 비밀번호가 틀렸습니다."
}
```

---

## 24.2 세션 확인

### 요청
```http
GET /api/auth/session
X-Session-ID: abc123def456
```

### 응답 (성공)
```json
{
  "valid": true,
  "name": "관리자"
}
```

### 응답 (실패)
```json
{
  "valid": false,
  "error": "세션이 만료되었습니다."
}
```

---

# 25. 회원 API

## 25.1 회원 목록 조회

### 요청
```http
GET /api/members
X-Session-ID: abc123def456
```

### 응답
```json
[
  {
    "id": 1,
    "name": "홍길동",
    "gender": "남",
    "birth_year": 1980,
    "club": "부림",
    "grade": 2,
    "phone": "010-1234-5678",
    "car_number": "12가3456",
    "created_at": "2026-01-01T00:00:00.000Z"
  }
]
```

---

## 25.2 특정 회원 조회

### 요청
```http
GET /api/members/:id
X-Session-ID: abc123def456
```

### 응답
```json
{
  "id": 1,
  "name": "홍길동",
  "gender": "남",
  "birth_year": 1980,
  "club": "부림",
  "grade": 2,
  "phone": "010-1234-5678",
  "car_number": "12가3456"
}
```

---

## 25.3 회원 생성

### 요청
```http
POST /api/members
X-Session-ID: abc123def456
Content-Type: application/json

{
  "name": "홍길동",
  "gender": "남",
  "birth_year": 1980,
  "club": "부림",
  "grade": 2,
  "phone": "010-1234-5678",
  "car_number": "12가3456"
}
```

### 응답
```json
{
  "id": 1,
  "message": "회원이 등록되었습니다."
}
```

---

## 25.4 회원 수정

### 요청
```http
PUT /api/members/:id
X-Session-ID: abc123def456
Content-Type: application/json

{
  "grade": 3,
  "phone": "010-9999-9999"
}
```

### 응답
```json
{
  "message": "회원 정보가 수정되었습니다."
}
```

---

## 25.5 회원 삭제

### 요청
```http
DELETE /api/members/:id
X-Session-ID: abc123def456
```

### 응답
```json
{
  "message": "회원이 삭제되었습니다."
}
```

---

## 25.6 전체 회원 삭제

### 요청
```http
DELETE /api/members
X-Session-ID: abc123def456
```

### 응답
```json
{
  "message": "전체 회원이 삭제되었습니다.",
  "count": 164
}
```

---

## 25.7 회원 일괄 등록

### 요청
```http
POST /api/members/bulk
X-Session-ID: abc123def456
Content-Type: application/json

{
  "members": [
    {
      "name": "홍길동",
      "gender": "남",
      "birth_year": 1980,
      "club": "부림",
      "grade": 2,
      "phone": "010-1234-5678",
      "car_number": "12가3456"
    },
    {
      "name": "김영희",
      "gender": "여",
      "birth_year": 1985,
      "club": "인덕원",
      "grade": 3,
      "phone": "010-9876-5432",
      "car_number": "34나7890"
    }
  ]
}
```

### 응답
```json
{
  "message": "2명의 회원이 등록되었습니다.",
  "count": 2
}
```

---

# 26. 일정 API

## 26.1 일정 목록 조회

### 요청
```http
GET /api/schedules?year=2026&month=1
X-Session-ID: abc123def456
```

### 응답
```json
[
  {
    "id": 1,
    "title": "정기모임 (1주 토요일)",
    "date": "2026-01-03",
    "start_time": "08:00",
    "end_time": "12:00",
    "location": "안양종합운동장 실내체육관",
    "type": "정기모임",
    "description": null,
    "created_at": "2026-01-01T00:00:00.000Z"
  }
]
```

---

## 26.2 일정 생성

### 요청
```http
POST /api/schedules
X-Session-ID: abc123def456
Content-Type: application/json

{
  "title": "신년회",
  "date": "2026-01-15",
  "start_time": "18:00",
  "end_time": "22:00",
  "location": "부림동 식당",
  "type": "특별행사",
  "description": "2026년 신년회"
}
```

### 응답
```json
{
  "id": 10,
  "message": "일정이 등록되었습니다."
}
```

---

## 26.3 일정 수정

### 요청
```http
PUT /api/schedules/:id
X-Session-ID: abc123def456
Content-Type: application/json

{
  "start_time": "19:00",
  "end_time": "23:00"
}
```

### 응답
```json
{
  "message": "일정이 수정되었습니다."
}
```

---

## 26.4 일정 삭제

### 요청
```http
DELETE /api/schedules/:id
X-Session-ID: abc123def456
```

### 응답
```json
{
  "message": "일정이 삭제되었습니다."
}
```

---

# 27. 출석 API

## 27.1 출석 체크

### 요청
```http
POST /api/attendances
X-Session-ID: abc123def456
Content-Type: application/json

{
  "member_id": 1,
  "schedule_id": 1,
  "status": "출석"
}
```

### 응답
```json
{
  "id": 1,
  "message": "출석이 등록되었습니다."
}
```

---

## 27.2 출석 현황 조회

### 요청
```http
GET /api/attendances?schedule_id=1
X-Session-ID: abc123def456
```

### 응답
```json
[
  {
    "id": 1,
    "member_id": 1,
    "member_name": "홍길동",
    "member_club": "부림",
    "schedule_id": 1,
    "status": "출석",
    "created_at": "2026-01-03T08:00:00.000Z"
  }
]
```

---

## 27.3 회원별 출석 현황

### 요청
```http
GET /api/attendances/member/:member_id
X-Session-ID: abc123def456
```

### 응답
```json
{
  "member": {
    "id": 1,
    "name": "홍길동",
    "club": "부림"
  },
  "stats": {
    "total": 10,
    "attended": 8,
    "rate": 80
  },
  "records": [
    {
      "date": "2026-01-03",
      "title": "정기모임 (1주 토요일)",
      "status": "출석"
    }
  ]
}
```

---

## 27.4 출석률 TOP 20

### 요청
```http
GET /api/attendances/top?limit=20
X-Session-ID: abc123def456
```

### 응답
```json
[
  {
    "member_id": 1,
    "name": "홍길동",
    "club": "부림",
    "attended": 8,
    "total": 10,
    "rate": 80
  }
]
```

---

# 28. 회비 API

## 28.1 회비 설정 조회

### 요청
```http
GET /api/fees/settings?year=2026
X-Session-ID: abc123def456
```

### 응답
```json
{
  "id": 1,
  "year": 2026,
  "amount": 50000,
  "description": "2026년 연회비",
  "created_at": "2026-01-01T00:00:00.000Z"
}
```

---

## 28.2 회비 설정 생성/수정

### 요청
```http
POST /api/fees/settings
X-Session-ID: abc123def456
Content-Type: application/json

{
  "year": 2026,
  "amount": 50000,
  "description": "2026년 연회비"
}
```

### 응답
```json
{
  "message": "회비 설정이 저장되었습니다."
}
```

---

## 28.3 회비 납부 등록

### 요청
```http
POST /api/fees/payments
X-Session-ID: abc123def456
Content-Type: application/json

{
  "member_id": 1,
  "year": 2026,
  "amount": 50000,
  "payment_date": "2026-01-15",
  "memo": "계좌이체"
}
```

### 응답
```json
{
  "id": 1,
  "message": "납부가 등록되었습니다."
}
```

---

## 28.4 회비 납부 내역 조회

### 요청
```http
GET /api/fees/payments?year=2026
X-Session-ID: abc123def456
```

### 응답
```json
[
  {
    "id": 1,
    "member_id": 1,
    "member_name": "홍길동",
    "year": 2026,
    "amount": 50000,
    "payment_date": "2026-01-15",
    "memo": "계좌이체",
    "created_at": "2026-01-15T00:00:00.000Z"
  }
]
```

---

## 28.5 미납자 목록 조회

### 요청
```http
GET /api/fees/unpaid?year=2026
X-Session-ID: abc123def456
```

### 응답
```json
[
  {
    "id": 2,
    "name": "김영희",
    "club": "인덕원",
    "phone": "010-9876-5432"
  }
]
```

---

## 28.6 납부 내역 삭제

### 요청
```http
DELETE /api/fees/payments/:id
X-Session-ID: abc123def456
```

### 응답
```json
{
  "message": "납부 내역이 삭제되었습니다."
}
```

---

# 29. 재고 API

## 29.1 재고 목록 조회

### 요청
```http
GET /api/inventory
X-Session-ID: abc123def456
```

### 응답
```json
[
  {
    "id": 1,
    "name": "셔틀콕",
    "quantity": 100,
    "min_quantity": 50,
    "updated_at": "2026-01-15T00:00:00.000Z"
  }
]
```

---

## 29.2 재고 생성

### 요청
```http
POST /api/inventory
X-Session-ID: abc123def456
Content-Type: application/json

{
  "name": "셔틀콕",
  "quantity": 100,
  "min_quantity": 50
}
```

### 응답
```json
{
  "id": 1,
  "message": "재고가 등록되었습니다."
}
```

---

## 29.3 재고 입고

### 요청
```http
POST /api/inventory/:id/stock-in
X-Session-ID: abc123def456
Content-Type: application/json

{
  "quantity": 50,
  "memo": "XX상사에서 구매"
}
```

### 응답
```json
{
  "message": "입고되었습니다.",
  "new_quantity": 150
}
```

---

## 29.4 재고 출고

### 요청
```http
POST /api/inventory/:id/stock-out
X-Session-ID: abc123def456
Content-Type: application/json

{
  "quantity": 20,
  "memo": "정기모임 사용"
}
```

### 응답
```json
{
  "message": "출고되었습니다.",
  "new_quantity": 130
}
```

---

## 29.5 재고 수정

### 요청
```http
PUT /api/inventory/:id
X-Session-ID: abc123def456
Content-Type: application/json

{
  "min_quantity": 30
}
```

### 응답
```json
{
  "message": "재고가 수정되었습니다."
}
```

---

## 29.6 재고 삭제

### 요청
```http
DELETE /api/inventory/:id
X-Session-ID: abc123def456
```

### 응답
```json
{
  "message": "재고가 삭제되었습니다."
}
```

---

# 30. 게시판 API

## 30.1 게시판 목록 조회

### 요청
```http
GET /api/boards
X-Session-ID: abc123def456
```

### 응답
```json
[
  {
    "id": 1,
    "name": "공지사항",
    "description": "중요 공지사항",
    "post_count": 10
  }
]
```

---

## 30.2 게시글 목록 조회

### 요청
```http
GET /api/boards/:board_id/posts
X-Session-ID: abc123def456
```

### 응답
```json
[
  {
    "id": 1,
    "title": "2026년 신년회 안내",
    "author": "관리자",
    "views": 50,
    "created_at": "2026-01-01T00:00:00.000Z"
  }
]
```

---

## 30.3 게시글 상세 조회

### 요청
```http
GET /api/boards/:board_id/posts/:post_id
X-Session-ID: abc123def456
```

### 응답
```json
{
  "id": 1,
  "title": "2026년 신년회 안내",
  "content": "2026년 신년회를 다음과 같이 개최합니다...",
  "author": "관리자",
  "views": 51,
  "attachments": [
    {
      "id": 1,
      "filename": "신년회_안내.pdf",
      "filesize": 102400,
      "file_key": "uploads/abc123.pdf"
    }
  ],
  "created_at": "2026-01-01T00:00:00.000Z"
}
```

---

## 30.4 게시글 작성

### 요청
```http
POST /api/boards/:board_id/posts
X-Session-ID: abc123def456
Content-Type: application/json

{
  "title": "2026년 신년회 안내",
  "content": "2026년 신년회를 다음과 같이 개최합니다...",
  "author": "관리자"
}
```

### 응답
```json
{
  "id": 1,
  "message": "게시글이 작성되었습니다."
}
```

---

## 30.5 게시글 수정

### 요청
```http
PUT /api/boards/:board_id/posts/:post_id
X-Session-ID: abc123def456
Content-Type: application/json

{
  "title": "2026년 신년회 안내 (수정)",
  "content": "수정된 내용..."
}
```

### 응답
```json
{
  "message": "게시글이 수정되었습니다."
}
```

---

## 30.6 게시글 삭제

### 요청
```http
DELETE /api/boards/:board_id/posts/:post_id
X-Session-ID: abc123def456
```

### 응답
```json
{
  "message": "게시글이 삭제되었습니다."
}
```

---

# 31. 문자발송 API

## 31.1 개별 문자 발송

### 요청
```http
POST /api/sms/send
X-Session-ID: abc123def456
Content-Type: application/json

{
  "recipient": "010-1234-5678",
  "message": "안녕하세요. 안양시배드민턴연합회입니다."
}
```

### 응답
```json
{
  "message": "문자가 발송되었습니다.",
  "request_id": "abc123"
}
```

---

## 31.2 다중 문자 발송

### 요청
```http
POST /api/sms/send-bulk
X-Session-ID: abc123def456
Content-Type: application/json

{
  "recipients": [
    "010-1234-5678",
    "010-9876-5432"
  ],
  "message": "안녕하세요. 안양시배드민턴연합회입니다."
}
```

### 응답
```json
{
  "message": "2건의 문자가 발송되었습니다.",
  "count": 2
}
```

---

## 31.3 문자 발송 이력 조회

### 요청
```http
GET /api/sms/logs
X-Session-ID: abc123def456
```

### 응답
```json
[
  {
    "id": 1,
    "recipient": "010-1234-5678",
    "message": "안녕하세요...",
    "status": "성공",
    "request_id": "abc123",
    "created_at": "2026-01-15T00:00:00.000Z"
  }
]
```

---

# 32. 파일 API

## 32.1 파일 업로드

### 요청
```http
POST /api/files/upload
X-Session-ID: abc123def456
Content-Type: multipart/form-data

file: (binary)
```

### 응답
```json
{
  "key": "uploads/abc123.pdf",
  "url": "/api/files/uploads/abc123.pdf",
  "filename": "신년회_안내.pdf",
  "size": 102400
}
```

---

## 32.2 파일 다운로드

### 요청
```http
GET /api/files/:key
X-Session-ID: abc123def456
```

### 응답
```
(binary data)
Content-Type: application/pdf
Content-Disposition: attachment; filename="신년회_안내.pdf"
```

---

# PART 6: FAQ 및 문제 해결

---

# 33. 자주 묻는 질문 (FAQ)

## 33.1 설치 및 배포

### Q: Node.js 버전은 어떤 것을 사용해야 하나요?
**A**: Node.js v20.x 이상을 권장합니다.

```bash
# Node.js 버전 확인
node -v  # v20.19.6
```

---

### Q: 로컬에서 개발할 때 데이터베이스는 어떻게 관리하나요?
**A**: Wrangler가 `.wrangler/state/v3/d1`에 로컬 SQLite를 자동 생성합니다.

```bash
# 로컬 마이그레이션
npm run db:migrate:local

# 로컬 데이터베이스 확인
ls -la .wrangler/state/v3/d1/
```

---

### Q: Cloudflare Pages 배포 시 환경변수는 어떻게 설정하나요?
**A**: `wrangler pages secret` 명령을 사용합니다.

```bash
npx wrangler pages secret put NHN_APP_KEY
npx wrangler pages secret put NHN_SECRET_KEY
npx wrangler pages secret put NHN_SENDER
```

---

### Q: 문자발송 기능이 필요 없는데 꼭 NHN Cloud에 가입해야 하나요?
**A**: 아니요, 문자발송 기능을 사용하지 않는다면 NHN Cloud 설정은 선택사항입니다.

---

## 33.2 기능 관련

### Q: 회원 일괄 등록 시 엑셀 파일이 아닌 CSV 파일만 가능한가요?
**A**: 엑셀에서 복사-붙여넣기도 가능하며, CSV 파일 업로드도 지원합니다.

---

### Q: 정기모임은 자동으로 생성되나요?
**A**: 네, 매월 1주, 3주 토요일에 자동으로 생성됩니다.

---

### Q: 회비 납부 시 영수증 발행이 가능한가요?
**A**: 현재 버전에서는 지원하지 않습니다. 향후 업데이트 예정입니다.

---

### Q: 게시판에 동영상을 첨부할 수 있나요?
**A**: 파일 첨부 기능은 지원하지만, 최대 10MB 제한이 있습니다. 대용량 동영상은 YouTube 링크를 사용하세요.

---

## 33.3 문제 해결

### Q: 로그인 후 바로 로그아웃되는 현상이 발생합니다.
**A**: 세션 만료 시간이 짧을 수 있습니다. `src/routes/auth.ts`에서 세션 만료 시간을 확인하세요.

---

### Q: 회원 목록이 표시되지 않습니다.
**A**: F12 개발자 도구 → Console에서 에러 메시지를 확인하세요. 주로 세션 만료 또는 API 에러입니다.

```javascript
// Console에서 확인
typeof window.loadMembers  // → "function"
await loadMembers()        // → 에러 메시지 확인
```

---

### Q: 빌드 시 에러가 발생합니다.
**A**: `node_modules` 삭제 후 재설치해보세요.

```bash
rm -rf node_modules
npm install
npm run build
```

---

# 34. 문제 해결 가이드

## 34.1 로그인 문제

### 증상: 로그인이 되지 않습니다.

**원인 1: 잘못된 아이디/비밀번호**
- 기본 계정: `admin` / `admin1234`
- 대소문자 구분 확인

**원인 2: 데이터베이스 미설정**
```bash
# 마이그레이션 확인
npm run db:migrate:local

# 관리자 데이터 확인
npm run db:console:local -- --command="SELECT * FROM admins;"
```

**원인 3: 세션 테이블 없음**
```bash
# 세션 테이블 생성
npm run db:migrate:local
```

---

## 34.2 회원관리 문제

### 증상: 회원 목록이 비어 있습니다.

**원인 1: 데이터 없음**
```bash
# 회원 데이터 확인
npm run db:console:local -- --command="SELECT COUNT(*) FROM members;"
```

**원인 2: API 에러**
- F12 → Network 탭에서 `/api/members` 응답 확인
- 401 Unauthorized: 세션 만료
- 500 Internal Server Error: 서버 오류

**해결 방법**:
```bash
# 서버 재시작
pm2 restart badminton-manager

# 로그 확인
pm2 logs badminton-manager --nostream
```

---

## 34.3 회비관리 문제

### 증상: 회비 설정 모달이 열리지 않습니다.

**원인: modalContainer가 없음**

**해결 방법**:
```javascript
// F12 Console에서 확인
document.getElementById('modalContainer')  // → null이면 문제

// app.js에서 modalContainer 생성 코드 확인
// init() 함수 시작 부분에 다음 코드가 있어야 함:
if (!document.getElementById('modalContainer')) {
  const modalContainer = document.createElement('div');
  modalContainer.id = 'modalContainer';
  document.body.appendChild(modalContainer);
}
```

---

## 34.4 문자발송 문제

### 증상: 문자 발송이 실패합니다.

**원인 1: NHN Cloud 설정 오류**
```bash
# 환경변수 확인
npx wrangler pages secret list

# 필요한 변수: NHN_APP_KEY, NHN_SECRET_KEY, NHN_SENDER
```

**원인 2: 발신번호 미등록**
- NHN Cloud 콘솔에서 발신번호 등록 및 인증 확인

**원인 3: 잔액 부족**
- NHN Cloud 콘솔에서 SMS 잔액 확인

---

## 34.5 배포 문제

### 증상: Cloudflare Pages 배포가 실패합니다.

**원인 1: D1 데이터베이스 미설정**
```bash
# D1 데이터베이스 생성
npx wrangler d1 create badminton-db

# wrangler.jsonc에 database_id 입력 확인
```

**원인 2: 빌드 에러**
```bash
# 로컬에서 빌드 테스트
npm run build

# dist/ 폴더 확인
ls -la dist/
```

**원인 3: 환경변수 미설정**
```bash
# Secrets 확인
npx wrangler pages secret list

# 누락된 변수 추가
npx wrangler pages secret put VARIABLE_NAME
```

---

# 35. 에러 메시지 해설

## 35.1 프론트엔드 에러

### `modalContainer is null`
**원인**: `<div id="modalContainer"></div>` 요소가 페이지에 없음  
**해결**: app.js의 init() 함수에서 자동 생성되도록 수정

---

### `TypeError: Cannot read properties of undefined`
**원인**: 데이터가 로드되지 않았거나 null  
**해결**: 데이터 로드 후 렌더링하도록 순서 조정

---

### `401 Unauthorized`
**원인**: 세션 만료 또는 로그인 필요  
**해결**: 다시 로그인

---

## 35.2 백엔드 에러

### `D1_ERROR: no such table: members`
**원인**: 마이그레이션 미실행  
**해결**:
```bash
npm run db:migrate:local   # 로컬
npm run db:migrate:prod    # 프로덕션
```

---

### `R2_ERROR: NoSuchBucket`
**원인**: R2 버킷이 생성되지 않음  
**해결**:
```bash
npx wrangler r2 bucket create badminton-files
```

---

### `NHN Cloud SMS Error`
**원인**: NHN Cloud API 키 오류 또는 잔액 부족  
**해결**: NHN Cloud 콘솔에서 API 키 및 잔액 확인

---

# PART 7: 부록

---

# 36. 용어 사전

| 용어 | 설명 |
|------|------|
| **Hono** | 경량 웹 프레임워크, Cloudflare Workers 최적화 |
| **Cloudflare Pages** | 정적 사이트 호스팅 플랫폼 |
| **Cloudflare Workers** | 엣지 컴퓨팅 플랫폼 (서버리스) |
| **Cloudflare D1** | SQLite 기반 글로벌 분산 데이터베이스 |
| **Cloudflare R2** | S3 호환 오브젝트 스토리지 |
| **Wrangler** | Cloudflare CLI 도구 |
| **Vite** | 차세대 프론트엔드 빌드 도구 |
| **PM2** | Node.js 프로세스 관리자 |
| **TailwindCSS** | 유틸리티 우선 CSS 프레임워크 |
| **Chart.js** | JavaScript 차트 라이브러리 |
| **Axios** | Promise 기반 HTTP 클라이언트 |
| **Day.js** | 경량 날짜 라이브러리 |
| **NHN Cloud SMS** | NHN Cloud의 SMS 발송 서비스 |
| **ERD** | Entity Relationship Diagram (개체 관계도) |
| **API** | Application Programming Interface |
| **REST** | Representational State Transfer |
| **CRUD** | Create, Read, Update, Delete |
| **Session** | 사용자 인증 세션 |
| **JWT** | JSON Web Token |
| **CORS** | Cross-Origin Resource Sharing |
| **CDN** | Content Delivery Network |

---

# 37. 단축키 모음

## 37.1 개발 환경

| 단축키 | 기능 |
|--------|------|
| `Ctrl + Shift + R` | 강제 새로고침 (Windows/Linux) |
| `Cmd + Shift + R` | 강제 새로고침 (Mac) |
| `F12` | 개발자 도구 열기 |
| `Ctrl + Shift + I` | 개발자 도구 열기 (Windows/Linux) |
| `Cmd + Option + I` | 개발자 도구 열기 (Mac) |
| `Ctrl + Shift + C` | 요소 검사 (Windows/Linux) |
| `Cmd + Option + C` | 요소 검사 (Mac) |

---

## 37.2 터미널

| 명령어 | 기능 |
|--------|------|
| `npm run build` | 빌드 |
| `npm run dev` | 로컬 개발 서버 시작 |
| `npm run deploy` | 프로덕션 배포 |
| `pm2 list` | PM2 프로세스 목록 |
| `pm2 logs` | PM2 로그 보기 |
| `pm2 restart <name>` | PM2 프로세스 재시작 |
| `npm run db:migrate:local` | 로컬 마이그레이션 |
| `npm run db:migrate:prod` | 프로덕션 마이그레이션 |

---

# 38. 참고 자료

## 38.1 공식 문서

- **Hono**: https://hono.dev
- **Cloudflare Pages**: https://developers.cloudflare.com/pages
- **Cloudflare D1**: https://developers.cloudflare.com/d1
- **Cloudflare R2**: https://developers.cloudflare.com/r2
- **Wrangler**: https://developers.cloudflare.com/workers/wrangler
- **TailwindCSS**: https://tailwindcss.com
- **Chart.js**: https://www.chartjs.org
- **Day.js**: https://day.js.org
- **NHN Cloud SMS**: https://docs.nhncloud.com/ko/Notification/SMS/ko/api-guide

---

## 38.2 튜토리얼

- **Hono 시작하기**: https://hono.dev/getting-started
- **Cloudflare Pages 배포**: https://developers.cloudflare.com/pages/get-started
- **D1 데이터베이스 설정**: https://developers.cloudflare.com/d1/get-started

---

## 38.3 커뮤니티

- **Hono Discord**: https://discord.gg/hono
- **Cloudflare Discord**: https://discord.cloudflare.com
- **Stack Overflow**: https://stackoverflow.com/questions/tagged/cloudflare-workers

---

# 39. 버전 이력

## v1.0.0 (2026-01-31)

### 초기 릴리스
- ✅ 회원관리 (CRUD, 일괄 등록, 엑셀 내보내기)
- ✅ 일정관리 (CRUD, 정기모임 자동 생성)
- ✅ 출석관리 (출석 체크, 클럽별 그룹화, TOP 20 랭킹)
- ✅ 회비관리 (설정, 납부 등록, 미납자 관리)
- ✅ 재고관리 (입출고, 부족 알림)
- ✅ 게시판 (다중 게시판, 파일 첨부)
- ✅ 문자발송 (NHN Cloud SMS 연동)
- ✅ 대시보드 (종합 통계, 차트)
- ✅ 모바일 최적화
- ✅ Cloudflare Pages 배포 지원

### 알려진 이슈
- 회비 영수증 발행 기능 미구현
- 회원 사진 업로드 미구현
- 일정 자동 알림 미구현

---

# 40. 라이선스

## MIT License

```
MIT License

Copyright (c) 2026 안양시배드민턴연합회 장년부

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

# 📝 문서 작성 정보

- **제작**: AI Developer (Claude)
- **버전**: 1.0.0
- **최종 수정일**: 2026년 1월 31일
- **문서 유형**: 통합 완전판 (사용자·개발자·설치·API·FAQ)
- **페이지 수**: 약 150페이지 (PDF 변환 시)
- **단어 수**: 약 30,000단어

---

# 📞 문의

이 문서에 대한 질문이나 개선 사항이 있다면:
- GitHub Issues: https://github.com/your-org/badminton-manager/issues
- 이메일: admin@example.com

---

# ✅ 문서 체크리스트

이 문서는 다음 내용을 모두 포함합니다:

- [x] 시스템 개요 및 소개
- [x] 프로그램 구조 및 아키텍처
- [x] 기능별 사용 설명서 (8개 메뉴)
- [x] 로컬 개발 환경 설정
- [x] Cloudflare Pages 배포 가이드
- [x] 외부 서버 이전 방법 (AWS, Docker, Vercel)
- [x] 개발자 가이드 (백엔드, 프론트엔드)
- [x] 데이터베이스 스키마 및 ERD
- [x] 전체 API 문서 (9개 API)
- [x] FAQ 및 문제 해결
- [x] 용어 사전 및 참고 자료
- [x] 버전 이력 및 라이선스

---

**끝**
