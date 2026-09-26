'use strict';

/* ---------- INTRO SEQUENCE ----------
   Raw-data glyphs scatter in, funnel through a mini pipeline, then the
   headline scrambles into place before the overlay reveals the real page.
   Plays once per browser session (see sessionStorage check at the bottom).
   To force it to always play, delete that sessionStorage block. */
(function () {
  const overlay = document.getElementById('introOverlay');
  if (!overlay) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) { overlay.remove(); return; }

  const glyphLayer = overlay.querySelector('.intro-glyph-layer');
  const pipeline = overlay.querySelector('.intro-pipeline');
  const pipelineNodes = pipeline.querySelectorAll('.p-node');
  const pipelineLinks = pipeline.querySelectorAll('.p-link');
  const headline = overlay.querySelector('.intro-headline');
  const skipBtn = overlay.querySelector('.intro-skip');

  const GLYPHS = [
    'SELECT *', '{ }', '[ ]', 'NULL', '0x2F9A', 'JOIN ON', 'raw.csv',
    "{'id':17}", 'GROUP BY', '9F3A', ';', 'df.pivot()', 'ETL', '42.0',
    'import pandas', 'CREATE TABLE', 'await fetch()', 'schema.json'
  ];

  const TARGET = 'I architect solutions that turn complexity into clarity.';
  const AMBER_WORD = 'solutions';
  const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ01{}[]<>/*#';

  document.body.classList.add('intro-lock');

  // ---------- Phase 1: scatter glyphs (funnel toward the "Raw" node) ----------
  const rawRect = pipelineNodes[0].getBoundingClientRect();
  const targetXvw = ((rawRect.left + rawRect.width / 2) / window.innerWidth) * 100;
  const targetYvh = ((rawRect.top + rawRect.height / 2) / window.innerHeight) * 100;

  const glyphEls = GLYPHS.map((text, i) => {
    const el = document.createElement('span');
    el.className = 'intro-glyph' + (i % 4 === 0 ? ' amber' : '');
    el.textContent = text;
    const x = 6 + Math.random() * 88;
    const y = 10 + Math.random() * 80;
    el.style.left = x + 'vw';
    el.style.top = y + 'vh';
    el.style.setProperty('--fx', (targetXvw - x) + 'vw');
    el.style.setProperty('--fy', (targetYvh - y) + 'vh');
    glyphLayer.appendChild(el);
    return el;
  });

  glyphEls.forEach((el, i) => {
    setTimeout(() => el.classList.add('show'), 60 + i * 55);
  });

  // ---------- Phase 2: funnel into the pipeline, nodes appear one at a time ----------
  const FUNNEL_START = 1900;
  const NODE_STEP = 900; // gap between each node/link appearing (slowed down)

  setTimeout(() => {
    // glyphs funnel into the "Raw" node as it appears
    pipelineNodes[0].classList.add('show');
    glyphEls.forEach((el, i) => {
      setTimeout(() => el.classList.add('funnel'), i * 18);
    });
  }, FUNNEL_START);

  setTimeout(() => {
    pipelineLinks[0].classList.add('show');
    pipelineNodes[1].classList.add('show');
  }, FUNNEL_START + NODE_STEP);

  setTimeout(() => {
    pipelineLinks[1].classList.add('show');
    pipelineNodes[2].classList.add('show');
  }, FUNNEL_START + NODE_STEP * 2);

  // extra hold so the completed pipeline is readable before it fades
  const PIPELINE_HOLD = 1000;

  // ---------- Phase 3: scramble headline into place ----------
  const HEADLINE_START = FUNNEL_START + NODE_STEP * 2 + PIPELINE_HOLD;
  setTimeout(() => {
    pipeline.classList.add('hide');
    headline.classList.add('show');
    runScramble();
  }, HEADLINE_START);

  function runScramble() {
    const line = headline.querySelector('.scramble-line');
    const amberStart = TARGET.indexOf(AMBER_WORD);
    const amberEnd = amberStart + AMBER_WORD.length;
    const total = TARGET.length;
    const revealMs = 34; // ms per character "lock in"
    let frame = 0;
    const maxFrames = total + 12;

    const timer = setInterval(() => {
      let out = '';
      for (let i = 0; i < total; i++) {
        const lockPoint = i * 1.15;
        let ch;
        if (frame >= lockPoint + 10) {
          ch = TARGET[i];
        } else if (TARGET[i] === ' ') {
          ch = ' ';
        } else {
          ch = SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        }
        out += ch;
      }
      const before = escapeHtml(out.slice(0, amberStart));
      const mid = escapeHtml(out.slice(amberStart, amberEnd));
      const after = escapeHtml(out.slice(amberEnd));
      line.innerHTML = `${before}<span class="amber-word">${mid}</span>${after}`;

      frame++;
      if (frame > maxFrames) {
        clearInterval(timer);
        line.innerHTML = `${escapeHtml(TARGET.slice(0, amberStart))}<span class="amber-word">${escapeHtml(AMBER_WORD)}</span>${escapeHtml(TARGET.slice(amberEnd))}`;
        setTimeout(finish, 650);
      }
    }, revealMs);
  }

  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // ---------- Phase 4: reveal the real page ----------
  function finish() {
    overlay.classList.add('intro-hide');
    document.body.classList.remove('intro-lock');
    try { sessionStorage.setItem('introPlayed', '1'); } catch (e) {}
    setTimeout(() => overlay.remove(), 800);
  }

  skipBtn.addEventListener('click', finish);

  // NOTE: "play once per session" was removed here while we confirm the
  // animation itself renders correctly. See the note at the bottom of this
  // file for how to re-add it once you're happy with the sequence.
})();
