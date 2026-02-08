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
                    <li><a href="#about">협회소개</a></li>
                    <li><a href="#programs">활동안내</a></li>
                    <li><a href="#contact">가입문의</a></li>
                    <li><a href="/admin" class="admin-link"><i class="fas fa-cog"></i> 관리자</a></li>
                </ul>
            </nav>
        </header>

        <!-- Hero Section -->
        <section id="home" class="hero">
            <div class="hero-content">
                <h1 class="hero-title">건강한 노년, 활기찬 황금기</h1>
                <p class="hero-subtitle">안양시배드민턴협회 장년부와 함께하세요</p>
                <a href="#contact" class="cta-button">지금 가입하기</a>
            </div>
        </section>

        <!-- About Section -->
        <section id="about" class="about-section">
            <div class="container">
                <h2 class="section-title">협회 소개</h2>
                <p class="section-description">
                    안양시배드민턴협회 장년부는 건강한 노년 생활과 활기찬 황금기를 보내기 위해 
                    1995년에 설립된 비영리 체육 단체입니다. 배드민턴을 통해 건강을 지키고, 
                    회원 간 친목을 도모하며, 지역 사회에 활력을 불어넣고 있습니다.
                </p>
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

        <!-- Programs Section -->
        <section id="programs" class="programs-section">
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
                        <div class="stat-number">500+</div>
                        <div class="stat-label">활동 회원</div>
                    </div>
                    <div class="stat-item scroll-reveal">
                        <i class="fas fa-history stat-icon"></i>
                        <div class="stat-number">20+년</div>
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
                    건강한 노년 생활을 위한 첫 걸음, 지금 시작하세요!
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
                            <p>경기도 안양시 동안구 평촌대로 123</p>
                        </div>
                    </div>
                    <div class="contact-item scroll-reveal">
                        <i class="fas fa-phone contact-icon"></i>
                        <div>
                            <h4>전화</h4>
                            <p>031-123-4567</p>
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
