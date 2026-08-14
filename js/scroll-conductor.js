/**
 * MengTo Portable Scroll Conductor
 * Single source of truth for deterministic, frame-rate independent scroll progress.
 */

(function (global) {
  'use strict';

  function clamp(value, min, max) {
    return value < min ? min : (value > max ? max : value);
  }

  function damp(current, target, lambda, dt) {
    return current + (target - current) * (1 - Math.exp(-lambda * dt));
  }

  function getElementDocTop(element) {
    var rect = element.getBoundingClientRect();
    return rect.top + (window.scrollY || window.pageYOffset || 0);
  }

  function createScrollConductor(options) {
    var opts = options || {};
    var sections = Array.isArray(opts.sections) ? opts.sections : Array.prototype.slice.call(opts.sections || []);
    var damping = typeof opts.damping === 'number' ? opts.damping : 5.0;
    var onUpdate = typeof opts.onUpdate === 'function' ? opts.onUpdate : function () {};
    var onChapterChange = typeof opts.onChapterChange === 'function' ? opts.onChapterChange : function () {};
    var reducedMotion = Boolean(opts.reducedMotion);

    var anchors = [];
    var exact = 0;
    var smooth = 0;
    var lastTime = performance.now();
    var lastChapter = -1;
    var running = false;
    var dirty = true;
    var lastScrollY = -1;
    var widthAtMeasure = window.innerWidth;

    function maxScroll() {
      return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    }

    function measure() {
      var max = maxScroll();
      widthAtMeasure = window.innerWidth;
      anchors = sections.map(function (element, index) {
        if (index === 0) return 0;
        if (index === sections.length - 1) return max;
        var elTop = getElementDocTop(element);
        var value = elTop + element.offsetHeight * 0.5 - window.innerHeight * 0.5;
        return clamp(value, 0, max);
      });

      for (var index = 1; index < anchors.length; index += 1) {
        anchors[index] = Math.max(anchors[index], anchors[index - 1] + 1);
      }

      dirty = true;
      return anchors.slice();
    }

    function progressFromScroll(scrollY) {
      if (anchors.length <= 1) return 0;
      var y = clamp(scrollY, 0, maxScroll());
      if (y <= anchors[0]) return 0;
      if (y >= anchors[anchors.length - 1]) return anchors.length - 1;

      var index = 0;
      while (index < anchors.length - 1 && y > anchors[index + 1]) {
        index += 1;
      }

      var start = anchors[index];
      var end = anchors[index + 1];
      var local = end === start ? 0 : (y - start) / (end - start);
      return index + local;
    }

    function emit(forceEmit) {
      var now = performance.now();
      var dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      if (reducedMotion) {
        smooth = exact;
      } else {
        smooth = damp(smooth, exact, damping, dt);
      }

      var delta = Math.abs(smooth - exact);
      var maxIndex = Math.max(0, anchors.length - 1);
      var normalizedExact = maxIndex === 0 ? 0 : clamp(exact / maxIndex, 0, 1);
      var normalizedSmooth = maxIndex === 0 ? 0 : clamp(smooth / maxIndex, 0, 1);
      var smoothIndex = Math.round(smooth);

      var state = {
        exact: exact,
        smooth: smooth,
        normalizedExact: normalizedExact,
        normalizedSmooth: normalizedSmooth,
        exactIndex: Math.round(exact),
        smoothIndex: smoothIndex,
        localExact: exact % 1,
        localSmooth: smooth % 1,
        isSettled: delta < 0.0001
      };

      if (forceEmit || delta > 0.0001 || dirty) {
        onUpdate(state);
        dirty = false;
      }

      if (smoothIndex !== lastChapter && smoothIndex >= 0 && smoothIndex <= maxIndex) {
        lastChapter = smoothIndex;
        onChapterChange(smoothIndex, state);
      }
    }

    function loop(now) {
      if (!running) return;
      read();
      emit(false);
      requestAnimationFrame(loop);
    }

    function read() {
      var y = window.scrollY || window.pageYOffset || 0;
      if (y !== lastScrollY) {
        lastScrollY = y;
        exact = progressFromScroll(y);
        dirty = true;
      }
    }

    function onScroll() {
      read();
    }

    function onResize() {
      if (Math.abs(window.innerWidth - widthAtMeasure) > 20) {
        measure();
        read();
      }
    }

    function start() {
      if (running) return;
      running = true;
      measure();
      read();
      smooth = exact;
      lastTime = performance.now();
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onResize);
      emit(true);
      requestAnimationFrame(loop);
    }

    function stop() {
      running = false;
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    }

    function setReducedMotion(value) {
      reducedMotion = Boolean(value);
      if (reducedMotion) {
        smooth = exact;
        dirty = true;
      }
    }

    function goTo(index, behavior) {
      var targetIndex = clamp(index, 0, anchors.length - 1);
      var targetY = anchors[targetIndex] || 0;
      window.scrollTo({
        top: targetY,
        behavior: behavior || (reducedMotion ? 'auto' : 'smooth')
      });
    }

    return {
      start: start,
      stop: stop,
      measure: measure,
      read: read,
      goTo: goTo,
      setReducedMotion: setReducedMotion,
      getAnchors: function () { return anchors.slice(); },
      getState: function () {
        var maxIndex = Math.max(0, anchors.length - 1);
        return {
          exact: exact,
          smooth: smooth,
          normalizedExact: maxIndex === 0 ? 0 : exact / maxIndex,
          normalizedSmooth: maxIndex === 0 ? 0 : smooth / maxIndex,
          exactIndex: Math.round(exact),
          smoothIndex: Math.round(smooth)
        };
      }
    };
  }

  global.createScrollConductor = createScrollConductor;
})(window);
