// ============================================
// BLOG — Shared JS (Canvas dots + Navbar)
// No markdown parsing needed — Python handles it!
// ============================================

// Canvas dots animation
const canvas = document.querySelector('canvas#bg');
if (canvas) {
	function resizeCanvas() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	}
	resizeCanvas();
	addEventListener('resize', resizeCanvas);

	const ctx = canvas.getContext('2d');
	const FILL_STYLES = {
		light: 'rgba(0,0,0,0.05)',
		dark: 'rgba(255,255,255,0.15)'
	};

	function isDarkMode() {
		return document.body.classList.contains('dark-mode') ||
			(document.body.classList.length === 0 && matchMedia('(prefers-color-scheme: dark)').matches);
	}

	function Point() {
		const r = 8;
		const initialProgress = -4 * Math.random();
		this.init = function() {
			this.progress = initialProgress;
			this.x = Math.random() * canvas.width;
			this.y = Math.random() * canvas.height;
		}
		this.draw = function() {
			if (this.progress >= 0) {
				ctx.fillStyle = isDarkMode() ? FILL_STYLES.dark : FILL_STYLES.light;
				ctx.beginPath();
				ctx.arc(this.x, this.y, Math.abs(Math.sin(Math.PI * this.progress) * r), 0, 2 * Math.PI);
				ctx.fill();
			}
		};
		this.render = function() {
			if (this.progress > 0.5) this.progress += 0.005;
			else this.progress += 0.05;
			this.draw();
			if (this.progress >= 1) this.init();
		}
	}

	const dots = [];
	for (let i = 0; i < 20; i++) {
		dots[i] = new Point();
		dots[i].init();
	}

	(function loop() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		for (let i = 0; i < 20; i++) dots[i].render();
		requestAnimationFrame(loop);
	})();
}

// Apply saved color mode
const colorMode = localStorage.getItem('color-mode');
if (colorMode) {
	document.body.setAttribute('class', colorMode);
}

// Navbar scroll
const navbar = document.getElementById('navbar');
if (navbar) {
	function updateNavbar() {
		navbar.classList.toggle('scrolled', window.scrollY > 50);
	}
	window.addEventListener('scroll', updateNavbar, { passive: true });
	updateNavbar();
}

// Mobile menu toggle
const menuBtn = document.querySelector('.nav-menu-btn');
const navLinks = document.querySelector('.nav-links');
if (menuBtn && navLinks) {
	menuBtn.addEventListener('click', () => {
		navLinks.classList.toggle('open');
		const icon = menuBtn.querySelector('i');
		icon.className = navLinks.classList.contains('open') ? 'fas fa-times' : 'fas fa-bars';
	});
	navLinks.querySelectorAll('a').forEach(link => {
		link.addEventListener('click', () => {
			navLinks.classList.remove('open');
			menuBtn.querySelector('i').className = 'fas fa-bars';
		});
	});
}
