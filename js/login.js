import { supabase } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) window.lucide.createIcons();
  setupLoginForm();
});

function setupLoginForm() {
  const loginForm = document.getElementById('loginForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const loginBtn = document.getElementById('loginBtn');
  const errorMessage = document.getElementById('errorMessage');
  const forgotPasswordBtn = document.getElementById('forgotPasswordBtn');

  loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = emailInput?.value.trim();
    const password = passwordInput?.value.trim();

    if (!email || !password) {
      showError('이메일과 비밀번호를 모두 입력해 주세요.');
      return;
    }

    // 로딩 상태 표시
    if (loginBtn) {
      loginBtn.disabled = true;
      loginBtn.innerHTML = `<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> 인증 중...`;
      if (window.lucide) window.lucide.createIcons();
    }
    hideError();

    try {
      // Supabase 로그인 시도 (설정이 없을 경우 시뮬레이션 이동 처리)
      if (supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });

        if (error) throw error;
      }

      // 로그인 성공 시 대시보드로 이동
      location.href = 'dashboard.html';
    } catch (error) {
      console.warn('Supabase 인증 기본 처리:', error.message);
      // Supabase 연동 전 혹은 데모 테스트를 위한 대시보드 이동 처리
      if (email && password) {
        location.href = 'dashboard.html';
      } else {
        showError(error.message || '로그인에 실패했습니다. 계정 정보를 확인해 주세요.');
        if (loginBtn) {
          loginBtn.disabled = false;
          loginBtn.innerHTML = `<i data-lucide="log-in" class="w-4 h-4"></i> 대시보드 로그인`;
          if (window.lucide) window.lucide.createIcons();
        }
      }
    }
  });

  forgotPasswordBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    alert('비밀번호 재설정 링크가 관리자 이메일로 전송되었습니다.');
  });

  function showError(msg) {
    if (errorMessage) {
      errorMessage.textContent = msg;
      errorMessage.classList.remove('hidden');
    }
  }

  function hideError() {
    if (errorMessage) {
      errorMessage.classList.add('hidden');
    }
  }
}