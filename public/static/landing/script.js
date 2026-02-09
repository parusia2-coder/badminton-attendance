document.addEventListener('DOMContentLoaded', () => {
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
});
