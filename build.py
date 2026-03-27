"""
Blog Builder — Converts Markdown posts to static HTML pages.

Usage:
    pip install markdown
    python build.py

This script:
1. Reads all .md files from blog/posts/
2. Parses HTML-comment frontmatter
3. Converts markdown to HTML
4. Generates blog/index.html (listing page)
5. Generates blog/<slug>.html for each post
"""

import os
import re
import json
from datetime import datetime

try:
    import markdown
except ImportError:
    print("Error: 'markdown' package not installed.")
    print("Run: pip install markdown")
    exit(1)


# ============================================
# CONFIGURATION
# ============================================

POSTS_DIR = os.path.join("blog", "posts")
BLOG_DIR = "blog"
SITE_NAME = "Hemanth Narra"
SITE_URL = "https://hemanthnarra.in"
CONTACT_FORM = "https://forms.gle/b6mmNs5mysbTqsaD6"
INSTAGRAM = "https://www.instagram.com/hemanthnarrax/"
TWITTER = "https://x.com/HemanthnarraX"


# ============================================
# FRONTMATTER PARSER
# ============================================

def parse_frontmatter(text):
    """Parse HTML comment frontmatter from markdown content."""
    meta = {}
    lines = text.split("\n")
    content_lines = []
    past_frontmatter = False

    for line in lines:
        match = re.match(r"^<!--\s*(\w+):\s*(.+?)\s*-->$", line.strip())
        if match and not past_frontmatter:
            key = match.group(1).strip()
            value = match.group(2).strip()
            if key == "tags":
                value = [t.strip() for t in value.split(",")]
            meta[key] = value
        else:
            past_frontmatter = True
            content_lines.append(line)

    return meta, "\n".join(content_lines).strip()


def format_date(date_str):
    """Format date string to readable format."""
    try:
        dt = datetime.strptime(date_str, "%Y-%m-%d")
        return dt.strftime("%B %d, %Y")
    except (ValueError, TypeError):
        return date_str


# ============================================
# HTML TEMPLATES
# ============================================

def get_head(title, description="", og_type="website"):
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{title} — {SITE_NAME}</title>
    <meta name="description" content="{description}">
    <meta property="og:url" content="{SITE_URL}/blog/">
    <meta property="og:type" content="{og_type}">
    <meta property="og:title" content="{title} — {SITE_NAME}">
    <meta property="og:description" content="{description}">
    <link rel="stylesheet" type="text/css" href="../fonts/css/nunito.css">
    <link rel="stylesheet" type="text/css" href="../fonts/css/fontawesome.min.css">
    <link rel="stylesheet" type="text/css" href="../css/style.css">
    <link rel="stylesheet" type="text/css" href="blog.css">
    <link rel="icon" href="../fonts/circle_h_icon_199375.ico" type="image/x-icon">
</head>
<body>

<canvas id="bg"></canvas>
"""


def get_navbar():
    return """
<nav id="navbar" class="navbar scrolled">
    <div class="nav-inner">
        <a href="../index.html" class="nav-logo">Hemanth<span> Narra</span></a>
        <div class="nav-links">
            <a href="../index.html">Home</a>
            <a href="../index.html#services">Services</a>
            <a href="index.html">Blog</a>
            <a href="../index.html#contact">Contact</a>
        </div>
        <button class="nav-menu-btn" aria-label="Toggle menu">
            <i class="fas fa-bars"></i>
        </button>
    </div>
</nav>
"""


def get_footer():
    return f"""
<footer id="contact" class="site-footer">
    <div class="footer-inner">
        <div class="footer-cta">
            <h2>Ready to get started?</h2>
            <p>Let's sort out whatever's on your plate.</p>
            <a href="{CONTACT_FORM}" target="_blank" class="footer-btn">Connect Now</a>
        </div>
        <div class="footer-links">
            <div class="footer-col">
                <h4>Quick Links</h4>
                <a href="../index.html">Home</a>
                <a href="../index.html#services">Services</a>
                <a href="index.html">Blog</a>
            </div>
            <div class="footer-col">
                <h4>Follow Along</h4>
                <div class="social-links">
                    <a href="{INSTAGRAM}" target="_blank" aria-label="Instagram">
                        <i class="fab fa-instagram"></i>
                    </a>
                    <a href="{TWITTER}" target="_blank" aria-label="X (Twitter)">
                        <i class="fab fa-twitter"></i>
                    </a>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; {datetime.now().year} {SITE_NAME}. All rights reserved.</p>
        </div>
    </div>
</footer>

<script src="blog.js"></script>
</body>
</html>
"""


# ============================================
# PAGE GENERATORS
# ============================================

def build_post_page(meta, html_content, slug):
    """Generate a single blog post HTML page."""
    title = meta.get("title", "Blog Post")
    description = meta.get("description", "")
    date = meta.get("date", "")
    tags = meta.get("tags", [])

    tags_html = ""
    if tags:
        tags_html = '<div class="post-tags">' + "".join(
            f'<span class="post-tag">{tag}</span>' for tag in tags
        ) + "</div>"

    return (
        get_head(title, description, "article")
        + get_navbar()
        + f"""
<section class="article-section">
    <div class="article-inner">
        <a href="index.html" class="back-link">
            <i class="fas fa-arrow-left"></i>
            <span>Back to Blog</span>
        </a>

        <div class="article-meta">
            <div class="post-date">{format_date(date)}</div>
            {tags_html}
        </div>

        <div class="article-content">
            {html_content}
        </div>
    </div>
</section>
"""
        + get_footer()
    )


def build_listing_page(posts):
    """Generate the blog listing HTML page."""
    # Sort by date (newest first)
    posts.sort(key=lambda p: p.get("date", ""), reverse=True)

    cards_html = ""
    for i, post in enumerate(posts):
        tags_html = "".join(
            f'<span class="post-tag">{tag}</span>'
            for tag in post.get("tags", [])
        )
        cards_html += f"""
        <a href="{post['slug']}.html" class="post-card visible">
            <div class="post-date">{format_date(post.get('date', ''))}</div>
            <div class="post-title">{post.get('title', 'Untitled')}</div>
            <div class="post-description">{post.get('description', '')}</div>
            <div class="post-tags">{tags_html}</div>
        </a>
"""

    if not cards_html:
        cards_html = '<div class="posts-empty">No posts yet. Check back soon!</div>'

    return (
        get_head(
            "Blog",
            "Easy-to-digest articles about tax, compliance, business, and personal finance.",
        )
        + get_navbar()
        + f"""
<section class="blog-section">
    <div class="blog-inner">
        <div class="blog-header">
            <h1>Blog</h1>
            <p>Thoughts on tax, compliance, and building businesses — written simply.</p>
        </div>

        <div class="posts-grid">
            {cards_html}
        </div>
    </div>
</section>
"""
        + get_footer()
    )


# ============================================
# MAIN BUILD
# ============================================

def build():
    """Main build function."""
    md = markdown.Markdown(extensions=["tables", "fenced_code", "attr_list"])

    # Find all markdown files
    if not os.path.exists(POSTS_DIR):
        print(f"Error: Posts directory '{POSTS_DIR}' not found.")
        print("Run this script from the project root directory.")
        exit(1)

    md_files = [f for f in os.listdir(POSTS_DIR) if f.endswith(".md")]

    if not md_files:
        print("No markdown files found in", POSTS_DIR)

    posts_manifest = []
    count = 0

    for filename in md_files:
        filepath = os.path.join(POSTS_DIR, filename)
        slug = filename.replace(".md", "")

        print(f"  Building: {filename} → {slug}.html")

        with open(filepath, "r", encoding="utf-8") as f:
            raw = f.read()

        meta, content = parse_frontmatter(raw)
        md.reset()
        html_content = md.convert(content)

        # Generate post page
        post_html = build_post_page(meta, html_content, slug)
        output_path = os.path.join(BLOG_DIR, f"{slug}.html")
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(post_html)

        # Add to manifest
        posts_manifest.append({
            "slug": slug,
            "title": meta.get("title", slug),
            "date": meta.get("date", ""),
            "tags": meta.get("tags", []),
            "description": meta.get("description", ""),
        })

        count += 1

    # Generate listing page
    listing_html = build_listing_page(posts_manifest)
    listing_path = os.path.join(BLOG_DIR, "index.html")
    with open(listing_path, "w", encoding="utf-8") as f:
        f.write(listing_html)

    print(f"\n✅ Built {count} posts + listing page")
    print(f"   Output: {BLOG_DIR}/")


if __name__ == "__main__":
    print("🔨 Building blog...\n")
    build()
    print("\n🎉 Done!")
