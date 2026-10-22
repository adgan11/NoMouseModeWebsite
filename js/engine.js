/* No Mouse Mode — in-browser engine behind every demo on the page.
   Mirrors the Mac app: W A S D move with an eased ramp (Shift = fast, Q = one pixel per tap),
   Space clicks (double/triple/drag), Return right-clicks, M / [ / ] are the middle, back and forward
   buttons, arrows scroll, E opens the 3×3 jump grid, F shows click labels (⇧ right-click, ⌥ double-click,
   ⌃ just move, Tab keeps them open), / is type to click, J picks a scroll area, Tab jumps between screens,
   1–9 jump to saved spots (⇧ saves), ` jumps back and H shows the keys. A stage only takes the keyboard
   while it's active (clicked or focused), and ⌘ shortcuts are always left to the browser. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var HINT_ALPHABET = 'ASDFJKLGHQWERUIOPTYZXCVBNM'.split('');
  var GRID_KEYS = ['KeyQ', 'KeyW', 'KeyE', 'KeyA', 'KeyS', 'KeyD', 'KeyZ', 'KeyX', 'KeyC'];
  var DIGITS = ['Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9'];
  var CAPTURED = ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyQ', 'KeyE', 'KeyF', 'KeyJ', 'KeyH', 'KeyM', 'Space', 'Enter',
    'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Escape', 'Backspace', 'Tab', 'Slash', 'Backquote',
    'BracketLeft', 'BracketRight'].concat(DIGITS);
  var ALL_FEATURES = ['move', 'click', 'drag', 'scroll', 'grid', 'hints', 'precision', 'search', 'areas', 'buttons', 'spots', 'screens', 'help'];
  var active = null;
  var stages = [];

  function el(tag, cls, parent) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (parent) parent.appendChild(node);
    return node;
  }

  function hintLabels(count) {
    var n = HINT_ALPHABET.length, length = 1, capacity = n;
    while (capacity < count) { length++; capacity *= n; }
    var out = [];
    for (var i = 0; i < count; i++) {
      var rest = i, label = '';
      for (var j = 0; j < length; j++) { label = HINT_ALPHABET[rest % n] + label; rest = Math.floor(rest / n); }
      out.push(label);
    }
    return out;
  }

  /* Type-to-click matching, the same rules as the app: case, spaces and accents don't matter, the start of
     any word works, and so do first letters ("nf" finds "New Folder"). Higher is better; 0 = no match. */
  function words(text) {
    return (text || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  }
  function matchScore(name, query) {
    var w = words(name), q = words(query).join('');
    if (!w.length || !q) return 0;
    var compact = w.join(''), starts = [], pos = 0;
    w.forEach(function (word) { starts.push(pos); pos += word.length; });
    if (compact === q) return 100;
    if (compact.indexOf(q) === 0) return 90;
    for (var i = 1; i < starts.length; i++) if (compact.slice(starts[i]).indexOf(q) === 0) return 80;
    if (q.length >= 2 && w.map(function (x) { return x[0]; }).join('').indexOf(q) === 0) return 60;
    if (compact.indexOf(q) !== -1) return 40;
    return 0;
  }

  function nameOf(node) {
    return node.getAttribute('data-name') || node.getAttribute('aria-label') || node.getAttribute('title') || node.textContent.replace(/\s+/g, ' ').trim();
  }

  /** What a key types, for keys pressed on screen (no real event to ask). */
  function charFor(code, e) {
    if (e && e.key && e.key.length === 1) return e.key;
    var m = /^Key([A-Z])$/.exec(code); if (m) return m[1].toLowerCase();
    m = /^Digit(\d)$/.exec(code); if (m) return m[1];
    return code === 'Space' ? ' ' : '';
  }

  /* ------------------------------------------------------------------ Stage */

  function Stage(root, options) {
    options = options || {};
    this.root = root;
    this.opt = {
      speed: options.speed || 520,          // px/s at full speed
      boost: options.boost || 3,
      scrollSpeed: options.scrollSpeed || 520,
      features: options.features || ALL_FEATURES,
      start: options.start || { x: 0.5, y: 0.5 },
      onKey: options.onKey || null
    };
    this.held = {};
    this.x = 0; this.y = 0;
    this.hold = 0;                // seconds the current movement has lasted
    this.preciseHold = 0;
    this.lastDir = '';
    this.scrollHold = 0;
    this.lastClick = { el: null, t: 0, x: 0, y: 0, count: 0 };
    this.drag = null;
    this.spaceDown = false;
    this.grid = null;
    this.hints = null;
    this.search = null;
    this.areas = null;
    this.helpEl = null;
    this.spots = {};
    this.backPoint = null;
    this.running = false;
    this.listeners = {};

    root.classList.add('nm-stage');
    if (!root.hasAttribute('tabindex')) root.setAttribute('tabindex', '0');
    this.cursor = el('div', 'nm-cursor', root);
    this.cursor.setAttribute('aria-hidden', 'true');
    this.layer = el('div', 'nm-layer', root);
    this.layer.setAttribute('aria-hidden', 'true');
    this.reset();

    var self = this;
    root.addEventListener('pointerdown', function (e) {
      if (e.target.closest('[data-nm-ignore]')) return;
      self.activate();
      // Real clicks also work, so mouse users aren't stuck.
      var r = root.getBoundingClientRect();
      self.x = e.clientX - r.left; self.y = e.clientY - r.top; self.place();
    });
    root.addEventListener('focus', function () { self.activate(); });
    window.addEventListener('resize', function () { self.clamp(); self.place(); });
    stages.push(this);
  }

  Stage.prototype.has = function (feature) { return this.opt.features.indexOf(feature) !== -1; };

  Stage.prototype.on = function (name, fn) { (this.listeners[name] = this.listeners[name] || []).push(fn); return this; };
  Stage.prototype.emit = function (name, detail) {
    (this.listeners[name] || []).forEach(function (fn) { fn(detail); });
  };

  Stage.prototype.reset = function () {
    var r = this.root.getBoundingClientRect();
    this.x = Math.round(r.width * this.opt.start.x);
    this.y = Math.round(r.height * this.opt.start.y);
    this.spots = {}; this.backPoint = null;
    this.place();
  };

  Stage.prototype.activate = function () {
    if (active === this) return;
    if (active) active.deactivate();
    active = this;
    this.root.classList.add('is-active');
    this.ensureVisible();
    this.emit('activate');
  };

  /** Keeps the whole stage on screen while it's in use: the browser can only find what's under the
      pretend pointer if that spot is inside the window. */
  Stage.prototype.ensureVisible = function () {
    // Only for someone using the keyboard here; a demo playing by itself never moves the page.
    if (active !== this) return;
    var r = this.rect(), vh = window.innerHeight, nav = 64, dy = 0;
    if (r.height > vh - nav) {
      // Taller than the window (phones): keep the pointer's row visible instead.
      var py = r.top + this.y;
      if (py < nav + 20) dy = py - nav - 20;
      else if (py > vh - 20) dy = py - vh + 20;
    } else if (r.top < nav) dy = r.top - nav - 8;
    else if (r.bottom > vh) dy = r.bottom - vh + 8;
    if (dy) window.scrollBy({ top: dy, left: 0, behavior: 'instant' });
  };

  Stage.prototype.deactivate = function () {
    if (active !== this) return;
    this.closeOverlays();
    if (this.drag) this.endDrag();
    this.held = {}; this.spaceDown = false;
    active = null;
    this.root.classList.remove('is-active');
    this.emit('deactivate');
  };

  /** Lets go of every held key and closes whatever is open (used when a self-playing demo stops). */
  Stage.prototype.releaseAll = function () {
    var self = this;
    Object.keys(this.held).forEach(function (k) { if (self.held[k]) self.keyUp(k === 'Shift' ? 'ShiftLeft' : k); });
    this.held = {};
    if (this.drag) this.endDrag();
    this.spaceDown = false;
    this.closeOverlays();
  };

  Stage.prototype.closeOverlays = function () {
    this.closeGrid(); this.closeHints(); this.closeSearch(); this.closeAreas(); this.closeHelp();
  };

  Stage.prototype.overlayOpen = function () { return !!(this.grid || this.hints || this.search || this.areas); };

  Stage.prototype.rect = function () { return this.root.getBoundingClientRect(); };

  Stage.prototype.clamp = function () {
    var r = this.rect();
    this.x = Math.max(0, Math.min(r.width - 2, this.x));
    this.y = Math.max(0, Math.min(r.height - 2, this.y));
  };

  Stage.prototype.place = function () {
    this.cursor.style.transform = 'translate(' + this.x + 'px,' + this.y + 'px)';
    if (this.drag) {
      var d = this.drag;
      d.el.style.transform = 'translate(' + (this.x - d.startX) + 'px,' + (this.y - d.startY) + 'px)';
    }
    this.updateHover();
  };

  Stage.prototype.warp = function (x, y) {
    this.x = x; this.y = y; this.clamp();
    var c = this.cursor;
    if (!reduceMotion) {
      c.classList.add('nm-jump');
      setTimeout(function () { c.classList.remove('nm-jump'); }, 160);
    }
    this.place();
    this.emit('move', { x: this.x, y: this.y, jump: true });
  };

  /** A jump that ` can undo. */
  Stage.prototype.jumpTo = function (x, y) {
    var from = { x: this.x, y: this.y };
    this.warp(x, y);
    if (Math.abs(this.x - from.x) + Math.abs(this.y - from.y) > 24) this.backPoint = from;
  };

  /** The element under the cursor, ignoring the cursor and overlays. */
  Stage.prototype.elementAt = function () {
    this.ensureVisible();
    var r = this.rect();
    var hit = document.elementFromPoint(r.left + this.x, r.top + this.y);
    return hit && this.root.contains(hit) ? hit : null;
  };

  Stage.prototype.clickableAt = function () {
    var hit = this.elementAt();
    return hit ? hit.closest('[data-click],[data-drag],[data-drop],[data-select]') : null;
  };

  Stage.prototype.updateHover = function () {
    var target = this.clickableAt();
    if (target === this.hovered) return;
    if (this.hovered) this.hovered.classList.remove('nm-hover');
    this.hovered = target;
    if (target && this.root.classList.contains('is-active')) target.classList.add('nm-hover');
  };

  Stage.prototype.toast = function (text) { this.emit('toast', text); };

  /* ---------------------------------------------------------------- keys */

  Stage.prototype.keyDown = function (code, e) {
    var shift = e ? e.shiftKey : !!this.held.Shift;
    if (code === 'ShiftLeft' || code === 'ShiftRight') { this.held.Shift = true; this.emit('key', { code: 'Shift', down: true }); return true; }
    if (this.opt.onKey && this.opt.onKey(code, true) === false) return true;

    if (this.overlayOpen() && e && e.repeat) return true;
    if (this.grid) { this.gridKey(code); return true; }
    if (this.hints) { this.hintKey(code, e); return true; }
    if (this.search) { this.searchKey(code, e); return true; }
    if (this.areas) { return this.areasKey(code, e); }

    if (this.held[code]) return CAPTURED.indexOf(code) !== -1;
    this.emit('key', { code: code, down: true });

    var digit = DIGITS.indexOf(code);
    if (digit !== -1) {
      if (!this.has('spots')) return false;
      this.held[code] = true;
      if (shift) this.saveSpot(digit + 1); else this.jumpSpot(digit + 1);
      return true;
    }

    switch (code) {
      case 'KeyW': case 'KeyA': case 'KeyS': case 'KeyD':
        if (!this.has('move')) return false;
        this.held[code] = true; this.run(); return true;
      case 'KeyQ':
        if (!this.has('precision')) return false;
        this.held[code] = true; return true;
      case 'ArrowUp': case 'ArrowDown': case 'ArrowLeft': case 'ArrowRight':
        if (!this.has('scroll')) return false;
        this.held[code] = true; this.run(); return true;
      case 'Space':
        if (!this.has('click')) return false;
        this.held[code] = true; this.spacePressed(); return true;
      case 'Enter':
        if (!this.has('click')) return false;
        this.held[code] = true; this.rightClick(); return true;
      case 'KeyM': case 'BracketLeft': case 'BracketRight':
        if (!this.has('buttons')) return false;
        this.held[code] = true; this.extraButton(code); return true;
      case 'KeyE':
        if (!this.has('grid')) return false;
        this.held[code] = true; this.openGrid(); return true;
      case 'KeyF':
        if (!this.has('hints')) return false;
        this.held[code] = true; this.openHints(); return true;
      case 'Slash':
        if (!this.has('search')) return false;
        this.held[code] = true; this.openSearch(); return true;
      case 'KeyJ':
        if (!this.has('areas')) return false;
        this.held[code] = true; this.openAreas(); return true;
      case 'Tab':
        if (!this.has('screens')) return false;
        this.held[code] = true; this.nextScreen(shift); return true;
      case 'Backquote':
        if (!this.has('spots')) return false;
        this.held[code] = true; this.jumpBack(); return true;
      case 'KeyH':
        if (!this.has('help')) return false;
        this.held[code] = true; this.toggleHelp(); return true;
      case 'Escape':
        if (this.helpEl) { this.closeHelp(); return true; }
        this.deactivate(); return true;
      default:
        return false;
    }
  };

  Stage.prototype.keyUp = function (code) {
    if (code === 'ShiftLeft' || code === 'ShiftRight') { this.held.Shift = false; this.emit('key', { code: 'Shift', down: false }); return true; }
    if (this.opt.onKey) this.opt.onKey(code, false);
    if (this.areas) this.areasKeyUp(code);
    var was = this.held[code];
    this.held[code] = false;
    this.emit('key', { code: code, down: false });
    if (code === 'Space' && was) this.spaceReleased();
    return !!was;
  };

  /* ------------------------------------------------------------- motion */

  Stage.prototype.run = function () {
    if (this.running) return;
    this.running = true;
    var self = this, last = performance.now();
    function frame(now) {
      var dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      var moving = self.step(dt);
      if (moving) requestAnimationFrame(frame); else self.running = false;
    }
    requestAnimationFrame(frame);
  };

  /** Same curve as the app: starts at 25% so a tap nudges, eases to full speed in 0.18 s. */
  Stage.prototype.speedAfter = function (t) {
    var ramp = Math.min(Math.max(t / 0.18, 0), 1);
    var eased = ramp * ramp * (3 - 2 * ramp);
    return this.opt.speed * (0.25 + 0.75 * eased);
  };

  Stage.prototype.step = function (dt) {
    var h = this.held, any = false;
    var dx = (h.KeyD ? 1 : 0) - (h.KeyA ? 1 : 0);
    var dy = (h.KeyS ? 1 : 0) - (h.KeyW ? 1 : 0);
    if (this.areas) { dx = 0; dy = 0; }
    if (dx || dy) {
      any = true;
      var len = Math.sqrt(dx * dx + dy * dy), nx = dx / len, ny = dy / len, speed = 0;
      var dir = dx + ',' + dy;
      if (h.KeyQ) {
        if (this.preciseHold === 0 || this.lastDir !== dir) {
          this.preciseHold = 0;
          this.x += Math.sign(dx); this.y += Math.sign(dy);
        } else if (this.preciseHold >= 0.25) {
          speed = this.opt.speed * 0.08;
        }
        this.preciseHold += dt;
        this.hold = 0.18;
      } else {
        this.preciseHold = 0;
        speed = this.speedAfter(this.hold + dt / 2) * (h.Shift ? this.opt.boost : 1);
        this.hold += dt;
      }
      this.lastDir = dir;
      this.x += nx * speed * dt; this.y += ny * speed * dt;
      this.clamp(); this.place();
      this.emit('move', { x: this.x, y: this.y, speed: h.KeyQ ? (speed || 1 / dt) : speed, precise: !!h.KeyQ, boost: !!h.Shift });
    } else {
      this.hold = 0; this.preciseHold = 0; this.lastDir = '';
    }

    var sx = (h.ArrowRight ? 1 : 0) - (h.ArrowLeft ? 1 : 0);
    var sy = (h.ArrowDown ? 1 : 0) - (h.ArrowUp ? 1 : 0);
    if (sx || sy) {
      any = true;
      var ramp = Math.min((this.scrollHold + dt / 2) / 0.25, 1);
      var v = this.opt.scrollSpeed * (0.3 + 0.7 * ramp) * (h.Shift ? this.opt.boost : 1);
      this.scrollHold += dt;
      this.scrollBy(sx * v * dt, sy * v * dt);
    } else {
      this.scrollHold = 0;
    }
    return any;
  };

  Stage.prototype.scrollBy = function (dx, dy) {
    var node = this.elementAt();
    while (node && node !== this.root) {
      var style = getComputedStyle(node);
      var canY = dy && /(auto|scroll)/.test(style.overflowY) && node.scrollHeight > node.clientHeight;
      var canX = dx && /(auto|scroll)/.test(style.overflowX) && node.scrollWidth > node.clientWidth;
      if (canY || canX) {
        if (canY) node.scrollTop += dy;
        if (canX) node.scrollLeft += dx;
        this.emit('scroll', { el: node, dx: dx, dy: dy });
        if ((dy && !canY) || (dx && !canX)) { node = node.parentElement; continue; }
        return;
      }
      node = node.parentElement;
    }
  };

  /* ------------------------------------------------------------- clicks */

  Stage.prototype.spacePressed = function () {
    this.spaceDown = true;
    var target = this.clickableAt();
    var dragEl = target && target.closest('[data-drag]');
    if (dragEl && this.has('drag')) {
      this.drag = { el: dragEl, startX: this.x, startY: this.y, moved: false, target: target };
      dragEl.classList.add('nm-dragging');
    }
  };

  Stage.prototype.spaceReleased = function () {
    this.spaceDown = false;
    if (this.drag) {
      var moved = Math.abs(this.x - this.drag.startX) + Math.abs(this.y - this.drag.startY) > 4;
      var target = this.drag.target;
      this.endDrag();
      if (moved) return;
      this.click(target);
      return;
    }
    this.click(this.clickableAt());
  };

  Stage.prototype.endDrag = function () {
    var d = this.drag;
    this.drag = null;
    d.el.classList.remove('nm-dragging');
    var moved = Math.abs(this.x - d.startX) + Math.abs(this.y - d.startY) > 4;
    var drop = null;
    if (moved) {
      d.el.style.visibility = 'hidden';
      var hit = this.elementAt();
      d.el.style.visibility = '';
      drop = hit && hit.closest('[data-drop]');
      if (drop === d.el) drop = null;
    }
    d.el.style.transform = '';
    if (moved) {
      this.emit('drop', { item: d.el, target: drop });
      if (drop) drop.dispatchEvent(new CustomEvent('nm-drop', { bubbles: true, detail: { item: d.el } }));
    }
  };

  Stage.prototype.click = function (target, right) {
    this.ripple(right);
    var now = performance.now(), lc = this.lastClick;
    var same = target === lc.el && now - lc.t < 500 && Math.abs(this.x - lc.x) < 6 && Math.abs(this.y - lc.y) < 6;
    var count = same && !right ? lc.count + 1 : 1;
    this.lastClick = { el: target, t: now, x: this.x, y: this.y, count: count };
    this.emit('click', { target: target, count: count, right: !!right, x: this.x, y: this.y });
    if (target) {
      target.dispatchEvent(new CustomEvent(right ? 'nm-rightclick' : 'nm-click', {
        bubbles: true, detail: { count: count, x: this.x, y: this.y }
      }));
    }
  };

  Stage.prototype.rightClick = function () { this.click(this.clickableAt(), true); };

  /** M, [ and ]: the middle, back and forward buttons. */
  Stage.prototype.extraButton = function (code) {
    var which = { KeyM: 'middle', BracketLeft: 'back', BracketRight: 'forward' }[code];
    var target = this.clickableAt();
    this.ripple(false, 'nm-ripple-' + which);
    this.emit('button', { which: which, target: target });
    (target || this.root).dispatchEvent(new CustomEvent('nm-button', { bubbles: true, detail: { which: which } }));
  };

  /** A labelled or matched thing was picked: ⇧ right-click, ⌥ double-click, ⌃ just move. */
  Stage.prototype.pick = function (item, e) {
    var kind = e && e.shiftKey ? 'right' : e && e.altKey ? 'double' : e && e.ctrlKey ? 'move' : 'left';
    var self = this;
    this.jumpTo(item.x, item.y);
    if (kind === 'move') { this.emit('pick', { target: item.el, kind: kind }); return; }
    setTimeout(function () {
      self.click(item.el, kind === 'right');
      if (kind === 'double') self.click(item.el);
      self.emit('pick', { target: item.el, kind: kind });
    }, reduceMotion ? 0 : 90);
  };

  Stage.prototype.ripple = function (right, extra) {
    var dot = el('span', 'nm-ripple' + (right ? ' nm-ripple-right' : '') + (extra ? ' ' + extra : ''), this.layer);
    dot.style.left = this.x + 'px'; dot.style.top = this.y + 'px';
    setTimeout(function () { dot.remove(); }, 450);
  };

  /** Things on screen that can be labelled or searched: visible, not covered, inside the stage. */
  Stage.prototype.visibleTargets = function () {
    var r = this.rect();
    return Array.prototype.filter.call(this.root.querySelectorAll('[data-click],[data-drag],[data-hint]'), function (node) {
      if (node.closest('[data-nohint]') || node.hidden) return false;
      var b = node.getBoundingClientRect();
      if (b.width < 2 || b.height < 2) return false;
      var cx = b.left + b.width / 2, cy = b.top + b.height / 2;
      if (cx < r.left || cx > r.right || cy < r.top || cy > r.bottom) return false;
      var top = document.elementFromPoint(cx, cy);
      return top && (node === top || node.contains(top));
    }).map(function (node) {
      var b = node.getBoundingClientRect();
      return { el: node, name: nameOf(node), x: b.left - r.left + b.width / 2, y: b.top - r.top + b.height / 2,
        left: b.left - r.left, top: b.top - r.top, w: b.width, h: b.height };
    });
  };

  /* --------------------------------------------------------------- grid */

  Stage.prototype.openGrid = function () {
    var r = this.rect();
    this.grid = { levels: [{ x: 0, y: 0, w: r.width, h: r.height }], keys: 0, from: { x: this.x, y: this.y } };
    this.gridEl = el('div', 'nm-grid', this.layer);
    this.gridEl.appendChild(el('div', 'nm-grid-dim'));
    this.gridBox = el('div', 'nm-grid-box', this.gridEl);
    var labels = ['Q', 'W', 'E', 'A', 'S', 'D', 'Z', 'X', 'C'];
    for (var i = 0; i < 9; i++) {
      var cell = el('div', 'nm-grid-cell', this.gridBox);
      el('span', 'nm-grid-key', cell).textContent = labels[i];
    }
    this.root.classList.add('nm-grid-open');
    this.renderGrid();
    this.emit('grid', { open: true });
  };

  Stage.prototype.renderGrid = function () {
    var g = this.grid.levels[this.grid.levels.length - 1];
    var b = this.gridBox.style;
    b.left = g.x + 'px'; b.top = g.y + 'px'; b.width = g.w + 'px'; b.height = g.h + 'px';
    this.gridBox.style.setProperty('--key-size', Math.max(9, Math.min(26, Math.min(g.w, g.h) / 3 * 0.32)) + 'px');
    var dim = this.gridEl.firstChild;
    dim.style.clipPath = 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 0, ' +
      g.x + 'px ' + g.y + 'px, ' + g.x + 'px ' + (g.y + g.h) + 'px, ' + (g.x + g.w) + 'px ' + (g.y + g.h) + 'px, ' +
      (g.x + g.w) + 'px ' + g.y + 'px, ' + g.x + 'px ' + g.y + 'px)';
  };

  Stage.prototype.gridKey = function (code) {
    var g = this.grid, cur = g.levels[g.levels.length - 1];
    var index = GRID_KEYS.indexOf(code);
    if (index !== -1) {
      var w = cur.w / 3, h = cur.h / 3;
      var cell = { x: cur.x + (index % 3) * w, y: cur.y + Math.floor(index / 3) * h, w: w, h: h };
      g.levels.push(cell); g.keys++;
      this.warp(cell.x + w / 2, cell.y + h / 2);
      this.emit('grid', { open: true, depth: g.levels.length - 1, keys: g.keys });
      if (Math.min(w, h) / 3 < 6) { this.closeGrid(); return; }
      this.renderGrid();
    } else if (code === 'Space' || code === 'Enter') {
      var right = code === 'Enter';
      this.closeGrid();
      this.click(this.clickableAt(), right);
    } else if (code === 'Backspace') {
      if (g.levels.length > 1) {
        g.levels.pop();
        var top = g.levels[g.levels.length - 1];
        this.warp(top.x + top.w / 2, top.y + top.h / 2);
        this.renderGrid();
      } else { this.closeGrid(); }
    } else if (code === 'Escape') {
      this.closeGrid();
    } else if (code === 'Tab') {
      this.toast('Tab moves the grid to your next display. This one only has one.');
    }
  };

  Stage.prototype.closeGrid = function () {
    if (!this.grid) return;
    var from = this.grid.from;
    this.grid = null;
    this.gridEl.remove();
    this.root.classList.remove('nm-grid-open');
    if (Math.abs(this.x - from.x) + Math.abs(this.y - from.y) > 24) this.backPoint = from;
    this.emit('grid', { open: false });
  };

  /* -------------------------------------------------------------- labels */

  Stage.prototype.openHints = function (keepOpen) {
    this.ensureVisible();
    var targets = this.visibleTargets(), self = this;
    if (!targets.length) { this.toast('Nothing to click here.'); return; }
    var labels = hintLabels(targets.length);
    this.hints = { typed: '', items: [], keepOpen: !!keepOpen };
    this.hintEl = el('div', 'nm-hints', this.layer);
    targets.forEach(function (t, i) {
      var tag = el('span', 'nm-hint', self.hintEl);
      tag.textContent = labels[i];
      tag.style.left = Math.max(0, t.left - 4) + 'px';
      tag.style.top = Math.max(0, t.top + t.h / 2 - 9) + 'px';
      t.label = labels[i]; t.tag = tag;
      self.hints.items.push(t);
    });
    this.hintBar = el('div', 'nm-tipbar', this.layer);
    this.renderHintBar();
    this.root.classList.add('nm-hints-open');
    this.emit('hints', { open: true, count: targets.length });
  };

  Stage.prototype.renderHintBar = function () {
    this.hintBar.innerHTML = '<b>' + (this.hints.keepOpen ? 'Labels stay open' : 'Type a label') + '</b>' +
      '<span><kbd>⇧</kbd> right</span><span><kbd>⌥</kbd> double</span><span><kbd>⌃</kbd> move</span>' +
      '<span><kbd>tab</kbd> ' + (this.hints.keepOpen ? 'stop' : 'keep open') + '</span><span><kbd>esc</kbd></span>';
  };

  Stage.prototype.hintKey = function (code, e) {
    var h = this.hints;
    if (code === 'Escape') { this.closeHints(); return; }
    if (code === 'Backspace') { h.typed = h.typed.slice(0, -1); this.filterHints(); return; }
    if (code === 'Tab') { h.keepOpen = !h.keepOpen; this.renderHintBar(); return; }
    var m = /^Key([A-Z])$/.exec(code);
    if (!m) return;
    var typed = h.typed + m[1];
    var matching = h.items.filter(function (it) { return it.label.indexOf(typed) === 0; });
    if (!matching.length) { this.shake(); return; }
    h.typed = typed;
    if (matching.length === 1 && matching[0].label === typed) {
      var keep = h.keepOpen, self = this;
      this.closeHints();
      this.pick(matching[0], e);
      if (keep) setTimeout(function () { if (active === self && !self.overlayOpen()) self.openHints(true); }, reduceMotion ? 30 : 320);
      return;
    }
    this.filterHints();
  };

  Stage.prototype.filterHints = function () {
    var typed = this.hints.typed;
    this.hints.items.forEach(function (it) {
      var match = it.label.indexOf(typed) === 0;
      it.tag.classList.toggle('nm-hint-dim', !match);
      it.tag.innerHTML = match && typed ? '<b>' + typed + '</b>' + it.label.slice(typed.length) : it.label;
    });
  };

  Stage.prototype.shake = function () {
    var layer = this.hintEl;
    if (!layer || reduceMotion) return;
    layer.classList.remove('nm-shake'); void layer.offsetWidth; layer.classList.add('nm-shake');
  };

  Stage.prototype.closeHints = function () {
    if (!this.hints) return;
    this.hints = null;
    this.hintEl.remove();
    this.hintBar.remove();
    this.root.classList.remove('nm-hints-open');
    this.emit('hints', { open: false });
  };

  /* -------------------------------------------------------- type to click */

  Stage.prototype.openSearch = function () {
    this.ensureVisible();
    this.search = { query: '', items: this.visibleTargets().filter(function (t) { return t.name; }), matches: [], sel: 0 };
    this.searchEl = el('div', 'nm-search', this.layer);
    this.searchBar = el('div', 'nm-tipbar nm-searchbar', this.layer);
    this.root.classList.add('nm-search-open');
    this.renderSearch();
    this.emit('search', { open: true });
  };

  Stage.prototype.searchKey = function (code, e) {
    var s = this.search;
    if (code === 'Escape') { this.closeSearch(); return; }
    if (code === 'Enter') {
      var match = s.matches[s.sel];
      if (!match) { this.shakeBar(); return; }
      this.closeSearch();
      this.pick(match, e);
      return;
    }
    if (code === 'Tab' || code === 'ArrowDown' || code === 'ArrowUp') {
      if (!s.matches.length) return;
      var step = code === 'ArrowUp' || (code === 'Tab' && e && e.shiftKey) ? -1 : 1;
      s.sel = (s.sel + step + s.matches.length) % s.matches.length;
      this.renderSearch();
      return;
    }
    if (code === 'Backspace') s.query = s.query.slice(0, -1);
    else {
      var ch = charFor(code, e);
      if (!ch) return;
      s.query += ch;
    }
    var q = s.query;
    s.matches = q ? s.items.map(function (t) { return { t: t, score: matchScore(t.name, q) }; })
      .filter(function (m) { return m.score > 0; })
      .sort(function (a, b) { return b.score - a.score || a.t.name.length - b.t.name.length; })
      .map(function (m) { return m.t; }) : [];
    s.sel = 0;
    this.renderSearch();
  };

  Stage.prototype.renderSearch = function () {
    var s = this.search, self = this;
    this.searchEl.innerHTML = '';
    s.matches.forEach(function (m, i) {
      var box = el('span', 'nm-match' + (i === s.sel ? ' sel' : ''), self.searchEl);
      box.style.left = (m.left - 3) + 'px'; box.style.top = (m.top - 2) + 'px';
      box.style.width = (m.w + 6) + 'px'; box.style.height = (m.h + 4) + 'px';
    });
    var count = !s.query ? 'start typing a name' : !s.matches.length ? 'no match' : (s.sel + 1) + ' of ' + s.matches.length;
    this.searchBar.innerHTML = '<b>Type to click</b><span class="nm-q">' + (s.query ? s.query.replace(/</g, '&lt;') + '<i></i>' : '') +
      '</span><span class="nm-count">' + count + '</span><span><kbd>↩</kbd> click</span><span><kbd>tab</kbd> next</span><span><kbd>esc</kbd></span>';
  };

  Stage.prototype.shakeBar = function () {
    var bar = this.searchBar;
    if (!bar || reduceMotion) return;
    bar.classList.remove('nm-shake'); void bar.offsetWidth; bar.classList.add('nm-shake');
  };

  Stage.prototype.closeSearch = function () {
    if (!this.search) return;
    this.search = null;
    this.searchEl.remove(); this.searchBar.remove();
    this.root.classList.remove('nm-search-open');
    this.emit('search', { open: false });
  };

  /* --------------------------------------------------------- scroll areas */

  Stage.prototype.openAreas = function () {
    var r = this.rect(), self = this;
    var nodes = Array.prototype.filter.call(this.root.querySelectorAll('*'), function (node) {
      if (node.closest('.nm-layer')) return false;
      var st = getComputedStyle(node);
      var y = /(auto|scroll)/.test(st.overflowY) && node.scrollHeight > node.clientHeight + 2;
      var x = /(auto|scroll)/.test(st.overflowX) && node.scrollWidth > node.clientWidth + 2;
      var b = node.getBoundingClientRect();
      return (y || x) && b.width > 40 && b.height > 30 && b.bottom > r.top && b.top < r.bottom;
    }).slice(0, 9);
    if (!nodes.length) { this.toast('Nothing to scroll here.'); return; }
    this.areas = { items: nodes.map(function (node) {
      var b = node.getBoundingClientRect();
      return { el: node, left: b.left - r.left, top: b.top - r.top, w: b.width, h: b.height };
    }), sel: -1, glide: null };
    this.areasEl = el('div', 'nm-areas', this.layer);
    this.areasBar = el('div', 'nm-tipbar', this.layer);
    this.areasBar.innerHTML = '<b>Scroll</b><span><kbd>↑↓</kbd> or <kbd>J</kbd><kbd>K</kbd></span><span><kbd>space</kbd> page</span>' +
      '<span><kbd>T</kbd> top</span><span><kbd>B</kbd> bottom</span><span><kbd>tab</kbd> next area</span><span><kbd>esc</kbd></span>';
    var inside = -1, smallest = Infinity, biggest = 0, big = 0;
    this.areas.items.forEach(function (a, i) {
      var area = a.w * a.h;
      if (self.x >= a.left && self.x <= a.left + a.w && self.y >= a.top && self.y <= a.top + a.h && area < smallest) { smallest = area; inside = i; }
      if (area > biggest) { biggest = area; big = i; }
    });
    this.root.classList.add('nm-areas-open');
    this.selectArea(inside !== -1 ? inside : big, inside === -1);
    this.emit('areas', { open: true, count: nodes.length });
  };

  Stage.prototype.selectArea = function (i, move) {
    var a = this.areas, self = this;
    if (!a.items[i]) return;
    a.sel = i;
    if (move !== false) this.jumpTo(a.items[i].left + a.items[i].w / 2, a.items[i].top + a.items[i].h / 2);
    this.areasEl.innerHTML = '';
    a.items.forEach(function (it, n) {
      var box = el('span', 'nm-area' + (n === a.sel ? ' sel' : ''), self.areasEl);
      box.style.left = it.left + 'px'; box.style.top = it.top + 'px'; box.style.width = it.w + 'px'; box.style.height = it.h + 'px';
      el('b', '', box).textContent = n + 1;
    });
  };

  var AREA_HOLD = { ArrowDown: 'ArrowDown', KeyJ: 'ArrowDown', ArrowUp: 'ArrowUp', KeyK: 'ArrowUp', ArrowLeft: 'ArrowLeft', KeyH: 'ArrowLeft', ArrowRight: 'ArrowRight', KeyL: 'ArrowRight' };

  Stage.prototype.areasKey = function (code, e) {
    var a = this.areas, shift = e ? e.shiftKey : !!this.held.Shift;
    var target = a.items[a.sel] && a.items[a.sel].el;
    if (code === 'Escape' || code === 'Enter') { this.closeAreas(); return true; }
    if (AREA_HOLD[code]) { this.held[AREA_HOLD[code]] = true; this.run(); return true; }
    var digit = DIGITS.indexOf(code);
    if (digit !== -1) { this.selectArea(digit); return true; }
    if (code === 'Tab') { this.selectArea((a.sel + (shift ? -1 : 1) + a.items.length) % a.items.length); return true; }
    if (!target) return true;
    var page = target.clientHeight * 0.85, to = null;
    if (code === 'Space') to = target.scrollTop + (shift ? -page : page);
    else if (code === 'KeyD') to = target.scrollTop + page / 2;
    else if (code === 'KeyU') to = target.scrollTop - page / 2;
    else if (code === 'KeyT' || (code === 'KeyG' && !shift)) to = 0;
    else if (code === 'KeyB' || (code === 'KeyG' && shift)) to = target.scrollHeight;
    if (to !== null) {
      target.scrollTo({ top: to, behavior: reduceMotion ? 'auto' : 'smooth' });
      this.emit('scroll', { el: target, dx: 0, dy: to - target.scrollTop });
      var self = this;
      setTimeout(function () { self.emit('scroll', { el: target, dx: 0, dy: 0 }); }, 450);
    }
    return true;
  };

  Stage.prototype.areasKeyUp = function (code) {
    if (AREA_HOLD[code]) this.held[AREA_HOLD[code]] = false;
  };

  Stage.prototype.closeAreas = function () {
    if (!this.areas) return;
    this.areas = null;
    ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].forEach(function (k) { this.held[k] = false; }, this);
    this.areasEl.remove(); this.areasBar.remove();
    this.root.classList.remove('nm-areas-open');
    this.emit('areas', { open: false });
  };

  /* ------------------------------------------------- screens, spots, back */

  Stage.prototype.nextScreen = function (back) {
    var r = this.rect(), self = this;
    var screens = Array.prototype.map.call(this.root.querySelectorAll('[data-screen]'), function (s) {
      var b = s.getBoundingClientRect();
      return { el: s, left: b.left - r.left, top: b.top - r.top, w: b.width, h: b.height };
    });
    if (screens.length < 2) { this.toast('Tab jumps to your next screen. This one only has one.'); return; }
    var current = 0;
    screens.forEach(function (s, i) { if (self.x >= s.left && self.x <= s.left + s.w) current = i; });
    var next = screens[(current + (back ? screens.length - 1 : 1)) % screens.length];
    this.jumpTo(next.left + next.w / 2, next.top + next.h / 2);
    this.emit('screen', { el: next.el });
  };

  Stage.prototype.saveSpot = function (n) {
    this.spots[n] = { x: this.x, y: this.y };
    var pin = this.layer.querySelector('[data-pin="' + n + '"]') || el('span', 'nm-pin', this.layer);
    pin.setAttribute('data-pin', n); pin.textContent = n;
    pin.style.left = this.x + 'px'; pin.style.top = this.y + 'px';
    this.toast('Spot ' + n + ' saved. Press ' + n + ' to come back.');
    this.emit('spot', { n: n, saved: true, x: this.x, y: this.y });
  };

  Stage.prototype.jumpSpot = function (n) {
    var s = this.spots[n];
    if (!s) { this.toast('Spot ' + n + ' is empty. ⇧' + n + ' saves one.'); return; }
    this.jumpTo(s.x, s.y);
    this.emit('spot', { n: n, saved: false, x: s.x, y: s.y });
  };

  Stage.prototype.jumpBack = function () {
    if (!this.backPoint) { this.toast('Nothing to jump back to yet.'); return; }
    this.jumpTo(this.backPoint.x, this.backPoint.y);
    this.emit('back', {});
  };

  /* --------------------------------------------------------------- help */

  Stage.prototype.toggleHelp = function () {
    if (this.helpEl) { this.closeHelp(); return; }
    this.helpEl = el('div', 'nm-help', this.layer);
    this.helpEl.innerHTML =
      '<div><b>Move</b><span><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> · <kbd>⇧</kbd> fast · <kbd>Q</kbd> precise</span></div>' +
      '<div><b>Click</b><span><kbd>space</kbd> click · <kbd>return</kbd> right · <kbd>M</kbd> middle · <kbd>[</kbd><kbd>]</kbd> back/forward</span></div>' +
      '<div><b>Jump</b><span><kbd>F</kbd> labels · <kbd>/</kbd> type to click · <kbd>E</kbd> grid · <kbd>tab</kbd> next screen</span></div>' +
      '<div><b>Scroll</b><span><kbd>↑</kbd><kbd>↓</kbd><kbd>←</kbd><kbd>→</kbd> · <kbd>J</kbd> scroll areas · <kbd>1</kbd>–<kbd>9</kbd> spots · <kbd>`</kbd> back</span></div>' +
      '<p><kbd>H</kbd> hides this</p>';
    this.emit('help', { open: true });
  };

  Stage.prototype.closeHelp = function () {
    if (!this.helpEl) return;
    this.helpEl.remove(); this.helpEl = null;
    this.emit('help', { open: false });
  };

  /* ------------------------------------------------- global keyboard */

  document.addEventListener('keydown', function (e) {
    if (!active) return;
    // Shortcuts belong to the browser, exactly as they belong to your apps in the real thing. Inside labels
    // and type to click, ⌥ and ⌃ choose the kind of click instead.
    if (e.metaKey) return;
    if ((e.ctrlKey || e.altKey) && !(active.hints || active.search)) return;
    if (active.keyDown(e.code, e)) e.preventDefault();
  });
  document.addEventListener('keyup', function (e) {
    if (!active) return;
    if (active.keyUp(e.code)) e.preventDefault();
  });
  document.addEventListener('pointerdown', function (e) {
    if (active && !active.root.contains(e.target) && !e.target.closest('[data-nm-keypad]')) active.deactivate();
  });
  window.addEventListener('blur', function () { if (active) { active.held = {}; } });

  /* On-screen keys: any [data-key] button inside a [data-nm-keypad="<stage id>"] drives that stage. */
  function bindKeypads() {
    document.querySelectorAll('[data-nm-keypad]').forEach(function (pad) {
      var stage = stages.filter(function (s) { return s.root.id === pad.getAttribute('data-nm-keypad'); })[0];
      if (!stage) return;
      pad.querySelectorAll('[data-key]').forEach(function (btn) {
        var code = btn.getAttribute('data-key'), latch = btn.hasAttribute('data-latch');
        btn.addEventListener('pointerdown', function (e) {
          e.preventDefault();
          stage.activate();
          if (latch) {
            var on = !stage.held.Shift;
            stage[on ? 'keyDown' : 'keyUp']('ShiftLeft');
            btn.classList.toggle('is-down', on);
            return;
          }
          btn.classList.add('is-down');
          stage.keyDown(code, { shiftKey: !!stage.held.Shift, key: btn.getAttribute('data-char') || '' });
          btn.setPointerCapture && btn.setPointerCapture(e.pointerId);
        });
        if (!latch) {
          ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(function (type) {
            btn.addEventListener(type, function () {
              if (!btn.classList.contains('is-down')) return;
              btn.classList.remove('is-down');
              stage.keyUp(code);
            });
          });
        }
      });
      // Real key presses light up the matching on-screen key.
      stage.on('key', function (k) {
        var code = k.code === 'Shift' ? 'ShiftLeft' : k.code;
        pad.querySelectorAll('[data-key="' + code + '"]').forEach(function (b) {
          if (!b.hasAttribute('data-latch')) b.classList.toggle('is-lit', k.down);
        });
      });
    });
  }

  window.NoMouse = {
    Stage: Stage, stages: stages, hintLabels: hintLabels, bindKeypads: bindKeypads, reduceMotion: reduceMotion,
    matchScore: matchScore, nameOf: nameOf, isActive: function () { return !!active; }
  };
})();
