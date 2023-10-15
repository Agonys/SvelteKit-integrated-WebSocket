import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
//@ts-ignore
import nodePolyfills from 'vite-plugin-node-stdlib-browser';

import { createWSSGlobalInstance, onHttpServerUpgrade } from './src/lib/server/webSocketUtils';

export default defineConfig({
	plugins: [
		nodePolyfills(),
		sveltekit(),
		{
			name: 'integratedWebsocketServer',
			configureServer(server) {
				createWSSGlobalInstance();
				server.httpServer?.on('upgrade', onHttpServerUpgrade);
			},
			configurePreviewServer(server) {
				createWSSGlobalInstance();
				server.httpServer?.on('upgrade', onHttpServerUpgrade);
			}
		}
	]
});
