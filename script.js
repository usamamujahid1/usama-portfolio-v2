/* ============================================================
   Usama Mujahid — Portfolio v2 interactions
   Vanilla JS · rAF-throttled · reduced-motion aware
   ============================================================ */

(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ============ 1. PRELOADER ============ */
  const loader = $("#loader");
  const loaderFill = $("#loaderFill");
  const loaderPct = $("#loaderPct");

  const finishLoading = () => {
    loader.classList.add("is-done");
    document.body.classList.remove("is-loading");
    document.body.classList.add("is-ready");
    loader.addEventListener("transitionend", () => loader.remove(), { once: true });
  };

  if (reduceMotion) {
    loader.remove();
    document.body.classList.remove("is-loading");
    document.body.classList.add("is-ready");
  } else {
    // Progress eases toward 100%, completing when the page has actually loaded
    let progress = 0;
    let pageLoaded = document.readyState === "complete";
    window.addEventListener("load", () => (pageLoaded = true), { once: true });

    const tick = () => {
      const target = pageLoaded ? 100 : 88;
      progress += (target - progress) * 0.09;
      if (pageLoaded && progress > 99.2) progress = 100;

      loaderFill.style.width = progress + "%";
      loaderPct.textContent = Math.round(progress);

      if (progress >= 100) {
        setTimeout(finishLoading, 250);
      } else {
        requestAnimationFrame(tick);
      }
    };
    requestAnimationFrame(tick);

    // Hard cap: never trap the user behind the loader
    setTimeout(() => {
      if (!loader.classList.contains("is-done")) {
        pageLoaded = true;
      }
    }, 4000);
  }

  /* ============ 2. SCROLL PROGRESS + NAV STATE (one rAF loop) ============ */
  const progressBar = $("#progressBar");
  const nav = $(".nav");
  let scrollTicking = false;

  const onScroll = () => {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      progressBar.style.width = (max > 0 ? (doc.scrollTop / max) * 100 : 0) + "%";
      nav.classList.toggle("is-scrolled", doc.scrollTop > 10);
      applyParallax(doc.scrollTop);
      scrollTicking = false;
    });
  };

  /* ============ 3. PARALLAX (hero background layers) ============ */
  const parallaxEls = $$("[data-parallax]");
  const heroEl = $("#hero");

  const applyParallax = (scrollY) => {
    if (reduceMotion || !heroEl) return;
    // only compute while the hero is on screen
    if (scrollY > heroEl.offsetHeight) return;
    parallaxEls.forEach((el) => {
      const speed = parseFloat(el.dataset.parallax) || 0;
      el.style.transform = `translate3d(0, ${scrollY * speed}px, 0)`;
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ============ 4. CUSTOM CURSOR ============ */
  const dot = $("#cursorDot");
  const ring = $("#cursorRing");

  if (finePointer && !reduceMotion && dot && ring) {
    document.body.classList.add("has-cursor");

    let mx = -100, my = -100;   // mouse position
    let rx = -100, ry = -100;   // ring position (lags behind)

    window.addEventListener(
      "mousemove",
      (e) => {
        mx = e.clientX;
        my = e.clientY;
        dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      },
      { passive: true }
    );

    const followRing = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(followRing);
    };
    requestAnimationFrame(followRing);

    // grow the reticle over interactive elements
    $$("[data-hover], a, button").forEach((el) => {
      el.addEventListener("mouseenter", () => ring.classList.add("is-hover"));
      el.addEventListener("mouseleave", () => ring.classList.remove("is-hover"));
    });
  }

  /* ============ 5. MAGNETIC BUTTONS ============ */
  if (finePointer && !reduceMotion) {
    $$("[data-magnetic]").forEach((el) => {
      const strength = 0.32;
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "";
      });
    });
  }

  /* ============ 6. CARD SPOTLIGHT (cursor-tracked glow) ============ */
  if (finePointer) {
    $$(".sheet").forEach((card) => {
      card.addEventListener(
        "mousemove",
        (e) => {
          const r = card.getBoundingClientRect();
          card.style.setProperty("--mx", e.clientX - r.left + "px");
          card.style.setProperty("--my", e.clientY - r.top + "px");
        },
        { passive: true }
      );
    });
  }

  /* ============ 7. ROTATING ROLES ============ */
  const roles = $$("#roles .roles__item");
  if (roles.length > 1 && !reduceMotion) {
    let idx = 0;
    setInterval(() => {
      const current = roles[idx];
      idx = (idx + 1) % roles.length;
      const next = roles[idx];

      current.classList.remove("is-active");
      current.classList.add("is-leaving");
      setTimeout(() => current.classList.remove("is-leaving"), 460);
      next.classList.add("is-active");
    }, 2800);
  }

  /* ============ 8. SCROLL REVEAL ============ */
  const revealEls = $$(".reveal");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  /* ============ 9. ANIMATED COUNTERS ============ */
  const counters = $$(".count");

  const runCounter = (el) => {
    const target = parseInt(el.dataset.count, 10) || 0;
    const dur = 1300;
    const start = performance.now();

    const step = (now) => {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      el.textContent = String(Math.round(eased * target)).padStart(2, "0");
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if (reduceMotion || !("IntersectionObserver" in window)) {
    counters.forEach((el) =>
      (el.textContent = String(el.dataset.count).padStart(2, "0"))
    );
  } else {
    const counterIO = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runCounter(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => counterIO.observe(el));
  }

  /* ============ 10. SKILL BARS ============ */
  const boq = $(".boq");
  if (boq) {
    $$(".boq__row", boq).forEach((row) => {
      const bar = $(".boq__bar i", row);
      if (bar) bar.style.setProperty("--w", (row.dataset.level || 0) + "%");
    });

    if (reduceMotion || !("IntersectionObserver" in window)) {
      boq.classList.add("is-visible");
    } else {
      const boqIO = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.2 }
      );
      boqIO.observe(boq);
    }
  }

  /* ============ 11. TIMELINE PROGRESS (supports multiple timelines) ============ */
  const timelines = $$(".timeline")
    .map((tl) => ({ tl, fill: $(".timeline__track i", tl) }))
    .filter((t) => t.fill);

  if (timelines.length && !reduceMotion) {
    let tlTicking = false;
    const drawTimelines = () => {
      if (tlTicking) return;
      tlTicking = true;
      requestAnimationFrame(() => {
        const vh = window.innerHeight;
        timelines.forEach(({ tl, fill }) => {
          const r = tl.getBoundingClientRect();
          // 0 when the timeline top reaches 80% of the viewport, 1 when its bottom passes 45%
          const raw = (vh * 0.8 - r.top) / (r.height + vh * 0.35);
          fill.style.height = Math.min(Math.max(raw, 0), 1) * 100 + "%";
        });
        tlTicking = false;
      });
    };
    window.addEventListener("scroll", drawTimelines, { passive: true });
    drawTimelines();
  } else {
    timelines.forEach(({ fill }) => (fill.style.height = "100%"));
  }

  /* ============ 12. PROJECT FILTERING ============ */
  const filterBtns = $$(".filters__btn");
  const sheetCards = $$("#sheets .sheet");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;

      filterBtns.forEach((b) => b.classList.toggle("is-active", b === btn));

      sheetCards.forEach((card) => {
        const show = filter === "all" || card.dataset.cat === filter;

        if (show) {
          card.classList.remove("is-gone");
          // next frame so the display change lands before the fade-in
          requestAnimationFrame(() =>
            requestAnimationFrame(() => card.classList.remove("is-filtered"))
          );
        } else {
          card.classList.add("is-filtered");
          if (reduceMotion) {
            card.classList.add("is-gone");
          } else {
            setTimeout(() => {
              if (card.classList.contains("is-filtered"))
                card.classList.add("is-gone");
            }, 320);
          }
        }
      });
    });
  });

  /* ============ 13. MOBILE NAV ============ */
  const navToggle = $("#navToggle");
  const navLinks = $("#navLinks");

  if (navToggle && navLinks) {
    const closeNav = () => {
      navLinks.classList.remove("is-open");
      navToggle.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open menu");
    };

    navToggle.addEventListener("click", () => {
      const open = navLinks.classList.toggle("is-open");
      navToggle.classList.toggle("is-open", open);
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    $$("a", navLinks).forEach((a) => a.addEventListener("click", closeNav));

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeNav();
    });
  }

  /* ============ 14. ACTIVE NAV LINK ============ */
  const sections = $$("main section[id]");
  const anchors = $$(".nav__links a[href^='#']");

  if (sections.length && anchors.length && "IntersectionObserver" in window) {
    const activeIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = "#" + entry.target.id;
          anchors.forEach((a) =>
            a.classList.toggle("is-active", a.getAttribute("href") === id)
          );
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => activeIO.observe(s));
  }

  /* ============ 15. FOOTER YEAR ============ */
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();
})();
