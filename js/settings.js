import { supabase } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) window.lucide.createIcons();
  setupSettingsForm();
});

function setupSettingsForm() {
  const profileForm = document.getElementById('profileForm');
  const playerSettingsForm = document.getElementById('playerSettingsForm');

  profileForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('계정 정보가 정상적으로 업데이트되었습니다.');
  });

  playerSettingsForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('OTT 플레이어 기본 정책 설정이 변경되었습니다.');
  });
}