#!/bin/sh

mkdir ./build

now=$(date)
buildfile="./build/Ellipsis.js"

echo "// Build date: $now" > "$buildfile"
echo '' >> "$buildfile"

cat EllipsisApi.js >> "$buildfile"
echo '' >> "$buildfile"

cat EllipsisVectorLayer.js >> "$buildfile"
echo '' >> "$buildfile"

cat EllipsisRasterLayer.js >> "$buildfile"
echo '' >> "$buildfile"

cat Ellipsis.js >> "$buildfile"