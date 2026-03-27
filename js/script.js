const canvas = document.querySelector('canvas#bg');

function resizeCanvas() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}
resizeCanvas();

const ctx = canvas.getContext('2d');
const FILL_STYLES = {
	light: 'rgba(0,0,0,0.05)',
	dark: 'rgba(255,255,255,0.15)'
};

const colorMode = localStorage.getItem('color-mode');

if(colorMode) {
	document.body.setAttribute('class', colorMode);
}

addEventListener('resize', resizeCanvas);

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
		this.r = 0;
		this.rng = Math.random();
	}
	
	this.draw = function() {
		if(this.progress >= 0) {
			ctx.fillStyle = isDarkMode() ? FILL_STYLES.dark : FILL_STYLES.light;
			ctx.beginPath();
			ctx.arc(this.x, this.y, Math.abs(Math.sin(Math.PI*this.progress)*r), 0, 2*Math.PI);
			ctx.fill();
		}
	};
	this.render = function() {
		if(this.progress > 0.5) this.progress += 0.005;
		else this.progress += 0.05;
		this.draw();
		if(this.progress >= 1) this.init();
	}
}

const dots = [];

const n = 20;

for(let i = 0; i < n; i++) {
	dots[i] = new Point();
	dots[i].init();
}

function loop() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	for(let i = 0; i < n; i++) {
		dots[i].render();
	}
		
	requestAnimationFrame(loop);
}

loop();

// ============================================
// NAVBAR SCROLL BEHAVIOR
// ============================================

const navbar = document.getElementById('navbar');

function updateNavbar() {
	if (window.scrollY > 50) {
		navbar.classList.add('scrolled');
	} else {
		navbar.classList.remove('scrolled');
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
	menuBtn.addEventListener('click', () => {
		navLinks.classList.toggle('open');
		const icon = menuBtn.querySelector('i');
		if (navLinks.classList.contains('open')) {
			icon.className = 'fas fa-times';
		} else {
			icon.className = 'fas fa-bars';
		}
	});

	// Close menu when a link is clicked
	navLinks.querySelectorAll('a').forEach(link => {
		link.addEventListener('click', () => {
			navLinks.classList.remove('open');
			menuBtn.querySelector('i').className = 'fas fa-bars';
		});
	});
}

// ============================================
// SERVICE CARD EXPAND / COLLAPSE
// ============================================

document.querySelectorAll('.service-card').forEach(card => {
	const header = card.querySelector('.card-header');
	header.addEventListener('click', () => {
		// Close other open cards
		document.querySelectorAll('.service-card.expanded').forEach(openCard => {
			if (openCard !== card) {
				openCard.classList.remove('expanded');
			}
		});
		card.classList.toggle('expanded');
	});
});

// ============================================
// SCROLL ANIMATIONS (IntersectionObserver)
// ============================================

const observerOptions = {
	threshold: 0.1,
	rootMargin: '0px 0px -50px 0px'
};

const scrollObserver = new IntersectionObserver((entries) => {
	entries.forEach((entry, index) => {
		if (entry.isIntersecting) {
			// Stagger the animation for each card
			const card = entry.target;
			const cardIndex = Array.from(document.querySelectorAll('.service-card')).indexOf(card);
			setTimeout(() => {
				card.classList.add('visible');
			}, cardIndex * 100);
			scrollObserver.unobserve(card);
		}
	});
}, observerOptions);

document.querySelectorAll('.service-card').forEach(card => {
	scrollObserver.observe(card);
});

// ============================================
// COLOR EASTER EGGS (existing)
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
	clapper.classList.toggle('clapping');
	setTimeout(() => {
		document.body.setAttribute('class', `${word.toLowerCase()}-mode`);
		const radio = document.querySelector(`#change-color-to-${word}`);
		if (radio) radio.checked = true;
		setTimeout(() => clapper.classList.toggle('clapping'), 500);
	}, 500);
}

addEventListener('keypress', e => {
	lastFourKeys.push(e.code);
	while(lastFourKeys.length > 4) lastFourKeys.shift();
	sequences.forEach(({word, combo}) => {
		if(combo.every((v, i) => v === lastFourKeys[i])) {
			if(word === 'SAVE') {
				if(confirm('Would you like to save the current color mode to local browser storage?')) {
					localStorage.setItem('color-mode', document.body.getAttribute('class'));
				}
				return;
			}

			changeColor(word);
		}
	});
});

document.querySelector('button.change-color-button').addEventListener('click', () => {
	document.querySelector('dialog.change-color-dialog').show();
});

sequences.forEach(({word}) => {
	// mint is deprecated, only kept here for backwards compatibility
	if(word !== 'SAVE' && word !== 'MINT') {
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
		color.setAttribute('style', 
			`background-color: var(--${word.toLowerCase()}Color); color: var(--${word.toLowerCase()}Text)`);
		label.appendChild(color);
		label.setAttribute('aria-label', word.toLowerCase());

		container.appendChild(radio);
		container.appendChild(label);

		document.querySelector('.change-color-dialog .radio-buttons').appendChild(container);
	}
});

document.querySelector('#color-change-save').addEventListener('click', () => {
	localStorage.setItem('color-mode', document.body.getAttribute('class'));
	alert('Saved!');
});

function among() {
	alert('haha among us');
}
