// ============================================
// BLOG — Shared JS (Canvas dots + Navbar)
// ============================================

// Canvas dots animation (Motion-aware & High-DPI)
const canvas = document.querySelector('canvas#bg');
if (canvas) {
	const ctx = canvas.getContext('2d');

	let width = window.innerWidth;
	let height = window.innerHeight;
	let dpr = window.devicePixelRatio || 1;

	function resizeCanvas() {
		width = window.innerWidth;
		height = window.innerHeight;
		dpr = window.devicePixelRatio || 1;
		canvas.width = width * dpr;
		canvas.height = height * dpr;
		canvas.style.width = width + 'px';
		canvas.style.height = height + 'px';
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
	}
	resizeCanvas();
	window.addEventListener('resize', resizeCanvas, { passive: true });

	function Point() {
		const r = 8;
		this.init = function() {
			this.progress = -4 * Math.random();
			this.x = Math.random() * width;
			this.y = Math.random() * height;
		};
		this.draw = function() {
			if (this.progress >= 0) {
				ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
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
		};
	}

	const dots = [];
	for (let i = 0; i < 20; i++) {
		dots[i] = new Point();
		dots[i].init();
	}

	let animationFrameId = null;
	const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

	function loop() {
		ctx.clearRect(0, 0, width, height);
		for (let i = 0; i < 20; i++) dots[i].render();
		animationFrameId = requestAnimationFrame(loop);
	}

	function startAnimation() {
		if (!animationFrameId && !reducedMotionQuery.matches && !document.hidden) {
			animationFrameId = requestAnimationFrame(loop);
		}
	}

	function stopAnimation() {
		if (animationFrameId) {
			cancelAnimationFrame(animationFrameId);
			animationFrameId = null;
		}
	}

	if (!reducedMotionQuery.matches && !document.hidden) {
		startAnimation();
	}

	document.addEventListener('visibilitychange', () => {
		if (document.hidden) stopAnimation();
		else startAnimation();
	});

	reducedMotionQuery.addEventListener('change', (e) => {
		if (e.matches) stopAnimation();
		else startAnimation();
	});
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
	function toggleMenu(forceState) {
		const isOpen = typeof forceState === 'boolean' ? forceState : !navLinks.classList.contains('open');
		navLinks.classList.toggle('open', isOpen);
		menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
		const icon = menuBtn.querySelector('i');
		if (icon) {
			icon.className = isOpen ? 'fas fa-times' : 'fas fa-bars';
		}
	}

	menuBtn.addEventListener('click', (e) => {
		e.stopPropagation();
		toggleMenu();
	});

	navLinks.querySelectorAll('a').forEach(link => {
		link.addEventListener('click', () => toggleMenu(false));
	});

	window.addEventListener('keydown', (e) => {
		if (e.key === 'Escape' && navLinks.classList.contains('open')) {
			toggleMenu(false);
			menuBtn.focus();
		}
	});

	document.addEventListener('click', (e) => {
		if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && !menuBtn.contains(e.target)) {
			toggleMenu(false);
		}
	});
}
