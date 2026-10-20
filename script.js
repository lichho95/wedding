/* Wedding V3 — HTML / CSS / vanilla JS — no build tools or servers required. */
(() => {
  'use strict';
  const C = window.WEDDING_CONFIG || {};
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const setText = (el, value) => { if (el) el.textContent = value; };
  const names = `${C.groomName || 'Minh'} & ${C.brideName || 'Lan'}`;
  $$('[data-couple]').forEach(el => setText(el, names));
  $$('[data-date-display]').forEach(el => setText(el, C.dateDisplay || '15 . 11 . 2027'));
  if (C.weddingTitle) document.title = C.weddingTitle;

  /* Header, menu and gentle reveal. */
  const menuButton = $('#menu-btn');
  const menu = $('#menu');
  menuButton?.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
  });
  $$('.menu a').forEach(a => a.addEventListener('click', () => {
    menu?.classList.remove('open'); menuButton?.setAttribute('aria-expanded','false');
  }));
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('shown'); revealObserver.unobserve(entry.target); } });
    }, {threshold: .07, rootMargin:'80px 0px'});
    $$('.emerge').forEach(el => revealObserver.observe(el));
  } else $$('.emerge').forEach(el => el.classList.add('shown'));
  const progress = $('#scroll-meter');
  let scrollTick = false;
  window.addEventListener('scroll', () => {
    if (scrollTick) return;
    scrollTick=true;
    requestAnimationFrame(() => {
      scrollTick=false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progress) progress.style.width = (max>0 ? window.scrollY/max*100 : 0) + '%';
    });
  }, {passive:true});

  /* Falling hearts/petals: few elements, no layout thrashing. */
  if (C.fallingHearts !== false && !reduceMotion) {
    const layer = $('#heart-rain');
    const marks = ['♥','♡','❀','♥','❀'];
    let live = 0;
    const spawn = () => {
      if (!layer || live > 14 || document.hidden) return;
      const el = document.createElement('span');
      el.className = 'float-heart' + (Math.random()<.4 ? ' petal' : '');
      el.textContent = marks[Math.floor(Math.random()*marks.length)];
      el.style.left = `${Math.random()*100}%`;
      el.style.fontSize = `${10+Math.random()*13}px`;
      const duration = 10 + Math.random()*10;
      el.style.animationDuration = `${duration}s`;
      layer.append(el); live++;
      el.addEventListener('animationend', () => { el.remove(); live--; }, {once:true});
    };
    for (let i=0;i<6;i++) setTimeout(spawn,i*500);
    setInterval(spawn,1700);
  }

  /* Hero slider fade/Ken-Burns, dots and arrows. */
  const slides = $$('.hero-slide');
  const dots = $$('#hero-dots button');
  let slideAt=0, timer=null;
  const showSlide = index => {
    if (!slides.length) return;
    slideAt=(index+slides.length)%slides.length;
    slides.forEach((slide,i) => {
      slide.classList.toggle('active',i===slideAt);
      slide.setAttribute('aria-hidden',String(i!==slideAt));
    });
    dots.forEach((dot,i)=>{dot.classList.toggle('on',i===slideAt);dot.setAttribute('aria-current',String(i===slideAt));});
  };
  const restartSlides = () => {
    if(timer) clearInterval(timer);
    const ms=Number(C.sliderInterval ?? 6000);
    if (ms>0 && !reduceMotion) timer=setInterval(()=>showSlide(slideAt+1),ms);
  };
  $('#hero-prev')?.addEventListener('click',()=>{showSlide(slideAt-1);restartSlides()});
  $('#hero-next')?.addEventListener('click',()=>{showSlide(slideAt+1);restartSlides()});
  dots.forEach((dot,i)=>dot.addEventListener('click',()=>{showSlide(i);restartSlides()}));
  let touchX=0;
  $('#hero-slides')?.addEventListener('touchstart', e=>{touchX=e.changedTouches[0].screenX},{passive:true});
  $('#hero-slides')?.addEventListener('touchend', e=>{const delta=e.changedTouches[0].screenX-touchX;if(Math.abs(delta)>45){showSlide(slideAt+(delta<0?1:-1));restartSlides()}},{passive:true});
  restartSlides();

  /* Countdown using explicit ISO date with timezone. */
  const destination = new Date(C.weddingDate || '2027-11-15T08:00:00+07:00');
  const pad = n => String(n).padStart(2,'0');
  const updateCountdown = () => {
    let remaining= Math.max(0, destination.getTime()-Date.now());
    const seconds=Math.floor(remaining/1000);
    setText($('#days'),String(Math.floor(seconds/86400)));
    setText($('#hours'),pad(Math.floor(seconds/3600)%24));
    setText($('#minutes'),pad(Math.floor(seconds/60)%60));
    setText($('#seconds'),pad(seconds%60));
    if (remaining === 0) setText($('#count-caption'), 'Ngày hạnh phúc của chúng mình đã đến rồi ♡');
  };
  updateCountdown();setInterval(updateCountdown,1000);

  /* Four event info cards data-bound from config. */
  $$('[data-event]').forEach(card => {
    const ev = C.events?.[card.dataset.event] || {};
    ['date','time','address'].forEach(k=>setText($(`[data-field="${k}"]`,card), ev[k] || 'Đang cập nhật'));
  });

  /* Dynamic SVG journey drawn through the photo centers, including mobile vertical layout. */
  const track=$('#love-track'), svg=$('#love-svg'), base=$('#love-path'), fill=$('#love-fill'), heart=$('#travel-heart');
  const moments=$$('.love-moment');
  let pathLength=0, raf=0, animationStarted=false, pathNodes=[], resizeTimer=null;
  const generateJourney = () => {
    if (!track || !base || !fill || !moments.length) return;
    const bounds=track.getBoundingClientRect();
    pathNodes=moments.map(m => {
      const r=$('.love-photo',m).getBoundingClientRect();
      return {x:r.left+r.width/2-bounds.left,y:r.top+r.height/2-bounds.top};
    });
    const mobile=window.matchMedia('(max-width: 580px)').matches;
    let d=`M ${pathNodes[0].x.toFixed(1)} ${pathNodes[0].y.toFixed(1)}`;
    for(let i=0;i<pathNodes.length-1;i++){
      const a=pathNodes[i], b=pathNodes[i+1];
      if (mobile) {
        const dy=b.y-a.y;
        d+=` C ${a.x} ${a.y+dy*.45}, ${b.x} ${b.y-dy*.45}, ${b.x} ${b.y}`;
      } else {
        const dx=b.x-a.x;
        d+=` C ${a.x+dx*.44} ${a.y-23}, ${b.x-dx*.44} ${b.y+23}, ${b.x} ${b.y}`;
      }
    }
    svg.setAttribute('viewBox',`0 0 ${bounds.width} ${bounds.height}`);
    svg.setAttribute('preserveAspectRatio','none');
    base.setAttribute('d',d);fill.setAttribute('d',d);
    pathLength=base.getTotalLength();
    fill.style.strokeDasharray=String(pathLength);
    fill.style.strokeDashoffset=String(pathLength);
    if (heart) { heart.style.left=pathNodes[0].x+'px';heart.style.top=pathNodes[0].y+'px'; }
    moments.forEach(m=>m.classList.remove('is-lit'));
  };
  const renderJourney = progress => {
    if (!pathLength) return;
    const pos= Math.max(0,Math.min(1,progress));
    fill.style.strokeDashoffset=String(pathLength*(1-pos));
    const point=base.getPointAtLength(pathLength*pos);
    if (heart) {heart.style.opacity='1';heart.style.left=point.x+'px';heart.style.top=point.y+'px'}
    moments.forEach((m,i)=>m.classList.toggle('is-lit', pos >= i/(moments.length-1)-.045));
  };
  const startJourney = () => {
    if (!pathLength) generateJourney();
    if (!pathLength) return;
    cancelAnimationFrame(raf);
    const ms=reduceMotion?1:Math.max(1800,Number(C.loveStoryDuration||7500));
    const start=performance.now();
    const tick=now=>{
      const elapsed=Math.min(1,(now-start)/ms);
      const smooth=elapsed*elapsed*(3-2*elapsed);
      renderJourney(smooth);
      if(elapsed<1) raf=requestAnimationFrame(tick);
    };
    raf=requestAnimationFrame(tick);
  };
  if(track){
    const prime=()=>{generateJourney(); if(reduceMotion)renderJourney(1)};
    if(document.readyState==='complete') prime(); else window.addEventListener('load',prime,{once:true});
    window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{generateJourney();if(animationStarted)renderJourney(1)},160)},{passive:true});
    $('#replay-love')?.addEventListener('click',()=>{animationStarted=true;startJourney()});
    if('IntersectionObserver' in window){
      const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)&&!animationStarted){animationStarted=true;startJourney();observer.disconnect()}},{threshold:.27});
      observer.observe(track);
    }else{animationStarted=true;startJourney()}
  }
  if(C.dateDisplay) setText($('#story-wedding-date'), C.dateDisplay.replaceAll(' ','').replaceAll('.','.'));

  /* Schedules on separate days. */
  $$('[data-schedule]').forEach(card=>{
    const data=C.schedules?.[card.dataset.schedule]||{};
    setText($('[data-date]',card),data.date||'Ngày đang cập nhật');
    const list=$('.schedule-steps',card);
    (data.items||[]).forEach(item=>{
      const li=document.createElement('li');
      const badge=document.createElement('span'); badge.className='event-icon';badge.textContent=item.icon||'♡';
      const time=document.createElement('strong');time.textContent=item.time||'';
      const title=document.createElement('span');title.textContent=item.title||'';
      const detail=document.createElement('small');detail.textContent=item.detail||'';
      li.append(badge,time,title,detail);list.append(li);
    });
  });

  /* Bank gifts: QR must be replaced. Never fabricate transfers. */
  const notice=$('#notice');let noticeTimer=0;
  const notify=message=>{
    if(!notice)return;setText(notice,message);notice.classList.add('visible');
    clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>notice.classList.remove('visible'),3000);
  };
  $$('[data-gift]').forEach(card=>{
    const data=C.gifts?.[card.dataset.gift]||{};
    setText($('[data-bank]',card),data.bank||'QR minh họa');
    setText($('[data-owner]',card),data.owner|| (card.dataset.gift==='bride'?'Nhà gái':'Nhà trai'));
    const account=$('[data-account]',card);
    setText(account,data.account||'Chưa cập nhật');
    if(data.qrImage)$('.gift-qr',card).src=data.qrImage;
    account?.addEventListener('click',async()=>{
      if(!data.account){notify('Thông tin ngân hàng chưa được cập nhật');return;}
      try{await navigator.clipboard.writeText(data.account);notify('Đã sao chép số tài khoản ♡')}catch{notify('Bạn có thể chọn và sao chép số tài khoản')}
    });
  });

  /* Locations. Only enable "Chỉ đường" when actual Google Maps URL has been configured. */
  $$('[data-location]').forEach(card=>{
    const data=C.locations?.[card.dataset.location]||{};
    setText($('[data-address]',card),data.address||'Địa chỉ sẽ được cập nhật');
    const a=$('[data-map-link]',card);
    if(data.mapUrl && /^https:\/\//.test(data.mapUrl)){a.href=data.mapUrl;}
    else {a.removeAttribute('target');a.removeAttribute('href');a.classList.add('disabled');a.setAttribute('aria-disabled','true');a.addEventListener('click',e=>{e.preventDefault();notify('Địa chỉ Google Maps sẽ được cập nhật sau')})}
  });

  /* Gallery lightbox. */
  const viewer=$('#photo-viewer'), viewerImage=$('#viewer-image');
  const photos=$$('.gallery-photo img');let photoIndex=0;
  function openPhoto(i){
    if(!viewer)return;photoIndex=(i+photos.length)%photos.length;
    viewerImage.src=photos[photoIndex].src;
    viewerImage.alt=photos[photoIndex].alt;
    if(!viewer.open)viewer.showModal();document.body.classList.add('dialog-open');
  }
  function stepPhoto(dir){openPhoto(photoIndex+dir)}
  $$('.gallery-photo').forEach((button,i)=>button.addEventListener('click',()=>openPhoto(i)));
  $('#gallery-more')?.addEventListener('click',()=>openPhoto(0));
  $('#viewer-prev')?.addEventListener('click',()=>stepPhoto(-1));
  $('#viewer-next')?.addEventListener('click',()=>stepPhoto(1));
  $('#close-photo')?.addEventListener('click',()=>viewer?.close());
  viewer?.addEventListener('close',()=>document.body.classList.remove('dialog-open'));
  viewer?.addEventListener('click',e=>{if(e.target===viewer)viewer.close()});

  /* Wedding film: MP4 or YouTube; do not autoplay without user click. */
  const filmDialog=$('#film-viewer'), filmHolder=$('#film-holder'), filmPoster=$('#film-poster');
  if(C.video?.poster) filmPoster.src=C.video.poster;
  $('#play-film')?.addEventListener('click',()=>{
    if(!filmDialog || !filmHolder)return;
    filmHolder.replaceChildren();
    if(C.video?.youtubeEmbedUrl){
      const iframe=document.createElement('iframe');iframe.src=C.video.youtubeEmbedUrl+(C.video.youtubeEmbedUrl.includes('?')?'&':'?')+'autoplay=1';iframe.allow='autoplay; encrypted-media; picture-in-picture';iframe.allowFullscreen=true;iframe.title='Thước phim tình yêu';filmHolder.append(iframe);
    }else if(C.video?.src){
      const video=document.createElement('video');video.src=C.video.src;video.poster=C.video.poster||'';video.controls=true;video.autoplay=true;video.playsInline=true;filmHolder.append(video);
    } else {
      const message=document.createElement('div');message.className='film-empty';message.textContent='Thước phim tình yêu sẽ được bật mí tại đây ♡';filmHolder.append(message);
    }
    filmDialog.showModal();document.body.classList.add('dialog-open');
  });
  $('#close-film')?.addEventListener('click',()=>filmDialog?.close());
  filmDialog?.addEventListener('click',e=>{if(e.target===filmDialog)filmDialog.close()});
  filmDialog?.addEventListener('close',()=>{filmHolder.replaceChildren();document.body.classList.remove('dialog-open')});
  window.addEventListener('keydown',e=>{if(viewer?.open){if(e.key==='ArrowRight')stepPhoto(1);if(e.key==='ArrowLeft')stepPhoto(-1)}});
})();
