document.addEventListener('DOMContentLoaded', () => {
    // 1. 세션에서 관리자 정보 가져오기
    const adminUser = JSON.parse(sessionStorage.getItem('sp_admin_user'));
    
    // 로그인이 안 되어 있으면 로그인 페이지로 튕겨내기
    if (!adminUser) {
        alert('로그인이 필요한 페이지입니다.');
        window.location.href = 'login.html';
        return;
    }

    // 2. 화면에 유저 정보 반영하기
    const emailEl = document.getElementById('userEmail');
    const welcomeEl = document.getElementById('welcomeMsg');
    const roleEl = document.getElementById('userRole');

    if (emailEl) emailEl.innerText = adminUser.email;
    if (welcomeEl) welcomeEl.innerText = `${adminUser.name || '최고관리자'}님, 환영합니다!`;
    if (roleEl) roleEl.innerText = adminUser.role ? adminUser.role.toUpperCase() : 'SUPER_ADMIN';

    // 3. 로그아웃 버튼 기능
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem('sp_admin_user');
            alert('로그아웃되었습니다.');
            window.location.href = 'login.html';
        });
    }
});