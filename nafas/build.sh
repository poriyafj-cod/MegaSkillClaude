#!/bin/sh
# NAFAS — static build for Vercel.
# The site is plain HTML/CSS/JS, so "build" only means: collect the files that
# must be published into ./dist (images, styles, scripts and the pages).
set -eu

rm -rf dist
mkdir -p dist

for page in *.html; do
  cp "$page" dist/
done

cp -R assets dist/assets

# favicon + crawler files
cp assets/favicon.svg dist/favicon.svg 2>/dev/null || true
cp robots.txt sitemap.xml dist/ 2>/dev/null || true

echo "NAFAS build: $(find dist -type f | wc -l) files in dist/"
