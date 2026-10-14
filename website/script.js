document.documentElement.classList.add('js');

/* ══ Overlay menu ══ */
(function () {
  const burger = document.getElementById('burger');
  const menu = document.getElementById('menu');
  if (!burger || !menu) return;
  burger.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
  });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    menu.classList.remove('open'); burger.classList.remove('open');
  }));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { menu.classList.remove('open'); burger.classList.remove('open'); }
  });
})();

/* ══ Reveal ══ */
const ro = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: .1, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll('.reveal').forEach(el => ro.observe(el));

/* ══ Chatbot ══ */
(function () {
  const trig = document.getElementById('cbTrigger');
  if (!trig) return;
  const win = document.getElementById('cbWin');
  const close = document.getElementById('cbClose');
  const msgs = document.getElementById('cbMsgs');
  const input = document.getElementById('cbInput');
  const send = document.getElementById('cbSend');
  const chips = document.getElementById('cbChips');

  trig.addEventListener('click', () => {
    win.style.display = 'flex'; trig.style.display = 'none'; input.focus();
  });
  close.addEventListener('click', () => {
    win.style.display = 'none'; trig.style.display = 'flex';
  });

  /* Knowledge base — each topic has matchers and one or more replies */
  const KB = [
    { id:'greet', match:/^(hi|hey|hello|yo|good (morning|afternoon|evening))/,
      say:["Hey! I'm Ola's assistant. Ask me about his work, his stack, or how to hire him.",
           "Hi there. Want to hear about Sojourn, his client work, or his skills?"] },

    { id:'sojourn', match:/sojourn|shortlet|booking platform|abuja|port harcourt|benin/,
      say:["Sojourn Nigeria (sojourn.ng) is a shortlet apartment booking platform live in Lagos, Abuja, Port Harcourt and Benin. Ola is the lead developer — he handles all implementation while the founder owns product direction.",
           "On Sojourn, Ola built and maintains the Next.js 14 frontend, a NestJS + Supabase backend, Paystack payment flows, booking hold and auto-cancel logic, and the admin dashboard."] },

    { id:'projects', match:/project|portfolio|work|built|build|show me|what has he|case stud/,
      say:["Seven featured projects: Sojourn Nigeria, QUMI Fashion, CityGirl Wardrobe, Primusige, Drivers@Work, SequencePro and The Neo Consult. All have live links on the Projects page.",
           "His range goes from a four-city booking platform down to fashion storefronts and photography portfolios. Head to Projects for live links."] },

    { id:'neo', match:/neo ?consult/,
      say:["The Neo Consult (www.theneoconsult.com) is a study-abroad consultancy site with services, a course finder, a blog, an apply flow and a chat assistant. Live link on the Projects page."] },

    { id:'qumi', match:/qumi/,
      say:["QUMI Fashion is a bold editorial site for a fashion styling brand — services, portfolio and a consultation booking flow. Live at qumifashion.com."] },

    { id:'citygirl', match:/citygirl|city girl|wardrobe/,
      say:["CityGirl Wardrobe is a fashion storefront with Supabase integration, a full admin system, hero video and product carousels."] },

    { id:'primus', match:/primus|photograph/,
      say:["Primusige is a photography portfolio built around marquee reel sections and a rebuilt events section — designed to let the images carry the page."] },

    { id:'drivers', match:/driver|fleet|ride.?share/,
      say:["Drivers@Work is a fleet management platform for ride-share operators — installment tracking, driver progress, earnings and overdue alerts, with separate admin and driver dashboards."] },

    { id:'sequence', match:/sequence|video tool|clip/,
      say:["SequencePro auto-generates every combination of hook, lead and body clips you upload. Built for creators producing content at volume."] },

    { id:'frontend', match:/front.?end|react|next\.?js|ui|css|html/,
      say:["Frontend: HTML5, CSS3, JavaScript, React and Next.js. Ola builds everything from static single-file client sites to full Next.js apps."] },

    { id:'backend', match:/back.?end|api|database|server|nest|node|supabase|firebase|python/,
      say:["Backend: Node.js, NestJS, Python, Supabase and Firebase, with REST APIs and TypeORM. He handles deployment too — Vercel, Render and Netlify."] },

    { id:'payments', match:/payment|paystack|stripe|checkout/,
      say:["Ola has shipped live payment flows with both Paystack (Nigeria) and Stripe (international), including webhook hardening and booking status handling."] },

    { id:'skills', match:/skill|stack|tech|tools|know|language|experienc/,
      say:["Full stack: React and Next.js on the frontend, Node/NestJS with Supabase or Firebase on the backend, plus Python, Git and payment integrations. Full grid on the About page."] },

    { id:'ai', match:/\bai\b|artificial|machine learning|chatbot|automat/,
      say:["Ola completed ALX Africa's AI for Creatives programme and applies AI practically — this chatbot, AI-assisted tooling, and automated video production in SequencePro."] },

    { id:'certs', match:/cert|alx|qualif|course|train|degree|educat|study/,
      say:["Three ALX Africa certificates: Backend Web Development, AI for Creatives, and Professional Foundations — all project-based programmes."] },

    { id:'price', match:/price|cost|charge|rate|budget|how much|quote|afford/,
      say:["Pricing depends on scope. Fill in the quote form on the About page with your project type and budget range and Ola will come back within 24 hours with an approach and a price."] },

    { id:'hire', match:/hire|avail|free|take on|work with|freelanc|client/,
      say:["Yes, he takes on client work alongside Sojourn. The quote form on the About page is the fastest route — he replies within 24 hours."] },

    { id:'timeline', match:/how long|timeline|deadline|turnaround|when can|fast/,
      say:["Depends on scope — a landing page is days, a storefront or web app is weeks. Share your deadline in the quote form and he'll tell you straight whether it's doable."] },

    { id:'contact', match:/contact|email|phone|reach|call|message|whatsapp|number/,
      say:["Email prettykoke123@gmail.com or call +234 816 901 1311. There's also a quote form on the About page."] },

    { id:'location', match:/where|located|based|lagos|nigeria|remote|timezone/,
      say:["Ola is based in Lagos, Nigeria, and works with clients locally and abroad — he's built for UK-facing businesses too."] },

    { id:'social', match:/github|linkedin|instagram|social|profile/,
      say:["GitHub: LifeofaBlvckman. LinkedIn is linked in the menu and the footer of every page."] },

    { id:'thanks', match:/thank|thanks|cheers|appreciate|nice|cool|awesome|love/,
      say:["Anytime. Anything else you want to know?", "Glad that helped. Ask away if there's more."] },

    { id:'bye', match:/bye|goodbye|later|see you/,
      say:["Take care. The quote form is there whenever you're ready."] }
  ];

  const FALLBACK = [
    "I'm not sure about that one. Try asking about Sojourn, his projects, his stack, pricing, or how to get in touch.",
    "That's outside what I know. I can help with projects, skills, pricing and contact details."
  ];

  const pick = arr => arr[Math.floor(Math.random() * arr.length)];

  function answer(q) {
    const t = q.toLowerCase().trim();
    for (const topic of KB) if (topic.match.test(t)) return pick(topic.say);
    return pick(FALLBACK);
  }

  /* ── AI backend ──
     Your server's address (see the server README). Leave empty to use only the
     built-in answers above, e.g. while the server isn't deployed yet. */
  const API_BASE = 'https://YOUR-SERVICE.onrender.com';

  const history = [];          // what's sent to the AI so it remembers the conversation
  let speakReplies = false;    // speaker toggle in the header
  let busy = false;
  const player = new Audio();

  function addMsg(text, isUser) {
    const d = document.createElement('div');
    d.className = 'cmsg ' + (isUser ? 'user' : 'bot');
    d.textContent = text;
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function showDots() {
    const dots = document.createElement('div');
    dots.className = 'dots'; dots.id = 'dt';
    dots.innerHTML = '<span></span><span></span><span></span>';
    msgs.appendChild(dots);
    msgs.scrollTop = msgs.scrollHeight;
  }

  async function aiReply(spoken) {
    if (!API_BASE || API_BASE.includes('YOUR-SERVICE')) throw new Error('no backend');
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 25000);
    try {
      const res = await fetch(API_BASE + '/api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, spoken }), signal: ctrl.signal
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 429) return { text: data.detail || 'Too many messages. Try again shortly.', limited: true };
      if (!res.ok || !data.reply) throw new Error('bad response');
      return { text: data.reply };
    } finally { clearTimeout(timer); }
  }

  async function ask(text, spoken = false) {
    if (!text || busy) return;
    busy = true;
    addMsg(text, true);
    input.value = '';
    if (chips) chips.style.display = 'none';
    history.push({ role: 'user', content: text });
    showDots();

    let reply;
    try {
      const r = await aiReply(spoken || speakReplies);
      reply = r.text;
      if (r.limited) history.pop(); else history.push({ role: 'assistant', content: reply });
    } catch {
      // Server down, not deployed yet, or offline: fall back to the built-in answers.
      reply = answer(text);
      await new Promise(r => setTimeout(r, Math.min(1400, 450 + reply.length * 7)));
      history.push({ role: 'assistant', content: reply });
    }
    document.getElementById('dt')?.remove();
    addMsg(reply, false);
    busy = false;
    if (spoken || speakReplies) speak(reply);
  }

  /* ── Voice out: server voice (same Nigerian voice as the Telegram bot), browser voice as backup ── */
  async function speak(text) {
    try {
      if (!API_BASE || API_BASE.includes('YOUR-SERVICE')) throw new Error('no backend');
      const res = await fetch(API_BASE + '/api/speak', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      if (!res.ok) throw new Error('tts failed');
      const url = URL.createObjectURL(await res.blob());
      player.src = url;
      player.onended = () => URL.revokeObjectURL(url);
      await player.play();
    } catch {
      if (!('speechSynthesis' in window)) return;
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-NG';
      speechSynthesis.speak(u);
    }
  }

  // Phones only allow audio that starts from a tap, so "unlock" the player on the first tap.
  let unlocked = false;
  function unlockAudio() {
    if (unlocked) return;
    unlocked = true;
    player.src = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA=';
    player.play().catch(() => {});
  }
  win.addEventListener('pointerdown', unlockAudio, { once: true });

  /* Speaker toggle, added to the header next to the close button */
  const head = win.querySelector('.cb-head');
  const actions = document.createElement('div');
  actions.className = 'cb-actions';
  const spk = document.createElement('button');
  spk.className = 'cb-spk'; spk.setAttribute('aria-label', 'Read replies aloud');
  spk.setAttribute('aria-pressed', 'false');
  spk.innerHTML = '<i class="fas fa-volume-xmark"></i>';
  spk.addEventListener('click', () => {
    speakReplies = !speakReplies;
    spk.setAttribute('aria-pressed', String(speakReplies));
    spk.classList.toggle('on', speakReplies);
    spk.innerHTML = speakReplies ? '<i class="fas fa-volume-high"></i>' : '<i class="fas fa-volume-xmark"></i>';
    if (!speakReplies) { player.pause(); if ('speechSynthesis' in window) speechSynthesis.cancel(); }
  });
  actions.append(spk, close);
  head.appendChild(actions);

  /* Voice in: the browser's own speech recognition (Chrome, Edge, Safari, Android).
     Browsers without it (e.g. Firefox) simply don't get a mic button. */
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SR) {
    const mic = document.createElement('button');
    mic.className = 'cb-mic'; mic.setAttribute('aria-label', 'Speak your question');
    mic.innerHTML = '<i class="fas fa-microphone"></i>';
    input.parentElement.insertBefore(mic, send);
    let rec = null;
    mic.addEventListener('click', () => {
      if (rec) { rec.stop(); return; }
      player.pause();
      rec = new SR();
      rec.lang = 'en-NG';
      rec.interimResults = true;
      rec.onresult = e => {
        const said = Array.from(e.results).map(r => r[0].transcript).join(' ');
        input.value = said;
        if (e.results[e.results.length - 1].isFinal) { rec.stop(); ask(said.trim(), true); }
      };
      const done = () => { rec = null; mic.classList.remove('listening'); input.placeholder = 'Ask anything…'; };
      rec.onend = done;
      rec.onerror = done;
      mic.classList.add('listening');
      input.placeholder = 'Listening…';
      rec.start();
    });
  }

  send.addEventListener('click', () => ask(input.value.trim()));
  input.addEventListener('keypress', e => { if (e.key === 'Enter') ask(input.value.trim()); });
  if (chips) chips.querySelectorAll('.chip').forEach(c =>
    c.addEventListener('click', () => ask(c.textContent)));
})();

/* ══ Quote form ══ */
(function () {
  const form = document.getElementById('quoteForm');
  if (!form) return;
  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const btn = document.getElementById('qfBtn');
    const note = document.getElementById('qfNote');
    const orig = btn.textContent;
    btn.textContent = 'Sending…'; btn.disabled = true;
    const fd = new FormData(this);
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: '8b2632e4-0381-46d2-af43-84d5a3c3cf56',
          name: fd.get('name'), email: fd.get('email'), phone: fd.get('phone'),
          website_type: fd.get('website_type'), budget: fd.get('budget'),
          message: fd.get('message'), subject: 'New Portfolio Inquiry'
        })
      });
      const r = await res.json();
      if (r.success) {
        note.textContent = 'Thanks — your message is in. I reply within 24 hours.';
        this.reset();
      } else {
        note.textContent = 'That did not send. Email prettykoke123@gmail.com instead.';
      }
    } catch {
      note.textContent = 'That did not send. Email prettykoke123@gmail.com instead.';
    } finally { btn.textContent = orig; btn.disabled = false; }
  });
})();
