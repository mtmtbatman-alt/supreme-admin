import { supabase } from './config.js';

// DOM 요소
const tableBody = document.getElementById('contentTableBody');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const statusFilter = document.getElementById('statusFilter');

// 모달 관련 요소
const modal = document.getElementById('contentModal');
const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const contentForm = document.getElementById('contentForm');
const modalTitle = document.getElementById('modalTitle');

const contentIdEl = document.getElementById('contentId');
const titleInput = document.getElementById('titleInput');
const categoryInput = document.getElementById('categoryInput');
const statusInput = document.getElementById('statusInput');
const descInput = document.getElementById('descInput');

// 초기 샘플 데이터 (Supabase DB 연결 실패시 비상용)
let memoryContents = [
  { id: '1', title: '더 글로리 파트 2', category: '드라마', status: 'active', created_at: '2026-08-10 12:00', description: '복수를 그린 드라마' },
  { id: '2', title: '무빙 시즌 1', category: '드라마', status: 'active', created_at: '2026-08-11 14:30', description: '초능력 액션 히어로물' },
  { id: '3', title: '범죄도시 4', category: '영화', status: 'inactive', created_at: '2026-08-12 09:15', description: '마동석 주연 통쾌 액션' },
  { id: '4', title: '피지컬 100 시즌2', category: '예능', status: 'active', created_at: '2026-08-13 18:20', description: '최강 피지컬을 가리는 예능' }
];

document.addEventListener('DOMContentLoaded', () => {
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
    console.log('기본 데이터 렌더링');
  }

  renderTable(list);
}

// 테이블 렌더링
function renderTable(dataList) {
  if (!tableBody) return;

  const keyword = searchInput?.value.trim().toLowerCase() || '';
  const selectedCat = categoryFilter?.value || 'all';
  const selectedStatus = statusFilter?.value || 'all';

  const filtered = dataList.filter(item => {
    const matchKey = item.title.toLowerCase().includes(keyword);
    const matchCat = selectedCat === 'all' || item.category === selectedCat;
    const matchStatus = selectedStatus === 'all' || item.status === selectedStatus;
    return matchKey && matchCat && matchStatus;
  });

  if (filtered.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" class="py-8 text-center text-zinc-500">검색 조건에 해당되는 콘텐츠가 없습니다.</td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = filtered.map(item => `
    <tr class="hover:bg-zinc-800/40 transition">
      <td class="py-3.5 px-5 font-semibold text-white">${item.title}</td>
      <td class="py-3.5 px-5 text-zinc-400">${item.category || '기타'}</td>
      <td class="py-3.5 px-5">
        <span class="px-2.5 py-1 text-[10px] font-bold rounded-full ${item.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'}">
          ${item.status === 'active' ? '공개' : '비공개'}
        </span>
      </td>
      <td class="py-3.5 px-5 text-zinc-400 text-[11px]">${item.created_at ? new Date(item.created_at).toLocaleDateString('ko-KR') : '방금 전'}</td>
      <td class="py-3.5 px-5 text-right space-x-2">
        <button onclick="editContent('${item.id}')" class="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs transition">수정</button>
        <button onclick="deleteContent('${item.id}')" class="px-2.5 py-1 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg text-xs transition">삭제</button>
      </td>
    </tr>
  `).join('');
}

// 이벤트 리스너 등록
function setupEvents() {
  searchInput?.addEventListener('input', () => renderTable(memoryContents));
  categoryFilter?.addEventListener('change', () => renderTable(memoryContents));
  statusFilter?.addEventListener('change', () => renderTable(memoryContents));

  openModalBtn?.addEventListener('click', () => {
    modalTitle.textContent = '신규 콘텐츠 등록';
    contentForm.reset();
    contentIdEl.value = '';
    modal.classList.remove('hidden');
  });

  closeModalBtn?.addEventListener('click', () => modal.classList.add('hidden'));

  contentForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = contentIdEl.value;
    const newItem = {
      title: titleInput.value,
      category: categoryInput.value,
      status: statusInput.value,
      description: descInput.value,
      created_at: new Date().toISOString()
    };

    if (id) {
      // 수정
      const index = memoryContents.findIndex(c => c.id == id);
      if (index !== -1) memoryContents[index] = { ...memoryContents[index], ...newItem };
    } else {
      // 추가
      newItem.id = Date.now().toString();
      memoryContents.unshift(newItem);
    }

    try {
      if (supabase && supabase.from) {
        if (id) {
          await supabase.from('contents').update(newItem).eq('id', id);
        } else {
          await supabase.from('contents').insert([newItem]);
        }
      }
    } catch(err) {}

    modal.classList.add('hidden');
    renderTable(memoryContents);
  });
}

// 수정 및 삭제 (글로벌 바인딩)
window.editContent = (id) => {
  const item = memoryContents.find(c => c.id == id);
  if (!item) return;

  contentIdEl.value = item.id;
  titleInput.value = item.title;
  categoryInput.value = item.category || '드라마';
  statusInput.value = item.status || 'active';
  descInput.value = item.description || '';

  modalTitle.textContent = '콘텐츠 수정';
  modal.classList.remove('hidden');
};

window.deleteContent = async (id) => {
  if (!confirm('정말 이 콘텐츠를 삭제하시겠습니까?')) return;

  memoryContents = memoryContents.filter(c => c.id != id);

  try {
    if (supabase && supabase.from) {
      await supabase.from('contents').delete().eq('id', id);
    }
  } catch(err) {}

  renderTable(memoryContents);
};