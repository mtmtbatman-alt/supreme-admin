import { supabase } from './config.js';
import { logAdminAction } from './logger.js';
import { logoutAdmin } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
  loadNotices();

  // 검색 및 필터 이벤트
  document.getElementById('searchBtn').addEventListener('click', loadNotices);
  document.getElementById('searchInput').addEventListener('keyup', (e) => {
    if (e.key === 'Enter') loadNotices();
  });
  document.getElementById('resetSearchBtn').addEventListener('click', () => {
    document.getElementById('searchInput').value = '';
    document.getElementById('categoryFilter').value = '';
    loadNotices();
  });
  document.getElementById('categoryFilter').addEventListener('change', loadNotices);

  // 모달 관리
  document.getElementById('openModalBtn').addEventListener('click', () => openModal());
  document.getElementById('closeModalBtn').addEventListener('click', closeModal);
  document.getElementById('noticeForm').addEventListener('submit', handleFormSubmit);

  // 다중 선택 및 삭제
  document.getElementById('selectAllCheckbox').addEventListener('change', toggleSelectAll);
  document.getElementById('deleteSelectedBtn').addEventListener('click', deleteSelectedNotices);

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.addEventListener('click', logoutAdmin);
});

// 공지사항 목록 가져오기
async function loadNotices() {
  const tableBody = document.getElementById('noticeTableBody');
  tableBody.innerHTML = `<tr><td colspan="7" class="p-8 text-center text-zinc-500">데이터를 불러오는 중...</td></tr>`;

  const searchQuery = document.getElementById('searchInput').value.trim();
  const categoryFilter = document.getElementById('categoryFilter').value;

  let query = supabase.from('notices').select('*');

  if (searchQuery) {
    query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
  }

  if (categoryFilter) {
    query = query.eq('category', categoryFilter);
  }

  // 최신순 조회
  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('공지사항 조회 오류:', error.message);
    tableBody.innerHTML = `<tr><td colspan="7" class="p-8 text-center text-red-400">DB 에러: ${escapeHtml(error.message)}</td></tr>`;
    return;
  }

  // JS 상에서 상단 고정 항목을 위로 정렬
  if (data) {
    data.sort((a, b) => (b.is_pinned === true ? 1 : 0) - (a.is_pinned === true ? 1 : 0));
  }

  renderNoticeTable(data);
}

// 공지사항 테이블 UI 렌더링
function renderNoticeTable(notices) {
  const tableBody = document.getElementById('noticeTableBody');

  if (!notices || notices.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="7" class="p-8 text-center text-zinc-500">등록된 공지사항이 없습니다.</td></tr>`;
    return;
  }

  tableBody.innerHTML = notices.map(item => {
    const isPinned = item.is_pinned === true;
    const isActive = item.is_active !== false;
    const dateStr = item.created_at ? new Date(item.created_at).toLocaleDateString() : '-';

    return `
      <tr class="hover:bg-zinc-800/40 transition ${isPinned ? 'bg-red-950/20' : ''}">
        <td class="p-4"><input type="checkbox" value="${item.id}" class="notice-checkbox rounded bg-zinc-800 border-zinc-700"></td>
        <td class="p-4">
          <button onclick="togglePin('${item.id}', ${isPinned})" class="text-base transition hover:scale-125">
            ${isPinned ? '📌' : '📍'}
          </button>
        </td>
        <td class="p-4">
          <span class="text-xs px-2.5 py-1 rounded-full border ${getCategoryStyle(item.category)}">
            ${escapeHtml(item.category || '일반')}
          </span>
        </td>
        <td class="p-4">
          <div class="font-medium text-white cursor-pointer hover:text-red-400 transition" onclick="editNotice('${item.id}')">
            ${escapeHtml(item.title)}
          </div>
        </td>
        <td class="p-4">
          <button onclick="toggleActive('${item.id}', ${isActive})" class="cursor-pointer">
            ${isActive 
              ? `<span class="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">공개</span>` 
              : `<span class="px-2.5 py-1 text-xs font-semibold rounded-full bg-zinc-800 text-zinc-500 border border-zinc-700">비공개</span>`}
          </button>
        </td>
        <td class="p-4 text-xs text-zinc-400">${dateStr}</td>
        <td class="p-4 text-right space-x-2">
          <button onclick="editNotice('${item.id}')" class="text-xs text-zinc-400 hover:text-white transition">수정</button>
          <button onclick="deleteSingleNotice('${item.id}', '${escapeHtml(item.title)}')" class="text-xs text-red-400 hover:text-red-300 transition">삭제</button>
        </td>
      </tr>
    `;
  }).join('');
}

function getCategoryStyle(category) {
  switch (category) {
    case '점검': return 'bg-amber-950 text-amber-400 border-amber-800';
    case '이벤트': return 'bg-purple-950 text-purple-400 border-purple-800';
    case '업데이트': return 'bg-blue-950 text-blue-400 border-blue-800';
    default: return 'bg-zinc-800 text-zinc-300 border-zinc-700';
  }
}

// 고정 상태 토글
window.togglePin = async function(id, currentPinned) {
  const { error } = await supabase.from('notices').update({ is_pinned: !currentPinned }).eq('id', id);
  if (error) return alert('변경 실패: ' + error.message);
  await logAdminAction('공지 상단고정 토글', `ID: ${id}`);
  loadNotices();
};

// 공개/비공개 토글
window.toggleActive = async function(id, currentStatus) {
  const { error } = await supabase.from('notices').update({ is_active: !currentStatus }).eq('id', id);
  if (error) return alert('변경 실패: ' + error.message);
  await logAdminAction('공지 공개여부 토글', `ID: ${id}`);
  loadNotices();
};

// 모달 열기/닫기
function openModal() {
  document.getElementById('noticeId').value = '';
  document.getElementById('titleInput').value = '';
  document.getElementById('contentInput').value = '';
  document.getElementById('categorySelect').value = '일반';
  document.getElementById('isPinnedInput').checked = false;
  document.getElementById('isActiveInput').checked = true;

  document.getElementById('modalTitle').textContent = '신규 공지 작성';
  document.getElementById('noticeModal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('noticeModal').classList.add('hidden');
}

// 등록 & 수정 처리
async function handleFormSubmit(e) {
  e.preventDefault();

  const id = document.getElementById('noticeId').value;
  const title = document.getElementById('titleInput').value.trim();
  const content = document.getElementById('contentInput').value.trim();
  const category = document.getElementById('categorySelect').value;
  const is_pinned = document.getElementById('isPinnedInput').checked;
  const is_active = document.getElementById('isActiveInput').checked;

  const payload = { title, content, category, is_pinned, is_active };

  if (id) {
    const { error } = await supabase.from('notices').update(payload).eq('id', id);
    if (error) {
      alert('수정 실패: ' + error.message);
      return;
    }
    await logAdminAction('공지 수정', `[${title}] 공지사항 수정 완료`);
    alert('수정되었습니다.');
  } else {
    const { error } = await supabase.from('notices').insert([payload]);
    if (error) {
      alert('등록 실패: ' + error.message);
      return;
    }
    await logAdminAction('공지 작성', `[${title}] 신규 공지사항 작성`);
    alert('등록되었습니다.');
  }

  closeModal();
  loadNotices();
}

// 수정 모달 열기
window.editNotice = async function(id) {
  const { data, error } = await supabase.from('notices').select('*').eq('id', id).single();
  if (error || !data) return alert('데이터를 불러올 수 없습니다: ' + (error?.message || ''));

  document.getElementById('noticeId').value = data.id;
  document.getElementById('titleInput').value = data.title;
  document.getElementById('contentInput').value = data.content;
  document.getElementById('categorySelect').value = data.category || '일반';
  document.getElementById('isPinnedInput').checked = data.is_pinned || false;
  document.getElementById('isActiveInput').checked = data.is_active !== false;

  document.getElementById('modalTitle').textContent = '공지사항 수정';
  document.getElementById('noticeModal').classList.remove('hidden');
};

// 단일 삭제
window.deleteSingleNotice = async function(id, title) {
  if (!confirm(`'${title}' 공지를 삭제하시겠습니까?`)) return;

  const { error } = await supabase.from('notices').delete().eq('id', id);
  if (error) return alert('삭제 실패: ' + error.message);
  
  await logAdminAction('공지 삭제', `[${title}] 공지사항 삭제 완료`);
  loadNotices();
};

function toggleSelectAll(e) {
  document.querySelectorAll('.notice-checkbox').forEach(cb => cb.checked = e.target.checked);
}

// 일괄 삭제
async function deleteSelectedNotices() {
  const selectedCbs = Array.from(document.querySelectorAll('.notice-checkbox:checked'));
  if (selectedCbs.length === 0) return alert('삭제할 공지사항을 선택해주세요.');

  if (!confirm(`선택한 ${selectedCbs.length}개 공지를 삭제하시겠습니까?`)) return;

  const ids = selectedCbs.map(cb => cb.value);
  const { error } = await supabase.from('notices').delete().in('id', ids);

  if (error) return alert('삭제 실패: ' + error.message);

  await logAdminAction('공지 다중 삭제', `${ids.length}개 공지 일괄 삭제`);
  alert('삭제되었습니다.');
  loadNotices();
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, match => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[match]));
}