#!/bin/bash

# Create tmp/firefox/ and tmp/chrome/ directories if they don't exist
mkdir -p tmp/firefox/
mkdir -p dist/firefox/
cp -r app/ tmp/firefox/
rm -r tmp/firefox/manifest
cp app/manifest/v3/firefox.json tmp/firefox/manifest.json
web-ext build -s tmp/firefox/ -a dist/firefox/ --overwrite-dest
rm -r tmp/firefox/

mkdir -p tmp/chrome/
mkdir -p dist/chrome/
cp -r app/ tmp/chrome/
rm -r tmp/chrome/manifest
cp app/manifest/v3/chrome.json tmp/chrome/manifest.json
web-ext build -s tmp/chrome/ -a dist/chrome/ --overwrite-dest
rm -r tmp/chrome/

rm -r tmp/
