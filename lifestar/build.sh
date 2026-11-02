#!/bin/sh
# LIFE STAR — deterministic static build for Vercel (no dependencies).
set -eu
rm -rf dist
mkdir -p dist
for page in *.html; do cp "$page" dist/; done
cp -R assets dist/assets
cp robots.txt sitemap.xml dist/ 2>/dev/null || true
echo "LIFE STAR build: $(find dist -type f | wc -l) files in dist/"
