/*
 * 공통 악기 모듈 (도구상자) — /instrument-audio.js
 * ------------------------------------------------------------------
 * "악기" 카테고리 도구(드럼 패드·피아노 등)가 공유하는 로직을 한 곳에 모은다.
 * 순수 리팩터용 — 새 기능은 담지 않는다. 각 페이지는 자기 고유 부분
 * (합성음/신스·UI·음정·옥타브 등)만 갖고, 아래 3가지는 이 모듈을 쓴다.
 *
 *  (1) createAudioEngine — Tone.js 지연 로드(SRI)+첫 동작 Tone.start()+신스 1회 빌드
 *  (2) createKeyMap      — 기본키/localStorage/재바인드 상태머신/충돌·초기화
 *                          (키↔항목 바인딩·영속화만. 실제 소리·음정·옥타브·배지 렌더는 페이지 몫)
 *  (3) flash             — 누름 피드백(요소에 클래스 잠깐 토글)
 *
 * Tone.js의 CDN 주소·SHA-384 SRI 해시는 이제 이 파일 한 곳에서만 관리한다.
 * 1st-party 파일이라 자체 SRI는 불필요(sidebar.js·theme.js와 동일).
 *
 * 사용 예: 각 페이지에서 <script src="/instrument-audio.js"></script> 를
 *   페이지 인라인 스크립트보다 먼저 불러온 뒤 window.DGBInstrument 사용.
 */
(function () {
  "use strict";

  // Tone.js 14.7.77 (MIT). src·실측 SHA-384 SRI는 여기 한 곳에서만 관리한다.
  var TONE_SRC = 'https://cdn.jsdelivr.net/npm/tone@14.7.77/build/Tone.js';
  var TONE_SRI = 'sha384-OIQZlttB2MRaZyoi526rVHiNUGYEq4MAMxDbTkwghmmqxs556T5g5LY926GH7NYM';

  // Tone.js 지연 로드: 처음 필요할 때 1회만 동적 주입(중복 방지). SRI·crossorigin 유지,
  // 로드 실패 시 promise를 리셋해 다음 동작에서 재시도할 수 있게 한다.
  var tonePromise = null;
  function ensureTone() {
    if (typeof Tone !== 'undefined') return Promise.resolve(true);
    if (tonePromise) return tonePromise;
    tonePromise = new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = TONE_SRC;
      s.integrity = TONE_SRI;
      s.crossOrigin = 'anonymous';
      s.onload = function () { if (typeof Tone !== 'undefined') resolve(true); else reject(new Error('undef')); };
      s.onerror = function () { reject(new Error('load')); };
      (document.head || document.documentElement).appendChild(s);
    });
    return tonePromise;
  }

  // (1) 오디오 엔진: 첫 사용자 동작에서 Tone 로드 → Tone.start() → build() 1회 → ready.
  // opts: { build, onActivating, onReady, onError }
  //  - build()       : Tone 시작 후 1회 호출, 반환값(신스/신스맵)을 instrument()로 돌려줌
  //  - onActivating(): 활성화 시작 시(상태 표시 등)
  //  - onReady()     : 준비 완료 시
  //  - onError(err)  : 로드/시작 실패 시
  function createAudioEngine(opts) {
    opts = opts || {};
    var built = null, started = false, activatePromise = null;
    function activate() {
      if (started) return Promise.resolve(true);
      if (activatePromise) return activatePromise;
      if (opts.onActivating) { try { opts.onActivating(); } catch (e) {} }
      activatePromise = ensureTone().then(function () {
        return Tone.start();
      }).then(function () {
        if (!built) built = opts.build ? opts.build() : null;
        started = true;
        if (opts.onReady) { try { opts.onReady(); } catch (e) {} }
        return true;
      }).catch(function (err) {
        activatePromise = null;        // 실패 시 리셋 → 다음 동작에서 재시도
        if (opts.onError) { try { opts.onError(err); } catch (e) {} }
        return false;
      });
      return activatePromise;
    }
    return {
      activate: activate,
      isStarted: function () { return started; },
      instrument: function () { return built; }
    };
  }

  // (2) 키맵 엔진: 키↔항목 바인딩·영속화·재바인드 상태머신만 담당.
  // 실제 소리/음정/옥타브/배지 렌더는 페이지가 한다(엔진은 현재 바인딩/상태만 제공).
  // opts: { storageKey, items:[{id, def, ...}], on:{ change, trigger, listenStart, listenCancel, bind, reset } }
  //  - items 의 id·def 만 사용(나머지 필드는 페이지가 trigger 콜백에서 그대로 받음)
  //  - 저장 형태는 { id: 'char' } JSON — 기존 데이터와 호환되도록 그대로 유지
  function createKeyMap(opts) {
    opts = opts || {};
    var storageKey = opts.storageKey;
    var items = opts.items || [];
    var on = opts.on || {};
    var map = {};            // { id: char }
    var listeningId = null;  // 재지정 대기 중인 항목 id

    function defaults() { var m = {}; items.forEach(function (it) { m[it.id] = it.def; }); return m; }
    function load() {
      var m = defaults();
      try {
        var raw = JSON.parse(localStorage.getItem(storageKey) || 'null');
        if (raw && typeof raw === 'object') {
          items.forEach(function (it) {
            var v = raw[it.id];
            if (typeof v === 'string' && v.length === 1) m[it.id] = v.toLowerCase();
            else if (v === '') m[it.id] = '';   // 사용자가 비워둔 경우 허용
          });
        }
      } catch (e) {}
      map = m;
    }
    function save() { try { localStorage.setItem(storageKey, JSON.stringify(map)); } catch (e) {} }
    function label(k) { if (!k) return '—'; if (k === ' ') return 'Space'; return k.toUpperCase(); }
    function itemForChar(c) { if (!c) return null; for (var i = 0; i < items.length; i++) { if (map[items[i].id] === c) return items[i]; } return null; }
    function change() { if (on.change) { try { on.change(); } catch (e) {} } }

    function startListening(id) { listeningId = id; if (on.listenStart) { try { on.listenStart(id); } catch (e) {} } change(); }
    function cancel() { listeningId = null; if (on.listenCancel) { try { on.listenCancel(); } catch (e) {} } change(); }
    function bind(id, ch) {
      // 다른 항목이 같은 키를 쓰면 충돌 방지를 위해 그 항목의 키를 비운다.
      items.forEach(function (it) { if (it.id !== id && map[it.id] === ch) map[it.id] = ''; });
      map[id] = ch; listeningId = null; save();
      if (on.bind) { try { on.bind(id, ch); } catch (e) {} }
      change();
    }
    function reset() { map = defaults(); listeningId = null; save(); if (on.reset) { try { on.reset(); } catch (e) {} } change(); }

    // 전역 키보드: 재지정 대기 중이면 키를 바인딩, 아니면 매핑된 항목을 트리거.
    function handleKeydown(e) {
      try {
        if (e.metaKey || e.ctrlKey || e.altKey) return;
        var ch = (e.key || '').toLowerCase();
        if (listeningId) {
          e.preventDefault();
          if (e.key === 'Escape') { cancel(); return; }
          if (ch.length !== 1) return;     // 글자·숫자·기호 등 단일 키만 배정
          bind(listeningId, ch);
          return;
        }
        if (e.repeat) return;              // 키 꾹 누름 연사 방지
        var it = itemForChar(ch);
        if (it) { e.preventDefault(); if (on.trigger) on.trigger(it); }
      } catch (err) {}
    }

    load();
    document.addEventListener('keydown', handleKeydown);

    return {
      label: label,
      getKey: function (id) { return map[id] || ''; },
      isListening: function (id) { return listeningId === id; },
      startListening: startListening,
      cancel: cancel,
      bind: bind,
      reset: reset,
      itemForChar: itemForChar
    };
  }

  // (3) 누름 피드백: 요소에 클래스를 잠깐 붙였다 뗀다(.hit/.down 등).
  function flash(el, cls, ms) {
    if (!el) return;
    el.classList.add(cls);
    setTimeout(function () { el.classList.remove(cls); }, ms || 130);
  }

  window.DGBInstrument = {
    createAudioEngine: createAudioEngine,
    createKeyMap: createKeyMap,
    flash: flash,
    ensureTone: ensureTone,
    TONE_SRC: TONE_SRC,
    TONE_SRI: TONE_SRI
  };
})();
