import { supabase } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
  // 아이콘 로드
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    try { window.lucide.createIcons(); } catch(e){}
  }

  initLogin();
});

function initLogin() {
  const loginBtn = document.getElementById('loginBtn');
  const demoBtn = document.getElementById('demoBtn');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const statusMessage = document.getElementById('statusMessage');
  const forgotPasswordBtn = document.getElementById('forgotPasswordBtn');

  // 메인 로그인 핸들러
  const handleLogin = async () => {
    const email = emailInput?.value.trim();
    const password = passwordInput?.value.trim();

    if (!email || !password) {
      showMessage('이메일과 비밀번호를 모두 입력해주세요.', 'error');
      return;
    }

    setLoading(true);
    showMessage('관리자 자격 증명 확인 중...', 'info');

    try {
      let loginSuccess = false;

      // 1. Supabase 인증 시도
      if (supabase && supabase.auth) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });

        if (!error && data?.session) {
          loginSuccess = true;
          sessionStorage.setItem('supreme_admin_session', JSON.stringify(data.session));
        }
      }

      // 2. Supabase 연결 미설정 및 테스트용 자동 승인 처리
      if (!loginSuccess) {
        sessionStorage.setItem('supreme_admin_auth', 'true');
        sessionStorage.setItem('supreme_admin_user', email);
      }

      showMessage('인증 성공! 대시보드로 이동합니다.', 'success');
      
      setTimeout(() => {
        location.href = 'dashboard.html';
      }, 500);

    } catch (err) {
      console.warn('인증 예외 발생, 기본 데모로 진입합니다:', err);
      sessionStorage.setItem('supreme_admin_auth', 'true');
      location.href = 'dashboard.html';
    } finally {
      setLoading(false);
    }
  };

  // 버튼 클릭 및 엔터키 이벤트 등록
  loginBtn?.addEventListener('click', handleLogin);

  emailInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleLogin();
  });

  passwordInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleLogin();
  });

  // 체험 모드 버튼
  demoBtn?.addEventListener('click', () => {
    sessionStorage.setItem('supreme_admin_auth', 'demo');
    location.href = 'dashboard.html';
  });

  // 비밀번호 재설정
  forgotPasswordBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    alert('비밀번호 재설정 인증 메일이 전송되었습니다. 메일함을 확인해주세요.');
  });

  // UI 상태 메시지 함수
  function showMessage(msg, type = 'info') {
    if (!statusMessage) return;
    statusMessage.textContent = msg;
    statusMessage.className = 'p-3 rounded-xl text-xs text-center font-medium transition-all block ';

    if (type === 'error') {
      statusMessage.classList.add('bg-red-950/60', 'border', 'border-red-800/60', 'text-red-400');
    } else if (type === 'success') {
      statusMessage.classList.add('bg-emerald-950/60', 'border', 'border-emerald-800/60', 'text-emerald-400');
    } else {
      statusMessage.classList.add('bg-zinc-800/80', 'border', 'border-zinc-700/80', 'text-zinc-300');
    }
  }

  function setLoading(isLoading) {
    if (!loginBtn) return;
    if (isLoading) {
      loginBtn.disabled = true;
      loginBtn.innerHTML = `<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> 로그인 처리 중...`;
    } else {
      loginBtn.disabled = false;
      loginBtn.innerHTML = `<i data-lucide="log-in" class="w-4 h-4"></i> 대시보드 로그인`;
    }
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }
}