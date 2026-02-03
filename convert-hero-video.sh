#!/usr/bin/env bash
# Convert hero source video to MP4 for broad browser support.
# Requires ffmpeg: https://ffmpeg.org/

set -e
SRC="video/qwer.mov"
OUT="video/hero-bg.mp4"

if ! command -v ffmpeg &>/dev/null; then
  echo "ffmpeg is required. Install from https://ffmpeg.org/"
  exit 1
fi

if [ ! -f "$SRC" ]; then
  echo "Source not found: $SRC"
  exit 1
fi

echo "Converting $SRC -> $OUT ..."
ffmpeg -i "$SRC" -c:v libx264 -movflags +faststart -y "$OUT"
echo "Done. Reload the site to see the hero video."
