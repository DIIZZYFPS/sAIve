import axios from 'axios';

// Default to localhost:8000 — will be updated at startup via configureApi()
const api = axios.create({
  baseURL: 'http://localhost:8000',
});

/**
 * Called once at app startup to set the backend port.
 * In Electron, this reads the dynamic port from the main process.
 * Falls back to 8000 if not running in Electron.
 */
export async function configureApi() {
  try {
    const port = await (window as any).electronAPI?.getBackendPort();
    if (port) {
      api.defaults.baseURL = `http://localhost:${port}`;
    }
  } catch {
    // Not in Electron or IPC unavailable — keep default
  }
}

export default api;