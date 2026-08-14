document.addEventListener('DOMContentLoaded', () => {
    // 1. 로그인 세션 검증 (기존 로직 유지)
    const adminUser = JSON.parse(sessionStorage.getItem('sp_admin_user'));
    
    if (!adminUser) {
        alert('로그인이 필요한 페이지입니다.');
        window.location.href = 'login.html';
        return;
    }

    // 2. 화면에 유저 정보 반영
    const emailEl = document.getElementById('userEmail');
    const welcomeEl = document.getElementById('welcomeMsg');

    if (emailEl) emailEl.innerText = adminUser.email;
    if (welcomeEl) welcomeEl.innerText = `${adminUser.name || '최고관리자'}님, 환영합니다!`;

    // 3. 로그아웃 기능
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem('sp_admin_user');
            alert('로그아웃되었습니다.');
            window.location.href = 'login.html';
        });
    }

    // 4. Lucide 아이콘 렌더링
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // 5. 차트 초기화 실행
    initCharts();
});

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