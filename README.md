# Hemanth Narra — Portfolio, Blog & NRI Tax Tools

Personal portfolio, business services catalogue, static blog, and NRI tax determination tools for **Hemanth Kumar Narra** (Tax, Compliance & Business Advisory).

Built with vanilla HTML5, CSS3, JavaScript, a Python-powered Markdown blog generator, and served via a multi-stage Nginx Docker container.

---

## Features

- **Services Catalogue:** Categorized, keyboard-navigable interactive accordions with full ARIA semantics.
- **Static Markdown Blog:** Python builder (`build.py`) converting Markdown posts into static HTML articles with clean kebab-case slugs, OpenGraph metadata, and automated `sitemap.xml` generation.
- **NRI Property Sale Checker:** Deterministic, interactive calculator for Non-Resident Indians selling immovable property in India. Computes capital gains (12.5% LTCG under 2025 Act vs slab STCG), statutory TDS exposure under Section 393(2) / Section 195, Section 395 Form 128 Lower Deduction Certificate rate, Section 54 / 54EC / 54F exemption savings, Form 141 Schedule E PAN-based buyer compliance, and FEMA USD 1 Million repatriation headroom.
- **Design & Theme:** Sleek, fixed black/dark theme with WCAG 2.1 AA compliant contrast ratios.
- **Motion-Aware Canvas:** Particle animation loop that respects `prefers-reduced-motion` and pauses when tab is backgrounded.
- **SEO & Structured Data:** OpenGraph, Twitter Card summary tags, canonical links, `robots.txt`, XML sitemap, and Schema.org JSON-LD structured data.

---

## Docker Setup & Deployment

The project uses a **multi-stage `Dockerfile`**:
1. **Stage 1 (Builder):** Uses `python:3.12-alpine` to install dependencies and run `build.py`, compiling all Markdown posts into static HTML pages.
2. **Stage 2 (Server):** Uses lightweight `nginx:alpine` to serve the static site files on port 80 while discarding build artifacts.

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed and running on your system.

### 1. Build the Docker Image

Run the following command from the root directory of the project:

```bash
docker build -t hemanth-site .
```

> **Note:** `.dockerignore` automatically excludes `.git`, `__pycache__`, and editor files to keep the build context fast and lean.

### 2. Run the Container

Run the built image, mapping port `8080` (or any available host port) to the container's port `80`:

```bash
docker run -d --name hemanth-portfolio -p 8080:80 hemanth-site
```

### 3. Access the Website

Open your browser and navigate to:

```
http://localhost:8080
```

- **Home & Services:** `http://localhost:8080/`
- **Blog Listing:** `http://localhost:8080/blog/`
- **NRI Property Sale Checker:** `http://localhost:8080/nri-property-sale-checker/`

### 4. Useful Docker Commands

```bash
# View container logs
docker logs -f hemanth-portfolio

# Stop the container
docker stop hemanth-portfolio

# Restart the container
docker start hemanth-portfolio

# Remove the container
docker rm -f hemanth-portfolio
```

### Optional: Docker Compose

If you prefer using Docker Compose, create a `docker-compose.yml` file:

```yaml
version: '3.8'

services:
  web:
    build: .
    container_name: hemanth-portfolio
    ports:
      - "8080:80"
    restart: unless-stopped
```

Then start the service with:

```bash
docker compose up -d --build
```

---

## Local Development (Without Docker)

You can also run and develop the site locally using Python:

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Build the Blog

Compile markdown posts in `blog/posts/` to HTML:

```bash
python build.py
```

This generates:
- `blog/index.html` (blog listing)
- `blog/<slug>.html` (individual articles)
- `sitemap.xml` (SEO sitemap)

### 3. Start a Local Web Server

```bash
python -m http.server 8000
```

Visit `http://localhost:8000` in your browser.
- **Home & Services:** `http://localhost:8000/`
- **Blog Listing:** `http://localhost:8000/blog/`
- **NRI Property Sale Checker:** `http://localhost:8000/nri-property-sale-checker/`

---

## Writing & Publishing Blog Posts

1. Create a new `.md` file inside `blog/posts/` (use lowercase kebab-case, e.g. `guide-to-gst.md`).
2. Add the HTML-comment frontmatter at the top:

```markdown
<!-- title: Your Post Title -->
<!-- date: 2026-03-27 -->
<!-- tags: Tax, Compliance, Advisory -->
<!-- description: A brief summary of the article for social preview and cards. -->

# Your Post Title

Write your markdown content here...
```

3. Rebuild the site:

```bash
python build.py
```

The script will generate the HTML page, format publish dates, escape metadata attributes, update `blog/index.html`, and update `sitemap.xml`.

---

## Project Structure

```
├── .dockerignore        # Excludes .git and cache from Docker builds
├── Dockerfile           # Multi-stage Python builder + Nginx static server
├── README.md            # Project documentation and setup guide
├── build.py             # Static blog generator and sitemap builder
├── index.html           # Main landing page & services catalogue
├── requirements.txt     # Python dependencies (markdown)
├── robots.txt           # Search engine crawler directives
├── sitemap.xml          # XML sitemap for SEO indexation
├── blog/
│   ├── blog.css         # Styles for blog listing and post views
│   ├── blog.js          # Shared blog scripts (canvas, navbar, menu)
│   ├── index.html       # Generated blog listing page
│   ├── *.html           # Generated blog post pages
│   └── posts/           # Source Markdown files
├── css/
│   ├── style.css        # Main stylesheet (themes, layout, animations)
│   └── style.scss       # SCSS source stylesheet
├── fonts/               # Webfonts (Nunito, FontAwesome) and favicon
├── js/
│   └── script.js        # Main interactivity, canvas, accordions
└── nri-property-sale-checker/
    ├── index.html       # NRI Property Sale Checker tool UI
    ├── style.css        # Responsive dark theme & print styles
    ├── app.js           # Deterministic calculation engine & client logic
    └── rules/           # Income-tax Act rules (1961 & 2026-27 JSON)
```

---

## License

All rights reserved &copy; 2026 Hemanth Narra.
