
(() => {
  const qs=(s,c=document)=>c.querySelector(s), qsa=(s,c=document)=>[...c.querySelectorAll(s)];
  const header=qs('.site-header')||document.body.querySelector(':scope > header');
  // Permanent master header: no scroll-based resizing.
  if(header) header.classList.remove('is-scrolled');

  const menuBtn=qs('.menu-btn'), nav=qs('.nav'), navLinks=qs('.nav-links');
  if(menuBtn&&nav&&navLinks){
    const closeMenu=()=>{nav.classList.remove('open');document.body.classList.remove('menu-open');menuBtn.setAttribute('aria-expanded','false');menuBtn.setAttribute('aria-label','Open menu')};
    const toggleMenu=()=>{const open=!nav.classList.contains('open');nav.classList.toggle('open',open);document.body.classList.toggle('menu-open',open);menuBtn.setAttribute('aria-expanded',String(open));menuBtn.setAttribute('aria-label',open?'Close menu':'Open menu')};
    menuBtn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();toggleMenu()});
    qsa('a',navLinks).forEach(a=>a.addEventListener('click',closeMenu));
    document.addEventListener('click',e=>{if(nav.classList.contains('open')&&!nav.contains(e.target))closeMenu()});
    addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
    addEventListener('resize',()=>{if(innerWidth>1080)closeMenu()},{passive:true});
  }

  const revealTargets=qsa('main section, .stats, .leadership-row, .cards, .cards-3, .pillars, .topic-grid, .controls, .services-four-grid, .services-material-strip');
  revealTargets.forEach((el,i)=>{el.classList.add(i%3===0?'reveal-stagger':'reveal')});
  qsa('.card,.pillar,.topic,.control,.leader-card,.material-card,.why-volvo-card,.config').forEach(el=>el.classList.add('ca-card-hover'));
  const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');io.unobserve(e.target)}}),{threshold:.08,rootMargin:'0px 0px -40px'});
  revealTargets.forEach(el=>io.observe(el));

  // Count up numeric statistics once.
  const countEls=qsa('.stat strong,.stat b,.about-stat strong,.capacity-number').filter(el=>/\d/.test(el.textContent)&&!el.hasAttribute('data-no-count'));
  const countIO=new IntersectionObserver(entries=>entries.forEach(e=>{if(!e.isIntersecting)return;const el=e.target;const raw=el.textContent.trim();const m=raw.match(/^([\d,.]+)/);if(!m){countIO.unobserve(el);return}const target=parseFloat(m[1].replace(/,/g,''));if(!isFinite(target)||target>100000){countIO.unobserve(el);return}const suffix=raw.replace(m[1],'');const start=performance.now(),dur=900;const step=t=>{const p=Math.min(1,(t-start)/dur);const eased=1-Math.pow(1-p,3);const val=target%1? (target*eased).toFixed(1):Math.round(target*eased).toLocaleString();el.textContent=val+suffix;if(p<1)requestAnimationFrame(step)};requestAnimationFrame(step);countIO.unobserve(el)}),{threshold:.6});countEls.forEach(el=>countIO.observe(el));

  // Background-video lifecycle. Controls are intentionally omitted for a cleaner hero.
  qsa('video').forEach(video=>{
    video.muted=true;video.setAttribute('playsinline','');
    const vio=new IntersectionObserver(([entry])=>{
      if(entry.isIntersecting&&!matchMedia('(prefers-reduced-motion: reduce)').matches) video.play().catch(()=>{});
      else video.pause();
    },{threshold:.15});
    vio.observe(video);
  });

  // Lightweight hero parallax on capable devices.
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&innerWidth>900){addEventListener('scroll',()=>{const y=Math.min(40,scrollY*.045);qsa('.hero-media,.about-hero').forEach(el=>el.style.setProperty('--parallax-y',`${y}px`));const vids=qsa('.services-premium-video');vids.forEach(v=>v.style.transform=`translate3d(0,${y*.35}px,0) scale(1.035)`)} ,{passive:true})}

  // Anchor navigation active state.
  const anchorNav=qs('.page-anchor-nav');
  if(anchorNav){const links=qsa('a[href^="#"]',anchorNav);const sections=links.map(a=>qs(a.getAttribute('href'))).filter(Boolean);const sio=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){links.forEach(a=>a.classList.toggle('is-active',a.getAttribute('href')===`#${e.target.id}`))}}),{rootMargin:'-30% 0px -60% 0px'});sections.forEach(s=>sio.observe(s))}

  // Quote modal: creates an email draft; no server dependency required.
  const modal=qs('.quote-modal');
  const openModal=()=>{if(!modal)return;modal.classList.add('is-open');document.body.style.overflow='hidden';qs('input',modal)?.focus()};
  const closeModal=()=>{if(!modal)return;modal.classList.remove('is-open');document.body.style.overflow=''};
  qsa('a[href^="mailto:quotes@cartageaustralia.com"],.js-quote').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();openModal()}));
  qsa('[data-close-quote]').forEach(b=>b.addEventListener('click',closeModal));
  addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
  const form=qs('.quote-form');if(form)form.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(form);const subject=encodeURIComponent(`Website quote request – ${d.get('projectLocation')||'Project enquiry'}`);const body=encodeURIComponent(`Name: ${d.get('name')}\nCompany: ${d.get('company')}\nPhone: ${d.get('phone')}\nEmail: ${d.get('email')}\nProject location: ${d.get('projectLocation')}\nMaterial: ${d.get('material')}\nEstimated quantity: ${d.get('quantity')}\nRequired dates: ${d.get('dates')}\nWork type: ${d.get('workType')}\n\nDetails:\n${d.get('details')}`);location.href=`mailto:quotes@cartageaustralia.com?subject=${subject}&body=${body}`});

  // Page transition for internal HTML links only.
  const transition=qs('.page-transition');qsa('a[href$=".html"],a[href*=".html#"]').forEach(a=>a.addEventListener('click',e=>{if(e.metaKey||e.ctrlKey||e.shiftKey||a.target)return;const href=a.getAttribute('href');if(!href||href.startsWith('http'))return;e.preventDefault();transition?.classList.add('is-active');setTimeout(()=>location.href=href,150)}));
})();


// Accessible back-to-top control
(() => {
  const button = document.querySelector('.back-to-top');
  if (!button) return;
  const update = () => button.classList.toggle('is-visible', window.scrollY > Math.max(500, window.innerHeight * 0.75));
  window.addEventListener('scroll', update, { passive: true });
  button.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  update();
})();


// Static-site enquiry routing: prepares a mailto using the selected enquiry type.
document.querySelectorAll('.routed-form:not(.netlify-careers-form)').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const type = data.get('enquiryType') || 'careers';
    const recipients = {
      quote: 'quotes@cartageaustralia.com',
      careers: 'careers@cartageaustralia.com',
      accounts: 'accounts@cartageaustralia.com',
      general: 'info@cartageaustralia.com'
    };
    const recipient = form.dataset.defaultRecipient || recipients[type] || recipients.general;
    const subject = type === 'careers' ? 'Careers enquiry - Cartage Australia' : `Website enquiry - ${String(type).replace(/\b\w/g, c => c.toUpperCase())}`;
    const lines = [];
    for (const [key, value] of data.entries()) {
      if (String(value).trim()) lines.push(`${key.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase())}: ${value}`);
    }
    window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n\n'))}`;
  });
});


// Careers applications: submit securely to Netlify Forms with a single resume upload.
(() => {
  const form = document.querySelector('.netlify-careers-form');
  if (!form) return;
  const fileInput = form.querySelector('input[type="file"][name="resume"]');
  const status = form.querySelector('.careers-form-status');
  const submit = form.querySelector('button[type="submit"]');
  const allowedExt = new Set(['pdf','doc','docx']);
  const allowedMime = new Set([
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/octet-stream',
    ''
  ]);
  const maxBytes = 8 * 1024 * 1024;

  async function validSignature(file, ext) {
    const bytes = new Uint8Array(await file.slice(0, 8).arrayBuffer());
    const starts = (...vals) => vals.every((v, i) => bytes[i] === v);
    if (ext === 'pdf') return starts(0x25,0x50,0x44,0x46); // %PDF
    if (ext === 'doc') return starts(0xD0,0xCF,0x11,0xE0,0xA1,0xB1,0x1A,0xE1); // OLE/CFB
    if (ext === 'docx') return starts(0x50,0x4B,0x03,0x04) || starts(0x50,0x4B,0x05,0x06) || starts(0x50,0x4B,0x07,0x08); // ZIP container
    return false;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (status) status.textContent = '';
    const file = fileInput?.files?.[0];
    if (file) {
      const ext = (file.name.split('.').pop() || '').toLowerCase();
      if (!allowedExt.has(ext) || !allowedMime.has(file.type)) {
        if (status) status.textContent = 'Please upload a PDF, DOC or DOCX resume only.';
        fileInput.focus();
        return;
      }
      if (file.size > maxBytes) {
        if (status) status.textContent = 'Your resume must be 8 MB or smaller.';
        fileInput.focus();
        return;
      }
      if (!(await validSignature(file, ext))) {
        if (status) status.textContent = 'The resume file does not appear to match its file type. Please upload a valid PDF, DOC or DOCX file.';
        fileInput.focus();
        return;
      }
    }
    submit.disabled = true;
    submit.textContent = 'Submitting…';
    try {
      const data = new FormData(form);
      const response = await fetch('/', { method: 'POST', body: data });
      if (!response.ok) throw new Error('Submission failed');
      form.reset();
      if (status) status.textContent = 'Thank you. Your application has been submitted to the Cartage Australia careers team.';
    } catch (error) {
      if (status) status.textContent = 'We could not submit your application. Please try again or email careers@cartageaustralia.com.';
    } finally {
      submit.disabled = false;
      submit.textContent = 'Submit Careers Enquiry';
    }
  });
})();
