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
  /* Show sections as they enter the screen. Keep layout intact (transform/opacity only). */
  $$('.gallery-photo, .love-moment').forEach((el,i) => {
    el.classList.add('emerge');
    el.style.setProperty('--reveal-delay', `${Math.min(i % 6, 5) * 60}ms`);
  });
  if (reduceMotion || !('IntersectionObserver' in window)) {
    $$('.emerge').forEach(el => el.classList.add('shown'));
  } else {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('shown');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {threshold: .08, rootMargin:'0px 0px -30px 0px'});
    $$('.emerge').forEach(el => revealObserver.observe(el));
  }

  /* Format the digits only; preserve every Vietnamese word and existing text font. */
  const numericSelector = '.wedding-card [data-field="date"],.wedding-card [data-field="time"],.schedule-top [data-date]';
  function styleNumbers(element) {
    if (!element) return;
    const original=element.textContent;
    if (!/[0-9]/.test(original)) return;
    const fragment=document.createDocumentFragment();
    const matches=original.matchAll(/\d+(?:[.\/:–-]\d+)*/g);
    let pos=0;
    for (const m of matches) {
      if (m.index>pos) fragment.append(document.createTextNode(original.slice(pos,m.index)));
      const digits=document.createElement('span');
      digits.className='beautiful-number';digits.textContent=m[0];fragment.append(digits);
      pos=m.index+m[0].length;
    }
    fragment.append(document.createTextNode(original.slice(pos)));
    element.replaceChildren(fragment);
  }
  const styleNumericDates=()=> $$(numericSelector).forEach(styleNumbers);
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

  styleNumericDates();

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

  styleNumericDates(); // schedule dates have now been populated

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
    // Logo ngân hàng tùy chọn: biểu tượng PNG/SVG vuông ~128×128px, nền trong.
    // Nếu để trống bankLogo, sử dụng họa tiết ngân hàng mặc định trong CSS.
    if(data.bankLogo){
      const mark=$('.bank-mark',card);
      const logo=document.createElement('img');
      logo.src=data.bankLogo;logo.alt='';logo.className='bank-logo';
      mark?.replaceChildren(logo);
      mark?.classList.add('has-bank-logo');
    }
    const account=$('[data-account]',card);
    setText(account,data.account||'Chưa cập nhật STK');
    styleNumbers(account);
    if(!data.account)account?.setAttribute('data-missing','');
    else account?.removeAttribute('data-missing');
    if(data.qrImage)$('.gift-qr',card).src=data.qrImage;
    account?.addEventListener('click',async()=>{
      if(!data.account){notify('Thông tin ngân hàng chưa được cập nhật');return;}
      try{await navigator.clipboard.writeText(data.account);notify('Đã sao chép số tài khoản ♡')}catch{notify('Bạn có thể chọn và sao chép số tài khoản')}
    });
  });

  /* Cảnh báo chỉ hiển thị khi QR/tài khoản đang là dữ liệu mẫu. */
  const exampleQr=/qr-nha-(?:gai|trai)\.svg/i;
  const configuredBoth=['bride','groom'].every(side=>{
    const info=C.gifts?.[side];
    return info?.bank && info?.owner && info?.account && info?.qrImage && !exampleQr.test(info.qrImage);
  });
  if(configuredBoth)$('#gift-demo-note')?.remove();

  /* Locations. Only enable "Chỉ đường" when actual Google Maps URL has been configured. */
  $$('[data-location]').forEach(card=>{
    const data=C.locations?.[card.dataset.location]||{};
    setText($('[data-address]',card),data.address||'Địa chỉ sẽ được cập nhật');
    const a=$('[data-map-link]',card);
    if(data.mapUrl && /^https:\/\//.test(data.mapUrl)){a.href=data.mapUrl;}
    else {a.removeAttribute('target');a.removeAttribute('href');a.classList.add('disabled');a.setAttribute('aria-disabled','true');a.addEventListener('click',e=>{e.preventDefault();notify('Địa chỉ Google Maps sẽ được cập nhật sau')})}
  });

  /* ========================================================
     Full-viewport gallery. Reuse one image node; preload neighbours.
     Supports buttons, arrow keys, swipe/touch and mouse drag.
     ======================================================== */
  const viewer=$('#photo-viewer'), viewerImage=$('#viewer-image');
  const viewerStage=$('#viewer-stage'), viewerCounter=$('#viewer-counter');
  const viewerCaption=$('#viewer-caption'), galleryButtons=$$('.gallery-photo');
  const photos=galleryButtons.map(b=>$('img',b));
  let photoIndex=0, photoToken=0, lastPhotoTrigger=null;
  const loadedPhotos=new Map();
  const normalizedPhotoIndex=i=>(i+photos.length)%photos.length;
  function preloadPhoto(index){
    if(!photos.length)return Promise.resolve(null);
    const i=normalizedPhotoIndex(index);
    if(loadedPhotos.has(i))return loadedPhotos.get(i);
    const target=photos[i];
    const img=new Image();img.decoding='async';img.src=target.currentSrc||target.src;
    const promise=img.decode?.().catch(()=>null).then(()=>img)||new Promise(resolve=>{
      img.onload=()=>resolve(img);img.onerror=()=>resolve(null);
    });
    loadedPhotos.set(i,promise);
    return promise;
  }
  function showPhoto(index,direction=0){
    if(!viewer || !viewerImage || !photos.length)return;
    photoIndex=normalizedPhotoIndex(index);
    const target=photos[photoIndex], token=++photoToken;
    setText(viewerCounter,`${photoIndex+1} / ${photos.length}`);
    setText(viewerCaption,target.alt || 'Ảnh cưới');
    viewerImage.classList.add('is-loading');
    preloadPhoto(photoIndex).then(()=>{
      if(token!==photoToken || !viewer.open)return;
      viewerImage.src=target.currentSrc||target.src;
      viewerImage.alt=target.alt||'Ảnh cưới';
      viewerImage.classList.remove('is-loading');
      // A short compositor-only slide communicates next/previous navigation.
      if (direction && !reduceMotion && typeof viewerImage.animate==='function') {
        viewerImage.getAnimations().forEach(anim=>anim.cancel());
        viewerImage.animate([
          {opacity:.65,transform:`translate3d(${direction>0?'24px':'-24px'},0,0)`},
          {opacity:1,transform:'translate3d(0,0,0)'}
        ],{duration:240,easing:'cubic-bezier(.2,.78,.2,1)'});
      }
    });
    // Loading the two nearest slides ahead avoids sudden blank frames.
    preloadPhoto(photoIndex+1);preloadPhoto(photoIndex-1);
  }
  function openPhoto(index,trigger){
    if(!viewer || !photos.length)return;
    lastPhotoTrigger=trigger||document.activeElement;
    if(!viewer.open)viewer.showModal();
    document.body.classList.add('dialog-open');
    showPhoto(index);
    $('#close-photo')?.focus({preventScroll:true});
  }
  function stepPhoto(direction){if(viewer?.open)showPhoto(photoIndex+direction,direction)}
  galleryButtons.forEach((button,i)=>button.addEventListener('click',()=>openPhoto(i,button)));
  $('#gallery-more')?.addEventListener('click',e=>openPhoto(0,e.currentTarget));
  $('#viewer-prev')?.addEventListener('click',()=>stepPhoto(-1));
  $('#viewer-next')?.addEventListener('click',()=>stepPhoto(1));
  $('#close-photo')?.addEventListener('click',()=>viewer?.close());
  viewer?.addEventListener('close',()=>{
    ++photoToken;document.body.classList.remove('dialog-open');
    lastPhotoTrigger?.focus?.({preventScroll:true});
  });
  viewer?.addEventListener('click',e=>{if(e.target===viewer)viewer.close()});
  let swipeStart=null;
  const swipeBegin=(x,y)=>{swipeStart={x,y};};
  const swipeEnd=(x,y)=>{
    if(!swipeStart)return;
    const dx=x-swipeStart.x,dy=y-swipeStart.y;swipeStart=null;
    if(Math.abs(dx)>45 && Math.abs(dx)>Math.abs(dy)*1.15)stepPhoto(dx<0?1:-1);
  };
  viewerStage?.addEventListener('touchstart',e=>{
    const t=e.changedTouches[0];swipeBegin(t.clientX,t.clientY);
  },{passive:true});
  viewerStage?.addEventListener('touchend',e=>{
    const t=e.changedTouches[0];swipeEnd(t.clientX,t.clientY);
  },{passive:true});
  viewerStage?.addEventListener('pointerdown',e=>{
    if(e.pointerType==='mouse'&&e.button===0)swipeBegin(e.clientX,e.clientY);
  });
  viewerStage?.addEventListener('pointerup',e=>{
    if(e.pointerType==='mouse')swipeEnd(e.clientX,e.clientY);
  });

  /* ========================================================
     Film: MP4 auto enters native fullscreen on the Play gesture
     where permitted. Mobile Safari may use webkitEnterFullscreen;
     otherwise cinema dialog is fullscreen. YouTube supports iframe
     fullscreen if the provider/browser allows it.
     ======================================================== */
  const filmDialog=$('#film-viewer'), filmHolder=$('#film-holder'),filmPoster=$('#film-poster');
  if(C.video?.poster && filmPoster) filmPoster.src=C.video.poster;
  let lastFilmTrigger=null;
  const requestFilmFullscreen=element=>{
    try {
      if(typeof element.requestFullscreen==='function'){
        const result=element.requestFullscreen({navigationUI:'hide'});
        if(result?.catch)result.catch(()=>{});
      } else if(typeof element.webkitEnterFullscreen==='function'){
        element.webkitEnterFullscreen();
      }
    }catch{/* Browser declined; dialog remains fullscreen and playable. */}
  };
  $('#play-film')?.addEventListener('click',e=>{
    if(!filmDialog || !filmHolder)return;
    lastFilmTrigger=e.currentTarget;
    filmHolder.replaceChildren();
    if(C.video?.youtubeEmbedUrl){
      const iframe=document.createElement('iframe');
      iframe.src=C.video.youtubeEmbedUrl+(C.video.youtubeEmbedUrl.includes('?')?'&':'?')+'autoplay=1&playsinline=1';
      iframe.allow='autoplay; fullscreen; encrypted-media; picture-in-picture';
      iframe.setAttribute('allowfullscreen','');iframe.title='Thước phim tình yêu';
      filmHolder.append(iframe);
      filmDialog.showModal();document.body.classList.add('dialog-open');
      // The frame can occupy the screen; inner YouTube fullscreen is also available.
      requestFilmFullscreen(filmDialog);
    }else if(C.video?.src){
      const video=document.createElement('video');
      video.src=C.video.src;video.poster=C.video.poster||'';
      video.controls=true;video.playsInline=true;video.preload='metadata';
      video.setAttribute('controlsList','nodownload');
      filmHolder.append(video);
      filmDialog.showModal();document.body.classList.add('dialog-open');
      // Requesting fullscreen must happen inside the user click handler.
      requestFilmFullscreen(video);
      const playPromise=video.play();if(playPromise?.catch)playPromise.catch(()=>{});
    }else{
      const message=document.createElement('div');message.className='film-empty';
      message.textContent='Thước phim tình yêu sẽ được bật mí tại đây ♡';
      filmHolder.append(message);
      filmDialog.showModal();document.body.classList.add('dialog-open');
    }
  });
  const closeFilm=()=>filmDialog?.close();
  $('#close-film')?.addEventListener('click',closeFilm);
  filmDialog?.addEventListener('click',e=>{if(e.target===filmDialog)closeFilm()});
  filmDialog?.addEventListener('close',()=>{
    const video=$('video',filmHolder);if(video)video.pause();
    if(document.fullscreenElement && (document.fullscreenElement===filmDialog || filmDialog.contains(document.fullscreenElement))) {
      document.exitFullscreen?.().catch?.(()=>{});
    }
    filmHolder.replaceChildren();document.body.classList.remove('dialog-open');
    lastFilmTrigger?.focus?.({preventScroll:true});
  });
  window.addEventListener('keydown',e=>{
    if(viewer?.open){
      if(e.key==='ArrowRight'){e.preventDefault();stepPhoto(1)}
      if(e.key==='ArrowLeft'){e.preventDefault();stepPhoto(-1)}
    }
  });

})();
