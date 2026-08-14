import { supabase } from './config.js';

// DOM Elements
const noticeTableBody = document.getElementById('noticeTableBody');
const noticeBadge = document.getElementById('noticeBadge');
const categoryFilter = document.getElementById('categoryFilter');
const pinnedFilter = document.getElementById('pinnedFilter');
const searchInput = document.getElementById('searchInput');

// Modal Elements
const noticeModal = document.getElementById('noticeModal');
const openNoticeModalBtn = document.getElementById('openNoticeModalBtn');
const closeNoticeModalBtn = document.getElementById('closeNoticeModalBtn');
const cancelNoticeModalBtn = document.getElementById('cancelNoticeModalBtn');
const noticeForm = document.getElementById('noticeForm');
const modalTitle = document.getElementById('modalTitle');

const noticeIdEl = document.getElementById('noticeId');
const noticeCategoryInput = document.getElementById('noticeCategoryInput');
const noticePinnedInput = document.getElementById('noticePinnedInput');
const noticeTitleInput = document.getElementById('noticeTitleInput');
const noticeContentInput = document.getElementById('noticeContentInput');

// 샘플 공지사항 데이터
let memoryNotices = [
  {
    id: '1',
    category: 'maintenance',
    title: '[정기점검] 2026년 8월 20일 데이터베이스 점검 및 서버 안정화 작업 안내',
    content: '안녕하세요 SUPREME 서비스팀입니다.\n안정적인 서비스 제공을 위해 정기 점검이 진행될 예정입니다.',
    is_pinned: true,
    views: 1250,
    created_at: '2026-08-14T09:00:00Z'
  },
  {
    id: '2',
    category: 'event',
    title: '[이벤트] 여름 시즌 프리미엄 멤버십 30% 페이백 프로모션 오픈!',
    content: '지금 프리미엄 플랜을 결제하시면 30% 포인트를 즉시 적립해 드립니다.',
    is_pinned: true,
    views: 4320,
    created_at: '2026-08-10T14:30:00Z'
  },
  {
    id: '3',
    category: 'update',
    title: '[업데이트] 플레이어 배속 조절 기능 및 HDR 4K 화질 옵션 추가',
    content: '비디오 플레이어 성능이 대폭 향상되었습니다. 2.0배속 재생 및 HDR 모드를 경험해보세요.',
    is_pinned: false,
    views: 890,
    created_at: '2026-08-05T11:00:00Z'
  },
  {
    id: '4',
    category: 'system',
    title: '[안내] 개인정보 처리방침 변경 건 사전 고지',
    content: '개인정보 보호법 개정에 따라 약관 내용이 일부 변경됩니다.',
    is_pinned: false,
    views: 310,
    created_at: '2026-07-28T16:00:00Z'
  }
];

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) window.lucide.createIcons();
  fetchNotices();
  setupEvents();
});

// 데이터 조회
async function fetchNotices() {
  let list = memoryNotices;

  try {
    if (supabase && supabase.from) {
      const { data, error } = await supabase.from('notices').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        list = data;
        memoryNotices = data;
      }
    }
  } catch (e) {
    console.log('기본 데이터 로드');
  }

  renderNotices();
}

// 렌더링 함수
function renderNotices() {
  if (!noticeTableBody) return;

  const catVal = categoryFilter ? categoryFilter.value : 'all';
  const pinVal = pinnedFilter ? pinnedFilter.value : 'all';
  const keyword = searchInput ? searchInput.value.toLowerCase().trim() : '';

  let filtered = memoryNotices.filter(item => {
    const matchCat = catVal === 'all' || item.category === catVal;
    const matchPin = pinVal === 'all' || (pinVal === 'pinned' && item.is_pinned);
    const matchKeyword = !keyword || item.title.toLowerCase().includes(keyword) || item.content.toLowerCase().includes(keyword);
    return matchCat && matchPin && matchKeyword;
  });

  if (noticeBadge) noticeBadge.textContent = `전체 ${memoryNotices.length}개 (검색 결과 ${filtered.length}개)`;

  if (filtered.length === 0) {
    noticeTableBody.innerHTML = `
      <tr>
        <td colspan="6" class="py-16 text-center text-zinc-500">
          <i data-lucide="bell-off" class="w-10 h-10 mx-auto mb-2 opacity-30"></i>
          <p class="text-xs">등록되었거나 조건에 맞는 공지사항이 없습니다.</p>
        </td>
      </tr>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  // 상단 고정글 우선 정렬 후 최신순
  filtered.sort((a, b) => {
    if (a.is_pinned !== b.is_pinned) return b.is_pinned ? 1 : -1;
    return new Date(b.created_at) - new Date(a.created_at);
  });

  const categoryMap = {
    system: { text: '시스템', bg: 'bg-zinc-800 text-zinc-300 border-zinc-700' },
    event: { text: '이벤트', bg: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
    maintenance: { text: '점검공지', bg: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
    update: { text: '업데이트', bg: 'bg-blue-500/20 text-blue-400 border-blue-500/30' }
  };

  noticeTableBody.innerHTML = filtered.map(item => {
    const cat = categoryMap[item.category] || { text: '일반', bg: 'bg-zinc-800 text-zinc-300' };

    return `
      <tr class="hover:bg-zinc-800/40 transition duration-150 ${item.is_pinned ? 'bg-red-950/10' : ''}">
        <!-- 상단 고정 토글 버튼 -->
        <td class="py-4 px-5 text-center">
          <button onclick="togglePin('${item.id}')" title="고정 상태 변경" class="p-1.5 rounded-lg transition ${item.is_pinned ? 'text-red-500 hover:bg-red-500/10' : 'text-zinc-600 hover:text-zinc-300'}">
            <i data-lucide="pin" class="w-4 h-4 ${item.is_pinned ? 'fill-red-500' : ''}"></i>
          </button>
        </td>

        <!-- 카테고리 -->
        <td class="py-4 px-5">
          <span class="px-2.5 py-1 text-[11px] font-bold rounded-lg border ${cat.bg}">
            ${cat.text}
          </span>
        </td>

        <!-- 제목 및 고정 아이콘 -->
        <td class="py-4 px-5">
          <div class="flex items-center gap-2">
            ${item.is_pinned ? '<span class="bg-red-600 text-white font-black text-[10px] px-2 py-0.5 rounded">중요</span>' : ''}
            <span class="font-bold text-zinc-100 hover:text-red-400 transition cursor-pointer" onclick="editNotice('${item.id}')">${item.title}</span>
          </div>
        </td>

        <!-- 조회수 -->
        <td class="py-4 px-5 text-center font-medium text-zinc-400">
          ${(item.views || 0).toLocaleString()}회
        </td>

        <!-- 등록일 -->
        <td class="py-4 px-5 text-center text-zinc-500 text-[11px]">
          ${new Date(item.created_at || Date.now()).toLocaleDateString('ko-KR')}
        </td>

        <!-- 관리 버튼 -->
        <td class="py-4 px-5 text-center">
          <div class="flex justify-center gap-1.5">
            <button onclick="editNotice('${item.id}')" class="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition" title="수정">
              <i data-lucide="edit-2" class="w-3.5 h-3.5"></i>
            </button>
            <button onclick="deleteNotice('${item.id}')" class="p-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-400 rounded-lg transition" title="삭제">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  if (window.lucide) window.lucide.createIcons();
}

// 이벤트 설정
function setupEvents() {
  categoryFilter?.addEventListener('change', renderNotices);
  pinnedFilter?.addEventListener('change', renderNotices);
  searchInput?.addEventListener('input', renderNotices);

  // 모달 제어
  openNoticeModalBtn?.addEventListener('click', () => {
    modalTitle.innerHTML = `<i data-lucide="bell" class="w-5 h-5 text-red-500"></i> 새 공지사항 작성`;
    noticeForm.reset();
    noticeIdEl.value = '';
    noticeModal.classList.remove('hidden');
    if (window.lucide) window.lucide.createIcons();
  });

  closeNoticeModalBtn?.addEventListener('click', () => noticeModal.classList.add('hidden'));
  cancelNoticeModalBtn?.addEventListener('click', () => noticeModal.classList.add('hidden'));

  // 폼 저장
  noticeForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = noticeIdEl.value;

    const newItem = {
      category: noticeCategoryInput.value,
      is_pinned: noticePinnedInput.checked,
      title: noticeTitleInput.value,
      content: noticeContentInput.value,
      views: id ? (memoryNotices.find(n => n.id == id)?.views || 0) : 0,
      created_at: new Date().toISOString()
    };

    if (id) {
      const idx = memoryNotices.findIndex(n => n.id == id);
      if (idx !== -1) memoryNotices[idx] = { ...memoryNotices[idx], ...newItem };
    } else {
      newItem.id = Date.now().toString();
      memoryNotices.push(newItem);
    }

    try {
      if (supabase && supabase.from) {
        if (id) await supabase.from('notices').update(newItem).eq('id', id);
        else await supabase.from('notices').insert([newItem]);
      }
    } catch(e) {}

    noticeModal.classList.add('hidden');
    renderNotices();
  });
}

// 상단 고정 토글
window.togglePin = async (id) => {
  const item = memoryNotices.find(n => n.id == id);
  if (!item) return;

  item.is_pinned = !item.is_pinned;

  try {
    if (supabase && supabase.from) {
      await supabase.from('notices').update({ is_pinned: item.is_pinned }).eq('id', id);
    }
  } catch(e) {}

  renderNotices();
};

// 수정
window.editNotice = (id) => {
  const item = memoryNotices.find(n => n.id == id);
  if (!item) return;

  noticeIdEl.value = item.id;
  noticeCategoryInput.value = item.category || 'system';
  noticePinnedInput.checked = !!item.is_pinned;
  noticeTitleInput.value = item.title;
  noticeContentInput.value = item.content;

  modalTitle.innerHTML = `<i data-lucide="edit-3" class="w-5 h-5 text-red-500"></i> 공지사항 수정`;
  noticeModal.classList.remove('hidden');
  if (window.lucide) window.lucide.createIcons();
};

// 삭제
window.deleteNotice = async (id) => {
  if (!confirm('이 공지사항을 삭제하시겠습니까?')) return;

  memoryNotices = memoryNotices.filter(n => n.id != id);

  try {
    if (supabase && supabase.from) {
      await supabase.from('notices').delete().eq('id', id);
    }
  } catch(e) {}

  renderNotices();
};