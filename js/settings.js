import { supabase } from './config.js';
import { logAdminAction } from './logger.js';
import { logoutAdmin } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
  loadSettings();

  document.getElementById('settingsForm').addEventListener('submit', handleSaveSettings);

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.addEventListener('click', logoutAdmin);
});

// 기존 설정 불러오기
async function loadSettings() {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', 1)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('설정 로드 오류:', error.message);
    return;
  }

  if (data) {
    document.getElementById('siteNameInput').value = data.site_name || '';
    document.getElementById('bannerNoticeInput').value = data.banner_notice || '';
    document.getElementById('supportEmailInput').value = data.support_email || '';
    document.getElementById('maintenanceModeToggle').checked = data.maintenance_mode || false;
    document.getElementById('maintenanceMsgInput').value = data.maintenance_message || '';
  }
}

// 설정 저장 및 업데이트 (단일 레코드 관리: id=1)
async function handleSaveSettings(e) {
  e.preventDefault();

  const saveBtn = document.getElementById('saveSettingsBtn');
  saveBtn.disabled = true;
  saveBtn.textContent = '저장 중...';

  const payload = {
    id: 1,
    site_name: document.getElementById('siteNameInput').value.trim(),
    banner_notice: document.getElementById('bannerNoticeInput').value.trim(),
    support_email: document.getElementById('supportEmailInput').value.trim(),
    maintenance_mode: document.getElementById('maintenanceModeToggle').checked,
    maintenance_message: document.getElementById('maintenanceMsgInput').value.trim(),
    updated_at: new Date().toISOString()
  };

  const { error } = await supabase
    .from('site_settings')
    .upsert([payload]);

  if (error) {
    alert('설정 저장 실패: ' + error.message);
  } else {
    await logAdminAction('사이트 설정 변경', '글로벌 사이트 설정 정보 업데이트');
    alert('사이트 설정이 정상적으로 저장되었습니다.');
  }

  saveBtn.disabled = false;
  saveBtn.textContent = '설정 저장하기';
}