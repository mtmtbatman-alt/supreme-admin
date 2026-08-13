/**
 * js/dashboard.js
 * 대시보드 통계 카드, Chart.js 및 최근 데이터 동적 바인딩
 */
document.addEventListener("DOMContentLoaded", () => {
  initDashboard();
});

async function initDashboard() {
  await Promise.all([
    loadDashboardStats(),
    loadRecentContents(),
    loadRecentLogs(),
    renderVisitChart()
  ]);
}

// 1. 통계 카드 데이터 불러오기
async function loadDashboardStats() {
  try {
    const res = await fetch(`${CONFIG.API_BASE_URL}/dashboard/stats`, {
      method: "GET",
      headers: getAuthHeaders()
    });

    if (!res.ok) throw new Error("통계 로드 실패");
    const data = await res.json();

    document.getElementById("statToday").textContent = Number(data.todayVisits || 0).toLocaleString();
    document.getElementById("statYesterday").textContent = Number(data.yesterdayVisits || 0).toLocaleString();
    document.getElementById("statTotalVisits").textContent = Number(data.totalVisits || 0).toLocaleString();
    document.getElementById("statActiveUsers").textContent = Number(data.activeUsers || 0).toLocaleString();
    document.getElementById("statTotalContents").textContent = Number(data.totalContents || 0).toLocaleString();
    document.getElementById("statTotalCategories").textContent = Number(data.totalCategories || 0).toLocaleString();
  } catch (err) {
    console.error("대시보드 통계 불러오기 실패:", err);
  }
}

// 2. Chart.js 시각화 차트
async function renderVisitChart() {
  const ctx = document.getElementById("visitChart")?.getContext("2d");
  if (!ctx) return;

  // 기본 더미 또는 API 연동 데이터
  const labels = ["6일 전", "5일 전", "4일 전", "3일 전", "2일 전", "어제", "오늘"];
  const visitsData = [120, 190, 300, 250, 220, 310, 450];

  new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "일별 방문자 수",
        data: visitsData,
        borderColor: "#e50914",
        backgroundColor: "rgba(229, 9, 20, 0.1)",
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: "#ffffff" } }
      },
      scales: {
        x: { ticks: { color: "#8a8d9b" }, grid: { color: "#2a2b30" } },
        y: { ticks: { color: "#8a8d9b" }, grid: { color: "#2a2b30" } }
      }
    }
  });
}

// 3. 최근 등록 콘텐츠 (XSS 방어 textContent)
async function loadRecentContents() {
  const tbody = document.getElementById("recentContentsBody");
  if (!tbody) return;

  try {
    const res = await fetch(`${CONFIG.API_BASE_URL}/contents/recent`, {
      method: "GET",
      headers: getAuthHeaders()
    });
    if (!res.ok) return;

    const items = await res.json();
    tbody.innerHTML = "";

    items.forEach(item => {
      const tr = document.createElement("tr");

      const tdTitle = document.createElement("td");
      tdTitle.textContent = item.title;

      const tdDate = document.createElement("td");
      tdDate.textContent = item.createdAt;

      tr.appendChild(tdTitle);
      tr.appendChild(tdDate);
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("최근 콘텐츠 로드 실패:", err);
  }
}

// 4. 최근 관리자 활동 (XSS 방어 textContent)
async function loadRecentLogs() {
  const tbody = document.getElementById("recentLogsBody");
  if (!tbody) return;

  try {
    const res = await fetch(`${CONFIG.API_BASE_URL}/logs/recent`, {
      method: "GET",
      headers: getAuthHeaders()
    });
    if (!res.ok) return;

    const logs = await res.json();
    tbody.innerHTML = "";

    logs.forEach(log => {
      const tr = document.createElement("tr");

      const tdAdmin = document.createElement("td");
      tdAdmin.textContent = log.adminName;

      const tdAction = document.createElement("td");
      tdAction.textContent = log.action;

      const tdTime = document.createElement("td");
      tdTime.textContent = log.timestamp;

      tr.appendChild(tdAdmin);
      tr.appendChild(tdAction);
      tr.appendChild(tdTime);
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("최근 로그 로드 실패:", err);
  }
}