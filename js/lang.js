/*
 * 언어 자동 이동 (홈페이지·개인정보처리방침 공용)
 * - 기본 언어(영어) 페이지(index.html, privacy-policy.html)로 처음 들어오면 브라우저 언어에 맞는 페이지로 이동한다.
 * - 사용자가 언어 링크를 직접 누르면 그 선택을 기억해 다시 자동 이동하지 않는다.
 * 지원 언어를 늘릴 때는 SUPPORTED에 추가하고 해당 언어 페이지(index-xx.html, privacy-policy-xx.html)를 만든다.
 */
(function () {
  var SUPPORTED = ['ko'];          // 영어(기본) 외의 언어
  var KEY = 'snowglobe-lang';

  function save(lang) { try { localStorage.setItem(KEY, lang); } catch (e) {} }
  function load() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }

  // 언어 링크를 누르면 선택을 저장
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('[data-lang]');
    if (a) save(a.getAttribute('data-lang'));
  });

  var page = document.documentElement.getAttribute('data-page');   // "index" | "privacy-policy"
  var current = document.documentElement.getAttribute('lang') || 'en';
  if (!page || current !== 'en') return;                            // 기본 언어 페이지에서만 자동 이동
  if (/[?&]lang=en\b/.test(location.search)) { save('en'); return; }

  var chosen = load();
  if (chosen) {
    if (chosen !== 'en' && SUPPORTED.indexOf(chosen) >= 0) location.replace(page + '-' + chosen + '.html');
    return;
  }
  var langs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || 'en'];
  var first = String(langs[0]).toLowerCase().split('-')[0];        // 앱과 같이 1순위 언어만 본다
  if (SUPPORTED.indexOf(first) >= 0) location.replace(page + '-' + first + '.html');
})();
