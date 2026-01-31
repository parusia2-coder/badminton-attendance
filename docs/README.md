# 📚 안양시배드민턴연합회 장년부 회원관리시스템 문서

이 디렉토리는 시스템의 완전한 문서를 포함하고 있습니다.

---

## 📖 문서 목록

### 1. COMPLETE_MANUAL.md (⭐ 권장)
**완전 통합 매뉴얼 - 모든 것을 포함한 완전판**

- **크기**: 69KB
- **줄 수**: 3,420줄
- **단어 수**: 약 5,929단어
- **예상 PDF 페이지**: 약 150페이지

**포함 내용**:
- ✅ 시스템 개요 및 프로그램 구조
- ✅ 사용자 매뉴얼 (8개 메뉴 상세 설명)
- ✅ 설치 및 배포 가이드 (로컬, Cloudflare, 외부 서버)
- ✅ 개발자 가이드 (백엔드, 프론트엔드, 아키텍처)
- ✅ API 문서 (9개 API, 전체 엔드포인트)
- ✅ FAQ 및 문제 해결
- ✅ 용어 사전, 참고 자료, 버전 이력

**이 문서 하나만 있으면 됩니다!**

---

### 2. MANUAL.md
**기본 사용자 매뉴얼** (구버전)

- **크기**: 66KB
- **내용**: 시스템 개요, 기능 설명, 설치 가이드

> **참고**: `COMPLETE_MANUAL.md`에 모든 내용이 포함되어 있으므로, 이 파일은 참고용입니다.

---

### 3. PDF_CONVERSION_GUIDE.md
**PDF 변환 가이드**

Markdown 파일을 PDF로 변환하는 4가지 방법:
1. 온라인 도구 (https://www.markdowntopdf.com/)
2. VS Code 확장 프로그램 (Markdown PDF)
3. Pandoc CLI
4. 브라우저 인쇄

---

## 🚀 빠른 시작

### 1️⃣ 문서 다운로드

**GitHub에서**:
```bash
# 전체 프로젝트 클론
git clone https://github.com/your-org/badminton-manager.git

# 문서 확인
cd badminton-manager/docs
```

**또는 직접 다운로드**:
- https://github.com/your-org/badminton-manager/tree/main/docs

---

### 2️⃣ PDF 변환 (권장)

#### 방법 1: 온라인 도구 (가장 쉬움)
1. https://www.markdowntopdf.com/ 접속
2. `COMPLETE_MANUAL.md` 파일 업로드
3. "Convert to PDF" 클릭
4. PDF 다운로드

#### 방법 2: VS Code 확장
1. VS Code에서 `COMPLETE_MANUAL.md` 열기
2. `Markdown PDF` 확장 설치
3. `Ctrl+Shift+P` → "Markdown PDF: Export (pdf)" 선택

#### 방법 3: Pandoc (한글 폰트 지원)
```bash
pandoc COMPLETE_MANUAL.md -o COMPLETE_MANUAL.pdf \
  --pdf-engine=xelatex \
  -V mainfont="Noto Sans KR" \
  -V CJKmainfont="Noto Sans KR" \
  -V geometry:margin=1in
```

---

### 3️⃣ 문서 배포

#### GitHub에 공개
```bash
git add docs/
git commit -m "Add complete documentation"
git push origin main
```

#### 웹사이트에 게시
- Markdown을 HTML로 변환 (Jekyll, Hugo, MkDocs 등)
- GitHub Pages로 자동 배포

#### 구성원에게 공유
- PDF로 변환 후 이메일 전송
- 공유 드라이브에 업로드
- Notion, Confluence 등에 임포트

---

## 📋 문서 구조

```
docs/
├── COMPLETE_MANUAL.md          ⭐ 완전 통합 매뉴얼 (이것만 보세요!)
├── MANUAL.md                   📄 기본 매뉴얼 (구버전)
├── PDF_CONVERSION_GUIDE.md     🔧 PDF 변환 가이드
└── README.md                   📖 이 파일
```

---

## 🎯 누가 어떤 문서를 봐야 하나요?

| 사용자 유형 | 권장 문서 | 이유 |
|------------|----------|------|
| **일반 사용자** | `COMPLETE_MANUAL.md` | 모든 기능 설명 포함 |
| **관리자** | `COMPLETE_MANUAL.md` | 설치, 배포, 설정 방법 포함 |
| **개발자** | `COMPLETE_MANUAL.md` | 코드 구조, API 문서 포함 |
| **외부 설치자** | `COMPLETE_MANUAL.md` | 외부 서버 이전 방법 포함 |
| **문제 해결** | `COMPLETE_MANUAL.md` | FAQ 및 에러 해설 포함 |

**결론: 모두 `COMPLETE_MANUAL.md`를 보면 됩니다!**

---

## 🔄 문서 업데이트

시스템에 새로운 기능이 추가되면 문서도 업데이트됩니다.

### 버전 관리
- **v1.0.0** (2026-01-31): 초기 릴리스
- 향후 업데이트 시 버전 번호 증가

### 업데이트 알림
- Git 커밋 메시지 확인
- GitHub Releases 페이지 확인

---

## 📞 문의

문서에 대한 질문이나 개선 사항:
- **GitHub Issues**: https://github.com/your-org/badminton-manager/issues
- **이메일**: admin@example.com

---

## 📝 라이선스

이 문서는 시스템과 동일한 MIT 라이선스를 따릅니다.
자유롭게 사용, 수정, 배포할 수 있습니다.

---

**마지막 업데이트**: 2026년 1월 31일
