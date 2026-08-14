document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) window.lucide.createIcons();
  initCharts();
});

function initCharts() {
  const trafficCtx = document.getElementById('trafficChart')?.getContext('2d');
  if (trafficCtx) {
    new Chart(trafficCtx, {
      type: 'line',
      data: {
        labels: ['월', '화', '수', '목', '금', '토', '일'],
        datasets: [{
          label: '동시 시청자 수 (k)',
          data: [28, 32, 30, 38, 45, 58, 52],
          borderColor: '#dc2626',
          backgroundColor: 'rgba(220, 38, 38, 0.1)',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#a1a1aa' } },
          y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#a1a1aa' } }
        }
      }
    });
  }

  const deviceCtx = document.getElementById('deviceChart')?.getContext('2d');
  if (deviceCtx) {
    new Chart(deviceCtx, {
      type: 'doughnut',
      data: {
        labels: ['스마트 TV', '모바일 앱', 'PC 웹', '태블릿'],
        datasets: [{
          data: [45, 30, 15, 10],
          backgroundColor: ['#dc2626', '#f59e0b', '#3b82f6', '#10b981'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { color: '#a1a1aa', font: { size: 11 } } }
        }
      }
    });
  }
}