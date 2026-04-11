import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

export default defineConfig({
	plugins: [svelte()],
	resolve: {
		conditions: ['browser'],
		alias: {
			$lib: path.resolve('./src/lib')
		}
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		globals: true,
		environment: 'jsdom',
		setupFiles: ['./src/test/setup.ts'],
		coverage: {
			provider: 'v8',
			include: ['src/lib/**/*.ts'],
			exclude: ['src/lib/**/*.test.ts', 'src/lib/**/*.spec.ts', 'src/lib/index.ts'],
			reporter: ['text', 'html', 'json-summary'],
			thresholds: {
				statements: 95,
				branches: 70,
				functions: 95,
				lines: 95
			}
		}
	}
});
