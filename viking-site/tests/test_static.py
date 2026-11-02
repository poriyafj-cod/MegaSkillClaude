"""Dependency-free integrity checks for the public Viking Offroad website.

These tests guard the contract that makes the page safe to publish: fully local
assets, RTL Persian document semantics, accessible controls, resolvable
anchors/ARIA targets, valid JSON-LD, valid Vercel config, and no secrets.
They never launch a browser; visual review stays a separate, manual step.
"""
from __future__ import annotations

import json
import re
import unittest
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
CSS = (ROOT / "styles.css").read_text(encoding="utf-8")
JS = (ROOT / "app.js").read_text(encoding="utf-8")
VERCEL = json.loads((ROOT / "vercel.json").read_text(encoding="utf-8"))

BRAND_TOKENS = ("#F39A2B", "#141414", "#FFD9A8")
SECRET_PATTERNS = (
    re.compile(r"\bsb_secret_[A-Za-z0-9_-]{20,}\b"),
    re.compile(r"\bservice_role\b\s*[:=]"),
    re.compile(r"\bgh[pousr]_[A-Za-z0-9_]{20,}\b"),
    re.compile(r"\bAKIA[0-9A-Z]{16}\b"),
    re.compile(r"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----"),
)
SITE_FILES = ("index.html", "styles.css", "app.js", "vercel.json")


class Document(HTMLParser):
    """Collects the structure the tests need without third-party packages."""

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.ids: list[str] = []
        self.tags: list[tuple[str, dict[str, str | None]]] = []
        self.anchors: list[str] = []
        self.aria_refs: list[tuple[str, str]] = []
        self.implicitly_labelled: list[str] = []
        self._label_depth = 0

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        self.tags.append((tag, values))
        if values.get("id"):
            self.ids.append(values["id"])
        if self._label_depth and tag in {"input", "select", "textarea"} and values.get("id"):
            self.implicitly_labelled.append(values["id"])
        if tag == "label":
            self._label_depth += 1
        href = values.get("href") or ""
        if href.startswith("#") and len(href) > 1:
            self.anchors.append(href[1:])
        for attribute in ("aria-controls", "aria-labelledby", "aria-describedby"):
            if values.get(attribute):
                for token in values[attribute].split():
                    self.aria_refs.append((attribute, token))

    def handle_startendtag(self, tag, attrs):  # <img ... /> style markup
        self.handle_starttag(tag, attrs)

    def handle_endtag(self, tag):
        if tag == "label":
            self._label_depth = max(0, self._label_depth - 1)


def asset_reference_exists(reference: str) -> bool:
    path = unquote(urlsplit(reference).path)
    return (ROOT / path).is_file()


class DocumentContractTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.document = Document()
        cls.document.feed(HTML)
        cls.by_tag: dict[str, list[dict[str, str | None]]] = {}
        for tag, attrs in cls.document.tags:
            cls.by_tag.setdefault(tag, []).append(attrs)

    def test_persian_rtl_document_semantics(self):
        html_tag = self.by_tag["html"][0]
        self.assertEqual(html_tag.get("lang"), "fa")
        self.assertEqual(html_tag.get("dir"), "rtl")
        self.assertEqual(len(self.by_tag["h1"]), 1, "a landing page needs exactly one h1")
        self.assertIn('name="viewport"', HTML)
        self.assertIn("width=device-width", HTML)

    def test_ids_are_unique_and_every_in_page_anchor_resolves(self):
        self.assertEqual(len(self.document.ids), len(set(self.document.ids)), "duplicate ids")
        missing = sorted({anchor for anchor in self.document.anchors if anchor not in self.document.ids})
        self.assertFalse(missing, f"anchors without a target: {missing}")

    def test_aria_references_resolve(self):
        known = set(self.document.ids)
        missing = sorted({token for _, token in self.document.aria_refs if token not in known})
        self.assertFalse(missing, f"dangling ARIA references: {missing}")

    def test_all_local_assets_exist(self):
        references: set[str] = set()
        candidates = (
            self.by_tag.get("img", [])
            + self.by_tag.get("source", [])
            + self.by_tag.get("link", [])
            + self.by_tag.get("script", [])
        )
        for attrs in candidates:
            for key in ("src", "href"):
                value = attrs.get(key)
                if value and not value.startswith(("http", "mailto:", "#", "data:")):
                    references.add(value)
            srcset = attrs.get("srcset") or attrs.get("imagesrcset")
            if srcset:
                references.update(part.strip().split(" ")[0] for part in srcset.split(",") if part.strip())
        missing = sorted(reference for reference in references if not asset_reference_exists(reference))
        self.assertFalse(missing, f"missing local assets: {missing}")

    def test_no_remote_asset_or_font_dependency(self):
        self.assertNotRegex(HTML, r"https://fonts\.(googleapis|gstatic)\.com")
        self.assertNotRegex(CSS, r"@import\s+url\(['\"]?https?://")
        self.assertNotRegex(CSS, r"url\(['\"]?https?://")
        for attrs in self.by_tag.get("img", []) + self.by_tag.get("source", []):
            src = attrs.get("src") or attrs.get("srcset") or ""
            self.assertNotRegex(src, r"^https?://", "images must be served from the repository")
        self.assertIn("url('assets/fonts/Vazirmatn-Regular.woff2')", CSS)
        self.assertIn("url('assets/fonts/Lalezar.woff2')", CSS)

    def test_images_declare_dimensions_and_alt_text(self):
        images = self.by_tag.get("img", [])
        self.assertGreaterEqual(len(images), 8)
        for attrs in images:
            self.assertIn("alt", attrs, f"img without alt: {attrs.get('src')}")
            self.assertIn("width", attrs, f"img without width: {attrs.get('src')}")
            self.assertIn("height", attrs, f"img without height: {attrs.get('src')}")
        # the LCP hero image must not be lazy-loaded
        hero = next(attrs for attrs in images if "hero-1600" in str(attrs.get("src")))
        self.assertNotIn("loading", hero)
        self.assertEqual(hero.get("fetchpriority"), "high")

    def test_forms_are_labelled_and_keyboard_reachable(self):
        labels = {attrs.get("for") for attrs in self.by_tag.get("label", [])}
        labels |= set(self.document.implicitly_labelled)
        labels.discard(None)
        controls = {
            attrs.get("id")
            for attrs in self.by_tag.get("input", []) + self.by_tag.get("select", []) + self.by_tag.get("textarea", [])
            if attrs.get("type") != "hidden"
        }
        self.assertFalse(controls - labels, f"unlabelled controls: {controls - labels}")
        self.assertIn('type="submit"', HTML)

    def test_interactive_buttons_are_typed(self):
        buttons = self.by_tag.get("button", [])
        self.assertTrue(buttons)
        for attrs in buttons:
            self.assertIn(attrs.get("type"), {"button", "submit", "reset"}, f"button without type: {attrs}")

    def test_reduced_motion_and_responsive_rules_exist(self):
        self.assertIn("prefers-reduced-motion: reduce", CSS)
        for width in ("1180px", "1080px", "900px", "760px"):
            self.assertIn(f"max-width: {width}", CSS)
        self.assertIn("--container", CSS)
        self.assertIn("scroll-behavior: smooth", CSS)

    def test_brand_palette_and_typography_are_used(self):
        for token in BRAND_TOKENS:
            self.assertIn(token, CSS, f"missing brand colour {token}")
        self.assertIn("Lalezar", CSS)
        self.assertIn("Vazirmatn", CSS)
        # the brand must be a real link whose accessible name carries the visible wordmark
        self.assertIn('class="brand" href="#home"', HTML)
        self.assertIn('class="brand__fa">وایکینگ آفرود</span>', HTML)
        self.assertIn('<span class="brand__en" lang="en" dir="ltr">VIKING OFFROAD</span>', HTML)

    def test_manifest_and_theme_metadata_are_linked(self):
        self.assertIn('rel="manifest" href="manifest.webmanifest"', HTML)
        self.assertIn('name="theme-color"', HTML)
        self.assertIn('name="color-scheme" content="dark"', HTML)

    def test_structured_data_is_valid_json(self):
        blocks = re.findall(r'<script type="application/ld\+json">(.*?)</script>', HTML, re.S)
        self.assertEqual(len(blocks), 1)
        data = json.loads(blocks[0])
        self.assertEqual(data["@type"], "TravelAgency")
        self.assertIn("Viking Offroad", data["alternateName"])

    def test_javascript_query_targets_exist_in_markup(self):
        id_targets = set(re.findall(r"\$\('#([a-zA-Z0-9_-]+)'", JS))
        known = set(self.document.ids)
        self.assertFalse(id_targets - known, f"JS targets missing from markup: {id_targets - known}")
        self.assertIn("--parallax", JS)
        for dataset in ("dataset.book", "dataset.filter", "dataset.policy", "dataset.category"):
            self.assertIn(dataset, JS)


class ConfigurationTests(unittest.TestCase):
    def test_vercel_static_configuration_is_safe(self):
        self.assertTrue(VERCEL.get("cleanUrls"))
        header_keys = {
            item["key"]
            for rule in VERCEL.get("headers", [])
            for item in rule.get("headers", [])
        }
        self.assertIn("X-Content-Type-Options", header_keys)
        self.assertIn("Referrer-Policy", header_keys)
        self.assertIn("Permissions-Policy", header_keys)
        self.assertFalse(VERCEL.get("builds"), "the site must stay a dependency-free static deploy")

    def test_no_secret_material_in_public_site_files(self):
        for name in SITE_FILES:
            text = (ROOT / name).read_text(encoding="utf-8")
            for pattern in SECRET_PATTERNS:
                self.assertIsNone(pattern.search(text), f"possible secret in {name}: {pattern.pattern}")

    def test_license_for_bundled_fonts_is_present(self):
        self.assertTrue((ROOT / "assets/fonts/OFL.txt").is_file())

    def test_pwa_manifest_is_valid_and_its_icons_exist(self):
        manifest = json.loads((ROOT / "manifest.webmanifest").read_text(encoding="utf-8"))
        self.assertEqual(manifest["lang"], "fa")
        self.assertEqual(manifest["dir"], "rtl")
        self.assertEqual(manifest["display"], "standalone")
        self.assertEqual(manifest["start_url"], "/")
        self.assertEqual(manifest["theme_color"].upper(), "#0A0A09")
        self.assertTrue(manifest["icons"])
        for icon in manifest["icons"]:
            self.assertTrue((ROOT / icon["src"]).is_file(), f"missing icon {icon['src']}")
            self.assertRegex(icon["sizes"], r"^\d+x\d+$")

    def test_crawlability_files_are_present_and_consistent(self):
        robots = (ROOT / "robots.txt").read_text(encoding="utf-8")
        sitemap = (ROOT / "sitemap.xml").read_text(encoding="utf-8")
        self.assertIn("Sitemap: https://viking-offroad.vercel.app/sitemap.xml", robots)
        self.assertIn("<loc>https://viking-offroad.vercel.app/</loc>", sitemap)
        self.assertIn('href="https://viking-offroad.vercel.app/"', HTML)

    def test_content_security_policy_matches_the_inline_bootstrap_hash(self):
        import base64
        import hashlib

        inline = re.search(r"<script>(.*?)</script>", HTML, re.S)
        self.assertIsNotNone(inline, "expected the single inline bootstrap script")
        digest = base64.b64encode(hashlib.sha256(inline.group(1).encode("utf-8")).digest()).decode()
        csp = next(
            item["value"]
            for rule in VERCEL["headers"]
            for item in rule["headers"]
            if item["key"] == "Content-Security-Policy"
        )
        self.assertIn(f"sha256-{digest}", csp, "CSP script hash is stale after editing the inline script")
        self.assertNotIn("'unsafe-eval'", csp)
        self.assertIn("object-src 'none'", csp)


if __name__ == "__main__":
    unittest.main()
