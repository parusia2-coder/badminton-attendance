document.addEventListener('DOMContentLoaded', () => {
    // 실시간 통계 로드
    loadLiveStats();

    // Hero Slider 초기화
    initHeroSlider();

    // 스크롤 애니메이션 (Intersection Observer)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // 한 번만 실행
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.scroll-reveal');
    revealElements.forEach(el => observer.observe(el));

    // 네비게이션 스무스 스크롤
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // 헤더 높이 보정
                    behavior: 'smooth'
                });
            }
        });
    });

    // 헤더 스크롤 시 배경 변경
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
                navbar.style.padding = '10px 0';
            } else {
                navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
                navbar.style.padding = '15px 0';
            }
        });
    }

    // 모바일 메뉴 토글
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            const isFlex = navLinks.style.display === 'flex';
            navLinks.style.display = isFlex ? 'none' : 'flex';
            if (!isFlex) {
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = 'white';
                navLinks.style.padding = '20px';
                navLinks.style.boxShadow = '0 5px 10px rgba(0,0,0,0.1)';
            }
        });
    }

    // 가입 신청 폼 제출
    const joinForm = document.getElementById('joinForm');
    const joinFormMessage = document.getElementById('joinFormMessage');

    if (joinForm) {
        joinForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(joinForm);
            const data = {
                name: formData.get('name'),
                gender: formData.get('gender'),
                birth_year: parseInt(formData.get('birth_year')),
                phone: formData.get('phone'),
                club: formData.get('club') || '',
                grade: formData.get('grade'),
                message: formData.get('message') || ''
            };

            // 유효성 검사
            if (!data.name || !data.gender || !data.birth_year || !data.phone || !data.grade) {
                showFormMessage('필수 정보를 모두 입력해주세요.', 'error');
                return;
            }

            // 전화번호 형식 검사
            const phonePattern = /^01[0-9]-?\d{3,4}-?\d{4}$/;
            if (!phonePattern.test(data.phone)) {
                showFormMessage('올바른 연락처 형식을 입력해주세요. (예: 010-1234-5678)', 'error');
                return;
            }

            // 출생년도 검증
            if (data.birth_year < 1940 || data.birth_year > 2010) {
                showFormMessage('올바른 출생년도를 입력해주세요.', 'error');
                return;
            }

            // 제출 버튼 비활성화
            const submitBtn = joinForm.querySelector('.submit-btn');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 제출 중...';

            try {
                const response = await fetch('/api/join-requests', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok) {
                    showFormMessage(result.message || '가입 신청이 완료되었습니다. 관리자 승인 후 연락드리겠습니다.', 'success');
                    joinForm.reset();
                } else {
                    showFormMessage(result.error || '가입 신청에 실패했습니다. 다시 시도해주세요.', 'error');
                }
            } catch (error) {
                console.error('가입 신청 오류:', error);
                showFormMessage('네트워크 오류가 발생했습니다. 다시 시도해주세요.', 'error');
            } finally {
                // 제출 버튼 복원
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        });
    }

    function showFormMessage(message, type) {
        if (!joinFormMessage) return;
        
        joinFormMessage.textContent = message;
        joinFormMessage.className = `form-message ${type}`;
        joinFormMessage.classList.remove('hidden');
        
        // 5초 후 메시지 숨기기 (성공 시)
        if (type === 'success') {
            setTimeout(() => {
                joinFormMessage.classList.add('hidden');
            }, 5000);
        }
        
        // 메시지 위치로 스크롤
        joinFormMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Hero Slider Functions
    function initHeroSlider() {
        let currentSlide = 0;
        let heroImages = [];
        let autoPlayInterval;
        const slider = document.querySelector('.hero-slider');
        const heroTitle = document.querySelector('.hero-title');
        const heroSubtitle = document.querySelector('.hero-subtitle');
        const prevBtn = document.querySelector('.hero-prev');
        const nextBtn = document.querySelector('.hero-next');
        const indicatorsContainer = document.querySelector('.hero-indicators');

        // API에서 히어로 이미지 불러오기
        async function loadHeroImages() {
            try {
                const response = await fetch('/api/hero-images?status=active');
                const data = await response.json();
                heroImages = data.images || [];

                if (heroImages.length === 0) {
                    // 기본 이미지
                    heroImages = [
                        {
                            id: 1,
                            image_url: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=1920&q=80',
                            title: '건강한 노년, 활기찬 황금기',
                            subtitle: '안양시배드민턴협회 장년부와 함께하세요'
                        }
                    ];
                }

                renderSlider();
                startAutoPlay();
            } catch (error) {
                console.error('히어로 이미지 로드 실패:', error);
                // 폴백 이미지
                heroImages = [
                    {
                        id: 1,
                        image_url: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=1920&q=80',
                        title: '건강한 노년, 활기찬 황금기',
                        subtitle: '안양시배드민턴협회 장년부와 함께하세요'
                    }
                ];
                renderSlider();
            }
        }

        function renderSlider() {
            // 슬라이드 생성
            slider.innerHTML = '';
            heroImages.forEach((img, index) => {
                const slide = document.createElement('div');
                slide.className = `hero-slide ${index === 0 ? 'active' : ''}`;
                slide.innerHTML = `
                    <div class="hero-background" style="background-image: url('${img.image_url}')"></div>
                `;
                slider.appendChild(slide);
            });

            // 인디케이터 생성
            if (indicatorsContainer) {
                indicatorsContainer.innerHTML = '';
                heroImages.forEach((_, index) => {
                    const indicator = document.createElement('div');
                    indicator.className = `hero-indicator ${index === 0 ? 'active' : ''}`;
                    indicator.addEventListener('click', () => goToSlide(index));
                    indicatorsContainer.appendChild(indicator);
                });
            }

            // 첫 번째 이미지 텍스트 설정
            updateContent(0);

            // 단일 이미지일 경우 컨트롤 숨김
            if (heroImages.length <= 1) {
                if (prevBtn) prevBtn.style.display = 'none';
                if (nextBtn) nextBtn.style.display = 'none';
                if (indicatorsContainer) indicatorsContainer.style.display = 'none';
            }
        }

        function updateContent(index) {
            const img = heroImages[index];
            if (heroTitle) {
                heroTitle.textContent = img.title || '안양시배드민턴협회 장년부';
                heroTitle.style.animation = 'none';
                setTimeout(() => heroTitle.style.animation = 'fadeInUp 0.8s ease', 10);
            }
            if (heroSubtitle) {
                heroSubtitle.textContent = img.subtitle || '건강한 노년, 활기찬 황금기';
                heroSubtitle.style.animation = 'none';
                setTimeout(() => heroSubtitle.style.animation = 'fadeInUp 0.8s ease 0.2s both', 10);
            }
        }

        function goToSlide(index) {
            const slides = document.querySelectorAll('.hero-slide');
            const indicators = document.querySelectorAll('.hero-indicator');

            slides[currentSlide].classList.remove('active');
            if (indicators[currentSlide]) indicators[currentSlide].classList.remove('active');

            currentSlide = index;

            slides[currentSlide].classList.add('active');
            if (indicators[currentSlide]) indicators[currentSlide].classList.add('active');

            updateContent(currentSlide);
        }

        function nextSlide() {
            goToSlide((currentSlide + 1) % heroImages.length);
        }

        function prevSlide() {
            goToSlide((currentSlide - 1 + heroImages.length) % heroImages.length);
        }

        function startAutoPlay() {
            if (heroImages.length <= 1) return;
            autoPlayInterval = setInterval(nextSlide, 5000); // 5초마다 자동 전환
        }

        function stopAutoPlay() {
            clearInterval(autoPlayInterval);
        }

        // 이벤트 리스너
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                stopAutoPlay();
                prevSlide();
                startAutoPlay();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                stopAutoPlay();
                nextSlide();
                startAutoPlay();
            });
        }

        // 초기 로드
        loadHeroImages();
    }

    // 실시간 통계 로드
    async function loadLiveStats() {
        try {
            const response = await fetch('/api/stats/public');
            const data = await response.json();

            // 조직도 통계 업데이트
            const totalMembersElement = document.getElementById('totalMembersCount');
            const totalClubsElement = document.getElementById('totalClubsCount');
            
            if (totalMembersElement) {
                totalMembersElement.textContent = `${data.totalMembers}명`;
            }
            
            if (totalClubsElement) {
                totalClubsElement.textContent = `${data.totalClubs}개`;
            }

            // Stats Section 업데이트
            const statsMembersElement = document.getElementById('statsMembers');
            const statsYearsElement = document.getElementById('statsYears');
            
            if (statsMembersElement) {
                statsMembersElement.textContent = `${data.totalMembers}+`;
            }
            
            if (statsYearsElement) {
                statsYearsElement.textContent = `${data.yearsActive}+년`;
            }

            // 숫자 애니메이션 효과
            animateNumbers();
        } catch (error) {
            console.error('통계 로드 실패:', error);
            // 폴백 값 설정
            const totalMembersElement = document.getElementById('totalMembersCount');
            const totalClubsElement = document.getElementById('totalClubsCount');
            const statsMembersElement = document.getElementById('statsMembers');
            const statsYearsElement = document.getElementById('statsYears');
            
            if (totalMembersElement) totalMembersElement.textContent = '500+명';
            if (totalClubsElement) totalClubsElement.textContent = '20+개';
            if (statsMembersElement) statsMembersElement.textContent = '500+';
            if (statsYearsElement) statsYearsElement.textContent = '20+년';
        }
    }

    // 숫자 카운트업 애니메이션
    function animateNumbers() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const text = stat.textContent;
            const match = text.match(/(\d+)/);
            
            if (match) {
                const finalNumber = parseInt(match[1]);
                const duration = 2000; // 2초
                const steps = 60;
                const increment = finalNumber / steps;
                let current = 0;
                let step = 0;
                
                const timer = setInterval(() => {
                    step++;
                    current += increment;
                    
                    if (step >= steps) {
                        clearInterval(timer);
                        stat.textContent = text; // 최종 값으로 복원
                    } else {
                        stat.textContent = text.replace(/\d+/, Math.floor(current).toString());
                    }
                }, duration / steps);
            }
        });
    }
});

    // 캘린더 초기화
    function initCalendar() {
        let currentDate = new Date();
        let schedules = [];

        // API에서 일정 데이터 로드
        async function loadSchedules() {
            try {
                // 향후 1년치 일정 로드
                const startDate = new Date();
                startDate.setMonth(startDate.getMonth() - 1);
                const endDate = new Date();
                endDate.setFullYear(endDate.getFullYear() + 1);

                const response = await fetch('/api/schedules');
                const data = await response.json();
                schedules = data.schedules || [];
                renderCalendar();
            } catch (error) {
                console.error('일정 로드 실패:', error);
                schedules = [];
                renderCalendar();
            }
        }

        // 캘린더 렌더링
        function renderCalendar() {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            
            // 타이틀 업데이트
            document.getElementById('calendarTitle').textContent = `${year}년 ${month + 1}월`;
            
            // 해당 월의 첫날과 마지막날
            const firstDay = new Date(year, month, 1);
            const lastDay = new Date(year, month + 1, 0);
            
            // 이전 달의 마지막 날
            const prevLastDay = new Date(year, month, 0);
            
            // 시작 요일 (0: 일요일, 6: 토요일)
            const firstDayOfWeek = firstDay.getDay();
            
            // 총 날짜 수
            const daysInMonth = lastDay.getDate();
            
            // 캘린더 days 컨테이너
            const calendarDays = document.getElementById('calendarDays');
            calendarDays.innerHTML = '';
            
            // 오늘 날짜
            const today = new Date();
            const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
            const todayDate = today.getDate();
            
            // 이전 달 날짜들
            for (let i = firstDayOfWeek - 1; i >= 0; i--) {
                const day = prevLastDay.getDate() - i;
                const dayDiv = createDayElement(day, true, false, []);
                calendarDays.appendChild(dayDiv);
            }
            
            // 현재 달 날짜들
            for (let day = 1; day <= daysInMonth; day++) {
                const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const daySchedules = schedules.filter(s => s.schedule_date === dateString);
                const isToday = isCurrentMonth && day === todayDate;
                
                const dayDiv = createDayElement(day, false, isToday, daySchedules);
                calendarDays.appendChild(dayDiv);
            }
            
            // 다음 달 날짜들 (6주 그리드 채우기)
            const totalCells = calendarDays.children.length;
            const remainingCells = 42 - totalCells; // 6주 * 7일
            
            for (let day = 1; day <= remainingCells; day++) {
                const dayDiv = createDayElement(day, true, false, []);
                calendarDays.appendChild(dayDiv);
            }
        }
        
        // 날짜 요소 생성
        function createDayElement(day, isOtherMonth, isToday, daySchedules) {
            const dayDiv = document.createElement('div');
            dayDiv.className = 'calendar-day';
            
            if (isOtherMonth) {
                dayDiv.classList.add('other-month');
            }
            if (isToday) {
                dayDiv.classList.add('today');
            }
            if (daySchedules.length > 0) {
                dayDiv.classList.add('has-event');
            }
            
            // 날짜 번호
            const dayNumber = document.createElement('div');
            dayNumber.className = 'day-number';
            dayNumber.textContent = day;
            dayDiv.appendChild(dayNumber);
            
            // 일정 표시
            if (daySchedules.length > 0) {
                const eventsDiv = document.createElement('div');
                eventsDiv.className = 'day-events';
                
                daySchedules.forEach(schedule => {
                    const eventDiv = document.createElement('div');
                    eventDiv.className = 'day-event';
                    
                    // 일정 타입 판별 (정모/특모)
                    const title = schedule.title || '';
                    if (title.includes('특모') || title.includes('특별')) {
                        eventDiv.classList.add('special');
                    } else {
                        eventDiv.classList.add('regular');
                    }
                    
                    eventDiv.textContent = title.length > 8 ? title.substring(0, 8) + '...' : title;
                    eventDiv.title = title; // 전체 제목 툴팁
                    eventsDiv.appendChild(eventDiv);
                });
                
                dayDiv.appendChild(eventsDiv);
            }
            
            return dayDiv;
        }
        
        // 이전 달 버튼
        document.getElementById('prevMonth').addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        });
        
        // 다음 달 버튼
        document.getElementById('nextMonth').addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        });
        
        // 초기 로드
        loadSchedules();
    }

    // 캘린더 초기화 호출
    if (document.getElementById('calendarDays')) {
        initCalendar();
    }

    // 팝업 로드
    loadPopups();

// ========================================
// 팝업 관리
// ========================================

async function loadPopups() {
    try {
        const response = await fetch('/api/popups?status=active');
        const data = await response.json();
        
        if (data.popups && data.popups.length > 0) {
            const today = new Date().toISOString().split('T')[0];
            const activePopups = data.popups.filter(popup => {
                return popup.start_date <= today && popup.end_date >= today;
            });
            
            activePopups.forEach(popup => {
                const cookieName = `popup_hide_${popup.id}`;
                const hideUntil = getCookie(cookieName);
                
                if (!hideUntil || new Date(hideUntil) < new Date()) {
                    showPopup(popup);
                }
            });
        }
    } catch (error) {
        console.error('팝업 로드 실패:', error);
    }
}

function showPopup(popup) {
    const popupContainer = document.createElement('div');
    popupContainer.id = `popup-${popup.id}`;
    popupContainer.className = 'popup-overlay';
    
    let positionClass = '';
    switch(popup.position) {
        case 'top':
            positionClass = 'popup-top';
            break;
        case 'bottom':
            positionClass = 'popup-bottom';
            break;
        default:
            positionClass = 'popup-center';
    }
    
    popupContainer.innerHTML = `
        <div class="popup-content ${positionClass}" style="width: ${popup.width}px; max-height: ${popup.height}px;">
            <button class="popup-close" onclick="closePopup(${popup.id})">
                <i class="fas fa-times"></i>
            </button>
            
            <div class="popup-body">
                ${popup.content_type === 'image' && popup.image_url ? `
                    ${popup.link_url ? `
                        <a href="${popup.link_url}" target="_blank">
                            <img src="${popup.image_url}" alt="${popup.title}" class="popup-image" />
                        </a>
                    ` : `
                        <img src="${popup.image_url}" alt="${popup.title}" class="popup-image" />
                    `}
                ` : ''}
                
                <div class="popup-text">
                    <h3 class="popup-title">${popup.title}</h3>
                    ${popup.html_content ? `<div class="popup-description">${popup.html_content}</div>` : ''}
                    ${popup.link_url && popup.content_type !== 'image' ? `
                        <a href="${popup.link_url}" target="_blank" class="popup-link">
                            자세히 보기 <i class="fas fa-arrow-right ml-1"></i>
                        </a>
                    ` : ''}
                </div>
            </div>
            
            <div class="popup-footer">
                <label class="popup-checkbox">
                    <input type="checkbox" id="hideToday-${popup.id}" />
                    <span>오늘 하루 보지 않기</span>
                </label>
                <button onclick="closePopupWithCheck(${popup.id})" class="popup-close-btn">
                    닫기
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(popupContainer);
    
    setTimeout(() => {
        popupContainer.classList.add('active');
    }, 100);
    
    popupContainer.addEventListener('click', (e) => {
        if (e.target === popupContainer) {
            closePopupWithCheck(popup.id);
        }
    });
}

function closePopup(popupId) {
    const popupContainer = document.getElementById(`popup-${popupId}`);
    if (popupContainer) {
        popupContainer.classList.remove('active');
        setTimeout(() => {
            popupContainer.remove();
        }, 300);
    }
}

function closePopupWithCheck(popupId) {
    const checkbox = document.getElementById(`hideToday-${popupId}`);
    
    if (checkbox && checkbox.checked) {
        const tomorrow = new Date();
        tomorrow.setHours(24, 0, 0, 0);
        setCookie(`popup_hide_${popupId}`, tomorrow.toISOString(), 1);
    }
    
    closePopup(popupId);
}

function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
