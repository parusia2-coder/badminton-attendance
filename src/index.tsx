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

// Health check
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Main page
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>안양시배드민턴연합회 장년부 회원관리시스템</title>
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
