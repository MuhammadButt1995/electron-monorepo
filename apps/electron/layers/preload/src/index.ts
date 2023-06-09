/**
 * @module preload
 */

import { contextBridge, ipcRenderer } from 'electron';

export type ConnectionStatus =
  | 'LOADING'
  | 'CONNECTED'
  | 'NOT CONNECTED'
  | 'ERROR';

export type WiFiStatus = 'LOADING' | 'RELIABLE' | 'DECENT' | 'SLOW' | 'ERROR';

export type DiskSpaceState = 'LOADING' | 'LOW' | 'MEDIUM' | 'HIGH' | 'ERROR';

// Expose version number to renderer
contextBridge.exposeInMainWorld(
  'onInternetStatusChange',
  (state: ConnectionStatus) => ipcRenderer.send('onInternetStatusChange', state)
);

contextBridge.exposeInMainWorld('onADStatusChange', (state: ConnectionStatus) =>
  ipcRenderer.send('onADStatusChange', state)
);

contextBridge.exposeInMainWorld(
  'onDomainStatusChange',
  (state: ConnectionStatus) => ipcRenderer.send('onDomainStatusChange', state)
);

contextBridge.exposeInMainWorld('onWiFiStatusChange', (state: WiFiStatus) =>
  ipcRenderer.send('onWiFiStatusChange', state)
);

contextBridge.exposeInMainWorld(
  'onLDAPPasswordExpiresInChange',
  (state: string) => ipcRenderer.send('onLDAPPasswordExpiresInChange', state)
);

contextBridge.exposeInMainWorld(
  'onDiskSpaceStatusChange',
  (state: DiskSpaceState) => ipcRenderer.send('onDiskSpaceStatusChange', state)
);

/**
 * The "Main World" is the JavaScript context that your main renderer code runs in.
 * By default, the page you load in your renderer executes code in this world.
 *
 * @see https://www.electronjs.org/docs/api/context-bridge
 */

/**
 * After analyzing the `exposeInMainWorld` calls,
 * `packages/preload/exposedInMainWorld.d.ts` file will be generated.
 * It contains all interfaces.
 * `packages/preload/exposedInMainWorld.d.ts` file is required for TS is `renderer`
 *
 * @see https://github.com/cawa-93/dts-for-context-bridge
 */
