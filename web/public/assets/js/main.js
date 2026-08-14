// GỐM SỨ TRUNG MỪNG — front-end interactivity (vanilla JS, no build step / no deps)
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    initMobileNav();
    initHeroSlider();
    initTabs();
    initGallery();
    initLightbox();
    initCatalogFilter();
    initQtyStepper();
    initVariantPicker();
    initScrollReveal();
    initHeaderShadow();
    initStatCounters();
    initBackToTop();
  });

  /* ---------------- Mobile nav ---------------- */
  function initMobileNav() {
    var toggle = document.querySelector(".nav-toggle");
    var drawer = document.querySelector(".mobile-nav");
    if (!toggle || !drawer) return;
    var closeBtn = drawer.querySelector(".mn-close");
    function open() { drawer.classList.add("is-open"); document.body.style.overflow = "hidden"; }
    function close() { drawer.classList.remove("is-open"); document.body.style.overflow = ""; }
    toggle.addEventListener("click", open);
    if (closeBtn) closeBtn.addEventListener("click", close);
    drawer.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", close); });
  }

  function initHeaderShadow() {
    var header = document.querySelector(".site-header");
    if (!header) return;
    window.addEventListener("scroll", function () {
      header.style.boxShadow = window.scrollY > 8 ? "0 4px 20px rgba(42,36,32,.10)" : "none";
    });
  }

  /* ---------------- Hero slider ---------------- */
  function initHeroSlider() {
    var hero = document.querySelector(".hero");
    if (!hero) return;
    var slides = hero.querySelectorAll(".hero-slide");
    var dots = hero.querySelectorAll(".hero-dots button");
    if (slides.length < 2) return;
    var i = 0;
    function show(n) {
      slides.forEach(function (s, idx) { s.classList.toggle("is-active", idx === n); });
      dots.forEach(function (d, idx) { d.classList.toggle("is-active", idx === n); });
      i = n;
    }
    dots.forEach(function (d, idx) { d.addEventListener("click", function () { show(idx); restart(); }); });
    var timer;
    function restart() {
      clearInterval(timer);
      timer = setInterval(function () { show((i + 1) % slides.length); }, 5500);
    }
    restart();
  }

  /* ---------------- Tabs (product detail) ---------------- */
  function initTabs() {
    document.querySelectorAll(".tabs").forEach(function (tabs) {
      var btns = tabs.querySelectorAll(".tab-btn");
      var panelWrap = document.querySelector(tabs.getAttribute("data-panels") || "");
      btns.forEach(function (btn) {
        btn.addEventListener("click", function () {
          btns.forEach(function (b) { b.classList.remove("is-active"); });
          btn.classList.add("is-active");
          var target = btn.getAttribute("data-tab");
          if (panelWrap) {
            panelWrap.querySelectorAll(".tab-panel").forEach(function (p) {
              p.classList.toggle("is-active", p.getAttribute("data-panel") === target);
            });
          }
        });
      });
    });
  }

  /* ---------------- Product gallery (main image + thumbs) ---------------- */
  function initGallery() {
    document.querySelectorAll(".pd-gallery").forEach(function (gallery) {
      var main = gallery.querySelector(".pd-main-img img");
      var thumbs = gallery.querySelectorAll(".pd-thumbs button");
      thumbs.forEach(function (btn) {
        btn.addEventListener("click", function () {
          thumbs.forEach(function (b) { b.classList.remove("is-active"); });
          btn.classList.add("is-active");
          var full = btn.getAttribute("data-full");
          if (main && full) main.setAttribute("src", full);
        });
      });
    });
  }

  /* ---------------- Lightbox ---------------- */
  function initLightbox() {
    var lb = document.querySelector(".lightbox");
    if (!lb) return;
    var img = lb.querySelector("img");
    var closeBtn = lb.querySelector(".lightbox-close");
    document.querySelectorAll("[data-lightbox]").forEach(function (el) {
      el.style.cursor = "zoom-in";
      el.addEventListener("click", function () {
        var src = el.getAttribute("data-lightbox") || el.getAttribute("src");
        img.setAttribute("src", src);
        lb.classList.add("is-open");
      });
    });
    function close() { lb.classList.remove("is-open"); }
    if (closeBtn) closeBtn.addEventListener("click", close);
    lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  }

  /* ---------------- Qty stepper ---------------- */
  function initQtyStepper() {
    document.querySelectorAll(".qty-stepper").forEach(function (stepper) {
      var input = stepper.querySelector("input");
      var minus = stepper.querySelector(".qty-minus");
      var plus = stepper.querySelector(".qty-plus");
      if (!input) return;
      function clamp(v) { return Math.max(1, Math.min(999, v)); }
      if (minus) minus.addEventListener("click", function () { input.value = clamp((parseInt(input.value, 10) || 1) - 1); });
      if (plus) plus.addEventListener("click", function () { input.value = clamp((parseInt(input.value, 10) || 1) + 1); });
    });
  }

  /* ---------------- Variant / color pickers (visual only, updates hidden price if data present) ---------------- */
  function initVariantPicker() {
    document.querySelectorAll(".variant-options").forEach(function (group) {
      var pills = group.querySelectorAll(".variant-pill");
      pills.forEach(function (pill) {
        pill.addEventListener("click", function () {
          pills.forEach(function (p) { p.classList.remove("is-active"); });
          pill.classList.add("is-active");
          var price = pill.getAttribute("data-price");
          var priceEl = document.querySelector("[data-pd-price]");
          if (price && priceEl) priceEl.textContent = price;
          var dimsEl = document.querySelector("[data-pd-dims]");
          var dims = pill.getAttribute("data-dims");
          if (dims && dimsEl) dimsEl.textContent = dims;
        });
      });
    });
    document.querySelectorAll(".color-options").forEach(function (group) {
      var pills = group.querySelectorAll(".color-pill");
      pills.forEach(function (pill) {
        pill.addEventListener("click", function () {
          pills.forEach(function (p) { p.classList.remove("is-active"); });
          pill.classList.add("is-active");
        });
      });
    });
  }

  /* ---------------- Catalog filter / search (client-side, no fetch needed) ---------------- */
  function initCatalogFilter() {
    var grid = document.querySelector("[data-catalog-grid]");
    if (!grid) return;
    var cards = Array.prototype.slice.call(grid.querySelectorAll(".product-card"));
    var searchInput = document.querySelector("[data-catalog-search]");
    var chips = document.querySelectorAll("[data-catalog-chip]");
    var checks = document.querySelectorAll("[data-catalog-check]");
    var sortSelect = document.querySelector("[data-catalog-sort]");
    var countEl = document.querySelector("[data-catalog-count]");
    var emptyEl = document.querySelector("[data-catalog-empty]");
    var activeCat = "all";

    function currentColorFilters() {
      return Array.prototype.slice.call(checks)
        .filter(function (c) { return c.checked && c.getAttribute("data-catalog-check") === "color"; })
        .map(function (c) { return c.value; });
    }
    function currentPriceMax() {
      var checked = Array.prototype.slice.call(checks)
        .filter(function (c) { return c.checked && c.getAttribute("data-catalog-check") === "price"; });
      if (!checked.length) return null;
      return checked.map(function (c) { return c.value; });
    }

    function priceBucket(price) {
      if (price < 30000) return "under30";
      if (price < 60000) return "30to60";
      if (price < 120000) return "60to120";
      return "over120";
    }

    function apply() {
      var q = (searchInput && searchInput.value || "").toLowerCase().trim();
      var colors = currentColorFilters();
      var priceBuckets = currentPriceMax();
      var visible = 0;
      cards.forEach(function (card) {
        var name = (card.getAttribute("data-name") || "").toLowerCase();
        var code = (card.getAttribute("data-code") || "").toLowerCase();
        var cat = card.getAttribute("data-cat") || "";
        var cardColors = (card.getAttribute("data-colors") || "").split(",");
        var price = parseInt(card.getAttribute("data-price") || "0", 10);

        var matchesSearch = !q || name.indexOf(q) !== -1 || code.indexOf(q) !== -1;
        var matchesCat = activeCat === "all" || cat === activeCat;
        var matchesColor = !colors.length || colors.some(function (c) { return cardColors.indexOf(c) !== -1; });
        var matchesPrice = !priceBuckets || priceBuckets.indexOf(priceBucket(price)) !== -1;

        var show = matchesSearch && matchesCat && matchesColor && matchesPrice;
        card.style.display = show ? "" : "none";
        if (show) visible++;
      });
      if (countEl) countEl.textContent = visible;
      if (emptyEl) emptyEl.style.display = visible ? "none" : "block";
      sortCards();
    }

    function sortCards() {
      if (!sortSelect) return;
      var mode = sortSelect.value;
      var visibleCards = cards.filter(function (c) { return c.style.display !== "none"; });
      visibleCards.sort(function (a, b) {
        var pa = parseInt(a.getAttribute("data-price"), 10);
        var pb = parseInt(b.getAttribute("data-price"), 10);
        if (mode === "price-asc") return pa - pb;
        if (mode === "price-desc") return pb - pa;
        if (mode === "name-asc") return (a.getAttribute("data-name") || "").localeCompare(b.getAttribute("data-name") || "");
        return (parseInt(a.getAttribute("data-order"), 10) || 0) - (parseInt(b.getAttribute("data-order"), 10) || 0);
      });
      visibleCards.forEach(function (c) { grid.appendChild(c); });
    }

    if (searchInput) searchInput.addEventListener("input", apply);
    if (sortSelect) sortSelect.addEventListener("change", apply);
    checks.forEach(function (c) { c.addEventListener("change", apply); });
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        chips.forEach(function (c) { c.classList.remove("is-active"); });
        chip.classList.add("is-active");
        activeCat = chip.getAttribute("data-catalog-chip");
        apply();
      });
    });

    // support ?cat= and ?q= from links (e.g. homepage category cards)
    var params = new URLSearchParams(window.location.search);
    var catParam = params.get("cat");
    var qParam = params.get("q");
    if (catParam) {
      var target = document.querySelector('[data-catalog-chip="' + catParam + '"]');
      if (target) target.click();
    }
    if (qParam && searchInput) { searchInput.value = qParam; }
    apply();
  }

  /* ---------------- Animated stat counters (hero) ---------------- */
  function initStatCounters() {
    var els = document.querySelectorAll("[data-count-to]");
    if (!els.length) return;
    var prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function animate(el) {
      var target = parseInt(el.getAttribute("data-count-to"), 10) || 0;
      var suffix = el.getAttribute("data-suffix") || "";
      if (prefersReduced) { el.textContent = target + suffix; return; }
      var duration = 1400;
      var start = null;
      function step(ts) {
        if (!start) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
    els.forEach(animate);
  }

  /* ---------------- Back to top ---------------- */
  function initBackToTop() {
    var btn = document.querySelector("[data-back-to-top]");
    if (!btn) return;
    window.addEventListener("scroll", function () {
      btn.classList.toggle("is-visible", window.scrollY > 500);
    });
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------------- Scroll reveal (simple fade-up) ---------------- */
  function initScrollReveal() {
    var els = document.querySelectorAll("[data-reveal]");
    if (!els.length) return;
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  }
})();
