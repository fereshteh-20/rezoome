/**
 * Cosmic Galaxy Resume - Main Interactions & Animations
 * Author: mwri-tech
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
      }
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-xmark');
        }
      });
    });
  }

  // 2. 3D Tilt Effect on Glass Pillar Cards
  const tiltCards = document.querySelectorAll('.pillar-card, .cosmic-avatar-box');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const deltaX = (x - centerX) / centerX;
      const deltaY = (y - centerY) / centerY;
      
      const rotateX = deltaY * -8;
      const rotateY = deltaX * 8;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // 3. Animated Skill Bars on Scroll
  const skillBars = document.querySelectorAll('.skill-progress');
  const observerOptions = {
    threshold: 0.3
  };

  const skillObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const targetWidth = bar.getAttribute('data-width') || '85%';
        bar.style.width = targetWidth;
        observer.unobserve(bar);
      }
    });
  }, observerOptions);

  skillBars.forEach(bar => {
    bar.style.width = '0%';
    skillObserver.observe(bar);
  });

  // 4. Contact Form / Quick Message
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('sender-name')?.value || '';
      const email = document.getElementById('sender-email')?.value || '';
      const message = document.getElementById('sender-message')?.value || '';

      // Direct mailto fallback
      const subject = encodeURIComponent(`پیام همکاری و پروژه از طرف: ${name}`);
      const body = encodeURIComponent(`نام: ${name}\nایمیل: ${email}\n\nپیام:\n${message}`);
      
      window.location.href = `mailto:fereshte8416@gmail.com?subject=${subject}&body=${body}`;

      if (formSuccess) {
        formSuccess.style.display = 'block';
        contactForm.reset();
        setTimeout(() => {
          formSuccess.style.display = 'none';
        }, 6000);
      }
    });
  }

  // 5. Copy Email Helper
  const copyEmailBtn = document.getElementById('copy-email-btn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = 'fereshte8416@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        const originalText = copyEmailBtn.innerHTML;
        copyEmailBtn.innerHTML = '<i class="fa-solid fa-check"></i> کپی شد!';
        setTimeout(() => {
          copyEmailBtn.innerHTML = originalText;
        }, 2500);
      });
    });
  }
});
