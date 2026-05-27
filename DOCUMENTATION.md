# Bermiotarra - Bermeo Dialect Dictionary

## Overview

Bermiotarra is a digital dictionary project preserving the **Bermeo Basque dialect** (bermeotarra), based on Begoña Bilbao Alboniga's work *"Bermeoko berba eta esamolde kresaltsuak"* (2002), with additional content from Joseba Mikel Ugalde's *"Ai gure Bermio: esakerak eta izakerak"* and notes by Jose Anton Renteria Anduiza.

The live version is at **https://bermiotarra.zital.eus**.

## Project Structure

```
bermiotarra/
├── BEGONA.md                 # Foreword by Begoña Bilbao Alboniga (Basque)
├── README.md                 # Project description and acknowledgments (Basque)
├── DOCUMENTATION.md          # This file
├── berbak-esamoldiek/        # Core dictionary data — one Markdown file per letter
│   ├── a.md .. z.md          # Words and expressions in Bermeo Basque
├── bibliografia/             # Reference PDFs (10 academic works)
├── bot/                      # Mastodon social media bot
│   ├── bot.py                # Posts random dictionary entries daily
│   ├── bot.cache             # Cache of previously posted entries
│   └── mastodon.json         # Instance URL + access token
├── docker/                   # Containerization (Podman/Docker)
│   ├── docker-compose.yml    # 3 services: python, deno, caddy
│   ├── caddy/                # Caddy reverse proxy config
│   ├── deno/                 # Deno container for search API
│   ├── node/                 # Optional Node.js container
│   └── python/               # Python container for bot & PDF/EPUB generation
├── docs/                     # Permission documents
├── scripts/                  # Utility scripts
│   ├── bash/bot.sh           # Shell script to run bot via Podman
│   └── python/md2wiki.py     # Converts Markdown to MediaWiki format
├── deploy.sh                 # Build & deploy script
└── web/
    ├── private/              # TypeScript application source
    │   ├── lib/
    │   │   ├── build.ts      # Markdown → HTML, index generation, PDF/EPUB export
    │   │   ├── search.ts     # Full-text search with JSDOM + regex + <mark> highlighting
    │   │   ├── server.ts     # URL parsing, response writing, template loading
    │   │   ├── view.ts       # JST template engine (eval-based backtick literals)
    │   │   ├── constants.ts  # Site constants (URLs, title, description)
    │   │   └── interfaces.ts # Generic types
    │   ├── templates/        # JST template files
    │   │   ├── header.jst    # HTML <head> + opening <body>
    │   │   ├── footer.jst    # Download links + closing HTML
    │   │   ├── search.jst    # Search form
    │   │   └── index.jst     # Alphabetical index
    │   ├── server.ts         # HTTP server entry point (port 8080, /search route)
    │   ├── build.ts          # Build entry point
    │   ├── search.ts         # CLI search script
    │   ├── build.py          # Python script for PDF + EPUB generation via Pandoc
    │   ├── package.json      # Dependencies: jsdom, @vercel/ncc, typescript
    │   └── tsconfig.json     # TypeScript strict mode config
    └── public/               # Generated static site
        ├── index.html        # Homepage with alphabetical index
        ├── robots.txt
        └── resources/
            ├── css/
            │   ├── reset.css             # Meyerweb CSS reset
            │   └── bermiotarra.css       # Main stylesheet (responsive, custom fonts)
            └── img/
                ├── favicon.png
                ├── pdf.jpg / .webp / .avif       # PDF download buttons
                ├── epub.jpg / .webp / .avif      # EPUB download buttons
                └── github.jpg / .webp / .avif    # GitHub link buttons
```

## Features

- **Digital lexicon** — Thousands of Bermeo Basque words, expressions, and example sentences in context
- **Static HTML site** — Fully generated, no server-side rendering for pages; fast and cacheable
- **Full-text search** — Server-side search (Deno/Node.js) with regex matching and `<mark>` highlighting
- **Multi-format export** — HTML, PDF, EPUB, and MediaWiki formats
- **Mastodon bot** — Posts a random word entry as an image daily (weekdays at 11:00)
- **Containerized deployment** — Docker/Podman with Caddy reverse proxy
- **Alphabetical index** — Browseable by letter from the homepage

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Data storage | Markdown (`.md`), one file per letter |
| Build system | TypeScript + `@vercel/ncc` |
| Markdown → HTML | Pandoc |
| Search engine | TypeScript + JSDOM (regex search, `<mark>` highlighting) |
| Template engine | Custom JST (eval-based backtick template literals) |
| Frontend | Static HTML + CSS (responsive, custom webfonts) |
| PDF/EPUB export | Pandoc + LaTeX (via `build.py`) |
| HTTP server | Node.js `http` module (port 8080) |
| Reverse proxy | Caddy 2 (static files + `/search` proxy) |
| Containers | Docker / Podman |
| Social bot | Python 3 + Mastodon.py + Pillow + ImageMagick |

## Technical Implementation

### Web Application

The web application is built with TypeScript and Node.js:

- **Build System** (`build.ts`): Reads Markdown files, adjusts heading levels (`#` → `##` → `###`), converts to HTML via Pandoc, wraps in header/footer templates, adds anchor links to word headings, and generates an alphabetical index page
- **Search Server** (`server.ts` + `lib/search.ts`): HTTP server on port 8080 with a single route `/search?q=<query>`. Parses generated HTML pages, splits content by `<h3>` word groups, performs regex search, wraps matches in `<mark>` tags, and returns full HTML pages
- **Template Engine** (`lib/view.ts`): Eval-based JST rendering — templates are JavaScript backtick template literals evaluated at runtime with values injected from a context object
- **Constants** (`lib/constants.ts`): Site-wide configuration (URLs, metadata, header text)

### Search Functionality

- Parses all generated HTML pages in `web/public/berbak-esamoldiek/`
- Splits content into word groups separated by `<h3>` headings
- Applies regex search across the entire group content
- Wraps matching terms in `<mark>` tags for visual highlighting
- Returns complete HTML response wrapped in the site template

### Build Process

1. Markdown files from `berbak-esamoldiek/` are read and processed
2. Heading levels are adjusted (`#` → `##`, `##` → `###`) for proper HTML document structure
3. Files are converted to HTML5 via Pandoc
4. Each page is wrapped in header (`header.jst`) and footer (`footer.jst`) templates
5. Anchor links are added to all word headings (`<h3 id="word">`)
6. An index page (`index.html`) is generated linking to each letter page
7. PDF and EPUB versions can be generated via `build.py` (Python + Pandoc + LaTeX)

### Frontend

- Custom typography: **Cormorant Garamond** (headings) and **Open Sans Condensed** (body)
- Clean, responsive design with a background image of a vintage map of Bermeo
- Download buttons for PDF and EPUB versions, plus a link to the GitHub repository
- All images available in modern formats (WebP, AVIF) with JPEG fallbacks

### Mastodon Bot

- Located in `bot/bot.py`
- Picks a random dictionary entry not yet posted (tracked via `bot.cache` — SHA256 hashes)
- Generates a Markdown document → converts to PDF via Pandoc → converts to PNG via ImageMagick
- Adds a watermark URL to the image
- Posts to Mastodon with a caption
- Designed to run via cron: `0 11 * * 1-5` (weekdays at 11:00)

### Multi-Format Export

- **HTML** — Generated static site
- **PDF** — Via Pandoc + LaTeX
- **EPUB** — Via Pandoc
- **MediaWiki** — Via `scripts/python/md2wiki.py` (converts Markdown dictionary entries to MediaWiki syntax)

## Installation & Setup

### Prerequisites

- Node.js 18+
- Pandoc
- Deno (for containerized search server)
- Docker / Podman (optional, for containerized deployment)
- Basic Unix toolset

### Setup Steps

```bash
git clone <repository-url>
cd bermiotarra

# Install web dependencies
cd web/private
npm install
cd ../..

# Install bot dependencies (optional)
cd bot
pip3 install -U Mastodon.py Pillow
cd ..
```

### Building the Project

```bash
./deploy.sh build
```

This will:
1. Compile TypeScript sources with `@vercel/ncc`
2. Process Markdown files from `berbak-esamoldiek/`
3. Generate HTML files in `web/public/berbak-esamoldiek/`
4. Create the main index page at `web/public/index.html`

### Running the Search Server

```bash
cd web/private
node dist/server.js
```

The server listens on port 8080. Search queries go to `http://localhost:8080/search?q=<query>`.

### Running the Mastodon Bot

See `bot/README.md` for detailed setup. Configure `bot/mastodon.json` with your Mastodon instance URL and access token, then run:

```bash
cd bot
python3 bot.py
```

For automated daily posting, add a cron job:
```
0 11 * * 1-5 /path/to/scripts/bash/bot.sh
```

## Docker / Podman

The project includes Docker configurations for running all services.

### Setup

```bash
docker network create bermiotarra
cd docker
docker compose up -d
```

### Services

| Service | Image | Purpose |
|---------|-------|---------|
| python | python:3.12.10-alpine3.22 | Bot, PDF/EPUB generation (ImageMagick, Ghostscript, Pandoc, TeX Live) |
| deno | denoland/deno:alpine-2.7.9 | Search API server (port 8080) |
| caddy | caddy:2-alpine | Reverse proxy (port 8002 → container port 80) |
| node | node:24.1.0-alpine3.21 | Optional Node.js container |

### Caddy Configuration

The Caddyfile proxies search requests to the Deno backend:
```
/search → http://deno:8080/search
```

Static files are served directly from `/app/web/public`.

Access the application at `http://localhost:8002` after starting the containers.

## License & Copyright

- **Source code**: GPL 3.0
- **Begoña Bilbao Alboniga's work**: All rights reserved (original source material)
- **Joseba Mikel Ugalde's contributions**: Creative Commons CC-BY-NC-SA

The project is open source and copyright-insubmissive in spirit. Community contributions are welcome.

## Online Access

**https://bermiotarra.zital.eus**

## Contributing

Contributions are welcome for:
- Technical improvements to the web interface and search
- Additional linguistic research and dictionary entries
- Bug fixes
- Documentation enhancements

The dictionary architecture is designed to be reusable for other dialect preservation projects.

## References

See `bibliografia/` for reference materials:
- *Bermeoko berba eta esamolde kresaltsuak* (Begoña Bilbao Alboniga 2002)
- *Bermeoko arraintzaleen leksikua* (1963)
- *Bermeo eta Mundakako arrantzaleen hiztegia* (Eneko Barrutia Etxebarria 1995)
- *Ai gure Bermio* (Joseba Mikel Ugalde)
- *Bermeoko gazteen euskararen aditz morfologia*
- *Gramatika eta hizkuntz bariazioa Bermeon* (Iñaki Gaminde, Asier Romero, Hiart Legarra 2012)
- *Bermioko ezizenak*
- *Tonuak gazteen testu irakurrietan*
- *1925 oroigarriak* (Tellaetxe Rortuzar)
- *Bermeo eta Mundaka*

---

*Documentation maintained as part of the Bermiotarra project*
