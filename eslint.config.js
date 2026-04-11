import js from '@eslint/js';
import ts from 'typescript-eslint';
import svelte from 'eslint-plugin-svelte';

export default ts.config(
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs['flat/recommended'],
	{
		languageOptions: {
			globals: {
				// Browser globals
				console: 'readonly',
				alert: 'readonly',
				window: 'readonly',
				document: 'readonly',
				fetch: 'readonly',
				setTimeout: 'readonly',
				clearTimeout: 'readonly',
				setInterval: 'readonly',
				clearInterval: 'readonly',
				localStorage: 'readonly',
				requestAnimationFrame: 'readonly',
				confirm: 'readonly',
				// DOM types
				Node: 'readonly',
				Event: 'readonly',
				KeyboardEvent: 'readonly',
				DragEvent: 'readonly',
				HTMLElement: 'readonly',
				HTMLInputElement: 'readonly',
				HTMLTextAreaElement: 'readonly',
				HTMLDivElement: 'readonly',
				MouseEvent: 'readonly',
				CustomEvent: 'readonly',
				HTMLSelectElement: 'readonly',
				HTMLAnchorElement: 'readonly',
				HTMLButtonElement: 'readonly',
				// Svelte 5 reactive collection types
				SvelteSet: 'readonly',
				SvelteMap: 'readonly',
				// Svelte 5 rune globals
				$state: 'readonly',
				$derived: 'readonly',
				$effect: 'readonly',
				$props: 'readonly',
				$bindable: 'readonly',
				$inspect: 'readonly',
				$host: 'readonly'
			},
			parserOptions: {
				extraFileExtensions: ['.svelte']
			}
		}
	},
	{
		files: ['**/*.svelte', '**/*.svelte.ts'],
		languageOptions: {
			parserOptions: {
				parser: ts.parser
			}
		}
	},
	{
		ignores: ['dist/', 'node_modules/', '.svelte-kit/', 'build/', '.vercel/']
	},
	{
		rules: {
			'@typescript-eslint/no-unused-vars': [
				'error',
				{ argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
			],
			'@typescript-eslint/no-explicit-any': 'error',
			'svelte/no-at-html-tags': 'warn',
			// Svelte 5.53+ keyed #each triggers $.validate_each_keys runtime error in dev
			'svelte/require-each-key': 'off',
			// False positive for regular <a> tags and goto() in $effect in pure client-side SvelteKit
			'svelte/no-navigation-without-resolve': 'off'
		}
	}
);
