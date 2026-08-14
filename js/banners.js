import { supabase } from './config.js';

let banners = [
  {
    id: '1',
    title: '[메인 독점] 극장판 어벤져스: 시크릿 워즈 메인 프로모션',
    image_url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&auto=format&fit=crop',
    link_url: '/content/avengers',
    display_order: 1,
    is_active: true,
    impressions: 48500,
    clicks: 6200
  },
  {
    id: '2',
    title: '[이벤트] 신규 가입자 한정 첫 달 100원 스트리밍 혜택',
    image_url: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=1200&auto=format&fit=crop',
    link_url: '/event/welcome',
    display_order: 2,
    is_active: true,
    impressions: 32100,
    clicks: 4120
  },
  {
    id: '3',
    title: '[오리지널] 사이버펑크 2077 애니메이션 시즌2 메인 배너',
    image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop',
    link_url: '/content/cyberpunk',
    display_order: 3,
    is_active: false,
    impressions: 15400,
    clicks: 980
  }
];

const bannerGrid = document.getElementById('bannerGrid');
const statTotalBanners = document.getElementById('statTotalBanners');
const statActiveBanners = document.getElementById('statActiveBanners');
const statTotalImp = document.getElementById('statTotalImp');
const statAvgCtr = document.getElementById('statAvgCtr');
const bannerBadge = document.getElementById('bannerBadge');

const bannerModal = document.getElementById('bannerModal');
const openBannerModalBtn = document.getElementById('openBannerModalBtn');
const closeBannerModalBtn = document.getElementById('closeBannerModalBtn');
const cancelBannerModalBtn = document.getElementById('cancelBannerModalBtn');
const bannerForm = document.getElementById('bannerForm');
const bannerModalTitle = document.getElementById('bannerModalTitle');

const bannerIdEl = document.getElementById('bannerId');
const bannerTitleInput = document.getElementById('bannerTitleInput');
const bannerImageUrlInput = document.getElementById('bannerImageUrlInput');
const bannerLinkInput = document.getElementById('bannerLinkInput');
const bannerOrderInput = document.getElementById('bannerOrderInput');
const bannerActiveInput = document.getElementById('bannerActiveInput');

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) window.lucide.createIcons();
  fetchBanners();
  setupEvents();
});

async function fetchBanners() {
  try {
    if (supabase && supabase.from) {
      const { data, error } = await supabase.from('banners').select('*').order('display_order', { ascending: true });
      if (!error && data && data.length > 0) banners = data;
    }
  } catch (e) {}
  renderBanners();
}

function renderBanners() {
  const activeCount = banners.filter(b => b.is_active).length;
  const totalImp = banners.reduce((acc, b) => acc + (b.impressions || 0), 0);
  const totalClicks = banners.reduce((acc, b) => acc + (b.clicks || 0), 0);
  const avgCtr = totalImp > 0 ? ((totalClicks / totalImp) * 100).toFixed(1) : 0;

  if (statTotalBanners) statTotalBanners.textContent = `${banners.length}개`;
  if (statActiveBanners) statActiveBanners.textContent = `${activeCount}개`;
  if (statTotalImp) statTotalImp.textContent = totalImp.toLocaleString();
  if (statAvgCtr) statAvgCtr.textContent = `${avgCtr}%`;
  if (bannerBadge) bannerBadge.textContent = `활성 ${activeCount}개 / 전체 ${banners.length}개`;

  banners.sort((a, b) => a.display_order - b.display_order);

  bannerGrid.innerHTML = banners.map(b => {
    const ctr = b.impressions > 0 ? ((b.clicks / b.impressions) * 100).toFixed(1) : 0;
    return `
      <div class="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col group hover:border-zinc-700 transition">
        <div class="relative h-44 overflow-hidden bg-zinc-950">
          <img src="${b.image_url}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt="${b.title}">
          <div class="absolute top-3 left-3 flex gap-2">
            <span class="bg-black/70 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-1 rounded-lg border border-white/10">
              순서 #${b.display_order}
            </span>
            <span class="${b.is_active ? 'bg-emerald-500/80 text-white' : 'bg-zinc-800 text-zinc-400'} text-[10px] font-bold px-2.5 py-1 rounded-lg backdrop-blur-md">
              ${b.is_active ? '🟢 노출 중' : '⚪ 비활성'}
            </span>
          </div>
        </div>
        <div class="p-5 flex-1 flex flex-col justify-between">
          <div>
            <h4 class="font-bold text-sm text-white line-clamp-1 mb-1">${b.title}</h4>
            <p class="text-[11px] text-zinc-500 truncate mb-4"><i data-lucide="link" class="w-3 h-3 inline mr-1"></i>${b.link_url || '링크 없음'}</p>
            <div class="grid grid-cols-3 gap-2 bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-800/80 text-center mb-4">
              <div>
                <span class="text-[10px] text-zinc-500 block">노출수</span>
                <span class="text-xs font-bold text-zinc-300">${(b.impressions || 0).toLocaleString()}</span>
              </div>
              <div>
                <span class="text-[10px] text-zinc-500 block">클릭수</span>
                <span class="text-xs font-bold text-zinc-300">${(b.clicks || 0).toLocaleString()}</span>
              </div>
              <div>
                <span class="text-[10px] text-zinc-500 block">CTR</span>
                <span class="text-xs font-bold text-amber-400">${ctr}%</span>
              </div>
            </div>
          </div>
          <div class="flex items-center justify-between pt-3 border-t border-zinc-800/80">
            <button onclick="toggleBannerActive('${b.id}')" class="text-xs text-zinc-400 hover:text-white font-medium transition">
              ${b.is_active ? '비활성화하기' : '활성화하기'}
            </button>
            <div class="flex gap-2">
              <button onclick="editBanner('${b.id}')" class="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl transition"><i data-lucide="edit-2" class="w-3.5 h-3.5"></i></button>
              <button onclick="deleteBanner('${b.id}')" class="p-2 bg-red-950/40 hover:bg-red-900/60 text-red-400 rounded-xl transition"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i></button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  if (window.lucide) window.lucide.createIcons();
}

function setupEvents() {
  openBannerModalBtn?.addEventListener('click', () => {
    bannerModalTitle.innerHTML = `<i data-lucide="image" class="w-5 h-5 text-red-500"></i> 새 배너 등록`;
    bannerForm.reset();
    bannerIdEl.value = '';
    bannerModal.classList.remove('hidden');
    if (window.lucide) window.lucide.createIcons();
  });

  closeBannerModalBtn?.addEventListener('click', () => bannerModal.classList.add('hidden'));
  cancelBannerModalBtn?.addEventListener('click', () => bannerModal.classList.add('hidden'));

  bannerForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = bannerIdEl.value;
    const newItem = {
      title: bannerTitleInput.value,
      image_url: bannerImageUrlInput.value,
      link_url: bannerLinkInput.value,
      display_order: parseInt(bannerOrderInput.value) || 1,
      is_active: bannerActiveInput.checked,
      impressions: id ? (banners.find(b => b.id == id)?.impressions || 0) : 0,
      clicks: id ? (banners.find(b => b.id == id)?.clicks || 0) : 0
    };

    if (id) {
      const idx = banners.findIndex(b => b.id == id);
      if (idx !== -1) banners[idx] = { ...banners[idx], ...newItem };
    } else {
      newItem.id = Date.now().toString();
      banners.push(newItem);
    }

    bannerModal.classList.add('hidden');
    renderBanners();
  });
}

window.toggleBannerActive = (id) => {
  const b = banners.find(item => item.id == id);
  if (b) { b.is_active = !b.is_active; renderBanners(); }
};

window.editBanner = (id) => {
  const b = banners.find(item => item.id == id);
  if (!b) return;

  bannerIdEl.value = b.id;
  bannerTitleInput.value = b.title;
  bannerImageUrlInput.value = b.image_url;
  bannerLinkInput.value = b.link_url || '';
  bannerOrderInput.value = b.display_order;
  bannerActiveInput.checked = !!b.is_active;

  bannerModalTitle.innerHTML = `<i data-lucide="edit-3" class="w-5 h-5 text-red-500"></i> 배너 수정`;
  bannerModal.classList.remove('hidden');
  if (window.lucide) window.lucide.createIcons();
};

window.deleteBanner = (id) => {
  if (confirm('배너를 삭제하시겠습니까?')) {
    banners = banners.filter(b => b.id != id);
    renderBanners();
  }
};