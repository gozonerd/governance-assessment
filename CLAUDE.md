# Governance Assessment Tool

**Owner:** Krystal Martinez / Stahl Systems
**Stack:** SvelteKit 2 + Svelte 5 runes + TypeScript strict + Tailwind CSS 4 + jsPDF + adapter-vercel
**Deploy:** governance.krystalmartinez.com (Vercel)
**Node:** 22 (nvm — see `.nvmrc`)

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run check:all    # Format + lint + type check + tests (runs all gates)
npm run format       # Prettier auto-fix
npm run lint         # ESLint
npm run check        # svelte-check (TypeScript + Svelte)
npm test             # Vitest (single run)
npm run test:watch   # Vitest watch mode
```

## Directory Structure

```
src/
  lib/
    components/    Svelte components (Button, ProgressBar, QuestionCard, etc.)
    data/          Static data (categories.ts, questions.ts, recommendations.ts)
    stores/        Svelte 5 $state class stores (*.svelte.ts)
    pdf/           jsPDF report generation
    types.ts       All shared TypeScript interfaces
    scoring.ts     Pure scoring functions
  routes/
    +layout.svelte
    +page.svelte       Landing page
    assess/+page.svelte
    results/+page.svelte
  test/
    setup.ts       @testing-library/jest-dom import
  app.css          Tailwind 4 @theme + governance palette
  app.html         Shell with OG meta tags
docs/              D2R research summaries and stage artifacts
```

## Constraints

- **All client-side.** No backend. No database. No server routes.
- **Zero `any` types.** ESLint enforces `no-explicit-any: error`.
- **All interactive elements need `data-testid`.** Required for test targeting.
- **Svelte 5 runes only.** No Svelte 4 syntax. `runes: true` enforced in svelte.config.js.
- **Store pattern:** Class-based `$state` in `*.svelte.ts` files. Export single instance.
- **Test files using runes:** Must be named `*.svelte.test.ts` (not `*.test.ts`).
- **jsPDF:** Dynamic import only (avoid SSR issues). No html2canvas.
- **Tailwind 4:** `@import "tailwindcss"` + `@theme {}` in app.css. No tailwind.config.js.

## Governance Palette

| Token                    | Hex       | Use                      |
| ------------------------ | --------- | ------------------------ |
| `--color-primary`        | `#1e3a5f` | Brand, deep blue, trust  |
| `--color-accent`         | `#0d9488` | CTAs, teal, action       |
| `--color-risk-critical`  | `#ef4444` | Critical risk (0–25%)    |
| `--color-risk-high`      | `#f97316` | High risk (26–50%)       |
| `--color-risk-moderate`  | `#eab308` | Moderate risk (51–75%)   |
| `--color-risk-low`       | `#22c55e` | Low risk (76–100%)       |
| `--color-bg-primary`     | `#0f172a` | Page background          |
| `--color-bg-panel`       | `#1e293b` | Panel/section background |
| `--color-bg-card`        | `#273549` | Card background          |
| `--color-text-primary`   | `#f1f5f9` | Primary text             |
| `--color-text-secondary` | `#94a3b8` | Secondary/muted text     |

## Regulatory Deadlines

- Colorado AI Act (SB 24-205): **June 30, 2026**
- EU AI Act high-risk systems: **August 2, 2026**

## Key Stats (embed in UI and PDF)

- 98% of organizations have shadow AI
- 1 in 5 had a data breach from shadow AI
- $670K additional breach cost from shadow AI
- 47% use personal accounts for AI
- Only 12% can detect all shadow AI usage
- Only 36% have formal AI governance policies

## Quality Gate

Pre-push hook runs 4 checks: prettier → eslint → svelte-check → vitest.
All must pass. No `--no-verify` bypasses.
