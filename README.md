# Palvos Thrive

A digital brand and web design portfolio site. Built with vanilla HTML, CSS, and JavaScript.

## About

Palvos Thrive designs company and personal websites with a focus on SEO, performance, and brand storytelling. Every site is guided by Ikigai: aligning what you love, what you're great at, what the world needs, and what you can be paid for.

## Features

- **Hero section** with full-screen background video (mechanical engine theme)
- **Parallax effect** on scroll for depth
- **Stamp-style reveal animation** for headline and branding
- **Dark overlay** over video for readable text
- **Responsive layout** with mobile menu
- **Sections**: About, Ikigai process, Services, Portfolio, Contact

## Run locally

```bash
# Using Python
python3 -m http.server 8888

# Then open http://localhost:8888
```

## Hero background video

The hero uses `video/hero-bg.mp4` when present; otherwise it falls back to the poster image. To generate the MP4 from your source video (e.g. `video/qwer.mov`), install [ffmpeg](https://ffmpeg.org/) then run:

```bash
ffmpeg -i video/qwer.mov -c:v libx264 -movflags +faststart video/hero-bg.mp4
```

Reload the site after creating `video/hero-bg.mp4` to see the background video in all major browsers.

## Tech

- HTML5
- CSS3 (custom properties, flexbox, grid)
- Vanilla JavaScript
- [Syne](https://fonts.google.com/specimen/Syne) & [DM Sans](https://fonts.google.com/specimen/DM+Sans) fonts

## License

MIT
