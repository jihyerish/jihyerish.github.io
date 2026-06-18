/* === Career Trajectory Simulator — App Logic === */

// ---- Theme Toggle ----
(function () {
  const toggle = document.querySelector('[data-theme-toggle]');
  const root = document.documentElement;
  let isDark = true; // default dark
  root.setAttribute('data-theme', 'dark');

  toggle && toggle.addEventListener('click', () => {
    isDark = !isDark;
    root.setAttribute('data-theme', isDark ? 'dark' : 'light');
    toggle.innerHTML = isDark
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`;
    // Redraw charts for new theme
    setTimeout(() => { initCharts(); }, 100);
  });
})();

// ---- Path Selection ----
let currentPath = 'both';

function selectPath(path) {
  currentPath = path;
  document.querySelectorAll('.path-card').forEach(c => {
    c.classList.remove('active', 'both-active');
  });
  const card = document.querySelector(`[data-path="${path}"]`);
  if (card) {
    card.classList.add(path === 'both' ? 'both-active' : 'active');
  }

  // Show/hide timeline sections
  const tpdmTl = document.getElementById('tpdm-timeline');
  const tpmTl = document.getElementById('tpm-timeline');
  const bothTl = document.getElementById('both-timeline');

  tpdmTl.style.display = 'none';
  tpmTl.style.display = 'none';
  bothTl.style.display = 'none';

  if (path === 'tpdm') {
    tpdmTl.style.display = 'block';
  } else if (path === 'tpm') {
    tpmTl.style.display = 'block';
  } else {
    // Both — show both timelines stacked
    bothTl.style.display = 'block';
    bothTl.innerHTML = `<div class="comparison-note">아래에서 두 경로를 나란히 비교합니다.</div>`;
    const clone1 = tpdmTl.cloneNode(true);
    const clone2 = tpmTl.cloneNode(true);
    clone1.style.display = 'block';
    clone2.style.display = 'block';
    bothTl.appendChild(clone1);
    bothTl.appendChild(clone2);
  }

  // Update dot pulse color for tpm
  if (path === 'tpm') {
    document.querySelectorAll('.timeline-item.current .tl-dot.tpm').forEach(d => {
      d.style.animation = 'ringPulseTpm 2.5s infinite';
    });
  }
}

// ---- Tab Navigation ----
function showTab(tabId) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));

  const btn = document.querySelector(`.tab[onclick="showTab('${tabId}')"]`);
  const content = document.getElementById(`tab-${tabId}`);
  if (btn) btn.classList.add('active');
  if (content) content.classList.add('active');
}

// ---- Charts ----
let salaryChart = null;
let radarChart = null;

function getColors() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  return {
    tpdm: isDark ? '#7986cb' : '#3f51b5',
    tpm: isDark ? '#4db6ac' : '#00796b',
    tpdmBg: isDark ? 'rgba(121,134,203,0.2)' : 'rgba(63,81,181,0.15)',
    tpmBg: isDark ? 'rgba(77,182,172,0.2)' : 'rgba(0,121,107,0.15)',
    textMuted: isDark ? '#7a7870' : '#6b6a65',
    gridLine: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)',
    surface: isDark ? '#1a1916' : '#f9f8f5',
  };
}

function initCharts() {
  const c = getColors();

  // ---- Salary Chart ----
  const salaryCtx = document.getElementById('salaryChart');
  if (!salaryCtx) return;
  if (salaryChart) { salaryChart.destroy(); }

  const labels = ['2026\n(전환기)', '2028\n(Senior)', '2030\n(Principal)', '2033\n(Director)', '2036\n(VP/CPO)'];
  const tpdmMid = [9500, 14000, 21000, 30000, 42000];
  const tpmMid = [10500, 15000, 19200, 26000, 37000];

  salaryChart = new Chart(salaryCtx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'TPdM (Technical Product Manager)',
          data: tpdmMid,
          borderColor: c.tpdm,
          backgroundColor: c.tpdmBg,
          borderWidth: 2.5,
          pointBackgroundColor: c.tpdm,
          pointRadius: 6,
          pointHoverRadius: 9,
          fill: true,
          tension: 0.35,
        },
        {
          label: 'TPM (Technical Program Manager)',
          data: tpmMid,
          borderColor: c.tpm,
          backgroundColor: c.tpmBg,
          borderWidth: 2.5,
          pointBackgroundColor: c.tpm,
          pointRadius: 6,
          pointHoverRadius: 9,
          fill: true,
          tension: 0.35,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 2.5,
      interaction: { intersect: false, mode: 'index' },
      plugins: {
        legend: {
          labels: {
            color: c.textMuted,
            font: { family: 'Noto Sans KR', size: 12 },
            boxWidth: 14,
            padding: 20,
          }
        },
        tooltip: {
          backgroundColor: c.surface,
          titleColor: c.tpdm,
          bodyColor: '#999',
          borderColor: c.gridLine,
          borderWidth: 1,
          padding: 12,
          callbacks: {
            label: ctx => ` ${ctx.dataset.label}: ₩${ctx.parsed.y.toLocaleString()}만`,
          }
        }
      },
      scales: {
        x: {
          ticks: { color: c.textMuted, font: { size: 11 } },
          grid: { color: c.gridLine },
        },
        y: {
          ticks: {
            color: c.textMuted,
            font: { size: 11 },
            callback: v => `₩${v.toLocaleString()}만`
          },
          grid: { color: c.gridLine },
          beginAtZero: false,
          suggestedMin: 5000,
        }
      }
    }
  });

  // ---- Radar Chart ----
  const radarCtx = document.getElementById('radarChart');
  if (!radarCtx) return;
  if (radarChart) { radarChart.destroy(); }

  radarChart = new Chart(radarCtx, {
    type: 'radar',
    data: {
      labels: [
        '기술 깊이', '제품 전략', '데이터 분석',
        '크로스펑셔널\n리더십', 'AI/ML 이해',
        '스테이크홀더\n관리', '애자일 실행'
      ],
      datasets: [
        {
          label: '현재 프로파일',
          data: [95, 55, 45, 50, 40, 50, 55],
          borderColor: '#999',
          backgroundColor: 'rgba(150,150,150,0.15)',
          borderWidth: 1.5,
          pointBackgroundColor: '#999',
          pointRadius: 4,
        },
        {
          label: 'TPdM 2030 목표',
          data: [80, 90, 80, 85, 75, 85, 75],
          borderColor: c.tpdm,
          backgroundColor: c.tpdmBg,
          borderWidth: 2,
          pointBackgroundColor: c.tpdm,
          pointRadius: 5,
        },
        {
          label: 'TPM 2030 목표',
          data: [85, 65, 75, 95, 70, 90, 90],
          borderColor: c.tpm,
          backgroundColor: c.tpmBg,
          borderWidth: 2,
          pointBackgroundColor: c.tpm,
          pointRadius: 5,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 1.6,
      plugins: {
        legend: {
          labels: {
            color: c.textMuted,
            font: { family: 'Noto Sans KR', size: 11 },
            boxWidth: 12,
            padding: 16,
          }
        },
        tooltip: {
          backgroundColor: c.surface,
          titleColor: c.textMuted,
          bodyColor: '#999',
          borderColor: c.gridLine,
          borderWidth: 1,
          padding: 10,
        }
      },
      scales: {
        r: {
          min: 0,
          max: 100,
          ticks: {
            color: c.textMuted,
            font: { size: 9 },
            stepSize: 25,
            backdropColor: 'transparent',
          },
          grid: { color: c.gridLine },
          angleLines: { color: c.gridLine },
          pointLabels: {
            color: c.textMuted,
            font: { family: 'Noto Sans KR', size: 10 },
          }
        }
      }
    }
  });
}

// ---- Scroll Animations ----
function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('.tl-card, .diff-card, .cert-item, .skill-item, .phase-block').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });

  // Visible class
  const style = document.createElement('style');
  style.textContent = `.visible { opacity: 1 !important; transform: translateY(0) !important; }`;
  document.head.appendChild(style);
}

// ---- Skill bar animation ----
function animateSkillBars() {
  const bars = document.querySelectorAll('.skill-fill');
  bars.forEach(bar => {
    const targetWidth = bar.style.width;
    bar.style.width = '0%';
    setTimeout(() => { bar.style.width = targetWidth; }, 200);
  });
}

// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
  // Default: show both timelines
  selectPath('both');
  initCharts();
  initScrollAnimations();

  // Animate skill bars when skills tab is opened
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      if (tab.textContent.includes('스킬')) {
        setTimeout(animateSkillBars, 100);
      }
    });
  });
});

// Make functions global
window.selectPath = selectPath;
window.showTab = showTab;
