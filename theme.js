// Clickjacking 방어(프레임버스터): 우리 페이지가 다른 사이트의 iframe 안에
// 삽입됐을 때만 최상위로 빠져나온다. 우리 문서에서만 실행되므로, 우리 페이지
// 안에서 AdSense 광고가 만드는 iframe(구글 콘텐츠)에는 영향을 주지 않는다.
(() => {
  try {
    if (window.top !== window.self) {
      // 같은 출처(우리 도구상자 작업대 iframe) 안이면 정상 동작 — 빠져나오지 않는다.
      // 외부 사이트가 우리 페이지를 iframe에 끼워넣은 경우(클릭재킹)에만 최상위로 탈출.
      let sameOrigin = false;
      try { sameOrigin = window.top.location.origin === window.self.location.origin; } catch (_) { sameOrigin = false; }
      if (!sameOrigin) window.top.location = window.self.location;
    }
  } catch (_) {
    // top 접근/이동이 차단된 교차 출처 프레임 — 무시
  }
})();

// 작업대(iframe) 임베드 모드: ?embed=1 로 열린 도구 페이지는 상단바·사이드바·푸터·
// 설명(.content)·광고 등 "크롬"을 숨기고 순수 도구 UI(.box)만 노출한다.
// (실제 숨김 스타일은 theme.css 의 html.embed 규칙. 여기선 클래스만 부여.)
(() => {
  try {
    if (new URLSearchParams(window.location.search).get("embed") === "1") {
      document.documentElement.classList.add("embed");
    }
  } catch (_) {}
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
      const change = () => {
        setStoredTheme(next);
        applyTheme(next);
      };

      // "밤의 종이" 테마 전환 스윕: 토글 버튼에서 새 테마가 원형으로 번져나간다.
      // (기본 크로스페이드는 theme.css 의 ::view-transition-*(root) 규칙이 끔)
      // View Transitions 미지원 브라우저·reduced-motion 은 기존처럼 즉시 전환.
      const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!document.startViewTransition || reduced) {
        change();
        return;
      }

      const rect = toggle.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const radius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      document.startViewTransition(change).ready.then(() => {
        root.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 560, easing: 'cubic-bezier(.3,0,.2,1)', pseudoElement: '::view-transition-new(root)' }
        );
      }).catch(() => { /* 전환이 스킵돼도 테마는 이미 적용됨 */ });
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
