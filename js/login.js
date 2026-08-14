document.addEventListener('DOMContentLoaded', () => {
  // Lucide 아이콘 초기화
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }

  const loginBtn = document.getElementById('loginBtn');
  
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      // 버튼 누르면 무조건 이동
      location.href = 'dashboard.html';
    });
  }
});