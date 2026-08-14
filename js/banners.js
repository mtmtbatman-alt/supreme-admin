import { supabase } from './config.js';

// DOM Elements
const bannerGrid = document.getElementById('bannerGrid');
const bannerBadge = document.getElementById('bannerBadge');

// Modal Elements
const bannerModal = document.getElementById('bannerModal');
const openBannerModalBtn = document.getElementById('openBannerModalBtn');
const closeBannerModalBtn = document.getElementById('closeBannerModalBtn');
const cancelBannerModalBtn = document.getElementById('cancelBannerModalBtn');
const bannerForm = document.getElementById('bannerForm');
const modalTitle = document.getElementById('modalTitle');

const bannerIdEl = document.getElementById('bannerId');
const bannerTitleInput = document.getElementById('bannerTitleInput');
const bannerImageUrlInput = document.getElementById('bannerImageUrlInput');
const bannerImagePreview = document.getElementById('bannerImagePreview');
const bannerLinkInput = document.getElementById('bannerLinkInput');
const bannerOrderInput = document.getElementById('bannerOrderInput');
const bannerStatusInput = document.getElementById('bannerStatusInput');

// 기본 샘플 데이터셋
let memoryBanners = [
  {
    id: '1',
    title: '오징어 게임 시즌2 전 세계 최초 독점 공개',
    image_url: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&auto=format&fit=crop&q=80',
    link_url: '/content/1',
    sort_order: 1,
    status: 'active',
    created_at: '2026-08-14T10:00:00Z'
  },
  {
    id: '2',
    title: '신규 가입자 한정 1개월 50% 할인 프로모션',
    image_url: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&auto=format&fit=crop&q=80',
    link_url: '/event/discount',
    sort_order: 2,
    status: 'active',
    created_at: '2026-08-13T11:20:00Z'
  },
  {
    id: '3',
    title: '올여름을 책임질 대작 블록버스터 영화 모음전',
    image_url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80',
    link_url: '/collection/summer',
    sort_order: 3,
    status: 'inactive',
    created_at: '2026-08-10T15:00:00Z'
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
    console.log('기본 배너 데이터 로드');
  }

  renderBanners(list);
}

// 배너 카드 그리드 렌더링
function renderBanners(dataList) {
  if (!bannerGrid) return;

  const activeCount = dataList.filter(b => b.status === 'active').length;
  if (bannerBadge) bannerBadge.textContent = `활성 ${activeCount} / 전체 ${dataList.length}개`;

  if (dataList.length === 0) {
    bannerGrid.innerHTML = `
      <div class="col-span-full py-16 text-center text-zinc-500">
        <i data-lucide="image-off" class="w-12 h-12 mx-auto mb-3 opacity-30"></i>
        <p class="text-sm">등록된 프로모션 배너가 없습니다.</p>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  // 순서대로 정렬
  dataList.sort((a, b) => (a.sort_order || 99) - (b.sort_order || 99));

  bannerGrid.innerHTML = dataList.map(item => {
    const defaultImg = 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&auto=format&fit=crop&q=80';
    const isActive = item.status === 'active';

    return `
      <div class="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl hover:border-zinc-700 transition flex flex-col justify-between group">
        <div>
          <!-- 상단 이미지 스팟 -->
          <div class="relative h-44 bg-zinc-950 overflow-hidden">
            <img src="${item.image_url || defaultImg}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" onerror="this.src='${defaultImg}'">
            <div class="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-black/40"></div>
            
            <!-- 순서 뱃지 -->
            <span class="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white font-black text-xs px-2.5 py-1 rounded-lg border border-white/10">
              NO. ${item.sort_order || 1}
            </span>

            <!-- 토글 스위치 뱃지 -->
            <button onclick="toggleBannerStatus('${item.id}')" class="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold backdrop-blur-md border transition ${isActive ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30' : 'bg-zinc-800/80 text-zinc-400 border-zinc-700 hover:bg-zinc-700'}">
              <span class="w-2 h-2 rounded-full ${isActive ? 'bg-emerald-400 animate-ping' : 'bg-zinc-500'}"></span>
              ${isActive ? '노출 중' : '숨김'}
            </button>
          </div>

          <!-- 설명 영역 -->
          <div class="p-5">
            <h4 class="font-bold text-white text-base leading-snug group-hover:text-red-400 transition">${item.title}</h4>
            <p class="text-xs text-zinc-400 mt-2 flex items-center gap-1.5">
              <i data-lucide="link" class="w-3.5 h-3.5 text-zinc-500"></i> ${item.link_url || '연결 링크 없음'}
            </p>
          </div>
        </div>

        <!-- 하단 액션 버튼 -->
        <div class="px-5 py-3 bg-zinc-950/60 border-t border-zinc-800/80 flex justify-between items-center text-xs">
          <span class="text-zinc-500 text-[11px]">등록: ${new Date(item.created_at || Date.now()).toLocaleDateString('ko-KR')}</span>
          <div class="flex gap-2">
            <button onclick="editBanner('${item.id}')" class="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg transition font-medium">수정</button>
            <button onclick="deleteBanner('${item.id}')" class="px-3 py-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-400 rounded-lg transition font-medium">삭제</button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  if (window.lucide) window.lucide.createIcons();
}

// 이벤트 핸들러
function setupEvents() {
  bannerImageUrlInput?.addEventListener('input', (e) => {
    bannerImagePreview.src = e.target.value || 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&auto=format&fit=crop&q=80';
  });

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

  // 폼 제출
  bannerForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = bannerIdEl.value;

    const newItem = {
      title: bannerTitleInput.value,
      image_url: bannerImageUrlInput.value,
      link_url: bannerLinkInput.value || '#',
      sort_order: parseInt(bannerOrderInput.value) || 1,
      status: bannerStatusInput.value,
      created_at: new Date().toISOString()
    };

    if (id) {
      const index = memoryBanners.findIndex(b => b.id == id);
      if (index !== -1) memoryBanners[index] = { ...memoryBanners[index], ...newItem };
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
    renderBanners(memoryBanners);
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

  renderBanners(memoryBanners);
};

// 수정
window.editBanner = (id) => {
  const item = memoryBanners.find(b => b.id == id);
  if (!item) return;

  bannerIdEl.value = item.id;
  bannerTitleInput.value = item.title;
  bannerImageUrlInput.value = item.image_url;
  bannerImagePreview.src = item.image_url;
  bannerLinkInput.value = item.link_url || '';
  bannerOrderInput.value = item.sort_order || 1;
  bannerStatusInput.value = item.status || 'active';

  modalTitle.innerHTML = `<i data-lucide="edit-3" class="w-5 h-5 text-red-500"></i> 배너 수정`;
  bannerModal.classList.remove('hidden');
  if (window.lucide) window.lucide.createIcons();
};

// 삭제
window.deleteBanner = async (id) => {
  if (!confirm('이 배너를 완전히 삭제하시겠습니까?')) return;

  memoryBanners = memoryBanners.filter(b => b.id != id);

  try {
    if (supabase && supabase.from) {
      await supabase.from('banners').delete().eq('id', id);
    }
  } catch(e) {}

  renderBanners(memoryBanners);
};