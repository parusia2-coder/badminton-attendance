// 전역 상태 관리
const app = {
  currentPage: 'login',
  session: null,
  data: {
    dashboard: null,
    members: [],
    schedules: [],
    attendances: [],
    inventory: [],
    boards: [],
    posts: []
  }
};

// API 기본 설정
const API_BASE = '/api';

// 로컬 스토리지에서 세션 확인
async function checkSession() {
  const sessionId = localStorage.getItem('sessionId');
  if (!sessionId) return false;
  
  try {
    const response = await axios.post(`${API_BASE}/auth/verify`, { sessionId });
    if (response.data.valid) {
      app.session = { sessionId, ...response.data };
      return true;
    }
  } catch (error) {
    console.error('세션 확인 실패:', error);
  }
  
  localStorage.removeItem('sessionId');
  return false;
}

// 초기화
async function init() {
  const isLoggedIn = await checkSession();
  
  if (isLoggedIn) {
    app.currentPage = 'dashboard';
    await loadDashboard();
    renderApp();
  } else {
    app.currentPage = 'login';
    renderApp();
  }
}

// 로그인
async function login(username, password) {
  try {
    const response = await axios.post(`${API_BASE}/auth/login`, { username, password });
    app.session = response.data;
    localStorage.setItem('sessionId', response.data.sessionId);
    app.currentPage = 'dashboard';
    await loadDashboard();
    renderApp();
    showToast('로그인 성공!', 'success');
  } catch (error) {
    showToast(error.response?.data?.error || '로그인 실패', 'error');
  }
}

// 로그아웃
async function logout() {
  try {
    await axios.post(`${API_BASE}/auth/logout`, { sessionId: app.session.sessionId });
  } catch (error) {
    console.error('로그아웃 오류:', error);
  }
  
  localStorage.removeItem('sessionId');
  app.session = null;
  app.currentPage = 'login';
  renderApp();
  showToast('로그아웃되었습니다', 'info');
}

// 대시보드 데이터 로드
async function loadDashboard() {
  try {
    const response = await axios.get(`${API_BASE}/dashboard`);
    app.data.dashboard = response.data;
  } catch (error) {
    console.error('대시보드 로드 실패:', error);
    showToast('대시보드 로드 실패', 'error');
  }
}

// 회원 데이터 로드
async function loadMembers(filters = {}) {
  try {
    const params = new URLSearchParams(filters);
    const response = await axios.get(`${API_BASE}/members?${params}`);
    app.data.members = response.data.members;
    return response.data.members;
  } catch (error) {
    console.error('회원 로드 실패:', error);
    showToast('회원 데이터 로드 실패', 'error');
    return [];
  }
}

// 일정 데이터 로드
async function loadSchedules(filters = {}) {
  try {
    const params = new URLSearchParams(filters);
    const response = await axios.get(`${API_BASE}/schedules?${params}`);
    app.data.schedules = response.data.schedules;
    return response.data.schedules;
  } catch (error) {
    console.error('일정 로드 실패:', error);
    showToast('일정 데이터 로드 실패', 'error');
    return [];
  }
}

// 재고 데이터 로드
async function loadInventory() {
  try {
    const response = await axios.get(`${API_BASE}/inventory`);
    app.data.inventory = response.data.inventory;
    return response.data.inventory;
  } catch (error) {
    console.error('재고 로드 실패:', error);
    showToast('재고 데이터 로드 실패', 'error');
    return [];
  }
}

// 게시판 데이터 로드
async function loadBoards() {
  try {
    const response = await axios.get(`${API_BASE}/boards`);
    app.data.boards = response.data.boards;
    return response.data.boards;
  } catch (error) {
    console.error('게시판 로드 실패:', error);
    showToast('게시판 데이터 로드 실패', 'error');
    return [];
  }
}

// 토스트 메시지
function showToast(message, type = 'info') {
  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500'
  };
  
  const toast = document.createElement('div');
  toast.className = `fixed top-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in`;
  toast.textContent = message;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// 메인 렌더링
function renderApp() {
  const appContainer = document.getElementById('app');
  
  if (app.currentPage === 'login') {
    appContainer.innerHTML = renderLoginPage();
    attachLoginHandlers();
  } else {
    appContainer.innerHTML = renderMainLayout();
    attachMainHandlers();
    renderCurrentPage();
  }
}

// 로그인 페이지
function renderLoginPage() {
  return `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <div class="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div class="text-center mb-8">
          <i class="fas fa-shuttle-van text-6xl text-blue-600 mb-4"></i>
          <h1 class="text-3xl font-bold text-gray-800">안양시배드민턴연합회</h1>
          <p class="text-gray-600 mt-2">장년부 회원관리시스템</p>
        </div>
        
        <form id="loginForm" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">아이디</label>
            <input 
              type="text" 
              id="username" 
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="관리자 아이디"
              required
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">비밀번호</label>
            <input 
              type="password" 
              id="password" 
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="비밀번호"
              required
            />
          </div>
          
          <button 
            type="submit" 
            class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
          >
            로그인
          </button>
        </form>
        
        <div class="mt-6 text-center text-sm text-gray-600">
          <p>기본 계정: admin / admin1234</p>
        </div>
      </div>
    </div>
  `;
}

function attachLoginHandlers() {
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    await login(username, password);
  });
}

// 메인 레이아웃
function renderMainLayout() {
  return `
    <div class="flex h-screen bg-gray-100">
      <!-- 사이드바 -->
      <aside id="sidebar" class="sidebar w-64 bg-white shadow-lg transition-transform duration-300 fixed lg:static inset-y-0 left-0 z-50 -translate-x-full lg:translate-x-0">
        <div class="p-6 bg-gradient-to-r from-blue-600 to-purple-600">
          <h1 class="text-white text-xl font-bold">장년부 관리시스템</h1>
          <p class="text-blue-100 text-sm mt-1">${app.session.name}님</p>
        </div>
        
        <nav class="mt-6">
          <a href="#" data-page="dashboard" class="nav-item flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition">
            <i class="fas fa-chart-line w-6"></i>
            <span class="ml-3">대시보드</span>
          </a>
          <a href="#" data-page="members" class="nav-item flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition">
            <i class="fas fa-users w-6"></i>
            <span class="ml-3">회원관리</span>
          </a>
          <a href="#" data-page="schedules" class="nav-item flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition">
            <i class="fas fa-calendar-alt w-6"></i>
            <span class="ml-3">일정관리</span>
          </a>
          <a href="#" data-page="attendance" class="nav-item flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition">
            <i class="fas fa-check-circle w-6"></i>
            <span class="ml-3">출석관리</span>
          </a>
          <a href="#" data-page="inventory" class="nav-item flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition">
            <i class="fas fa-box w-6"></i>
            <span class="ml-3">재고관리</span>
          </a>
          <a href="#" data-page="boards" class="nav-item flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition">
            <i class="fas fa-comments w-6"></i>
            <span class="ml-3">게시판</span>
          </a>
          <a href="#" data-page="fees" class="nav-item flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition">
            <i class="fas fa-won-sign w-6"></i>
            <span class="ml-3">회비관리</span>
          </a>
        </nav>
        
        <div class="absolute bottom-0 w-64 p-6">
          <button onclick="logout()" class="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition">
            <i class="fas fa-sign-out-alt mr-2"></i>
            로그아웃
          </button>
        </div>
      </aside>
      
      <!-- Overlay for mobile -->
      <div id="sidebarOverlay" class="fixed inset-0 bg-black bg-opacity-50 z-40 hidden lg:hidden"></div>
      
      <!-- 메인 컨텐츠 -->
      <main class="flex-1 overflow-auto">
        <!-- 모바일 헤더 -->
        <div class="lg:hidden bg-white shadow-md p-4 flex items-center justify-between">
          <button id="menuToggle" class="text-gray-600">
            <i class="fas fa-bars text-2xl"></i>
          </button>
          <h2 class="text-lg font-bold text-gray-800">장년부 관리</h2>
        </div>
        
        <!-- 페이지 컨텐츠 -->
        <div id="pageContent" class="p-6"></div>
      </main>
    </div>
  `;
}

function attachMainHandlers() {
  // 네비게이션
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', async (e) => {
      e.preventDefault();
      const page = e.currentTarget.dataset.page;
      
      // 활성화 상태 변경
      document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('bg-blue-50', 'text-blue-600'));
      e.currentTarget.classList.add('bg-blue-50', 'text-blue-600');
      
      app.currentPage = page;
      await renderCurrentPage();
    });
  });
  
  // 모바일 메뉴 토글
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  
  if (menuToggle && sidebar && overlay) {
    // 햄버거 버튼 클릭
    menuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('-translate-x-full');
      overlay.classList.toggle('hidden');
    });
    
    // 오버레이 클릭 시 메뉴 닫기
    overlay.addEventListener('click', () => {
      sidebar.classList.add('-translate-x-full');
      overlay.classList.add('hidden');
    });
    
    // 메뉴 항목 클릭 시 모바일에서 자동으로 닫기
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        if (window.innerWidth < 1024) {
          sidebar.classList.add('-translate-x-full');
          overlay.classList.add('hidden');
        }
      });
    });
  }
  
  // 초기 페이지 활성화
  const initialNav = document.querySelector(`[data-page="${app.currentPage}"]`);
  if (initialNav) {
    initialNav.classList.add('bg-blue-50', 'text-blue-600');
  }
}

// 현재 페이지 렌더링
async function renderCurrentPage() {
  const contentDiv = document.getElementById('pageContent');
  
  switch (app.currentPage) {
    case 'dashboard':
      await loadDashboard();
      contentDiv.innerHTML = renderDashboard();
      attachDashboardHandlers();
      break;
    case 'members':
      await loadMembers();
      contentDiv.innerHTML = renderMembersPage();
      attachMembersHandlers();
      break;
    case 'schedules':
      await loadSchedules();
      contentDiv.innerHTML = renderSchedulesPage();
      attachSchedulesHandlers();
      break;
    case 'attendance':
      await loadSchedules();
      contentDiv.innerHTML = renderAttendancePage();
      attachAttendanceHandlers();
      break;
    case 'inventory':
      await loadInventory();
      contentDiv.innerHTML = renderInventoryPage();
      attachInventoryHandlers();
      break;
    case 'boards':
      await loadBoards();
      contentDiv.innerHTML = renderBoardsPage();
      attachBoardsHandlers();
      break;
    case 'fees':
      await loadFees();
      contentDiv.innerHTML = renderFeesPage();
      attachFeesHandlers();
      break;
  }
}

// 대시보드 렌더링
function renderDashboard() {
  const data = app.data.dashboard;
  if (!data) return '<div class="text-center py-20">데이터를 불러오는 중...</div>';
  
  return `
    <div class="space-y-6">
      <h1 class="text-3xl font-bold text-gray-800">대시보드</h1>
      
      <!-- 통계 카드 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white p-6 rounded-lg shadow-md">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-sm">전체 회원</p>
              <p class="text-3xl font-bold text-blue-600">${data.members.total}명</p>
            </div>
            <i class="fas fa-users text-4xl text-blue-200"></i>
          </div>
          <p class="text-sm text-gray-500 mt-2">회비납부: ${data.members.feePaid}명 / 미납: ${data.members.feeUnpaid}명</p>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow-md">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-sm">다가오는 일정</p>
              <p class="text-3xl font-bold text-green-600">${data.schedules.upcoming}개</p>
            </div>
            <i class="fas fa-calendar-alt text-4xl text-green-200"></i>
          </div>
          <p class="text-sm text-gray-500 mt-2">전체 일정: ${data.schedules.total}개</p>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow-md">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-sm">출석률</p>
              <p class="text-3xl font-bold text-purple-600">${data.attendance.rate}%</p>
            </div>
            <i class="fas fa-check-circle text-4xl text-purple-200"></i>
          </div>
          <p class="text-sm text-gray-500 mt-2">총 출석: ${data.attendance.total}회</p>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow-md">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-sm">재고 현황</p>
              <p class="text-3xl font-bold text-red-600">${data.inventory.lowStock}개</p>
            </div>
            <i class="fas fa-box text-4xl text-red-200"></i>
          </div>
          <p class="text-sm text-gray-500 mt-2">부족 품목 / 전체: ${data.inventory.total}개</p>
        </div>
      </div>
      
      <!-- 차트 및 상세 정보 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 급수별 회원 분포 -->
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-lg font-bold text-gray-800 mb-4">급수별 회원 분포</h3>
          <canvas id="gradeChart"></canvas>
        </div>
        
        <!-- 최다 출석 회원 TOP 5 -->
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-lg font-bold text-gray-800 mb-4">최다 출석 회원 TOP 5</h3>
          <div class="space-y-3">
            ${data.attendance.topAttenders.map((member, index) => `
              <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div class="flex items-center">
                  <span class="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-full font-bold mr-3">
                    ${index + 1}
                  </span>
                  <div>
                    <p class="font-semibold">${member.name}</p>
                    <p class="text-sm text-gray-600">${member.club}</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-2xl font-bold text-blue-600">${member.attendance_count}</p>
                  <p class="text-xs text-gray-500">회 출석</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        
        <!-- 최근 일정 -->
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-lg font-bold text-gray-800 mb-4">다가오는 일정</h3>
          <div class="space-y-3">
            ${data.schedules.recent.map(schedule => `
              <div class="p-4 border-l-4 border-blue-600 bg-blue-50 rounded-r-lg">
                <div class="flex items-start justify-between">
                  <div>
                    <p class="font-semibold text-gray-800">${schedule.title}</p>
                    <p class="text-sm text-gray-600 mt-1">
                      <i class="fas fa-calendar mr-1"></i>
                      ${dayjs(schedule.schedule_date).format('YYYY년 M월 D일 (ddd)')}
                    </p>
                    <p class="text-sm text-gray-600">
                      <i class="fas fa-clock mr-1"></i>
                      ${schedule.start_time} - ${schedule.end_time}
                    </p>
                    <p class="text-sm text-gray-600">
                      <i class="fas fa-map-marker-alt mr-1"></i>
                      ${schedule.location}
                    </p>
                  </div>
                  <span class="px-3 py-1 bg-blue-600 text-white text-xs rounded-full">
                    ${schedule.schedule_type}
                  </span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        
        <!-- 재고 부족 알림 -->
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-lg font-bold text-gray-800 mb-4">
            <i class="fas fa-exclamation-triangle text-red-500 mr-2"></i>
            재고 부족 알림
          </h3>
          <div class="space-y-3">
            ${data.inventory.lowStockItems.length === 0 ? '<p class="text-gray-500 text-center py-4">부족한 재고가 없습니다</p>' : ''}
            ${data.inventory.lowStockItems.map(item => `
              <div class="flex items-center justify-between p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                <div>
                  <p class="font-semibold text-gray-800">${item.item_name}</p>
                  <p class="text-sm text-gray-600">최소 필요: ${item.min_quantity}${item.unit}</p>
                </div>
                <div class="text-right">
                  <p class="text-2xl font-bold text-red-600">${item.quantity}</p>
                  <p class="text-xs text-gray-500">${item.unit}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

function attachDashboardHandlers() {
  // 급수별 회원 분포 차트
  const gradeCanvas = document.getElementById('gradeChart');
  if (gradeCanvas && app.data.dashboard) {
    const gradeData = app.data.dashboard.members.gradeDistribution;
    new Chart(gradeCanvas, {
      type: 'bar',
      data: {
        labels: gradeData.map(d => d.grade + '급'),
        datasets: [{
          label: '회원 수',
          data: gradeData.map(d => d.count),
          backgroundColor: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1 }
          }
        }
      }
    });
  }
}

// 회원관리 페이지 렌더링
function renderMembersPage() {
  return `
    <div class="space-y-6">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 class="text-3xl font-bold text-gray-800">회원관리</h1>
        <div class="flex flex-wrap gap-2">
          <button onclick="showAddMemberModal()" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            <i class="fas fa-plus mr-2"></i>회원 등록
          </button>
          <button onclick="showBulkUploadModal()" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            <i class="fas fa-upload mr-2"></i>일괄 업로드
          </button>
          <button onclick="showSendSMSModal()" class="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700">
            <i class="fas fa-comment-dots mr-2"></i>문자발송
          </button>
          <button onclick="exportMembers()" class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
            <i class="fas fa-download mr-2"></i>엑셀 내보내기
          </button>
          <button onclick="showDeleteAllMembersConfirm()" class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
            <i class="fas fa-trash-alt mr-2"></i>전체 삭제
          </button>
        </div>
      </div>
      
      <!-- 검색 및 필터 -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input 
            type="text" 
            id="memberSearch" 
            placeholder="이름 또는 연락처 검색" 
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <select id="clubFilter" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            <option value="">전체 클럽</option>
          </select>
          <select id="gradeFilter" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            <option value="">전체 급수</option>
            <option value="S">S급</option>
            <option value="A">A급</option>
            <option value="B">B급</option>
            <option value="C">C급</option>
            <option value="D">D급</option>
          </select>
          <select id="feeFilter" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            <option value="">전체</option>
            <option value="1">회비 납부</option>
            <option value="0">회비 미납</option>
          </select>
        </div>
        <button onclick="filterMembers()" class="mt-4 w-full md:w-auto bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
          <i class="fas fa-search mr-2"></i>검색
        </button>
      </div>
      
      <!-- 회원 테이블 -->
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  <input type="checkbox" id="selectAllMembers" onchange="toggleAllMembers()" class="rounded">
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">이름</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">성별</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">출생년도</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">클럽</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">급수</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">연락처</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">회비</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">차량</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">관리</th>
              </tr>
            </thead>
            <tbody id="membersTableBody" class="divide-y divide-gray-200">
              ${renderMembersTable()}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
    <!-- 모달들 -->
    <div id="modalContainer"></div>
  `;
}

function renderMembersTable() {
  if (!app.data.members || app.data.members.length === 0) {
    return '<tr><td colspan="10" class="px-6 py-12 text-center text-gray-500">등록된 회원이 없습니다</td></tr>';
  }
  
  return app.data.members.map(member => `
    <tr class="hover:bg-gray-50">
      <td class="px-6 py-4 whitespace-nowrap">
        <input type="checkbox" class="member-checkbox rounded" value="${member.id}" 
               data-name="${member.name}" data-phone="${member.phone}">
      </td>
      <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">${member.name}</td>
      <td class="px-6 py-4 whitespace-nowrap text-gray-600">${member.gender}</td>
      <td class="px-6 py-4 whitespace-nowrap text-gray-600">${member.birth_year}년</td>
      <td class="px-6 py-4 whitespace-nowrap text-gray-600">${member.club}</td>
      <td class="px-6 py-4 whitespace-nowrap">
        <span class="px-3 py-1 text-xs font-semibold rounded-full ${getGradeBadgeColor(member.grade)}">
          ${member.grade}급
        </span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-gray-600">${member.phone}</td>
      <td class="px-6 py-4 whitespace-nowrap">
        <span class="px-3 py-1 text-xs font-semibold rounded-full ${member.fee_paid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
          ${member.fee_paid ? '납부' : '미납'}
        </span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        ${member.car_registered ? '<i class="fas fa-check text-green-600"></i>' : '<i class="fas fa-times text-red-600"></i>'}
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm">
        <button onclick="showMemberDetail(${member.id})" class="text-blue-600 hover:text-blue-800 mr-2">
          <i class="fas fa-eye"></i>
        </button>
        <button onclick="showEditMemberModal(${member.id})" class="text-green-600 hover:text-green-800 mr-2">
          <i class="fas fa-edit"></i>
        </button>
        <button onclick="deleteMember(${member.id})" class="text-red-600 hover:text-red-800">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

function getGradeBadgeColor(grade) {
  const colors = {
    'S': 'bg-purple-100 text-purple-800',
    'A': 'bg-blue-100 text-blue-800',
    'B': 'bg-green-100 text-green-800',
    'C': 'bg-yellow-100 text-yellow-800',
    'D': 'bg-gray-100 text-gray-800'
  };
  return colors[grade] || 'bg-gray-100 text-gray-800';
}

async function attachMembersHandlers() {
  // 클럽 필터 옵션 동적 생성
  const clubs = [...new Set(app.data.members.map(m => m.club))];
  const clubFilter = document.getElementById('clubFilter');
  clubs.forEach(club => {
    const option = document.createElement('option');
    option.value = club;
    option.textContent = club;
    clubFilter.appendChild(option);
  });
}

async function filterMembers() {
  const search = document.getElementById('memberSearch').value;
  const club = document.getElementById('clubFilter').value;
  const grade = document.getElementById('gradeFilter').value;
  const fee_paid = document.getElementById('feeFilter').value;
  
  const filters = {};
  if (search) filters.search = search;
  if (club) filters.club = club;
  if (grade) filters.grade = grade;
  if (fee_paid) filters.fee_paid = fee_paid;
  
  await loadMembers(filters);
  document.getElementById('membersTableBody').innerHTML = renderMembersTable();
}

function showAddMemberModal() {
  const modal = `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 class="text-2xl font-bold mb-6">회원 등록</h2>
        <form id="addMemberForm" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-2">이름 *</label>
              <input type="text" name="name" required class="w-full px-4 py-2 border rounded-lg">
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">성별 *</label>
              <select name="gender" required class="w-full px-4 py-2 border rounded-lg">
                <option value="남">남</option>
                <option value="여">여</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">출생년도 *</label>
              <input type="number" name="birth_year" required class="w-full px-4 py-2 border rounded-lg" placeholder="1970">
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">클럽 *</label>
              <input type="text" name="club" required class="w-full px-4 py-2 border rounded-lg">
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">급수 *</label>
              <select name="grade" required class="w-full px-4 py-2 border rounded-lg">
                <option value="S">S급</option>
                <option value="A">A급</option>
                <option value="B">B급</option>
                <option value="C">C급</option>
                <option value="D">D급</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">연락처 *</label>
              <input type="tel" name="phone" required class="w-full px-4 py-2 border rounded-lg" placeholder="010-1234-5678">
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">회비 납부 여부</label>
              <select name="fee_paid" class="w-full px-4 py-2 border rounded-lg">
                <option value="0">미납</option>
                <option value="1">납부</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">차량 등록 여부</label>
              <select name="car_registered" class="w-full px-4 py-2 border rounded-lg">
                <option value="0">미등록</option>
                <option value="1">등록</option>
              </select>
            </div>
          </div>
          <div class="flex justify-end gap-2 mt-6">
            <button type="button" onclick="closeModal()" class="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">취소</button>
            <button type="submit" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">등록</button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  document.getElementById('modalContainer').innerHTML = modal;
  
  document.getElementById('addMemberForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    data.birth_year = parseInt(data.birth_year);
    data.fee_paid = parseInt(data.fee_paid);
    data.car_registered = parseInt(data.car_registered);
    
    try {
      await axios.post(`${API_BASE}/members`, data);
      showToast('회원이 등록되었습니다', 'success');
      closeModal();
      await loadMembers();
      document.getElementById('membersTableBody').innerHTML = renderMembersTable();
    } catch (error) {
      showToast('회원 등록 실패', 'error');
    }
  });
}

// 회원 상세보기 모달
function showMemberDetail(memberId) {
  const member = app.data.members.find(m => m.id === memberId);
  if (!member) {
    showToast('회원 정보를 찾을 수 없습니다', 'error');
    return;
  }
  
  const modal = `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-800">회원 상세정보</h2>
          <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="p-4 bg-gray-50 rounded-lg">
              <p class="text-sm text-gray-500 mb-1">이름</p>
              <p class="text-lg font-semibold text-gray-900">${member.name}</p>
            </div>
            <div class="p-4 bg-gray-50 rounded-lg">
              <p class="text-sm text-gray-500 mb-1">성별</p>
              <p class="text-lg font-semibold text-gray-900">${member.gender}</p>
            </div>
            <div class="p-4 bg-gray-50 rounded-lg">
              <p class="text-sm text-gray-500 mb-1">출생년도</p>
              <p class="text-lg font-semibold text-gray-900">${member.birth_year}년</p>
            </div>
            <div class="p-4 bg-gray-50 rounded-lg">
              <p class="text-sm text-gray-500 mb-1">클럽</p>
              <p class="text-lg font-semibold text-gray-900">${member.club}</p>
            </div>
            <div class="p-4 bg-gray-50 rounded-lg">
              <p class="text-sm text-gray-500 mb-1">급수</p>
              <p class="text-lg font-semibold">
                <span class="px-3 py-1 text-sm rounded-full ${getGradeBadgeColor(member.grade)}">
                  ${member.grade}급
                </span>
              </p>
            </div>
            <div class="p-4 bg-gray-50 rounded-lg">
              <p class="text-sm text-gray-500 mb-1">연락처</p>
              <p class="text-lg font-semibold text-gray-900">${member.phone}</p>
            </div>
            <div class="p-4 bg-gray-50 rounded-lg">
              <p class="text-sm text-gray-500 mb-1">회비 납부 여부</p>
              <p class="text-lg font-semibold">
                <span class="px-3 py-1 text-sm rounded-full ${member.fee_paid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                  ${member.fee_paid ? '납부 완료' : '미납'}
                </span>
              </p>
            </div>
            <div class="p-4 bg-gray-50 rounded-lg">
              <p class="text-sm text-gray-500 mb-1">차량 등록 여부</p>
              <p class="text-lg font-semibold">
                <span class="px-3 py-1 text-sm rounded-full ${member.car_registered ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}">
                  ${member.car_registered ? '등록됨' : '미등록'}
                </span>
              </p>
            </div>
          </div>
          
          <div class="p-4 bg-gray-50 rounded-lg">
            <p class="text-sm text-gray-500 mb-1">등록일시</p>
            <p class="text-sm text-gray-700">${dayjs(member.created_at).format('YYYY-MM-DD HH:mm')}</p>
          </div>
          
          <div class="p-4 bg-gray-50 rounded-lg">
            <p class="text-sm text-gray-500 mb-1">최종 수정일시</p>
            <p class="text-sm text-gray-700">${dayjs(member.updated_at).format('YYYY-MM-DD HH:mm')}</p>
          </div>
        </div>
        
        <div class="flex justify-end gap-2 mt-6">
          <button onclick="closeModal()" class="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">닫기</button>
          <button onclick="closeModal(); showEditMemberModal(${member.id})" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <i class="fas fa-edit mr-2"></i>수정하기
          </button>
        </div>
      </div>
    </div>
  `;
  
  document.getElementById('modalContainer').innerHTML = modal;
}

// 회원 수정 모달
function showEditMemberModal(memberId) {
  const member = app.data.members.find(m => m.id === memberId);
  if (!member) {
    showToast('회원 정보를 찾을 수 없습니다', 'error');
    return;
  }
  
  const modal = `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 class="text-2xl font-bold mb-6">회원 정보 수정</h2>
        <form id="editMemberForm" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-2">이름 *</label>
              <input type="text" name="name" value="${member.name}" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">성별 *</label>
              <select name="gender" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="남" ${member.gender === '남' ? 'selected' : ''}>남</option>
                <option value="여" ${member.gender === '여' ? 'selected' : ''}>여</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">출생년도 *</label>
              <input type="number" name="birth_year" value="${member.birth_year}" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">클럽 *</label>
              <input type="text" name="club" value="${member.club}" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">급수 *</label>
              <select name="grade" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="S" ${member.grade === 'S' ? 'selected' : ''}>S급</option>
                <option value="A" ${member.grade === 'A' ? 'selected' : ''}>A급</option>
                <option value="B" ${member.grade === 'B' ? 'selected' : ''}>B급</option>
                <option value="C" ${member.grade === 'C' ? 'selected' : ''}>C급</option>
                <option value="D" ${member.grade === 'D' ? 'selected' : ''}>D급</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">연락처 *</label>
              <input type="tel" name="phone" value="${member.phone}" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">회비 납부 여부</label>
              <select name="fee_paid" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="0" ${member.fee_paid === 0 ? 'selected' : ''}>미납</option>
                <option value="1" ${member.fee_paid === 1 ? 'selected' : ''}>납부</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">차량 등록 여부</label>
              <select name="car_registered" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="0" ${member.car_registered === 0 ? 'selected' : ''}>미등록</option>
                <option value="1" ${member.car_registered === 1 ? 'selected' : ''}>등록</option>
              </select>
            </div>
          </div>
          <div class="flex justify-end gap-2 mt-6">
            <button type="button" onclick="closeModal()" class="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">취소</button>
            <button type="submit" class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              <i class="fas fa-save mr-2"></i>저장
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  document.getElementById('modalContainer').innerHTML = modal;
  
  document.getElementById('editMemberForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    data.birth_year = parseInt(data.birth_year);
    data.fee_paid = parseInt(data.fee_paid);
    data.car_registered = parseInt(data.car_registered);
    
    try {
      await axios.put(`${API_BASE}/members/${memberId}`, data);
      showToast('회원 정보가 수정되었습니다', 'success');
      closeModal();
      await loadMembers();
      document.getElementById('membersTableBody').innerHTML = renderMembersTable();
    } catch (error) {
      showToast('회원 정보 수정 실패', 'error');
    }
  });
}

function showBulkUploadModal() {
  const modal = `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h2 class="text-2xl font-bold mb-6">회원 일괄 업로드</h2>
        
        <!-- 탭 선택 -->
        <div class="flex border-b mb-6">
          <button 
            id="tabPaste" 
            onclick="switchUploadTab('paste')" 
            class="px-6 py-3 font-semibold border-b-2 border-blue-600 text-blue-600"
          >
            <i class="fas fa-clipboard mr-2"></i>붙여넣기
          </button>
          <button 
            id="tabFile" 
            onclick="switchUploadTab('file')" 
            class="px-6 py-3 font-semibold text-gray-600 hover:text-gray-800"
          >
            <i class="fas fa-file-upload mr-2"></i>파일 업로드
          </button>
        </div>
        
        <div class="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 class="font-bold mb-2">엑셀 파일 형식 안내</h3>
          <p class="text-sm text-gray-700 mb-2">첫 번째 행은 헤더로 무시되며, 다음 순서로 데이터를 입력해주세요:</p>
          <p class="text-sm text-gray-700 mb-3">이름, 성별, 출생년도, 클럽, 급수, 연락처, 회비납부(0/1), 차량등록(0/1)</p>
          <a href="/static/sample_members.csv" download class="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium">
            <i class="fas fa-download mr-2"></i>샘플 CSV 파일 다운로드
          </a>
        </div>
        
        <!-- 붙여넣기 탭 -->
        <div id="pasteTab" class="mb-6">
          <label class="block text-sm font-medium mb-2">CSV/엑셀 데이터 붙여넣기</label>
          <textarea 
            id="bulkData" 
            rows="10" 
            class="w-full px-4 py-2 border rounded-lg font-mono text-sm"
            placeholder="이름\t성별\t출생년도\t클럽\t급수\t연락처\t회비납부\t차량등록
홍길동\t남\t1970\t안양클럽\tA\t010-1234-5678\t1\t1
김철수\t남\t1975\t평촌클럽\tB\t010-2345-6789\t0\t0"
          ></textarea>
        </div>
        
        <!-- 파일 업로드 탭 -->
        <div id="fileTab" class="mb-6 hidden">
          <label class="block text-sm font-medium mb-2">Excel/CSV 파일 선택</label>
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input 
              type="file" 
              id="bulkFileInput" 
              accept=".csv,.xlsx,.xls" 
              class="hidden"
              onchange="handleBulkFileSelect(event)"
            />
            <button 
              type="button" 
              onclick="document.getElementById('bulkFileInput').click()"
              class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              <i class="fas fa-file-excel mr-2"></i>
              파일 선택 (.csv, .xlsx, .xls)
            </button>
            <p class="text-sm text-gray-500 mt-3">또는 파일을 여기로 드래그하세요</p>
          </div>
          
          <!-- 파일 미리보기 -->
          <div id="filePreview" class="mt-4 hidden">
            <div class="bg-green-50 border border-green-200 rounded-lg p-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <i class="fas fa-file-excel text-green-600 text-2xl mr-3"></i>
                  <div>
                    <p class="font-semibold text-gray-800" id="fileName"></p>
                    <p class="text-sm text-gray-600" id="fileInfo"></p>
                  </div>
                </div>
                <button 
                  onclick="clearBulkFile()" 
                  class="text-red-600 hover:text-red-800"
                >
                  <i class="fas fa-times text-xl"></i>
                </button>
              </div>
            </div>
            
            <!-- 데이터 미리보기 -->
            <div class="mt-4 p-4 bg-gray-50 rounded-lg max-h-64 overflow-auto">
              <h4 class="font-semibold mb-2">데이터 미리보기 (최대 5행)</h4>
              <div id="dataPreview" class="text-sm font-mono"></div>
            </div>
          </div>
        </div>
        
        <div class="flex justify-end gap-2">
          <button type="button" onclick="closeModal()" class="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">취소</button>
          <button onclick="processBulkUpload()" class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <i class="fas fa-upload mr-2"></i>업로드
          </button>
        </div>
      </div>
    </div>
  `;
  
  document.getElementById('modalContainer').innerHTML = modal;
  
  // 파일 전역 변수 초기화
  window.bulkFileData = null;
}

// 탭 전환
function switchUploadTab(tab) {
  const pasteTab = document.getElementById('pasteTab');
  const fileTab = document.getElementById('fileTab');
  const tabPasteBtn = document.getElementById('tabPaste');
  const tabFileBtn = document.getElementById('tabFile');
  
  if (tab === 'paste') {
    pasteTab.classList.remove('hidden');
    fileTab.classList.add('hidden');
    tabPasteBtn.classList.add('border-b-2', 'border-blue-600', 'text-blue-600');
    tabPasteBtn.classList.remove('text-gray-600');
    tabFileBtn.classList.remove('border-b-2', 'border-blue-600', 'text-blue-600');
    tabFileBtn.classList.add('text-gray-600');
  } else {
    pasteTab.classList.add('hidden');
    fileTab.classList.remove('hidden');
    tabFileBtn.classList.add('border-b-2', 'border-blue-600', 'text-blue-600');
    tabFileBtn.classList.remove('text-gray-600');
    tabPasteBtn.classList.remove('border-b-2', 'border-blue-600', 'text-blue-600');
    tabPasteBtn.classList.add('text-gray-600');
  }
}

// 파일 선택 핸들러
async function handleBulkFileSelect(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const fileName = file.name;
  const fileSize = (file.size / 1024).toFixed(1);
  const fileExt = fileName.split('.').pop().toLowerCase();
  
  // 파일 타입 확인
  if (!['csv', 'xlsx', 'xls'].includes(fileExt)) {
    showToast('CSV 또는 Excel 파일만 업로드 가능합니다', 'error');
    return;
  }
  
  showToast('파일을 읽는 중...', 'info');
  
  try {
    let data = '';
    
    if (fileExt === 'csv') {
      // CSV 파일 읽기
      data = await readCSVFile(file);
    } else {
      // Excel 파일은 CSV로 변환 필요 (간단한 방법: 사용자에게 CSV로 저장 요청)
      showToast('Excel 파일은 CSV로 저장한 후 업로드해주세요', 'warning');
      event.target.value = '';
      return;
    }
    
    // 파일 정보 저장
    window.bulkFileData = data;
    
    // UI 업데이트
    document.getElementById('fileName').textContent = fileName;
    document.getElementById('fileInfo').textContent = `${fileSize}KB`;
    document.getElementById('filePreview').classList.remove('hidden');
    
    // 데이터 미리보기
    const lines = data.trim().split('\n');
    const previewLines = lines.slice(0, 6); // 헤더 + 최대 5행
    const preview = previewLines.map((line, idx) => {
      const style = idx === 0 ? 'font-bold text-blue-600' : 'text-gray-700';
      return `<div class="${style}">${line}</div>`;
    }).join('');
    document.getElementById('dataPreview').innerHTML = preview;
    
    showToast(`${fileName} 파일을 읽었습니다`, 'success');
  } catch (error) {
    showToast('파일 읽기 실패', 'error');
    event.target.value = '';
  }
}

// CSV 파일 읽기
function readCSVFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(e);
    reader.readAsText(file, 'UTF-8');
  });
}

// 파일 삭제
function clearBulkFile() {
  window.bulkFileData = null;
  document.getElementById('bulkFileInput').value = '';
  document.getElementById('filePreview').classList.add('hidden');
  showToast('파일이 제거되었습니다', 'info');
}

async function processBulkUpload() {
  let bulkData = '';
  
  // 파일 업로드 탭인 경우
  if (window.bulkFileData) {
    bulkData = window.bulkFileData;
  } else {
    // 붙여넣기 탭인 경우
    bulkData = document.getElementById('bulkData').value;
  }
  
  if (!bulkData.trim()) {
    showToast('데이터를 입력하거나 파일을 선택해주세요', 'warning');
    return;
  }
  
  const lines = bulkData.trim().split('\n');
  const members = [];
  
  // 첫 줄은 헤더로 스킵
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // CSV는 쉼표로, 붙여넣기는 탭으로 구분
    const cols = line.includes(',') ? line.split(',') : line.split('\t');
    
    if (cols.length >= 6) {
      // 따옴표 제거 (CSV 파일의 경우)
      const cleanValue = (val) => val ? val.trim().replace(/^["']|["']$/g, '') : '';
      
      members.push({
        name: cleanValue(cols[0]),
        gender: cleanValue(cols[1]),
        birth_year: parseInt(cleanValue(cols[2])),
        club: cleanValue(cols[3]),
        grade: cleanValue(cols[4]),
        phone: cleanValue(cols[5]),
        fee_paid: cols[6] ? parseInt(cleanValue(cols[6])) : 0,
        car_registered: cols[7] ? parseInt(cleanValue(cols[7])) : 0
      });
    }
  }
  
  if (members.length === 0) {
    showToast('올바른 데이터를 입력해주세요', 'warning');
    return;
  }
  
  try {
    const response = await axios.post(`${API_BASE}/members/bulk`, { members });
    showToast(response.data.message, 'success');
    closeModal();
    await loadMembers();
    document.getElementById('membersTableBody').innerHTML = renderMembersTable();
  } catch (error) {
    showToast('일괄 업로드 실패', 'error');
  }
}

async function exportMembers() {
  try {
    const response = await axios.get(`${API_BASE}/members/export`);
    const members = response.data.members;
    
    // CSV 생성
    let csv = '이름,성별,출생년도,클럽,급수,연락처,회비납부,차량등록\n';
    members.forEach(m => {
      csv += `${m.name},${m.gender},${m.birth_year},${m.club},${m.grade},${m.phone},${m.fee_paid ? '납부' : '미납'},${m.car_registered ? '등록' : '미등록'}\n`;
    });
    
    // 다운로드
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `회원목록_${dayjs().format('YYYY-MM-DD')}.csv`;
    link.click();
    
    showToast('엑셀 파일이 다운로드되었습니다', 'success');
  } catch (error) {
    showToast('엑셀 내보내기 실패', 'error');
  }
}

async function deleteMember(id) {
  if (!confirm('정말 이 회원을 삭제하시겠습니까?')) return;
  
  try {
    await axios.delete(`${API_BASE}/members/${id}`);
    showToast('회원이 삭제되었습니다', 'success');
    await loadMembers();
    document.getElementById('membersTableBody').innerHTML = renderMembersTable();
  } catch (error) {
    showToast('회원 삭제 실패', 'error');
  }
}

// 전체 회원 삭제 확인 모달
function showDeleteAllMembersConfirm() {
  const totalMembers = app.data.members.length;
  
  if (totalMembers === 0) {
    showToast('삭제할 회원이 없습니다', 'info');
    return;
  }
  
  const modal = `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <div class="text-center mb-6">
          <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
            <i class="fas fa-exclamation-triangle text-3xl text-red-600"></i>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">전체 회원 삭제</h2>
          <p class="text-gray-600">정말로 <strong class="text-red-600">모든 회원(${totalMembers}명)</strong>을 삭제하시겠습니까?</p>
        </div>
        
        <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div class="flex">
            <div class="flex-shrink-0">
              <i class="fas fa-exclamation-circle text-yellow-400"></i>
            </div>
            <div class="ml-3">
              <p class="text-sm text-yellow-700">
                <strong>경고:</strong> 이 작업은 되돌릴 수 없습니다!
              </p>
              <ul class="mt-2 text-sm text-yellow-700 list-disc list-inside">
                <li>모든 회원 정보가 삭제됩니다</li>
                <li>회비 납부 내역도 함께 삭제됩니다</li>
                <li>출석 기록도 함께 삭제됩니다</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            확인을 위해 <strong>"전체삭제"</strong>를 입력하세요:
          </label>
          <input 
            type="text" 
            id="deleteConfirmText" 
            placeholder="전체삭제"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
          />
        </div>
        
        <div class="flex gap-3">
          <button 
            onclick="closeModal()" 
            class="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold"
          >
            취소
          </button>
          <button 
            onclick="confirmDeleteAllMembers()" 
            class="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
          >
            삭제 확인
          </button>
        </div>
      </div>
    </div>
  `;
  
  document.getElementById('modalContainer').innerHTML = modal;
}

// 전체 회원 삭제 실행
async function confirmDeleteAllMembers() {
  const confirmText = document.getElementById('deleteConfirmText').value;
  
  if (confirmText !== '전체삭제') {
    showToast('확인 문구를 정확히 입력해주세요', 'warning');
    return;
  }
  
  try {
    await axios.delete(`${API_BASE}/members`);
    showToast('전체 회원이 삭제되었습니다', 'success');
    closeModal();
    await loadMembers();
    document.getElementById('membersTableBody').innerHTML = renderMembersTable();
  } catch (error) {
    showToast('전체 회원 삭제 실패', 'error');
  }
}

function closeModal() {
  document.getElementById('modalContainer').innerHTML = '';
}

// 일정관리 페이지 (계속...)
function renderSchedulesPage() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  
  return `
    <div class="space-y-6">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 class="text-3xl font-bold text-gray-800">일정관리</h1>
        <div class="flex flex-wrap gap-2">
          <button onclick="showAddScheduleModal()" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            <i class="fas fa-plus mr-2"></i>일정 추가
          </button>
          <button onclick="showGenerateRegularModal()" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            <i class="fas fa-calendar-plus mr-2"></i>정기모임 생성
          </button>
          <button onclick="showDeleteAllSchedulesConfirm()" class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
            <i class="fas fa-trash-alt mr-2"></i>전체 초기화
          </button>
        </div>
      </div>
      
      <!-- 월별 필터 -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <div class="flex flex-wrap gap-4 items-center">
          <select id="yearFilter" class="px-4 py-2 border border-gray-300 rounded-lg">
            <option value="${currentYear - 1}">${currentYear - 1}년</option>
            <option value="${currentYear}" selected>${currentYear}년</option>
            <option value="${currentYear + 1}">${currentYear + 1}년</option>
          </select>
          <select id="monthFilter" class="px-4 py-2 border border-gray-300 rounded-lg">
            ${Array.from({length: 12}, (_, i) => i + 1).map(m => 
              `<option value="${m}" ${m === currentMonth ? 'selected' : ''}>${m}월</option>`
            ).join('')}
          </select>
          <button onclick="filterSchedules()" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            <i class="fas fa-search mr-2"></i>조회
          </button>
        </div>
      </div>
      
      <!-- 일정 목록 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        ${renderSchedulesList()}
      </div>
    </div>
    
    <div id="modalContainer"></div>
  `;
}

function renderSchedulesList() {
  if (!app.data.schedules || app.data.schedules.length === 0) {
    return '<div class="col-span-2 bg-white p-12 rounded-lg shadow-md text-center text-gray-500">등록된 일정이 없습니다</div>';
  }
  
  return app.data.schedules.map(schedule => `
    <div class="bg-white p-6 rounded-lg shadow-md border-l-4 ${schedule.schedule_type === '정기모임' ? 'border-blue-600' : 'border-green-600'}">
      <div class="flex justify-between items-start mb-4">
        <div>
          <h3 class="text-xl font-bold text-gray-800">${schedule.title}</h3>
          <span class="inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full ${schedule.schedule_type === '정기모임' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}">
            ${schedule.schedule_type}
          </span>
        </div>
        <div class="flex gap-2">
          <button onclick="showEditScheduleModal(${schedule.id})" class="text-green-600 hover:text-green-800">
            <i class="fas fa-edit"></i>
          </button>
          <button onclick="deleteSchedule(${schedule.id})" class="text-red-600 hover:text-red-800">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
      
      <div class="space-y-2 text-gray-600">
        <p><i class="fas fa-calendar text-blue-600 w-6"></i>${dayjs(schedule.schedule_date).format('YYYY년 M월 D일 (ddd)')}</p>
        <p><i class="fas fa-clock text-blue-600 w-6"></i>${schedule.start_time} - ${schedule.end_time}</p>
        <p><i class="fas fa-map-marker-alt text-blue-600 w-6"></i>${schedule.location}</p>
        ${schedule.description ? `<p class="text-sm text-gray-500 mt-3">${schedule.description}</p>` : ''}
      </div>
      
      <div class="mt-4 pt-4 border-t">
        <button onclick="viewAttendance(${schedule.id})" class="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700">
          <i class="fas fa-check-circle mr-2"></i>출석 관리
        </button>
      </div>
    </div>
  `).join('');
}

function attachSchedulesHandlers() {
  // 초기 필터 적용
  filterSchedules();
}

async function filterSchedules() {
  const year = document.getElementById('yearFilter').value;
  const month = document.getElementById('monthFilter').value;
  
  await loadSchedules({ year, month });
  
  const container = document.querySelector('.grid.grid-cols-1.lg\\:grid-cols-2');
  if (container) {
    container.innerHTML = renderSchedulesList();
  }
}

function showAddScheduleModal() {
  const modal = `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg p-6 w-full max-w-2xl">
        <h2 class="text-2xl font-bold mb-6">일정 추가</h2>
        <form id="addScheduleForm" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">제목 *</label>
            <input type="text" name="title" required class="w-full px-4 py-2 border rounded-lg">
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-2">일정 유형 *</label>
              <select name="schedule_type" required class="w-full px-4 py-2 border rounded-lg">
                <option value="정기모임">정기모임</option>
                <option value="특별모임">특별모임</option>
                <option value="기타">기타</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">일정 날짜 *</label>
              <input type="date" name="schedule_date" required class="w-full px-4 py-2 border rounded-lg">
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">시작 시간 *</label>
              <input type="time" name="start_time" required value="17:00" class="w-full px-4 py-2 border rounded-lg">
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">종료 시간 *</label>
              <input type="time" name="end_time" required value="20:00" class="w-full px-4 py-2 border rounded-lg">
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">장소 *</label>
            <input type="text" name="location" required value="비산노인복지회관 5층" class="w-full px-4 py-2 border rounded-lg">
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">설명</label>
            <textarea name="description" rows="3" class="w-full px-4 py-2 border rounded-lg"></textarea>
          </div>
          <div class="flex justify-end gap-2 mt-6">
            <button type="button" onclick="closeModal()" class="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">취소</button>
            <button type="submit" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">추가</button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  document.getElementById('modalContainer').innerHTML = modal;
  
  document.getElementById('addScheduleForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    try {
      await axios.post(`${API_BASE}/schedules`, data);
      showToast('일정이 추가되었습니다', 'success');
      closeModal();
      await filterSchedules();
    } catch (error) {
      showToast('일정 추가 실패', 'error');
    }
  });
}

// 일정 수정 모달
function showEditScheduleModal(scheduleId) {
  const schedule = app.data.schedules.find(s => s.id === scheduleId);
  if (!schedule) {
    showToast('일정을 찾을 수 없습니다', 'error');
    return;
  }
  
  const modal = `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 class="text-2xl font-bold mb-6">일정 수정</h2>
        <form id="editScheduleForm" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">제목 *</label>
            <input type="text" name="title" value="${schedule.title}" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-2">일정 유형 *</label>
              <select name="schedule_type" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="정기모임" ${schedule.schedule_type === '정기모임' ? 'selected' : ''}>정기모임</option>
                <option value="특별모임" ${schedule.schedule_type === '특별모임' ? 'selected' : ''}>특별모임</option>
                <option value="기타" ${schedule.schedule_type === '기타' ? 'selected' : ''}>기타</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">일정 날짜 *</label>
              <input type="date" name="schedule_date" value="${schedule.schedule_date}" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">시작 시간 *</label>
              <input type="time" name="start_time" value="${schedule.start_time}" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">종료 시간 *</label>
              <input type="time" name="end_time" value="${schedule.end_time}" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">장소 *</label>
            <input type="text" name="location" value="${schedule.location}" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">설명</label>
            <textarea name="description" rows="3" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">${schedule.description || ''}</textarea>
          </div>
          <div class="flex justify-end gap-2 mt-6">
            <button type="button" onclick="closeModal()" class="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">취소</button>
            <button type="submit" class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              <i class="fas fa-save mr-2"></i>저장
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  document.getElementById('modalContainer').innerHTML = modal;
  
  document.getElementById('editScheduleForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    try {
      await axios.put(`${API_BASE}/schedules/${scheduleId}`, data);
      showToast('일정이 수정되었습니다', 'success');
      closeModal();
      await filterSchedules();
    } catch (error) {
      showToast('일정 수정 실패', 'error');
    }
  });
}

function showGenerateRegularModal() {
  const currentYear = new Date().getFullYear();
  
  const modal = `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg p-6 w-full max-w-2xl">
        <h2 class="text-2xl font-bold mb-6">정기모임 일괄 생성</h2>
        
        <div class="mb-6 p-4 bg-blue-50 rounded-lg">
          <p class="text-sm text-gray-700">매달 <strong>1주째 토요일</strong>에 정기모임, <strong>3주째 토요일</strong>에 특별모임이 자동으로 생성됩니다.</p>
          <p class="text-sm text-gray-700 mt-2">시간: 17:00 - 20:00 / 장소: 비산노인복지회관 5층</p>
        </div>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">년도 *</label>
            <select id="generateYear" class="w-full px-4 py-2 border rounded-lg">
              <option value="${currentYear}">${currentYear}년</option>
              <option value="${currentYear + 1}">${currentYear + 1}년</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-2">생성할 월 선택 (복수 선택 가능)</label>
            <div class="grid grid-cols-4 gap-2">
              ${Array.from({length: 12}, (_, i) => i + 1).map(m => `
                <label class="flex items-center">
                  <input type="checkbox" value="${m}" class="month-checkbox mr-2">
                  <span>${m}월</span>
                </label>
              `).join('')}
            </div>
          </div>
          
          <div class="flex gap-2">
            <button onclick="selectAllMonths()" class="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-sm">전체 선택</button>
            <button onclick="deselectAllMonths()" class="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-sm">선택 해제</button>
          </div>
        </div>
        
        <div class="flex justify-end gap-2 mt-6">
          <button type="button" onclick="closeModal()" class="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">취소</button>
          <button onclick="generateRegularSchedules()" class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <i class="fas fa-calendar-plus mr-2"></i>생성
          </button>
        </div>
      </div>
    </div>
  `;
  
  document.getElementById('modalContainer').innerHTML = modal;
}

function selectAllMonths() {
  document.querySelectorAll('.month-checkbox').forEach(cb => cb.checked = true);
}

function deselectAllMonths() {
  document.querySelectorAll('.month-checkbox').forEach(cb => cb.checked = false);
}

async function generateRegularSchedules() {
  const year = parseInt(document.getElementById('generateYear').value);
  const months = Array.from(document.querySelectorAll('.month-checkbox:checked')).map(cb => parseInt(cb.value));
  
  if (months.length === 0) {
    showToast('월을 선택해주세요', 'warning');
    return;
  }
  
  try {
    const response = await axios.post(`${API_BASE}/schedules/generate-regular`, { year, months });
    showToast(response.data.message, 'success');
    closeModal();
    await filterSchedules();
  } catch (error) {
    showToast('정기모임 생성 실패', 'error');
  }
}

async function deleteSchedule(id) {
  if (!confirm('정말 이 일정을 삭제하시겠습니까?')) return;
  
  try {
    await axios.delete(`${API_BASE}/schedules/${id}`);
    showToast('일정이 삭제되었습니다', 'success');
    await filterSchedules();
  } catch (error) {
    showToast('일정 삭제 실패', 'error');
  }
}

// 전체 일정 초기화 확인 모달
function showDeleteAllSchedulesConfirm() {
  closeModal();
  
  setTimeout(() => {
    const modal = `
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg p-6 w-full max-w-2xl">
          <div class="flex items-start mb-6">
            <div class="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mr-4">
              <i class="fas fa-exclamation-triangle text-red-600 text-2xl"></i>
            </div>
            <div class="flex-1">
              <h2 class="text-2xl font-bold text-gray-900 mb-2">
                전체 일정 초기화
              </h2>
              <p class="text-gray-600">
                이 작업은 <strong>되돌릴 수 없습니다</strong>. 신중하게 진행해주세요.
              </p>
            </div>
          </div>
          
          <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div class="flex">
              <div class="flex-shrink-0">
                <i class="fas fa-exclamation-circle text-yellow-400"></i>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-yellow-800 mb-2">삭제될 데이터</h3>
                <ul class="text-sm text-yellow-700 space-y-1">
                  <li><i class="fas fa-check mr-2"></i>모든 일정 데이터</li>
                  <li><i class="fas fa-check mr-2"></i>모든 출석 기록</li>
                  <li><i class="fas fa-check mr-2"></i>정기모임 및 특별모임</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              계속하려면 <strong class="text-red-600">"전체초기화"</strong>를 정확히 입력하세요
            </label>
            <input 
              type="text" 
              id="deleteAllSchedulesConfirmText" 
              placeholder="전체초기화"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
          </div>
          
          <div class="flex justify-end gap-2">
            <button 
              type="button" 
              onclick="closeModal()" 
              class="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              취소
            </button>
            <button 
              onclick="confirmDeleteAllSchedules()" 
              class="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <i class="fas fa-trash-alt mr-2"></i>초기화 확인
            </button>
          </div>
        </div>
      </div>
    `;
    
    document.getElementById('modalContainer').innerHTML = modal;
    
    // 입력 필드에 포커스
    setTimeout(() => {
      document.getElementById('deleteAllSchedulesConfirmText')?.focus();
    }, 100);
  }, 100);
}

// 전체 일정 초기화 실행
async function confirmDeleteAllSchedules() {
  const confirmText = document.getElementById('deleteAllSchedulesConfirmText').value;
  
  if (confirmText !== '전체초기화') {
    showToast('확인 문구를 정확히 입력해주세요', 'error');
    return;
  }
  
  try {
    // 출석 데이터 삭제
    await axios.delete(`${API_BASE}/attendances/all`);
    
    // 일정 데이터 삭제
    await axios.delete(`${API_BASE}/schedules/all`);
    
    showToast('모든 일정과 출석 데이터가 초기화되었습니다', 'success');
    closeModal();
    await filterSchedules();
  } catch (error) {
    console.error('Delete all schedules error:', error);
    showToast('초기화 중 오류가 발생했습니다', 'error');
  }
}

async function viewAttendance(scheduleId) {
  // 출석 관리 페이지로 이동
  app.currentPage = 'attendance';
  app.selectedScheduleId = scheduleId;
  await renderCurrentPage();
}

// 출석관리 페이지
function renderAttendancePage() {
  return `
    <div class="space-y-4 md:space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 class="text-2xl md:text-3xl font-bold text-gray-800">출석관리</h1>
        <button onclick="showAttendanceStats()" class="bg-purple-600 text-white px-4 py-2.5 rounded-lg hover:bg-purple-700 w-full sm:w-auto">
          <i class="fas fa-chart-bar mr-2"></i>통계 보기
        </button>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <!-- 일정 선택 -->
        <div class="lg:col-span-1">
          <div class="bg-white p-4 md:p-6 rounded-lg shadow-md">
            <h3 class="text-base md:text-lg font-bold mb-3 md:mb-4">일정 선택</h3>
            <div id="scheduleList" class="space-y-2 max-h-[300px] lg:max-h-[600px] overflow-y-auto">
              ${renderScheduleListForAttendance()}
            </div>
          </div>
        </div>
        
        <!-- 출석 체크 -->
        <div class="lg:col-span-2">
          <div class="bg-white p-4 md:p-6 rounded-lg shadow-md">
            <h3 class="text-base md:text-lg font-bold mb-3 md:mb-6 lg:hidden">출석 체크</h3>
            <div id="attendanceCheckArea">
              <p class="text-center text-gray-500 py-8 md:py-12">일정을 선택해주세요</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div id="modalContainer"></div>
  `;
}

function renderScheduleListForAttendance() {
  if (!app.data.schedules || app.data.schedules.length === 0) {
    return '<p class="text-gray-500 text-sm">등록된 일정이 없습니다</p>';
  }
  
  return app.data.schedules.map(schedule => `
    <button 
      onclick="selectScheduleForAttendance(${schedule.id})"
      class="w-full text-left p-3 border rounded-lg hover:bg-blue-50 hover:border-blue-600 transition ${app.selectedScheduleId === schedule.id ? 'bg-blue-50 border-blue-600' : ''}"
    >
      <p class="font-semibold text-sm">${schedule.title}</p>
      <p class="text-xs text-gray-600">${dayjs(schedule.schedule_date).format('M월 D일 (ddd)')}</p>
    </button>
  `).join('');
}

async function selectScheduleForAttendance(scheduleId) {
  app.selectedScheduleId = scheduleId;
  
  try {
    // 일정 정보와 회원 목록 로드
    const [scheduleRes, membersRes, attendanceRes] = await Promise.all([
      axios.get(`${API_BASE}/schedules/${scheduleId}`),
      axios.get(`${API_BASE}/members`),
      axios.get(`${API_BASE}/attendances/schedule/${scheduleId}`)
    ]);
    
    const schedule = scheduleRes.data.schedule;
    const members = membersRes.data.members;
    const attendances = attendanceRes.data.attendances;
    
    // 출석 맵 생성
    const attendanceMap = {};
    attendances.forEach(a => {
      attendanceMap[a.member_id] = a.status;
    });
    
    const html = `
      <div class="mb-4 md:mb-6 p-3 md:p-4 bg-blue-50 rounded-lg">
        <h4 class="font-bold text-base md:text-lg">${schedule.title}</h4>
        <p class="text-xs md:text-sm text-gray-700">${dayjs(schedule.schedule_date).format('YYYY년 M월 D일 (ddd)')} ${schedule.start_time} - ${schedule.end_time}</p>
        <p class="text-xs md:text-sm text-gray-700">${schedule.location}</p>
      </div>
      
      <div class="mb-3 md:mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <p class="text-sm text-gray-600 font-medium">총 ${members.length}명 중 <span class="text-green-600 font-bold">${Object.values(attendanceMap).filter(s => s === '출석').length}명</span> 출석</p>
        <input 
          type="text" 
          id="attendanceSearch" 
          placeholder="회원 검색" 
          class="px-3 md:px-4 py-2 border rounded-lg w-full sm:w-64 text-sm md:text-base"
          onkeyup="filterAttendanceMembers()"
        />
      </div>
      
      <div class="space-y-3 md:space-y-4 max-h-[400px] md:max-h-[500px] overflow-y-auto" id="attendanceMemberList">
        ${renderAttendanceMembersByClub(members, attendanceMap, scheduleId)}
      </div>
    `;
    
    document.getElementById('attendanceCheckArea').innerHTML = html;
    
    // 일정 목록에서 활성화 표시
    document.querySelectorAll('#scheduleList button').forEach(btn => {
      btn.classList.remove('bg-blue-50', 'border-blue-600');
    });
    document.querySelector(`#scheduleList button[onclick="selectScheduleForAttendance(${scheduleId})"]`).classList.add('bg-blue-50', 'border-blue-600');
    
  } catch (error) {
    console.error('출석 데이터 로드 실패:', error);
    showToast('출석 데이터 로드 실패', 'error');
  }
}

// 클럽별로 회원 그룹화하여 렌더링
function renderAttendanceMembersByClub(members, attendanceMap, scheduleId) {
  // 클럽별로 회원 그룹화
  const membersByClub = {};
  members.forEach(member => {
    if (!membersByClub[member.club]) {
      membersByClub[member.club] = [];
    }
    membersByClub[member.club].push(member);
  });
  
  // 클럽명 정렬
  const clubs = Object.keys(membersByClub).sort();
  
  return clubs.map(club => {
    const clubMembers = membersByClub[club];
    const clubAttendedCount = clubMembers.filter(m => attendanceMap[m.id] === '출석').length;
    
    return `
      <div class="border rounded-lg overflow-hidden club-section">
        <button 
          onclick="toggleClubSection('club-${club.replace(/\s+/g, '-')}')"
          class="w-full px-3 md:px-4 py-2.5 md:py-3 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 flex items-center justify-between transition"
        >
          <div class="flex items-center gap-2 md:gap-3">
            <i class="fas fa-users text-blue-600 text-sm md:text-base"></i>
            <span class="font-bold text-gray-800 text-sm md:text-base">${club}</span>
            <span class="text-xs md:text-sm text-gray-600">(${clubMembers.length}명)</span>
          </div>
          <div class="flex items-center gap-2 md:gap-3">
            <span class="text-xs md:text-sm font-semibold ${clubAttendedCount > 0 ? 'text-green-600' : 'text-gray-500'}">
              출석 ${clubAttendedCount}명
            </span>
            <i class="fas fa-chevron-down text-gray-500 text-sm club-toggle-icon" id="icon-club-${club.replace(/\s+/g, '-')}"></i>
          </div>
        </button>
        
        <div class="space-y-2 p-2 md:p-3 bg-white" id="club-${club.replace(/\s+/g, '-')}" style="display: block;">
          ${clubMembers.map(member => {
            const status = attendanceMap[member.id] || '결석';
            return `
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border rounded-lg hover:bg-gray-50 member-attendance-item gap-3" 
                   data-member-name="${member.name}" data-club="${club}">
                <div class="flex-1">
                  <p class="font-semibold text-sm md:text-base">${member.name}</p>
                  <p class="text-xs md:text-sm text-gray-600">${member.grade}급 · ${member.phone}</p>
                </div>
                <div class="flex gap-2 w-full sm:w-auto">
                  <button 
                    onclick="toggleAttendance(${scheduleId}, ${member.id}, '출석')"
                    class="flex-1 sm:flex-none px-3 md:px-4 py-2 md:py-2 rounded-lg transition text-sm md:text-base ${status === '출석' ? 'bg-green-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}"
                  >
                    <i class="fas fa-check mr-1"></i>출석
                  </button>
                  <button 
                    onclick="toggleAttendance(${scheduleId}, ${member.id}, '결석')"
                    class="flex-1 sm:flex-none px-3 md:px-4 py-2 md:py-2 rounded-lg transition text-sm md:text-base ${status === '결석' ? 'bg-red-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}"
                  >
                    <i class="fas fa-times mr-1"></i>결석
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }).join('');
}

// 클럽 섹션 토글
function toggleClubSection(clubId) {
  const section = document.getElementById(clubId);
  const icon = document.getElementById(`icon-${clubId}`);
  
  if (section.style.display === 'none') {
    section.style.display = 'block';
    icon.classList.remove('fa-chevron-right');
    icon.classList.add('fa-chevron-down');
  } else {
    section.style.display = 'none';
    icon.classList.remove('fa-chevron-down');
    icon.classList.add('fa-chevron-right');
  }
}

function filterAttendanceMembers() {
  const search = document.getElementById('attendanceSearch').value.toLowerCase();
  document.querySelectorAll('.member-attendance-item').forEach(item => {
    const name = item.dataset.memberName.toLowerCase();
    item.style.display = name.includes(search) ? 'flex' : 'none';
  });
}

async function toggleAttendance(scheduleId, memberId, status) {
  try {
    await axios.post(`${API_BASE}/attendances/check`, {
      schedule_id: scheduleId,
      member_id: memberId,
      status
    });
    
    // 출석 체크 영역 다시 로드
    await selectScheduleForAttendance(scheduleId);
  } catch (error) {
    showToast('출석 체크 실패', 'error');
  }
}

async function showAttendanceStats() {
  try {
    const response = await axios.get(`${API_BASE}/attendances/stats/overall`);
    const stats = response.data;
    
    const modal = `
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div class="bg-white rounded-lg p-6 w-full max-w-6xl my-8">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold">출석 통계</h2>
            <button onclick="closeModal()" class="text-gray-600 hover:text-gray-800">
              <i class="fas fa-times text-2xl"></i>
            </button>
          </div>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- 회원별 출석 순위 -->
            <div>
              <h3 class="text-lg font-bold mb-4">회원별 출석 순위 (TOP 20)</h3>
              <div class="space-y-2 max-h-[500px] overflow-y-auto">
                ${stats.memberRanking.map((member, index) => `
                  <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div class="flex items-center">
                      <span class="w-8 h-8 flex items-center justify-center ${index < 3 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 'bg-gray-300'} text-white rounded-full font-bold mr-3">
                        ${index + 1}
                      </span>
                      <div>
                        <p class="font-semibold">${member.name}</p>
                        <p class="text-sm text-gray-600">${member.club} / ${member.grade}급</p>
                      </div>
                    </div>
                    <div class="text-right">
                      <p class="text-2xl font-bold text-blue-600">${member.attendance_count}</p>
                      <p class="text-xs text-gray-500">${member.attendance_rate}%</p>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
            
            <!-- 일정별 출석 현황 -->
            <div>
              <h3 class="text-lg font-bold mb-4">일정별 출석 현황</h3>
              <div class="space-y-2 max-h-[500px] overflow-y-auto">
                ${stats.scheduleStats.map(schedule => `
                  <div class="p-3 border rounded-lg">
                    <div class="flex justify-between items-start mb-2">
                      <div>
                        <p class="font-semibold">${schedule.title}</p>
                        <p class="text-sm text-gray-600">${dayjs(schedule.schedule_date).format('M월 D일')}</p>
                      </div>
                      <span class="px-3 py-1 text-xs font-semibold rounded-full ${schedule.schedule_type === '정기모임' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}">
                        ${schedule.schedule_type}
                      </span>
                    </div>
                    <div class="flex items-center">
                      <div class="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                        <div class="bg-green-600 h-2 rounded-full" style="width: ${schedule.total_count > 0 ? (schedule.attendance_count / schedule.total_count * 100) : 0}%"></div>
                      </div>
                      <span class="text-sm font-semibold">${schedule.attendance_count}/${schedule.total_count}</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
          
          <div class="mt-6 text-center">
            <button onclick="closeModal()" class="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">닫기</button>
          </div>
        </div>
      </div>
    `;
    
    document.getElementById('modalContainer').innerHTML = modal;
  } catch (error) {
    showToast('통계 조회 실패', 'error');
  }
}

function attachAttendanceHandlers() {
  // 필요시 핸들러 추가
}

// 재고관리 페이지
function renderInventoryPage() {
  return `
    <div class="space-y-6">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 class="text-3xl font-bold text-gray-800">재고관리</h1>
        <button onclick="showAddInventoryModal()" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <i class="fas fa-plus mr-2"></i>재고 추가
        </button>
      </div>
      
      <!-- 재고 현황 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${renderInventoryCards()}
      </div>
    </div>
    
    <div id="modalContainer"></div>
  `;
}

function renderInventoryCards() {
  if (!app.data.inventory || app.data.inventory.length === 0) {
    return '<div class="col-span-3 bg-white p-12 rounded-lg shadow-md text-center text-gray-500">등록된 재고가 없습니다</div>';
  }
  
  return app.data.inventory.map(item => {
    const isLowStock = item.quantity <= item.min_quantity;
    return `
      <div class="bg-white p-6 rounded-lg shadow-md ${isLowStock ? 'border-2 border-red-500' : ''}">
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="text-lg font-bold text-gray-800">${item.item_name}</h3>
            ${item.note ? `<p class="text-sm text-gray-600 mt-1">${item.note}</p>` : ''}
          </div>
          ${isLowStock ? '<span class="px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">부족</span>' : ''}
        </div>
        
        <div class="mb-4">
          <p class="text-3xl font-bold ${isLowStock ? 'text-red-600' : 'text-green-600'}">${item.quantity} ${item.unit}</p>
          <p class="text-sm text-gray-600 mt-1">최소 필요: ${item.min_quantity}${item.unit}</p>
        </div>
        
        <div class="flex gap-2">
          <button onclick="showInventoryTransaction(${item.id}, '입고')" class="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 text-sm">
            <i class="fas fa-plus mr-1"></i>입고
          </button>
          <button onclick="showInventoryTransaction(${item.id}, '출고')" class="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 text-sm">
            <i class="fas fa-minus mr-1"></i>출고
          </button>
          <button onclick="showInventoryLogs(${item.id})" class="px-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
            <i class="fas fa-history"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function attachInventoryHandlers() {
  // 필요시 핸들러 추가
}

function showAddInventoryModal() {
  const modal = `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 class="text-2xl font-bold mb-6">재고 추가</h2>
        <form id="addInventoryForm" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">품목명 *</label>
            <input type="text" name="item_name" required class="w-full px-4 py-2 border rounded-lg">
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-2">수량 *</label>
              <input type="number" name="quantity" required class="w-full px-4 py-2 border rounded-lg">
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">단위 *</label>
              <input type="text" name="unit" required placeholder="개, 병, 장 등" class="w-full px-4 py-2 border rounded-lg">
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">최소 필요 수량</label>
            <input type="number" name="min_quantity" value="10" class="w-full px-4 py-2 border rounded-lg">
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">메모</label>
            <textarea name="note" rows="2" class="w-full px-4 py-2 border rounded-lg"></textarea>
          </div>
          <div class="flex justify-end gap-2 mt-6">
            <button type="button" onclick="closeModal()" class="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">취소</button>
            <button type="submit" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">추가</button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  document.getElementById('modalContainer').innerHTML = modal;
  
  document.getElementById('addInventoryForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    data.quantity = parseInt(data.quantity);
    data.min_quantity = parseInt(data.min_quantity);
    
    try {
      await axios.post(`${API_BASE}/inventory`, data);
      showToast('재고가 추가되었습니다', 'success');
      closeModal();
      await loadInventory();
      renderCurrentPage();
    } catch (error) {
      showToast('재고 추가 실패', 'error');
    }
  });
}

function showInventoryTransaction(itemId, type) {
  const item = app.data.inventory.find(i => i.id === itemId);
  
  const modal = `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 class="text-2xl font-bold mb-6">${item.item_name} - ${type}</h2>
        <form id="transactionForm" class="space-y-4">
          <div class="p-4 bg-gray-50 rounded-lg">
            <p class="text-sm text-gray-600">현재 재고</p>
            <p class="text-3xl font-bold text-gray-800">${item.quantity} ${item.unit}</p>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">${type} 수량 *</label>
            <input type="number" id="transactionQuantity" required min="1" class="w-full px-4 py-2 border rounded-lg">
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">메모</label>
            <textarea id="transactionNote" rows="2" class="w-full px-4 py-2 border rounded-lg"></textarea>
          </div>
          <div class="flex justify-end gap-2 mt-6">
            <button type="button" onclick="closeModal()" class="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">취소</button>
            <button type="submit" class="px-6 py-2 ${type === '입고' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white rounded-lg">
              ${type}
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  document.getElementById('modalContainer').innerHTML = modal;
  
  document.getElementById('transactionForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const quantity = parseInt(document.getElementById('transactionQuantity').value);
    const note = document.getElementById('transactionNote').value;
    
    try {
      await axios.post(`${API_BASE}/inventory/${itemId}/transaction`, { type, quantity, note });
      showToast(`${type}가 처리되었습니다`, 'success');
      closeModal();
      await loadInventory();
      renderCurrentPage();
    } catch (error) {
      showToast(error.response?.data?.error || `${type} 처리 실패`, 'error');
    }
  });
}

async function showInventoryLogs(itemId) {
  try {
    const response = await axios.get(`${API_BASE}/inventory/${itemId}/logs`);
    const logs = response.data.logs;
    const item = app.data.inventory.find(i => i.id === itemId);
    
    const modal = `
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg p-6 w-full max-w-2xl">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold">${item.item_name} - 입출고 내역</h2>
            <button onclick="closeModal()" class="text-gray-600 hover:text-gray-800">
              <i class="fas fa-times text-2xl"></i>
            </button>
          </div>
          
          <div class="space-y-2 max-h-[500px] overflow-y-auto">
            ${logs.length === 0 ? '<p class="text-center text-gray-500 py-8">입출고 내역이 없습니다</p>' : ''}
            ${logs.map(log => `
              <div class="flex items-center justify-between p-3 border rounded-lg">
                <div class="flex items-center">
                  <span class="w-12 h-12 flex items-center justify-center ${log.type === '입고' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'} rounded-full mr-3">
                    <i class="fas fa-${log.type === '입고' ? 'plus' : 'minus'}"></i>
                  </span>
                  <div>
                    <p class="font-semibold">${log.type} ${log.quantity}${item.unit}</p>
                    <p class="text-sm text-gray-600">${dayjs(log.created_at).format('YYYY-MM-DD HH:mm')}</p>
                    ${log.note ? `<p class="text-sm text-gray-500">${log.note}</p>` : ''}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
          
          <div class="mt-6 text-center">
            <button onclick="closeModal()" class="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">닫기</button>
          </div>
        </div>
      </div>
    `;
    
    document.getElementById('modalContainer').innerHTML = modal;
  } catch (error) {
    showToast('입출고 내역 조회 실패', 'error');
  }
}

// 게시판 페이지
function renderBoardsPage() {
  return `
    <div class="space-y-6">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 class="text-3xl font-bold text-gray-800">게시판</h1>
        <button onclick="showAddBoardModal()" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <i class="fas fa-plus mr-2"></i>게시판 생성
        </button>
      </div>
      
      <!-- 게시판 목록 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${renderBoardsList()}
      </div>
    </div>
    
    <div id="modalContainer"></div>
  `;
}

function renderBoardsList() {
  if (!app.data.boards || app.data.boards.length === 0) {
    return '<div class="col-span-3 bg-white p-12 rounded-lg shadow-md text-center text-gray-500">생성된 게시판이 없습니다</div>';
  }
  
  return app.data.boards.map(board => `
    <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
      <div class="flex justify-between items-start mb-4">
        <div>
          <h3 class="text-xl font-bold text-gray-800">${board.name}</h3>
          ${board.description ? `<p class="text-sm text-gray-600 mt-2">${board.description}</p>` : ''}
        </div>
        <button onclick="deleteBoard(${board.id})" class="text-red-600 hover:text-red-800">
          <i class="fas fa-trash"></i>
        </button>
      </div>
      <button onclick="viewBoardPosts(${board.id})" class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
        <i class="fas fa-comments mr-2"></i>게시글 보기
      </button>
    </div>
  `).join('');
}

function attachBoardsHandlers() {
  // 필요시 핸들러 추가
}

function showAddBoardModal() {
  const modal = `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 class="text-2xl font-bold mb-6">게시판 생성</h2>
        <form id="addBoardForm" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">게시판 이름 *</label>
            <input type="text" name="name" required class="w-full px-4 py-2 border rounded-lg">
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">설명</label>
            <textarea name="description" rows="3" class="w-full px-4 py-2 border rounded-lg"></textarea>
          </div>
          <div class="flex justify-end gap-2 mt-6">
            <button type="button" onclick="closeModal()" class="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">취소</button>
            <button type="submit" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">생성</button>
          </div>
        </form>
      </div>
    </div>
  `;
  
  document.getElementById('modalContainer').innerHTML = modal;
  
  document.getElementById('addBoardForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    try {
      await axios.post(`${API_BASE}/boards`, data);
      showToast('게시판이 생성되었습니다', 'success');
      closeModal();
      await loadBoards();
      renderCurrentPage();
    } catch (error) {
      showToast('게시판 생성 실패', 'error');
    }
  });
}

async function deleteBoard(id) {
  if (!confirm('정말 이 게시판을 삭제하시겠습니까? 게시판의 모든 게시글도 삭제됩니다.')) return;
  
  try {
    await axios.delete(`${API_BASE}/boards/${id}`);
    showToast('게시판이 삭제되었습니다', 'success');
    await loadBoards();
    renderCurrentPage();
  } catch (error) {
    showToast('게시판 삭제 실패', 'error');
  }
}

async function viewBoardPosts(boardId) {
  try {
    const response = await axios.get(`${API_BASE}/boards/${boardId}/posts`);
    const board = app.data.boards.find(b => b.id === boardId);
    const posts = response.data.posts;
    
    const modal = `
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div class="bg-white rounded-lg p-6 w-full max-w-4xl my-8">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold">${board.name}</h2>
            <div class="flex gap-2">
              <button onclick="showAddPostModal(${boardId})" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                <i class="fas fa-pen mr-2"></i>글쓰기
              </button>
              <button onclick="closeModal()" class="text-gray-600 hover:text-gray-800">
                <i class="fas fa-times text-2xl"></i>
              </button>
            </div>
          </div>
          
          <div class="space-y-2">
            ${posts.length === 0 ? '<p class="text-center text-gray-500 py-8">게시글이 없습니다</p>' : ''}
            ${posts.map(post => `
              <div class="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer" onclick="viewPost(${boardId}, ${post.id})">
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    ${post.is_notice ? '<span class="inline-block px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded mr-2">공지</span>' : ''}
                    <span class="font-semibold text-lg">${post.title}</span>
                  </div>
                  <div class="text-sm text-gray-600">
                    <i class="fas fa-eye mr-1"></i>${post.view_count}
                  </div>
                </div>
                <div class="mt-2 text-sm text-gray-600">
                  <span>${post.author}</span>
                  <span class="mx-2">|</span>
                  <span>${dayjs(post.created_at).format('YYYY-MM-DD HH:mm')}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
    
    document.getElementById('modalContainer').innerHTML = modal;
  } catch (error) {
    showToast('게시글 조회 실패', 'error');
  }
}

function showAddPostModal(boardId) {
  closeModal();
  
  setTimeout(() => {
    const modal = `
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg p-6 w-full max-w-2xl">
          <h2 class="text-2xl font-bold mb-6">글쓰기</h2>
          <form id="addPostForm" class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-2">제목 *</label>
              <input type="text" name="title" required class="w-full px-4 py-2 border rounded-lg">
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">내용 *</label>
              <textarea name="content" rows="10" required class="w-full px-4 py-2 border rounded-lg"></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">작성자 *</label>
              <input type="text" name="author" required value="${app.session.name}" class="w-full px-4 py-2 border rounded-lg">
            </div>
            
            <!-- 파일 첨부 -->
            <div>
              <label class="block text-sm font-medium mb-2">파일 첨부</label>
              <div class="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input 
                  type="file" 
                  id="fileInput" 
                  multiple 
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx" 
                  class="hidden"
                  onchange="handleFileSelect(event)"
                />
                <button 
                  type="button" 
                  onclick="document.getElementById('fileInput').click()"
                  class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg transition"
                >
                  <i class="fas fa-cloud-upload-alt mr-2"></i>
                  파일 선택 (최대 10MB, 이미지/문서)
                </button>
                <div id="fileList" class="mt-3 space-y-2"></div>
              </div>
            </div>
            
            <div>
              <label class="flex items-center">
                <input type="checkbox" name="is_notice" value="1" class="mr-2">
                <span class="text-sm font-medium">공지사항으로 등록</span>
              </label>
            </div>
            <div class="flex justify-end gap-2 mt-6">
              <button type="button" onclick="viewBoardPosts(${boardId})" class="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">취소</button>
              <button type="submit" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">등록</button>
            </div>
          </form>
        </div>
      </div>
    `;
    
    document.getElementById('modalContainer').innerHTML = modal;
    
    // 파일 선택된 파일들을 저장할 배열
    window.selectedFiles = [];
    
    document.getElementById('addPostForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData);
      data.is_notice = data.is_notice ? 1 : 0;
      
      // 업로드된 파일 정보 추가
      data.attachments = window.selectedFiles;
      
      try {
        await axios.post(`${API_BASE}/boards/${boardId}/posts`, data);
        showToast('게시글이 등록되었습니다', 'success');
        await viewBoardPosts(boardId);
      } catch (error) {
        showToast('게시글 등록 실패', 'error');
      }
    });
  }, 100);
}

// 파일 선택 핸들러
async function handleFileSelect(event) {
  const files = Array.from(event.target.files);
  const fileListDiv = document.getElementById('fileList');
  
  for (const file of files) {
    // 파일 크기 체크 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      showToast(`${file.name}은(는) 10MB를 초과합니다`, 'error');
      continue;
    }
    
    // 파일 업로드
    showToast(`${file.name} 업로드 중...`, 'info');
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post(`${API_BASE}/files/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        const fileInfo = response.data.file;
        window.selectedFiles.push(fileInfo);
        
        // 파일 목록에 추가
        const fileItem = document.createElement('div');
        fileItem.className = 'flex items-center justify-between p-2 bg-green-50 rounded border border-green-200';
        fileItem.innerHTML = `
          <div class="flex items-center flex-1">
            <i class="fas fa-file text-green-600 mr-2"></i>
            <span class="text-sm text-gray-700">${fileInfo.name}</span>
            <span class="text-xs text-gray-500 ml-2">(${(fileInfo.size / 1024).toFixed(1)}KB)</span>
          </div>
          <button 
            type="button" 
            onclick="removeFile('${fileInfo.r2Key}')"
            class="text-red-600 hover:text-red-800"
          >
            <i class="fas fa-times"></i>
          </button>
        `;
        fileListDiv.appendChild(fileItem);
        
        showToast(`${file.name} 업로드 완료`, 'success');
      }
    } catch (error) {
      showToast(`${file.name} 업로드 실패`, 'error');
    }
  }
  
  // 파일 입력 초기화
  event.target.value = '';
}

// 파일 제거
function removeFile(r2Key) {
  window.selectedFiles = window.selectedFiles.filter(f => f.r2Key !== r2Key);
  
  // UI에서 제거
  const fileListDiv = document.getElementById('fileList');
  const fileItems = fileListDiv.children;
  for (let i = 0; i < fileItems.length; i++) {
    if (fileItems[i].querySelector('button').getAttribute('onclick').includes(r2Key)) {
      fileItems[i].remove();
      break;
    }
  }
  
  showToast('파일이 제거되었습니다', 'info');
}

async function viewPost(boardId, postId) {
  try {
    const response = await axios.get(`${API_BASE}/boards/${boardId}/posts/${postId}`);
    const post = response.data.post;
    const attachments = response.data.attachments || [];
    
    closeModal();
    
    setTimeout(() => {
      const modal = `
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div class="bg-white rounded-lg p-6 w-full max-w-3xl my-8">
            <div class="flex justify-between items-start mb-6">
              <div class="flex-1">
                ${post.is_notice ? '<span class="inline-block px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded mb-2">공지사항</span>' : ''}
                <h2 class="text-2xl font-bold">${post.title}</h2>
                <div class="mt-3 text-sm text-gray-600">
                  <span>${post.author}</span>
                  <span class="mx-2">|</span>
                  <span>${dayjs(post.created_at).format('YYYY-MM-DD HH:mm')}</span>
                  <span class="mx-2">|</span>
                  <span>조회 ${post.view_count}</span>
                </div>
              </div>
              <button onclick="viewBoardPosts(${boardId})" class="text-gray-600 hover:text-gray-800">
                <i class="fas fa-times text-2xl"></i>
              </button>
            </div>
            
            <div class="border-t border-b py-6 my-6 min-h-[300px] whitespace-pre-wrap">
              ${post.content}
            </div>
            
            ${attachments.length > 0 ? `
              <div class="mb-6">
                <h3 class="text-lg font-bold mb-3">
                  <i class="fas fa-paperclip mr-2"></i>
                  첨부파일 (${attachments.length})
                </h3>
                <div class="space-y-2">
                  ${attachments.map(file => `
                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                      <div class="flex items-center flex-1">
                        <i class="fas fa-file ${getFileIcon(file.file_type)} text-2xl mr-3"></i>
                        <div>
                          <p class="font-medium text-gray-800">${file.file_name}</p>
                          <p class="text-sm text-gray-500">${(file.file_size / 1024).toFixed(1)}KB</p>
                        </div>
                      </div>
                      <a 
                        href="${API_BASE}/files/download/${encodeURIComponent(file.r2_key)}" 
                        target="_blank"
                        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <i class="fas fa-download mr-2"></i>다운로드
                      </a>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}
            
            <div class="flex justify-between">
              <button onclick="viewBoardPosts(${boardId})" class="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                <i class="fas fa-list mr-2"></i>목록
              </button>
              <div class="flex gap-2">
                <button onclick="showEditPostModal(${boardId}, ${postId})" class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  <i class="fas fa-edit mr-2"></i>수정
                </button>
                <button onclick="deletePost(${boardId}, ${postId})" class="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                  <i class="fas fa-trash mr-2"></i>삭제
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
      
      document.getElementById('modalContainer').innerHTML = modal;
    }, 100);
  } catch (error) {
    showToast('게시글 조회 실패', 'error');
  }
}

// 게시글 수정 모달
async function showEditPostModal(boardId, postId) {
  try {
    const response = await axios.get(`${API_BASE}/boards/${boardId}/posts/${postId}`);
    const post = response.data.post;
    const attachments = response.data.attachments || [];
    
    closeModal();
    
    setTimeout(() => {
      const modal = `
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div class="bg-white rounded-lg p-6 w-full max-w-3xl my-8">
            <h2 class="text-2xl font-bold mb-6">게시글 수정</h2>
            
            <form id="editPostForm" class="space-y-4">
              <div>
                <label class="flex items-center mb-2">
                  <input type="checkbox" name="is_notice" ${post.is_notice ? 'checked' : ''} class="mr-2">
                  <span class="text-sm font-medium">공지사항으로 등록</span>
                </label>
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-2">제목 *</label>
                <input 
                  type="text" 
                  name="title" 
                  value="${post.title}" 
                  required 
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-2">작성자 *</label>
                <input 
                  type="text" 
                  name="author" 
                  value="${post.author}" 
                  required 
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
              </div>
              
              <div>
                <label class="block text-sm font-medium mb-2">내용 *</label>
                <textarea 
                  name="content" 
                  rows="12" 
                  required 
                  class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >${post.content}</textarea>
              </div>
              
              ${attachments.length > 0 ? `
                <div class="mb-4">
                  <label class="block text-sm font-medium mb-2">기존 첨부파일</label>
                  <div class="space-y-2">
                    ${attachments.map(file => `
                      <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                        <div class="flex items-center">
                          <i class="fas fa-file ${getFileIcon(file.file_type)} text-xl mr-3"></i>
                          <div>
                            <p class="font-medium text-gray-800">${file.file_name}</p>
                            <p class="text-sm text-gray-500">${(file.file_size / 1024).toFixed(1)}KB</p>
                          </div>
                        </div>
                        <button 
                          type="button"
                          onclick="deleteAttachment(${file.id})"
                          class="text-red-600 hover:text-red-800"
                        >
                          <i class="fas fa-times"></i>
                        </button>
                      </div>
                    `).join('')}
                  </div>
                </div>
              ` : ''}
              
              <div>
                <label class="block text-sm font-medium mb-2">새 파일 추가</label>
                <input 
                  type="file" 
                  id="editPostFiles" 
                  multiple 
                  accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.doc,.docx,.xls,.xlsx"
                  class="w-full px-4 py-2 border rounded-lg"
                >
                <p class="text-xs text-gray-500 mt-1">이미지, PDF, Word, Excel 파일 (최대 10MB)</p>
              </div>
              
              <div class="flex justify-end gap-2 mt-6">
                <button type="button" onclick="viewPost(${boardId}, ${postId})" class="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                  취소
                </button>
                <button type="submit" class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  <i class="fas fa-save mr-2"></i>저장
                </button>
              </div>
            </form>
          </div>
        </div>
      `;
      
      document.getElementById('modalContainer').innerHTML = modal;
      
      // 폼 제출 이벤트
      document.getElementById('editPostForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        // 게시글 정보 업데이트
        const postData = {
          title: formData.get('title'),
          author: formData.get('author'),
          content: formData.get('content'),
          is_notice: formData.get('is_notice') ? 1 : 0
        };
        
        try {
          // 게시글 업데이트
          await axios.put(`${API_BASE}/boards/${boardId}/posts/${postId}`, postData);
          
          // 새 파일 업로드
          const files = document.getElementById('editPostFiles').files;
          if (files.length > 0) {
            for (let file of files) {
              const fileFormData = new FormData();
              fileFormData.append('file', file);
              fileFormData.append('post_id', postId);
              
              await axios.post(`${API_BASE}/files/upload`, fileFormData, {
                headers: { 'Content-Type': 'multipart/form-data' }
              });
            }
          }
          
          showToast('게시글이 수정되었습니다', 'success');
          await viewPost(boardId, postId);
        } catch (error) {
          showToast('게시글 수정 실패', 'error');
        }
      });
    }, 100);
  } catch (error) {
    showToast('게시글 조회 실패', 'error');
  }
}

// 첨부파일 삭제
async function deleteAttachment(attachmentId) {
  if (!confirm('이 파일을 삭제하시겠습니까?')) return;
  
  try {
    await axios.delete(`${API_BASE}/files/${attachmentId}`);
    showToast('파일이 삭제되었습니다', 'success');
    // 모달 새로고침 필요 - 현재 boardId와 postId를 알아야 함
    location.reload(); // 임시 해결책
  } catch (error) {
    showToast('파일 삭제 실패', 'error');
  }
}

// 파일 타입에 따른 아이콘
function getFileIcon(fileType) {
  if (fileType.startsWith('image/')) {
    return 'text-blue-600';
  } else if (fileType === 'application/pdf') {
    return 'text-red-600';
  } else if (fileType.includes('word')) {
    return 'text-blue-800';
  } else if (fileType.includes('excel') || fileType.includes('sheet')) {
    return 'text-green-600';
  }
  return 'text-gray-600';
}

async function deletePost(boardId, postId) {
  if (!confirm('정말 이 게시글을 삭제하시겠습니까?')) return;
  
  try {
    await axios.delete(`${API_BASE}/boards/${boardId}/posts/${postId}`);
    showToast('게시글이 삭제되었습니다', 'success');
    await viewBoardPosts(boardId);
  } catch (error) {
    showToast('게시글 삭제 실패', 'error');
  }
}

// ========== SMS 발송 기능 ==========

// 전체 선택/해제
function toggleAllMembers() {
  const selectAll = document.getElementById('selectAllMembers');
  const checkboxes = document.querySelectorAll('.member-checkbox');
  checkboxes.forEach(cb => cb.checked = selectAll.checked);
}

// 문자발송 모달 표시
function showSendSMSModal() {
  const checkboxes = document.querySelectorAll('.member-checkbox:checked');
  
  // 선택된 회원이 없으면 전체 회원으로 설정
  let selectedMembers = [];
  if (checkboxes.length === 0) {
    selectedMembers = app.data.members;
  } else {
    selectedMembers = Array.from(checkboxes).map(cb => ({
      id: parseInt(cb.value),
      name: cb.dataset.name,
      phone: cb.dataset.phone
    }));
  }
  
  // 수신자 목록 생성
  const recipientsList = selectedMembers.map(m => `
    <div class="flex items-center justify-between p-2 bg-gray-50 rounded">
      <span class="text-sm">${m.name} (${m.phone})</span>
    </div>
  `).join('');
  
  const modalContainer = document.getElementById('modalContainer');
  modalContainer.innerHTML = `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div class="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 class="text-2xl font-bold text-gray-800">
            <i class="fas fa-comment-dots text-teal-600 mr-2"></i>문자발송
          </h2>
          <button onclick="closeModal()" class="text-gray-500 hover:text-gray-700">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        
        <div class="p-6 space-y-6">
          <!-- 수신자 정보 -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              수신자 (총 ${selectedMembers.length}명)
            </label>
            <div class="max-h-40 overflow-y-auto space-y-2 p-4 bg-gray-50 rounded-lg border">
              ${recipientsList}
            </div>
          </div>
          
          <!-- 문자 템플릿 선택 -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              템플릿 선택 (선택사항)
            </label>
            <select id="smsTemplate" onchange="applySMSTemplate()" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500">
              <option value="">직접 입력</option>
              <option value="meeting">정기모임 안내</option>
              <option value="fee">회비 납부 안내</option>
              <option value="reminder">일정 리마인더</option>
              <option value="notice">공지사항</option>
            </select>
          </div>
          
          <!-- 문자 내용 -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              문자 내용 <span class="text-red-500">*</span>
              <span id="smsLength" class="float-right text-sm text-gray-500">0 / 2000자</span>
            </label>
            <textarea 
              id="smsMessage" 
              rows="8" 
              maxlength="2000"
              oninput="updateSMSLength()"
              placeholder="문자 내용을 입력하세요..."
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 resize-none"
            ></textarea>
          </div>
          
          <!-- 예상 발송 비용 -->
          <div class="bg-blue-50 p-4 rounded-lg">
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-700">예상 발송 건수</span>
              <span class="font-semibold text-gray-900">${selectedMembers.length}건</span>
            </div>
            <div class="flex items-center justify-between text-sm mt-2">
              <span class="text-gray-700">예상 비용 (건당 약 9원)</span>
              <span class="font-semibold text-blue-600"약 ${selectedMembers.length * 9}원</span>
            </div>
          </div>
        </div>
        
        <div class="sticky bottom-0 bg-gray-50 px-6 py-4 flex justify-end gap-3">
          <button onclick="closeModal()" class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
            취소
          </button>
          <button onclick="sendSMS()" class="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700">
            <i class="fas fa-paper-plane mr-2"></i>발송
          </button>
        </div>
      </div>
    </div>
  `;
  
  modalContainer.classList.remove('hidden');
  modalContainer.classList.add('flex');
  
  // 선택된 회원 데이터 저장
  window.selectedSMSRecipients = selectedMembers;
}

// SMS 템플릿 적용
function applySMSTemplate() {
  const template = document.getElementById('smsTemplate').value;
  const messageTextarea = document.getElementById('smsMessage');
  
  const templates = {
    meeting: `[안양시배드민턴연합회]
안녕하세요. 
이번 정기모임이 다음과 같이 예정되어 있습니다.

일시: [날짜] [시간]
장소: 비산노인복지회관 5층

많은 참석 부탁드립니다.`,
    
    fee: `[안양시배드민턴연합회]
회원님, 연회비 납부 안내드립니다.

납부 계좌: [계좌번호]
금액: [금액]

문의: 010-0000-0000`,
    
    reminder: `[안양시배드민턴연합회]
내일 모임이 있습니다!

일시: [날짜] [시간]
장소: 비산노인복지회관 5층

잊지 마시고 참석 부탁드립니다.`,
    
    notice: `[안양시배드민턴연합회]
회원 여러분께 공지드립니다.

[공지 내용]

감사합니다.`
  };
  
  if (templates[template]) {
    messageTextarea.value = templates[template];
    updateSMSLength();
  }
}

// SMS 길이 업데이트
function updateSMSLength() {
  const message = document.getElementById('smsMessage').value;
  const lengthSpan = document.getElementById('smsLength');
  lengthSpan.textContent = `${message.length} / 2000자`;
}

// SMS 발송
async function sendSMS() {
  const message = document.getElementById('smsMessage').value.trim();
  
  if (!message) {
    showToast('문자 내용을 입력해주세요', 'error');
    return;
  }
  
  if (!window.selectedSMSRecipients || window.selectedSMSRecipients.length === 0) {
    showToast('수신자가 선택되지 않았습니다', 'error');
    return;
  }
  
  const recipients = window.selectedSMSRecipients.map(m => m.phone);
  
  if (!confirm(`${recipients.length}명에게 문자를 발송하시겠습니까?`)) {
    return;
  }
  
  try {
    const response = await axios.post(`${API_BASE}/sms/send`, {
      recipients,
      message
    });
    
    showToast(response.data.message || '문자가 발송되었습니다', 'success');
    closeModal();
    
    // 체크박스 초기화
    document.getElementById('selectAllMembers').checked = false;
    document.querySelectorAll('.member-checkbox').forEach(cb => cb.checked = false);
    
  } catch (error) {
    console.error('SMS 발송 오류:', error);
    const errorMsg = error.response?.data?.error || '문자 발송에 실패했습니다';
    showToast(errorMsg, 'error');
  }
}

// ========== 회비관리 기능 ==========

// 회비 데이터 로드
async function loadFees() {
  try {
    const currentYear = new Date().getFullYear();
    
    // 회원 데이터가 없으면 로드 (납부 등록 시 필요)
    if (!app.data.members || app.data.members.length === 0) {
      await loadMembers();
    }
    
    // 회비 통계
    const statsResponse = await axios.get(`${API_BASE}/fees/stats?year=${currentYear}`);
    app.data.feeStats = statsResponse.data;
    
    // 회비 납부 내역
    const paymentsResponse = await axios.get(`${API_BASE}/fees/payments?year=${currentYear}`);
    app.data.feePayments = paymentsResponse.data.payments;
    
    // 회비 설정
    const settingsResponse = await axios.get(`${API_BASE}/fees/settings/${currentYear}`);
    app.data.feeSetting = settingsResponse.data;
    
  } catch (error) {
    console.error('회비 데이터 로드 오류:', error);
    app.data.feeStats = null;
    app.data.feePayments = [];
    app.data.feeSetting = { year: new Date().getFullYear(), amount: 50000 };
  }
}

// 회비관리 페이지 렌더링
function renderFeesPage() {
  const stats = app.data.feeStats;
  const setting = app.data.feeSetting;
  
  if (!stats) return '<div class="text-center py-20">데이터를 불러오는 중...</div>';
  
  const currentYear = new Date().getFullYear();
  
  return `
    <div class="space-y-4 md:space-y-6">
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h1 class="text-2xl md:text-3xl font-bold text-gray-800">회비관리 (${currentYear}년)</h1>
        <div class="flex flex-col sm:flex-row gap-2">
          <button onclick="showFeeSettingModal()" class="bg-purple-600 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-purple-700 text-sm md:text-base">
            <i class="fas fa-cog mr-1 md:mr-2"></i>회비 설정
          </button>
          <button onclick="showPayFeeModal()" class="bg-blue-600 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-blue-700 text-sm md:text-base">
            <i class="fas fa-plus mr-1 md:mr-2"></i>납부 등록
          </button>
          <button onclick="sendUnpaidSMS()" class="bg-orange-600 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-orange-700 text-sm md:text-base">
            <i class="fas fa-comment-dots mr-1 md:mr-2"></i>미납자 문자발송
          </button>
        </div>
      </div>
      
      <!-- 통계 카드 -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
        <div class="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <p class="text-gray-500 text-xs md:text-sm">총 회원</p>
              <p class="text-2xl md:text-3xl font-bold text-gray-800">${stats.totalMembers}명</p>
            </div>
            <i class="fas fa-users text-2xl md:text-4xl text-blue-500 hidden md:block"></i>
          </div>
        </div>
        
        <div class="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <p class="text-gray-500 text-xs md:text-sm">납부 회원</p>
              <p class="text-2xl md:text-3xl font-bold text-green-600">${stats.paidMembers}명</p>
            </div>
            <i class="fas fa-check-circle text-2xl md:text-4xl text-green-500 hidden md:block"></i>
          </div>
        </div>
        
        <div class="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <p class="text-gray-500 text-xs md:text-sm">미납 회원</p>
              <p class="text-2xl md:text-3xl font-bold text-red-600">${stats.unpaidCount}명</p>
            </div>
            <i class="fas fa-exclamation-circle text-2xl md:text-4xl text-red-500 hidden md:block"></i>
          </div>
        </div>
        
        <div class="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <p class="text-gray-500 text-xs md:text-sm">납부율</p>
              <p class="text-2xl md:text-3xl font-bold text-purple-600">${stats.paymentRate}%</p>
            </div>
            <i class="fas fa-chart-pie text-2xl md:text-4xl text-purple-500 hidden md:block"></i>
          </div>
        </div>
      </div>
      
      <!-- 탭 -->
      <div class="bg-white rounded-lg shadow-md">
        <div class="border-b overflow-x-auto">
          <div class="flex min-w-max">
            <button onclick="switchFeeTab('payments')" id="tabPayments" class="px-4 md:px-6 py-2.5 md:py-3 font-semibold border-b-2 border-blue-600 text-blue-600 text-sm md:text-base whitespace-nowrap">
              납부 내역
            </button>
            <button onclick="switchFeeTab('unpaid')" id="tabUnpaid" class="px-4 md:px-6 py-2.5 md:py-3 font-semibold text-gray-500 hover:text-gray-700 text-sm md:text-base whitespace-nowrap">
              미납자 목록 (${stats.unpaidCount}명)
            </button>
            <button onclick="switchFeeTab('clubs')" id="tabClubs" class="px-4 md:px-6 py-2.5 md:py-3 font-semibold text-gray-500 hover:text-gray-700 text-sm md:text-base whitespace-nowrap">
              클럽별 현황
            </button>
          </div>
        </div>
        
        <div id="feeTabContent" class="p-4 md:p-6">
          ${renderFeePaymentsTab()}
        </div>
      </div>
    </div>
  `;
}

function renderFeePaymentsTab() {
  const payments = app.data.feePayments || [];
  
  if (payments.length === 0) {
    return '<div class="text-center py-12 text-gray-500">등록된 납부 내역이 없습니다</div>';
  }
  
  return `
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">회원명</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">클럽</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">납부일</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">금액</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">메모</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">관리</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          ${payments.map(p => `
            <tr class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">${p.member_name}</td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-600">${p.member_club}</td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-600">${p.payment_date}</td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-900 font-semibold">${p.amount.toLocaleString()}원</td>
              <td class="px-6 py-4 text-gray-600">${p.note || '-'}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button onclick="deleteFeePayment(${p.id})" class="text-red-600 hover:text-red-800">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderUnpaidTab() {
  const unpaidMembers = app.data.feeStats?.unpaidMembers || [];
  
  if (unpaidMembers.length === 0) {
    return '<div class="text-center py-12 text-green-600 text-lg font-semibold">🎉 모든 회원이 회비를 납부했습니다!</div>';
  }
  
  return `
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">회원명</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">성별</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">클럽</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">급수</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">연락처</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">관리</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          ${unpaidMembers.map(m => `
            <tr class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">${m.name}</td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-600">${m.gender}</td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-600">${m.club}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-3 py-1 text-xs font-semibold rounded-full ${getGradeBadgeColor(m.grade)}">
                  ${m.grade}급
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-600">${m.phone}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button onclick="payFeeForMember(${m.id})" class="text-blue-600 hover:text-blue-800">
                  <i class="fas fa-plus mr-1"></i>납부 등록
                </button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderClubsTab() {
  const byClub = app.data.feeStats?.byClub || [];
  
  return `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      ${byClub.map(club => {
        const rate = club.total_members > 0 
          ? Math.round(club.paid_members / club.total_members * 100) 
          : 0;
        return `
          <div class="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 class="text-lg font-bold text-gray-800 mb-4">${club.club}</h3>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600">전체 회원</span>
                <span class="font-semibold">${club.total_members}명</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">납부 회원</span>
                <span class="font-semibold text-green-600">${club.paid_members}명</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">미납 회원</span>
                <span class="font-semibold text-red-600">${club.total_members - club.paid_members}명</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">납부율</span>
                <span class="font-semibold text-purple-600">${rate}%</span>
              </div>
              <div class="flex justify-between border-t pt-3">
                <span class="text-gray-600">총 납부액</span>
                <span class="font-bold text-blue-600">${club.total_amount.toLocaleString()}원</span>
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

// 탭 전환
function switchFeeTab(tab) {
  // 탭 버튼 스타일 업데이트
  document.querySelectorAll('[id^="tab"]').forEach(btn => {
    btn.classList.remove('border-blue-600', 'text-blue-600');
    btn.classList.add('text-gray-500');
  });
  
  const tabBtn = document.getElementById(`tab${tab.charAt(0).toUpperCase() + tab.slice(1)}`);
  if (tabBtn) {
    tabBtn.classList.add('border-blue-600', 'text-blue-600');
    tabBtn.classList.remove('text-gray-500');
  }
  
  // 탭 컨텐츠 업데이트
  const content = document.getElementById('feeTabContent');
  if (tab === 'payments') {
    content.innerHTML = renderFeePaymentsTab();
  } else if (tab === 'unpaid') {
    content.innerHTML = renderUnpaidTab();
  } else if (tab === 'clubs') {
    content.innerHTML = renderClubsTab();
  }
}

// 회비 납부 등록 모달
function showPayFeeModal(memberId = null) {
  const currentYear = new Date().getFullYear();
  const todayDate = new Date().toISOString().split('T')[0];
  const setting = app.data.feeSetting;
  
  let memberSelect = '';
  if (!memberId) {
    const members = app.data.members || [];
    memberSelect = `
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          회원 선택 <span class="text-red-500">*</span>
        </label>
        <select id="feePaymentMemberId" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
          <option value="">회원을 선택하세요</option>
          ${members.map(m => `<option value="${m.id}">${m.name} (${m.club})</option>`).join('')}
        </select>
      </div>
    `;
  } else {
    memberSelect = `<input type="hidden" id="feePaymentMemberId" value="${memberId}">`;
  }
  
  const modalContainer = document.getElementById('modalContainer');
  modalContainer.innerHTML = `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div class="bg-blue-600 text-white px-6 py-4 rounded-t-lg flex justify-between items-center">
          <h2 class="text-xl font-bold">회비 납부 등록</h2>
          <button onclick="closeModal()" class="text-white hover:text-gray-200">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        
        <div class="p-6 space-y-4">
          ${memberSelect}
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">년도</label>
              <input type="number" id="feePaymentYear" value="${currentYear}" 
                     class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">금액</label>
              <input type="number" id="feePaymentAmount" value="${setting?.amount || 50000}" 
                     class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">납부일</label>
            <input type="date" id="feePaymentDate" value="${todayDate}" 
                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">메모 (선택)</label>
            <textarea id="feePaymentNote" rows="3" 
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="예: 현금 납부, 계좌이체 등"></textarea>
          </div>
        </div>
        
        <div class="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end gap-3">
          <button onclick="closeModal()" class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
            취소
          </button>
          <button onclick="processFeePayment()" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            등록
          </button>
        </div>
      </div>
    </div>
  `;
  
  modalContainer.classList.remove('hidden');
  modalContainer.classList.add('flex');
}

// 특정 회원 회비 납부 등록
function payFeeForMember(memberId) {
  // 회원 데이터가 없으면 먼저 로드
  if (!app.data.members || app.data.members.length === 0) {
    loadMembers().then(() => showPayFeeModal(memberId));
  } else {
    showPayFeeModal(memberId);
  }
}

// 회비 납부 처리
async function processFeePayment() {
  const memberId = document.getElementById('feePaymentMemberId').value;
  const year = parseInt(document.getElementById('feePaymentYear').value);
  const amount = parseInt(document.getElementById('feePaymentAmount').value);
  const paymentDate = document.getElementById('feePaymentDate').value;
  const note = document.getElementById('feePaymentNote').value.trim();
  
  if (!memberId) {
    showToast('회원을 선택해주세요', 'error');
    return;
  }
  
  if (!amount || amount <= 0) {
    showToast('올바른 금액을 입력해주세요', 'error');
    return;
  }
  
  try {
    await axios.post(`${API_BASE}/fees/payments`, {
      memberId: parseInt(memberId),
      year,
      amount,
      paymentDate,
      note: note || null
    });
    
    showToast('회비 납부가 등록되었습니다', 'success');
    closeModal();
    await loadFees();
    document.getElementById('pageContent').innerHTML = renderFeesPage();
    attachFeesHandlers();
  } catch (error) {
    console.error('회비 납부 등록 오류:', error);
    showToast(error.response?.data?.error || '회비 납부 등록 실패', 'error');
  }
}

// 회비 납부 삭제
async function deleteFeePayment(id) {
  if (!confirm('이 납부 내역을 삭제하시겠습니까?')) return;
  
  try {
    await axios.delete(`${API_BASE}/fees/payments/${id}`);
    showToast('납부 내역이 삭제되었습니다', 'success');
    await loadFees();
    document.getElementById('pageContent').innerHTML = renderFeesPage();
    attachFeesHandlers();
  } catch (error) {
    console.error('납부 내역 삭제 오류:', error);
    showToast('납부 내역 삭제 실패', 'error');
  }
}

// 회비 설정 모달
function showFeeSettingModal() {
  const currentYear = new Date().getFullYear();
  const setting = app.data.feeSetting || {};
  
  const modalContainer = document.getElementById('modalContainer');
  modalContainer.innerHTML = `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div class="bg-purple-600 text-white px-6 py-4 rounded-t-lg flex justify-between items-center">
          <h2 class="text-xl font-bold">회비 설정</h2>
          <button onclick="closeModal()" class="text-white hover:text-gray-200">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">회비 년도</label>
            <input type="number" id="feeSettingYear" value="${setting.year || currentYear}" 
                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">연회비 금액</label>
            <input type="number" id="feeSettingAmount" value="${setting.amount || 50000}" step="10000"
                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">설명 (선택)</label>
            <textarea id="feeSettingDescription" rows="3" 
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="예: 2026년 연회비">${setting.description || ''}</textarea>
          </div>
        </div>
        
        <div class="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end gap-3">
          <button onclick="closeModal()" class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
            취소
          </button>
          <button onclick="saveFeeSetting()" class="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">
            저장
          </button>
        </div>
      </div>
    </div>
  `;
  
  modalContainer.classList.remove('hidden');
  modalContainer.classList.add('flex');
}

// 회비 설정 저장
async function saveFeeSetting() {
  const year = parseInt(document.getElementById('feeSettingYear').value);
  const amount = parseInt(document.getElementById('feeSettingAmount').value);
  const description = document.getElementById('feeSettingDescription').value.trim();
  
  if (!year || year < 2020 || year > 2100) {
    showToast('올바른 년도를 입력해주세요', 'error');
    return;
  }
  
  if (!amount || amount <= 0) {
    showToast('올바른 금액을 입력해주세요', 'error');
    return;
  }
  
  try {
    await axios.post(`${API_BASE}/fees/settings`, {
      year,
      amount,
      description: description || null
    });
    
    showToast('회비 설정이 저장되었습니다', 'success');
    closeModal();
    await loadFees();
    document.getElementById('pageContent').innerHTML = renderFeesPage();
    attachFeesHandlers();
  } catch (error) {
    console.error('회비 설정 저장 오류:', error);
    showToast('회비 설정 저장 실패', 'error');
  }
}

// 미납자 문자 발송
async function sendUnpaidSMS() {
  const unpaidMembers = app.data.feeStats?.unpaidMembers || [];
  
  if (unpaidMembers.length === 0) {
    showToast('미납자가 없습니다', 'info');
    return;
  }
  
  const currentYear = new Date().getFullYear();
  const setting = app.data.feeSetting || { amount: 50000 };
  
  const recipients = unpaidMembers.map(m => m.phone);
  const message = `[안양시배드민턴연합회]
${currentYear}년도 연회비 납부 안내드립니다.

납부 금액: ${setting.amount.toLocaleString()}원
계좌번호: [계좌번호]

빠른 납부 부탁드립니다.
감사합니다.`;
  
  if (!confirm(`미납자 ${unpaidMembers.length}명에게 문자를 발송하시겠습니까?`)) {
    return;
  }
  
  try {
    const response = await axios.post(`${API_BASE}/sms/send`, {
      recipients,
      message
    });
    
    showToast(response.data.message || `${unpaidMembers.length}명에게 문자가 발송되었습니다`, 'success');
  } catch (error) {
    console.error('문자 발송 오류:', error);
    showToast(error.response?.data?.error || '문자 발송 실패', 'error');
  }
}

// 회비관리 핸들러 연결
function attachFeesHandlers() {
  // 회비 설정 모달 함수를 전역으로 노출
  window.showFeeSettingModal = showFeeSettingModal;
  window.saveFeeSetting = saveFeeSetting;
  
  // 납부 등록 모달 함수를 전역으로 노출
  window.showPayFeeModal = showPayFeeModal;
  window.payFeeForMember = payFeeForMember;
  window.processFeePayment = processFeePayment;
  window.deleteFeePayment = deleteFeePayment;
  
  // 미납자 문자발송 함수를 전역으로 노출
  window.sendUnpaidSMS = sendUnpaidSMS;
  
  // 탭 전환 기능
  window.switchFeeTab = function(tab) {
    // 탭 버튼 스타일 변경
    document.querySelectorAll('[id^="tab"]').forEach(btn => {
      btn.classList.remove('border-b-2', 'border-blue-600', 'text-blue-600');
      btn.classList.add('text-gray-500');
    });
    
    const activeTab = document.getElementById(`tab${tab.charAt(0).toUpperCase() + tab.slice(1)}`);
    if (activeTab) {
      activeTab.classList.remove('text-gray-500');
      activeTab.classList.add('border-b-2', 'border-blue-600', 'text-blue-600');
    }
    
    // 탭 컨텐츠 변경
    const contentDiv = document.getElementById('feeTabContent');
    switch(tab) {
      case 'payments':
        contentDiv.innerHTML = renderFeePaymentsTab();
        break;
      case 'unpaid':
        contentDiv.innerHTML = renderUnpaidTab();
        break;
      case 'clubs':
        contentDiv.innerHTML = renderClubsTab();
        break;
    }
  };
}

// 회비 관련 함수들을 전역으로 노출 (페이지 로드 전에 실행)
window.showFeeSettingModal = function() {
  const currentYear = new Date().getFullYear();
  const setting = app.data.feeSetting || {};
  
  const modalContainer = document.getElementById('modalContainer');
  if (!modalContainer) return;
  
  modalContainer.innerHTML = `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div class="bg-purple-600 text-white px-6 py-4 rounded-t-lg flex justify-between items-center">
          <h2 class="text-xl font-bold">회비 설정</h2>
          <button onclick="closeModal()" class="text-white hover:text-gray-200">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">회비 년도</label>
            <input type="number" id="feeSettingYear" value="${setting.year || currentYear}" 
                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">연회비 금액</label>
            <input type="number" id="feeSettingAmount" value="${setting.amount || 50000}" step="10000"
                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">설명 (선택)</label>
            <textarea id="feeSettingDescription" rows="3" 
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="예: 2026년 연회비">${setting.description || ''}</textarea>
          </div>
        </div>
        
        <div class="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end gap-3">
          <button onclick="closeModal()" class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
            취소
          </button>
          <button onclick="window.saveFeeSetting()" class="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">
            저장
          </button>
        </div>
      </div>
    </div>
  `;
  
  modalContainer.classList.remove('hidden');
  modalContainer.classList.add('flex');
};

window.saveFeeSetting = async function() {
  const year = parseInt(document.getElementById('feeSettingYear').value);
  const amount = parseInt(document.getElementById('feeSettingAmount').value);
  const description = document.getElementById('feeSettingDescription').value.trim();
  
  if (!year || year < 2020 || year > 2100) {
    showToast('올바른 년도를 입력해주세요', 'error');
    return;
  }
  
  if (!amount || amount <= 0) {
    showToast('올바른 금액을 입력해주세요', 'error');
    return;
  }
  
  try {
    await axios.post(`${API_BASE}/fees/settings`, {
      year,
      amount,
      description: description || null
    });
    
    showToast('회비 설정이 저장되었습니다', 'success');
    closeModal();
    await loadFees();
    document.getElementById('pageContent').innerHTML = renderFeesPage();
    attachFeesHandlers();
  } catch (error) {
    console.error('회비 설정 저장 오류:', error);
    showToast('회비 설정 저장 실패', 'error');
  }
};

window.showPayFeeModal = function(memberId = null) {
  const currentYear = new Date().getFullYear();
  const todayDate = new Date().toISOString().split('T')[0];
  const setting = app.data.feeSetting;
  const modalContainer = document.getElementById('modalContainer');
  if (!modalContainer) return;
  
  let memberSelect = '';
  if (!memberId) {
    const members = app.data.members || [];
    memberSelect = `
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          회원 선택 <span class="text-red-500">*</span>
        </label>
        <select id="feePaymentMemberId" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
          <option value="">회원을 선택하세요</option>
          ${members.map(m => `<option value="${m.id}">${m.name} (${m.club})</option>`).join('')}
        </select>
      </div>
    `;
  } else {
    memberSelect = `<input type="hidden" id="feePaymentMemberId" value="${memberId}">`;
  }
  
  modalContainer.innerHTML = `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div class="bg-blue-600 text-white px-6 py-4 rounded-t-lg flex justify-between items-center">
          <h2 class="text-xl font-bold">회비 납부 등록</h2>
          <button onclick="closeModal()" class="text-white hover:text-gray-200">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        
        <div class="p-6 space-y-4">
          ${memberSelect}
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">년도</label>
              <input type="number" id="feePaymentYear" value="${currentYear}" 
                     class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">금액</label>
              <input type="number" id="feePaymentAmount" value="${setting?.amount || 50000}" 
                     class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">납부일</label>
            <input type="date" id="feePaymentDate" value="${todayDate}" 
                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">메모 (선택)</label>
            <textarea id="feePaymentNote" rows="3" 
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="예: 현금 납부, 계좌이체 등"></textarea>
          </div>
        </div>
        
        <div class="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end gap-3">
          <button onclick="closeModal()" class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
            취소
          </button>
          <button onclick="window.processFeePayment()" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            등록
          </button>
        </div>
      </div>
    </div>
  `;
  
  modalContainer.classList.remove('hidden');
  modalContainer.classList.add('flex');
};

window.processFeePayment = async function() {
  const memberId = document.getElementById('feePaymentMemberId').value;
  const year = parseInt(document.getElementById('feePaymentYear').value);
  const amount = parseInt(document.getElementById('feePaymentAmount').value);
  const paymentDate = document.getElementById('feePaymentDate').value;
  const note = document.getElementById('feePaymentNote').value.trim();
  
  if (!memberId) {
    showToast('회원을 선택해주세요', 'error');
    return;
  }
  
  if (!amount || amount <= 0) {
    showToast('올바른 금액을 입력해주세요', 'error');
    return;
  }
  
  try {
    await axios.post(`${API_BASE}/fees/payments`, {
      memberId: parseInt(memberId),
      year,
      amount,
      paymentDate,
      note: note || null
    });
    
    showToast('회비 납부가 등록되었습니다', 'success');
    closeModal();
    await loadFees();
    document.getElementById('pageContent').innerHTML = renderFeesPage();
    attachFeesHandlers();
  } catch (error) {
    console.error('회비 납부 등록 오류:', error);
    showToast(error.response?.data?.error || '회비 납부 등록 실패', 'error');
  }
};

window.payFeeForMember = function(memberId) {
  if (!app.data.members || app.data.members.length === 0) {
    loadMembers().then(() => window.showPayFeeModal(memberId));
  } else {
    window.showPayFeeModal(memberId);
  }
};

window.deleteFeePayment = async function(id) {
  if (!confirm('이 납부 내역을 삭제하시겠습니까?')) return;
  
  try {
    await axios.delete(`${API_BASE}/fees/payments/${id}`);
    showToast('납부 내역이 삭제되었습니다', 'success');
    await loadFees();
    document.getElementById('pageContent').innerHTML = renderFeesPage();
    attachFeesHandlers();
  } catch (error) {
    console.error('납부 내역 삭제 오류:', error);
    showToast('납부 내역 삭제 실패', 'error');
  }
};

window.sendUnpaidSMS = async function() {
  const unpaidMembers = app.data.feeStats?.unpaidMembers || [];
  
  if (unpaidMembers.length === 0) {
    showToast('미납자가 없습니다', 'info');
    return;
  }
  
  const currentYear = new Date().getFullYear();
  const setting = app.data.feeSetting || { amount: 50000 };
  
  const recipients = unpaidMembers.map(m => m.phone);
  const message = `[안양시배드민턴연합회]
${currentYear}년도 연회비 납부 안내드립니다.

납부 금액: ${setting.amount.toLocaleString()}원
계좌번호: [계좌번호]

빠른 납부 부탁드립니다.
감사합니다.`;
  
  if (!confirm(`미납자 ${unpaidMembers.length}명에게 문자를 발송하시겠습니까?`)) {
    return;
  }
  
  try {
    await axios.post(`${API_BASE}/sms/send`, {
      phoneNumbers: recipients,
      message: message
    });
    
    showToast(`${unpaidMembers.length}명에게 문자가 발송되었습니다`, 'success');
  } catch (error) {
    console.error('문자 발송 오류:', error);
    showToast(error.response?.data?.error || '문자 발송 실패', 'error');
  }
};

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
  init();
});
