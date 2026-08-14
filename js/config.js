/**
 * js/config.js
 * 시스템 기본 설정 및 보안 유틸리티 (XSS, CSRF)
 */
const CONFIG = {
  API_BASE_URL: "https://your-api-domain.com/api", // 실제 API endpoint
  SUPABASE_URL: "https://henrnvbccfrqrtgbosle.supabase.co/rest/v1/",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlbnJudmJjY2ZycXJ0Z2Jvc2xlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY1NjQ0OTcsImV4cCI6MjEwMjE0MDQ5N30.krLwR2fpLrB4SJNIsiv06UzGMwOPKitI9KoYRx-fYq0",
  ITEMS_PER_PAGE: 20
};

// [10. XSS 방어] 사용자 입력값 안전 변환 (textContent 대체용 Sanitize)
function sanitizeHTML(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// [11. CSRF 방어] 헤더 세팅 유틸리티
function getAuthHeaders() {
  const token = localStorage.getItem("accessToken"); // 메모리 또는 Secure Cookie 관리 권장
  const csrfToken = document.cookie.replace(/(?:(?:^|.*;\s*)XSRF-TOKEN\s*\=\s*([^;]*).*$)|^.*$/, "$1");

  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
    "X-CSRF-Token": csrfToken
  };
}