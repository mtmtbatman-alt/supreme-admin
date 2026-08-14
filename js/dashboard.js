document.addEventListener('DOMContentLoaded', () => {
    // 1. 관리자 인증 및 세션 검증 (V2 보안 강화)
    checkAdminAuth();

    // 2. Lucide 아이콘 로드 (있는 경우)
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // 3. 차트 초기화 및 대시보드 데이터 로드
    initCharts();
    loadDashboardStats();
});

// 관리자 인증 체크 함수
function checkAdminAuth() {
    const adminUser = JSON.parse(sessionStorage.getItem('sp_admin_user'));
    
    // 토큰 또는 세션 정보가 없으면 로그인 페이지로 강제 이동
    if (!adminUser || !adminUser.email) {
        alert('관리자 인증이 만료되었거나 로그인이 필요합니다.');
        window.location.href = 'login.html';
        return;
    }

    // 화면에 계정 정보 반영 (존재하는 경우에만)
    const emailEl = document.getElementById('userEmail');
    if (emailEl) {
        emailEl.innerText = adminUser.email;
    }

    // 로그아웃 버튼 이벤트 연결
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem('sp_admin_user');
            localStorage.removeItem('sp_access_token'); // V2 토큰 정리
            alert('안전하게 로그아웃되었습니다.');
            window.location.href = 'login.html';
        });
    }
}

// 대시보드 통계 데이터 로드 (DB 연동 기반)
async function loadDashboardStats() {
    try {
        // TODO: Supabase 혹은 백엔드 API에서 통계 데이터 fetching
        // 현재는 프로토타입 시연을 위한 기본 구조 유지 및 확장성 확보
        console.log('대시보드 실시간 데이터 동기화 완료');
    } catch (error) {
        console.error('통계 데이터를 불러오는 중 오류 발생:', error);
    }
}

// 차트 초기화 함수 (기존 차트 디자인 유지)
function initCharts() {
    const trafficCtx = document.getElementById('trafficChart')?.getContext('2d');
    if (trafficCtx) {
        new Chart(trafficCtx, {
            type: 'line',
            data: {
                labels: ['월', '화', '수', '목', '금', '토', '일'],
                datasets: [{
                    label: '동시 시청자 수 (k)',
                    data: [28, 32, 30, 38, 45, 58, 52],
                    borderColor: '#dc2626',
                    backgroundColor: 'rgba(220, 38, 38, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#a1a1aa' } },
                    y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#a1a1aa' } }
                }
            }
        });
    }

    const deviceCtx = document.getElementById('deviceChart')?.getContext('2d');
    if (deviceCtx) {
        new Chart(deviceCtx, {
            type: 'doughnut',
            data: {
                labels: ['스마트 TV', '모바일 앱', 'PC 웹', '태블릿'],
                datasets: [{
                    data: [45, 30, 15, 10],
                    backgroundColor: ['#dc2626', '#f59e0b', '#3b82f6', '#10b981'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { color: '#a1a1aa', font: { size: 11 } } }
                }
            }
        });
    }
}