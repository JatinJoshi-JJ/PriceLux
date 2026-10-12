# 🌌 PRICELUX — Next-Gen Subscription Platform & 3D Spatial Pricing Engine

> **A viral, ultra-aesthetic SaaS landing page engineered with 2026 cosmic gradient mesh aesthetics, 3D cylindrical carousel mechanics, and an interactive AI procurement concierge.**

[![Version](https://img.shields.io/badge/version-2.4.0-ec4899.svg?style=flat-square)]()
[![License](https://img.shields.io/badge/license-MIT-8b5cf6.svg?style=flat-square)]()
[![Aesthetics](https://img.shields.io/badge/design-Cosmic%20Mesh%202026-38bdf8.svg?style=flat-square)]()
[![Performance](https://img.shields.io/badge/60fps-Hardware%20Accelerated-10b981.svg?style=flat-square)]()

---

## ✨ Features & Architecture

### 🌀 1. 3D Spatial Carousel (Pricing Ring)
* **3D Cylindrical Ring**: Pricing plans arranged seamlessly along a circular 3D plane with calibrated radial perspective (`transform: rotateY() translateZ()`).
* **Fluid Drag & Inertia**: Natural drag-to-rotate interaction with mouse and touch support.
* **Continuous Auto-Rotation**: Subtly auto-spins when idle; pauses smoothly during interaction or card hover.
* **Smart Tier Highlights**: Contoured corner badges, real-time currency conversion, and annual billing savings.

### 🤖 2. PRICELUX AI Concierge (Gemini 3 Flash)
* **Structured Human-Readable Responses**: Replaces dense walls of text with structured cards featuring clear bullet points, badges, and contextual emojis (🛡️, ⚡, 💳, 🚀, 💎).
* **Dual-Theme Optimization**: Crisp, high-contrast light mode styling with soft purple borders, alongside a deep obsidian cosmic glass layout in dark mode.
* **Silky Smooth Chat Scrolling**: Independent 60fps lerp scroll physics inside the drawer with hidden scrollbars for clean minimalism.
* **Contextual Quick Chips**: 1-click answers for SLA terms, overage policies, and enterprise wire transfer invoices.

### 🖱️ 3. Luxury Animated Cursor Follower
* **Dual-Element Cosmic Cursor**: Ultra-fine neon precision center dot (`#cursorDot`) coupled with a magnetic trailing mesh ring (`#cursorFollower`).
* **Hardware-Accelerated Physics**: Built using `translate3d` and 60fps requestAnimationFrame lerp loops for zero input lag.
* **Interactive Dilation**: Automatically expands into a glowing cosmic ring when hovering buttons, links, cards, or inputs.
* **Touch-Safe**: Automatically disabled on touchscreens (`pointer: coarse`) to preserve native mobile interactions.

### 🌊 4. Lenis Smooth Momentum Scrolling
* **Fluid Inertia Engine**: Integrated Lenis scroll library for buttery page momentum.
* **Smart Dynamic Navbar**: Automatically hides on scroll-down to maximize viewing area and reveals instantly on scroll-up.
* **Nested Isolation**: Chat drawer and overlays utilize `data-lenis-prevent` to avoid scroll locking or background leakage.

### 🌗 5. Dual-Mode Theme Engine (Obsidian & Alabaster)
* **Viral Cosmic Dark Mode**: Deep void backgrounds (`#080612`), neon pink/purple accents, and translucent frosted glass.
* **Warm Alabaster Light Mode**: Elegant alabaster whites (`#f8f7fd`), deep slate typography, and subtle glowing borders.
* **Instant Persistence**: Smooth theme transitions with `localStorage` theme state saving.

### 📊 6. Interactive Telemetry & Feature Cards
* **3D Parallax Tilt**: Interactive card perspective shifting on mouse move with luminous glare highlights.
* **Live SVG Performance Chart**: Interactive bezier telemetry curve with pulsating peak beacons and timeframe filtering (1h, 24h, 7d, Live).
* **Snappy FAQ Accordion**: CSS Grid `grid-template-rows: 0fr -> 1fr` animations with mathematically centered cross/plus indicators.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Structure** | Semantic HTML5, SVG Graphs, ARIA Accessibility Tokens |
| **Styling** | Vanilla CSS3 (Custom Properties, Glassmorphism, 3D Transforms, Fluid Typography) |
| **Interactivity** | Vanilla JavaScript (ES6+, RAF Physics, Pointer Events) |
| **Smooth Scroll** | Lenis.js (Momentum & Scroll Smoothing) |
| **AI Integration** | Google Gemini API (with Local Structured Fallback Engine) |
| **Typography** | Cormorant Garamond, Space Grotesk, Plus Jakarta Sans, JetBrains Mono |

---

## 📁 Project Structure

```text
PriceLux/
├── index.html              # Main application markup & 3D carousel DOM
├── style.css               # Design system tokens, 3D carousel styles, custom cursor
├── script.js               # Physics engines, carousel rotation, AI concierge, cursor logic
├── assets/                 # Local assets & libraries
│   ├── lenis.min.js        # Smooth scroll engine
│   ├── lenis.css           # Smooth scroll helper styles
│   ├── hero-mesh.jpg       # Ambient background mesh asset
│   └── 3d-*.png            # Transparent 3D card render assets
└── README.md               # Project documentation
```

---

## 🚀 Quick Start

No build tools or bundlers required. Run directly in any modern browser:

### Option 1: Live Server (VS Code / Extension)
Right-click `index.html` and select **"Open with Live Server"**.

### Option 2: Local Python Server
```bash
# In the project root directory:
python3 -m http.server 8000
```
Then navigate to: `http://localhost:8000`

### Option 3: Direct File Open
Simply double-click `index.html` to open directly in Google Chrome, Microsoft Edge, Safari, or Firefox.

---

## 💡 Configuration

### Adding Your Gemini API Key
To connect the live Gemini 3 Flash preview model:
1. Open [`script.js`](file:///home/jatin-joshi/Desktop/Days/PriceLux/script.js).
2. Locate the `apiKey` variable:
   ```javascript
   const apiKey = "YOUR_GEMINI_API_KEY_HERE";
   ```
3. If left empty, the intelligent built-in knowledge matcher will automatically serve structured responses for all pricing, SLA, billing, and overage inquiries!

---

## 🎨 Design System Palette

```css
/* Signature Gradients */
--color-accent-gradient: linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #f97316 100%);
--color-cyan-purple-grad: linear-gradient(135deg, #06b6d4 0%, #6366f1 50%, #d946ef 100%);

/* Dark Mode Obsidian Foundations */
--color-surface-base: #080612;
--color-surface-raised: #151128;
--color-surface-glass: rgba(18, 14, 36, 0.82);

/* Light Mode Alabaster Foundations */
--color-surface-base: #f8f7fd;
--color-surface-raised: #ffffff;
--color-surface-muted: #f0eef9;
```

---

## 📜 License
This project is open-source and available under the **MIT License**.

Designed with ❤️ for next-generation SaaS experiences.
# PriceLux
