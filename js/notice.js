import { supabase } from './config.js';

// DOM Elements
const noticeTableBody = document.getElementById('noticeTableBody');
const noticeBadge = document.getElementById('noticeBadge');
const categoryFilter = document.getElementById('categoryFilter');
const pinnedFilter = document.getElementById('pinnedFilter');
const searchInput = document.getElementById('searchInput');

// Stat Elements
const statTotal = document.getElementById('statTotal');
const statPinned = document.getElementById('statPinned');
const statScheduled = document.getElementById('statScheduled');
const statViews = document.getElementById('statViews');

// Modal Elements
const noticeModal = document.getElementById('noticeModal');
const openNoticeModalBtn = document.getElementById('openNoticeModalBtn');
const closeNoticeModalBtn = document.getElementById('closeNoticeModalBtn');
const cancelNoticeModalBtn = document.getElementById('cancelNoticeModalBtn');
const noticeForm = document.getElementById('noticeForm');
const modalTitle = document.getElementById('modalTitle');

const noticeIdEl = document.getElementById('noticeId');
const noticeCategoryInput = document.getElementById('noticeCategoryInput');
const noticeTargetInput = document.getElementById('noticeTargetInput');
const noticePinnedInput = document.getElementById('noticePinnedInput');
const noticePopupInput = document.getElementById('noticePopupInput');
const noticeTitleInput = document.getElementById('noticeTitleInput');
const noticePublishAtInput = document.getElementById('noticePublishAtInput');
const noticeContentInput = document.getElementById('noticeContentInput');

// 템플릿 버튼
const tmplMaintenanceBtn = document.getElementById('tmplMaintenanceBtn');
const tmplEventBtn = document.getElementById('tmplEventBtn');
const tmplUpdateBtn = document.getElementById('tmplUpdateBtn');

// 풍부한 고퀄리티 초기 샘플 데이터
let memoryNotices = [
  {
    id: '1',
    category: 'maintenance',
    target: 'all',
    title: '[정기점검] 2026년 8월 20일 데이터베이스 최적화 및 서버 점검 안내',
    content: '안녕하세요. SUPREME 운영팀입니다.\n\n안정적인 서비스 환경을 위하여 아래와 같이 시스템 점검을 실시합니다.\n\n■ 점검 일시: 2026년 8월 20일(목) 02:00 ~ 06:00 (총 4시간)\n■ 점검 영향: 점검 시간 중 OTT 서비스 이용 중단\n\n더욱 원활한 서비스를 제공하겠습니다. 감사합니다.',
    is_pinned: true,
    is_popup: true,
    publish_at: '2026-08-14T00:00:00',
    views: 3410,
    created_at: '2026-08-14T09:00:00Z'
  },
  {
    id: '2',
    category: 'event',
    target: 'premium',
    title: '[VIP 전용] 프리미엄 멤버십 회원 대상 신작 독점 시사회 초대 이벤트',
    content: 'SUPREME 프리미엄 회원님을 위한 특별한 혜택!\n올가을 기대작 [더 슈프림] 독점 시사회 티켓 이벤트에 응모하세요.',
    is_pinned: true,
    is_popup: false,
    publish_at: '2026-08-10T12:00:00',
    views: 8920,
    created_at: '2026-08-10T14:30:00Z'
  },
  {
    id: '3',
    category: 'update',
    target: 'all',
    title: '[업데이트] 플레이어 4K Ultra HD 및 Dolby Atmos 사운드 지원 시작',
    content: '비디오 플레이어가 더욱 고도화되었습니다.\n스마트 TV 및 PC 웹 플레이어에서 4K Ultra HD 고화질을 즐겨보세요.',
    is_pinned: false,
    is_popup: false,
    publish_at: '2026-08-25T10:00:00', // 예약 게시 샘플
    views: 0,
    created_at: '2026-08-12T11:00:00Z'
  },
  {
    id: '4',
    category: 'system',
    target: 'all',
    title: '[안내] 개인정보 처리방침 및 서비스 이용약관 일부 변경 고지',
    content: '관련 법령 개정에 따라 개인정보 처리방침이 일부 변경될 예정입니다.',
    is_pinned: false,
    is_popup: false,
    publish_at: '2026-08-01T09:00:00',
    views: 1240,
    created_at: '2026-08-01T09:00:00Z'
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

// 렌더링 및 통계 업데이트
function renderNotices() {
  if (!noticeTableBody) return;

  const now = new Date();

  // 상단 KPI 통계 계산
  const totalCount = memoryNotices.length;
  const pinnedCount = memoryNotices.filter(n => n.is_pinned).length;
  const scheduledCount = memoryNotices.filter(n => n.publish_at && new Date(n.publish_at) > now).length;
  const totalViews = memoryNotices.reduce((acc, cur) => acc + (cur.views || 0), 0);

  if (statTotal) statTotal.textContent = `${totalCount}개`;
  if (statPinned) statPinned.textContent = `${pinnedCount}개`;
  if (statScheduled) statScheduled.textContent = `${scheduledCount}개`;
  if (statViews) statViews.textContent = `${totalViews.toLocaleString()}회`;

  // 필터링
  const catVal = categoryFilter ? categoryFilter.value : 'all';
  const pinVal = pinnedFilter ? pinnedFilter.value : 'all';
  const keyword = searchInput ? searchInput.value.toLowerCase().trim() : '';

  let filtered = memoryNotices.filter(item => {
    const matchCat = catVal === 'all' || item.category === catVal;
    
    let matchPin = true;
    if (pinVal === 'pinned') matchPin = item.is_pinned;
    if (pinVal === 'popup') matchPin = item.is_popup;

    const matchKeyword = !keyword || item.title.toLowerCase().includes(keyword) || item.content.toLowerCase().includes(keyword);
    return matchCat && matchPin && matchKeyword;
  });

  if (noticeBadge) noticeBadge.textContent = `전체 ${totalCount}개 (조회된 항목 ${filtered.length}개)`;

  if (filtered.length === 0) {
    noticeTableBody.innerHTML = `
      <tr>
        <td colspan="7" class="py-16 text-center text-zinc-500">
          <i data-lucide="bell-off" class="w-10 h-10 mx-auto mb-2 opacity-30"></i>
          <p class="text-xs font-medium">조건에 해당하거나 등록된 공지사항이 없습니다.</p>
        </td>
      </tr>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  // 상단 고정 우선 정렬
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

  const targetMap = {
    all: { text: '전체 회원', bg: 'text-zinc-400' },
    premium: { text: '💎 프리미엄', bg: 'text-amber-400 font-bold' },
    free: { text: 'FREE 회원', bg: 'text-zinc-500' }
  };

  noticeTableBody.innerHTML = filtered.map(item => {
    const cat = categoryMap[item.category] || { text: '일반', bg: 'bg-zinc-800 text-zinc-300' };
    const tgt = targetMap[item.target] || { text: '전체', bg: 'text-zinc-400' };
    
    // 예약 게시 상태 여부 확인
    const isScheduled = item.publish_at && new Date(item.publish_at) > now;

    return `
      <tr class="hover:bg-zinc-800/40 transition duration-150 ${item.is_pinned ? 'bg-red-950/10' : ''}">
        <!-- 상단 고정 토글 버튼 -->
        <td class="py-4 px-4 text-center">
          <button onclick="togglePin('${item.id}')" title="고정 상태 변경" class="p-1.5 rounded-lg transition ${item.is_pinned ? 'text-red-500 hover:bg-red-500/10' : 'text-zinc-600 hover:text-zinc-300'}">
            <i data-lucide="pin" class="w-4 h-4 ${item.is_pinned ? 'fill-red-500' : ''}"></i>
          </button>
        </td>

        <!-- 카테고리 -->
        <td class="py-4 px-4">
          <span class="px-2.5 py-1 text-[11px] font-bold rounded-lg border ${cat.bg}">
            ${cat.text}
          </span>
        </td>

        <!-- 제목 & 태그 (팝업 연동/예약 게시) -->
        <td class="py-4 px-4">
          <div class="flex items-center gap-2 flex-wrap">
            ${item.is_pinned ? '<span class="bg-red-600 text-white font-black text-[10px] px-2 py-0.5 rounded">고정</span>' : ''}
            ${item.is_popup ? '<span class="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1"><i data-lucide="app-window" class="w-3 h-3"></i> 팝업</span>' : ''}
            ${isScheduled ? '<span class="bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1"><i data-lucide="clock" class="w-3 h-3"></i> 예약</span>' : ''}
            <span class="font-bold text-zinc-100 hover:text-red-400 transition cursor-pointer" onclick="editNotice('${item.id}')">${item.title}</span>
          </div>
        </td>

        <!-- 타겟 회원 -->
        <td class="py-4 px-4 text-center text-xs ${tgt.bg}">
          ${tgt.text}
        </td>

        <!-- 조회수 -->
        <td class="py-4 px-4 text-center font-medium text-zinc-400">
          ${(item.views || 0).toLocaleString()}회
        </td>

        <!-- 게시 일시 -->
        <td class="py-4 px-4 text-center text-zinc-400 text-[11px]">
          ${item.publish_at ? new Date(item.publish_at).toLocaleString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '즉시 공개'}
        </td>

        <!-- 관리 버튼 -->
        <td class="py-4 px-4 text-center">
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

  // 모달 오픈
  openNoticeModalBtn?.addEventListener('click', () => {
    modalTitle.innerHTML = `<i data-lucide="bell" class="w-5 h-5 text-red-500"></i> 새 공지사항 작성`;
    noticeForm.reset();
    noticeIdEl.value = '';
    
    // 기본 발행일시를 현재 시각으로 설정
    const nowLocal = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    noticePublishAtInput.value = nowLocal;

    noticeModal.classList.remove('hidden');
    if (window.lucide) window.lucide.createIcons();
  });

  closeNoticeModalBtn?.addEventListener('click', () => noticeModal.classList.add('hidden'));
  cancelNoticeModalBtn?.addEventListener('click', () => noticeModal.classList.add('hidden'));

  // 💡 [NEW] 기능 4: 서식 템플릿 원클릭 주입 이벤트
  tmplMaintenanceBtn?.addEventListener('click', () => {
    noticeCategoryInput.value = 'maintenance';
    noticeTitleInput.value = '[정기점검] SUPREME 서비스 시스템 점검 및 서버 최적화 안내';
    noticeContentInput.value = `안녕하세요. SUPREME 운영팀입니다.\n\n더욱 안정적인 OTT 스트리밍 환경을 위하여 아래와 같이 시스템 정기 점검을 실시합니다.\n\n■ 점검 일시: 2026년 OO월 OO일(목) 02:00 ~ 06:00 (총 4시간)\n■ 점검 대상: 전 서버 및 결제 시스템\n■ 점검 영향: 점검 시간 동안 VOD 시청 및 서비스 이용 제한\n\n점검 시간 동안 이용에 불편을 드려 죄송합니다.\n더 쾌적한 서비스로 보답하겠습니다. 감사합니다.`;
  });

  tmplEventBtn?.addEventListener('click', () => {
    noticeCategoryInput.value = 'event';
    noticeTitleInput.value = '[이벤트] 2026 한가례 맞이 프리미엄 멤버십 30% 할인 이벤트!';
    noticeContentInput.value = `안녕하세요. SUPREME 회원 여러분!\n\n특별한 시즌을 맞아 혜택 가득한 할인 이벤트를 준비했습니다.\n\n■ 이벤트 기간: 2026.08.20 ~ 2026.08.31\n■ 이벤트 대상: SUPREME 전체 회원\n■ 혜택 내용: 프리미엄 1년 이용권 결제 시 30% 즉시 할인 + 4K HDR 화질 무료 업그레이드\n\n지금 바로 이벤트 페이지에서 할인 쿠폰을 받아보세요!`;
  });

  tmplUpdateBtn?.addEventListener('click', () => {
    noticeCategoryInput.value = 'update';
    noticeTitleInput.value = '[업데이트] 비디오 플레이어 신규 기능 업데이트 안내';
    noticeContentInput.value = `안녕하세요. SUPREME입니다.\n\n회원 여러분의 더욱 편안한 감상을 위해 신규 기능이 추가되었습니다.\n\n1. 2.0배속 배속 재생 기능 추가\n2. 오프라인 다운로드 재생 기능 최적화\n3. 자막 글꼴 및 크기 조절 기능 업그레이드\n\n지금 앱을 최신 버전으로 업데이트하고 새로워진 SUPREME을 경험해 보세요!`;
  });

  // 폼 저장
  noticeForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = noticeIdEl.value;

    const newItem = {
      category: noticeCategoryInput.value,
      target: noticeTargetInput.value,
      is_pinned: noticePinnedInput.checked,
      is_popup: noticePopupInput.checked,
      title: noticeTitleInput.value,
      publish_at: noticePublishAtInput.value || new Date().toISOString(),
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
  noticeTargetInput.value = item.target || 'all';
  noticePinnedInput.checked = !!item.is_pinned;
  noticePopupInput.checked = !!item.is_popup;
  noticeTitleInput.value = item.title;
  noticePublishAtInput.value = item.publish_at ? item.publish_at.slice(0, 16) : '';
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