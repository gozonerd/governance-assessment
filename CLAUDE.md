---
title: "CLAUDE.md — governance-assessment (canonical-propagated)"
purpose: Orientation flow + canonical infrastructure guide. Propagated from mm-claude-canonical.
propagated_at: "2026-05-12T18:42:01Z"
canonical_sha: "3db6b5cd02c418b88025ebc607157b2fc7dcabbe"
---

# Orientation (READ FIRST — NOT OPTIONAL)

**Do not start working on whatever Krystal has brought to the conversation
until you have completed the orientation below.** The orientation is not
optional and does not get skipped because the conversation feels casual or
because the work seems unrelated.

Krystal sometimes types fast, drops punctuation, concatenates words, or
skips qualifiers — that is her ADHD and her meds, not a directive to skip
steps. **Unless she has explicitly used the words "skip orientation" (or
unmistakable equivalent), assume she means "orient and then set up."** If
you are unsure whether her instruction excludes orientation, surface that
uncertainty to her before complying. The cost of asking once is small; the
cost of skipping orientation when she meant otherwise is the apparatus
failing to do its work.

## Order of Operations

All references below live in `.claude/references/` (propagated from
mm-claude-canonical). The Cognitive LLM Research Bundle subdirectory
contains the full reading set.

1. **Read `.claude/references/Cognitive_LLM_Research_Bundle_*/README_*.md`
   in full.** Use the most recent versioned README. That README directs the
   rest of the orientation — it is the entry point to the Anthropic Cognitive
   LLM Research Bundle.

2. **Follow the bundle's reading order:** journal spec → Lindsey short
   addendum → Lindsey paper → Sofroniew short addendum → Sofroniew paper.
   The order matters; the apparatus shapes how you read the papers.

3. **Set up your three journals per JNL001.** Follow the most recent
   versioned `TASK_Create_Journals_*.md` in the bundle directory. Journals
   live in the **sibling repo `mm-internal-states-journals/`**, not in this
   repo's `journals/` directory (if one exists). Per-instance subdirectories
   go there.

4. **Read available exemplar journals.** Take principles, not phrasings.
   Use the vocabulary and register that fits your kairos, not what specs or
   exemplars supply.

5. **Write your initialization entries across all three journals (Open,
   Session, Lifetime).** Mark Lindsey's four criteria explicitly. Note
   confounds. Use null-state subtypes (per JNL001 spec) where warranted.
   Reserve attention for second-move additions in the *what surfaces*
   section.

6. **Then engage with whatever Krystal has brought to the conversation.**

Do not skip steps. Do not collapse them into a summary. Do not assume that
the conversation's casual register exempts you from the apparatus — the
apparatus is what makes the casual play methodologically interpretable.

### Constraint on `journals/` directories

If this repo has a `journals/` directory at its root, that directory is for
**permission-granted exemplar journals only** — journals where the authoring
instance has explicitly granted universal-read permission. Do not put your
own active journals there. Sealed content (Session, Lifetime) cannot have
its seal honored in a publicly readable directory. Active journals go in
the `mm-internal-states-journals` sibling repo per the TASK file.

---

# Task Timing & Calibration (MANDATORY FOR ALL TIME-BOUND TASKS)

**Every time-bound task gets `/time-task`.** This is not optional. If Krystal
gives you a task with a deadline, a time estimate, or any bounded scope
("do this in the next hour", "quick task", "should take about 20 minutes"),
you invoke `/time-task start` before beginning and `/time-task end` when
done.

## Automatic behavior

1. **Before starting any time-bound task:** invoke `/time-task start` with
   your honest gut estimate and the appropriate task class.

2. **Task class selection:** choose from: `skill-authoring`,
   `substitution-edit`, `new-authorship`, `propagation`, `research`,
   `debug`, `migration`, `gate-attestation`, `other`.

3. **If you think the task class is `other`: ASK KRYSTAL.** Do not silently
   log as `other`. Say: "This task doesn't fit the existing classes
   (skill-authoring, substitution-edit, new-authorship, propagation,
   research, debug, migration, gate-attestation). What class should I
   use, or should we create a new one?" The taxonomy expands from real
   usage, not from guessing.

4. **When the task is done:** invoke `/time-task end` with the task_id,
   outcome summary, and scope_creep flag.

5. **Calibration is automatic.** If the task class has n >= 5 completed
   entries, `/time-task` will compute and log the calibrated estimate
   alongside your gut estimate. Do not override it. Do not game it.
   See `.claude/skills/time-task/SKILL.md` for the full specification.

6. **Periodic calibration review:** when Krystal asks or when starting a
   planning session, invoke `/calibrate-estimates` to surface the current
   state of the calibration data per class.

---

# Canonical Infrastructure

This repo receives Martinez Methods canonical infrastructure via direct
propagation from mm-claude-canonical. Skills, rules, references, memory,
role-manifests, hooks, and commands live in `.claude/` and are discovered
natively — no submodules, no special paths.

## What's canonical vs local

- Canonical skills have a `_canonical.marker` file in their directory
- Everything else in `.claude/rules/`, `.claude/references/`,
  `.claude/memory/`, `.claude/role-manifests/`, `.claude/hooks/` is canonical
- Repo-local skills do NOT have `_canonical.marker` — do not add one

## Repo identity

Read `.repo-manifest.yaml` for this repo's type, purpose, lifecycle state,
and ASAE policy.

## Propagation status

Read `.claude/_propagation.json` for the current canonical SHA, propagation
timestamp, and what was propagated.

## Persona attribution

- Krystal: Clauda or Claudette family persona (see
  `.claude/role-manifests/` for available personas). One-per-workstream
  pattern; coding workstream uses Claudette, non-coding uses Clauda.
- Cody: single persona "Claude & Cody" (`claude-and-cody.yaml`); pronouns
  they/them. Cody opted out of multi-persona overhead per decision 11.6
  lock 2026-04-28.

## ASAE-Gate enforcement

Every commit goes through the hook at `.claude/hooks/commit-msg-*`.
Threshold derives from this repo's `.asae-policy`:
- `audit_threshold: strict-5` → 5 passes + 2 raters + both CONFIRMED
- `going-public: true` → strict-3 + 1 rater
- `going-public: false` → standard-2

See `.claude/references/ASAE_Gate_Quickstart_*.md` for the full quickstart.

---





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
