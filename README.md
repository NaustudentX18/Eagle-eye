# OmniRecon

## Overview
OmniRecon is a cutting-edge, mobile-optimized geospatial command center designed to emulate advanced systems like WorldView. It renders a 3D globe with live and historical OSINT data, allowing for time-scrubbing playback and stunning visuals, including shader modes such as night vision, FLIR, and more. OmniRecon is modular, efficient, and built as a Progressive Web App (PWA) to function seamlessly on iOS and Android devices. Ideal for navigation, reconnaissance, and real-time tracking, OmniRecon brings powerful tools into the hands of everyday users.

## Features
- **3D Globe Rendering:** High-quality photorealistic tiles using Google’s 3D Tiles API, with view controls for orbiting, tilting, and zooming.
- **Shader Modes:** Includes custom modes like CRT scan lines, night vision, FLIR thermal overlay, and anime cel-shading.
- **Real-Time OSINT Layers:**
  - Aircraft tracking via ADS-B Exchange/OpenSky Network.
  - Satellite monitoring using CelesTrak TLE data.
  - Vehicle traffic density from OpenStreetMap.
  - Public CCTV video feeds geo-anchored to the 3D map.
  - Maritime tracking with AIS data and “dark ship” detections.
  - GPS jamming and internet blackouts visualized in real-time.
- **Operation Replay:** Time-scrubbing playback of OSINT data for cohesive event analysis.
- **AI-Powered Backend:** AI agents handle data ingestion, parsing, and live synchronization.
- **Mobile Optimization:** Responsive PWA interface with minimal GPU and memory footprints.

## Getting Started
To begin using OmniRecon, follow these instructions:

### Prerequisites
- Node.js (v16+ recommended)
- Modern browser supporting WebGL/WebGPU for 3D rendering
- API keys for required data sources

### Installation
1. Clone this repository:
   ```bash
   git clone https://github.com/NaustudentX18/Eagle-eye.git
   ```
2. Navigate to the project directory:
   ```bash
   cd Eagle-eye
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm start
   ```

## Roadmap
- [ ] Implement 3D globe rendering
- [ ] Add real-time layers (aircraft, satellite, traffic, etc.)
- [ ] Develop shader effects
- [ ] Deploy mobile-responsive PWA
- [ ] Optimize AI pipeline for data processing

## License
This project is open-source and available under the MIT License. See the [LICENSE](https://github.com/NaustudentX18/Eagle-eye/blob/main/LICENSE) file for details.