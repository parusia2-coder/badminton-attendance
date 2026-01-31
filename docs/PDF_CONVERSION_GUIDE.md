# PDF 변환 가이드

## 방법 1: 온라인 변환 (가장 쉬움)

### Markdown to PDF 온라인 도구
1. **https://www.markdowntopdf.com/** 접속
2. `docs/MANUAL.md` 파일 업로드
3. "Convert" 버튼 클릭
4. PDF 다운로드

### 또는 다른 온라인 도구
- https://md2pdf.netlify.app/
- https://www.markdown-pdf.com/

## 방법 2: VS Code 확장 (권장)

### Markdown PDF 확장 설치
1. VS Code 열기
2. 확장(Extensions) 탭 (Ctrl+Shift+X)
3. "Markdown PDF" 검색 및 설치
4. `docs/MANUAL.md` 파일 열기
5. 우클릭 → "Markdown PDF: Export (pdf)"

## 방법 3: Pandoc 사용 (고급)

### 설치
```bash
# Ubuntu/Debian
sudo apt-get install pandoc texlive-xetex

# macOS
brew install pandoc basictex

# Windows
# https://pandoc.org/installing.html 에서 다운로드
```

### 변환
```bash
cd /home/user/webapp

# 기본 변환
pandoc docs/MANUAL.md -o docs/MANUAL.pdf

# 한글 폰트 지정 (한글 깨짐 방지)
pandoc docs/MANUAL.md -o docs/MANUAL.pdf \
  --pdf-engine=xelatex \
  -V mainfont="Noto Sans CJK KR" \
  -V geometry:margin=2cm

# 목차 포함
pandoc docs/MANUAL.md -o docs/MANUAL.pdf \
  --pdf-engine=xelatex \
  -V mainfont="Noto Sans CJK KR" \
  --toc \
  --toc-depth=3 \
  -V geometry:margin=2.5cm
```

## 방법 4: 브라우저 인쇄 (간단)

### Chrome/Edge 사용
1. `docs/MANUAL.md`를 Markdown 뷰어로 열기
   - https://markdownlivepreview.com/
   - 또는 VS Code 미리보기 (Ctrl+Shift+V)
   
2. 브라우저에서 Ctrl+P (인쇄)

3. "대상" → "PDF로 저장"

4. 여백, 크기 조정 후 저장

## 파일 위치

- **원본 Markdown**: `/home/user/webapp/docs/MANUAL.md`
- **생성된 PDF**: `/home/user/webapp/docs/MANUAL.pdf` (방법에 따라)

## 주의사항

1. **한글 폰트**: PDF 변환 시 한글이 깨질 수 있음
   - 해결: `Noto Sans CJK KR` 또는 `맑은 고딕` 폰트 사용

2. **이미지/다이어그램**: Markdown의 ASCII 다이어그램은 PDF에서 깨질 수 있음
   - 해결: 고정폭 폰트 사용

3. **목차**: 자동 생성을 위해 Pandoc 또는 VS Code 확장 권장

4. **파일 크기**: 이미지가 많으면 PDF 크기가 클 수 있음
   - 해결: 이미지 압축 또는 제거

## 추천 설정 (Pandoc 사용 시)

```yaml
# pandoc-template.yaml
---
title: "안양시배드민턴연합회 장년부 회원관리시스템"
subtitle: "사용자 매뉴얼 및 설치 가이드"
author: "AI Developer (Claude)"
date: "2026년 1월 31일"
version: "1.0.0"
mainfont: "Noto Sans CJK KR"
monofont: "Consolas"
geometry: "margin=2.5cm"
toc: true
toc-depth: 3
numbersections: true
colorlinks: true
---
```

사용:
```bash
pandoc docs/MANUAL.md -o docs/MANUAL.pdf \
  --metadata-file=pandoc-template.yaml \
  --pdf-engine=xelatex
```
