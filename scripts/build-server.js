import * as esbuild from 'esbuild';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function build() {
    try {
        await esbuild.build({
            entryPoints: [path.resolve(__dirname, '../server/index.ts')],
            bundle: true,
            platform: 'node',
            target: 'node20',
            outfile: path.resolve(__dirname, '../dist/index.js'),
            format: 'esm',
            packages: 'external',
            external: [
                'fsevents',
                'pg-native',
                'canvas',
                'vite',
                'lightningcss'
            ],
            alias: {},
            sourcemap: true,
            minify: false, // Keep it readable for debugging if needed
            logLevel: 'info',
        });
        console.log('Server build complete!');
    } catch (e) {
        console.error('Server build failed:', e);
        process.exit(1);
    }
}

build();
