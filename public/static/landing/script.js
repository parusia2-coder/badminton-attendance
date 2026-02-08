document.addEventListener('DOMContentLoaded', () => {
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
                message: formData.get('message') || ''
            };

            // 유효성 검사
            if (!data.name || !data.gender || !data.birth_year || !data.phone) {
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
});
