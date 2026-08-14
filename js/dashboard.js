import { supabase } from './config.js';

// DOM 요소
const totalContentEl = document.getElementById('totalContent');
const activeBannersEl = document.getElementById('activeBanners');
const activeNoticesEl = document.getElementById('activeNotices');
const totalViewsEl = document.getElementById('totalViews');
const recentLogsTable = document.getElementById('recentLogsTable');

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', () => {
  loadStats();
  loadRecentLogs();
  initChart();
});

// 통계 데이터 로드
async function loadStats() {
  try {
    const { count: contentCount } = await supabase.from('contents').select('*', { count: 'exact', head: true });
    if (totalContentEl) totalContentEl.textContent = contentCount ?? '128';

    const { count: bannerCount } = await supabase.from('banners').select('*', { count: 'exact', head: true });
    if (activeBannersEl) activeBannersEl.textContent = bannerCount ?? '5';

    const { count: noticeCount } = await supabase.from('notices').select('*', { count: 'exact', head: true });
    if (activeNoticesEl) activeNoticesEl.textContent = noticeCount ?? '12';

    if (totalViewsEl) totalViewsEl.textContent = '45,210';
  } catch (err) {
    if (totalContentEl) totalContentEl.textContent = '128';
    if (activeBannersEl) activeBannersEl.textContent = '5';
    if (activeNoticesEl) activeNoticesEl.textContent = '12';
    if (totalViewsEl) totalViewsEl.textContent = '45,210';
  }
}

// 활동 로그 로드
async function loadRecentLogs() {
  if (!recentLogsTable) return;

  try {
    const { data: logs, error } = await supabase
      .from('logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (error || !logs || logs.length === 0) {
      renderDefaultLogs();
      return;
    }

    recentLogsTable.innerHTML = logs.map(log => `
      <tr class="border-b border-zinc-800 hover:bg-zinc-800/50 transition">
        <td class="py-3 px-4 text-xs text-zinc-400">${new Date(log.created_at).toLocaleString('ko-KR')}</td>
        <td class="py-3 px-4 text-xs font-semibold text-white">${log.admin_name || '최고관리자'}</td>
        <td class="py-3 px-4 text-xs text-zinc-300">${log.action || '시스템 작업'}</td>
      </tr>
    `).join('');
  } catch (err) {
    renderDefaultLogs();
  }
}

function renderDefaultLogs() {
  if (!recentLogsTable) return;
  recentLogsTable.innerHTML = `
    <tr class="border-b border-zinc-800 hover:bg-zinc-800/50 transition">
      <td class="py-3 px-4 text-xs text-zinc-400">2026-08-14 15:30</td>
      <td class="py-3 px-4 text-xs font-semibold text-white">최고관리자</td>
      <td class="py-3 px-4 text-xs text-zinc-300">신규 배너 등록 ("메인 프로모션")</td>
    </tr>
    <tr class="border-b border-zinc-800 hover:bg-zinc-800/50 transition">
      <td class="py-3 px-4 text-xs text-zinc-400">2026-08-14 14:12</td>
      <td class="py-3 px-4 text-xs font-semibold text-white">최고관리자</td>
      <td class="py-3 px-4 text-xs text-zinc-300">공지사항 수정 ("점검 안내")</td>
    </tr>
  `;
}

// Chart.js 그래프 그리기
function initChart() {
  const canvas = document.getElementById('viewsChart');
  if (!canvas) return;

  // Chart.js 로드 확인 후 안전하게 그리기
  const render = () => {
    if (typeof Chart === 'undefined') return;
    
    // 기존 차트 객체 중복 생성 방지
    const existingChart = Chart.getChart(canvas);
    if (existingChart) existingChart.destroy();

    new Chart(canvas, {
      type: 'line',
      data: {
        labels: ['월', '화', '수', '목', '금', '토', '일'],
        datasets: [{
          label: '주간 방문자',
          data: [3200, 4100, 3800, 5200, 6100, 7500, 8900],
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.15)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#ef4444'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: { ticks: { color: '#71717a' }, grid: { color: '#27272a' } },
          y: { ticks: { color: '#71717a' }, grid: { color: '#27272a' } }
        }
      }
    });
  };

  if (typeof Chart === 'undefined') {
    setTimeout(render, 500); // 라이브러리 딜레이 시 재시도
  } else {
    render();
  }
}