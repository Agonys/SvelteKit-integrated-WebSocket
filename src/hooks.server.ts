import { building } from '$app/environment';
import { GlobalThisWSS } from '$lib/server/webSocketUtils';
import type { Handle } from '@sveltejs/kit';
import type { ExtendedGlobal } from '$lib/server/webSocketUtils';

// This can be extracted into a separate file
let wssInitialized = false;
const startupWebsocketServer = () => {
	if (wssInitialized) return;
	console.log('[wss:kit] setup');
	const wss = (globalThis as ExtendedGlobal)[GlobalThisWSS];
	console.log(`[wss:kit] clients: ${wss?.clients.size}`);
	if (wss !== undefined) {
		wss.on('connection', (ws, _request) => {
			// This is where you can authenticate the client from the request
			// const session = await getSessionFromCookie(request.headers.cookie || '');
			// if (!session) ws.close(1008, 'User not authenticated');
			// ws.userId = session.userId;
			console.log(`[wss:kit] client connected (${ws.socketId})`);
			ws.send(`Hello from SvelteKit ${new Date().toLocaleString()} (${ws.socketId})]`);

			ws.on('close', () => {
				console.log(`[wss:kit] client disconnected (${ws.socketId})`);
			});

			ws.on('message', (message: Buffer) => {
				const msg = message.toString();
				wss.clients.forEach((client) => {
					if (client.readyState === 1) {
						client.send(`One of users send a message to the server: ${msg}`);
					}
				});
			});
		});
		wssInitialized = true;
	}
};

export const handle = (async ({ event, resolve }) => {
	startupWebsocketServer();
	// Skip WebSocket server when pre-rendering pages
	if (!building) {
		const wss = (globalThis as ExtendedGlobal)[GlobalThisWSS];
		if (wss !== undefined) {
			event.locals.wss = wss;
		}
	}
	const response = await resolve(event, {
		filterSerializedResponseHeaders: (name) => name === 'content-type'
	});
	return response;
}) satisfies Handle;
