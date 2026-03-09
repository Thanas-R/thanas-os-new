# Contour Flow

![React](https://img.shields.io/badge/React-18-000000?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Build-646CFF?style=flat-square&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Framework-000000?style=flat-square&logo=tailwindcss)
![Canvas](https://img.shields.io/badge/HTML5-Canvas-E34F26?style=flat-square&logo=html5&logoColor=white)
![Status](https://img.shields.io/badge/Status-Experimental-444444?style=flat-square)

Contour Flow is a procedural canvas animation used as a dynamic background for the website.  
It generates flowing topographic-style contour lines in real time using mathematical algorithms rather than images or SVG graphics.

The animation produces an organic drifting motion that resembles a living terrain map, making it suitable for immersive web interfaces.

---

## Tech Stack

| Layer | Technology |
|------|------------|
| Framework | React 18 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS + shadcn/ui |
| Rendering | HTML5 Canvas |
| Routing | React Router v6 |

---

## What It Does

- Generates animated contour lines across the viewport  
- Runs entirely in a single canvas element  
- Supports light and dark themes  
- Adjusts stroke opacity and background color based on theme  
- Adds subtle parallax on mobile using device orientation  
- Produces smooth flowing motion using time-based noise offsets  

---

## How It Works

1. A **Simplex Noise algorithm** generates a two dimensional height field across the viewport.  
2. The height values are sampled on a grid.  
3. **Marching Squares** extracts iso contour line segments at multiple threshold levels.  
4. These segments are stitched together into continuous paths.  
5. Paths are rendered as **Catmull Rom splines** to create smooth organic curves.  
6. The noise field is animated using slow offsets (`flowX`, `flowY`, `breathe`) which creates the drifting effect.  
7. On mobile devices the **DeviceOrientation API** adds subtle parallax by shifting sampling coordinates.  
8. Rendering happens inside a `<canvas>` using `requestAnimationFrame`.

---

## Rendering Pipeline

| Stage | Description |
|------|-------------|
| Noise Generation | Produces height values across a grid |
| Contour Extraction | Marching Squares detects contour segments |
| Path Construction | Segments merged into continuous lines |
| Spline Smoothing | Catmull Rom curves smooth the geometry |
| Animation | Time offsets animate the noise field |
| Rendering | Canvas draw calls update each frame |

---

## Key Idea

Contour Flow is essentially a **real time procedural topographic map generator** running directly in the browser.

No images  
No SVG assets  
Only algorithms generating geometry and drawing it to canvas each frame.
