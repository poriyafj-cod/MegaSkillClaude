#!/bin/sh
# NIGHTLAB — deterministic static build (no dependencies).
set -eu
cd "$(dirname "$0")"
rm -rf dist
mkdir -p dist
for page in *.html; do cp "$page" dist/; done
cp -R assets dist/assets
cp robots.txt sitemap.xml dist/ 2>/dev/null || true
echo "NIGHTLAB build: $(find dist -type f | wc -l) files in dist/"
