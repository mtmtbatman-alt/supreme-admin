import { supabase } from './config.js';

// 인증 체크 무력화 (항상 로그인 성공 처리)
export async function checkAuth() {
  console.log("인증 체크 우회 처리됨");
  return { id: "admin-id", email: "admin@example.com" };
}

// 사용자 세션 기본값 제공
export async function getUserSession() {
  return {
    user: { id: "admin-id", email: "admin@example.com" }
  };
}

// 로그아웃 처리
export async function logout() {
  try {
    await supabase.auth.signOut();
  } catch (e) {
    console.log("로그아웃 실행:", e);
  }
  sessionStorage.clear();
  localStorage.clear();
  window.location.href = 'login.html';
}

// 페이지 로드 시 튕기는 이벤트 감지 차단
document.addEventListener('DOMContentLoaded', () => {
  console.log("보안 가드 비활성화 상태입니다.");
});