// ==================== EVENT LISTENERS ====================

document.addEventListener('DOMContentLoaded', () => {
  // Update year in footer
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
  
  // Navbar scroll effect
  window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (navbar) {
      if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  });
  
  // Trip slideshows
  document.querySelectorAll('.trip-slideshow').forEach(show => {
    const slides = Array.from(show.querySelectorAll('.slide'));
    const interval = +show.dataset.interval || 4000;
    let index = 0;
    
    setInterval(() => {
      slides[index].classList.remove('active');
      index = (index + 1) % slides.length;
      slides[index].classList.add('active');
    }, interval);
  });
  
  // Project galleries
  document.querySelectorAll('.project-gallery').forEach(gallery => {
    const slides = Array.from(gallery.querySelectorAll('.proj-slide'));
    let idx = 0;
    
    function go(n) {
      slides[idx].classList.remove('active');
      idx = (n + slides.length) % slides.length;
      slides[idx].classList.add('active');
    }
    
    const prevBtn = gallery.querySelector('.proj-prev');
    const nextBtn = gallery.querySelector('.proj-next');
    
    if (prevBtn) prevBtn.addEventListener('click', () => go(idx - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => go(idx + 1));
  });
  // ==================== DETAIL MODAL ====================
  const modal = document.getElementById('detailModal');
  const modalImg = modal.querySelector('.modal-image');
  const modalTitle = modal.querySelector('#modalTitle');
  const modalText = modal.querySelector('.modal-text');
  const modalThumbs = modal.querySelector('.modal-thumbs');
  const modalCounter = modal.querySelector('.modal-counter');
  const modalPrev = modal.querySelector('.modal-prev');
  const modalNext = modal.querySelector('.modal-next');
  const modalClose = modal.querySelector('.modal-close');
  let photos = [];
  let photoIdx = 0;
  let lastFocused = null;

  function showPhoto(n) {
    photoIdx = (n + photos.length) % photos.length;
    modalImg.src = photos[photoIdx].src;
    modalImg.alt = photos[photoIdx].alt;
    modalCounter.textContent = `${photoIdx + 1} / ${photos.length}`;
    modalThumbs.querySelectorAll('.modal-thumb').forEach((thumb, i) => {
      thumb.classList.toggle('active', i === photoIdx);
    });
  }

  function openModal(card) {
    const slides = Array.from(card.querySelectorAll('.proj-slide, .slide'));
    photos = slides.map(img => ({ src: img.getAttribute('src'), alt: img.alt }));
    // Start on whichever photo the card is currently showing
    const startIdx = Math.max(0, slides.findIndex(s => s.classList.contains('active')));

    modalTitle.textContent = card.querySelector('h3').textContent;
    modalText.innerHTML = '';
    card.querySelectorAll('.project-info p, .trip-info p').forEach(p => {
      modalText.appendChild(p.cloneNode(true));
    });

    modalThumbs.innerHTML = '';
    photos.forEach((photo, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'modal-thumb';
      btn.setAttribute('aria-label', `Show photo ${i + 1}`);
      const img = document.createElement('img');
      img.src = photo.src;
      img.alt = '';
      btn.appendChild(img);
      btn.addEventListener('click', () => showPhoto(i));
      modalThumbs.appendChild(btn);
    });

    const multiple = photos.length > 1;
    modalPrev.hidden = !multiple;
    modalNext.hidden = !multiple;
    modalThumbs.hidden = !multiple;
    modalCounter.hidden = !multiple;

    lastFocused = document.activeElement;
    showPhoto(startIdx);
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    modalClose.focus();
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    if (lastFocused) lastFocused.focus();
  }

  // Make each project/trip card open the modal
  document.querySelectorAll('.card-grid .glass-card').forEach(card => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `View details: ${card.querySelector('h3').textContent}`);
    card.addEventListener('click', () => openModal(card));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(card);
      }
    });
  });

  modal.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', closeModal));
  modalPrev.addEventListener('click', () => showPhoto(photoIdx - 1));
  modalNext.addEventListener('click', () => showPhoto(photoIdx + 1));

  document.addEventListener('keydown', e => {
    if (!modal.classList.contains('open')) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft' && photos.length > 1) showPhoto(photoIdx - 1);
    if (e.key === 'ArrowRight' && photos.length > 1) showPhoto(photoIdx + 1);
    // Keep Tab focus inside the modal
    if (e.key === 'Tab') {
      const focusable = Array.from(modal.querySelectorAll('button:not([hidden])'))
        .filter(el => el.offsetParent !== null);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
});