document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const emailInput = document.getElementById('email').value.trim();
      const targetEmail = 'mtmtbatman@gmail.com'; // 관리자 이메일

      if (emailInput === targetEmail) {
        const adminUser = {
          name: '최고관리자',
          email: targetEmail,
          role: 'super_admin'
        };

        // 세션 저장 후 대시보드로 이동
        sessionStorage.setItem('sp_admin_user', JSON.stringify(adminUser));
        alert('관리자 로그인 성공!');
        window.location.href = 'dashboard.html';
      } else {
        alert('등록되지 않은 관리자 이메일입니다.');
      }
    });
  }
});