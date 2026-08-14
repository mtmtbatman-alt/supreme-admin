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
});

// 통계 데이터 로드
async function loadStats() {
  try {
    if (supabase && supabase.from) {
      const { count: contentCount } = await supabase.from('contents').select('*', { count: 'exact', head: true });
      if (totalContentEl && contentCount !== null) totalContentEl.textContent = contentCount;

      const { count: bannerCount } = await supabase.from('banners').select('*', { count: 'exact', head: true });
      if (activeBannersEl && bannerCount !== null) activeBannersEl.textContent = bannerCount;

      const { count: noticeCount } = await supabase.from('notices').select('*', { count: 'exact', head: true });
      if (activeNoticesEl && noticeCount !== null) activeNoticesEl.textContent = noticeCount;
    }
  } catch (err) {
    console.log('기본 통계 값 유지');
  }
}

// 활동 로그 로드
async function loadRecentLogs() {
  if (!recentLogsTable) return;

  try {
    if (supabase && supabase.from) {
      const { data: logs, error } = await supabase
        .from('logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (!error && logs && logs.length > 0) {
        recentLogsTable.innerHTML = logs.map(log => `
          <tr class="border-b border-zinc-800 hover:bg-zinc-800/50 transition">
            <td class="py-3 px-4 text-xs text-zinc-400">${new Date(log.created_at).toLocaleString('ko-KR')}</td>
            <td class="py-3 px-4 text-xs font-semibold text-white">${log.admin_name || '최고관리자'}</td>
            <td class="py-3 px-4 text-xs text-zinc-300">${log.action || '시스템 작업'}</td>
          </tr>
        `).join('');
      }
    }
  } catch (err) {
    console.log('기본 로그 목록 유지');
  }
}