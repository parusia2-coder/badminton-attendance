#!/bin/bash

# 팝업 시스템 종합 테스트 스크립트
API_BASE="http://localhost:3000/api"
PASS="✅"
FAIL="❌"
total_tests=0
passed_tests=0

echo "=========================================="
echo "팝업 시스템 종합 테스트"
echo "=========================================="
echo ""

# 테스트 함수
run_test() {
  local test_name=$1
  local command=$2
  local expected_status=${3:-0}
  
  total_tests=$((total_tests + 1))
  echo "[$total_tests] 테스트: $test_name"
  
  # 명령 실행
  if [ "$expected_status" -eq 0 ]; then
    if eval "$command" &>/dev/null; then
      echo "  $PASS PASS"
      passed_tests=$((passed_tests + 1))
      return 0
    else
      echo "  $FAIL FAIL"
      return 1
    fi
  else
    if ! eval "$command" &>/dev/null; then
      echo "  $PASS PASS (예상된 실패)"
      passed_tests=$((passed_tests + 1))
      return 0
    else
      echo "  $FAIL FAIL (예상과 다름)"
      return 1
    fi
  fi
}

# API 엔드포인트 테스트
echo "==========================================";
echo "1. API 엔드포인트 테스트"
echo "==========================================";
echo ""

# 1.1 팝업 목록 조회
echo "1.1 팝업 목록 조회 (GET /api/popups)"
response=$(curl -s $API_BASE/popups?status=active)
count=$(echo $response | jq '.popups | length')
if [ "$count" -ge 0 ]; then
  echo "  $PASS 활성 팝업: $count 개"
  passed_tests=$((passed_tests + 1))
else
  echo "  $FAIL 조회 실패"
fi
total_tests=$((total_tests + 1))
echo ""

# 1.2 팝업 상태 토글 (PATCH)
echo "1.2 팝업 상태 토글 (PATCH /api/popups/1/toggle)"
response=$(curl -s -X PATCH $API_BASE/popups/1/toggle)
success=$(echo $response | jq -r '.success')
if [ "$success" = "true" ]; then
  echo "  $PASS 상태 토글 성공"
  passed_tests=$((passed_tests + 1))
else
  echo "  $FAIL 상태 토글 실패"
fi
total_tests=$((total_tests + 1))

# 다시 토글 (원상복구)
curl -s -X PATCH $API_BASE/popups/1/toggle &>/dev/null
echo ""

# 1.3 특정 팝업 조회
echo "1.3 특정 팝업 조회 (GET /api/popups/1)"
response=$(curl -s $API_BASE/popups/1)
popup_id=$(echo $response | jq -r '.popup.id')
if [ "$popup_id" = "1" ]; then
  echo "  $PASS 팝업 조회 성공"
  passed_tests=$((passed_tests + 1))
else
  echo "  $FAIL 팝업 조회 실패"
fi
total_tests=$((total_tests + 1))
echo ""

# 페이지 렌더링 테스트
echo "==========================================";
echo "2. 페이지 렌더링 테스트"
echo "==========================================";
echo ""

# 2.1 랜딩 페이지 로드
echo "2.1 랜딩 페이지 (GET /)"
status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/)
if [ "$status" = "200" ]; then
  echo "  $PASS HTTP 200 OK"
  passed_tests=$((passed_tests + 1))
else
  echo "  $FAIL HTTP $status"
fi
total_tests=$((total_tests + 1))
echo ""

# 2.2 관리자 페이지 로드
echo "2.2 관리자 페이지 (GET /admin)"
status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/admin)
if [ "$status" = "200" ]; then
  echo "  $PASS HTTP 200 OK"
  passed_tests=$((passed_tests + 1))
else
  echo "  $FAIL HTTP $status"
fi
total_tests=$((total_tests + 1))
echo ""

# 2.3 정적 파일 로드
echo "2.3 정적 파일 (landing/script.js, landing/styles.css)"
status1=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/static/landing/script.js)
status2=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/static/landing/styles.css)
if [ "$status1" = "200" ] && [ "$status2" = "200" ]; then
  echo "  $PASS script.js: $status1, styles.css: $status2"
  passed_tests=$((passed_tests + 1))
else
  echo "  $FAIL script.js: $status1, styles.css: $status2"
fi
total_tests=$((total_tests + 1))
echo ""

# JavaScript 구문 검증
echo "==========================================";
echo "3. JavaScript 구문 검증"
echo "==========================================";
echo ""

echo "3.1 script.js 구문 체크"
if node -c /home/user/webapp/public/static/landing/script.js 2>/dev/null; then
  echo "  $PASS 구문 오류 없음"
  passed_tests=$((passed_tests + 1))
else
  echo "  $FAIL 구문 오류 발견"
fi
total_tests=$((total_tests + 1))
echo ""

echo "3.2 app.js 구문 체크"
if node -c /home/user/webapp/public/static/app.js 2>/dev/null; then
  echo "  $PASS 구문 오류 없음"
  passed_tests=$((passed_tests + 1))
else
  echo "  $FAIL 구문 오류 발견"
fi
total_tests=$((total_tests + 1))
echo ""

# 데이터베이스 검증
echo "==========================================";
echo "4. 데이터베이스 검증"
echo "==========================================";
echo ""

echo "4.1 popups 테이블 존재 확인"
result=$(npx wrangler d1 execute badminton-db --local --command="SELECT COUNT(*) as cnt FROM popups" 2>/dev/null | grep -A1 "cnt" | tail -1 | xargs)
if [ ! -z "$result" ]; then
  echo "  $PASS 테이블 존재, 레코드 수: $result"
  passed_tests=$((passed_tests + 1))
else
  echo "  $FAIL 테이블 조회 실패"
fi
total_tests=$((total_tests + 1))
echo ""

# 최종 결과
echo "==========================================";
echo "테스트 결과 요약"
echo "==========================================";
echo "총 테스트: $total_tests"
echo "성공: $passed_tests"
echo "실패: $((total_tests - passed_tests))"
echo ""

if [ $passed_tests -eq $total_tests ]; then
  echo "🎉 모든 테스트 통과!"
  exit 0
else
  echo "⚠️  일부 테스트 실패"
  exit 1
fi
