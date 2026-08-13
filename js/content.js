/**
 * js/content.js
 * 콘텐츠 관리 페이지 기능 (XSS 방어 및 데이터 바인딩)
 */
let currentPage = 1;

document.addEventListener("DOMContentLoaded", () => {
  loadContentList(currentPage);
});

// 콘텐츠 목록 불러오기 및 안전한 렌더링 (XSS 방어)
async function loadContentList(page = 1) {
  try {
    const search = document.getElementById("searchInput")?.value || "";
    const status = document.getElementById("filterStatus")?.value || "all";

    const response = await fetch(`${CONFIG.API_BASE_URL}/contents?page=${page}&limit=${CONFIG.ITEMS_PER_PAGE}&search=${encodeURIComponent(search)}&status=${status}`, {
      method: "GET",
      headers: getAuthHeaders()
    });

    const result = await response.json();
    renderContentTable(result.data);
  } catch (error) {
    console.error("콘텐츠 목록 로드 실패:", error);
  }
}

// 안전한 테이블 DOM 생성 (innerHTML 대신 textContent 사용)
function renderContentTable(items) {
  const tbody = document.getElementById("contentTableBody");
  if (!tbody) return;
  tbody.innerHTML = ""; // 기존 비우기

  items.forEach(item => {
    const tr = document.createElement("tr");

    // 1. 체크박스
    const tdCheck = document.createElement("td");
    const chk = document.createElement("input");
    chk.type = "checkbox";
    chk.value = item.id;
    tdCheck.appendChild(chk);

    // 2. ID
    const tdId = document.createElement("td");
    tdId.textContent = item.id; // XSS Safe

    // 3. 제목 (XSS Safe)
    const tdTitle = document.createElement("td");
    tdTitle.textContent = item.title;

    // 4. 상태
    const tdStatus = document.createElement("td");
    const badge = document.createElement("span");
    badge.className = item.status === "published" ? "badge badge-red" : "badge badge-gray";
    badge.textContent = item.status === "published" ? "게시 중" : "비공개";
    tdStatus.appendChild(badge);

    // 5. 등록일
    const tdDate = document.createElement("td");
    tdDate.textContent = item.createdAt;

    tr.appendChild(tdCheck);
    tr.appendChild(tdId);
    tr.appendChild(tdTitle);
    tr.appendChild(tdStatus);
    tr.appendChild(tdDate);

    tbody.appendChild(tr);
  });
}