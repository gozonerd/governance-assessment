# D2R Stage 00: Research Summary

## AI Governance Readiness Assessment Tool

**Date:** 2026-04-11
**Version:** v01_I
**Purpose:** Research current best practices for all implementation targets before writing any code. This document is the required input for all subsequent D2R stages.

---

## Research Target 1: SvelteKit (Latest Stable)

### Best Practice

- **Current version:** `@sveltejs/kit` 2.57.1 (published April 10, 2026)
- **Scaffold command:** `npx sv@latest create <project-name>` (NOT the old `npm create svelte@latest`)
  - The `sv` CLI is the current official tool
  - Interactive prompts: choose template (minimal), TypeScript, then add-ons (tailwind, eslint, prettier, vitest)
- **Routing:** File-based. `src/routes/+page.svelte`, `src/routes/+layout.svelte`, `src/routes/assess/+page.svelte`, `src/routes/results/+page.svelte`
- **SSG vs SSR:** For this all-client-side assessment tool, SSR is acceptable (pages are lightweight); `prerender = true` can be added where no dynamic data exists. The results page cannot be prerendered (state-dependent).
- **Sources:** svelte.dev/blog, npmjs.com/@sveltejs/kit, github.com/sveltejs/kit/releases

### Applies To

Stage 01 (scaffold), Stage 04 (routing)

### Pitfalls

- Old `npm create svelte@latest` is superseded by `npx sv@latest create`
- Do NOT mix adapter-auto and adapter-vercel — use adapter-vercel explicitly for Vercel deployments

---

## Research Target 2: Svelte 5 Runes

### Best Practice

- **Core runes:** `$state` (mutable reactive), `$derived` (computed), `$effect` (side effects, post-DOM), `$props()` (component props)
- **Class-based store pattern (2026 standard):** `$state` and `$derived` work inside standard TypeScript classes. No need for Svelte 4 `writable`/`readable` stores. Export a single class instance.
- **$props() pattern:**
  ```typescript
  interface Props {
  	title: string;
  	onClose: () => void;
  }
  let { title, onClose }: Props = $props();
  ```
- **File naming:** Files using runes outside `.svelte` components MUST be named `*.svelte.ts` or `*.svelte.js` — the Svelte compiler processes these. Plain `.ts` files do NOT have runes compiled.
- **Sources:** svelte.dev/blog/runes, pkgpulse.com/blog/svelte-5-runes-complete-guide-2026, onehorizon.ai/blog/svelte-best-practices-in-2026

### Existing Pattern (Orchestra — `ui.svelte.ts`)

```typescript
class UIStore {
	private _currentView = $state<View>('start');
	// ...
	get currentView() {
		return this._currentView;
	}
	setView(view: View) {
		this._currentView = view;
	}
}
export const ui = new UIStore();
```

This pattern is confirmed correct for 2026. Mirror it exactly for `assessment.svelte.ts`.

### Applies To

Stage 03 (store), Stage 04–05 (components using $props)

### Pitfalls

- **CRITICAL:** Store files MUST be named `assessment.svelte.ts` (not `assessment.ts`) or runes will not be compiled
- **CRITICAL:** Test files for stores using runes MUST be named `assessment.svelte.test.ts` (not `assessment.test.ts`) for Vitest to compile rune syntax
- `$effect` should NOT be used for synchronous derived logic — use `$derived` instead

---

## Research Target 3: Tailwind CSS 4

### Best Practice

- **Version:** Tailwind CSS 4.x is stable in 2026
- **Install:** `npm install tailwindcss @tailwindcss/vite`
- **Vite config:** Add `@tailwindcss/vite` as a Vite plugin (NOT `@tailwindcss/postcss` — the vite plugin is the preferred approach for Vite projects)
- **CSS import:** `@import "tailwindcss";` (one line replaces the 3 Tailwind 3 directives)
- **Configuration:** NO `tailwind.config.js` — all customization in CSS via `@theme {}` directive
- **@theme directive:**
  ```css
  @import 'tailwindcss';
  @theme {
  	--color-primary: #1e3a5f;
  	--color-accent: #0d9488;
  }
  ```
  Variables declared in `@theme` generate corresponding utility classes (e.g., `bg-primary`, `text-accent`)
- **`sv add tailwind`:** The `sv` CLI can add Tailwind 4 to an existing project — handles vite plugin setup automatically
- **Sources:** tailwindcss.com/blog/tailwindcss-v4, dev.to/fedor-pasynkov/setting-up-tailwind-css-v4-in-sveltekit-the-vite-plugin-way

### Existing Pattern (Orchestra — `app.css`)

```css
@import 'tailwindcss';
@theme {
	--color-bg-primary: #0d1117;
	--color-primary: #4ec9b0;
	/* etc */
}
```

Confirmed working in production. Mirror this pattern exactly.

### Applies To

Stage 01 (setup), Stage 04–05 (styling)

### Pitfalls

- Using `@tailwindcss/postcss` instead of `@tailwindcss/vite` — use the Vite plugin for Vite/SvelteKit projects
- Forgetting to remove old `tailwind.config.js` if migrating
- Custom properties in `@theme` generate utilities; custom properties in `:root` do NOT

---

## Research Target 4: jsPDF

### Best Practice

- **Current version:** jsPDF 4.2.1 (latest stable on npm as of April 2026)
  - Version history: 2.5.2 → 3.0.x → 4.0.0 → 4.2.1
  - **Security note:** CVE-2026-25535 affects versions prior to 4.2.0 (html function vulnerability). Use 4.2.1 — this is the safe version.
- **Install:** `npm install jspdf`
- **Migration from 2.x:** jsPDF 4.x has **no breaking API changes** from 2.x for core features — main changes are IE support drop and security fixes. Core text/rect/page methods unchanged.
- **Client-side usage:** Works entirely in the browser — no server required
- **Core API:**
  ```typescript
  import { jsPDF } from 'jspdf';
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  doc.setFontSize(24);
  doc.setTextColor(30, 58, 95); // RGB values
  doc.text('Title', 20, 30); // text, x, y (in mm)
  doc.rect(20, 40, 170, 10); // x, y, width, height (in mm)
  doc.line(20, 50, 190, 50); // x1, y1, x2, y2 (in mm)
  doc.addPage();
  doc.save('report.pdf'); // triggers browser download
  ```
- **Page count:** `doc.internal.getNumberOfPages()` — use for tests
- **Multi-page:** Call `doc.addPage()` between pages; `doc.save()` triggers download
- **SvelteKit import:** Dynamic import recommended to avoid SSR issues:
  ```typescript
  const { jsPDF } = await import('jspdf');
  ```
- **Sources:** npmjs.com/package/jspdf, github.com/parallax/jsPDF/releases, artskydj.github.io/jsPDF/docs

### Pitfalls

- **CRITICAL:** jsPDF may fail in Node/jsdom if it accesses browser-only APIs during construction. Use explicit `{ unit: 'mm', format: 'a4' }` constructor options and dynamic import
- Do NOT use `html2canvas` with jsPDF — this project uses direct jsPDF API only (no screenshot capture)
- Colors must be set with `doc.setTextColor(r, g, b)` or `doc.setDrawColor(r, g, b)` before each text/rect call that needs a specific color
- For jsdom tests: wrap `doc.save()` in a check or mock — jsdom may not support file downloads, but construction + page operations should work
- **Security:** Always use jsPDF 4.2.0+ (CVE-2026-25535 fixed). Do NOT pin to 2.x or 3.x.

### Applies To

Stage 06 (PDF report), Stage 06 tests

---

## Research Target 5: adapter-vercel

### Best Practice

- **Current version:** `@sveltejs/adapter-vercel` 6.3.3 (published ~1 month ago)
- **Install:** `npm install -D @sveltejs/adapter-vercel`
- **svelte.config.js:**
  ```javascript
  import adapter from '@sveltejs/adapter-vercel';
  const config = {
  	kit: {
  		adapter: adapter({
  			runtime: 'nodejs20.x' // explicit — do not rely on auto-detection
  		})
  	}
  };
  export default config;
  ```
- **Runtime options:** `'edge'`, `'nodejs20.x'`, `'nodejs22.x'`. Use `nodejs20.x` for full SvelteKit compatibility (edge has restrictions: no `fs`, limited Node APIs)
- **Build command:** `npm run build` (SvelteKit produces `.vercel/output/`)
- **Vercel settings:** Framework preset: SvelteKit; Install command: `npm ci`; Node version: 20.x
- **Sources:** svelte.dev/docs/kit/adapter-vercel, npmjs.com/@sveltejs/adapter-vercel

### Pitfalls

- Using `adapter-auto` instead of `adapter-vercel` — auto may not select the correct runtime
- Using `runtime: 'edge'` — edge has Node API restrictions that may cause issues
- Forgetting to set Node 20.x in Vercel dashboard (defaults may vary)

### Applies To

Stage 01 (svelte.config.js), Stage 08 (deploy)

---

## Research Target 6: Vitest with SvelteKit

### Best Practice

- **`vitest.config.ts` pattern (from Orchestra):**

  ```typescript
  import { defineConfig } from 'vitest/config';
  import { svelte } from '@sveltejs/vite-plugin-svelte';
  import path from 'path';

  export default defineConfig({
  	plugins: [svelte({ hot: !process.env.VITEST })],
  	resolve: {
  		conditions: ['browser'],
  		alias: { $lib: path.resolve('./src/lib') }
  	},
  	test: {
  		include: ['src/**/*.{test,spec}.{js,ts}'],
  		globals: true,
  		environment: 'jsdom',
  		setupFiles: ['./src/test/setup.ts'],
  		coverage: {
  			provider: 'v8',
  			include: ['src/lib/**/*.ts'],
  			reporter: ['text', 'html', 'json-summary'],
  			thresholds: { statements: 95, branches: 70, functions: 95, lines: 95 }
  		}
  	}
  });
  ```

- **`hot: !process.env.VITEST`:** Disables HMR during test runs — correct and necessary
- **`conditions: ["browser"]`:** Ensures browser entry points are resolved (important for jsPDF and Svelte 5)
- **`$lib` alias:** Must be configured manually in vitest.config.ts (not auto-inherited from svelte.config.js)
- **Svelte 5 runes in tests:** Test files for stores MUST be named `*.svelte.test.ts` for rune compilation
- **Setup file:** `src/test/setup.ts` — create with `import '@testing-library/jest-dom'` if component testing; for pure TS tests, can be empty or minimal
- **Sources:** scottspence.com/posts/testing-with-vitest-browser-svelte-guide, svelte.dev/docs/svelte/testing, Orchestra vitest.config.ts (studied directly)

### Critical Finding: Svelte 5 Runes in Test Files

The Svelte compiler only processes rune syntax (`$state`, `$derived`, etc.) in files matching these patterns:

- `*.svelte` component files
- `*.svelte.ts` / `*.svelte.js` files

**Test files for stores using runes MUST be named:**

- `assessment.svelte.test.ts` ← CORRECT
- ~~`assessment.test.ts`~~ ← WRONG — runes won't compile

The `include: ["src/**/*.{test,spec}.{js,ts}"]` pattern in vitest.config.ts WILL match `*.svelte.test.ts` files because the glob matches any file ending in `.test.ts`.

### Applies To

Stage 01 (vitest.config.ts setup), Stage 02–06 (test files)

### Pitfalls

- **CRITICAL:** Naming store test files `*.test.ts` instead of `*.svelte.test.ts` — runes won't compile and tests will fail
- Using `@sveltejs/vite-plugin-svelte` plugin in `vite.config.ts` without `hot: !process.env.VITEST` — HMR interferes with tests
- Forgetting `conditions: ["browser"]` — causes browser-specific module resolution to fail

---

## Research Target 7: ESLint + Prettier for Svelte 5

### Best Practice

- **`eslint.config.js` (flat config, from Orchestra):**

  ```javascript
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
  				// Browser globals (from Orchestra — include all to avoid no-undef false positives)
  				console: 'readonly',
  				alert: 'readonly',
  				window: 'readonly',
  				document: 'readonly',
  				fetch: 'readonly',
  				localStorage: 'readonly',
  				setTimeout: 'readonly',
  				clearTimeout: 'readonly',
  				setInterval: 'readonly',
  				clearInterval: 'readonly',
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
  			parserOptions: { extraFileExtensions: ['.svelte'] }
  		}
  	},
  	{
  		files: ['**/*.svelte', '**/*.svelte.ts'],
  		languageOptions: { parserOptions: { parser: ts.parser } }
  	},
  	{ ignores: ['dist/', 'node_modules/', '.svelte-kit/', 'build/', '.vercel/'] },
  	{
  		rules: {
  			'@typescript-eslint/no-unused-vars': [
  				'error',
  				{ argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
  			],
  			'@typescript-eslint/no-explicit-any': 'error', // stricter than Orchestra's "warn"
  			'svelte/no-at-html-tags': 'warn',
  			'svelte/require-each-key': 'off' // known Svelte 5.53 issue
  		}
  	}
  );
  ```

- **Key package:** `eslint-plugin-svelte` — the official svelte ESLint plugin
- **Rune globals:** Must be declared in `languageOptions.globals` or ESLint will report `$state is not defined`
- **`svelte.config.js` pitfall:** If `compilerOptions: {}` is present in svelte.config.js, ESLint may fail to recognize runes mode. Either omit `compilerOptions` entirely or add `runes: true` explicitly
- **Prettier:** Standard `.prettierrc` with `"plugins": ["prettier-plugin-svelte"]`
- **Sources:** github.com/sveltejs/eslint-plugin-svelte, gist.github.com/pboling/e8945f4009e5e521c094616783bd4c13, Orchestra eslint.config.js (studied directly)

### Divergence from Orchestra

- Setting `"@typescript-eslint/no-explicit-any": "error"` (vs Orchestra's `"warn"`) — project constraint requires zero `any` types

### Applies To

Stage 01 (ESLint setup), all stages (ongoing linting)

### Pitfalls

- **CRITICAL:** Not declaring Svelte 5 rune globals — causes false `no-undef` errors
- Using old `extends: []` config format instead of flat config
- Forgetting `extraFileExtensions: [".svelte"]` in parserOptions
- `svelte.config.js` with empty `compilerOptions: {}` causes ESLint to miss runes mode

---

## Orchestra Codebase Patterns (Reference Implementation)

All patterns below were studied from `/home/krystal/repos/orchestra/` and are confirmed working in production.

### Pattern 1: $state Class Store (`ui.svelte.ts`)

```typescript
class UIStore {
	private _field = $state<Type>(defaultValue);
	get field() {
		return this._field;
	}
	set field(value: Type) {
		this._field = value;
	}
	method() {
		this._field = newValue;
	}
}
export const ui = new UIStore();
```

- Constructor reads from `localStorage` for persistence (not needed in assessment store)
- All state is private with public getters
- Setters only where needed for external assignment
- No `$derived` in Orchestra's UIStore — compute in getters instead

### Pattern 2: $props() Component (`ConfirmDialog.svelte`)

```svelte
<script lang="ts">
	interface Props {
		title: string;
		message: string;
		confirmLabel?: string;
		onConfirm: () => void;
		onCancel: () => void;
	}
	let { title, message, confirmLabel = 'Delete', onConfirm, onCancel }: Props = $props();
</script>
```

- Interface defined in `<script>` block
- Destructure with defaults inline
- Event handlers are plain functions passed as props (not Svelte events)

### Pattern 3: Tailwind 4 @theme (`app.css`)

```css
@import 'tailwindcss';
@theme {
	--color-bg-primary: #0d1117;
	--color-primary: #4ec9b0;
	--color-text-primary: #e6edf3;
	--color-error: #f85149;
}
```

- All in one file, no config JS needed
- Named tokens generate utility classes automatically
- Light theme via `[data-theme="light"]` CSS selector overrides

### Pattern 4: Pre-push Hook (`.githooks/pre-push`)

```sh
#!/bin/sh
cd "$(git rev-parse --show-toplevel)"
npm run format:check || exit 1
npm run lint || exit 1
npm run check || exit 1  # svelte-check
npm test || exit 1
echo "✅ All pre-push checks passed!"
```

For this project: 4 stages only (no Rust stages). Same structure, simplified.

### Pattern 5: Vitest Config (`vitest.config.ts`)

```typescript
plugins: [svelte({ hot: !process.env.VITEST })],
resolve: { conditions: ["browser"], alias: { $lib: path.resolve("./src/lib") } },
test: { include: ["src/**/*.{test,spec}.{js,ts}"], globals: true, environment: "jsdom" }
```

Mirror exactly. Add `setupFiles` pointing to `src/test/setup.ts`.

### Pattern 6: ESLint Flat Config (`eslint.config.js`)

```javascript
ts.config(js.configs.recommended, ...ts.configs.recommended, ...svelte.configs["flat/recommended"], ...)
```

Mirror exactly. Add Svelte 5 rune globals. Set `no-explicit-any: "error"`.

---

## Technology Version Summary

| Technology                 | Version | Install Command                             |
| -------------------------- | ------- | ------------------------------------------- |
| `@sveltejs/kit`            | 2.57.1  | via `npx sv@latest create`                  |
| `svelte`                   | 5.x     | via `npx sv@latest create`                  |
| `tailwindcss`              | 4.x     | `npm install tailwindcss @tailwindcss/vite` |
| `@sveltejs/adapter-vercel` | 6.3.3   | `npm install -D @sveltejs/adapter-vercel`   |
| `jspdf`                    | 4.2.1   | `npm install jspdf`                         |
| `lucide-svelte`            | latest  | `npm install lucide-svelte`                 |
| `typescript`               | 5.x     | included in SvelteKit scaffold              |
| `vitest`                   | latest  | included in SvelteKit scaffold (add-on)     |
| `eslint-plugin-svelte`     | latest  | included in SvelteKit scaffold (add-on)     |

---

## Critical Pitfalls Summary

| #   | Pitfall                                                          | Mitigation                                                       |
| --- | ---------------------------------------------------------------- | ---------------------------------------------------------------- |
| 1   | Store test files named `*.test.ts` instead of `*.svelte.test.ts` | Name all store test files `*.svelte.test.ts`                     |
| 2   | `adapter-auto` used instead of `adapter-vercel`                  | Explicitly install and configure `@sveltejs/adapter-vercel`      |
| 3   | `@tailwindcss/postcss` instead of `@tailwindcss/vite`            | Use `@tailwindcss/vite` plugin in `vite.config.ts`               |
| 4   | ESLint not declaring Svelte 5 rune globals                       | Add all rune globals in `languageOptions.globals`                |
| 5   | `svelte.config.js` has `compilerOptions: {}`                     | Omit `compilerOptions` or explicitly set `runes: true`           |
| 6   | jsPDF called with SSR active                                     | Use dynamic import: `const { jsPDF } = await import('jspdf')`    |
| 7   | jsPDF `doc.save()` called in jsdom tests                         | Tests should verify page count only; mock or guard `save()` call |
| 8   | `@theme` variables not generating utilities                      | Custom props in `@theme` generate classes; `:root` props do not  |

---

## Sources

- [Announcing SvelteKit 2](https://svelte.dev/blog/sveltekit-2)
- [SvelteKit releases (GitHub)](https://github.com/sveltejs/kit/releases)
- [Introducing runes](https://svelte.dev/blog/runes)
- [Svelte 5 Runes in 2026](https://www.pkgpulse.com/blog/svelte-5-runes-complete-guide-2026)
- [Svelte Best Practices in 2026](https://onehorizon.ai/blog/svelte-best-practices-in-2026-scaling-with-runes-snippets-and-pure-reactivity)
- [Tailwind CSS v4.0](https://tailwindcss.com/blog/tailwindcss-v4)
- [Tailwind v4 + Vite setup guide](https://dev.to/fedor-pasynkov/setting-up-tailwind-css-v4-in-sveltekit-the-vite-plugin-way-a-guide-based-on-real-issues-380n)
- [jsPDF npm](https://www.npmjs.com/package/jspdf)
- [jsPDF documentation](https://artskydj.github.io/jsPDF/docs/jsPDF.html)
- [adapter-vercel docs](https://svelte.dev/docs/kit/adapter-vercel)
- [adapter-vercel npm](https://www.npmjs.com/package/@sveltejs/adapter-vercel)
- [Testing Svelte with Vitest](https://scottspence.com/posts/testing-with-vitest-browser-svelte-guide)
- [Svelte testing docs](https://svelte.dev/docs/svelte/testing)
- [eslint-plugin-svelte](https://github.com/sveltejs/eslint-plugin-svelte)
- [Working ESLint Flat Config for Svelte + TypeScript](https://gist.github.com/pboling/e8945f4009e5e521c094616783bd4c13)
- Orchestra repo (direct study): `ui.svelte.ts`, `ConfirmDialog.svelte`, `app.css`, `.githooks/pre-push`, `vitest.config.ts`, `eslint.config.js`, `tsconfig.json`
