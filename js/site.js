/* No Mouse Mode — page behaviour: labels and type-to-click on the page itself, the hero desktop, the feature
   demos, the race and the keyboard map. */
(function () {
  'use strict';
  var NM = window.NoMouse;
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var reduce = NM.reduceMotion;


  /* ================================================================ SELF-PLAYING DEMOS
     While a demo is on screen and nobody's using it, it shows itself off with the real keys, in a loop.
     Clicking it hands over the keyboard straight away; it starts again a few seconds after you leave. */
  var KEYCAP = { Space: 'Space', Enter: '↩ Return', Escape: 'esc', Backspace: '⌫', Tab: '⇥ Tab', Slash: '/', Backquote: '`',
    BracketLeft: '[', BracketRight: ']', ArrowUp: '↑', ArrowDown: '↓', ArrowLeft: '←', ArrowRight: '→', ShiftLeft: '⇧' };
  function capFor(code) { var m = /^(?:Key|Digit)(.)$/.exec(code); return m ? m[1] : (KEYCAP[code] || code); }
  function Cancelled() {}

  function autoplay(stage, script, opt) {
    opt = opt || {};
    var root = stage.root, run = null, visible = false, restartTimer = null;
    if (reduce) return;
    var cast = document.createElement('div'); cast.className = 'keycast'; cast.setAttribute('aria-hidden', 'true');
    root.appendChild(cast);
    var castTimer;
    function show(text) {
      var chip = document.createElement('kbd'); chip.textContent = text;
      cast.appendChild(chip);
      while (cast.children.length > 4) cast.removeChild(cast.firstChild);
      clearTimeout(castTimer);
      castTimer = setTimeout(function () { cast.innerHTML = ''; }, 1600);
    }
    function api(token) {
      function check() { if (token.cancelled) throw new Cancelled(); }
      var a = {
        stage: stage,
        wait: function (ms) { return new Promise(function (resolve, reject) { setTimeout(function () { token.cancelled ? reject(new Cancelled()) : resolve(); }, ms); }); },
        down: function (code, mods) { check(); stage.keyDown(code, Object.assign({ shiftKey: !!stage.held.Shift, key: '' }, mods || {})); },
        up: function (code) { check(); stage.keyUp(code); },
        press: async function (code, mods, label) {
          mods = mods || {};
          show(label || ((mods.shiftKey ? '⇧' : '') + (mods.altKey ? '⌥' : '') + (mods.ctrlKey ? '⌃' : '') + capFor(code)));
          a.down(code, mods); await a.wait(70); a.up(code); await a.wait(opt.gap || 260);
        },
        hold: async function (code, ms) { show(capFor(code) + ' (hold)'); a.down(code); await a.wait(ms); a.up(code); await a.wait(200); },
        type: async function (text) {
          for (var i = 0; i < text.length; i++) {
            var ch = text[i], code = ch === ' ' ? 'Space' : /\d/.test(ch) ? 'Digit' + ch : 'Key' + ch.toUpperCase();
            show(ch === ' ' ? 'Space' : ch);
            a.down(code, { key: ch }); await a.wait(40); a.up(code); await a.wait(110);
          }
        },
        /** Where an element's middle is, in the stage's coordinates. */
        at: function (el, fx, fy) {
          var r = root.getBoundingClientRect(), b = el.getBoundingClientRect();
          return { x: b.left - r.left + b.width * (fx == null ? 0.5 : fx), y: b.top - r.top + b.height * (fy == null ? 0.5 : fy) };
        },
        /** Steers there with W A S D like a person would, then settles exactly. */
        moveTo: async function (p, opts) {
          var keys = { KeyW: false, KeyA: false, KeyS: false, KeyD: false }, shown = '';
          for (var i = 0; i < 400; i++) {
            check();
            var dx = p.x - stage.x, dy = p.y - stage.y;
            if (Math.abs(dx) < 14 && Math.abs(dy) < 14) break;
            var want = { KeyD: dx > 13, KeyA: dx < -13, KeyS: dy > 13, KeyW: dy < -13 };
            var label = Object.keys(want).filter(function (k) { return want[k]; }).map(capFor).join(' ');
            if (label !== shown) { show(label); shown = label; }
            Object.keys(want).forEach(function (k) {
              if (want[k] && !keys[k]) { stage.keyDown(k); keys[k] = true; }
              if (!want[k] && keys[k]) { stage.keyUp(k); keys[k] = false; }
            });
            await a.wait(24);
          }
          Object.keys(keys).forEach(function (k) { if (keys[k]) stage.keyUp(k); });
          stage.x = p.x; stage.y = p.y; stage.place();
          await a.wait((opts && opts.pause) || 220);
        },
        moveToEl: function (el, fx, fy, opts) { return a.moveTo(a.at(el, fx, fy), opts); },
        /** Opens labels (if needed) and types the one on `el`, holding `mods` with the last letter. */
        pickLabel: async function (el, mods) {
          if (!stage.hints) { await a.press('KeyF'); await a.wait(350); }
          var item = stage.hints && stage.hints.items.filter(function (it) { return it.el === el || it.el.contains(el) || el.contains(it.el); })[0];
          if (!item) { if (stage.hints) await a.press('Escape'); return; }
          var letters = item.label.split('');
          for (var i = 0; i < letters.length; i++) {
            var last = i === letters.length - 1;
            await a.press('Key' + letters[i], last ? mods : null);
          }
          await a.wait(300);
        },
        /** E, then the cells around `p`, then a click. */
        gridTo: async function (p, click) {
          await a.press('KeyE'); await a.wait(200);
          var r = root.getBoundingClientRect(), reg = { x: 0, y: 0, w: r.width, h: r.height }, cells = 'QWEASDZXC';
          for (var i = 0; i < 6 && stage.grid; i++) {
            var col = Math.min(2, Math.max(0, Math.floor((p.x - reg.x) / (reg.w / 3)))), row = Math.min(2, Math.max(0, Math.floor((p.y - reg.y) / (reg.h / 3))));
            await a.press('Key' + cells[row * 3 + col], null);
            reg = { x: reg.x + col * reg.w / 3, y: reg.y + row * reg.h / 3, w: reg.w / 3, h: reg.h / 3 };
            if (Math.hypot(reg.x + reg.w / 2 - p.x, reg.y + reg.h / 2 - p.y) < 8) break;
          }
          if (click !== false) await a.press('Space');
        }
      };
      return a;
    }
    function start() {
      if (run || NM.isActive() && root.classList.contains('is-active') || !visible) return;
      var token = { cancelled: false };
      run = token;
      stage.auto = true;
      root.classList.add('is-auto');
      (async function loop() {
        try {
          await api(token).wait(opt.startDelay || 600);
          for (;;) {
            await script(api(token));
            await api(token).wait(opt.pause || 1400);
            stage.releaseAll();
            if (opt.reset) opt.reset();
            stage.reset();
          }
        } catch (e) {
          if (!(e instanceof Cancelled)) { if (window.console) console.error(e); }
        }
      })();
    }
    function stop(reset) {
      if (!run) return;
      run.cancelled = true; run = null;
      stage.auto = false;
      stage.releaseAll();
      cast.innerHTML = '';
      root.classList.remove('is-auto');
      if (reset) { if (opt.reset) opt.reset(); stage.reset(); }
    }
    // Hand over the moment someone clicks in; play again a few seconds after they leave.
    stage.on('activate', function () { clearTimeout(restartTimer); stop(true); });
    stage.on('deactivate', function () { clearTimeout(restartTimer); restartTimer = setTimeout(start, 5000); });
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible) start(); else stop(true);
    }, { threshold: 0.55 }).observe(root);
    return { start: start, stop: stop };
  }


  /** Runs `step` again and again while `el` is on screen, pausing for a while after someone uses it. */
  function loopWhileVisible(el, step, every) {
    if (reduce) return;
    var visible = false, timer = null, pausedUntil = 0;
    function tick() {
      timer = null;
      if (!visible) return;
      if (Date.now() >= pausedUntil) step();
      timer = setTimeout(tick, every);
    }
    el.addEventListener('pointerdown', function () { pausedUntil = Date.now() + 8000; });
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible && !timer) timer = setTimeout(tick, 500);
    }, { threshold: 0.5 }).observe(el);
    return { pause: function (ms) { pausedUntil = Date.now() + ms; } };
  }

  /* ================================================================ THE PAGE ITSELF
     Like the app on your Mac: F puts labels on every link and button you can see, / lets you type one's
     name. Only while no demo has the keyboard, and never with ⌘/⌃/⌥ held. */
  (function pageKeys() {
    var labels = null, search = null;
    function visible() {
      return $$('a[href], button, summary').filter(function (node) {
        if (node.closest('.nm-stage, [data-nm-keypad], .keys, .keypad, .hold-keys, [hidden]')) return false;
        var b = node.getBoundingClientRect();
        // Hidden under the sticky bar, unless it's the bar itself.
        if (b.width < 4 || b.height < 4 || (b.bottom < 60 && !node.closest('.nav')) || b.top > window.innerHeight - 4 || b.right < 0 || b.left > window.innerWidth) return false;
        var top = document.elementFromPoint(Math.min(Math.max(b.left + b.width / 2, 1), window.innerWidth - 1), Math.min(Math.max(b.top + b.height / 2, 1), window.innerHeight - 1));
        return top && (node === top || node.contains(top) || top.contains(node));
      });
    }
    function activate(node) {
      node.classList.add('page-picked');
      setTimeout(function () { node.classList.remove('page-picked'); node.click(); }, reduce ? 0 : 140);
    }
    function closeLabels() { if (labels) { labels.layer.remove(); labels = null; } }
    function closeSearch() { if (search) { search.layer.remove(); search = null; } }
    function openLabels() {
      var nodes = visible();
      if (!nodes.length) return;
      var names = NM.hintLabels(nodes.length);
      var layer = document.createElement('div'); layer.className = 'page-layer';
      labels = { layer: layer, typed: '', items: nodes.map(function (node, i) {
        var b = node.getBoundingClientRect(), tag = document.createElement('span');
        tag.className = 'nm-hint page-hint'; tag.textContent = names[i];
        tag.style.left = Math.max(2, b.left - 6) + 'px'; tag.style.top = Math.max(2, b.top + b.height / 2 - 10) + 'px';
        layer.appendChild(tag);
        return { node: node, label: names[i], tag: tag };
      }) };
      var bar = document.createElement('div'); bar.className = 'nm-tipbar page-bar';
      bar.innerHTML = '<b>Labels on this page</b><span>type one to click it</span><span><kbd>esc</kbd> close</span>';
      layer.appendChild(bar);
      document.body.appendChild(layer);
    }
    function openSearch() {
      var nodes = visible().filter(function (n) { return NM.nameOf(n); });
      var layer = document.createElement('div'); layer.className = 'page-layer';
      var boxes = document.createElement('div'); layer.appendChild(boxes);
      var bar = document.createElement('div'); bar.className = 'nm-tipbar page-bar'; layer.appendChild(bar);
      document.body.appendChild(layer);
      search = { layer: layer, boxes: boxes, bar: bar, nodes: nodes, query: '', matches: [], sel: 0 };
      renderSearch();
    }
    function renderSearch() {
      var s = search;
      s.boxes.innerHTML = '';
      s.matches.forEach(function (node, i) {
        var b = node.getBoundingClientRect(), box = document.createElement('span');
        box.className = 'nm-match page-match' + (i === s.sel ? ' sel' : '');
        box.style.left = (b.left - 4) + 'px'; box.style.top = (b.top - 3) + 'px'; box.style.width = (b.width + 8) + 'px'; box.style.height = (b.height + 6) + 'px';
        s.boxes.appendChild(box);
      });
      var count = !s.query ? 'type a link or button' : !s.matches.length ? 'no match' : (s.sel + 1) + ' of ' + s.matches.length;
      s.bar.innerHTML = '<b>Type to click</b><span class="nm-q">' + s.query.replace(/</g, '&lt;') + (s.query ? '<i></i>' : '') + '</span><span class="nm-count">' + count + '</span><span><kbd>↩</kbd> click</span><span><kbd>tab</kbd> next</span><span><kbd>esc</kbd></span>';
    }
    document.addEventListener('keydown', function (e) {
      if (NM.isActive() || e.metaKey || e.ctrlKey || e.altKey) return;
      var t = e.target;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      if (t && t.closest && t.closest('#kbd')) return;
      if (labels) {
        e.preventDefault();
        if (e.code === 'Escape') { closeLabels(); return; }
        if (e.code === 'Backspace') { labels.typed = labels.typed.slice(0, -1); }
        else {
          var m = /^Key([A-Z])$/.exec(e.code);
          if (!m) return;
          var typed = labels.typed + m[1];
          var hits = labels.items.filter(function (it) { return it.label.indexOf(typed) === 0; });
          if (!hits.length) return;
          if (hits.length === 1 && hits[0].label === typed) { var node = hits[0].node; closeLabels(); activate(node); return; }
          labels.typed = typed;
        }
        labels.items.forEach(function (it) {
          var match = it.label.indexOf(labels.typed) === 0;
          it.tag.classList.toggle('nm-hint-dim', !match);
          it.tag.innerHTML = match && labels.typed ? '<b>' + labels.typed + '</b>' + it.label.slice(labels.typed.length) : it.label;
        });
        return;
      }
      if (search) {
        e.preventDefault();
        var s = search;
        if (e.code === 'Escape') { closeSearch(); return; }
        if (e.code === 'Enter') { var pick = s.matches[s.sel]; closeSearch(); if (pick) activate(pick); return; }
        if (e.code === 'Tab' || e.code === 'ArrowDown') { if (s.matches.length) s.sel = (s.sel + (e.shiftKey ? -1 : 1) + s.matches.length) % s.matches.length; renderSearch(); return; }
        if (e.code === 'ArrowUp') { if (s.matches.length) s.sel = (s.sel - 1 + s.matches.length) % s.matches.length; renderSearch(); return; }
        if (e.code === 'Backspace') s.query = s.query.slice(0, -1);
        else if (e.key.length === 1) s.query += e.key;
        else return;
        s.matches = s.query ? s.nodes.map(function (n) { return { n: n, score: NM.matchScore(NM.nameOf(n), s.query) }; })
          .filter(function (x) { return x.score > 0; }).sort(function (a, b) { return b.score - a.score; }).map(function (x) { return x.n; }) : [];
        s.sel = 0;
        renderSearch();
        return;
      }
      if (e.code === 'KeyF' && !e.shiftKey) { e.preventDefault(); openedAt = window.scrollY; openLabels(); }
      else if (e.code === 'Slash' && !e.shiftKey) { e.preventDefault(); openedAt = window.scrollY; openSearch(); }
    });
    // Labels and highlights follow their links while the page scrolls.
    var openedAt = 0;
    window.addEventListener('scroll', function () {
      if (labels) labels.items.forEach(function (it) {
        var b = it.node.getBoundingClientRect();
        it.tag.style.left = Math.max(2, b.left - 6) + 'px'; it.tag.style.top = (b.top + b.height / 2 - 10) + 'px';
      });
      if (search) renderSearch();
    }, { passive: true });
    window.addEventListener('resize', function () { closeLabels(); closeSearch(); });
    document.addEventListener('pointerdown', function (e) { if (!e.target.closest('.page-layer')) { closeLabels(); closeSearch(); } });
    $$('[data-page-labels]').forEach(function (b) { b.addEventListener('click', function (e) { e.preventDefault(); openedAt = window.scrollY; setTimeout(openLabels, 30); }); });
    $$('[data-page-search]').forEach(function (b) { b.addEventListener('click', function (e) { e.preventDefault(); openedAt = window.scrollY; setTimeout(openSearch, 30); }); });
  })();

  /* ================================================================ HERO DESKTOP */
  (function hero() {
    var root = $('#hero-stage');
    if (!root) return;
    var stage = new NM.Stage(root, { speed: 560, scrollSpeed: 560, start: { x: 0.56, y: 0.55 } });
    var toastEl = $('.toast', root), toastTimer;
    var notes = $('[data-win="notes"]', root), guide = $('[data-win="guide"]', root);
    var ctx = $('[data-ctx]', root);
    var moved = 0, last = null, gridRecent = 0, hintRecent = 0, searchRecent = 0;
    var scrolled = { down: false, side: false };
    var done = {}, total = $$('[data-ch]').length;

    function toast(text) {
      toastEl.textContent = text;
      toastEl.classList.add('show');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 2200);
    }
    function complete(id) {
      if (stage.auto || done[id]) return;
      done[id] = true;
      var li = $('[data-ch="' + id + '"]');
      li.classList.add('done', 'just-done');
      setTimeout(function () { li.classList.remove('just-done'); }, 500);
      var count = Object.keys(done).length;
      $('[data-ch-count]').textContent = count;
      if (count === total) $('.ch-done').hidden = false;
    }
    function front(win) {
      $$('.win', root).forEach(function (w) { w.classList.toggle('front', w === win); });
    }
    function openNotes() {
      notes.hidden = false;
      front(notes);
      complete('open');
    }
    function closeCtx() { ctx.hidden = true; }

    stage.on('toast', toast);
    stage.on('move', function (p) {
      if (last) moved += Math.abs(p.x - last.x) + Math.abs(p.y - last.y);
      last = { x: p.x, y: p.y };
      if (moved > 120 && !p.jump) complete('move');
    });
    stage.on('grid', function () { gridRecent = Date.now(); });
    stage.on('hints', function () { hintRecent = Date.now(); });
    stage.on('search', function () { searchRecent = Date.now(); });
    stage.on('scroll', function (s) {
      if (s.el.matches('[data-scrollbox="guide"]') && s.el.scrollTop > 40) scrolled.down = true;
      if (s.el.matches('[data-scrollbox="strip"]') && s.el.scrollLeft > 40) scrolled.side = true;
      if (scrolled.down && scrolled.side) complete('scroll');
    });
    stage.on('click', function (c) {
      if (!c.right) closeCtx();
      var win = c.target && c.target.closest('.win');
      if (win) front(win);
      if (!c.target || !c.target.closest('[data-file],[data-folder]')) $$('.desk-icon.selected', root).forEach(function (i) { i.classList.remove('selected'); });
    });

    root.addEventListener('nm-click', function (e) {
      var t = e.target, count = e.detail.count;
      if (t.matches('.desk-icon')) {
        $$('.desk-icon.selected', root).forEach(function (i) { i.classList.remove('selected'); });
        t.classList.add('selected');
        if (count >= 2) {
          if (t.matches('[data-app="notes"]')) openNotes();
          else if (t.matches('[data-folder]')) toast('Projects holds ' + ($('[data-file="report"]', root).hidden ? 'Report.pdf' : 'nothing yet') + '.');
          else toast('Opening ' + t.textContent.trim() + '…');
        }
      } else if (t.matches('[data-target]')) {
        t.classList.add('hit');
        if (Date.now() - gridRecent < 6000) { complete('grid'); toast('Bullseye. That was the jump grid.'); }
        else toast('Hit! Now try reaching it with E and the grid.');
        setTimeout(function () { t.classList.remove('hit'); }, 1200);
      } else if (t.matches('[data-action]')) {
        var action = t.getAttribute('data-action');
        if (action === 'save') {
          t.classList.add('done'); t.textContent = 'Saved';
          if (Date.now() - hintRecent < 8000) complete('hint');
          else toast('Saved. Now try it with F and the letters.');
          setTimeout(function () { t.classList.remove('done'); t.textContent = 'Save'; }, 1500);
        } else {
          toast(t.textContent.trim() + ' — try Save.');
        }
      } else if (t.matches('[data-ctx-item]')) {
        closeCtx();
        if (t.getAttribute('data-ctx-item') === 'folder') newFolder();
        else toast(t.textContent.trim());
      } else if (t.matches('[data-menu]')) {
        toast('The ' + t.getAttribute('data-menu') + ' menu. On your Mac, F labels every menu too.');
      } else if (t.matches('[data-dock-app]')) {
        var app = t.getAttribute('data-dock-app');
        if (app === 'Notes') openNotes();
        else if (app === 'Music' && Date.now() - searchRecent < 10000) { complete('search'); toast('Found Music by typing its name.'); }
        else toast('Opening ' + app + '…');
      }
    });

    root.addEventListener('nm-rightclick', function (e) {
      var desk = $('.desk', root).getBoundingClientRect(), r = root.getBoundingClientRect();
      ctx.hidden = false;
      var x = stage.x, y = stage.y - (desk.top - r.top);
      ctx.style.left = Math.min(x, desk.width - ctx.offsetWidth - 6) + 'px';
      ctx.style.top = Math.min(y, desk.height - ctx.offsetHeight - 6) + 'px';
    });
    // A right-click anywhere (even on bare wallpaper, which has no target) opens the menu.
    stage.on('click', function (c) {
      if (c.right && !c.target) root.dispatchEvent(new CustomEvent('nm-rightclick'));
    });

    root.addEventListener('nm-drop', function (e) {
      if (e.target.matches('[data-folder="projects"]') && e.detail.item.matches('[data-file="report"]')) {
        e.detail.item.hidden = true;
        complete('drag');
        toast('Report.pdf moved to Projects.');
      }
    });

    var folders = 0;
    function newFolder() {
      folders++;
      var icon = document.createElement('div');
      icon.className = 'desk-icon';
      icon.setAttribute('data-click', '');
      icon.setAttribute('data-drag', '');
      icon.setAttribute('data-new-folder', '');
      icon.style.left = Math.min(Math.max(stage.x - 42, 6), root.offsetWidth - 96) + 'px';
      icon.style.top = Math.max(stage.y - 50, 10) + 'px';
      icon.innerHTML = '<span class="ico ico-folder"></span><span class="ico-label">untitled folder' + (folders > 1 ? ' ' + folders : '') + '</span>';
      $('.desk', root).appendChild(icon);
      complete('menu');
    }

    /** Puts the desktop back the way it started (not the challenge list). */
    function tidy() {
      moved = 0; last = null; scrolled = { down: false, side: false };
      notes.hidden = true; closeCtx(); front(guide);
      $('[data-file="report"]', root).hidden = false;
      $$('[data-new-folder]', root).forEach(function (n) { n.remove(); });
      $$('.desk-icon.selected', root).forEach(function (i) { i.classList.remove('selected'); });
      $('[data-scrollbox="guide"]', root).scrollTop = 0;
      $('[data-scrollbox="strip"]', root).scrollLeft = 0;
      toastEl.classList.remove('show');
    }
    $('[data-reset]').addEventListener('click', function () {
      done = {};
      $$('[data-ch]').forEach(function (li) { li.classList.remove('done'); });
      $('[data-ch-count]').textContent = '0';
      $('.ch-done').hidden = true;
      tidy();
      stage.reset();
    });
    $('.cover-btn', root).addEventListener('click', function () { stage.activate(); });

    autoplay(stage, async function (a) {
      var desk = $('.desk', root);
      await a.moveToEl($('[data-app="notes"]', root), 0.5, 0.35);
      await a.press('Space'); await a.press('Space', null, 'Space ×2'); await a.wait(500);
      await a.pickLabel($('[data-action="save"]', root)); await a.wait(700);
      await a.press('Slash'); await a.type('music'); await a.wait(300); await a.press('Enter'); await a.wait(900);
      var guideBox = $('[data-scrollbox="guide"]', root);
      await a.moveToEl($('[data-scrollbox="strip"]', root), 0.5, 0.5);
      await a.hold('ArrowRight', 700);
      await a.moveToEl(guideBox, 0.5, 0.75);
      await a.hold('ArrowDown', 900);
      await a.gridTo(a.at($('[data-target]', root))); await a.wait(800);
      await a.moveToEl($('[data-file="report"]', root), 0.5, 0.35);
      a.down('Space'); await a.wait(150);
      await a.moveToEl($('[data-folder="projects"]', root), 0.5, 0.35, { pause: 150 });
      a.up('Space'); await a.wait(900);
      await a.moveTo({ x: desk.offsetWidth * 0.66, y: desk.offsetHeight * 0.62 });
      await a.press('Enter'); await a.wait(500);
      await a.moveToEl($('[data-ctx-item="folder"]', root), 0.3, 0.5);
      await a.press('Space'); await a.wait(700);
      await a.press('KeyH'); await a.wait(2200); await a.press('KeyH');
    }, { reset: tidy, startDelay: 900, pause: 1800 });
  })();

  /* ================================================================ CLICK LABELS */
  (function labels() {
    var root = $('#demo-hints');
    if (!root) return;
    var stage = new NM.Stage(root, { features: ['hints', 'click'], start: { x: 0.55, y: 0.7 } });
    var tasks = [
      { name: 'Archive', kind: 'left', text: 'Click <b>Archive</b>' },
      { name: 'the email from Sam', kind: 'right', text: 'Right-click <b>Sam</b>’s email: <kbd>⇧</kbd> with the last letter' },
      { name: 'Drafts', kind: 'double', text: 'Double-click <b>Drafts</b>: <kbd>⌥</kbd> with the last letter' },
      { name: 'Flag', kind: 'left', text: 'Click <b>Flag</b>' },
      { name: 'the email from Mia', kind: 'left', text: 'Click <b>Mia</b>’s email' },
      { name: 'Forward', kind: 'right', text: 'Right-click <b>Forward</b> (<kbd>⇧</kbd>)' }
    ];
    var index = 0, score = 0;
    function show() { $('[data-hint-task]').innerHTML = tasks[index].text; }
    show();
    var name = function (n) { return $('[data-name="' + n + '"]', root); };
    autoplay(stage, async function (a) {
      for (var i = 0; i < 3; i++) {
        var t = tasks[i];
        $('[data-hint-task]').innerHTML = t.text;
        await a.wait(500);
        await a.pickLabel(name(t.name), t.kind === 'right' ? { shiftKey: true } : t.kind === 'double' ? { altKey: true } : null);
        await a.wait(900);
      }
    }, { reset: function () { index = 0; show(); } });
    stage.on('pick', function (p) {
      var t = p.target && p.target.closest('[data-name]');
      if (!t) return;
      if (stage.auto) { t.classList.add('flash'); setTimeout(function () { t.classList.remove('flash'); }, 600); return; }
      var task = tasks[index];
      var ok = t.getAttribute('data-name') === task.name && p.kind === task.kind;
      t.classList.add(ok ? 'flash' : 'wrong');
      setTimeout(function () { t.classList.remove('flash', 'wrong'); }, 600);
      if (ok) { score++; $('[data-hint-score]').textContent = score; index = (index + 1) % tasks.length; show(); }
      else if (t.getAttribute('data-name') === task.name) $('[data-hint-task]').innerHTML = task.text + ' <span class="try">· right one, wrong kind of click</span>';
    });
  })();

  /* ================================================================ TYPE TO CLICK */
  (function typeToClick() {
    var root = $('#demo-search');
    if (!root) return;
    var stage = new NM.Stage(root, { features: ['search', 'click'], start: { x: 0.7, y: 0.6 } });
    var names = $$('[data-name]', root).map(function (n) { return n.getAttribute('data-name'); });
    var task = 'Bluetooth', score = 0, pane = $('[data-pane-title]', root);
    function next() {
      var options = names.filter(function (n) { return n !== task; });
      task = options[Math.floor(Math.random() * options.length)];
      $('[data-search-task]').textContent = task;
    }
    root.addEventListener('nm-click', function (e) {
      var t = e.target.closest('[data-name]');
      if (!t) return;
      $$('.set-item.on', root).forEach(function (i) { i.classList.remove('on'); });
      t.classList.add('on');
      pane.textContent = t.getAttribute('data-name');
      if (!stage.auto && t.getAttribute('data-name') === task) { score++; $('[data-search-score]').textContent = score; next(); }
    });
    autoplay(stage, async function (a) {
      var plays = [['Bluetooth', 'blu'], ['Displays', 'disp'], ['Desktop & Dock', 'dd'], ['Keyboard', 'key']];
      for (var i = 0; i < plays.length; i++) {
        $('[data-search-task]').textContent = plays[i][0];
        await a.press('Slash'); await a.type(plays[i][1]); await a.wait(500); await a.press('Enter'); await a.wait(1000);
      }
    }, { reset: function () { $$('.set-item.on', root).forEach(function (i) { i.classList.remove('on'); }); pane.textContent = 'General'; $('[data-search-task]').textContent = task; } });
  })();

  /* ================================================================ MOVE */
  (function move() {
    var root = $('#demo-move');
    if (!root) return;
    var stage = new NM.Stage(root, { features: ['move', 'precision'], speed: 380, start: { x: 0.5, y: 0.6 } });
    var layer = $('.move-dots', root), got = 0, dots = [];
    var spots = [[0.15, 0.3, 0], [0.85, 0.25, 0], [0.7, 0.8, 0], [0.25, 0.8, 0], [0.5, 0.25, 1], [0.9, 0.62, 1]];
    function layout() {
      layer.innerHTML = ''; dots = []; got = 0;
      $('[data-move-count]').textContent = '0';
      spots.forEach(function (s) {
        var d = document.createElement('span');
        d.className = 'dot' + (s[2] ? ' tiny' : '');
        d.style.left = s[0] * 100 + '%'; d.style.top = s[1] * 100 + '%';
        layer.appendChild(d);
        dots.push({ el: d, x: s[0], y: s[1], r: s[2] ? 6 : 14 });
      });
    }
    layout();
    var shown = 0;
    autoplay(stage, async function (a) {
      var w = root.clientWidth, h = root.clientHeight;
      for (var i = 0; i < 4; i++) await a.moveTo({ x: spots[i][0] * w, y: spots[i][1] * h }, { pause: 120 });
      stage.keyDown('ShiftLeft'); await a.moveTo({ x: spots[5][0] * w, y: spots[5][1] * h }); stage.keyUp('ShiftLeft');
      await a.moveTo({ x: spots[4][0] * w, y: spots[4][1] * h });
    }, { reset: layout });
    stage.on('move', function (p) {
      var w = root.clientWidth, h = root.clientHeight;
      dots.forEach(function (d) {
        if (d.got) return;
        if (Math.hypot(p.x - d.x * w, p.y - d.y * h) <= d.r) {
          d.got = true; d.el.classList.add('got'); got++;
          $('[data-move-count]').textContent = got;
          if (got === dots.length) setTimeout(layout, 900);
        }
      });
      var mode = p.precise ? 'Precise' : p.boost ? 'Fast' : 'Normal';
      var modeEl = $('[data-move-mode]');
      modeEl.textContent = mode; modeEl.setAttribute('data-mode', mode);
      shown = shown * 0.7 + (p.precise ? 0 : p.speed || 0) * 0.3;
      $('[data-move-speed]').textContent = Math.round(shown);
    });
    stage.on('key', function (k) {
      if (k.code === 'Shift' || k.code === 'KeyQ') {
        var mode = stage.held.KeyQ ? 'Precise' : stage.held.Shift ? 'Fast' : 'Normal';
        var modeEl = $('[data-move-mode]'); modeEl.textContent = mode; modeEl.setAttribute('data-mode', mode);
      }
      if (!k.down && !stage.held.KeyW && !stage.held.KeyA && !stage.held.KeyS && !stage.held.KeyD) {
        setTimeout(function () { shown = 0; $('[data-move-speed]').textContent = '0'; }, 120);
      }
    });
  })();

  /* ================================================================ CLICK */
  (function click() {
    var root = $('#demo-click');
    if (!root) return;
    var stage = new NM.Stage(root, { features: ['move', 'click', 'drag', 'precision'], speed: 380, start: { x: 0.2, y: 0.22 } });
    var para = $('[data-paragraph]', root), note = $('[data-click-note]'), archived = 0;
    function clearSel() { para.classList.remove('sel-all'); $$('.sel', para).forEach(function (s) { s.classList.remove('sel'); }); }
    stage.on('click', function (c) {
      var names = { 1: 'Click', 2: 'Double-click', 3: 'Triple-click' };
      note.innerHTML = '<b>' + (c.right ? 'Right-click' : names[Math.min(c.count, 3)] || 'Click') + '</b>' + (c.target ? '' : ' on nothing');
      if (!c.target || !c.target.closest('[data-paragraph]')) clearSel();
    });
    root.addEventListener('nm-click', function (e) {
      var t = e.target;
      if (!t.matches('[data-select]')) return;
      clearSel();
      if (e.detail.count === 2) t.classList.add('sel');
      else if (e.detail.count >= 3) para.classList.add('sel-all');
    });
    autoplay(stage, async function (a) {
      var words = $$('[data-select]', root);
      await a.moveToEl(words[2]); await a.press('Space'); await a.press('Space', null, 'Space ×2'); await a.wait(900);
      await a.moveToEl(words[7]); await a.press('Space'); await a.press('Space'); await a.press('Space', null, 'Space ×3'); await a.wait(900);
      await a.moveToEl($('.file-chip', root));
      a.down('Space'); await a.wait(150);
      await a.moveToEl($('.folder-drop', root), 0.5, 0.5, { pause: 150 }); a.up('Space'); await a.wait(700);
      await a.press('Enter'); await a.wait(600);
    }, { reset: function () { clearSel(); $$('.file-chip', root).forEach(function (c) { c.classList.remove('gone'); }); archived = 0; $('[data-drop-count]', root).textContent = '0'; note.textContent = 'Waiting for a click'; } });
    root.addEventListener('nm-drop', function (e) {
      if (!e.target.matches('.folder-drop')) return;
      e.detail.item.classList.add('gone');
      archived++;
      $('[data-drop-count]', root).textContent = archived;
      note.innerHTML = '<b>Dragged</b> into Archive';
      if (!$$('.file-chip:not(.gone)', root).length) {
        setTimeout(function () { $$('.file-chip', root).forEach(function (c) { c.classList.remove('gone'); }); }, 1400);
      }
    });
  })();

  /* ================================================================ BROWSER: middle, back, forward */
  (function browser() {
    var root = $('#demo-browser');
    if (!root) return;
    var stage = new NM.Stage(root, { features: ['move', 'click', 'buttons', 'hints', 'precision'], speed: 380, start: { x: 0.3, y: 0.45 } });
    var pages = { Home: ['Recipes', 'Travel', 'Photography'], Recipes: ['Pasta', 'Curry', 'Home'], Travel: ['Lisbon', 'Kyoto', 'Home'],
      Photography: ['Light', 'Lenses', 'Home'], Pasta: ['Recipes', 'Home'], Curry: ['Recipes', 'Home'], Lisbon: ['Travel', 'Home'],
      Kyoto: ['Travel', 'Home'], Light: ['Photography', 'Home'], Lenses: ['Photography', 'Home'] };
    var history = ['Home'], at = 0, tabs = 1, note = $('[data-browser-note]');
    var body = $('[data-browser-page]', root), url = $('[data-browser-url]', root), strip = $('[data-browser-tabs]', root);
    function render() {
      var page = history[at];
      url.textContent = 'example.com/' + (page === 'Home' ? '' : page.toLowerCase());
      body.innerHTML = '<h4>' + page + '</h4><p>Links on this page:</p>' + pages[page].map(function (p) {
        return '<span class="b-link" data-click data-link="' + p + '">' + p + '</span>';
      }).join('');
      $('[data-browser-back]', root).classList.toggle('off', at === 0);
      $('[data-browser-fwd]', root).classList.toggle('off', at === history.length - 1);
    }
    function addTab(name) {
      tabs++;
      var t = document.createElement('span'); t.className = 'b-tab new'; t.textContent = name;
      strip.appendChild(t);
      setTimeout(function () { t.classList.remove('new'); }, 400);
      if (strip.children.length > 4) strip.removeChild(strip.children[1]);
    }
    render();
    autoplay(stage, async function (a) {
      var link = function (n) { return $('[data-link="' + n + '"]', root); };
      await a.moveToEl(link('Travel')); await a.press('Space'); await a.wait(700);
      await a.moveToEl(link('Kyoto')); await a.press('Space'); await a.wait(700);
      await a.press('BracketLeft'); await a.wait(500); await a.press('BracketLeft'); await a.wait(700);
      await a.press('BracketRight'); await a.wait(700);
      await a.moveToEl(link('Lisbon')); await a.press('KeyM'); await a.wait(600);
      await a.moveToEl(link('Kyoto')); await a.press('KeyM'); await a.wait(800);
    }, { reset: function () { history = ['Home']; at = 0; while (strip.children.length > 1) strip.removeChild(strip.lastChild); render(); note.textContent = 'Click a link, then go back with ['; } });
    root.addEventListener('nm-click', function (e) {
      var link = e.target.closest('[data-link]');
      if (!link) return;
      history = history.slice(0, at + 1); history.push(link.getAttribute('data-link')); at++;
      render(); note.innerHTML = '<b>Clicked</b> a link';
    });
    stage.on('button', function (b) {
      if (b.which === 'back') {
        if (at > 0) { at--; render(); note.innerHTML = '<b>[</b> went back'; } else note.textContent = 'Nothing to go back to';
      } else if (b.which === 'forward') {
        if (at < history.length - 1) { at++; render(); note.innerHTML = '<b>]</b> went forward'; } else note.textContent = 'Nothing to go forward to';
      } else {
        var link = b.target && b.target.closest('[data-link]');
        if (link) { addTab(link.getAttribute('data-link')); note.innerHTML = '<b>M</b> opened it in a new tab'; }
        else note.textContent = 'Middle-click a link to open it in a new tab';
      }
    });
  })();

  /* ================================================================ SCROLL + SCROLL AREAS */
  (function scroll() {
    var root = $('#demo-scroll');
    if (!root) return;
    var stage = new NM.Stage(root, { features: ['move', 'scroll', 'areas'], speed: 360, scrollSpeed: 320, start: { x: 0.7, y: 0.5 } });
    var box = $('.doc-scroll', root), side = $('.doc-side', root), note = $('[data-scroll-note]');
    function report() {
      var pct = Math.round(box.scrollTop / Math.max(1, box.scrollHeight - box.clientHeight) * 100);
      var list = Math.round(side.scrollTop / Math.max(1, side.scrollHeight - side.clientHeight) * 100);
      note.innerHTML = 'Page <b>' + pct + '%</b> · List <b>' + list + '%</b>';
    }
    stage.on('scroll', report);
    autoplay(stage, async function (a) {
      await a.moveToEl(box, 0.5, 0.6);
      await a.hold('ArrowDown', 1100); await a.wait(400);
      await a.press('KeyJ'); await a.wait(600);
      await a.press('Digit1'); await a.wait(400);
      await a.press('KeyB'); await a.wait(900);
      await a.press('KeyT'); await a.wait(800);
      await a.press('Tab'); await a.wait(400);
      await a.press('Space'); await a.wait(700); await a.press('Space'); await a.wait(700);
      await a.press('KeyT'); await a.wait(700);
      await a.press('Escape');
    }, { reset: function () { box.scrollTop = 0; side.scrollTop = 0; $('.h-strip', root).scrollLeft = 0; report(); } });
    box.addEventListener('scroll', report, { passive: true });
    side.addEventListener('scroll', report, { passive: true });
  })();

  /* ================================================================ GRID */
  (function grid() {
    var root = $('#demo-grid');
    if (!root) return;
    var stage = new NM.Stage(root, { features: ['click', 'grid'], start: { x: 0.12, y: 0.15 } });
    var target = $('[data-target]', root), note = $('[data-grid-note]'), keys = 0, opened = 0;
    function place() {
      target.style.left = (8 + Math.random() * 84) + '%';
      target.style.top = (10 + Math.random() * 80) + '%';
      target.classList.remove('hit');
    }
    place();
    autoplay(stage, async function (a) {
      await a.wait(400);
      await a.gridTo(a.at(target)); await a.wait(1600);
      await a.gridTo(a.at(target)); await a.wait(1600);
    }, { reset: place });
    stage.on('grid', function (g) {
      if (g.open && g.keys === undefined) { keys = 1; opened = 1; }
      if (g.keys) keys = 1 + g.keys;
    });
    stage.on('click', function (c) {
      if (c.target === target) {
        target.classList.add('hit');
        note.innerHTML = opened ? '<b>Hit in ' + (keys + 1) + ' key presses.</b> Next one…' : '<b>Hit!</b> Next one…';
        keys = 0; opened = 0;
        setTimeout(function () { place(); note.textContent = 'Hit the target'; }, 1300);
      } else if (c.target === null && opened) {
        note.innerHTML = 'Close — press <kbd>E</kbd> and try again';
        keys = 0; opened = 0;
      }
    });
  })();

  /* ================================================================ SPOTS + SCREENS */
  (function spots() {
    var root = $('#demo-spots');
    if (!root) return;
    var stage = new NM.Stage(root, { features: ['move', 'spots', 'screens', 'precision'], speed: 420, start: { x: 0.2, y: 0.55 } });
    var steps = $$('[data-spot-step]'), done = {};
    var star = $('[data-star]', root);
    function mark(id) {
      if (done[id]) return;
      if (stage.auto) { var li = $('[data-spot-step="' + id + '"]'); li.classList.add('done'); done[id] = true; return; }
      done[id] = true;
      var li = $('[data-spot-step="' + id + '"]'); li.classList.add('done');
      if (Object.keys(done).length === steps.length) setTimeout(reset, 2500);
    }
    function reset() { done = {}; steps.forEach(function (s) { s.classList.remove('done'); }); }
    function onStar(p) {
      var r = root.getBoundingClientRect(), b = star.getBoundingClientRect();
      return Math.hypot(p.x - (b.left - r.left + b.width / 2), p.y - (b.top - r.top + b.height / 2)) < 22;
    }
    stage.on('screen', function () { mark('tab'); });
    autoplay(stage, async function (a) {
      await a.press('Tab'); await a.wait(700);
      await a.press('Tab', { shiftKey: true }, '⇧⇥ Tab'); await a.wait(500);
      await a.moveToEl(star);
      await a.press('Digit1', { shiftKey: true }, '⇧1'); await a.wait(600);
      await a.moveTo({ x: root.clientWidth * 0.8, y: root.clientHeight * 0.3 });
      await a.press('Digit1'); await a.wait(700);
      await a.press('Backquote'); await a.wait(700);
      await a.press('Backquote'); await a.wait(600);
    }, { reset: function () { reset(); $$('.nm-pin', root).forEach(function (n) { n.remove(); }); } });
    stage.on('spot', function (s) {
      if (s.saved && onStar(s)) mark('save');
      if (!s.saved && done.save && onStar(s)) mark('jump');
    });
    stage.on('back', function () { if (done.jump) mark('back'); });
  })();

  /* ================================================================ HOLD TO USE */
  (function hold() {
    var root = $('#demo-hold');
    if (!root) return;
    var key = $('[data-hold-key]', root), badge = $('[data-hold-badge]', root), dot = $('[data-hold-dot]', root), typed = $('[data-hold-typed]', root);
    var on = false, focused = false, pos = { x: 50, y: 50 }, text = '';
    function set(state) {
      on = state;
      key.classList.toggle('is-down', on);
      badge.textContent = on ? 'No Mouse ON' : 'No Mouse OFF';
      badge.classList.toggle('on', on);
    }
    function press(letter) {
      if (on) {
        var d = { w: [0, -12], a: [-10, 0], s: [0, 12], d: [10, 0] }[letter];
        if (!d) return;
        pos.x = Math.max(4, Math.min(92, pos.x + d[0])); pos.y = Math.max(6, Math.min(84, pos.y + d[1]));
        dot.style.left = pos.x + '%'; dot.style.top = pos.y + '%';
      } else {
        text = (text + letter).slice(-24);
        typed.textContent = 'Typed: ' + text;
      }
    }
    key.addEventListener('pointerdown', function (e) { e.preventDefault(); focused = true; key.setPointerCapture && key.setPointerCapture(e.pointerId); set(true); });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(function (t) { key.addEventListener(t, function () { if (on) set(false); }); });
    $$('[data-hold-letter]', root).forEach(function (b) {
      b.addEventListener('pointerdown', function (e) { e.preventDefault(); focused = true; b.classList.add('is-down'); press(b.getAttribute('data-hold-letter')); });
      ['pointerup', 'pointerleave'].forEach(function (t) { b.addEventListener(t, function () { b.classList.remove('is-down'); }); });
    });
    document.addEventListener('pointerdown', function (e) { if (!root.contains(e.target)) focused = false; });
    var holdLoop = loopWhileVisible(root, function () {
      if (focused) return;
      var seq = ['d', 'd', 's', 'd', 'w', 'a'], i = 0;
      pos = { x: 40, y: 45 }; dot.style.left = pos.x + '%'; dot.style.top = pos.y + '%'; typed.textContent = '';
      set(true);
      (function next() {
        if (focused) { set(false); return; }
        if (i < seq.length) {
          var b = $('[data-hold-letter="' + seq[i] + '"]', root); b.classList.add('is-down');
          press(seq[i]); setTimeout(function () { b.classList.remove('is-down'); }, 160);
          i++; setTimeout(next, 330); return;
        }
        set(false);
        text = '';
        ['h', 'i'].forEach(function (l, n) { setTimeout(function () { if (!focused) press(l); }, 500 + n * 260); });
      })();
    }, 4600);
    document.addEventListener('keydown', function (e) {
      if (!focused || e.metaKey || e.ctrlKey || e.altKey) return;
      var letter = { KeyW: 'w', KeyA: 'a', KeyS: 's', KeyD: 'd' }[e.code];
      if (!letter) return;
      e.preventDefault();
      press(letter);
    });
  })();

  /* ================================================================ SHORTCUTS PASS THROUGH */
  (function pass() {
    var root = $('#demo-pass');
    if (!root) return;
    var cursor = $('[data-pass-cursor]', root), saved = $('[data-pass-saved]', root), name = $('[data-pass-name]', root), note = $('[data-pass-note]');
    var y = 40, focused = false, timer;
    function plainS() {
      y = y > 120 ? 40 : y + 27;
      cursor.style.top = y + 'px';
      name.textContent = 'Untitled — Edited';
      note.innerHTML = '<b>S</b> moved the pointer down. No Mouse Mode used it.';
    }
    function cmdS() {
      saved.classList.add('show');
      name.textContent = 'Untitled — Saved';
      note.innerHTML = '<b>⌘S</b> went straight to the app and saved.';
      clearTimeout(timer);
      timer = setTimeout(function () { saved.classList.remove('show'); }, 1400);
    }
    $$('[data-pass]', root).forEach(function (b) {
      b.addEventListener('click', function () { focused = true; if (b.getAttribute('data-pass') === 's') plainS(); else cmdS(); });
    });
    var flip = 0;
    loopWhileVisible(root, function () {
      if (focused) return;
      var which = flip++ % 3 === 2 ? 'cmd-s' : 's';
      var b = $('[data-pass="' + which + '"]', root);
      b.classList.add('is-auto-press'); setTimeout(function () { b.classList.remove('is-auto-press'); }, 220);
      if (which === 's') plainS(); else cmdS();
    }, 1500);
    root.addEventListener('pointerdown', function () { focused = true; });
    document.addEventListener('pointerdown', function (e) { if (!root.contains(e.target)) focused = false; });
    document.addEventListener('keydown', function (e) {
      if (!focused || e.code !== 'KeyS' || e.ctrlKey || e.altKey) return;
      e.preventDefault();
      if (e.metaKey) cmdS(); else plainS();
    });
  })();

  /* ================================================================ PRACTICE PREVIEW */
  (function practice() {
    var root = $('#practice-mock');
    if (!root) return;
    var items = $$('[data-lesson]', root), i = 0;
    if (reduce) return;
    setInterval(function () {
      if (!root.getBoundingClientRect().height) return;
      items.forEach(function (it, n) { it.classList.toggle('current', n === i); it.classList.toggle('done', n < i); });
      $('[data-lesson-title]', root).textContent = items[i].getAttribute('data-lesson');
      $('[data-lesson-text]', root).innerHTML = items[i].getAttribute('data-text');
      i = (i + 1) % items.length;
    }, 1800);
  })();

  /* ================================================================ RACE */
  (function race() {
    var btn = $('[data-race-run]');
    if (!btn) return;
    var running = false;
    function lane(name) { return $('[data-race="' + name + '"]'); }
    function animateCursor(cursor, from, to, ms, done) {
      var start = performance.now();
      function frame(now) {
        var t = Math.min((now - start) / ms, 1), e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        cursor.style.left = from.x + (to.x - from.x) * e + '%';
        cursor.style.top = from.y + (to.y - from.y) * e + '%';
        if (t < 1) requestAnimationFrame(frame); else done && done();
      }
      requestAnimationFrame(frame);
    }
    function timer(name, ms) {
      var out = $('[data-race-time="' + name + '"]'), start = performance.now();
      function frame(now) {
        var t = Math.min(now - start, ms);
        out.textContent = (t / 1000).toFixed(1) + ' s';
        if (t < ms) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }
    function reset() {
      ['pad', 'nm'].forEach(function (n) {
        var l = lane(n);
        $('.race-btn', l).classList.remove('clicked');
        var c = $('.race-cursor', l); c.style.left = '18%'; c.style.top = '72%';
        $$('.race-tag', l).forEach(function (t) { t.remove(); });
      });
      $('.race-hand').style.bottom = '-60px';
      $('.race-keys').innerHTML = '';
    }
    function play() {
      if (running) return;
      running = true; reset();
      var scale = reduce ? 0.01 : 1;
      // Trackpad: hand travels over, aims (with a small overshoot), clicks, travels back: ~1.6 s.
      var pad = lane('pad'), padCursor = $('.race-cursor', pad), hand = $('.race-hand', pad);
      timer('pad', 1600 * scale || 1);
      hand.style.bottom = '8px';
      setTimeout(function () {
        animateCursor(padCursor, { x: 18, y: 72 }, { x: 74, y: 30 }, 520 * scale, function () {
          animateCursor(padCursor, { x: 74, y: 30 }, { x: 70, y: 37 }, 220 * scale, function () {
            setTimeout(function () { $('.race-btn', pad).classList.add('clicked'); hand.style.bottom = '-60px'; }, 120 * scale);
          });
        });
      }, 450 * scale);
      // No Mouse Mode: ⇧⌘Space, labels appear, type the label, clicked: ~0.5 s.
      var nm = lane('nm'), keys = $('.race-keys', nm);
      timer('nm', 520 * scale || 1);
      setTimeout(function () {
        keys.innerHTML = '<kbd>⇧⌘Space</kbd>';
        var tag = document.createElement('span'); tag.className = 'race-tag'; tag.textContent = 'S';
        var b = $('.race-btn', nm); tag.style.left = (b.offsetLeft - 6) + 'px'; tag.style.top = (b.offsetTop + 6) + 'px';
        nm.appendChild(tag);
      }, 120 * scale);
      setTimeout(function () {
        keys.innerHTML += '<kbd>S</kbd>';
        $$('.race-tag', nm).forEach(function (t) { t.remove(); });
        var c = $('.race-cursor', nm); c.style.left = '70%'; c.style.top = '37%';
        $('.race-btn', nm).classList.add('clicked');
      }, 420 * scale);
      setTimeout(function () { running = false; }, 1800 * scale);
    }
    btn.addEventListener('click', play);
    loopWhileVisible($('#race'), play, 3600);
  })();

  /* ================================================================ KEYBOARD MAP */
  (function keyboard() {
    var host = $('#kbd');
    if (!host) return;
    var used = {
      KeyW: ['move', 'W — move up', 'Hold to glide the pointer up. Tap to nudge.'],
      KeyA: ['move', 'A — move left', 'Hold to glide the pointer left.'],
      KeyS: ['move', 'S — move down', 'Hold to glide the pointer down. In the grid, S is the middle cell.'],
      KeyD: ['move', 'D — move right', 'Hold to glide the pointer right.'],
      KeyQ: ['move', 'Q — precise', 'Hold Q and every tap of W A S D moves exactly one pixel.'],
      ShiftLeft: ['move', 'Shift — fast', 'Hold Shift to move and scroll three times faster. With a number, it saves a spot.'],
      ShiftRight: ['move', 'Shift — fast', 'Hold Shift to move and scroll three times faster. With a number, it saves a spot.'],
      Space: ['click', 'Space — click', 'Tap to click, twice to double-click, three times to triple-click. Hold and move to drag.'],
      Enter: ['click', 'Return — right-click', 'Opens the context menu under the pointer.'],
      KeyM: ['click', 'M — middle click', 'Opens links in a new tab. (⇧⌘M, the on/off shortcut, uses the same key with ⇧⌘.)'],
      BracketLeft: ['click', '[ — back', 'The back button on a mouse: goes back in browsers, Finder and more.'],
      BracketRight: ['click', '] — forward', 'The forward button on a mouse.'],
      ArrowUp: ['scroll', '↑ — scroll up', 'Smoothly scrolls whatever is under the pointer.'],
      ArrowDown: ['scroll', '↓ — scroll down', 'Smoothly scrolls whatever is under the pointer.'],
      ArrowLeft: ['scroll', '← — scroll left', 'Sideways scrolling for timelines, spreadsheets and photo strips.'],
      ArrowRight: ['scroll', '→ — scroll right', 'Sideways scrolling for timelines, spreadsheets and photo strips.'],
      KeyJ: ['scroll', 'J — scroll areas', 'Numbers every scrollable part of the window. Pick one, then scroll, page with Space, or jump to the top or bottom with T and B. Anywhere: ⇧⌘J.'],
      KeyE: ['jump', 'E — jump grid', 'Splits the screen into a 3×3 grid. Pick a cell with Q W E / A S D / Z X C.'],
      KeyF: ['jump', 'F — click labels', 'Letters on everything clickable. Type them to click; hold ⇧, ⌘, ⌥ or ⌃ with the last letter for other clicks. Anywhere: ⇧⌘Space.'],
      Slash: ['jump', '/ — type to click', 'Type a button’s or a word’s name and press Return. Anywhere: ⇧⌘/.'],
      Tab: ['jump', 'Tab — next screen', 'Jumps the pointer to the middle of your next display. ⇧Tab goes back.'],
      Backquote: ['jump', '` — jump back', 'Returns the pointer to where it was before its last jump.'],
      Digit1: ['jump', '1–9 — saved spots', 'The number jumps to a saved spot; ⇧ and the number saves where the pointer is.'],
      KeyH: ['toggle', 'H — show keys', 'Shows every key at the bottom of the screen while No Mouse Mode is on.'],
      MetaRight: ['toggle', 'Right ⌘ — hold to use', 'Optional: hold it to use No Mouse Mode only while it is down.'],
      AltRight: ['toggle', 'Right ⌥ — hold to use', 'Optional: hold it instead of Right ⌘ if you prefer.']
    };
    ['Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9'].forEach(function (d) { used[d] = used.Digit1; });
    var rows = [
      [['Backquote', '`'], ['Digit1', '1'], ['Digit2', '2'], ['Digit3', '3'], ['Digit4', '4'], ['Digit5', '5'], ['Digit6', '6'], ['Digit7', '7'], ['Digit8', '8'], ['Digit9', '9'], ['Digit0', '0'], ['Minus', '-'], ['Equal', '='], ['Backspace', 'delete', 1.5]],
      [['Tab', 'tab', 1.5], ['KeyQ', 'Q'], ['KeyW', 'W'], ['KeyE', 'E'], ['KeyR', 'R'], ['KeyT', 'T'], ['KeyY', 'Y'], ['KeyU', 'U'], ['KeyI', 'I'], ['KeyO', 'O'], ['KeyP', 'P'], ['BracketLeft', '['], ['BracketRight', ']'], ['Backslash', '\\']],
      [['CapsLock', 'caps', 1.8], ['KeyA', 'A'], ['KeyS', 'S'], ['KeyD', 'D'], ['KeyF', 'F'], ['KeyG', 'G'], ['KeyH', 'H'], ['KeyJ', 'J'], ['KeyK', 'K'], ['KeyL', 'L'], ['Semicolon', ';'], ['Quote', "'"], ['Enter', 'return', 1.8]],
      [['ShiftLeft', 'shift', 2.3], ['KeyZ', 'Z'], ['KeyX', 'X'], ['KeyC', 'C'], ['KeyV', 'V'], ['KeyB', 'B'], ['KeyN', 'N'], ['KeyM', 'M'], ['Comma', ','], ['Period', '.'], ['Slash', '/'], ['ShiftRight', 'shift', 2.3]],
      [['Fn', 'fn'], ['ControlLeft', '⌃'], ['AltLeft', '⌥'], ['MetaLeft', '⌘', 1.3], ['Space', 'space', 5.4], ['MetaRight', '⌘', 1.3], ['AltRight', '⌥'], 'arrows']
    ];
    var map = {};
    rows.forEach(function (row) {
      var r = document.createElement('div'); r.className = 'kbd-row';
      row.forEach(function (k) {
        if (k === 'arrows') {
          var a = document.createElement('div'); a.className = 'k-arrows';
          [['ArrowUp', '↑'], ['ArrowLeft', '←'], ['ArrowDown', '↓'], ['ArrowRight', '→']].forEach(function (ak) { a.appendChild(makeKey(ak)); });
          r.appendChild(a); return;
        }
        r.appendChild(makeKey(k));
      });
      host.appendChild(r);
    });
    function makeKey(k) {
      var node = document.createElement('div');
      node.className = 'k';
      node.textContent = k[1];
      if (k[2]) node.style.flexGrow = k[2];
      var info = used[k[0]];
      if (info) {
        node.classList.add('k-used', 'cat-' + info[0]);
        node.addEventListener('pointerenter', function () { show(k[0]); });
        node.addEventListener('click', function () { show(k[0]); });
      }
      map[k[0]] = node;
      return node;
    }
    var title = $('[data-kbd-title]'), text = $('[data-kbd-text]');
    function show(code) {
      var info = used[code];
      $$('.k.is-focus', host).forEach(function (n) { n.classList.remove('is-focus'); });
      if (!info) { title.textContent = 'Types as usual'; text.textContent = 'Keys No Mouse Mode doesn’t use keep typing normally, even while it’s on.'; return; }
      if (map[code]) map[code].classList.add('is-focus');
      title.textContent = info[1]; text.textContent = info[2];
    }
    host.addEventListener('keydown', function (e) {
      if (e.metaKey && e.code !== 'MetaRight' || e.ctrlKey) return;
      // Tab still moves focus on (keyboard users must be able to leave), it just shows what it does first.
      if (e.code === 'Tab') { show('Tab'); return; }
      if (map[e.code]) { e.preventDefault(); map[e.code].classList.add('is-pressed'); show(e.code); }
    });
    host.addEventListener('keyup', function (e) { if (map[e.code]) map[e.code].classList.remove('is-pressed'); });
  })();

  NM.bindKeypads();
})();
