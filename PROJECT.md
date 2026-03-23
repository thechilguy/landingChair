# MODERNIFY CHAIR — Project Overview

## Purpose

Single-page product landing page for a designer chair ("MODERNIFY CHAIR"). The goal is a high-end editorial feel with a 3D interactive model, smooth full-screen scroll, and minimal typography.

---

## Tech Stack

| Technology | Version | Role |
|---|---|---|
| Next.js | 16.2.0 | Framework (App Router) |
| React | 19.2.4 | UI |
| TypeScript | ^5 | Language |
| React Three Fiber | ^9.5.0 | 3D canvas rendering |
| @react-three/drei | ^10.7.7 | R3F helpers (useGLTF, etc.) |
| Three.js | ^0.183.2 | 3D engine |
| GSAP | (installed, unlisted) | Scroll transitions, NavCircle animations |
| Tailwind CSS | ^4 | Utility classes (minimal usage) |
| CSS Modules | — | Component-scoped styles |

> GSAP is present in `node_modules` but not declared in `package.json` — add it explicitly if needed.

---

## File Structure

```
chair/
├── app/
│   ├── layout.tsx          # Root layout — fonts, html/body wrapper
│   ├── page.tsx            # Entry page — SmoothScroll + Hero + About + NavCircle
│   └── globals.css         # Global resets, Tailwind import, #main-container styles
│
├── components/
│   ├── Hero.tsx            # Hero section — specs panel + 3D canvas
│   ├── ChairModel.tsx      # R3F mesh — loads chair3.glb, entrance anim, mouse parallax
│   ├── About.tsx           # Placeholder second section
│   ├── SmoothScroll.tsx    # GSAP fullscreen section scroll controller
│   └── NavCircle.tsx       # Fixed nav indicator — rotating circle + SVG shelf label
│
├── styles/
│   ├── Hero.module.css     # Hero layout, specs panel, canvas wrapper
│   ├── HeroText.module.css # Leftover from previous dark-bg hero design (unused)
│   ├── About.module.css    # About section styles (placeholder)
│   └── NavCircle.module.css # NavCircle layout and calibration variables
│
└── public/
    ├── chair3.glb          # Active 3D model
    └── chair2.glb          # Unused previous model iteration
```

---

## Components

### `Hero.tsx`
Two-column full-viewport hero section. Left side (absolute, 40% area) holds the specs panel with product details and a buy button. Right side (`canvasWrapper`, 60%) contains the R3F `Canvas`. Large title (`MODERNIFY CHAIR`) and category label (`FORNITURE`) sit above both columns as absolute overlays. `canvasWrapperRef` is exposed for future GSAP scroll animation.

### `ChairModel.tsx`
Loads `chair3.glb` via `useGLTF` (preloaded). On mount, runs a ~1.5 s entrance animation: scale grows from near-zero to final responsive size, Y position rises from -2 to -1. Per-frame mouse parallax: `rotation.y` lerps toward `BASE_ROTATION_Y (-35°) + mouseX * 0.3`, `rotation.x` lerps toward `mouseY * 0.15`. All mesh children have smooth normals and cast/receive shadows.

### `About.tsx`
Placeholder second section. Dark gradient background. Content not yet designed.

### `SmoothScroll.tsx`
Wraps page sections in `#main-container`. Positions each child section absolutely, stacked at `top: 100vh` (off-screen below). On wheel or touch swipe, GSAP animates the current section out (`top: -100vh`, fade to 0.3 opacity) and the target in (`top: 0`, fade to 1). Duration 0.9 s, `power3.inOut` easing. Fires `onSectionChange` callback to sync `NavCircle`.

### `NavCircle.tsx`
Fixed to the right edge, partially off-screen (controlled via `--circle-offset-right: -200px`). A large circle (340 × 340 px) with a dot at top-left and an SVG "shelf" label arm extending from the dot. On section change: circle rotates, border/dot color transitions between `#111111` (Hero) and `#ffffff` (About). The two SVG lines animate in via `strokeDashoffset` (draw effect). The section label cross-fades with a blur transition.

---

## Current Features

- Full-screen GSAP scroll between sections (wheel + touch)
- Interactive 3D chair model with entrance animation and mouse parallax
- Hero layout: category label, large title, specs panel, price, buy button
- NavCircle indicator that reacts to section and color-adapts
- Jura font applied throughout the Hero UI

---

## 3D Model

- **Active file:** `public/chair3.glb`
- **Unused:** `public/chair2.glb`
- Loaded with `useGLTF` and preloaded at module level
- Smooth normals computed at runtime (`computeVertexNormals`)
- Responsive scale: `Math.min(viewport.width, viewport.height) * 0.27 * 1.3`

---

## Fonts

| Font | Variable | Weights | Usage |
|---|---|---|---|
| Jura | `--font-jura` | 400, 700 | Hero labels, specs, price, button |
| League Gothic | `--font-league-gothic` | — | Referenced in `HeroText.module.css` (previous hero design, not loaded in layout) |
| Geist Sans | `--font-geist-sans` | variable | Next.js default, body fallback |
| Geist Mono | `--font-geist-mono` | variable | Next.js default |

---

## Color Scheme

| Context | Background | Text / Accent |
|---|---|---|
| Hero | `#ffffff` | `#111` (primary), `#444` (labels) |
| About | `#111111` → `#222222` gradient | `#ffffff` |
| NavCircle on Hero | transparent | `#111111` |
| NavCircle on About | transparent | `#ffffff` |
| Buy button hover | `#111` | `#ffffff` |

---

## Animation Details

### SmoothScroll
- Engine: GSAP `to()`
- Trigger: `wheel` (deltaY) and `touchstart`/`touchend` (30 px threshold)
- Transition: 0.9 s, `power3.inOut`
- Lock: `isAnimating` ref prevents overlap

### NavCircle
- Circle rotation: 0° (Hero) → 360° (About), 0.9 s `power3.inOut`
- Color crossfade: border, dot background, text color all transition together
- SVG shelf draw: `line2` draws in at 0.55 s delay; `line1` at 1.15 s delay, both `power3.out`
- Label: blur-out (0.25 s) → text swap → blur-in from below (0.6 s)
- `killTweensOf` called on all refs before each transition to prevent overlap

### ChairModel
- Entrance: `easeOutCubic`, ~1.5 s, scale 0 → final, Y -2 → -1
- Mouse parallax: per-frame `lerp` (factor 0.05), no re-renders (mutable `mouseRef`)
- Base Y rotation: -35°

---

## Git Branches

| Branch | Purpose |
|---|---|
| `main` | Stable / release |
| `dev` | Active development (current) |

Commit history on `dev` shows: initial Next.js setup → 3D hero scratch → NavCircle with draw animation → killTweens fix → current hero redesign (Jura, specs panel, white layout).

---

## Planned / In Progress

- **`canvasWrapperRef`** on Hero canvas wrapper is reserved for a GSAP scroll animation (referenced as `animation01` in spec) — not yet implemented
- **About section** is a placeholder; content and layout not designed
- **League Gothic** (`--font-league-gothic`) is referenced in `HeroText.module.css` but not loaded — either wire it up in `layout.tsx` or remove the dead CSS file
- **`chair2.glb`** in `public/` is unused — can be removed to reduce bundle size
- **GSAP** should be added to `package.json` dependencies explicitly
