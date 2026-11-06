"""Storefront Studio: the design system, the live-site registry and the router skill stay one contract."""

from __future__ import annotations

import json
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
STUDIO = ROOT / "storefronts"
SKILL = ROOT / "library/skills/storefront-design-system/SKILL.md"
INDEX = ROOT / ".claude/skills/mega-skills-router/references/triggers.json"

LIVE = {
    "nafas": "https://nafas-accessories.vercel.app/",
    "nightlab": "https://nightlab-boutique.vercel.app/",
    "lifestar": "https://lifestar-shop.vercel.app/",
}
REQUIRED_DOCS = [
    "README.md",
    "PROGRESS.md",
    "sites.json",
    "design-system/MASTER.md",
    "design-system/motion-3d.md",
    "design-system/pages/home.md",
    "design-system/pages/shop.md",
    "design-system/pages/product.md",
    "design-system/pages/content-and-contact.md",
    "checklist/release-gates.md",
    "scripts/storefront-check.mjs",
    "tests/storefront-check.test.mjs",
]


class StorefrontStudioTests(unittest.TestCase):
    def setUp(self) -> None:
        self.sites = json.loads((STUDIO / "sites.json").read_text(encoding="utf-8"))
        self.by_id = {site["id"]: site for site in self.sites["sites"]}

    def test_every_design_document_exists_and_is_substantive(self):
        for relative in REQUIRED_DOCS:
            with self.subTest(document=relative):
                path = STUDIO / relative
                self.assertTrue(path.is_file(), f"missing {relative}")
                self.assertGreater(path.stat().st_size, 400, f"{relative} is a stub")

    def test_master_covers_the_pillars_tokens_and_hard_rules(self):
        master = (STUDIO / "design-system/MASTER.md").read_text(encoding="utf-8")
        for anchor in ("هفت ستون", "توکن برند", "--font-display", "prefers-reduced-motion",
                       "JSON-LD", "بودجهٔ کارایی", "Definition of Done", "۳۲۰px"):
            with self.subTest(anchor=anchor):
                self.assertIn(anchor, master)

    def test_live_sites_from_the_user_are_registered_with_real_urls(self):
        for site_id, url in LIVE.items():
            with self.subTest(site=site_id):
                self.assertIn(site_id, self.by_id)
                self.assertEqual(self.by_id[site_id]["live"], url)
                self.assertEqual(self.by_id[site_id]["status"], "live")
                self.assertTrue(self.by_id[site_id]["palette"]["accent"].startswith("#"))
                self.assertTrue(self.by_id[site_id]["signature_modules"])

    def test_unverified_claims_are_marked_as_such(self):
        for site in self.sites["sites"]:
            with self.subTest(site=site["id"]):
                gates = site.get("gates", {})
                self.assertTrue(gates, "every site must record gate evidence")
                self.assertNotEqual(
                    gates.get("live_mobile"), "verified",
                    "no checkout mobile verification exists in this repository yet",
                )
                if not site.get("checkout"):
                    self.assertEqual(gates.get("static"), "pending-clone")

    def test_checked_out_sites_are_directories_that_the_gate_can_audit(self):
        for site in self.sites["sites"]:
            if not site.get("checkout"):
                continue
            with self.subTest(site=site["id"]):
                directory = ROOT / site["checkout"]
                self.assertTrue(directory.is_dir(), f"{site['checkout']} is not a directory")
                self.assertIn(site.get("kind"), {"storefront", "app"})

    def test_router_registers_the_skill_and_counts_stay_consistent(self):
        index = json.loads(INDEX.read_text(encoding="utf-8"))
        names = {skill["name"]: skill for skill in index["skills"]}
        self.assertIn("storefront-design-system", names)
        entry = names["storefront-design-system"]
        self.assertEqual(entry["source_path"], "library/skills/storefront-design-system/SKILL.md")
        self.assertTrue(SKILL.is_file())
        self.assertEqual(index["counts"]["skills"], len(index["skills"]))
        self.assertEqual(
            index["counts"]["triggers"],
            sum(len(skill.get("triggers", [])) for skill in index["skills"]),
        )
        self.assertEqual(
            index["counts"]["routable_skills"],
            index["counts"]["skills"] - index["counts"]["incomplete_skills"],
        )
        pack = [s for s in index["skills"] if s["source_path"].startswith("library/skills/")]
        self.assertEqual(len(pack), 9)
        self.assertEqual(len({s["name"] for s in index["skills"]}), len(index["skills"]))

    def test_documentation_uses_the_current_router_numbers(self):
        index = json.loads(INDEX.read_text(encoding="utf-8"))
        counts = index["counts"]
        expected = (f"{counts['skills']:,}", f"{counts['routable_skills']:,}", f"{counts['triggers']:,}")
        # The bootstrap description is length-sensitive (it is what Claude loads first), so only the
        # three documents that quote the full count table must carry every number.
        for relative in ("plugins/mega-skills-router/README.md", "library/README.md",
                         "docs/directives/08-skills-library-router.md"):
            with self.subTest(document=relative):
                text = (ROOT / relative).read_text(encoding="utf-8")
                for number in expected:
                    self.assertIn(number, text)
                self.assertNotIn("6,019", text)
                self.assertNotIn("5,738", text)

    def test_bootstrap_description_matches_the_index(self):
        index = json.loads(INDEX.read_text(encoding="utf-8"))
        counts = index["counts"]
        text = (ROOT / ".claude/skills/mega-skills-router/SKILL.md").read_text(encoding="utf-8")
        description = next(line for line in text.splitlines() if line.startswith("description:"))
        self.assertIn(f"{counts['skills']:,} skills", description)
        self.assertIn(f"{counts['triggers']:,} contextual triggers", description)
        self.assertIn(f"{counts['incomplete_skills']} incomplete", description)
        self.assertIn("9 curated project skills", description)

    def test_skill_forbids_invented_data_and_requires_evidence(self):
        text = SKILL.read_text(encoding="utf-8")
        for anchor in ("آمار، نظر یا ادعای ساختگی", "reduced-motion", "release-gates.md",
                       "storefronts/sites.json", "تست‌نشده = تأییدنشده"):
            with self.subTest(anchor=anchor):
                self.assertIn(anchor, text)

    def test_release_gates_keep_seven_numbered_gates(self):
        gates = (STUDIO / "checklist/release-gates.md").read_text(encoding="utf-8")
        self.assertEqual(re.findall(r"## گیت ([۰-۹0-9]+)", gates),
                         ["۰", "۱", "۲", "۳", "۴", "۵", "۶"])


if __name__ == "__main__":
    unittest.main()
