/**
 * js/logger.js
 * 관리자 활동 로그 기록 모듈
 */
async function logAdminAction(actionType, details) {
  try {
    const logData = {
      action: actionType,      // 예: "콘텐츠 삭제", "SEO 변경"
      details: details,        // 세부 내용
      timestamp: new Date().toISOString()
    };

    await fetch(`${CONFIG.API_BASE_URL}/logs`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(logData)
    });
  } catch (error) {
    console.error("로그 기록 실패:", error);
  }
}