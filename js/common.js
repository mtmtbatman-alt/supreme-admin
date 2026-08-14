/**
 * 슈프림 어드민 V2 공통 보안 및 인증 모듈 (js/common.js)
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. 모든 관리자 페이지 접근 시 세션 및 토큰 검증 수행
    verifyAdminSession();

    // 2. 로그아웃 버튼 공통 이벤트 바인딩
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // 3. Lucide 아이콘 자동 렌더링 (포함된 경우)
    if (window.lucide) {
        window.lucide.createIcons();
    }
});

// 관리자 세션 및 토큰 검증 함수
function verifyAdminSession() {
    const adminUser = JSON.parse(sessionStorage.getItem('sp_admin_user'));
    
    // 현재 페이지가 로그인 페이지가 아닐 때만 검증
    const isLoginPage = window.location.pathname.includes('login.html');
    
    if (!isLoginPage) {
        if (!adminUser || !adminUser.email) {
            alert('보안 세션이 만료되었거나 인증되지 않은 접근입니다. 로그인 페이지로 이동합니다.');
            window.location.href = 'login.html';
        }
    }
}

// 안전한 로그아웃 처리
function handleLogout() {
    sessionStorage.removeItem('sp_admin_user');
    localStorage.removeItem('sp_access_token');
    alert('안전하게 로그아웃되었습니다.');
    window.location.href = 'login.html';
}

/**
 * XSS 방어: 사용자 입력값 텍스트 새니타이징 헬퍼
 * @param {string} str - 원본 문자열
 * @returns {string} - 태그가 무력화된 안전한 문자열
 */
function sanitizeInput(str) {
    if (!str) return '';
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}