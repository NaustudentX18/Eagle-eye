/**
 * OmniRecon — Frontend Entry Point
 * Initialises the 3D globe and OSINT data layers.
 */

const GLOBE_CONTAINER_ID = 'globe-container';

/**
 * Bootstrap the application.
 */
async function init() {
  const container = document.getElementById(GLOBE_CONTAINER_ID);
  if (!container) {
    console.error(`Element #${GLOBE_CONTAINER_ID} not found`);
    return;
  }

  console.log('OmniRecon initialising…');

  // Future: initialise GlobeRenderer, layers, and UI components here.
  container.textContent = 'OmniRecon loading…';
}

init();
