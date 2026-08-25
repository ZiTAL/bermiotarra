#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""Publish a randomly selected entry as an image using Pandoc and WeasyPrint."""

import json
import random
import re
import shutil
import subprocess
import sys
import tempfile
from hashlib import md5
from pathlib import Path
from time import sleep

from mastodon import Mastodon
from PIL import Image, ImageDraw, ImageFont


BOT_DIR = Path(__file__).resolve().parent
RESOURCE_DIR = BOT_DIR.parent / "berbak-esamoldiek"
FONT_PATH = BOT_DIR / "UniversCondensed.ttf"
MASTODON_CONFIG_PATH = BOT_DIR / "mastodon.json"

PAGE_SIZE = "1080px 1500px"
PAGE_MARGIN = "80px"
BODY_FONT_SIZE = "38pt"
HEADING_FONT_SIZE = "45pt"
WATERMARK_FONT_SIZE = 40
WATERMARK = "https://bermiotarra.zital.eus"
POST_DELAY_SECONDS = 15

ENTRY_PATTERN = re.compile(r"^#\s([^#]+)\s#")
HTML_TEMPLATE = """<!doctype html>
<html><head><meta charset="utf-8"><style>
@page { size: %(page_size)s; margin: %(page_margin)s; }
body { font-family: "DejaVu Sans", sans-serif; font-size: %(body_font_size)s; line-height: 1.2; }
h2 { font-size: %(heading_font_size)s; line-height: 1.2; margin: 0 0 0.5em; }
</style></head><body>%(content)s</body></html>"""


def load_resources(resource_dir: Path) -> list[dict[str, str]]:
    """Load Markdown entries, keeping the text between consecutive headings."""
    resources: list[dict[str, str]] = []
    current: dict[str, str] | None = None

    for source_path in sorted(resource_dir.glob("*.md")):
        for line in source_path.read_text(encoding="utf-8").splitlines(keepends=True):
            match = ENTRY_PATTERN.search(line)
            if match:
                if current:
                    resources.append(current)

                title = match.group(1)
                current = {
                    "id": md5(title.encode("utf-8")).hexdigest(),
                    "title": title,
                    "desc": "",
                }
            elif current:
                current["desc"] += line

    if current:
        resources.append(current)

    return resources


def require_command(command: str) -> None:
    """Exit with a clear message when a required executable is unavailable."""
    if not shutil.which(command):
        sys.exit(f"Required command not found: {command}")


def render_pdf(markdown: str, work_dir: Path) -> Path:
    """Render Markdown to a PDF through Pandoc HTML and WeasyPrint."""
    markdown_path = work_dir / "entry.md"
    html_path = work_dir / "entry.html"
    pdf_path = work_dir / "entry.pdf"
    markdown_path.write_text(markdown, encoding="utf-8")

    subprocess.run(
        ["pandoc", str(markdown_path), "-f", "markdown", "-t", "html", "-o", str(html_path)],
        check=True,
    )

    content = html_path.read_text(encoding="utf-8")
    html_path.write_text(
        HTML_TEMPLATE
        % {
            "page_size": PAGE_SIZE,
            "page_margin": PAGE_MARGIN,
            "body_font_size": BODY_FONT_SIZE,
            "heading_font_size": HEADING_FONT_SIZE,
            "content": content,
        },
        encoding="utf-8",
    )
    subprocess.run(["weasyprint", str(html_path), str(pdf_path)], check=True)
    return pdf_path


def convert_pdf_to_images(pdf_path: Path) -> list[Path]:
    """Convert every PDF page to a PNG image."""
    image_path = pdf_path.with_suffix(".png")
    subprocess.run(
        ["magick", str(pdf_path), "-background", "white", "-alpha", "remove", str(image_path)],
        check=True,
    )
    return sorted(pdf_path.parent.glob(f"{pdf_path.stem}*.png"))


def add_watermark(image_paths: list[Path]) -> None:
    """Add the site URL to the lower-right corner of each image."""
    font = ImageFont.truetype(str(FONT_PATH), WATERMARK_FONT_SIZE)

    for image_path in image_paths:
        with Image.open(image_path) as source:
            image = source.convert("RGBA")
        try:
            ImageDraw.Draw(image).text(
                (image.width - 30, image.height - 30),
                WATERMARK,
                font=font,
                fill=(0, 0, 0, 255),
                anchor="rs",
            )
            image.save(image_path, "PNG")
        finally:
            image.close()


def post_to_mastodon(entry: dict[str, str], image_paths: list[Path]) -> None:
    """Upload the generated images and publish the entry to Mastodon."""
    config = json.loads(MASTODON_CONFIG_PATH.read_text(encoding="utf-8"))
    mastodon = Mastodon(
        access_token=config["token"],
        api_base_url=config["instance"],
    )

    media_ids = [mastodon.media_post(str(image_path)).id for image_path in image_paths]
    status = (
        f"Egunien berba edo esamolde bat, gaurkuen: {entry['title']}\n\n"
        f"{WATERMARK}\n\n#bermiotarra #zitalbot"
    )
    sleep(POST_DELAY_SECONDS)
    mastodon.status_post(status, visibility="public", media_ids=media_ids)


def main() -> None:
    require_command("pandoc")
    require_command("weasyprint")
    require_command("magick")

    resources = load_resources(RESOURCE_DIR)
    if not resources:
        sys.exit("No resources found.")

    entry = random.choice(resources)
    markdown = f"## {entry['title']} ##\n{entry['desc']}"

    with tempfile.TemporaryDirectory() as temp_dir:
        pdf_path = render_pdf(markdown, Path(temp_dir))
        image_paths = convert_pdf_to_images(pdf_path)
        if not image_paths:
            sys.exit("Could not convert the PDF to PNG.")
        add_watermark(image_paths)
        post_to_mastodon(entry, image_paths)


if __name__ == "__main__":
    main()
