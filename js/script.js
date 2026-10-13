// ============================================
// THEME RESTORATION (Body sync)
// ============================================
const colorMode = localStorage.getItem('color-mode');
if (colorMode) {
	document.body.className = colorMode;
	document.documentElement.className = colorMode;
}

// ============================================
// CANVAS BACKGROUND ANIMATION (Motion-aware)
// ============================================
const canvas = document.querySelector('canvas#bg');

if (canvas) {
	const ctx = canvas.getContext('2d');
	const FILL_STYLES = {
		light: 'rgba(0,0,0,0.05)',
		dark: 'rgba(255,255,255,0.15)'
	};

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

	function isDarkMode() {
		return document.documentElement.classList.contains('dark-mode') ||
			document.body.classList.contains('dark-mode') || 
			(document.body.classList.length === 0 && matchMedia('(prefers-color-scheme: dark)').matches);
	}

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

// ============================================
// COLOR MODES & EASTER EGGS
// ============================================
const sequences = [
	'YELL',
	'LITE',
	'PURP',
	'DARK',
	'BLUE',
	'PINK',
	'MINT',
	'SAVE'
].map(seq => ({
	word: seq,
	combo: seq.split('').map(c => 'Key' + c)
}));

const lastFourKeys = [];

function changeColor(word) {
	const clapper = document.querySelector('.clapper');
	if (clapper) clapper.classList.add('clapping');

	const className = `${word.toLowerCase()}-mode`;
	setTimeout(() => {
		document.body.className = className;
		document.documentElement.className = className;
		const radio = document.querySelector(`#change-color-to-${word}`);
		if (radio) radio.checked = true;
		setTimeout(() => {
			if (clapper) clapper.classList.remove('clapping');
		}, 500);
	}, 400);
}

function showToast(message) {
	const toast = document.querySelector('#color-save-toast');
	if (toast) {
		toast.textContent = message;
		setTimeout(() => {
			toast.textContent = '';
		}, 2500);
	}
}

window.addEventListener('keydown', e => {
	if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

	lastFourKeys.push(e.code);
	while (lastFourKeys.length > 4) lastFourKeys.shift();

	sequences.forEach(({ word, combo }) => {
		if (combo.every((v, i) => v === lastFourKeys[i])) {
			if (word === 'SAVE') {
				const current = document.body.className;
				localStorage.setItem('color-mode', current);
				showToast('Theme preference saved!');
				return;
			}
			changeColor(word);
		}
	});
});

const colorDialog = document.querySelector('dialog.change-color-dialog');
const colorBtn = document.querySelector('button.change-color-button');

if (colorBtn && colorDialog) {
	colorBtn.addEventListener('click', () => {
		if (typeof colorDialog.showModal === 'function') {
			colorDialog.showModal();
		} else {
			colorDialog.show();
		}
	});
}

// Generate radio buttons inside dialog
const radioContainer = document.querySelector('.change-color-dialog .radio-buttons');
if (radioContainer) {
	sequences.forEach(({ word }) => {
		if (word !== 'SAVE' && word !== 'MINT') {
			const container = document.createElement('div');

			const radio = document.createElement('input');
			radio.type = 'radio';
			radio.name = 'change-color-radio';
			radio.id = `change-color-to-${word}`;
			radio.checked = document.body.classList.contains(`${word.toLowerCase()}-mode`) ||
				(document.body.classList.length === 0 &&
					((isDarkMode() && word === 'DARK') || (!isDarkMode() && word === 'LITE')));

			radio.addEventListener('click', () => {
				changeColor(word);
			});

			const label = document.createElement('label');
			label.setAttribute('for', radio.id);
			const color = document.createElement('div');
			color.setAttribute('style', `background-color: var(--${word.toLowerCase()}Color); color: var(--${word.toLowerCase()}Text)`);
			label.appendChild(color);
			label.setAttribute('aria-label', word.toLowerCase());

			container.appendChild(radio);
			container.appendChild(label);
			radioContainer.appendChild(container);
		}
	});
}

const saveBtn = document.querySelector('#color-change-save');
if (saveBtn) {
	saveBtn.addEventListener('click', () => {
		const mode = document.body.className;
		localStorage.setItem('color-mode', mode);
		showToast('Saved!');
		setTimeout(() => {
			if (colorDialog && colorDialog.open) colorDialog.close();
		}, 600);
	});
}
