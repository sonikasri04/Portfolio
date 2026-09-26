'use strict';

/* ---------- NAV ---------- */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => navLinks.classList.remove('open'))
);

/* ---------- PROJECT MEDIA ----------
   To add your own screenshots: drop files into assets/images/<project-id>/
   named 1.jpg, 2.jpg, 3.jpg (they overwrite the placeholders directly — no
   code change needed). Using more than 3, or a different extension? Just
   edit that project's `imageCount` / `imageExt` below.

   To add your write-up: replace the `doc` string for that project. Use a
   blank line between paragraphs — it renders as separate paragraphs. */
const PROJECTS = {
  recommender: {
    title: 'Personalized Content Recommender',
    imageCount: 2,
    imageExt: 'png',
    doc: `Add the write-up for the Personalized Content Recommender here — methodology, evaluation setup, and key findings from the MIND-dataset A/B test.`
  },
  clickstream: {
    title: 'Real-Time Clickstream Analytics',
    imageCount: 4,
    imageExt: 'png',
    doc: `Add the write-up for the Real-Time Clickstream Analytics platform here — pipeline design, windowing logic, and throughput results.`
  },
  insurance: {
    title: 'Insurance Premium Predictor',
    imageCount: 3,
    imageExt: 'png',
    doc: `Add the write-up for the Insurance Premium Predictor here — EDA highlights, model selection, and fairness audit findings.`
  },
  parks: {
    title: 'National Parks Explorer',
    imageCount: 3,
    imageExt: 'png',
    doc: `Add the write-up for the National Parks Explorer here — data sources, schema design, and the analytics modules delivered.`
  },
  voicelink: {
    title: 'VoiceLink',
    imageCount: 3,
    imageExt: 'png',
    doc: `Add the write-up for VoiceLink here — what it does end-to-end and how the API, dashboard, and web modules fit together.`
  },
  portfolio: {
    title: 'Technology Portfolio Budget & Delivery Analytics Dashboard',
    imageCount: 3,
    imageExt: 'jpg',
    doc: `Add the write-up for the Technology Portfolio Dashboard here — the forecasting logic, the RAG health model, and the reallocation memo.`
  }
};

// Build each project's image path list from its folder convention.
Object.entries(PROJECTS).forEach(([id, p]) => {
  p.images = Array.from(
    { length: p.imageCount },
    (_, i) => `assets/images/${id}/${i + 1}.${p.imageExt}`
  );
});

const FALLBACK_IMG = 'assets/images/placeholder.svg';

/* ---------- LIGHTBOX ---------- */
const overlay = document.getElementById('lightboxOverlay');
const box = document.getElementById('lightboxBox');
let lbState = { images: [], index: 0, title: '' };

document.querySelectorAll('[data-media]').forEach(btn =>
  btn.addEventListener('click', () => openMedia(btn.dataset.media))
);
document.querySelectorAll('[data-doc]').forEach(btn =>
  btn.addEventListener('click', () => openDoc(btn.dataset.doc))
);

function openMedia(id) {
  const p = PROJECTS[id];
  if (!p) return;
  lbState = { images: p.images, index: 0, title: p.title };
  renderMedia();
  overlay.classList.add('open');
}

function renderMedia() {
  const multi = lbState.images.length > 1;
  box.innerHTML = `
    <button class="lightbox-close" data-action="close" aria-label="Close">✕</button>
    <div class="lb-media">
      ${multi ? '<button class="lb-nav lb-prev" data-action="prev" aria-label="Previous image">‹</button>' : ''}
      <img src="${lbState.images[lbState.index]}" alt="${lbState.title} result ${lbState.index + 1}"
           onerror="this.onerror=null;this.src='${FALLBACK_IMG}';">
      ${multi ? '<button class="lb-nav lb-next" data-action="next" aria-label="Next image">›</button>' : ''}
    </div>
    <div class="lb-caption">${lbState.title} — ${lbState.index + 1} / ${lbState.images.length}</div>`;
}

function lbStep(dir) {
  lbState.index = (lbState.index + dir + lbState.images.length) % lbState.images.length;
  renderMedia();
}

function openDoc(id) {
  const p = PROJECTS[id];
  if (!p) return;
  box.innerHTML = `
    <button class="lightbox-close" data-action="close" aria-label="Close">✕</button>
    <div class="lb-doc">
      <h3>${p.title}</h3>
      <div class="lb-doc-body">${p.doc}</div>
    </div>`;
  overlay.classList.add('open');
}

function closeLightbox() {
  overlay.classList.remove('open');
}

// Delegated clicks inside the lightbox (content is re-rendered dynamically).
box.addEventListener('click', e => {
  const action = e.target.closest('[data-action]')?.dataset.action;
  if (action === 'close') closeLightbox();
  if (action === 'prev') lbStep(-1);
  if (action === 'next') lbStep(1);
});
overlay.addEventListener('click', e => {
  if (e.target === overlay) closeLightbox();
});
document.addEventListener('keydown', e => {
  if (!overlay.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight' && lbState.images.length > 1) lbStep(1);
  if (e.key === 'ArrowLeft' && lbState.images.length > 1) lbStep(-1);
});
