let backups = [
  { id: 'bak_20260814_0300', name: '일간 정기 자동 백업', type: '자동', size: '284 MB', created_at: '2026-08-14 03:00:00', status: '완료' },
  { id: 'bak_20260813_0300', name: '일간 정기 자동 백업', type: '자동', size: '281 MB', created_at: '2026-08-13 03:00:00', status: '완료' },
  { id: 'bak_20260812_1530', name: '수동 시스템 릴리즈 스냅샷', type: '수동', size: '279 MB', created_at: '2026-08-12 15:30:12', status: '완료' },
  { id: 'bak_20260812_0300', name: '일간 정기 자동 백업', type: '자동', size: '278 MB', created_at: '2026-08-12 03:00:00', status: '완료' }
];

const backupTableBody = document.getElementById('backupTableBody');
const createBackupBtn = document.getElementById('createBackupBtn');
const refreshBackupBtn = document.getElementById('refreshBackupBtn');

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) window.lucide.createIcons();
  renderBackups();
  setupEvents();
});

function renderBackups() {
  if (!backupTableBody) return;

  backupTableBody.innerHTML = backups.map(b => `
    <tr class="hover:bg-zinc-800/40 transition">
      <td class="p-4 font-medium text-white">
        <div>${b.name}</div>
        <div class="text-[10px] text-zinc-500 font-mono">${b.id}</div>
      </td>
      <td class="p-4">
        <span class="${b.type === '자동' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-purple-500/10 text-purple-400 border-purple-500/20'} border text-[10px] px-2 py-0.5 rounded-md font-semibold">
          ${b.type}
        </span>
      </td>
      <td class="p-4 font-mono text-zinc-300">${b.size}</td>
      <td class="p-4 text-zinc-400">${b.created_at}</td>
      <td class="p-4">
        <span class="inline-flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> ${b.status}
        </span>
      </td>
      <td class="p-4 text-right">
        <div class="flex justify-end gap-2">
          <button onclick="downloadBackup('${b.id}')" class="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-[11px] font-medium transition flex items-center gap-1">
            <i data-lucide="download" class="w-3 h-3"></i> 다운로드
          </button>
          <button onclick="restoreBackup('${b.id}')" class="px-2.5 py-1 bg-red-950/40 hover:bg-red-900/60 text-red-400 rounded-lg text-[11px] font-medium transition flex items-center gap-1">
            <i data-lucide="rotate-ccw" class="w-3 h-3"></i> 복원
          </button>
        </div>
      </td>
    </tr>
  `).join('');

  if (window.lucide) window.lucide.createIcons();
}

function setupEvents() {
  createBackupBtn?.addEventListener('click', () => {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const timeStr = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    const idStr = `bak_${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}`;

    backups.unshift({
      id: idStr,
      name: '사용자 요청 수동 백업',
      type: '수동',
      size: '285 MB',
      created_at: timeStr,
      status: '완료'
    });

    renderBackups();
    alert('새로운 수동 백업 스냅샷이 성공적으로 생성되었습니다!');
  });

  refreshBackupBtn?.addEventListener('click', () => {
    renderBackups();
  });
}

window.downloadBackup = (id) => {
  alert(`백업 스냅샷 [${id}] 데이터 다운로드를 시작합니다.`);
};

window.restoreBackup = (id) => {
  if (confirm(`⚠️ 경고: [${id}] 상태로 복원하시겠습니까?\n복원 진행 시 현재 데이터베이스의 변경 사항이 덮어씌워집니다.`)) {
    alert('복구 작업이 완료되었습니다.');
  }
};