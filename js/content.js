import { supabase } from './config.js';

let contents = [
  { id: '1', title: '인터스텔라 2026', type: 'movie', quality: '4K', rating: 9.8, genre: 'SF, 어드벤처', poster_url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop', views: 184000 },
  { id: '2', title: '사이버펑크: 엣지', type: 'anime', quality: '4K', rating: 9.6, genre: '액션, 애니', poster_url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop', views: 92000 },
  { id: '3', title: '다크 나이트 라이지즈', type: 'movie', quality: '4K', rating: 9.7, genre: '범죄, 스릴러', poster_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop', views: 240000 },
  { id: '4', title: '기생충: 더 라이브', type: 'drama', quality: 'FHD', rating: 9.2, genre: '드라마, 스릴러', poster_url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop', views: 110000 }
];

const contentGrid = document.getElementById('contentGrid');
const contentBadge = document.getElementById('contentBadge');
const typeFilter = document.getElementById('typeFilter');
const qualityFilter = document.getElementById('qualityFilter');
const contentSearchInput = document.getElementById('contentSearchInput');

const contentModal = document.getElementById('contentModal');
const openContentModalBtn = document.getElementById('openContentModalBtn');
const closeContentModalBtn = document.getElementById('closeContentModalBtn');
const cancelContentModalBtn = document.getElementById('cancelContentModalBtn');
const contentForm = document.getElementById('contentForm');
const contentModalTitle = document.getElementById('contentModalTitle');

const contentIdEl = document.getElementById('contentId');
const titleInput = document.getElementById('titleInput');
const typeInput = document.getElementById('typeInput');
const qualityInput = document.getElementById('qualityInput');
const posterInput = document.getElementById('posterInput');
const genreInput = document.getElementById('genreInput');
const ratingInput = document.getElementById('ratingInput');
const overviewInput = document.getElementById('overviewInput');

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) window.lucide.createIcons();
  fetchContents();
  setupEvents();
});

async function fetchContents() {
  try {
    if (supabase && supabase.from) {
      const { data, error } = await supabase.from('contents').select('*');
      if (!error && data && data.length > 0) contents = data;
    }
  } catch(e) {}
  renderContents();
}

function renderContents() {
  const typeVal = typeFilter?.value || 'all';
  const qualVal = qualityFilter?.value || 'all';
  const keyword = contentSearchInput?.value.toLowerCase().trim() || '';

  const filtered = contents.filter(c => {
    const matchType = typeVal === 'all' || c.type === typeVal;
    const matchQual = qualVal === 'all' || c.quality === qualVal;
    const matchKw = !keyword || c.title.toLowerCase().includes(keyword) || (c.genre && c.genre.toLowerCase().includes(keyword));
    return matchType && matchQual && matchKw;
  });

  if (contentBadge) contentBadge.textContent = `등록 ${filtered.length}개 / 전체 ${contents.length}개`;

  contentGrid.innerHTML = filtered.map(c => `
    <div class="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden group hover:border-red-600/50 transition duration-300 flex flex-col justify-between">
      <div class="relative aspect-[2/3] bg-zinc-950 overflow-hidden">
        <img src="${c.poster_url}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt="${c.title}">
        <div class="absolute top-2 right-2 bg-black/80 backdrop-blur-md border border-white/10 text-amber-400 font-black text-[11px] px-2 py-0.5 rounded-lg flex items-center gap-1">
          <i data-lucide="star" class="w-3 h-3 fill-amber-400"></i> ${c.rating || '9.0'}
        </div>
        <div class="absolute bottom-2 left-2 flex gap-1">
          <span class="bg-red-600/90 text-white font-black text-[9px] px-2 py-0.5 rounded">${c.quality || '4K'}</span>
        </div>
      </div>
      <div class="p-3 flex-1 flex flex-col justify-between">
        <div>
          <h4 class="font-bold text-xs text-white line-clamp-1 group-hover:text-red-400 transition">${c.title}</h4>
          <p class="text-[10px] text-zinc-500 mt-1">${c.genre || '미지정'}</p>
        </div>
        <div class="flex justify-between items-center pt-3 mt-3 border-t border-zinc-800/80">
          <span class="text-[10px] text-zinc-400"><i data-lucide="eye" class="w-3 h-3 inline mr-1"></i>${(c.views || 0).toLocaleString()}</span>
          <div class="flex gap-1">
            <button onclick="editContent('${c.id}')" class="p-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg"><i data-lucide="edit-2" class="w-3 h-3"></i></button>
            <button onclick="deleteContent('${c.id}')" class="p-1 bg-red-950/40 hover:bg-red-900/60 text-red-400 rounded-lg"><i data-lucide="trash-2" class="w-3 h-3"></i></button>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  if (window.lucide) window.lucide.createIcons();
}

function setupEvents() {
  typeFilter?.addEventListener('change', renderContents);
  qualityFilter?.addEventListener('change', renderContents);
  contentSearchInput?.addEventListener('input', renderContents);

  openContentModalBtn?.addEventListener('click', () => {
    contentModalTitle.innerHTML = `<i data-lucide="film" class="w-5 h-5 text-red-500"></i> 새 콘텐츠 등록`;
    contentForm.reset();
    contentIdEl.value = '';
    contentModal.classList.remove('hidden');
    if (window.lucide) window.lucide.createIcons();
  });

  closeContentModalBtn?.addEventListener('click', () => contentModal.classList.add('hidden'));
  cancelContentModalBtn?.addEventListener('click', () => contentModal.classList.add('hidden'));

  contentForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = contentIdEl.value;
    const newItem = {
      title: titleInput.value,
      type: typeInput.value,
      quality: qualityInput.value,
      poster_url: posterInput.value,
      genre: genreInput.value,
      rating: parseFloat(ratingInput.value) || 9.0,
      overview: overviewInput.value,
      views: id ? (contents.find(c => c.id == id)?.views || 0) : 0
    };

    if (id) {
      const idx = contents.findIndex(c => c.id == id);
      if (idx !== -1) contents[idx] = { ...contents[idx], ...newItem };
    } else {
      newItem.id = Date.now().toString();
      contents.push(newItem);
    }

    contentModal.classList.add('hidden');
    renderContents();
  });
}

window.editContent = (id) => {
  const c = contents.find(item => item.id == id);
  if (!c) return;

  contentIdEl.value = c.id;
  titleInput.value = c.title;
  typeInput.value = c.type;
  qualityInput.value = c.quality;
  posterInput.value = c.poster_url;
  genreInput.value = c.genre || '';
  ratingInput.value = c.rating || 9.0;
  overviewInput.value = c.overview || '';

  contentModalTitle.innerHTML = `<i data-lucide="edit-3" class="w-5 h-5 text-red-500"></i> 콘텐츠 수정`;
  contentModal.classList.remove('hidden');
  if (window.lucide) window.lucide.createIcons();
};

window.deleteContent = (id) => {
  if (confirm('콘텐츠를 삭제하시겠습니까?')) {
    contents = contents.filter(c => c.id != id);
    renderContents();
  }
};