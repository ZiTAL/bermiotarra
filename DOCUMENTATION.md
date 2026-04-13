# Bermiotarra - Bermeo Dialect Dictionary

## Overview

Bermiotarra is a digital dictionary project preserving the Bermeo Basque dialect (bermeotarra) based on Begoña Bilbao Alboniga's work "Bermeoko berba eta esamolde kresaltsuak" (2002). The project collects and presents unique words, expressions, and linguistic characteristics specific to the Bermeo region.

## Project Structure

```
bermiotarra/
├── BEGONA.md                 # Foreword by Begoña Bilbao Alboniga
├── README.md                 # Project description and acknowledgments
├── berbak-esamoldiek/        # Dictionary entries (a.md through z.md)
│   ├── a.md                  # Words starting with 'a'
│   ├── b.md                  # Words starting with 'b'
│   └── ...                   # Through z.md
├── bibliografia/             # Reference materials (PDF format)
├── bot/                      # Mastodon bot implementation
├── docs/                     # Additional documentation
├── deploy.sh                 # Deployment script
├── scripts/                  # Utility scripts
│   ├── bash/
│   └── python/
└── web/                      # Web application source
    ├── private/              # TypeScript source code
    └── public/               # Generated HTML files
```

## Features

- Comprehensive collection of Bermeo dialect words and expressions
- Web interface for browsing and searching the dictionary
- Automated generation of HTML pages from markdown source
- Mastodon bot for sharing dictionary entries
- Multiple export formats (PDF, EPUB)

## Technical Implementation

### Web Application

The web application is built with TypeScript and Node.js:

- **Build System**: Uses `ncc` (Node.js Compiler Compiler) to bundle TypeScript
- **Markdown Processing**: Converts markdown to HTML using Pandoc
- **Templates**: Uses JsTemplating for HTML templates
- **DOM Manipulation**: Uses JSDOM for adding anchor links to headings

### Build Process

1. Markdown files from `berbak-esamoldiek/` are processed
2. Heading levels are adjusted (## → ###, # → ##) for proper HTML structure
3. Files are converted to HTML using Pandoc
4. HTML pages are generated with header, footer, and navigation
5. An internal index is created linking words to their pages
6. Resources (PDF, EPUB) can be generated via the external build option

### Key Components

- `web/private/lib/build.ts`: Main build logic
- `web/private/lib/constants.ts`: Configuration constants
- `web/private/lib/view.ts`: Template loading functionality
- `web/private/build.ts`: Entry point for the build process
- `deploy.sh`: Deployment script

## Installation & Setup

### Prerequisites

- Node.js (with TypeScript compilation tools)
- Pandoc (for markdown conversion)
- Deno (for command execution in build process)
- Basic Unix toolset (mkdir, rm, etc.)

### Setup Steps

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd bermiotarra
   ```

2. Install dependencies:
   ```bash
   # For the bot (if needed)
   cd bot
   pip3 install -U wheel Mastodon.py Pillow
   cd ..
   
   # For the web application
   cd web/private
   npm install
   cd ../..
   ```

### Building the Project

To generate the HTML website:

```bash
./deploy.sh build
```

This will:
1. Compile TypeScript sources
2. Process markdown files from `berbak-esamoldiek/`
3. Generate HTML files in `web/public/berbak-esamoldiek/`
4. Create the main index page at `web/public/index.html`
5. Generate internal linking data

### Running the Mastodon Bot

See `bot/README.md` for setup instructions:
1. Install required system packages
2. Install Python dependencies
3. Configure Mastodon credentials
4. Set up cron job for automated posting

## License

This project is licensed under the GPL 3.0 license, as stated in the README.md file.

## Acknowledgments

See the README.md file for a complete list of contributors and acknowledgments, including:
- Begoña Bilbao Alboniga for the source material
- Joseba Mikel Ugalde for related works
- Numerous contributors listed in the acknowledgments section
- ZITAL for hosting and technical support

## References

See the `bibliografia/` directory for reference materials including:
- Bermeoko berba eta esamolde kresaltsuak (Begoña Bilbao Alboniga 2002)
- Bermeo eta Mundakako arrantzaleen hiztegia (Eneko Barrutia Etxebarria 1995)
- Ai gure Bermio (Joseba Mikel Ugalde)
- Gramatika eta hitzuntz bariazioa Bermeon (Iñaki Gaminde, Asier Romero eta Hiart Legarra 2012)

## Online Access

The live version of the dictionary is available at:
https://bermiotarra.zital.eus

## Contributing

While this project is primarily based on published work, contributions for:
- Technical improvements to the web interface
- Additional linguistic research
- Bug fixes
- Documentation enhancements

are welcome. Please refer to the project's licensing terms when contributing.

---
*Documentation generated as part of the Bermiotarra project*