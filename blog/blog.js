// ============================================
// BLOG ENGINE
// Client-side markdown blog renderer
// ============================================

// Canvas dots animation (same as main site)
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

const POSTS_JSON = 'posts/posts.json';

// Parse HTML comment frontmatter from markdown
function parseFrontmatter(markdown) {
	const meta = {};
	const lines = markdown.split('\n');
	const contentLines = [];
	let pastFrontmatter = false;

	for (const line of lines) {
		const match = line.match(/^<!--\s*(\w+):\s*(.+?)\s*-->$/);
		if (match && !pastFrontmatter) {
			const key = match[1].trim();
			let value = match[2].trim();
			if (key === 'tags') {
				value = value.split(',').map(t => t.trim());
			}
			meta[key] = value;
		} else {
			pastFrontmatter = true;
			contentLines.push(line);
		}
	}

	return {
		meta,
		content: contentLines.join('\n').trim()
	};
}

// Format date nicely
function formatDate(dateStr) {
	const date = new Date(dateStr + 'T00:00:00');
	return date.toLocaleDateString('en-IN', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
}

// ============================================
// BLOG LISTING PAGE
// ============================================

async function loadBlogListing() {
	const grid = document.getElementById('posts-grid');
	if (!grid) return;

	try {
		const res = await fetch(POSTS_JSON);
		if (!res.ok) throw new Error('Failed to load posts');
		const posts = await res.json();

		if (posts.length === 0) {
			grid.innerHTML = '<div class="posts-empty">No posts yet. Check back soon!</div>';
			return;
		}

		// Sort by date (newest first)
		posts.sort((a, b) => new Date(b.date) - new Date(a.date));

		grid.innerHTML = posts.map(post => `
			<a href="post.html?slug=${post.slug}" class="post-card">
				<div class="post-date">${formatDate(post.date)}</div>
				<div class="post-title">${post.title}</div>
				<div class="post-description">${post.description}</div>
				<div class="post-tags">
					${post.tags.map(tag => `<span class="post-tag">${tag}</span>`).join('')}
				</div>
			</a>
		`).join('');

		// Animate cards in
		const cards = grid.querySelectorAll('.post-card');
		const observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					const idx = Array.from(cards).indexOf(entry.target);
					setTimeout(() => entry.target.classList.add('visible'), idx * 100);
					observer.unobserve(entry.target);
				}
			});
		}, { threshold: 0.1 });

		cards.forEach(card => observer.observe(card));

	} catch (err) {
		grid.innerHTML = '<div class="posts-empty">Could not load posts. Please try again later.</div>';
		console.error('Blog listing error:', err);
	}
}

// ============================================
// SINGLE POST VIEWER
// ============================================

async function loadBlogPost() {
	const articleContent = document.getElementById('article-content');
	const articleMeta = document.getElementById('article-meta');
	if (!articleContent) return;

	const params = new URLSearchParams(window.location.search);
	const slug = params.get('slug');

	if (!slug) {
		articleContent.innerHTML = '<p>Post not found. <a href="index.html">Back to blog</a></p>';
		return;
	}

	try {
		const res = await fetch(`posts/${slug}.md`);
		if (!res.ok) throw new Error('Post not found');
		const markdown = await res.text();

		const { meta, content } = parseFrontmatter(markdown);

		// Update page title
		if (meta.title) {
			document.title = `${meta.title} — Hemanth Narra`;
		}

		// Render meta
		if (articleMeta) {
			let metaHTML = '';
			if (meta.date) {
				metaHTML += `<div class="post-date">${formatDate(meta.date)}</div>`;
			}
			if (meta.tags && meta.tags.length) {
				metaHTML += `<div class="post-tags">${meta.tags.map(t => `<span class="post-tag">${t}</span>`).join('')}</div>`;
			}
			articleMeta.innerHTML = metaHTML;
		}

		// Render markdown to HTML using marked.js
		if (typeof marked !== 'undefined') {
			marked.setOptions({
				breaks: true,
				gfm: true
			});
			articleContent.innerHTML = marked.parse(content);
		} else {
			// Fallback: show raw markdown
			articleContent.innerHTML = `<pre>${content}</pre>`;
		}

	} catch (err) {
		articleContent.innerHTML = '<p>Could not load this post. <a href="index.html">Back to blog</a></p>';
		console.error('Blog post error:', err);
	}
}

// ============================================
// SHARED: Color mode, Navbar scroll
// ============================================

// Apply saved color mode
const colorMode = localStorage.getItem('color-mode');
if (colorMode) {
	document.body.setAttribute('class', colorMode);
}

// Navbar scroll
const navbar = document.getElementById('navbar');
if (navbar) {
	function updateNavbar() {
		if (window.scrollY > 50) {
			navbar.classList.add('scrolled');
		} else {
			navbar.classList.remove('scrolled');
		}
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

// ============================================
// INIT
// ============================================

document.addEventListener('DOMContentLoaded', () => {
	loadBlogListing();
	loadBlogPost();
});
