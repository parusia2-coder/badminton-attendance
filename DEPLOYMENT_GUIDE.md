# 🚀 Cloudflare Pages 배포 가이드

**도메인**: 안양시장년부.kr (가비아)  
**프로젝트명**: badminton-manager  
**GitHub**: https://github.com/parusia2-coder/badminton-attendance

---

## ✅ 완료된 작업

1. ✅ GitHub 코드 푸시 완료
2. ✅ 프로젝트 이름 설정 (`badminton-manager`)
3. ✅ 도메인 구매 완료 (`안양시장년부.kr`)

---

## 📋 다음 단계

### **Step 1: Cloudflare API 키 설정** (2분)

1. **Deploy 탭으로 이동**
   - 좌측 사이드바에서 `Deploy` 클릭

2. **Cloudflare API 키 생성**
   - Cloudflare 대시보드: https://dash.cloudflare.com/profile/api-tokens
   - "Create Token" 클릭
   - "Edit Cloudflare Workers" 템플릿 선택
   - 또는 "Custom token" 선택 후 권한 설정:
     - `Account` → `Cloudflare Pages` → `Edit`
     - `Zone` → `DNS` → `Edit`
     - `Zone` → `Zone` → `Read`

3. **API 키 저장**
   - Deploy 탭에서 생성한 API 키 입력
   - 저장

---

### **Step 2: Cloudflare Pages 프로젝트 생성** (3분)

#### **방법 A: Cloudflare Dashboard 사용 (추천)** ⭐

1. **Cloudflare 대시보드 접속**
   ```
   https://dash.cloudflare.com
   ```

2. **Workers & Pages → Create application**
   - "Pages" 탭 클릭
   - "Connect to Git" 선택

3. **GitHub 연결**
   - GitHub 계정 연동
   - 저장소 선택: `badminton-attendance`
   - Branch: `main`

4. **빌드 설정**
   ```
   프로젝트명: badminton-manager
   프로덕션 브랜치: main
   빌드 명령어: npm run build
   빌드 출력 디렉토리: dist
   ```

5. **환경 변수 설정** (나중에 추가)
   - 일단 기본 설정으로 배포
   - D1 바인딩은 Step 3에서 추가

6. **Save and Deploy** 클릭

#### **방법 B: Wrangler CLI 사용** (터미널)

```bash
# API 키 설정 후 실행
cd /home/user/webapp

# 프로젝트 생성
npx wrangler pages project create badminton-manager \
  --production-branch main \
  --compatibility-date 2024-01-01

# 배포
npm run build
npx wrangler pages deploy dist --project-name badminton-manager
```

---

### **Step 3: D1 프로덕션 데이터베이스 생성** (3분)

```bash
cd /home/user/webapp

# 1. D1 프로덕션 DB 생성
npx wrangler d1 create badminton-db-production

# 출력 예시:
# Database created!
# [[d1_databases]]
# binding = "DB"
# database_name = "badminton-db-production"
# database_id = "xxxxx-xxxxx-xxxxx-xxxxx"

# 2. wrangler.jsonc에 database_id 업데이트

# 3. 마이그레이션 실행
npx wrangler d1 migrations apply badminton-db-production

# 4. Cloudflare Pages에 D1 바인딩 추가
# Dashboard → Pages → badminton-manager → Settings → Functions
# → D1 database bindings → Add binding
# Variable name: DB
# D1 database: badminton-db-production
```

---

### **Step 4: 도메인 연결** (5분)

#### **4-1. Cloudflare에 도메인 추가**

1. **Cloudflare 대시보드**
   ```
   https://dash.cloudflare.com
   ```

2. **"Add a site" 클릭**
   - 도메인 입력: `안양시장년부.kr`
   - 무료 플랜 선택
   - "Continue" 클릭

3. **네임서버 정보 확인**
   ```
   Cloudflare가 제공하는 네임서버 2개 복사:
   예: 
   - ns1.cloudflare.com
   - ns2.cloudflare.com
   ```

#### **4-2. 가비아에서 네임서버 변경**

1. **가비아 로그인**
   ```
   https://www.gabia.com
   ```

2. **My가비아 → 서비스 관리 → 도메인**

3. **안양시장년부.kr 선택 → 관리 → 네임서버 설정**

4. **네임서버 변경**
   ```
   기본 네임서버 → Cloudflare 네임서버로 변경
   
   1차: ns1.cloudflare.com (또는 Cloudflare 제공 네임서버)
   2차: ns2.cloudflare.com
   ```

5. **저장**
   - ⏳ 네임서버 변경은 최대 24시간 소요 (보통 1-2시간)

#### **4-3. Cloudflare Pages에 커스텀 도메인 추가**

1. **Cloudflare Dashboard → Pages → badminton-manager**

2. **Custom domains 탭**

3. **"Set up a custom domain" 클릭**
   - 도메인 입력: `안양시장년부.kr`
   - "Continue" 클릭

4. **www 서브도메인도 추가 (선택)**
   - `www.안양시장년부.kr`
   - "Continue" 클릭

5. **DNS 레코드 자동 생성**
   - Cloudflare가 자동으로 CNAME 레코드 생성
   - "Activate domain" 클릭

---

## 🎯 **배포 후 확인사항**

### **1. Cloudflare Pages URL 확인**
```
https://badminton-manager.pages.dev
```

### **2. 커스텀 도메인 확인** (네임서버 전파 후)
```
https://안양시장년부.kr
https://www.안양시장년부.kr
```

### **3. HTTPS 확인**
- ✅ 자동으로 SSL 인증서 발급됨
- ✅ HTTP → HTTPS 자동 리다이렉트

### **4. 기능 테스트**
- [ ] 랜딩 페이지 로드
- [ ] 관리자 페이지 접속
- [ ] 로그인 (admin / admin1234)
- [ ] 팝업 표시
- [ ] 히어로 이미지 슬라이더
- [ ] 일정 달력
- [ ] 가입 신청 폼

---

## 📊 **배포 타임라인**

| 작업 | 소요 시간 | 상태 |
|------|----------|------|
| GitHub 푸시 | 1분 | ✅ 완료 |
| Cloudflare API 키 설정 | 2분 | ⏳ 대기 |
| Pages 프로젝트 생성 | 3분 | ⏳ 대기 |
| D1 DB 생성 및 마이그레이션 | 3분 | ⏳ 대기 |
| 도메인 연결 (Cloudflare) | 2분 | ⏳ 대기 |
| 네임서버 변경 (가비아) | 3분 | ⏳ 대기 |
| **전파 대기** | **1-24시간** | ⏳ 대기 |
| **총 작업 시간** | **14분** | |

---

## 🐛 **문제 해결**

### **문제 1: 빌드 실패**
```
원인: 의존성 설치 실패
해결: package.json 확인, npm install 재실행
```

### **문제 2: D1 바인딩 오류**
```
원인: database_id 누락
해결: wrangler.jsonc에 database_id 추가
```

### **문제 3: 도메인 접속 안 됨**
```
원인: 네임서버 전파 대기 중
해결: 1-24시간 기다리기 (보통 1-2시간)
확인: https://www.whatsmydns.net 에서 전파 상태 확인
```

### **문제 4: CORS 오류**
```
원인: API 도메인 불일치
해결: Cloudflare Pages 설정에서 허용 도메인 추가
```

---

## 📞 **다음 단계**

배포가 완료되면:
1. ✅ 실제 사용자 테스트
2. ✅ 회원 데이터 입력
3. ✅ 가입 신청 테스트
4. ✅ 관리자 권한 설정
5. ✅ 백업 자동화 설정

---

## 🎉 **최종 목표**

```
현재: https://3000-sandbox.novita.ai (샌드박스)
목표: https://안양시장년부.kr (프로덕션)

결과:
  ✅ 안정적인 도메인
  ✅ 전 세계 CDN
  ✅ 무료 HTTPS
  ✅ 자동 배포
  ✅ 실제 서비스 가능
```

---

**지금 바로 Deploy 탭으로 이동해서 Cloudflare API 키를 설정하세요!** 🚀
