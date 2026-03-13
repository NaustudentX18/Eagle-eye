# OmniRecon — Complete Onboarding Guide

Welcome to **OmniRecon**, a cutting-edge geospatial intelligence command center built as a Progressive Web App (PWA). This guide covers everything you need to deploy, run, develop, and modify the project — from first clone to production deployment.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture Summary](#2-architecture-summary)
3. [Prerequisites](#3-prerequisites)
4. [Repository Structure](#4-repository-structure)
5. [Environment Configuration](#5-environment-configuration)
6. [Installation](#6-installation)
7. [Running the Project](#7-running-the-project)
8. [Available Commands](#8-available-commands)
9. [API Keys & Data Sources](#9-api-keys--data-sources)
10. [Feature Modules Explained](#10-feature-modules-explained)
11. [Shader Modes](#11-shader-modes)
12. [Development Workflow](#12-development-workflow)
13. [Adding & Modifying Features](#13-adding--modifying-features)
14. [Testing](#14-testing)
15. [Deployment](#15-deployment)
16. [CI/CD Pipeline](#16-cicd-pipeline)
17. [Troubleshooting](#17-troubleshooting)
18. [Glossary](#18-glossary)

---

## 1. Project Overview

**OmniRecon** is an open-source geospatial command center that renders a photorealistic interactive 3D globe layered with live OSINT (Open Source Intelligence) data. Think of it as an open-source, browser-native WorldView — running on a phone, tablet, or desktop.

### What it does

| Capability | Description |
|---|---|
| **3D Globe** | Photorealistic Earth rendered via Google 3D Tiles and WebGL/WebGPU |
| **Live Aircraft** | Real-time ADS-B transponder data from OpenSky Network / ADS-B Exchange |
| **Live Satellites** | Orbital track prediction using CelesTrak TLE datasets |
| **Maritime Tracking** | AIS vessel positions including "dark ship" anomaly detection |
| **Traffic Density** | Vehicle density heat maps via OpenStreetMap data |
| **CCTV Feeds** | Public camera streams geo-anchored to the globe |
| **GPS Jamming** | Visual overlay of detected GPS spoofing / jamming zones |
| **Internet Blackouts** | Real-time internet outage regions sourced from public feeds |
| **Shader Modes** | Night Vision, FLIR thermal, CRT scan lines, Anime cel-shading |
| **Operation Replay** | Time-scrubbing playback of stored OSINT events |
| **PWA Support** | Installable on iOS and Android — works offline with cached data |

---

## 2. Architecture Summary

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser / PWA Shell                     │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  3D Globe    │  │  Layer Panel │  │  Replay Controls │  │
│  │  (WebGL/GPU) │  │  (OSINT HUD) │  │  (Time Scrubber) │  │
│  └──────┬───────┘  └──────┬───────┘  └────────┬─────────┘  │
│         │                 │                   │             │
│  ┌──────▼─────────────────▼───────────────────▼──────────┐  │
│  │               Frontend Application Core                │  │
│  │  (Vite + JavaScript/TypeScript + Cesium.js / Three.js) │  │
│  └────────────────────────┬───────────────────────────────┘  │
└───────────────────────────│─────────────────────────────────┘
                            │ HTTP / WebSocket
┌───────────────────────────▼─────────────────────────────────┐
│                       Backend (Node.js)                     │
│                                                             │
│  ┌──────────────────┐   ┌────────────────┐                  │
│  │  REST API Server │   │  WebSocket Hub │                  │
│  └────────┬─────────┘   └───────┬────────┘                  │
│           │                     │                           │
│  ┌────────▼─────────────────────▼────────────────────────┐  │
│  │                   AI Agent Pipeline                   │  │
│  │  ┌────────────┐ ┌───────────┐ ┌────────────────────┐  │  │
│  │  │  Ingestion │ │  Parser   │ │  Sync / Broadcast  │  │  │
│  │  │  Agents    │ │  Agents   │ │  Agents            │  │  │
│  │  └─────┬──────┘ └─────┬─────┘ └─────────┬──────────┘  │  │
│  └────────│──────────────│─────────────────-│─────────────┘  │
│           │              │                  │               │
│  ┌────────▼──────────────▼──────────────────▼────────────┐  │
│  │               Data Store (PostgreSQL / SQLite)        │  │
│  └────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
       ┌────────────────────┼──────────────────────┐
       ▼                    ▼                      ▼
 OpenSky Network      CelesTrak TLE          AIS / MarineTraffic
 ADS-B Exchange       GPS Jamming DB         OpenStreetMap
 Public CCTV          Outage Trackers
```

---

## 3. Prerequisites

Before you begin, ensure the following tools are installed on your system.

### Required Software

| Tool | Minimum Version | Purpose | Install |
|---|---|---|---|
| **Node.js** | v18 LTS or newer | Runtime for frontend build and backend server | [nodejs.org](https://nodejs.org) |
| **npm** | v9+ (bundled with Node.js) | Package manager | Included with Node.js |
| **Git** | v2.x | Version control | [git-scm.com](https://git-scm.com) |

### Optional (Recommended)

| Tool | Purpose | Install |
|---|---|---|
| **Docker** | Run the full stack in containers without local setup | [docker.com](https://www.docker.com/get-started) |
| **Docker Compose** | Orchestrate multi-container stack | Included in Docker Desktop |
| **VS Code** | Recommended IDE with extension support | [code.visualstudio.com](https://code.visualstudio.com) |

### Browser Requirements

OmniRecon uses **WebGL 2.0** (and optionally **WebGPU**) for 3D globe rendering.

| Browser | Min Version | WebGL 2.0 | WebGPU |
|---|---|---|---|
| Chrome / Chromium | 80+ | ✅ | ✅ (Chrome 113+) |
| Firefox | 79+ | ✅ | ⚠️ (experimental) |
| Safari | 15+ | ✅ | ✅ (Safari 17+) |
| Edge | 80+ | ✅ | ✅ |

> **Note:** For best performance and shader mode support, use the latest version of Chrome or Edge.

### Verify Your Environment

Run these commands to check your setup:

```bash
node --version    # Should print v18.x.x or higher
npm --version     # Should print 9.x.x or higher
git --version     # Should print git version 2.x.x
```

---

## 4. Repository Structure

Once the codebase is fully built out, the repository follows this layout:

```
Eagle-eye/
│
├── .github/
│   └── workflows/
│       └── ci.yml               # GitHub Actions CI/CD pipeline
│
├── src/
│   ├── frontend/                # PWA application source
│   │   ├── index.html           # App entry point / PWA shell
│   │   ├── main.js              # JavaScript entry point
│   │   ├── globe/               # 3D globe rendering engine
│   │   │   ├── GlobeRenderer.js # Cesium.js / Three.js globe setup
│   │   │   ├── CameraControls.js# Orbit, tilt, zoom controls
│   │   │   └── TileManager.js   # Google 3D Tiles loader
│   │   ├── layers/              # OSINT data layer handlers
│   │   │   ├── AircraftLayer.js # ADS-B aircraft rendering
│   │   │   ├── SatelliteLayer.js# TLE orbit propagation & rendering
│   │   │   ├── MaritimeLayer.js # AIS vessel tracking
│   │   │   ├── TrafficLayer.js  # Vehicle traffic density
│   │   │   ├── CCTVLayer.js     # Geo-anchored CCTV overlays
│   │   │   ├── JammingLayer.js  # GPS jamming zones
│   │   │   └── BlackoutLayer.js # Internet blackout regions
│   │   ├── shaders/             # GLSL / WGSL shader code
│   │   │   ├── nightvision.glsl # Night vision effect
│   │   │   ├── flir.glsl        # FLIR thermal overlay
│   │   │   ├── crt.glsl         # CRT scanline effect
│   │   │   └── celshading.glsl  # Anime cel-shading
│   │   ├── replay/              # Operation Replay engine
│   │   │   ├── ReplayEngine.js  # Time-scrubbing logic
│   │   │   └── TimeScrubber.js  # UI slider component
│   │   ├── ui/                  # User interface components
│   │   │   ├── LayerPanel.js    # OSINT layer toggle panel
│   │   │   ├── HUD.js           # Heads-up display overlay
│   │   │   └── Settings.js      # User preferences panel
│   │   └── pwa/                 # PWA configuration
│   │       ├── manifest.json    # PWA manifest (icons, theme)
│   │       └── sw.js            # Service worker for offline support
│   │
│   └── backend/                 # Node.js backend server
│       ├── server.js            # Express app entry point
│       ├── agents/              # AI agent pipeline
│       │   ├── IngestionAgent.js# Fetches raw data from APIs
│       │   ├── ParserAgent.js   # Normalises and cleans data
│       │   └── SyncAgent.js     # Broadcasts live data via WebSocket
│       ├── routes/              # REST API routes
│       │   ├── aircraft.js      # GET /api/aircraft
│       │   ├── satellites.js    # GET /api/satellites
│       │   ├── maritime.js      # GET /api/maritime
│       │   ├── traffic.js       # GET /api/traffic
│       │   ├── cctv.js          # GET /api/cctv
│       │   ├── jamming.js       # GET /api/jamming
│       │   ├── blackouts.js     # GET /api/blackouts
│       │   └── replay.js        # GET /api/replay
│       ├── db/                  # Database layer
│       │   ├── schema.sql       # Table definitions
│       │   └── db.js            # Database connection & queries
│       └── config/
│           └── config.js        # Loads and validates env variables
│
├── tests/                       # Automated test suite
│   ├── unit/                    # Unit tests (Jest)
│   └── integration/             # Integration tests
│
├── docs/                        # Additional documentation
│   └── API.md                   # REST API reference
│
├── .env.example                 # Template for environment variables
├── .gitignore                   # Files excluded from version control
├── docker-compose.yml           # Docker Compose stack definition
├── Dockerfile                   # Docker image for backend
├── package.json                 # Project metadata and npm scripts
├── vite.config.js               # Vite build tool configuration
├── ONBOARDING.md                # This file
├── README.md                    # Project overview
└── LICENSE                      # MIT License
```

> **Note:** The repository is currently in the **planning phase**. Source files will be added as development progresses. The structure above reflects the intended final layout.

---

## 5. Environment Configuration

OmniRecon requires several API keys and configuration values. These are stored in a `.env` file **that is never committed to version control**.

### Step 1 — Create Your `.env` File

```bash
cp .env.example .env
```

### Step 2 — Fill in Values

Open `.env` in your editor and set each value:

```dotenv
# ─── Server ───────────────────────────────────────────────────────────────────
PORT=3000                          # Port the backend server listens on
NODE_ENV=development               # 'development' | 'production' | 'test'

# ─── Google 3D Tiles ──────────────────────────────────────────────────────────
GOOGLE_3D_TILES_API_KEY=           # From Google Cloud Console (Maps Platform)
# How to get: https://console.cloud.google.com → APIs & Services → Credentials

# ─── Aircraft Tracking ────────────────────────────────────────────────────────
OPENSKY_USERNAME=                  # OpenSky Network account username (optional for public endpoints)
OPENSKY_PASSWORD=                  # OpenSky Network account password
ADSB_EXCHANGE_API_KEY=             # ADS-B Exchange RapidAPI key (optional, for higher limits)
# How to get OpenSky: https://opensky-network.org/my-opensky → register free
# How to get ADS-B Exchange: https://rapidapi.com/adsbx/api/adsbexchange-com1

# ─── Satellite Tracking ───────────────────────────────────────────────────────
CELESTRAK_BASE_URL=https://celestrak.org/SOCRATES/query.php
# CelesTrak is free and open — no API key needed

# ─── Maritime Tracking ────────────────────────────────────────────────────────
AIS_API_KEY=                       # From aisstream.io or MarineTraffic
# How to get: https://aisstream.io → register for free WebSocket access

# ─── Database ─────────────────────────────────────────────────────────────────
DATABASE_URL=sqlite://./data/omnirecon.db   # SQLite for development
# For production, use PostgreSQL:
# DATABASE_URL=postgresql://user:password@host:5432/omnirecon

# ─── WebSocket ────────────────────────────────────────────────────────────────
WS_PORT=3001                       # WebSocket server port for live data push

# ─── Feature Flags ────────────────────────────────────────────────────────────
ENABLE_CCTV=true                   # Toggle CCTV layer
ENABLE_JAMMING=true                # Toggle GPS jamming layer
ENABLE_BLACKOUTS=true              # Toggle internet blackout layer
ENABLE_REPLAY=true                 # Toggle Operation Replay feature
```

> **Security:** Never commit `.env` to Git. The `.gitignore` already excludes it. Rotate any accidentally exposed keys immediately.

---

## 6. Installation

### Standard Installation (Node.js)

```bash
# 1. Clone the repository
git clone https://github.com/NaustudentX18/Eagle-eye.git
cd Eagle-eye

# 2. Install all dependencies
npm install

# 3. Create your environment file
cp .env.example .env
# Then edit .env with your API keys (see Section 5)

# 4. Set up the database (first time only)
npm run db:migrate
```

### Docker Installation (Recommended for Production)

If you have Docker installed, you can spin up the entire stack — frontend, backend, and database — with a single command:

```bash
# 1. Clone the repository
git clone https://github.com/NaustudentX18/Eagle-eye.git
cd Eagle-eye

# 2. Create your environment file
cp .env.example .env
# Then edit .env with your API keys

# 3. Build and start all services
docker compose up --build
```

This starts:
- **Frontend** dev server at `http://localhost:5173`
- **Backend** API at `http://localhost:3000`
- **WebSocket** live feed at `ws://localhost:3001`
- **Database** (PostgreSQL or SQLite depending on config)

---

## 7. Running the Project

### Development Mode

Development mode enables hot-reload for both frontend and backend. Changes to source files are reflected immediately without restarting.

```bash
npm run dev
```

This runs:
- **Vite** development server for the frontend (port 5173)
- **Nodemon** for the backend with auto-restart on changes (port 3000)

Open your browser at: **http://localhost:5173**

### Running Frontend Only

Useful when you are only working on UI/visual changes and don't need live backend data:

```bash
npm run dev:frontend
```

### Running Backend Only

Useful for API development, debugging agent pipelines, or testing REST endpoints:

```bash
npm run dev:backend
```

### Production Mode

Builds an optimised PWA bundle and serves it via the production server:

```bash
npm run build        # Compile and bundle for production
npm start            # Serve the production build
```

The production app will be available at **http://localhost:3000** (or the `PORT` value in your `.env`).

---

## 8. Available Commands

This section documents every npm script and what it does.

| Command | Description |
|---|---|
| `npm install` | Install all project dependencies listed in `package.json` |
| `npm run dev` | Start both frontend (Vite) and backend (Nodemon) in development mode |
| `npm run dev:frontend` | Start only the Vite frontend dev server with hot-reload |
| `npm run dev:backend` | Start only the Node.js backend server with Nodemon auto-restart |
| `npm run build` | Compile TypeScript, bundle assets, and generate optimised PWA output in `dist/` |
| `npm start` | Serve the production build (run `npm run build` first) |
| `npm test` | Run all unit and integration tests with Jest |
| `npm run test:unit` | Run only unit tests (fast, no network calls) |
| `npm run test:integration` | Run integration tests (requires backend to be running) |
| `npm run test:watch` | Run tests in watch mode — re-runs on file changes |
| `npm run test:coverage` | Run tests and generate an HTML coverage report in `coverage/` |
| `npm run lint` | Check code style and syntax errors using ESLint |
| `npm run lint:fix` | Auto-fix ESLint errors where possible |
| `npm run format` | Format all source files using Prettier |
| `npm run db:migrate` | Apply database schema migrations (run once on first setup, then after schema changes) |
| `npm run db:seed` | Load sample/demo data into the database for local development |
| `npm run db:reset` | Drop and recreate the database, then re-apply migrations (⚠️ deletes all data) |
| `npm run docker:up` | Start the full Docker Compose stack |
| `npm run docker:down` | Stop and remove all Docker Compose containers |
| `npm run docker:logs` | Stream logs from all Docker Compose services |

### Command Deep-Dive

#### `npm run dev`

Concurrently starts the Vite dev server and the Express backend. The Vite server proxies API requests to the backend so you don't need to deal with CORS during development.

```
What happens:
1. Vite starts on port 5173, watches src/frontend/**
2. Nodemon starts the backend on port 3000, watches src/backend/**
3. AI agents begin polling OSINT APIs (rate-limited in dev mode)
4. WebSocket server opens on port 3001 for live push
```

#### `npm run build`

Runs the production build pipeline:

```
What happens:
1. ESLint validates source files (build fails on errors)
2. TypeScript compiles and type-checks (if .ts files are present)
3. Vite bundles frontend assets into dist/
4. Service worker (sw.js) is generated for PWA offline support
5. PWA manifest is validated
6. Assets are minified and content-hashed for cache busting
```

Output in `dist/`:
```
dist/
├── index.html          # Entry point with hashed asset references
├── assets/
│   ├── main.[hash].js  # Bundled JavaScript
│   └── style.[hash].css# Bundled CSS
└── pwa/
    ├── manifest.json   # PWA manifest
    └── sw.js           # Service worker
```

#### `npm run db:migrate`

Applies database schema from `src/backend/db/schema.sql`. Safe to run multiple times — only applies changes that haven't been applied yet.

```bash
# Example output:
✔ Applied migration: 001_create_events_table
✔ Applied migration: 002_create_sessions_table
✔ Applied migration: 003_create_layers_table
Database is up to date.
```

#### `npm run db:seed`

Loads pre-built sample data for local development so you can see how the globe looks without live API keys:

```bash
npm run db:seed
# Inserts: 500 sample aircraft, 50 satellites, 200 vessels, etc.
```

---

## 9. API Keys & Data Sources

### Overview

OmniRecon aggregates data from multiple free and commercial sources. Here's a detailed breakdown of each integration:

---

### Google 3D Tiles (Required)

**What it does:** Powers the photorealistic 3D globe tiles — buildings, terrain, textures.

**Cost:** Free tier with generous quota (25,000 tile requests/month). Paid beyond that.

**How to get a key:**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a project (or select an existing one)
3. Navigate to **APIs & Services → Library**
4. Enable **Map Tiles API**
5. Navigate to **APIs & Services → Credentials**
6. Click **Create Credentials → API Key**
7. Copy the key into `GOOGLE_3D_TILES_API_KEY` in your `.env`
8. Restrict the key to your domain in production (Credentials → Edit key → Application restrictions)

---

### OpenSky Network (Aircraft — Free)

**What it does:** Provides real-time ADS-B data for civil aircraft worldwide.

**Cost:** Free. Authenticated users get higher rate limits.

**How to get access:**
1. Register at [opensky-network.org](https://opensky-network.org)
2. Add credentials to your `.env`:
   ```dotenv
   OPENSKY_USERNAME=your_username
   OPENSKY_PASSWORD=your_password
   ```

**Rate limits:**
- Unauthenticated: 10 requests / 10 seconds, limited to 400 aircraft
- Authenticated: 100 requests / 10 seconds, up to 1000 aircraft

**API used:**
```
GET https://opensky-network.org/api/states/all
```

---

### CelesTrak (Satellites — Free, No Key Needed)

**What it does:** Publishes TLE (Two-Line Element) datasets for all tracked space objects.

**Cost:** Free and open. No registration needed.

**How it works:**
- The backend ingestion agent fetches TLE files from CelesTrak URLs automatically.
- Orbital positions are propagated client-side using the SGP4 algorithm.

**Key TLE datasets used:**
```
https://celestrak.org/SOCRATES/query.php        # Conjunction data
https://celestrak.org/SATCAT/satcat.csv         # Full catalog
https://celestrak.org/supplemental/             # Supplemental TLEs
```

---

### AIS Stream (Maritime — Free Tier)

**What it does:** Real-time AIS (Automatic Identification System) vessel tracking via WebSocket.

**Cost:** Free tier available with rate limits. Paid plans for higher volume.

**How to get a key:**
1. Register at [aisstream.io](https://aisstream.io)
2. Create a subscription / get your API key
3. Add to your `.env`: `AIS_API_KEY=your_key`

**How it works:**
- The backend opens a persistent WebSocket connection to AISstream
- Vessel positions are pushed in real-time
- "Dark ship" detection flags vessels that disable AIS transmitters

---

### OpenStreetMap (Traffic — Free, No Key Needed)

**What it does:** Provides road network data and crowdsourced traffic information.

**Cost:** Free. Attribution required (already included in the UI).

**Note:** Real-time traffic density is derived by combining OSM road data with publicly available GPS trace feeds. No API key needed.

---

### CCTV Feeds

**What it does:** Displays public camera streams geo-anchored to the 3D globe.

**Source:** Publicly available CCTV streams from governments, transport agencies, and universities. No single API — the backend maintains a curated list of RTSP/HLS stream URLs.

**How to add a custom camera:**
```javascript
// src/backend/routes/cctv.js
// Add entries to the cctv_feeds table via db:seed or directly:
{
  name: "Times Square Cam 1",
  latitude: 40.7580,
  longitude: -73.9855,
  stream_url: "https://example.com/timessquare/stream.m3u8",
  type: "HLS"
}
```

---

### GPS Jamming Detection

**What it does:** Overlays known and reported GPS jamming / spoofing zones.

**Source:** [gpsjam.org](https://gpsjam.org) publishes aggregated crowd-sourced ADS-B anomaly data in GeoJSON format. No key needed.

---

### Internet Blackout Monitoring

**What it does:** Visualises internet outage events by country/region.

**Source:** [IODA (Internet Outage Detection and Analysis)](https://ioda.caida.org/ioda/dashboard) — free and open API.

---

## 10. Feature Modules Explained

### 3D Globe Rendering

The globe is powered by **Cesium.js** (or Three.js as a fallback) which renders Google's 3D Tiles photorealistic tileset. Key behaviors:

- **Initial view:** The globe loads centred on 0°N 0°E at a medium zoom level, then transitions to the user's approximate location (geolocation API).
- **Camera controls:**
  - Left-click drag: Orbit (rotate) around a point
  - Right-click drag or two-finger pinch: Zoom in/out
  - Middle-click drag or three-finger drag: Tilt the camera
  - Double-click: Fly to that location
- **Tile loading:** Tiles stream progressively based on camera distance and angle. The tile budget is automatically reduced on low-power mobile devices.

**Relevant files:**
- `src/frontend/globe/GlobeRenderer.js` — Initialises the Cesium viewer
- `src/frontend/globe/TileManager.js` — Manages 3D Tile streaming and LOD
- `src/frontend/globe/CameraControls.js` — Custom camera behaviour overrides

---

### OSINT Layer System

Each OSINT data source is implemented as a **Layer** — a self-contained module that:
1. Fetches data from a backend API endpoint
2. Converts data into renderable entities (points, lines, polygons)
3. Adds those entities to the Cesium globe scene
4. Updates periodically on a configurable refresh interval

**To enable/disable a layer in the UI:**
- Open the Layer Panel (icon in top-right corner of the globe)
- Toggle any layer on or off
- Layers retain their last state across sessions (stored in localStorage)

**Refresh intervals (configurable in `.env`):**
| Layer | Default Refresh |
|---|---|
| Aircraft | Every 5 seconds |
| Satellites | Every 30 seconds |
| Maritime | Real-time (WebSocket) |
| Traffic | Every 2 minutes |
| CCTV | Static (loaded once) |
| GPS Jamming | Every 15 minutes |
| Blackouts | Every 5 minutes |

---

### Operation Replay

Replay allows you to scrub through historical OSINT data as if watching a recording.

**How it works:**
1. The backend stores all received OSINT events with timestamps in the database.
2. Replay fetches events within a user-specified time window.
3. The frontend plays back events on the globe at adjustable speed (1x, 2x, 5x, 10x).
4. Events animate in and out as the playhead passes their timestamp.

**To start a replay:**
1. Click the **Replay** button in the HUD.
2. Choose a date/time range using the date pickers.
3. Press **Play**. The globe will animate from the start time.
4. Use the time scrubber to jump to any point in the recording.

**Data retention:** By default, events are retained for **30 days**. Configure with `REPLAY_RETENTION_DAYS` in `.env`.

---

## 11. Shader Modes

Shaders are GLSL/WGSL post-processing effects applied to the entire globe render. They transform the visual appearance without changing underlying data.

### Available Modes

| Mode | File | Description |
|---|---|---|
| **Normal** | (none) | Standard photorealistic view — default |
| **Night Vision** | `nightvision.glsl` | Green phosphor amplified image, simulates starlight image intensifier |
| **FLIR Thermal** | `flir.glsl` | False-colour heat map — white-hot or black-hot palette |
| **CRT** | `crt.glsl` | Retro CRT monitor with scanlines and barrel distortion |
| **Cel Shading** | `celshading.glsl` | Anime-style flat shading with outlined edges |

### How to Switch Shader Modes

**Via UI:** Click the shader icon in the HUD → select a mode from the dropdown.

**Via keyboard shortcut:**
| Key | Mode |
|---|---|
| `1` | Normal |
| `2` | Night Vision |
| `3` | FLIR Thermal |
| `4` | CRT |
| `5` | Cel Shading |

### How to Create a Custom Shader

1. Create a new file in `src/frontend/shaders/`:
   ```glsl
   // src/frontend/shaders/myshader.glsl
   uniform sampler2D colorTexture;
   in vec2 v_textureCoordinates;
   
   void main() {
     vec4 color = texture(colorTexture, v_textureCoordinates);
     // Your effect here — example: desaturate
     float grey = dot(color.rgb, vec3(0.299, 0.587, 0.114));
     out_FragColor = vec4(grey, grey, grey, color.a);
   }
   ```

2. Register it in `src/frontend/globe/GlobeRenderer.js`:
   ```javascript
   import myShaderGLSL from '../shaders/myshader.glsl?raw';
   
   const SHADERS = {
     normal: null,
     nightvision: nightvisionGLSL,
     flir: flirGLSL,
     crt: crtGLSL,
     celshading: celShadingGLSL,
     myshader: myShaderGLSL,   // ← Add this line
   };
   ```

3. Add a UI entry in `src/frontend/ui/Settings.js`:
   ```javascript
   { key: 'myshader', label: 'My Custom Shader' }
   ```

---

## 12. Development Workflow

### Branching Strategy

```
main              ← Production-ready code (protected)
  └── develop     ← Integration branch
        ├── feature/aircraft-layer
        ├── feature/replay-engine
        ├── fix/satellite-orbit-calculation
        └── chore/update-dependencies
```

**Rules:**
- Never commit directly to `main`
- Create feature branches from `develop`
- Open a Pull Request to merge into `develop`
- `develop` is merged to `main` only via a release PR

### Creating a Feature Branch

```bash
git checkout develop
git pull origin develop
git checkout -b feature/my-feature-name
# ... make your changes ...
git add .
git commit -m "feat: add my feature"
git push origin feature/my-feature-name
# Then open a Pull Request on GitHub
```

### Commit Message Format

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | When to use |
|---|---|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation changes only |
| `style:` | Formatting, whitespace (no logic change) |
| `refactor:` | Code restructure without behaviour change |
| `test:` | Adding or fixing tests |
| `chore:` | Build scripts, CI config, dependency updates |

**Examples:**
```bash
git commit -m "feat: add FLIR thermal shader mode"
git commit -m "fix: satellite orbit prediction at high latitudes"
git commit -m "docs: update API key setup instructions"
git commit -m "chore: upgrade Cesium.js to v1.115"
```

### Code Style

- **ESLint** enforces code quality rules (run `npm run lint`)
- **Prettier** enforces consistent formatting (run `npm run format`)
- Both run automatically in the CI pipeline — PRs that fail lint are blocked from merging

---

## 13. Adding & Modifying Features

### Adding a New OSINT Layer

Follow these steps to add a completely new data layer (e.g., earthquake data):

**1. Create the backend route:**
```javascript
// src/backend/routes/earthquakes.js
import express from 'express';
const router = express.Router();

router.get('/', async (req, res) => {
  // Fetch from USGS earthquake API (free, no key)
  const response = await fetch(
    'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson'
  );
  const data = await response.json();
  res.json(data.features.map(f => ({
    id: f.id,
    latitude: f.geometry.coordinates[1],
    longitude: f.geometry.coordinates[0],
    magnitude: f.properties.mag,
    place: f.properties.place,
    time: f.properties.time,
  })));
});

export default router;
```

**2. Register the route in `server.js`:**
```javascript
import earthquakesRouter from './routes/earthquakes.js';
app.use('/api/earthquakes', earthquakesRouter);
```

**3. Create the frontend layer:**
```javascript
// src/frontend/layers/EarthquakeLayer.js
export class EarthquakeLayer {
  constructor(viewer) {
    this.viewer = viewer;
    this.entities = [];
    this.refreshInterval = 5 * 60 * 1000; // 5 minutes
  }

  async load() {
    const data = await fetch('/api/earthquakes').then(r => r.json());
    this.clear();
    data.forEach(eq => {
      this.entities.push(this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(eq.longitude, eq.latitude),
        point: {
          pixelSize: Math.max(5, eq.magnitude * 5),
          color: Cesium.Color.RED.withAlpha(0.8),
        },
        label: { text: `M${eq.magnitude} - ${eq.place}` },
      }));
    });
  }

  clear() {
    this.entities.forEach(e => this.viewer.entities.remove(e));
    this.entities = [];
  }

  startPolling() {
    this.load();
    this._timer = setInterval(() => this.load(), this.refreshInterval);
  }

  stopPolling() {
    clearInterval(this._timer);
  }
}
```

**4. Register the layer in `LayerPanel.js`:**
```javascript
import { EarthquakeLayer } from '../layers/EarthquakeLayer.js';

// In the layers registry:
{ key: 'earthquakes', label: 'Earthquakes', LayerClass: EarthquakeLayer }
```

### Modifying an Existing Layer

To change how the Aircraft layer displays data (e.g., colour aircraft by altitude):

1. Open `src/frontend/layers/AircraftLayer.js`
2. Find the entity creation code and modify the colour logic:
   ```javascript
   // Before
   color: Cesium.Color.CYAN

   // After (colour by altitude: blue=low, red=high)
   color: Cesium.Color.fromHsl(
     (1 - Math.min(aircraft.altitude / 12000, 1)) * 0.67, // hue: blue→red
     1.0,
     0.5
   )
   ```
3. Save and hot-reload will apply the change immediately.

### Modifying the Backend API

To add a new field to an existing API response (e.g., add `callsign` to aircraft):

1. Open `src/backend/routes/aircraft.js`
2. Update the data mapping to include the new field:
   ```javascript
   // Before
   return { id, latitude, longitude, altitude };

   // After
   return { id, latitude, longitude, altitude, callsign: raw.callsign?.trim() };
   ```
3. The frontend `AircraftLayer.js` can now read `aircraft.callsign`

### Changing the Globe Provider

To switch from Google 3D Tiles to Cesium Ion terrain:

1. Open `src/frontend/globe/TileManager.js`
2. Comment out the Google Tiles loader and enable the Cesium Ion loader:
   ```javascript
   // Google 3D Tiles (current)
   // const tileset = await Cesium.Cesium3DTileset.fromUrl(
   //   `https://tile.googleapis.com/v1/3dtiles/root.json?key=${GOOGLE_KEY}`
   // );

   // Cesium Ion World Terrain (alternative)
   const tileset = await Cesium.createWorldTerrainAsync({
     requestWaterMask: true,
     requestVertexNormals: true,
   });
   ```

---

## 14. Testing

### Running Tests

```bash
npm test                # Run all tests
npm run test:unit       # Unit tests only (fast)
npm run test:integration# Integration tests (needs backend)
npm run test:coverage   # Coverage report
```

### Test Structure

```
tests/
├── unit/
│   ├── layers/
│   │   ├── AircraftLayer.test.js
│   │   └── SatelliteLayer.test.js
│   ├── replay/
│   │   └── ReplayEngine.test.js
│   └── utils/
│       └── coordinate.test.js
└── integration/
    ├── api/
    │   ├── aircraft.test.js
    │   └── maritime.test.js
    └── db/
        └── migration.test.js
```

### Writing a Test

Tests use **Jest**. Here is a simple example for a new layer:

```javascript
// tests/unit/layers/EarthquakeLayer.test.js
import { EarthquakeLayer } from '../../../src/frontend/layers/EarthquakeLayer.js';

describe('EarthquakeLayer', () => {
  let mockViewer;

  beforeEach(() => {
    mockViewer = {
      entities: {
        add: jest.fn().mockReturnValue({ id: '1' }),
        remove: jest.fn(),
      },
    };
  });

  it('should load earthquake data and add entities', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => [
        { id: 'eq1', latitude: 37.7, longitude: -122.4, magnitude: 3.5, place: 'San Francisco' },
      ],
    });

    const layer = new EarthquakeLayer(mockViewer);
    await layer.load();

    expect(mockViewer.entities.add).toHaveBeenCalledTimes(1);
  });

  it('should clear entities before reloading', async () => {
    global.fetch = jest.fn().mockResolvedValue({ json: async () => [] });
    const layer = new EarthquakeLayer(mockViewer);
    layer.entities = [{ id: 'old' }];

    await layer.load();

    expect(mockViewer.entities.remove).toHaveBeenCalledTimes(1);
  });
});
```

---

## 15. Deployment

### Option A — Docker Compose (Recommended)

The simplest path to production:

```bash
# On your server
git clone https://github.com/NaustudentX18/Eagle-eye.git
cd Eagle-eye
cp .env.example .env
# Edit .env with production values (NODE_ENV=production, real API keys, PostgreSQL URL)
docker compose up -d --build
```

This starts the app in detached mode. It will automatically restart on server reboot if Docker is configured to start on boot.

**Useful Docker commands:**
```bash
docker compose ps           # Check status of all services
docker compose logs -f      # Stream all logs
docker compose logs -f app  # Stream only the app service logs
docker compose down         # Stop and remove containers
docker compose pull         # Pull latest images
docker compose up -d        # Restart in detached mode
```

---

### Option B — Manual Node.js Deployment

On a server with Node.js installed:

```bash
# Install dependencies
npm ci --only=production

# Build the frontend
npm run build

# Set environment
export NODE_ENV=production

# Run database migrations
npm run db:migrate

# Start the server (use a process manager in production)
npm start
```

**Using PM2 as a process manager (keeps the app alive after crashes):**
```bash
# Install PM2 globally
npm install -g pm2

# Start the app with PM2
pm2 start npm --name "omnirecon" -- start

# Auto-start on server reboot
pm2 startup
pm2 save

# Monitor
pm2 status
pm2 logs omnirecon
pm2 restart omnirecon
```

---

### Option C — Static CDN + Serverless Backend

For maximum scalability, deploy the frontend as a static site and the backend as serverless functions:

**Frontend (Netlify / Vercel / Cloudflare Pages):**
```bash
npm run build
# Upload the dist/ folder to your CDN of choice
```

**Backend (Vercel Functions / AWS Lambda):**
- Each route in `src/backend/routes/` becomes a serverless function
- WebSocket support requires a service like Ably, Pusher, or AWS API Gateway WebSockets

---

### Nginx Reverse Proxy (Production)

When running behind Nginx, use this configuration to proxy both HTTP and WebSocket traffic:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate     /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Serve the frontend PWA (static build from dist/)
    root /var/www/omnirecon/dist;
    index index.html;
    try_files $uri $uri/ /index.html;  # SPA routing fallback

    # Proxy REST API to Node.js backend
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Proxy WebSocket to live data server
    location /ws {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }

    # Cache static assets aggressively (they have content hashes in their names)
    location ~* \.(js|css|png|jpg|svg|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

---

### PWA Installation on Mobile

Because OmniRecon is a PWA, users can install it to their home screen without an app store:

**iOS (Safari):**
1. Open the app URL in Safari
2. Tap the **Share** icon (box with arrow pointing up)
3. Scroll down and tap **Add to Home Screen**
4. Tap **Add** to confirm

**Android (Chrome):**
1. Open the app URL in Chrome
2. Tap the **three-dot menu (⋮)**
3. Tap **Add to Home Screen** or **Install App**
4. Tap **Install** to confirm

Once installed, OmniRecon runs in full-screen mode and works offline using cached tile and layer data.

---

## 16. CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/ci.yml`) runs automatically on every push to `main` and every Pull Request.

### Pipeline Stages

```
Push / Pull Request
       │
       ▼
┌─────────────┐
│   Checkout  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Node Setup │  (Node 18 LTS)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Install    │  npm ci (clean install from lock file)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│    Lint     │  npm run lint (ESLint)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│    Test     │  npm test (Jest)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│    Build    │  npm run build (Vite)
└──────┬──────┘
       │
       ▼
┌─────────────┐    (only on main branch)
│   Deploy    │ ──────────────────────────▶ Production server
└─────────────┘
```

### Workflow File

The pipeline is defined in `.github/workflows/ci.yml`. To modify the pipeline:

1. Edit the YAML file directly
2. Valid trigger events: `push`, `pull_request`, `schedule`, `workflow_dispatch`
3. Adding a new step:
   ```yaml
   - name: My new step
     run: npm run my-script
   ```

### Required GitHub Secrets

For the deploy step to work, configure these secrets in **GitHub → Settings → Secrets and Variables → Actions:**

| Secret | Purpose |
|---|---|
| `DEPLOY_SSH_KEY` | Private SSH key for deployment server |
| `DEPLOY_HOST` | Deployment server hostname or IP |
| `DEPLOY_USER` | SSH username on deployment server |
| `GOOGLE_3D_TILES_API_KEY` | Google API key (for production build) |

---

## 17. Troubleshooting

### Globe Doesn't Load / Black Screen

**Symptom:** The browser shows a black screen where the globe should be.

**Causes & Fixes:**
1. **WebGL not supported** — Check `chrome://gpu` (Chrome) or `about:support` (Firefox). Ensure WebGL is enabled.
2. **Google 3D Tiles key missing** — Check that `GOOGLE_3D_TILES_API_KEY` is set in `.env` and is valid.
3. **CORS error** — Open browser DevTools → Network tab. Look for blocked requests. Ensure the backend is running.
4. **Wrong Cesium version** — Run `npm install` to ensure the correct version from `package-lock.json` is installed.

```bash
# Check if backend is running
curl http://localhost:3000/api/health
# Expected: {"status":"ok"}
```

---

### No Aircraft / Satellites Showing

**Symptom:** The globe loads but OSINT layers are empty.

**Causes & Fixes:**
1. **API credentials missing** — Verify `OPENSKY_USERNAME` and `OPENSKY_PASSWORD` in `.env`.
2. **Rate limited** — OpenSky limits unauthenticated requests. Check backend logs: `npm run docker:logs` or `pm2 logs`.
3. **Network firewall** — Ensure the backend server can reach external APIs (no corporate proxy blocking outbound traffic).
4. **Layer toggled off** — Open the Layer Panel and ensure the layer is enabled.

```bash
# Test OpenSky API directly
curl "https://opensky-network.org/api/states/all?lamin=45&lomin=5&lamax=50&lomax=15"
# Should return JSON with aircraft states
```

---

### `npm install` Fails

**Symptom:** Error during installation with `npm install`.

**Fixes:**
```bash
# Ensure you have the right Node version
node --version  # Must be v18+

# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

### Database Migration Errors

**Symptom:** `npm run db:migrate` throws an error.

**Fixes:**
1. Ensure `DATABASE_URL` in `.env` is correct
2. For SQLite, ensure the `data/` directory exists:
   ```bash
   mkdir -p data
   ```
3. For PostgreSQL, ensure the database exists and credentials are correct:
   ```bash
   psql -U your_user -c "CREATE DATABASE omnirecon;"
   ```

---

### PWA Not Installing on Mobile

**Symptom:** "Add to Home Screen" option doesn't appear.

**Requirements for PWA install prompt:**
1. The site must be served over **HTTPS** (not HTTP)
2. A valid `manifest.json` must be linked in `index.html`
3. A service worker must be registered and active

Check in Chrome DevTools → **Application** → **Service Workers** and **Manifest**.

---

### Performance Issues on Mobile

**Symptom:** Globe is laggy or crashes on mobile devices.

**Fixes:**
1. Reduce tile quality in Settings → Globe Quality → set to "Low" or "Medium"
2. Disable heavy layers (CCTV feeds, traffic density) on mobile
3. Disable shader modes (they are GPU-intensive)
4. Enable "Mobile Mode" in Settings → reduces tile budget and layer refresh rates
5. Close other browser tabs

---

## 18. Glossary

| Term | Definition |
|---|---|
| **ADS-B** | Automatic Dependent Surveillance–Broadcast. A system where aircraft broadcast their position, altitude, and speed. Used for live aircraft tracking. |
| **AIS** | Automatic Identification System. Mandatory vessel tracking system for ships over 300 gross tons. Used for maritime tracking. |
| **CelesTrak** | A free public service providing TLE data for satellite tracking. |
| **Cesium.js** | An open-source JavaScript library for 3D globe and map rendering. Used as the core rendering engine. |
| **Dark Ship** | A vessel that has disabled or is not broadcasting its AIS transponder. A key maritime intelligence signal. |
| **FLIR** | Forward-Looking Infrared. A thermal imaging technology. The FLIR shader simulates this effect on the globe. |
| **GLSL** | OpenGL Shading Language. The programming language used to write GPU shader effects. |
| **GPS Jamming** | Deliberate interference with GPS signals, typically by military or criminal actors. Visualised as zones on the globe. |
| **HLS** | HTTP Live Streaming. An adaptive video streaming protocol used for CCTV feeds. |
| **Hot Reload** | A development feature that applies code changes to the running app without a full page refresh. |
| **Nodemon** | A utility that monitors Node.js files for changes and automatically restarts the server. Used in development. |
| **OSINT** | Open Source Intelligence. Intelligence gathered from publicly available sources (ADS-B, AIS, public cameras, etc.). |
| **PM2** | A production process manager for Node.js applications. Keeps the app running and restarts it on crashes. |
| **PWA** | Progressive Web App. A web application that can be installed on a device and works offline using service workers. |
| **RTSP** | Real Time Streaming Protocol. A protocol for streaming video from cameras. |
| **Service Worker** | A browser background script that enables PWA features like offline caching and push notifications. |
| **SGP4** | Simplified General Perturbations model 4. The standard algorithm for propagating satellite orbital positions from TLE data. |
| **TLE** | Two-Line Element set. A data format encoding a satellite's orbital parameters, used with SGP4 to predict position. |
| **Vite** | A fast frontend build tool and development server. Used to bundle the OmniRecon PWA. |
| **WebGPU** | The next-generation GPU API for the web. Enables more advanced graphics than WebGL. |
| **WebGL** | Web Graphics Library. The current standard API for GPU-accelerated rendering in browsers. |
| **WebSocket** | A protocol providing full-duplex communication channels over a single TCP connection. Used for real-time data push. |
| **WGSL** | WebGPU Shading Language. The shader language for WebGPU (analogous to GLSL for WebGL). |

---

*Last updated: March 2026 — OmniRecon / Eagle-eye project*

*For questions, open an [issue on GitHub](https://github.com/NaustudentX18/Eagle-eye/issues).*
