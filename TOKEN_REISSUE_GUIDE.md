# 🔑 Cloudflare API 토큰 재생성 가이드

**문제**: 현재 토큰에 D1 Database 권한이 없음

**해결**: 토큰을 다시 생성해야 합니다 (2분 소요)

---

## 📋 **올바른 토큰 생성 방법**

### **Option 1: 커스텀 토큰 (추천)** ⭐

1. https://dash.cloudflare.com/profile/api-tokens 접속

2. **"토큰 생성"** 클릭

3. 템플릿에서 **"커스텀 토큰 생성"** 선택 (맨 아래)

4. **권한 설정**:
   ```
   토큰 이름: badminton-deploy-full
   
   권한:
   - 계정 | Cloudflare Pages | 편집
   - 계정 | D1 | 편집           ← 이게 중요!
   - 영역 | Zone | 읽기
   - 영역 | DNS | 편집
   ```

5. **계정 리소스**: 모든 계정

6. **영역 리소스**: 모든 영역

7. **"요약으로 계속"** → **"토큰 생성"**

8. **토큰 복사**

---

### **Option 2: 전체 권한 토큰 (가장 쉬움)** ⭐⭐⭐

**더 간단한 방법**:

1. https://dash.cloudflare.com/profile/api-tokens 접속

2. **"토큰 생성"** 클릭

3. **"API 토큰 템플릿"**에서 찾기:
   ```
   모든 영역 편집
   또는
   계정 전체 권한
   ```

4. **"템플릿 사용"** 클릭

5. 그대로 **"요약으로 계속"** → **"토큰 생성"**

6. **토큰 복사**

---

### **Option 3: 대시보드로 직접 배포 (권장!)** 🎯

**API 토큰 없이 Cloudflare Dashboard로 배포하는 게 더 쉽습니다!**

#### **Dashboard 배포 방법**:

1. **Cloudflare Dashboard 접속**
   ```
   https://dash.cloudflare.com
   ```

2. **좌측 메뉴 → Workers 및 Pages**

3. **"애플리케이션 생성"** 클릭

4. **"Pages" 탭** → **"Git에 연결"** 클릭

5. **GitHub 계정 연결**
   - GitHub 로그인
   - Cloudflare 앱 설치 허용

6. **저장소 선택**
   - `badminton-attendance` 선택

7. **빌드 설정**:
   ```
   프로젝트 이름: badminton-manager
   프로덕션 브랜치: main
   빌드 명령어: npm run build
   빌드 출력 디렉터리: dist
   ```

8. **"저장 및 배포"** 클릭

9. **배포 완료 대기** (약 2-3분)

10. **배포 URL 확인**
    ```
    https://badminton-manager.pages.dev
    ```

---

## 🎯 **제 추천**

**Option 3 (Dashboard 배포)를 강력 추천합니다!**

**이유**:
- ✅ API 토큰 불필요
- ✅ 클릭만으로 완료
- ✅ GitHub 자동 배포 연동
- ✅ 더 안전함
- ✅ 더 쉬움

---

## 🚀 **지금 바로 해보세요**

```
1. https://dash.cloudflare.com 접속
2. Workers 및 Pages 클릭
3. 애플리케이션 생성
4. Pages → Git에 연결
5. badminton-attendance 선택
6. 저장 및 배포
```

**3분이면 완료됩니다!**

---

어떤 방법을 선택하시겠습니까?

**A.** Option 3 - Dashboard로 배포 (추천)  
**B.** 토큰 다시 생성해서 터미널로 배포  
**C.** 좀 더 설명이 필요해요
