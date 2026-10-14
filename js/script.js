// ============================================
// CANVAS BACKGROUND ANIMATION (Motion-aware)
// ============================================
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
			this.r = 0;
			this.rng = Math.random();
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
	const n = 20;
	for (let i = 0; i < n; i++) {
		dots[i] = new Point();
		dots[i].init();
	}

	let animationFrameId = null;
	const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

	function loop() {
		ctx.clearRect(0, 0, width, height);
		for (let i = 0; i < n; i++) {
			dots[i].render();
		}
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

// ============================================
// NAVBAR SCROLL BEHAVIOR
// ============================================
const navbar = document.getElementById('navbar');

function updateNavbar() {
	if (navbar) {
		navbar.classList.toggle('scrolled', window.scrollY > 50);
	}
}
window.addEventListener('scroll', updateNavbar, { passive: true });
updateNavbar();

// ============================================
// MOBILE MENU TOGGLE
// ============================================
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

// ============================================
// SERVICE CARD ACCORDION
// ============================================
document.querySelectorAll('.service-card').forEach(card => {
	const header = card.querySelector('.card-header');
	const toggleBtn = card.querySelector('.card-toggle');
	const titleText = card.querySelector('.card-title')?.textContent.trim() || 'services';

	function toggleCard() {
		const willExpand = !card.classList.contains('expanded');

		// Close other open cards
		document.querySelectorAll('.service-card.expanded').forEach(openCard => {
			if (openCard !== card) {
				openCard.classList.remove('expanded');
				const otherBtn = openCard.querySelector('.card-toggle');
				const otherHeader = openCard.querySelector('.card-header');
				const otherTitle = openCard.querySelector('.card-title')?.textContent.trim() || 'services';
				if (otherBtn) {
					otherBtn.setAttribute('aria-expanded', 'false');
					otherBtn.setAttribute('aria-label', `Expand ${otherTitle} services`);
				}
				if (otherHeader) {
					otherHeader.setAttribute('aria-expanded', 'false');
				}
			}
		});

		card.classList.toggle('expanded', willExpand);
		if (toggleBtn) {
			toggleBtn.setAttribute('aria-expanded', willExpand ? 'true' : 'false');
			toggleBtn.setAttribute('aria-label', `${willExpand ? 'Collapse' : 'Expand'} ${titleText} services`);
		}
		if (header) {
			header.setAttribute('aria-expanded', willExpand ? 'true' : 'false');
		}
	}

	if (header) {
		header.addEventListener('click', () => toggleCard());
		header.addEventListener('keydown', (e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				toggleCard();
			}
		});
	}
});

// ============================================
// SCROLL ANIMATIONS (IntersectionObserver)
// ============================================
const observerOptions = {
	threshold: 0.1,
	rootMargin: '0px 0px -50px 0px'
};

const scrollObserver = new IntersectionObserver((entries) => {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			const card = entry.target;
			card.classList.add('visible');
			scrollObserver.unobserve(card);
		}
	});
}, observerOptions);

document.querySelectorAll('.service-card').forEach(card => {
	scrollObserver.observe(card);
});
