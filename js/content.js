import { supabase } from './config.js';

// DOM Elements
const tableBody = document.getElementById('contentTableBody');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const statusFilter = document.getElementById('statusFilter');
const sortFilter = document.getElementById('sortFilter');
const selectAllCheckbox = document.getElementById('selectAllCheckbox');
const deleteSelectedBtn = document.getElementById('deleteSelectedBtn');
const selectedCountEl = document.getElementById('selectedCount');

// 통계 요약 칩 Elements
const totalBadge = document.getElementById('totalBadge');
const activeCountEl = document.getElementById('activeCount');
const inactiveCountEl = document.getElementById('inactiveCount');
const totalViewsSumEl = document.getElementById('totalViewsSum');
const showingCountEl = document.getElementById('showingCount');

// Modal Elements
const modal = document.getElementById('contentModal');
const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelModalBtn = document.getElementById('cancelModalBtn');
const contentForm = document.getElementById('contentForm');
const modalTitle = document.getElementById('modalTitle');

const contentIdEl = document.getElementById('contentId');
const titleInput = document.getElementById('titleInput');
const posterInput = document.getElementById('posterInput');
const posterPreview = document.getElementById('posterPreview');
const categoryInput = document.getElementById('categoryInput');
const ratingAgeInput = document.getElementById('ratingAgeInput');
const statusInput = document.getElementById('statusInput');
const durationInput = document.getElementById('durationInput');
const castInput = document.getElementById('castInput');
const descInput = document.getElementById('descInput');

// 풍부한 고퀄리티 기본 샘플 데이터셋
let memoryContents = [
  {
    id: '1',
    title: '오징어 게임 시즌 2',
    category: '드라마',
    rating_age: '19',
    status: 'active',
    views: 125400,
    rating: 4.9,
    duration: '6부작',
    cast: '이정재, 임시완, 강하늘',
    poster: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80',
    description: '456억 원의 상금이 걸린 의문의 서바이벌에 참가한 사람들이 승자가 되기 위해 목숨을 걸고 아포칼립스 게임에 도전하는 이야기.',
    created_at: '2026-08-14T10:30:00Z'
  },
  {
    id: '2',
    title: '더 글로리 파트 2',
    category: '드라마',
    rating_age: '19',
    status: 'active',
    views: 98200,
    rating: 4.8,
    duration: '8부작',
    cast: '송혜교, 이도현, 임지연',
    poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&auto=format&fit=crop&q=80',
    description: '유년 시절 영혼까지 부서진 한 여자가 온 생을 걸어 치밀하게 준비한 처절한 복수와 그 소용돌이에 빠져드는 이들의 이야기.',
    created_at: '2026-08-13T14:20:00Z'
  },
  {
    id: '3',
    title: '기생충 (Parasite)',
    category: '영화',
    rating_age: '15',
    status: 'active',
    views: 210500,
    rating: 5.0,
    duration: '131분',
    cast: '송강호, 이선균, 조여정',
    poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300&auto=format&fit=crop&q=80',
    description: '전원백수로 살아가던 기택네 장남 기우가 고액 과외 면접을 위해 박사장네 집에 발을 들이면서 시작된 두 가족의 만남.',
    created_at: '2026-08-12T09:15:00Z'
  },
  {
    id: '4',
    title: '피지컬: 100 시즌 3',
    category: '예능',
    rating_age: '12',
    status: 'active',
    views: 45300,
    rating: 4.6,
    duration: '10부작',
    cast: '추성훈, 윤성빈 외 100인',
    poster: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=300&auto=format&fit=crop&q=80',
    description: '최강 피지컬이라 자부하는 100인이 펼치는 극강의 서바이벌 게임 예능.',
    created_at: '2026-08-11T18:00:00Z'
  },
  {
    id: '5',
    title: '귀멸의 칼날: 무한성편',
    category: '애니',
    rating_age: '15',
    status: 'inactive',
    views: 12000,
    rating: 4.9,
    duration: '110분',
    cast: '하나에 나츠키, 귀살대',
    poster: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300&auto=format&fit=crop&q=80',
    description: '혈귀의 본거지 무한성에서 펼쳐지는 귀살대와 혈귀들의 최종 결전!',
    created_at: '2026-08-10T11:45:00Z'
  }
];

let selectedIds = new Set();

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) window.lucide.createIcons();
  fetchContents();
  setupEvents();
});

// 데이터 조회
async function fetchContents() {
  let list = memoryContents;

  try {
    if (supabase && supabase.from) {
      const { data, error } = await supabase.from('contents').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        list = data;
        memoryContents = data;
      }
    }
  } catch (e) {
    console.log('기본 데이터 활성화');
  }

  updateStats(list);
  renderTable(list);
}

// 상단 통계 칩 업데이트
function updateStats(dataList) {
  const activeCount = dataList.filter(c => c.status === 'active').length;
  const inactiveCount = dataList.filter(c => c.status === 'inactive').length;
  const totalViews = dataList.reduce((acc, cur) => acc + (cur.views || 0), 0);

  if (totalBadge) totalBadge.textContent = `전체 ${dataList.length}개`;
  if (activeCountEl) activeCountEl.textContent = activeCount.toLocaleString();
  if (inactiveCountEl) inactiveCountEl.textContent = inactiveCount.toLocaleString();
  if (totalViewsSumEl) totalViewsSumEl.textContent = totalViews.toLocaleString();
  if (showingCountEl) showingCountEl.textContent = dataList.length;
}

// 테이블 렌더링
function renderTable(dataList) {
  if (!tableBody) return;

  const keyword = searchInput?.value.trim().toLowerCase() || '';
  const selectedCat = categoryFilter?.value || 'all';
  const selectedStatus = statusFilter?.value || 'all';
  const sort = sortFilter?.value || 'latest';

  // 필터링
  let filtered = dataList.filter(item => {
    const matchKey = item.title.toLowerCase().includes(keyword) || (item.cast && item.cast.toLowerCase().includes(keyword));
    const matchCat = selectedCat === 'all' || item.category === selectedCat;
    const matchStatus = selectedStatus === 'all' || item.status === selectedStatus;
    return matchKey && matchCat && matchStatus;
  });

  // 정렬
  filtered.sort((a, b) => {
    if (sort === 'views') return (b.views || 0) - (a.views || 0);
    if (sort === 'rating') return (b.rating || 0) - (a.rating || 0);
    if (sort === 'title') return a.title.localeCompare(b.title);
    return new Date(b.created_at || 0) - new Date(a.created_at || 0);
  });

  if (filtered.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="7" class="py-12 text-center text-zinc-500">
          <i data-lucide="film" class="w-10 h-10 mx-auto mb-2 opacity-30"></i>
          <p class="text-sm">검색 결과에 맞는 콘텐츠가 없습니다.</p>
        </td>
      </tr>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  tableBody.innerHTML = filtered.map(item => {
    const defaultPoster = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&auto=format&fit=crop&q=80';
    const isChecked = selectedIds.has(item.id.toString());

    // 관람등급 뱃지 색상
    let ratingBadge = `<span class="px-2 py-0.5 text-[10px] font-bold rounded bg-green-500/10 text-green-400 border border-green-500/20">ALL</span>`;
    if (item.rating_age === '12') ratingBadge = `<span class="px-2 py-0.5 text-[10px] font-bold rounded bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">12세</span>`;
    if (item.rating_age === '15') ratingBadge = `<span class="px-2 py-0.5 text-[10px] font-bold rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">15세</span>`;
    if (item.rating_age === '19') ratingBadge = `<span class="px-2 py-0.5 text-[10px] font-bold rounded bg-red-500/20 text-red-400 border border-red-500/30">19금</span>`;

    return `
      <tr class="hover:bg-zinc-800/40 transition group">
        <td class="py-3 px-4 text-center">
          <input type="checkbox" value="${item.id}" class="row-checkbox rounded bg-zinc-800 border-zinc-700 text-red-600 focus:ring-0 cursor-pointer" ${isChecked ? 'checked' : ''}>
        </td>
        <td class="py-3 px-4">
          <div class="flex items-center gap-3">
            <img src="${item.poster || defaultPoster}" class="w-10 h-14 object-cover rounded-lg shadow-md border border-zinc-800 shrink-0" onerror="this.src='${defaultPoster}'">
            <div>
              <h4 class="font-bold text-white text-sm group-hover:text-red-400 transition">${item.title}</h4>
              <p class="text-[11px] text-zinc-400 mt-0.5 truncate max-w-xs">${item.cast ? '출연: ' + item.cast : item.description || '설명 없음'}</p>
            </div>
          </div>
        </td>
        <td class="py-3 px-4">
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-1 bg-zinc-800 text-zinc-300 rounded-lg text-[11px] font-medium border border-zinc-700/60">${item.category || '드라마'}</span>
            ${ratingBadge}
          </div>
          <span class="text-[10px] text-zinc-500 block mt-1">${item.duration || '-'}</span>
        </td>
        <td class="py-3 px-4">
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold rounded-full ${item.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-zinc-800 text-zinc-500 border border-zinc-700'}">
            <span class="w-1.5 h-1.5 rounded-full ${item.status === 'active' ? 'bg-emerald-400' : 'bg-zinc-500'}"></span>
            ${item.status === 'active' ? '공개' : '비공개'}
          </span>
        </td>
        <td class="py-3 px-4">
          <div class="font-bold text-white text-xs">${(item.views || 0).toLocaleString()}회</div>
          <div class="text-[11px] text-amber-400 font-semibold mt-0.5">★ ${item.rating || '4.5'}</div>
        </td>
        <td class="py-3 px-4 text-zinc-400 text-[11px]">
          ${item.created_at ? new Date(item.created_at).toLocaleDateString('ko-KR') : '방금 전'}
        </td>
        <td class="py-3 px-4 text-right space-x-1">
          <button onclick="editContent('${item.id}')" class="p-2 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg transition" title="수정">
            <i data-lucide="edit-3" class="w-4 h-4"></i>
          </button>
          <button onclick="deleteContent('${item.id}')" class="p-2 hover:bg-red-950/60 text-zinc-400 hover:text-red-400 rounded-lg transition" title="삭제">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');

  if (window.lucide) window.lucide.createIcons();
  bindCheckboxEvents();
}

// 체크박스 이벤트 바인딩
function bindCheckboxEvents() {
  const rowCheckboxes = document.querySelectorAll('.row-checkbox');
  rowCheckboxes.forEach(cb => {
    cb.addEventListener('change', (e) => {
      const id = e.target.value;
      if (e.target.checked) {
        selectedIds.add(id);
      } else {
        selectedIds.delete(id);
      }
      updateDeleteBtnUI();
    });
  });
}

function updateDeleteBtnUI() {
  if (selectedIds.size > 0) {
    deleteSelectedBtn.classList.remove('hidden');
    deleteSelectedBtn.classList.add('flex');
    if (selectedCountEl) selectedCountEl.textContent = selectedIds.size;
  } else {
    deleteSelectedBtn.classList.add('hidden');
    deleteSelectedBtn.classList.remove('flex');
  }
}

// 이벤트 핸들러 설정
function setupEvents() {
  searchInput?.addEventListener('input', () => renderTable(memoryContents));
  categoryFilter?.addEventListener('change', () => renderTable(memoryContents));
  statusFilter?.addEventListener('change', () => renderTable(memoryContents));
  sortFilter?.addEventListener('change', () => renderTable(memoryContents));

  // 전체 선택 체크박스
  selectAllCheckbox?.addEventListener('change', (e) => {
    const isChecked = e.target.checked;
    const rowCheckboxes = document.querySelectorAll('.row-checkbox');
    rowCheckboxes.forEach(cb => {
      cb.checked = isChecked;
      if (isChecked) selectedIds.add(cb.value);
      else selectedIds.delete(cb.value);
    });
    updateDeleteBtnUI();
  });

  // 선택 항목 일괄 삭제
  deleteSelectedBtn?.addEventListener('click', async () => {
    if (!confirm(`선택한 ${selectedIds.size}개 콘텐츠를 정말 삭제하시겠습니까?`)) return;

    memoryContents = memoryContents.filter(c => !selectedIds.has(c.id.toString()));
    
    try {
      if (supabase && supabase.from) {
        await supabase.from('contents').delete().in('id', Array.from(selectedIds));
      }
    } catch (e) {}

    selectedIds.clear();
    if (selectAllCheckbox) selectAllCheckbox.checked = false;
    updateDeleteBtnUI();
    updateStats(memoryContents);
    renderTable(memoryContents);
  });

  // 포스터 URL 입력 시 실시간 미리가보기
  posterInput?.addEventListener('input', (e) => {
    const url = e.target.value;
    posterPreview.src = url || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&auto=format&fit=crop&q=80';
  });

  // 모달 제어
  openModalBtn?.addEventListener('click', () => {
    modalTitle.innerHTML = `<i data-lucide="film" class="w-5 h-5 text-red-500"></i> 신규 콘텐츠 등록`;
    contentForm.reset();
    contentIdEl.value = '';
    posterPreview.src = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&auto=format&fit=crop&q=80';
    modal.classList.remove('hidden');
    if (window.lucide) window.lucide.createIcons();
  });

  closeModalBtn?.addEventListener('click', () => modal.classList.add('hidden'));
  cancelModalBtn?.addEventListener('click', () => modal.classList.add('hidden'));

  // 폼 제출 (등록/수정)
  contentForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = contentIdEl.value;

    const newItem = {
      title: titleInput.value,
      poster: posterInput.value || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&auto=format&fit=crop&q=80',
      category: categoryInput.value,
      rating_age: ratingAgeInput.value,
      status: statusInput.value,
      duration: durationInput.value || '120분',
      cast: castInput.value || '미상',
      description: descInput.value,
      views: id ? (memoryContents.find(c => c.id == id)?.views || 0) : Math.floor(Math.random() * 5000),
      rating: id ? (memoryContents.find(c => c.id == id)?.rating || 4.8) : 4.8,
      created_at: new Date().toISOString()
    };

    if (id) {
      const index = memoryContents.findIndex(c => c.id == id);
      if (index !== -1) memoryContents[index] = { ...memoryContents[index], ...newItem };
    } else {
      newItem.id = Date.now().toString();
      memoryContents.unshift(newItem);
    }

    try {
      if (supabase && supabase.from) {
        if (id) await supabase.from('contents').update(newItem).eq('id', id);
        else await supabase.from('contents').insert([newItem]);
      }
    } catch(err) {}

    modal.classList.add('hidden');
    updateStats(memoryContents);
    renderTable(memoryContents);
  });
}

// 글로벌 전역 수정 함수
window.editContent = (id) => {
  const item = memoryContents.find(c => c.id == id);
  if (!item) return;

  contentIdEl.value = item.id;
  titleInput.value = item.title;
  posterInput.value = item.poster || '';
  posterPreview.src = item.poster || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&auto=format&fit=crop&q=80';
  categoryInput.value = item.category || '드라마';
  ratingAgeInput.value = item.rating_age || '15';
  statusInput.value = item.status || 'active';
  durationInput.value = item.duration || '';
  castInput.value = item.cast || '';
  descInput.value = item.description || '';

  modalTitle.innerHTML = `<i data-lucide="edit-3" class="w-5 h-5 text-red-500"></i> 콘텐츠 수정`;
  modal.classList.remove('hidden');
  if (window.lucide) window.lucide.createIcons();
};

// 글로벌 전역 삭제 함수
window.deleteContent = async (id) => {
  if (!confirm('정말 이 콘텐츠를 삭제하시겠습니까?')) return;

  memoryContents = memoryContents.filter(c => c.id != id);

  try {
    if (supabase && supabase.from) {
      await supabase.from('contents').delete().eq('id', id);
    }
  } catch(err) {}

  updateStats(memoryContents);
  renderTable(memoryContents);
};