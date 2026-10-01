#!/usr/bin/env python3
"""
check-links.py — static site integrity check for the Divine Ayurvedic site.

Dependency-free. Standard library only.

Usage:
    python tools/check-links.py            # check the whole site
    python tools/check-links.py --quiet    # only report problems

Checks performed:
  * every internal href/src resolves to a file that exists
  * every fragment (#id) has a matching id or name on the target page
  * every <img> has an alt attribute
  * no duplicate id attributes within a page
  * exactly one <h1> per page
  * <title> and meta description present and within sensible length
  * <html lang> present
  * every aria-controls / aria-labelledby / aria-describedby target exists
  * every content page has exactly one canonical and one nav aria-current

Exit code is 1 if any ERROR-level problem is found.
"""

from __future__ import annotations

import argparse
import html.parser
import os
import re
import sys
from collections import defaultdict
from urllib.parse import urlparse, unquote

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

SKIP_SCHEMES = ("http://", "https://", "mailto:", "tel:", "javascript:", "data:", "#")

CONTENT_PAGES = (
    "index.html",
    "about.html",
    "courses.html",
    "admissions.html",
    "contact.html",
)

# Error pages carry different obligations: they must be noindex, must NOT
# declare a canonical (there is no correct canonical for a missing page),
# and have no nav page to mark as current.
ERROR_PAGES = ("404.html",)


class PageParser(html.parser.HTMLParser):
    """Collects the bits of each page we need to verify."""

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.ids: list[str] = []
        self.links: list[str] = []          # href + src, in document order
        self.imgs_without_alt: list[str] = []
        self.h1_count = 0
        self.title = ""
        self.description = ""
        self.lang = ""
        self.canonicals: list[str] = []
        self.robots = ""
        self.aria_refs: list[str] = []
        self.current_page = ""              # filled in by the walk
        self._in_title = False
        self._in_desc = False

    # -- attribute helpers ------------------------------------------------
    def _attr(self, tag: str, key: str) -> str | None:
        value = self.getattr(tag, key, None)
        return value if isinstance(value, str) else None

    def handle_starttag(self, tag: str, attrs) -> None:
        a = {k.lower(): (v if v is not None else "") for k, v in attrs}

        if tag == "html":
            self.lang = a.get("lang", "")

        if tag == "a" and a.get("href"):
            self.links.append(a["href"])
            if a.get("aria-current"):
                pass
        elif tag == "link" and a.get("href"):
            self.links.append(a["href"])
            if "canonical" in a.get("rel", "").lower():
                self.canonicals.append(a["href"])
        elif tag == "script" and a.get("src"):
            self.links.append(a["src"])
        elif tag in ("img", "source", "iframe", "video") and a.get("src"):
            self.links.append(a["src"])

        if tag == "img" and "alt" not in a:
            self.imgs_without_alt.append(a.get("src", "(no src)"))

        if tag == "h1":
            self.h1_count += 1

        if tag == "title":
            self._in_title = True
        elif tag == "meta" and a.get("name", "").lower() == "description":
            self._in_desc = True
            self.description = a.get("content", "")
        elif tag == "meta" and a.get("name", "").lower() == "robots":
            self.robots = a.get("content", "")

        for key in ("aria-controls", "aria-labelledby", "aria-describedby"):
            if a.get(key):
                self.aria_refs.extend(a[key].split())

        if a.get("id"):
            self.ids.append(a["id"])
        if tag == "a" and a.get("name"):
            self.ids.append(a["name"])

    def handle_endtag(self, tag: str) -> None:
        if tag == "title":
            self._in_title = False
        elif tag == "meta":
            self._in_desc = False

    def handle_data(self, data: str) -> None:
        if self._in_title:
            self.title += data.strip()


def parse_page(rel_path: str) -> PageParser:
    parser = PageParser()
    parser.current_page = rel_path
    with open(os.path.join(ROOT, rel_path), encoding="utf-8") as handle:
        raw = handle.read()
    parser.feed(raw)
    parser.close()
    return parser


def find_html_files() -> list[str]:
    found = []
    for dirpath, _dirnames, filenames in os.walk(ROOT):
        for name in filenames:
            if name.endswith(".html"):
                full = os.path.join(dirpath, name)
                found.append(os.path.relpath(full, ROOT).replace("\\", "/"))
    return sorted(found)


class Report:
    def __init__(self) -> None:
        self.errors: list[tuple[str, str]] = []
        self.warnings: list[tuple[str, str]] = []
        self.info: list[tuple[str, str]] = []

    def error(self, page: str, msg: str) -> None:
        self.errors.append((page, msg))

    def warn(self, page: str, msg: str) -> None:
        self.warnings.append((page, msg))

    def note(self, page: str, msg: str) -> None:
        self.info.append((page, msg))


def robots_directive(p: PageParser) -> str:
    return p.robots


def is_external(url: str) -> bool:
    return url.startswith(SKIP_SCHEMES) and not url.startswith("#")


def check() -> Report:
    report = Report()
    pages = find_html_files()

    if not pages:
        report.error("(site)", "No HTML files found.")
        return report

    # Pass 1 — parse every page and gather fragment targets.
    parsed: dict[str, PageParser] = {}
    id_map: dict[str, set[str]] = defaultdict(set)

    for page in pages:
        parser = parse_page(page)
        parsed[page] = parser
        id_map[page] = set(parser.ids)

    # Pass 2 — per-page structural checks.
    for page in pages:
        p = parsed[page]

        duplicates = {i for i in p.ids if p.ids.count(i) > 1}
        for dup in sorted(duplicates):
            report.error(page, f"Duplicate id attribute: id=\"{dup}\"")

        for src in p.imgs_without_alt:
            report.error(page, f"<img> is missing an alt attribute: {src}")

        if p.h1_count != 1:
            report.error(page, f"Expected exactly 1 <h1>, found {p.h1_count}.")

        if not p.lang:
            report.error(page, "<html> has no lang attribute.")

        if not p.title:
            report.error(page, "Missing <title>.")
        elif len(p.title) > 70:
            report.warn(page, f"<title> is {len(p.title)} chars (over ~70, may truncate in results).")

        if not p.description:
            report.error(page, "Missing meta description.")
        elif len(p.description) > 185:
            report.warn(page, f"meta description is {len(p.description)} chars (over ~185).")

        if page in CONTENT_PAGES:
            if len(p.canonicals) != 1:
                report.error(page, f"Expected exactly 1 canonical link, found {len(p.canonicals)}.")
            current = len(re.findall(r'aria-current\s*=\s*"page"', open(
                os.path.join(ROOT, page), encoding="utf-8").read()))
            if current != 1:
                report.warn(page, f"Expected 1 nav link with aria-current=\"page\", found {current}.")

        if page in ERROR_PAGES:
            if p.canonicals:
                report.error(page, "Error pages must not declare a canonical link.")
            if "noindex" not in robots_directive(p).lower():
                report.error(page, "Error page must carry a noindex robots directive.")

        for ref in p.aria_refs:
            if ref not in p.ids:
                report.error(page, f"aria reference points to missing id: \"{ref}\"")

    # Pass 3 — resolve every internal link and asset.
    for page in pages:
        for raw in parsed[page].links:
            url = raw.strip()
            if not url or is_external(url):
                continue

            parsed_url = urlparse(url)
            target_file = unquote(parsed_url.path)
            fragment = unquote(parsed_url.fragment)

            if not target_file:
                # Same-page fragment, e.g. href="#apply"
                target_page = page
            else:
                if parsed_url.scheme in ("http", "https"):
                    continue
                target_page = os.path.normpath(
                    os.path.join(os.path.dirname(page), target_file)
                ).replace("\\", "/")
                if not os.path.exists(os.path.join(ROOT, target_page)):
                    report.error(page, f"Broken link: {url}  (no such file: {target_page})")
                    continue

            if fragment:
                if target_page not in parsed:
                    if target_page.endswith(".html"):
                        report.warn(page, f"Cannot verify fragment (page not parsed): {url}")
                    continue
                if fragment not in id_map.get(target_page, set()):
                    report.error(page, f"Broken anchor: {url}  (no id=\"{fragment}\" on {target_page})")

    return report


def main() -> int:
    parser = argparse.ArgumentParser(description="Check the site for broken links and markup errors.")
    parser.add_argument("--quiet", action="store_true", help="only print problems")
    args = parser.parse_args()

    print(f"Checking site at {ROOT}\n")
    report = check()

    pages = find_html_files()

    if not args.quiet and report.info:
        for page, msg in report.info:
            print(f"  note  {page}: {msg}")

    if report.warnings:
        print(f"WARNINGS ({len(report.warnings)})")
        for page, msg in report.warnings:
            print(f"  warn  {page}: {msg}")
        print()

    if report.errors:
        print(f"ERRORS ({len(report.errors)})")
        for page, msg in report.errors:
            print(f"  FAIL  {page}: {msg}")
        print()
        print(f"FAILED — {len(report.errors)} error(s), {len(report.warnings)} warning(s)")
        return 1

    print(f"PASSED — {len(pages)} pages checked, 0 errors, {len(report.warnings)} warning(s)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
