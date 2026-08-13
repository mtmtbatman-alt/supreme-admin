/**
 * js/logs.js
 * 시스템 활동 로그 조회 로직
 */
document.addEventListener("DOMContentLoaded", () => {
  loadAdminLogs();
});

async function loadAdminLogs() {
  try {
    const response = await fetch(`${CONFIG.API_BASE_URL}/logs`, {
      method: "GET",
      headers: getAuthHeaders()
    });

    if (!response.ok) throw new Error("로그 로드 실패");
    const logs = await response.json();
    renderLogTable(logs);
  } catch (error) {
    console.error("활동 로그 조회 실패:", error);
  }
}

function renderLogTable(logs) {
  const tbody = document.getElementById("logTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  logs.forEach(log => {
    const tr = document.createElement("tr");

    const tdTime = document.createElement("td");
    tdTime.textContent = log.timestamp;

    const tdAdmin = document.createElement("td");
    tdAdmin.textContent = log.adminName; // XSS 방어

    const tdAction = document.createElement("td");
    tdAction.textContent = `${log.action} - ${log.details || ''}`; // XSS 방어

    const tdIp = document.createElement("td");
    tdIp.textContent = log.ipAddress;

    tr.appendChild(tdTime);
    tr.appendChild(tdAdmin);
    tr.appendChild(tdAction);
    tr.appendChild(tdIp);

    tbody.appendChild(tr);
  });
}