// Clickjacking 방어(프레임버스터): 우리 페이지가 다른 사이트의 iframe 안에
// 삽입됐을 때만 최상위로 빠져나온다. 우리 문서에서만 실행되므로, 우리 페이지
// 안에서 AdSense 광고가 만드는 iframe(구글 콘텐츠)에는 영향을 주지 않는다.
(() => {
  try {
    if (window.top !== window.self) {
      window.top.location = window.self.location;
    }
  } catch (_) {
    // 교차 출처 프레임이라 top 접근/이동이 차단된 경우 — 이미 외부 프레임이므로 무시
  }
})();

(() => {
  const STORAGE_KEY = 'theme';
  const root = document.documentElement;
  const toggle = document.getElementById('darkModeToggle');

  function getStoredTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (_) {
      return null;
    }
  }

  function setStoredTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (_) {
      // Theme switching should still work for the current page if storage is blocked.
    }
  }

  function preferredTheme() {
    const stored = getStoredTheme();
    if (stored === 'dark' || stored === 'light') return stored;
    // 저장된 사용자 선택이 없으면 항상 라이트 모드로 시작 (OS 설정은 따르지 않음)
    return 'light';
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (!toggle) return;

    const isDark = theme === 'dark';
    toggle.textContent = isDark ? '☀️' : '🌙';
    toggle.setAttribute('aria-pressed', String(isDark));
    toggle.setAttribute('aria-label', isDark ? '라이트 모드로 전환' : '다크 모드로 전환');
    toggle.title = isDark ? '라이트 모드로 전환' : '다크 모드로 전환';
  }

  applyTheme(preferredTheme());

  if (toggle) {
    toggle.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      setStoredTheme(next);
      applyTheme(next);
    });
  }
})();

// "맨 위로" 플로팅 버튼 — 한 화면 이상 스크롤하면 우하단에 표시 (전 페이지 공통, 스타일은 theme.css .to-top)
(() => {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'to-top';
  btn.textContent = '↑';
  btn.setAttribute('aria-label', '맨 위로');
  document.body.appendChild(btn);

  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  });

  let ticking = false;
  function update() {
    btn.classList.toggle('show', window.scrollY > 600);
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
})();
