// Canvas starfield animation

(function () {
  const canvas = document.getElementById('stars-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  let mouseX = width / 2;
  let mouseY = height / 2;
  let targetMouseX = width / 2;
  let targetMouseY = height / 2;

  // Star collection
  const starsCount = Math.floor((width * height) / 3000);
  const stars = [];
  const shootingStars = [];

  const starColors = [
    '#ffffff',
    '#e0f2fe',
    '#bae6fd',
    '#7dd3fc',
    '#38bdf8',
    '#c7d2fe',
    '#a5b4fc',
    '#f472b6'
  ];

  class Star {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -10;
      this.size = Math.random() * 1.8 + 0.3;
      this.depth = Math.random() * 0.8 + 0.2; // Parallax depth factor
      this.speed = (Math.random() * 0.15 + 0.05) * this.depth;
      this.baseAlpha = Math.random() * 0.7 + 0.3;
      this.alpha = this.baseAlpha;
      this.twinkleSpeed = Math.random() * 0.03 + 0.005;
      this.twinklePhase = Math.random() * Math.PI * 2;
      this.color = starColors[Math.floor(Math.random() * starColors.length)];
    }

    update() {
      this.y += this.speed;
      if (this.y > height + 10) {
        this.reset(false);
      }

      // Gentle twinkle
      this.twinklePhase += this.twinkleSpeed;
      this.alpha = this.baseAlpha + Math.sin(this.twinklePhase) * 0.25;
      if (this.alpha < 0.1) this.alpha = 0.1;
      if (this.alpha > 1) this.alpha = 1;
    }

    draw() {
      // Apply mouse parallax
      const offsetX = (mouseX - width / 2) * 0.03 * this.depth;
      const offsetY = (mouseY - height / 2) * 0.03 * this.depth;
      const px = this.x + offsetX;
      const py = this.y + offsetY;

      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = this.color;
      ctx.shadowBlur = this.size > 1.2 ? 6 : 0;
      ctx.shadowColor = this.color;

      ctx.beginPath();
      ctx.arc(px, py, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  class ShootingStar {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width * 1.2 - width * 0.1;
      this.y = Math.random() * (height * 0.4);
      this.length = Math.random() * 80 + 50;
      this.speed = Math.random() * 8 + 6;
      this.angle = (Math.PI / 4) + (Math.random() * 0.2 - 0.1); // ~45 deg
      this.thickness = Math.random() * 1.5 + 0.8;
      this.alpha = 1;
      this.fade = Math.random() * 0.02 + 0.015;
      this.active = true;
    }

    update() {
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;
      this.alpha -= this.fade;
      if (this.alpha <= 0 || this.x > width + 100 || this.y > height + 100) {
        this.active = false;
      }
    }

    draw() {
      if (!this.active) return;
      const tailX = this.x - Math.cos(this.angle) * this.length;
      const tailY = this.y - Math.sin(this.angle) * this.length;

      const grad = ctx.createLinearGradient(this.x, this.y, tailX, tailY);
      grad.addColorStop(0, `rgba(255, 255, 255, ${this.alpha})`);
      grad.addColorStop(0.3, `rgba(56, 189, 248, ${this.alpha * 0.8})`);
      grad.addColorStop(1, 'rgba(14, 165, 233, 0)');

      ctx.save();
      ctx.strokeStyle = grad;
      ctx.lineWidth = this.thickness;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(tailX, tailY);
      ctx.stroke();
      ctx.restore();
    }
  }

  // Initialize stars
  for (let i = 0; i < starsCount; i++) {
    stars.push(new Star());
  }

  // Spawn shooting stars periodically
  function maybeSpawnShootingStar() {
    if (shootingStars.length < 3 && Math.random() < 0.015) {
      shootingStars.push(new ShootingStar());
    }
  }

  // Handle Resize
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Handle Mouse Move for smooth parallax
  window.addEventListener('mousemove', (e) => {
    targetMouseX = e.clientX;
    targetMouseY = e.clientY;
  });

  // Animation Loop
  function animate() {
    // Smooth mouse position
    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    ctx.clearRect(0, 0, width, height);

    // Subtle cosmic nebula glow in canvas background
    const bgGlow = ctx.createRadialGradient(
      width * 0.25, height * 0.35, 10,
      width * 0.25, height * 0.35, width * 0.7
    );
    bgGlow.addColorStop(0, 'rgba(14, 30, 75, 0.25)');
    bgGlow.addColorStop(0.5, 'rgba(2, 6, 23, 0.08)');
    bgGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = bgGlow;
    ctx.fillRect(0, 0, width, height);

    // Second nebula spot
    const bgGlow2 = ctx.createRadialGradient(
      width * 0.75, height * 0.7, 10,
      width * 0.75, height * 0.7, width * 0.6
    );
    bgGlow2.addColorStop(0, 'rgba(30, 27, 75, 0.2)');
    bgGlow2.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = bgGlow2;
    ctx.fillRect(0, 0, width, height);

    // Update & draw stars
    for (let i = 0; i < stars.length; i++) {
      stars[i].update();
      stars[i].draw();
    }

    // Shooting stars
    maybeSpawnShootingStar();
    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const s = shootingStars[i];
      s.update();
      s.draw();
      if (!s.active) {
        shootingStars.splice(i, 1);
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
})();
