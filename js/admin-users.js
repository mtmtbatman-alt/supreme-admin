/**
 * js/admin-users.js
 * 관리자 계정 권한 제어 및 목록 관리
 */
document.addEventListener("DOMContentLoaded", () => {
  loadAdminUsers();
});

async function loadAdminUsers() {
  try {
    const response = await fetch(`${CONFIG.API_BASE_URL}/admin/users`, {
      method: "GET",
      headers: getAuthHeaders()
    });

    if (!response.ok) throw new Error("계정 로드 실패");
    const users = await response.json();
    renderAdminUserTable(users);
  } catch (error) {
    console.error("관리자 계정 불러오기 실패:", error);
  }
}

function renderAdminUserTable(users) {
  const tbody = document.getElementById("adminUserTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  users.forEach(user => {
    const tr = document.createElement("tr");

    const tdId = document.createElement("td");
    tdId.textContent = user.id;

    const tdName = document.createElement("td");
    tdName.textContent = user.name; // XSS 방어 textContent

    const tdEmail = document.createElement("td");
    tdEmail.textContent = user.email;

    const tdRole = document.createElement("td");
    const roleBadge = document.createElement("span");
    roleBadge.className = user.role === "SUPER_ADMIN" ? "badge badge-red" : "badge badge-gray";
    roleBadge.textContent = user.role === "SUPER_ADMIN" ? "최고관리자" : "운영자";
    tdRole.appendChild(roleBadge);

    const tdLastLogin = document.createElement("td");
    tdLastLogin.textContent = user.lastLoginAt || "-";

    const tdFailCount = document.createElement("td");
    tdFailCount.textContent = `${user.loginFailCount || 0}회`;

    const tdAction = document.createElement("td");
    const btnEdit = document.createElement("button");
    btnEdit.className = "btn btn-sm btn-secondary";
    btnEdit.textContent = "수정";
    
    tdAction.appendChild(btnEdit);

    tr.appendChild(tdId);
    tr.appendChild(tdName);
    tr.appendChild(tdEmail);
    tr.appendChild(tdRole);
    tr.appendChild(tdLastLogin);
    tr.appendChild(tdFailCount);
    tr.appendChild(tdAction);

    tbody.appendChild(tr);
  });
}