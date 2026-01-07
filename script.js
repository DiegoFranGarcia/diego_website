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
  
  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);
  
  document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
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
});