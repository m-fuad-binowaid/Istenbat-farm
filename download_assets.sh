#!/bin/bash
set -e
mkdir -p public/assets

files=(
  "flora11.jpg"
  "fruitsvegies10.jpg"
  "fruitsvegies02.jpg"
  "fruitsvegies05.jpg"
  "prod01a.png"
  "prod17a.png"
  "prod18a.png"
  "prod11a.png"
  "prod02a.png"
  "prod03a.png"
  "prod04a.png"
  "visitor03.jpg"
  "visitor06.jpg"
  "fauna08.jpg"
  "visitor11.jpg"
  "visitor01.jpg"
  "visitor04.jpg"
  "flora01.jpg"
  "flora06.jpg"
  "slider01.jpg"
  "slider02.jpg"
  "slider03.jpg"
)

for f in "${files[@]}"; do
  echo "Downloading $f..."
  curl -s --max-time 15 -o "public/assets/$f" "https://www.istenbat.com.sa/img/bg-img/$f" || true
done

ls -lh public/assets
