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

import html
import os
import re
import sys
from datetime import datetime

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

try:
    import markdown
except ImportError:
    print("Error: 'markdown' package not installed.")
    print("Run: pip install -r requirements.txt")
    sys.exit(1)


# ============================================
# CONFIGURATION
# ============================================

POSTS_DIR = os.path.join("blog", "posts")
BLOG_DIR = "blog"
SITE_NAME = "Hemanth Narra"
SITE_URL = "https://hemanthnarra.in"
CONTACT_FORM = "https://forms.gle/b6mmNs5mysbTqsaD6"
INSTAGRAM = "https://www.instagram.com/hemanthnarrax/"
TWITTER = "https://x.com/CAHemanthnarra"


# ============================================
# UTILITIES
# ============================================

def slugify(value):
    """Convert a filename or title into a clean URL-friendly kebab-case slug."""
    value = re.sub(r"[^\w\s-]", "", value.lower())
    return re.sub(r"[-\s]+", "-", value).strip("-")


def parse_frontmatter(text):
    """Parse HTML comment frontmatter from markdown content.

    Allows leading/interleaving blank lines without prematurely stopping parser.
    """
    meta = {}
    lines = text.split("\n")
    content_lines = []
    past_frontmatter = False

    for line in lines:
        stripped = line.strip()
        match = re.match(r"^<!--\s*([\w\-]+):\s*(.+?)\s*-->$", stripped)
        if match and not past_frontmatter:
            key = match.group(1).strip()
            val = match.group(2).strip()
            if key == "tags":
                val = [t.strip() for t in val.split(",")]
            meta[key] = val
        elif not stripped and not past_frontmatter:
            # Blank line before/between frontmatter comments — keep scanning
            continue
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

def get_head(title, description="", og_type="website", page_url=None):
    safe_title = html.escape(title)
    safe_description = html.escape(description)
    canonical_url = page_url or f"{SITE_URL}/blog/"

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{safe_title} — {SITE_NAME}</title>
    <meta name="description" content="{safe_description}">
    <link rel="canonical" href="{canonical_url}">
    <meta property="og:url" content="{canonical_url}">
    <meta property="og:type" content="{og_type}">
    <meta property="og:title" content="{safe_title} — {SITE_NAME}">
    <meta property="og:description" content="{safe_description}">
    <meta name="twitter:card" content="summary">
    <meta name="twitter:site" content="@CAHemanthnarra">
    <meta name="twitter:creator" content="@CAHemanthnarra">
    <meta name="twitter:title" content="{safe_title} — {SITE_NAME}">
    <meta name="twitter:description" content="{safe_description}">
    <link rel="stylesheet" type="text/css" href="../fonts/css/nunito.css">
    <link rel="stylesheet" type="text/css" href="../fonts/css/fontawesome.min.css">
    <link rel="stylesheet" type="text/css" href="../css/style.css">
    <link rel="stylesheet" type="text/css" href="blog.css">
    <link rel="icon" href="../fonts/circle_h_icon_199375.ico" type="image/x-icon">
</head>
<body>

<canvas id="bg" aria-hidden="true"></canvas>
"""


def get_navbar():
    return """
<nav id="navbar" class="navbar scrolled">
    <div class="nav-inner">
        <a href="../index.html" class="nav-logo">Hemanth<span> Narra</span></a>
        <div id="nav-links" class="nav-links">
            <a href="../index.html">Home</a>
            <a href="../index.html#services">Services</a>
            <a href="index.html">Blog</a>
            <a href="../index.html#contact">Contact</a>
        </div>
        <button class="nav-menu-btn" aria-label="Toggle menu" aria-expanded="false" aria-controls="nav-links">
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
            <a href="{CONTACT_FORM}" target="_blank" rel="noopener noreferrer" class="footer-btn">Connect Now</a>
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
                    <a href="{INSTAGRAM}" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                        <i class="fab fa-instagram"></i>
                    </a>
                    <a href="{TWITTER}" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
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
    post_url = f"{SITE_URL}/blog/{slug}.html"

    tags_html = ""
    if tags:
        tags_html = '<div class="post-tags">' + "".join(
            f'<span class="post-tag">{html.escape(tag)}</span>' for tag in tags
        ) + "</div>"

    return (
        get_head(title, description, "article", page_url=post_url)
        + get_navbar()
        + f"""
<article class="article-section">
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
</article>
"""
        + get_footer()
    )


def build_listing_page(posts):
    """Generate the blog listing HTML page."""
    # Deterministic sort: primarily by date (newest first), secondarily by title
    posts.sort(key=lambda p: (p.get("date", ""), p.get("title", "")), reverse=True)

    cards_html = ""
    for post in posts:
        tags_html = "".join(
            f'<span class="post-tag">{html.escape(tag)}</span>'
            for tag in post.get("tags", [])
        )
        cards_html += f"""
        <a href="{post['slug']}.html" class="post-card visible">
            <div class="post-date">{format_date(post.get('date', ''))}</div>
            <div class="post-title">{html.escape(post.get('title', 'Untitled'))}</div>
            <div class="post-description">{html.escape(post.get('description', ''))}</div>
            <div class="post-tags">{tags_html}</div>
        </a>
"""

    if not cards_html:
        cards_html = '<div class="posts-empty">No posts yet. Check back soon!</div>'

    return (
        get_head(
            "Blog",
            "Easy-to-digest articles about tax, compliance, business, and personal finance.",
            og_type="website",
            page_url=f"{SITE_URL}/blog/",
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


def generate_sitemap(posts):
    """Generate sitemap.xml for search engine crawlers."""
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        '  <url>',
        f'    <loc>{SITE_URL}/</loc>',
        '    <changefreq>weekly</changefreq>',
        '    <priority>1.0</priority>',
        '  </url>',
        '  <url>',
        f'    <loc>{SITE_URL}/blog/</loc>',
        '    <changefreq>daily</changefreq>',
        '    <priority>0.8</priority>',
        '  </url>',
    ]

    for post in posts:
        lines.append('  <url>')
        lines.append(f'    <loc>{SITE_URL}/blog/{post["slug"]}.html</loc>')
        if post.get("date"):
            lines.append(f'    <lastmod>{post["date"]}</lastmod>')
        lines.append('    <changefreq>monthly</changefreq>')
        lines.append('    <priority>0.7</priority>')
        lines.append('  </url>')

    lines.append('</urlset>\n')

    with open("sitemap.xml", "w", encoding="utf-8") as f:
        f.write("\n".join(lines))


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
        sys.exit(1)

    md_files = [f for f in os.listdir(POSTS_DIR) if f.endswith(".md")]

    if not md_files:
        print("No markdown files found in", POSTS_DIR)

    posts_manifest = []
    generated_files = {"index.html"}
    count = 0

    for filename in md_files:
        filepath = os.path.join(POSTS_DIR, filename)
        base_name = filename[:-3]  # strip .md
        slug = slugify(base_name)

        print(f"  Building: {filename} -> {slug}.html")

        with open(filepath, "r", encoding="utf-8") as f:
            raw = f.read()

        meta, content = parse_frontmatter(raw)
        md.reset()
        html_content = md.convert(content)

        # Generate post page
        post_html = build_post_page(meta, html_content, slug)
        output_filename = f"{slug}.html"
        output_path = os.path.join(BLOG_DIR, output_filename)
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(post_html)

        generated_files.add(output_filename)

        # Add to manifest
        posts_manifest.append({
            "slug": slug,
            "title": meta.get("title", base_name),
            "date": meta.get("date", ""),
            "tags": meta.get("tags", []),
            "description": meta.get("description", ""),
        })

        count += 1

    # Clean up stale generated html files in BLOG_DIR
    if os.path.exists(BLOG_DIR):
        for existing in os.listdir(BLOG_DIR):
            if existing.endswith(".html") and existing not in generated_files:
                stale_path = os.path.join(BLOG_DIR, existing)
                try:
                    os.remove(stale_path)
                    print(f"  Cleaned stale post: {existing}")
                except OSError as e:
                    print(f"  Warning: Could not remove stale file {existing}: {e}")

    # Generate listing page
    listing_html = build_listing_page(posts_manifest)
    listing_path = os.path.join(BLOG_DIR, "index.html")
    with open(listing_path, "w", encoding="utf-8") as f:
        f.write(listing_html)

    # Generate sitemap.xml
    generate_sitemap(posts_manifest)

    print(f"\n[+] Built {count} posts + listing page + sitemap.xml")
    print(f"    Output: {BLOG_DIR}/")


if __name__ == "__main__":
    print("[*] Building blog...\n")
    build()
    print("\n[+] Done!")
