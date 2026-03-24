// --- Minimalist Interaction Logic ---
// We use CSS 3D transforms for high performance and clean structure.

document.addEventListener('DOMContentLoaded', () => {
  // 0. Video Background Handling
  const bgVideo = document.getElementById('bg-video');
  if (bgVideo) {
    // Check if video is already ready (for cached versions)
    if (bgVideo.readyState >= 3) {
      bgVideo.classList.add('video-ready');
    } else {
      // Otherwise wait for canplay event
      bgVideo.addEventListener('canplay', () => {
        bgVideo.classList.add('video-ready');
      });
    }
  }

  // 1. Interaction for cards
  const cards = document.querySelectorAll('.glass-card, .portfolio-item, .service-card');
  
  const handleMove = (e, card) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 20; 
    const rotateY = (centerX - x) / 20; 
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };
  
  const handleLeave = (card) => {
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  };

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => handleMove(e, card));
    card.addEventListener('mouseleave', () => handleLeave(card));
    card.style.transition = 'transform 0.1s ease-out';
  });

  // 2. Parallax for Avatar and Greeting
  const avatar = document.querySelector('.hero-avatar');
  const greeting = document.querySelector('.greeting');

  window.addEventListener('mousemove', (e) => {
    const moveX = (e.clientX - window.innerWidth / 2) * 0.005;
    const moveY = (e.clientY - window.innerHeight / 2) * 0.005;
    
    if (avatar) {
      avatar.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
    }
    
    if (greeting) {
      // Subtle opposite move for the greeting text
      greeting.style.transform = `translate3d(${-moveX * 2}px, ${-moveY * 2}px, 0)`;
    }
  });

  // 3. Scroll visibility
  const observerOptions = {
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0) perspective(1000px) rotateX(0)';
      }
    });
  }, observerOptions);

  document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px) perspective(1000px) rotateX(2deg)';
    section.style.transition = 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)';
    observer.observe(section);
  });
});

// Navbar scroll logic
window.addEventListener('scroll', () => {
  const nav = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});
