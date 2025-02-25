import * as path from 'node:path';
import * as url from 'node:url';
import * as fs from 'node:fs';
import { createWSSGlobalInstance, onHttpServerUpgrade } from './src/lib/server/webSocketUtils';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(
	JSON.stringify(
		{
			filename: __filename,
			dirname: __dirname,
			files: fs.readdirSync(__dirname),
			sveltekit: fs.readdirSync(path.resolve(__dirname, './.svelte-kit')),
			build: fs.readdirSync(path.resolve(__dirname, './.svelte-kit/cloudflare')),
			app: fs.readdirSync(path.resolve(__dirname, './.svelte-kit/cloudflare/_app'))
		},
		null,
		2
	)
);

createWSSGlobalInstance();

const { server } = await import(path.resolve(__dirname, './.svelte-kit/cloudflare/_worker.js'));
server.server.on('upgrade', onHttpServerUpgrade);
