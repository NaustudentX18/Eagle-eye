/**
 * OmniRecon — Main application entry point
 *
 * Initialises the PWA shell and mounts the geospatial command center.
 */

export function init(rootEl) {
  rootEl.innerHTML = `
    <div class="omni-shell">
      <header class="omni-header">OmniRecon</header>
      <main class="omni-globe" id="globe-container"></main>
    </div>
  `;
}

const root = document.getElementById('app');
if (root) {
  init(root);
}
