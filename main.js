  let currentLang = 'en';

  const preBar = document.getElementById('preBar');
  const preloader = document.getElementById('preloader');
  let pct = 0;
  const loadTimer = setInterval(()=>{
    pct += Math.floor(Math.random()*10)+5;
    if(pct>=100){ pct=100; clearInterval(loadTimer);
      setTimeout(()=>{
        preloader.classList.add('is-done');
        document.getElementById('heroName').classList.add('is-in');
        setTimeout(()=>{
          const hr = document.getElementById('heroRole');
          typewriteInto(hr, currentLang==='fa' ? hr.getAttribute('data-fa') : hr.getAttribute('data-en'), 26);
        }, 300);
        setTimeout(revealCodeLines, 500);
      }, 300);
    }
    const filled = Math.round(pct/10);
    preBar.textContent = '['+'#'.repeat(filled)+'-'.repeat(10-filled)+'] '+pct+'%';
  }, 100);

  function revealCodeLines(){
    document.querySelectorAll('#codeBody .code-line').forEach((l,i)=>{
      setTimeout(()=> l.classList.add('is-in'), i*140);
    });
  }

  function typewriteInto(el, text, speed){
    clearInterval(el._typeTimer);
    el.textContent = '';
    el.classList.remove('is-typed');
    let i = 0;
    el._typeTimer = setInterval(()=>{
      el.textContent = (text||'').slice(0, i+1);
      i++;
      if(i >= (text||'').length){ clearInterval(el._typeTimer); el.classList.add('is-typed'); }
    }, speed || 22);
  }

  const ctaCommand = document.getElementById('ctaCommand');
  let ctaTyped = false;
  const ioCta = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting && !ctaTyped){
        ctaTyped = true;
        typewriteInto(ctaCommand, 'send-message --to=farzad', 30);
      }
    });
  }, { threshold:.6 });
  ioCta.observe(ctaCommand);

  function easeInOutCubic(t){ return t<0.5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2; }
  function smoothScrollTo(target){
    const headerOffset = 76;
    const startY = window.pageYOffset;
    const targetY = target.getBoundingClientRect().top + startY - headerOffset;
    const distance = targetY - startY;
    const duration = Math.min(1200, Math.max(500, Math.abs(distance)*0.6));
    let startTime = null;
    function step(ts){
      if(!startTime) startTime = ts;
      const elapsed = ts - startTime;
      const progress = Math.min(elapsed/duration, 1);
      window.scrollTo(0, startY + distance*easeInOutCubic(progress));
      if(progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  document.querySelectorAll('a[href^="#"]').forEach(link=>{
    link.addEventListener('click', (e)=>{
      const id = link.getAttribute('href');
      const target = document.querySelector(id);
      if(target){ e.preventDefault(); smoothScrollTo(target); }
    });
  });

  const dotEl = document.getElementById('cursorDot');
  const cursorWrap = document.getElementById('cursorWrap');
  const cursorLabel = document.getElementById('cursorLabel');
  let mx=0,my=0,rx=0,ry=0;
  window.addEventListener('mousemove', e=>{ mx=e.clientX; my=e.clientY; dotEl.style.left=mx+'px'; dotEl.style.top=my+'px'; });
  function loop(){ rx+=(mx-rx)*0.18; ry+=(my-ry)*0.18; cursorWrap.style.left=rx+'px'; cursorWrap.style.top=ry+'px'; requestAnimationFrame(loop); }
  loop();
  document.querySelectorAll('[data-hover]').forEach(el=>{
    el.addEventListener('mouseenter', ()=>{
      cursorWrap.classList.add('is-hover');
      if(el.classList.contains('repo-row')){
        cursorLabel.textContent = currentLang==='fa' ? 'باز کردن' : 'OPEN';
      } else { cursorLabel.textContent = ''; }
    });
    el.addEventListener('mouseleave', ()=>{ cursorWrap.classList.remove('is-hover'); cursorLabel.textContent=''; });
  });

  const progress = document.getElementById('progress');
  window.addEventListener('scroll', ()=>{
    const h = document.documentElement;
    progress.style.width = ((h.scrollTop)/(h.scrollHeight-h.clientHeight)*100)+'%';
  });

  function animateCount(el){
    const target = parseInt(el.getAttribute('data-count'));
    const dur = 1300; const start = performance.now();
    function step(t){
      const p = Math.min((t-start)/dur,1);
      el.textContent = Math.floor(p*target);
      if(p<1) requestAnimationFrame(step); else el.textContent = target;
    }
    requestAnimationFrame(step);
  }
  const ioCount = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ animateCount(e.target); ioCount.unobserve(e.target); } });
  }, { threshold:.5 });
  document.querySelectorAll('[data-count]').forEach(c=>ioCount.observe(c));

  const ioSkill = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        const target = parseInt(e.target.getAttribute('data-target'));
        const segs = e.target.querySelectorAll('.skill-seg');
        segs.forEach((s,i)=> setTimeout(()=>{ if(i<target) s.classList.add('is-lit'); }, i*60));
        ioSkill.unobserve(e.target);
      }
    });
  }, { threshold:.4 });
  document.querySelectorAll('.skill-segs').forEach(s=>ioSkill.observe(s));

  const tlTabs = document.querySelectorAll('.tl-tab');
  const secIds = ['#projects','#skills','#about','#contact'];
  const secElsNav = secIds.map(s=>document.querySelector(s)).filter(Boolean);
  const ioNav = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        const idx = secElsNav.indexOf(e.target);
        tlTabs.forEach(t=>t.classList.remove('is-active'));
        if(tlTabs[idx]) tlTabs[idx].classList.add('is-active');
      }
    });
  }, { threshold:.4 });
  secElsNav.forEach(s=>ioNav.observe(s));

  const tabs = document.querySelectorAll('.tab');
  const items = document.querySelectorAll('.repo-item');
  tabs.forEach(tab=>{
    tab.addEventListener('click', ()=>{
      tabs.forEach(t=>t.classList.remove('is-active'));
      tab.classList.add('is-active');
      const f = tab.getAttribute('data-filter');
      items.forEach(it=>{
        const match = f==='all' || it.getAttribute('data-cat')===f;
        it.classList.toggle('is-hidden', !match);
      });
    });
  });

  const repoPanel = document.getElementById('repoPanel');
  const repoOverlay = document.getElementById('repoOverlay');
  const rpImg = document.getElementById('repoPanelImg');
  const rpCat = document.getElementById('repoPanelCat');
  const rpTitle = document.getElementById('repoPanelTitle');
  const rpStack = document.getElementById('repoPanelStack');
  const rpDesc = document.getElementById('repoPanelDesc');
  const rpPath = document.getElementById('repoPanelPath');
  const rpLink = document.getElementById('repoPanelLink');

  function openRepo(row){
    const name = row.querySelector('.repo-name').textContent;
    const cat = currentLang==='fa' ? row.getAttribute('data-cat-label-fa') : row.getAttribute('data-cat-label-en');
    const desc = currentLang==='fa' ? row.getAttribute('data-desc-fa') : row.getAttribute('data-desc-en');
    const stack = (row.getAttribute('data-stack')||'').split(',').map(s=>s.trim()).filter(Boolean);
    rpImg.src = row.getAttribute('data-img');
    rpCat.textContent = cat;
    rpTitle.textContent = name;
    rpPath.textContent = '~/projects/'+name;
    rpStack.innerHTML = stack.map(s=>`<span class="tag-pill">${s}</span>`).join('');
    const link = row.getAttribute('data-link');
      if(link){
       rpLink.href = link;
       rpLink.classList.remove('is-hidden');
}     else {
       rpLink.classList.add('is-hidden');
}
    repoPanel.classList.add('is-open');
    repoOverlay.classList.add('is-open');
    typewriteInto(rpDesc, desc || '', 18);
  }
  function closeRepo(){
    repoPanel.classList.remove('is-open');
    repoOverlay.classList.remove('is-open');
    clearInterval(rpDesc._typeTimer);
  }
  document.querySelectorAll('.repo-row').forEach(row=> row.addEventListener('click', ()=> openRepo(row)));
  document.getElementById('repoPanelClose').addEventListener('click', closeRepo);
  repoOverlay.addEventListener('click', closeRepo);
  document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeRepo(); });

  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  menuToggle.addEventListener('click', ()=> mobileNav.classList.toggle('is-open'));
  document.querySelectorAll('.mobile-nav-link').forEach(l=> l.addEventListener('click', ()=> mobileNav.classList.remove('is-open')));

  function tick(){
    const d = new Date();
    const s = d.toLocaleTimeString('en-GB', {timeZone:'Asia/Tehran'});
    document.getElementById('clock').textContent = 'Shahre-Kord '+s;
  }
  tick(); setInterval(tick, 1000);

  const langBtns = document.querySelectorAll('.lang-btn');
  function setLang(lang){
    currentLang = lang;
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', lang==='fa' ? 'rtl' : 'ltr');
    document.body.classList.toggle('fa', lang==='fa');
    document.querySelectorAll('[data-en]').forEach(el=>{
      if(el.id==='heroRole') return;
      const val = lang==='fa' ? el.getAttribute('data-fa') : el.getAttribute('data-en');
      if(val!==null) el.textContent = val;
    });
    const heroRole = document.getElementById('heroRole');
    if(heroRole.textContent){
      typewriteInto(heroRole, lang==='fa' ? heroRole.getAttribute('data-fa') : heroRole.getAttribute('data-en'), 26);
    }
    const stackPara = document.getElementById('stackPara');
if(stackPara){
  stackPara.innerHTML = lang === 'fa'
    ? 'استک اصلیم از <span class="inline-code">C#</span> و <span class="inline-code">ASP.NET Core</span> توی بک‌اند تشکیل شده، به همراه <span class="inline-code">EF Core</span> و <span class="inline-code">SQL Server</span>، در کنار <span class="inline-code">HTML</span>، <span class="inline-code">Tailwind</span> و <span class="inline-code">JavaScript</span> توی فرانت‌اند.'
    : 'My core stack consists of <span class="inline-code">C#</span> and <span class="inline-code">ASP.NET Core</span> on the back-end, together with <span class="inline-code">EF Core</span> and <span class="inline-code">SQL Server</span>, complemented by <span class="inline-code">HTML</span>, <span class="inline-code">Tailwind</span>, and <span class="inline-code">JavaScript</span> on the front-end.';
}
    langBtns.forEach(b=> b.classList.toggle('is-active', b.getAttribute('data-lang')===lang));
  }
  langBtns.forEach(b=> b.addEventListener('click', ()=> setLang(b.getAttribute('data-lang'))));

  // GitHub contribution grid (decorative)
const ghGrid = document.getElementById('ghGrid');
if(ghGrid){
  const weeks = 26, days = 7;
  for(let i=0;i<weeks*days;i++){
    const cell = document.createElement('div');
    cell.className = 'gh-cell';
    const level = Math.random();
    const color = level < 0.35 ? 'rgba(201,211,222,.10)'
      : level < 0.6 ? 'rgba(95,211,196,.30)'
      : level < 0.82 ? 'rgba(95,211,196,.55)'
      : 'rgba(95,211,196,.9)';
    cell.style.setProperty('--gh-color', color);
    ghGrid.appendChild(cell);
  }
}
