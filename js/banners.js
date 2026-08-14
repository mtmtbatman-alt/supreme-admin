import { supabase } from './config.js';

// DOM Elements
const bannerGrid = document.getElementById('bannerGrid');
const bannerBadge = document.getElementById('bannerBadge');
const positionTabs = document.getElementById('positionTabs');
const statusFilter = document.getElementById('statusFilter');

// Modal Elements
const bannerModal = document.getElementById('bannerModal');
const openBannerModalBtn = document.getElementById('openBannerModalBtn');
const closeBannerModalBtn = document.getElementById('closeBannerModalBtn');
const cancelBannerModalBtn = document.getElementById('cancelBannerModalBtn');
const bannerForm = document.getElementById('bannerForm');
const modalTitle = document.getElementById('modalTitle');

const bannerIdEl = document.getElementById('bannerId');
const bannerTitleInput = document.getElementById('bannerTitleInput');
const bannerPositionInput = document.getElementById('bannerPositionInput');
const bannerImageUrlInput = document.getElementById('bannerImageUrlInput');
const bannerImagePreview = document.getElementById('bannerImagePreview');
const bannerLinkInput = document.getElementById('bannerLinkInput');
const bannerOrderInput = document.getElementById('bannerOrderInput');
const bannerStatusInput = document.getElementById('bannerStatusInput');

// 필터 상태
let currentPositionFilter = 'all';
let currentStatusFilter = 'all';

// 풍부한 샘플 데이터셋
let memoryBanners = [
  {
    id: '1',
    title: '오징어 게임 시즌2 전 세계 최초 독점 공개',
    position: 'main_hero',
    image_url: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&auto=format&fit=crop&q=80',
    link_url: '/content/1',
    sort_order: 1,
    status: 'active',
    clicks: 14230,
    created_at: '2026-08-14T10:00:00Z'
  },
  {
    id: '2',
    title: '신규 가입자 한정 1개월 50% 할인 쿠폰 발급',
    position: 'popup',
    image_url: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&auto=format&fit=crop&q=80',
    link_url: '/event/discount',
    sort_order: 1,
    status: 'active',
    clicks: 8940,
    created_at: '2026-08-13T11:20:00Z'
  },
  {
    id: '3',
    title: '올여름을 책임질 대작 SF 블록버스터 특별관',
    position: 'middle_banner',
    image_url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80',
    link_url: '/collection/sf',
    sort_order: 2,
    status: 'active',
    clicks: 3410,
    created_at: '2026-08-10T15:00:00Z'
  },
  {
    id: '4',
    title: '주말 한정 애니메이션 무료 개방 이벤트',
    position: 'main_hero',
    image_url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80',
    link_url: '/event/anime',
    sort_order: 2,
    status: 'inactive',
    clicks: 1120,
    created_at: '2026-08-01T09:00:00Z'
  }
];

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) window.lucide.createIcons();
  fetchBanners();
  setupEvents();
});

// 데이터 조회
async function fetchBanners() {
  let list = memoryBanners;

  try {
    if (supabase && supabase.from) {
      const { data, error } = await supabase.from('banners').select('*').order('sort_order', { ascending: true });
      if (!error && data && data.length > 0) {
        list = data;
        memoryBanners = data;
      }
    }
  } catch (e) {
    console.log('기본 데이터 렌더링');
  }

  renderBanners();
}

// 필터링 및 렌더링
function renderBanners() {
  if (!bannerGrid) return;

  let filtered = memoryBanners.filter(item => {
    const matchPosition = currentPositionFilter === 'all' || item.position === currentPositionFilter;
    const matchStatus = currentStatusFilter === 'all' || item.status === currentStatusFilter;
    return matchPosition && matchStatus;
  });

  const activeCount = memoryBanners.filter(b => b.status === 'active').length;
  if (bannerBadge) bannerBadge.textContent = `노출 중 ${activeCount}개 / 전체 ${memoryBanners.length}개`;

  if (filtered.length === 0) {
    bannerGrid.innerHTML = `
      <div class="col-span-full py-20 text-center text-zinc-500 bg-zinc-900/30 rounded-2xl border border-zinc-800/50">
        <i data-lucide="image-off" class="w-12 h-12 mx-auto mb-3 opacity-30"></i>
        <p class="text-sm font-medium">선택한 위치 및 조건에 해당하는 배너가 없습니다.</p>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  // 순서 정렬
  filtered.sort((a, b) => (a.sort_order || 99) - (b.sort_order || 99));

  bannerGrid.innerHTML = filtered.map(item => {
    const defaultImg = 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&auto=format&fit=crop&q=80';
    const isActive = item.status === 'active';

    // 위치 라벨 맵
    const posMap = {
      'main_hero': { text: '메인 히어로', bg: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
      'middle_banner': { text: '중간 띠배너', bg: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
      'popup': { text: '이벤트 팝업', bg: 'bg-amber-500/20 text-amber-400 border-amber-500/30' }
    };
    const posInfo = posMap[item.position] || { text: '기타 위치', bg: 'bg-zinc-800 text-zinc-300 border-zinc-700' };

    return `
      <div class="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl hover:border-zinc-700 transition duration-300 flex flex-col justify-between group">
        <div>
          <!-- 상단 이미지 스팟 (미리보기 카드) -->
          <div class="relative h-48 bg-zinc-950 overflow-hidden">
            <img src="${item.image_url || defaultImg}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" onerror="this.src='${defaultImg}'">
            <div class="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-black/50"></div>
            
            <!-- 위치 태그 -->
            <span class="absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-lg border backdrop-blur-md ${posInfo.bg}">
              ${posInfo.text}
            </span>

            <!-- 노출 순서 -->
            <span class="absolute top-3 right-14 bg-black/60 backdrop-blur-md text-white font-black text-[11px] px-2 py-1 rounded-md border border-white/10">
              NO.${item.sort_order || 1}
            </span>

            <!-- 노출 토글 버튼 -->
            <button onclick="toggleBannerStatus('${item.id}')" title="상태 변경" class="absolute top-3 right-3 flex items-center justify-center w-8 h-8 rounded-full backdrop-blur-md border transition ${isActive ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/40' : 'bg-zinc-800/90 text-zinc-500 border-zinc-700 hover:text-white'}">
              <span class="w-2.5 h-2.5 rounded-full ${isActive ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-500'}"></span>
            </button>
          </div>

          <!-- 정보 영역 -->
          <div class="p-5">
            <h4 class="font-bold text-white text-base leading-snug group-hover:text-red-400 transition line-clamp-2">${item.title}</h4>
            
            <div class="mt-3 pt-3 border-t border-zinc-800/60 space-y-1.5 text-xs text-zinc-400">
              <p class="flex items-center gap-2 truncate">
                <i data-lucide="link" class="w-3.5 h-3.5 text-zinc-500 shrink-0"></i>
                <span class="truncate hover:text-zinc-200 transition">${item.link_url || '연결 링크 없음'}</span>
              </p>
              <p class="flex items-center gap-2">
                <i data-lucide="mouse-pointer-click" class="w-3.5 h-3.5 text-red-400 shrink-0"></i>
                <span>누적 클릭: <strong class="text-white font-bold">${(item.clicks || 0).toLocaleString()}회</strong></span>
              </p>
            </div>
          </div>
        </div>

        <!-- 하단 액션 버튼 -->
        <div class="px-5 py-3 bg-zinc-950/60 border-t border-zinc-800/80 flex justify-between items-center text-xs">
          <span class="text-zinc-500 text-[11px]">등록: ${new Date(item.created_at || Date.now()).toLocaleDateString('ko-KR')}</span>
          <div class="flex gap-2">
            <button onclick="editBanner('${item.id}')" class="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg transition font-medium flex items-center gap-1">
              <i data-lucide="edit-2" class="w-3 h-3"></i> 수정
            </button>
            <button onclick="deleteBanner('${item.id}')" class="px-3 py-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-400 rounded-lg transition font-medium">삭제</button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  if (window.lucide) window.lucide.createIcons();
}

// 이벤트 리스너 설정
function setupEvents() {
  // 위치 탭 전환
  positionTabs?.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', (e) => {
      positionTabs.querySelectorAll('button').forEach(b => {
        b.className = "px-4 py-2 text-xs font-bold rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition shrink-0";
      });
      e.target.className = "px-4 py-2 text-xs font-bold rounded-xl bg-red-600 text-white transition shrink-0";
      currentPositionFilter = e.target.dataset.position;
      renderBanners();
    });
  });

  // 상태 필터 변경
  statusFilter?.addEventListener('change', (e) => {
    currentStatusFilter = e.target.value;
    renderBanners();
  });

  // 미리보기 실시간 반영
  bannerImageUrlInput?.addEventListener('input', (e) => {
    bannerImagePreview.src = e.target.value || 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&auto=format&fit=crop&q=80';
  });

  // 모달 열기/닫기
  openBannerModalBtn?.addEventListener('click', () => {
    modalTitle.innerHTML = `<i data-lucide="image" class="w-5 h-5 text-red-500"></i> 신규 배너 등록`;
    bannerForm.reset();
    bannerIdEl.value = '';
    bannerImagePreview.src = 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&auto=format&fit=crop&q=80';
    bannerModal.classList.remove('hidden');
    if (window.lucide) window.lucide.createIcons();
  });

  closeBannerModalBtn?.addEventListener('click', () => bannerModal.classList.add('hidden'));
  cancelBannerModalBtn?.addEventListener('click', () => bannerModal.classList.add('hidden'));

  // 폼 저장
  bannerForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = bannerIdEl.value;

    const newItem = {
      title: bannerTitleInput.value,
      position: bannerPositionInput.value,
      image_url: bannerImageUrlInput.value,
      link_url: bannerLinkInput.value || '#',
      sort_order: parseInt(bannerOrderInput.value) || 1,
      status: bannerStatusInput.value,
      clicks: id ? (memoryBanners.find(b => b.id == id)?.clicks || 0) : 0,
      created_at: new Date().toISOString()
    };

    if (id) {
      const idx = memoryBanners.findIndex(b => b.id == id);
      if (idx !== -1) memoryBanners[idx] = { ...memoryBanners[idx], ...newItem };
    } else {
      newItem.id = Date.now().toString();
      memoryBanners.push(newItem);
    }

    try {
      if (supabase && supabase.from) {
        if (id) await supabase.from('banners').update(newItem).eq('id', id);
        else await supabase.from('banners').insert([newItem]);
      }
    } catch(err) {}

    bannerModal.classList.add('hidden');
    renderBanners();
  });
}

// 상태 토글
window.toggleBannerStatus = async (id) => {
  const item = memoryBanners.find(b => b.id == id);
  if (!item) return;

  item.status = item.status === 'active' ? 'inactive' : 'active';

  try {
    if (supabase && supabase.from) {
      await supabase.from('banners').update({ status: item.status }).eq('id', id);
    }
  } catch(e) {}

  renderBanners();
};

// 수정
window.editBanner = (id) => {
  const item = memoryBanners.find(b => b.id == id);
  if (!item) return;

  bannerIdEl.value = item.id;
  bannerTitleInput.value = item.title;
  bannerPositionInput.value = item.position || 'main_hero';
  bannerImageUrlInput.value = item.image_url;
  bannerImagePreview.src = item.image_url;
  bannerLinkInput.value = item.link_url || '';
  bannerOrderInput.value = item.sort_order || 1;
  bannerStatusInput.value = item.status || 'active';

  modalTitle.innerHTML = `<i data-lucide="edit-3" class="w-5 h-5 text-red-500"></i> 배너 정보 수정`;
  bannerModal.classList.remove('hidden');
  if (window.lucide) window.lucide.createIcons();
};

// 삭제
window.deleteBanner = async (id) => {
  if (!confirm('이 배너를 정말 삭제하시겠습니까?')) return;

  memoryBanners = memoryBanners.filter(b => b.id != id);

  try {
    if (supabase && supabase.from) {
      await supabase.from('banners').delete().eq('id', id);
    }
  } catch(e) {}

  renderBanners();
};