(function () {
  "use strict";

  const { profile, logos, projects } = window.CONTENT;
  document.documentElement.classList.add("js");

  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const logoHTML = (key, size) => {
    const logo = logos[key];
    if (!logo) return "";
    const inner = logo.src
      ? `<img src="${esc(logo.src)}" alt="${esc(logo.name)} logo">`
      : `<span aria-label="${esc(logo.name)} logo placeholder">${esc(logo.initials)}</span>`;
    const wordmark = logo.wordmark && logo.src ? " logo--wordmark" : "";
    return `<div class="logo logo--${size}${wordmark} squircle" title="${esc(logo.name)}">${inner}</div>`;
  };

  const imagePlaceholder = `
    <div class="media-placeholder">
      <svg viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect x="3" y="4" width="18" height="16" rx="4"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-9 9"/>
      </svg>
      <span>Image coming soon</span>
    </div>`;

  // One frame per project. Several items crossfade, chosen with thumbnails below.
  const mediaHTML = (p) => {
    const media = p.media || { items: [] };
    const items = media.items || [];
    const slides = items.map((m, i) => {
      const style = [
        m.position ? `object-position:${m.position}` : "",
        m.fit ? `object-fit:${m.fit}` : "",
      ].filter(Boolean).join(";");
      const bg = m.background ? ` style="background:${esc(m.background)}"` : "";
      const inner = m.type === "video"
        ? `<button class="video-poster" type="button" data-video="${esc(m.src)}" data-aspect="${esc(m.videoAspect || "16 / 9")}" data-title="${esc(m.alt)}" aria-label="Play video: ${esc(m.alt)}">
             <img src="${esc(m.poster)}" alt="" loading="lazy" decoding="async">
             <span class="video-poster__play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M7.5 5.5v13l11-6.5z"/></svg></span>
             <span class="video-poster__label">Watch demo</span>
           </button>`
        : `<img src="${esc(m.src)}" alt="${esc(m.alt)}" loading="lazy" decoding="async"${style ? ` style="${esc(style)}"` : ""}>`;
      return `<div class="slide${i === 0 ? " is-active" : ""}"${bg}${i === 0 ? "" : " aria-hidden=\"true\""}>${inner}</div>`;
    }).join("");

    const thumbs = items.length > 1
      ? `<div class="thumbs" role="group" aria-label="${esc(p.name)} photos">
          ${items.map((m, i) => `
            <button class="thumb" type="button" data-index="${i}" aria-label="Show photo ${i + 1} of ${items.length}" aria-pressed="${i === 0}">
              <img src="${esc(m.src)}" alt="" loading="lazy"${m.position ? ` style="object-position:${esc(m.position)}"` : ""}>
            </button>`).join("")}
        </div>`
      : "";

    return `
      <div class="media-frame squircle" style="aspect-ratio:${esc(media.aspect || "4 / 3")}">
        ${slides || imagePlaceholder}
      </div>
      ${thumbs}`;
  };

  /* ---------- Intro ---------- */
  document.getElementById("intro").innerHTML = `
    <div>
      <p class="eyebrow">Portfolio</p>
      <h1 class="intro__name">${esc(profile.name)}</h1>
      <p class="intro__headline">${esc(profile.headline)}</p>
    </div>
    <div class="intro__edu">
      ${logoHTML(profile.logo, "lg")}
      <div>
        <p class="intro__edu-name">${esc(profile.university)}</p>
        <p class="intro__edu-dept">${esc(profile.degree)}</p>
        <p class="intro__edu-loc">${esc(profile.location)}</p>
      </div>
    </div>
    <div class="intro__actions">
      <a class="button button--linkedin" href="${esc(profile.linkedin)}" target="_blank" rel="noopener">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/></svg>
        LinkedIn
      </a>
      <a class="button button--outlook" href="mailto:${esc(profile.email)}" title="${esc(profile.email)}">
        <img class="button__icon" src="${esc(logos.outlook.src)}" alt="" aria-hidden="true">
        Outlook
      </a>
    </div>`;

  /* ---------- Projects ---------- */
  // Every detail section has the same anatomy: small uppercase label, optional
  // bold title, then body text. Only the outcome adds a tinted box.
  const block = (label, body, title, extraClass = "") => `
    <div class="block${extraClass ? ` ${extraClass}` : ""}">
      <p class="block__label">${esc(label)}</p>
      ${title ? `<h4 class="block__title">${esc(title)}</h4>` : ""}
      <p class="block__body">${esc(body)}</p>
    </div>`;

  document.getElementById("project-list").innerHTML = projects
    .map((p) => `
      <article class="project reveal" id="${esc(p.id)}">
        <div class="project__media">
          ${mediaHTML(p)}
        </div>

        <div class="project__card squircle">
          <div class="project__meta">
            ${logoHTML(p.logo, "sm")}
            <div>
              <p class="project__role">${esc(p.role)}</p>
              <p class="project__org">${esc(p.organization)}</p>
              <p class="project__dates">${esc(p.dates)}</p>
            </div>
          </div>

          <h3 class="project__name">${esc(p.name)}</h3>
          <p class="project__desc">${esc(p.description)}</p>
          <ul class="skills" aria-label="Skills">
            ${p.skills.map((s) => `<li class="skill">${esc(s)}</li>`).join("")}
          </ul>

          <div class="details" id="${esc(p.id)}-details">
            <div class="details__inner" inert>
              <div class="project__body">
                ${block("The problem", p.problem)}
                ${p.myRole ? block("My role", p.myRole) : ""}
                ${p.insights.map((i) => block("Key insight", i.body, i.title)).join("")}
                ${block("Outcome", p.outcome, "", "outcome")}
              </div>
            </div>
          </div>

          <button class="read-more" type="button" aria-expanded="false" aria-controls="${esc(p.id)}-details">
            <span class="read-more__label">Read more</span>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
          </button>
        </div>
      </article>`)
    .join("");

  /* ---------- Logo tiles: square, as tall as the text beside them ---------- */
  // The text can wrap to more lines (e.g. a long organisation name), so each
  // tile follows its text block's height live and stays a perfect square.
  const sizeLogo = (logo) => {
    const text = logo.nextElementSibling;
    if (!text) return;
    const size = `${Math.round(text.getBoundingClientRect().height)}px`;
    logo.style.width = size;
    logo.style.height = size;
  };
  const logoTiles = document.querySelectorAll(".logo");
  logoTiles.forEach(sizeLogo);
  if ("ResizeObserver" in window) {
    const ro = new ResizeObserver((entries) =>
      entries.forEach((e) => sizeLogo(e.target.previousElementSibling)));
    logoTiles.forEach((logo) => logo.nextElementSibling && ro.observe(logo.nextElementSibling));
  }

  /* ---------- 3D tilt on project photos ---------- */
  // Only the photo frame tilts; the text card stays still. Mouse/trackpad only,
  // and skipped entirely for visitors who prefer reduced motion.
  const canTilt =
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (canTilt) {
    const MAX_TILT = 8; // degrees
    document.querySelectorAll(".project__media .media-frame").forEach((frame) => {
      let frameId = 0;
      let pointer = { x: 0.5, y: 0.5 };

      const render = () => {
        frameId = 0;
        const rotateY = (pointer.x - 0.5) * 2 * MAX_TILT;  // left/right
        const rotateX = (0.5 - pointer.y) * 2 * MAX_TILT;  // up/down
        frame.style.transform =
          `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale(1.02)`;
      };

      frame.addEventListener("pointerenter", () => frame.classList.add("is-tilting"));

      frame.addEventListener("pointermove", (e) => {
        // Measure the untransformed parent (the frame sits at its top-left) so the
        // tilt itself doesn't skew the reading; fresh each move survives scrolling.
        const origin = frame.parentElement.getBoundingClientRect();
        pointer = {
          x: Math.min(Math.max((e.clientX - origin.left) / frame.offsetWidth, 0), 1),
          y: Math.min(Math.max((e.clientY - origin.top) / frame.offsetHeight, 0), 1),
        };
        if (!frameId) frameId = requestAnimationFrame(render); // one update per frame
      });

      frame.addEventListener("pointerleave", () => {
        cancelAnimationFrame(frameId);
        frameId = 0;
        frame.classList.remove("is-tilting");
        frame.style.transform = ""; // springs back via the CSS transition
      });
    });
  }

  /* ---------- Photo thumbnails ---------- */
  document.getElementById("project-list").addEventListener("click", (e) => {
    const thumb = e.target.closest(".thumb");
    if (!thumb) return;
    const media = thumb.closest(".project__media");
    const index = Number(thumb.dataset.index);
    media.querySelectorAll(".slide").forEach((slide, i) => {
      slide.classList.toggle("is-active", i === index);
      slide.setAttribute("aria-hidden", String(i !== index));
    });
    media.querySelectorAll(".thumb").forEach((t, i) => t.setAttribute("aria-pressed", String(i === index)));
  });

  /* ---------- Video viewer ---------- */
  // Videos open large in a dialog so the player is never squeezed or clipped by card corners.
  const dialog = document.createElement("dialog");
  dialog.className = "video-dialog";
  dialog.innerHTML = `
    <div class="video-dialog__frame"></div>
    <button class="video-dialog__close" type="button" aria-label="Close video">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>
    </button>`;
  document.body.appendChild(dialog);
  const dialogFrame = dialog.querySelector(".video-dialog__frame");

  const closeVideo = () => dialog.close();
  dialog.addEventListener("close", () => { dialogFrame.innerHTML = ""; }); // stops playback
  dialog.querySelector(".video-dialog__close").addEventListener("click", closeVideo);
  dialog.addEventListener("click", (e) => { if (e.target === dialog) closeVideo(); }); // backdrop click

  document.getElementById("project-list").addEventListener("click", (e) => {
    const poster = e.target.closest(".video-poster");
    if (!poster) return;
    const [w, h] = poster.dataset.aspect.split("/").map(Number);
    dialogFrame.style.aspectRatio = `${w} / ${h}`;
    // Fit both width and height of the window so the whole video is always visible.
    dialog.style.width = `min(1100px, calc(100vw - 32px), calc((100vh - 120px) * ${w / h}))`;
    dialogFrame.innerHTML = `<iframe src="${esc(poster.dataset.video)}" title="${esc(poster.dataset.title)}" allow="autoplay; fullscreen" allowfullscreen></iframe>`;
    dialog.showModal();
  });

  /* ---------- Photo height follows the collapsed card ---------- */
  // Card height minus the expandable details = the collapsed height, and that
  // holds before, during and after the "Read more" animation. The photo column
  // is locked to it (see styles.css), so expanding never uncrops the photo.
  const lockMediaHeight = (card) => {
    const details = card.querySelector(".details");
    const media = card.parentElement.querySelector(".project__media");
    const collapsed = card.offsetHeight - (details ? details.offsetHeight : 0);
    media.style.setProperty("--card-h", `${collapsed}px`);
  };
  const cards = document.querySelectorAll(".project__card");
  const lockAll = () => cards.forEach(lockMediaHeight);
  lockAll(); // now, so it never depends on a resize event firing first
  window.addEventListener("resize", lockAll);
  window.addEventListener("load", lockAll);                  // after images/fonts settle
  if (document.fonts) document.fonts.ready.then(lockAll);
  if ("ResizeObserver" in window) {                          // text reflow, wrapping, etc.
    const cardRO = new ResizeObserver((entries) => entries.forEach((e) => lockMediaHeight(e.target)));
    cards.forEach((card) => cardRO.observe(card));
  }

  /* ---------- Even text-selection highlight ---------- */
  // Browsers size the native selection band by line box, and Safari stretches
  // some lines into the gaps, so bands come out uneven. Instead the native band
  // is made transparent (styles.css) and we paint our own: one band per line,
  // sized to the glyph box the browser reports for the selected text (identical
  // for every line of the same font size). Each band sits just behind the text,
  // inside the nearest element with its own background (page, card, skill pill,
  // outcome box...), so the white selected text stays on top.
  document.documentElement.classList.add("custom-selection");
  const selLayers = new Map(); // surface element -> its band layer

  const isTransparent = (cs) =>
    cs.backgroundImage === "none" &&
    (cs.backgroundColor === "transparent" || /rgba\(.*,\s*0\)$/.test(cs.backgroundColor));

  const surfaceFor = (el) => {
    for (let n = el; n && n !== document.body; n = n.parentElement) {
      if (!isTransparent(getComputedStyle(n))) return n;
    }
    return document.body;
  };

  const layerFor = (surface) => {
    let layer = selLayers.get(surface);
    if (layer && layer.isConnected) return layer;
    if (surface !== document.body) {
      // Make the surface a stacking context so a z-index:-1 layer paints above
      // its background but below its text. Don't disturb positioned elements.
      if (getComputedStyle(surface).position === "static") surface.style.position = "relative";
      surface.style.isolation = "isolate";
    }
    layer = document.createElement("div");
    layer.className = "sel-layer";
    layer.setAttribute("aria-hidden", "true");
    surface.appendChild(layer);
    selLayers.set(surface, layer);
    return layer;
  };

  const textNodesIn = (range) => {
    const root = range.commonAncestorContainer;
    if (root.nodeType === Node.TEXT_NODE) return [root];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) =>
        // skip whitespace, our own bands, and text hidden in collapsed "Read more"
        range.intersectsNode(n) && n.textContent.trim() &&
        !n.parentElement.closest(".sel-layer, [inert], [aria-hidden='true']")
          ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT,
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    return nodes;
  };

  let selFrame = 0;
  const paintSelection = () => {
    selFrame = 0;
    selLayers.forEach((layer) => layer.replaceChildren());
    const sel = document.getSelection();
    if (!sel || sel.isCollapsed || !sel.rangeCount) return;

    for (let r = 0; r < sel.rangeCount; r++) {
      const range = sel.getRangeAt(r);
      textNodesIn(range).forEach((node) => {
        const part = document.createRange();
        part.selectNodeContents(node);
        if (node === range.startContainer) part.setStart(node, range.startOffset);
        if (node === range.endContainer) part.setEnd(node, range.endOffset);

        const surface = surfaceFor(node.parentElement);
        const layer = layerFor(surface);
        const box = layer.getBoundingClientRect();
        [...part.getClientRects()].forEach((rect) => {
          if (rect.width < 0.5 || rect.height < 0.5) return;
          const band = document.createElement("span");
          band.className = "sel-band";
          band.style.cssText =
            `left:${rect.left - box.left}px;top:${rect.top - box.top}px;` +
            `width:${rect.width}px;height:${rect.height}px`;
          layer.appendChild(band);
        });
      });
    }
  };
  const scheduleSelection = () => { if (!selFrame) selFrame = requestAnimationFrame(paintSelection); };
  document.addEventListener("selectionchange", scheduleSelection);
  window.addEventListener("resize", scheduleSelection);

  /* ---------- Read more ---------- */
  document.getElementById("project-list").addEventListener("click", (e) => {
    const button = e.target.closest(".read-more");
    if (!button) return;
    const card = button.closest(".project__card");
    const inner = card.querySelector(".details__inner");
    const open = button.getAttribute("aria-expanded") !== "true";

    button.setAttribute("aria-expanded", String(open));
    button.querySelector(".read-more__label").textContent = open ? "Show less" : "Read more";
    card.classList.toggle("is-open", open);
    inner.inert = !open;

    // Collapsing a long card can leave the reader below it; bring its top back into view.
    if (!open && card.getBoundingClientRect().top < 0) {
      card.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });

  document.getElementById("footer-text").textContent =
    `© ${new Date().getFullYear()} ${profile.name}`;

  /* ---------- Scroll reveal: one element at a time as it enters view ---------- */
  const targets = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    // Threshold 0 + a bottom inset: projects can be taller than the screen on
    // phones, so trigger on the top edge crossing ~92% of the viewport height
    // (low enough that the "Projects" heading shows on first load).
    { threshold: 0, rootMargin: "0px 0px -8% 0px" }
  );
  targets.forEach((el) => {
    // Anything already on screen at load (e.g. the "Projects" heading) reveals
    // straight away, so the first view never looks like the page ends early.
    if (el.getBoundingClientRect().top < window.innerHeight) {
      requestAnimationFrame(() => el.classList.add("is-visible"));
    } else {
      observer.observe(el);
    }
  });

  // A fast scroll (or jumping to an anchor) can skip right past an element
  // without it ever intersecting; reveal anything already above the viewport.
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      targets.forEach((el) => {
        if (!el.classList.contains("is-visible") && el.getBoundingClientRect().bottom < 0) {
          el.classList.add("is-visible");
          observer.unobserve(el);
        }
      });
      ticking = false;
    });
  }, { passive: true });
})();
