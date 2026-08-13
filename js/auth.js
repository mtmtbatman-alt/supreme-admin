/**
 * js/auth.js
 * JWT 인증 관리 및 토큰 검증 인터셉터
 */
document.addEventListener("DOMContentLoaded", () => {
  checkAdminAuth();
});

// 관리자 인증 상태 검증
async function checkAdminAuth() {
  const currentPage = window.location.pathname.split("/").pop();
  
  // 로그인 페이지는 검증 스킵
  if (currentPage === "login.html" || currentPage === "index.html") return;

  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    redirectToLogin("로그인이 필요합니다.");
    return;
  }

  try {
    // AccessToken 검증 요청
    const response = await fetch(`${CONFIG.API_BASE_URL}/auth/verify`, {
      method: "GET",
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      // AccessToken 만료 시 RefreshToken으로 갱신 시도
      const refreshed = await refreshAccessToken();
      if (!refreshed) {
        redirectToLogin("세션이 만료되었습니다. 다시 로그인해주세요.");
      }
    }
  } catch (error) {
    console.error("인증 검증 중 오류:", error);
  }
}

// Refresh Token으로 Access Token 재발급
async function refreshAccessToken() {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${CONFIG.API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken })
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem("accessToken", data.accessToken);
      return true;
    }
  } catch (err) {
    console.error("토큰 갱신 실패:", err);
  }
  return false;
}

// 로그인 페이지로 이동
function redirectToLogin(message) {
  if (message) alert(message);
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  window.location.href = "login.html";
}

// 로그아웃 처리
async function handleLogout() {
  if (!confirm("로그아웃 하시겠습니까?")) return;

  try {
    await fetch(`${CONFIG.API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: getAuthHeaders()
    });
  } finally {
    redirectToLogin();
  }
}