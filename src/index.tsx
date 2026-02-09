import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

// API Routes
import authRoutes from './routes/auth'
import memberRoutes from './routes/members'
import scheduleRoutes from './routes/schedules'
import attendanceRoutes from './routes/attendances'
import inventoryRoutes from './routes/inventory'
import boardRoutes from './routes/boards'
import dashboardRoutes from './routes/dashboard'
import fileRoutes from './routes/files'
import smsRoutes from './routes/sms'
import feeRoutes from './routes/fees'
import joinRequestRoutes from './routes/join-requests'
import heroImageRoutes from './routes/hero-images'
import statsRoutes from './routes/stats'

type Bindings = {
  DB: D1Database
  R2: R2Bucket
  NHN_APP_KEY: string
  NHN_SECRET_KEY: string
  NHN_SENDER: string
}

const app = new Hono<{ Bindings: Bindings }>()

// CORS 설정
app.use('/api/*', cors())

// Static files
app.use('/static/*', serveStatic({ root: './' }))

// API Routes
app.route('/api/auth', authRoutes)
app.route('/api/members', memberRoutes)
app.route('/api/schedules', scheduleRoutes)
app.route('/api/attendances', attendanceRoutes)
app.route('/api/inventory', inventoryRoutes)
app.route('/api/boards', boardRoutes)
app.route('/api/dashboard', dashboardRoutes)
app.route('/api/files', fileRoutes)
app.route('/api/sms', smsRoutes)
app.route('/api/fees', feeRoutes)
app.route('/api/join-requests', joinRequestRoutes)
app.route('/api/hero-images', heroImageRoutes)
app.route('/api/stats', statsRoutes)

// Health check
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Landing page
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>안양시배드민턴협회 장년부 - 건강한 노년, 활기찬 황금기</title>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🏸</text></svg>">
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <link href="/static/landing/styles.css" rel="stylesheet">
    </head>
    <body>
        <!-- Navigation -->
        <header class="header">
            <nav class="navbar">
                <div class="logo">안양시배드민턴협회 장년부</div>
                <button class="mobile-menu-btn">
                    <i class="fas fa-bars"></i>
                </button>
                <ul class="nav-links">
                    <li><a href="#home">홈</a></li>
                    <li><a href="#about">장년부소개</a></li>
                    <li><a href="#organization">조직도</a></li>
                    <li><a href="#schedule">일정안내</a></li>
                    <li><a href="#contact">가입문의</a></li>
                    <li><a href="https://band.us/band/63922799" target="_blank" rel="noopener noreferrer" class="band-link">네이버밴드</a></li>
                    <li><a href="/admin" class="admin-link">관리자</a></li>
                </ul>
            </nav>
        </header>

        <!-- Hero Section with Slider -->
        <section id="home" class="hero">
            <div class="hero-slider">
                <div class="hero-slide active">
                    <div class="hero-background"></div>
                </div>
            </div>
            <div class="hero-content">
                <h1 class="hero-title">건강한 노년, 활기찬 황금기</h1>
                <p class="hero-subtitle">안양시배드민턴협회 장년부와 함께하세요</p>
                <a href="#contact" class="cta-button">지금 가입하기</a>
            </div>
            <div class="hero-controls">
                <button class="hero-prev" aria-label="이전 슬라이드"><i class="fas fa-chevron-left"></i></button>
                <div class="hero-indicators"></div>
                <button class="hero-next" aria-label="다음 슬라이드"><i class="fas fa-chevron-right"></i></button>
            </div>
        </section>

        <!-- About Section -->
        <section id="about" class="about-section">
            <div class="container">
                <h2 class="section-title">장년부 소개</h2>
                <div class="about-content">
                    <div class="about-intro">
                        <p class="intro-text">
                            안양시배드민턴협회 장년부는 50대 이상의 배드민턴 애호가들이 모여 만든 
                            활기차고 건강한 공동체입니다. 우리는 단순히 운동을 넘어 
                            인생의 황금기를 함께 나누는 동료이자 가족으로 성장해왔습니다.
                        </p>
                    </div>
                    
                    <div class="about-details">
                        <div class="detail-card scroll-reveal">
                            <div class="detail-icon">
                                <i class="fas fa-users-cog"></i>
                            </div>
                            <h3>가입 자격</h3>
                            <p>
                                안양시배드민턴협회에 소속된 각 클럽에서 정기적으로 활동하는 50세 이상의 회원이라면 
                                누구나 가입할 수 있습니다. 각 클럽에서 실력을 쌓고 열정을 키운 분들이 모여, 
                                더 큰 무대에서 실력을 겨루고 우정을 나눕니다.
                            </p>
                        </div>
                        
                        <div class="detail-card scroll-reveal">
                            <div class="detail-icon">
                                <i class="fas fa-handshake"></i>
                            </div>
                            <h3>활동 철학</h3>
                            <p>
                                우리는 경쟁보다 화합을, 승부보다 건강을 우선시합니다. S조부터 D조까지 
                                실력별로 나뉘어 있지만, 모두가 평등하게 존중받고 즐거움을 나누는 것이 
                                우리의 핵심 가치입니다. 배드민턴을 통해 건강한 신체와 풍요로운 마음을 
                                함께 키워갑니다.
                            </p>
                        </div>
                        
                        <div class="detail-card scroll-reveal">
                            <div class="detail-icon">
                                <i class="fas fa-trophy"></i>
                            </div>
                            <h3>주요 활동</h3>
                            <p>
                                매월 정기모임(정모)과 특별모임(특모)을 통해 실력을 겨루고, 
                                년 1-2회 대규모 대회를 개최하여 클럽 간 친선을 도모합니다. 
                                또한 정기적인 친목 활동과 체육 교류를 통해 배드민턴 문화를 
                                지역사회에 확산시키고 있습니다.
                            </p>
                        </div>
                    </div>
                </div>
                
                <div class="features">
                    <div class="feature-card scroll-reveal">
                        <i class="fas fa-heart feature-icon"></i>
                        <h3>건강 증진</h3>
                        <p>정기적인 운동으로 건강한 노년 생활을 지원합니다.</p>
                    </div>
                    <div class="feature-card scroll-reveal">
                        <i class="fas fa-users feature-icon"></i>
                        <h3>친목 도모</h3>
                        <p>회원 간 친목을 다지고 즐거운 시간을 보냅니다.</p>
                    </div>
                    <div class="feature-card scroll-reveal">
                        <i class="fas fa-trophy feature-icon"></i>
                        <h3>실력 향상</h3>
                        <p>체계적인 훈련으로 배드민턴 실력을 키웁니다.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Organization Chart Section -->
        <section id="organization" class="organization-section">
            <div class="container">
                <h2 class="section-title">조직도</h2>
                <p class="section-description">
                    체계적이고 전문적인 운영을 위한 안양시배드민턴협회 장년부 조직 구조
                </p>
                
                <div class="org-chart">
                    <!-- 회장 -->
                    <div class="org-level org-top scroll-reveal">
                        <div class="org-card president">
                            <div class="org-icon"><i class="fas fa-crown"></i></div>
                            <h3>회장</h3>
                            <p class="org-name">미정</p>
                            <p class="org-role">최고 의사결정자</p>
                        </div>
                    </div>
                    
                    <!-- 사무국장 -->
                    <div class="org-level org-secretary scroll-reveal">
                        <div class="org-card secretary">
                            <div class="org-icon"><i class="fas fa-briefcase"></i></div>
                            <h3>사무국장</h3>
                            <p class="org-name">미정</p>
                            <p class="org-role">조직 운영 및 행정 총괄</p>
                        </div>
                    </div>
                    
                    <!-- 감사 -->
                    <div class="org-level org-auditor scroll-reveal">
                        <div class="org-card auditor">
                            <div class="org-icon"><i class="fas fa-balance-scale"></i></div>
                            <h3>감사</h3>
                            <div class="org-names">
                                <p class="org-name">• 미정</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 고문 -->
                    <div class="org-level org-advisors scroll-reveal">
                        <div class="org-card advisors">
                            <div class="org-icon"><i class="fas fa-user-tie"></i></div>
                            <h3>고문</h3>
                            <div class="org-names">
                                <p class="org-name">• 미정</p>
                                <p class="org-name">• 미정</p>
                                <p class="org-name">• 미정</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 부회장단 -->
                    <div class="org-level org-vp scroll-reveal">
                        <div class="org-card vice-presidents wide">
                            <div class="org-icon"><i class="fas fa-users-cog"></i></div>
                            <h3>부회장</h3>
                            <p class="org-role">전략 기획 및 운영 총괄</p>
                            <div class="org-names-grid">
                                <p class="org-name">• 미정</p>
                                <p class="org-name">• 미정</p>
                                <p class="org-name">• 미정</p>
                                <p class="org-name">• 미정</p>
                                <p class="org-name">• 미정</p>
                                <p class="org-name">• 미정</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 자문위원 -->
                    <div class="org-level org-consultants scroll-reveal">
                        <div class="org-card consultants wide">
                            <div class="org-icon"><i class="fas fa-handshake"></i></div>
                            <h3>자문위원</h3>
                            <p class="org-role">전문 자문 및 정책 제안</p>
                            <div class="org-names-grid three-col">
                                <p class="org-name">• 미정</p>
                                <p class="org-name">• 미정</p>
                                <p class="org-name">• 미정</p>
                                <p class="org-name">• 미정</p>
                                <p class="org-name">• 미정</p>
                                <p class="org-name">• 미정</p>
                                <p class="org-name">• 미정</p>
                                <p class="org-name">• 미정</p>
                                <p class="org-name">• 미정</p>
                                <p class="org-name">• 미정</p>
                                <p class="org-name">• 미정</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 관리이사 -->
                    <div class="org-level org-directors scroll-reveal">
                        <div class="org-card directors wide">
                            <div class="org-icon"><i class="fas fa-clipboard-list"></i></div>
                            <h3>관리이사</h3>
                            <p class="org-role">부서별 업무 관리 및 조정</p>
                            <div class="org-names-grid">
                                <p class="org-name">• 미정</p>
                                <p class="org-name">• 미정</p>
                                <p class="org-name">• 미정</p>
                                <p class="org-name">• 미정</p>
                                <p class="org-name">• 미정</p>
                                <p class="org-name">• 미정</p>
                                <p class="org-name">• 미정</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 운영진 -->
                    <div class="org-level org-executives scroll-reveal">
                        <h4 class="org-section-title">운영진</h4>
                        <div class="org-exec-grid">
                            <div class="org-exec-card">
                                <div class="exec-icon"><i class="fas fa-file-alt"></i></div>
                                <h4>총무이사</h4>
                                <p class="exec-name">• 미정</p>
                                <p class="exec-name">• 미정</p>
                            </div>
                            <div class="org-exec-card">
                                <div class="exec-icon"><i class="fas fa-won-sign"></i></div>
                                <h4>재무이사</h4>
                                <p class="exec-name">미정</p>
                            </div>
                            <div class="org-exec-card">
                                <div class="exec-icon"><i class="fas fa-trophy"></i></div>
                                <h4>경기이사</h4>
                                <p class="exec-name">미정</p>
                            </div>
                            <div class="org-exec-card">
                                <div class="exec-icon"><i class="fas fa-bullhorn"></i></div>
                                <h4>홍보이사</h4>
                                <p class="exec-name">미정</p>
                            </div>
                            <div class="org-exec-card">
                                <div class="exec-icon"><i class="fas fa-camera"></i></div>
                                <h4>미디어이사</h4>
                                <p class="exec-name">미정</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- 조직 통계 -->
                <div class="org-stats">
                    <div class="stat-box scroll-reveal">
                        <i class="fas fa-sitemap"></i>
                        <h4>총 임원진</h4>
                        <p class="stat-number">36명</p>
                    </div>
                    <div class="stat-box scroll-reveal">
                        <i class="fas fa-users"></i>
                        <h4>전체 회원</h4>
                        <p class="stat-number" id="totalMembersCount">
                            <span class="loading-spinner">로딩중...</span>
                        </p>
                    </div>
                    <div class="stat-box scroll-reveal">
                        <i class="fas fa-building"></i>
                        <h4>소속 클럽</h4>
                        <p class="stat-number" id="totalClubsCount">
                            <span class="loading-spinner">로딩중...</span>
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Schedule Section -->
        <section id="schedule" class="schedule-section">
            <div class="container">
                <h2 class="section-title">일정 안내</h2>
                <p class="section-description">
                    매월 정기모임과 특별모임을 통해 회원 간 친목과 실력 향상을 도모합니다
                </p>
                
                <div class="calendar-container">
                    <div class="calendar-header">
                        <button class="calendar-nav-btn" id="prevMonth">
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <h3 class="calendar-title" id="calendarTitle">2026년 2월</h3>
                        <button class="calendar-nav-btn" id="nextMonth">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                    
                    <div class="calendar-weekdays">
                        <div class="calendar-weekday">일</div>
                        <div class="calendar-weekday">월</div>
                        <div class="calendar-weekday">화</div>
                        <div class="calendar-weekday">수</div>
                        <div class="calendar-weekday">목</div>
                        <div class="calendar-weekday">금</div>
                        <div class="calendar-weekday">토</div>
                    </div>
                    
                    <div class="calendar-days" id="calendarDays">
                        <!-- JavaScript로 동적 생성 -->
                    </div>
                    
                    <div class="calendar-legend">
                        <div class="legend-item">
                            <span class="legend-dot regular"></span>
                            <span>정기모임</span>
                        </div>
                        <div class="legend-item">
                            <span class="legend-dot special"></span>
                            <span>특별모임</span>
                        </div>
                        <div class="legend-item">
                            <span class="legend-dot today"></span>
                            <span>오늘</span>
                        </div>
                    </div>
                </div>
                
                <div class="schedule-notice scroll-reveal" style="margin-top: 2rem;">
                    <i class="fas fa-info-circle"></i>
                    <p>
                        <strong>정기모임(정모)</strong>: 매월 정기적으로 개최되는 친선 경기<br>
                        <strong>특별모임(특모)</strong>: 특별한 날을 기념하여 열리는 대회<br>
                        상세 일정 및 참가 신청은 관리자에게 문의하세요.
                    </p>
                </div>
            </div>
        </section>

        <!-- Programs Section -->
        <section id="programs" class="programs-section" style="display: none;">
            <div class="container">
                <h2 class="section-title">활동 프로그램</h2>
                <div class="program-list">
                    <div class="program-item scroll-reveal">
                        <i class="fas fa-calendar-check program-icon"></i>
                        <h3>정기 훈련</h3>
                        <p>매주 화요일, 목요일 오전 10시 - 오후 1시</p>
                    </div>
                    <div class="program-item scroll-reveal">
                        <i class="fas fa-medal program-icon"></i>
                        <h3>월례대회</h3>
                        <p>매월 셋째 주 토요일 실력 향상 대회 개최</p>
                    </div>
                    <div class="program-item scroll-reveal">
                        <i class="fas fa-coffee program-icon"></i>
                        <h3>친목모임</h3>
                        <p>월 1회 회원 친목 도모 및 소통의 장</p>
                    </div>
                    <div class="program-item scroll-reveal">
                        <i class="fas fa-graduation-cap program-icon"></i>
                        <h3>배드민턴 교실</h3>
                        <p>초보자를 위한 기초 배드민턴 강습</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Stats Section -->
        <section class="stats-section">
            <div class="container">
                <div class="stats-grid">
                    <div class="stat-item scroll-reveal">
                        <i class="fas fa-users stat-icon"></i>
                        <div class="stat-number" id="statsMembers">
                            <span class="loading-spinner">...</span>
                        </div>
                        <div class="stat-label">활동 회원</div>
                    </div>
                    <div class="stat-item scroll-reveal">
                        <i class="fas fa-history stat-icon"></i>
                        <div class="stat-number" id="statsYears">
                            <span class="loading-spinner">...</span>
                        </div>
                        <div class="stat-label">역사</div>
                    </div>
                    <div class="stat-item scroll-reveal">
                        <i class="fas fa-smile stat-icon"></i>
                        <div class="stat-number">100%</div>
                        <div class="stat-label">열정과 즐거움</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Contact Section -->
        <section id="contact" class="contact-section">
            <div class="container">
                <h2 class="section-title">가입 신청</h2>
                <p class="section-description">
                    건강한 장년 생활을 위한 첫 걸음, 지금 시작하세요!
                </p>
                
                <!-- 가입 신청 폼 -->
                <div class="join-form-container">
                    <form id="joinForm" class="join-form scroll-reveal">
                        <div class="form-grid">
                            <div class="form-group">
                                <label for="name"><i class="fas fa-user"></i> 이름 *</label>
                                <input type="text" id="name" name="name" required placeholder="홍길동">
                            </div>
                            <div class="form-group">
                                <label for="gender"><i class="fas fa-venus-mars"></i> 성별 *</label>
                                <select id="gender" name="gender" required>
                                    <option value="">선택해주세요</option>
                                    <option value="남">남</option>
                                    <option value="여">여</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="birth_year"><i class="fas fa-calendar"></i> 출생년도 *</label>
                                <input type="number" id="birth_year" name="birth_year" required placeholder="1970" min="1940" max="2010">
                            </div>
                            <div class="form-group">
                                <label for="phone"><i class="fas fa-phone"></i> 연락처 *</label>
                                <input type="tel" id="phone" name="phone" required placeholder="010-1234-5678">
                            </div>
                            <div class="form-group">
                                <label for="club"><i class="fas fa-building"></i> 소속 클럽</label>
                                <input type="text" id="club" name="club" placeholder="예: 평촌클럽, 안양클럽 등">
                            </div>
                            <div class="form-group">
                                <label for="grade"><i class="fas fa-layer-group"></i> 조 *</label>
                                <select id="grade" name="grade" required>
                                    <option value="">선택해주세요</option>
                                    <option value="S">S조</option>
                                    <option value="A">A조</option>
                                    <option value="B">B조</option>
                                    <option value="C">C조</option>
                                    <option value="D">D조</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group full-width">
                            <label for="message"><i class="fas fa-comment"></i> 가입 동기 및 문의사항</label>
                            <textarea id="message" name="message" rows="4" placeholder="가입 동기나 문의사항을 자유롭게 작성해주세요 (선택사항)"></textarea>
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="submit-btn">
                                <i class="fas fa-paper-plane"></i> 가입 신청하기
                            </button>
                        </div>
                        <div id="joinFormMessage" class="form-message hidden"></div>
                    </form>
                </div>

                <!-- 연락처 정보 -->
                <div class="contact-info">
                    <div class="contact-item scroll-reveal">
                        <i class="fas fa-map-marker-alt contact-icon"></i>
                        <div>
                            <h4>주소</h4>
                            <p>비산노인종합복지관 5층<br>배드민턴장</p>
                        </div>
                    </div>
                    <div class="contact-item scroll-reveal">
                        <i class="fas fa-phone contact-icon"></i>
                        <div>
                            <h4>전화</h4>
                            <p>사무국장 010-5471-0428</p>
                        </div>
                    </div>
                    <div class="contact-item scroll-reveal">
                        <i class="fas fa-envelope contact-icon"></i>
                        <div>
                            <h4>이메일</h4>
                            <p>anyang_seniors@example.com</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Footer -->
        <footer class="footer">
            <div class="container">
                <p>&copy; 2024 안양시배드민턴협회 장년부. All rights reserved.</p>
            </div>
        </footer>

        <script src="/static/landing/script.js"></script>
    </body>
    </html>
  `)
})

// Admin page
app.get('/admin', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>안양시배드민턴협회 장년부통합관리시스템</title>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🏸</text></svg>">
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
        <style>
          body { font-family: 'Noto Sans KR', sans-serif; }
          /* Prevent horizontal scroll on mobile */
          body, html { overflow-x: hidden; }
          
          /* Sidebar smooth transitions */
          .sidebar { 
            transition: transform 0.3s ease-in-out;
          }
          
          /* Overlay smooth fade */
          #sidebarOverlay {
            transition: opacity 0.3s ease-in-out;
          }
          
          #sidebarOverlay.hidden {
            opacity: 0;
            pointer-events: none;
          }
        </style>
    </head>
    <body class="bg-gray-50">
        <div id="app"></div>
        
        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/dayjs@1.11.10/dayjs.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/dayjs@1.11.10/locale/ko.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
        <script>dayjs.locale('ko');</script>
        <script src="/static/app.js?v=${Date.now()}"></script>
    </body>
    </html>
  `)
})

export default app
