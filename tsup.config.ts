import type { Options } from 'tsup';

export const tsup: Options = {
	dts: true,
	entryPoints: ['src/index.ts', 'src/vite.ts', 'src/server.ts', 'src/client.ts'],
	external: [],
	format: ['esm', 'cjs'],
	legacyOutput: false,
	sourcemap: true,
	splitting: false,
	bundle: true,
	clean: true
};
