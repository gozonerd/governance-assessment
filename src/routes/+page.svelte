<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/Button.svelte';
</script>

<svelte:head>
	<title>AI Governance Readiness Assessment | Free 5-Minute Tool</title>
</svelte:head>

<div class="py-12">
	<!-- Hero -->
	<div class="text-center max-w-3xl mx-auto mb-16">
		<h1
			class="text-4xl md:text-5xl font-bold text-[var(--color-text-primary)] leading-tight mb-6"
			data-testid="hero-headline"
		>
			Is Your Organization Ready for AI Regulation?
		</h1>
		<p class="text-lg text-[var(--color-text-secondary)] mb-8 leading-relaxed">
			18 questions. 5 categories. ~5 minutes. Receive a scored dashboard and downloadable PDF report
			grounded in EU AI Act, Colorado AI Act, NIST AI RMF, and OWASP LLM Top 10 requirements.
		</p>
		<Button variant="primary" onclick={() => goto('/assess')} data-testid="cta-start">
			Start Assessment
		</Button>
	</div>

	<!-- Stats strip -->
	<div
		class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
		data-testid="stats-strip"
		aria-label="AI governance statistics"
	>
		<div
			class="bg-[var(--color-bg-panel)] border border-[var(--color-border-muted)] rounded-xl p-6 text-center"
			data-testid="stat-shadow-ai"
		>
			<p class="text-4xl font-bold text-[var(--color-risk-critical)] mb-2">98%</p>
			<p class="text-sm text-[var(--color-text-secondary)]">
				of organizations have unapproved AI tools ("shadow AI") in use
			</p>
			<p class="text-xs text-[var(--color-text-muted)] mt-2">
				Source: Reco AI Risk Report 2024
			</p>
		</div>
		<div
			class="bg-[var(--color-bg-panel)] border border-[var(--color-border-muted)] rounded-xl p-6 text-center"
			data-testid="stat-breach-cost"
		>
			<p class="text-4xl font-bold text-[var(--color-risk-high)] mb-2">$670K</p>
			<p class="text-sm text-[var(--color-text-secondary)]">
				additional breach cost when shadow AI is involved in a data breach
			</p>
			<p class="text-xs text-[var(--color-text-muted)] mt-2">
				Source: IBM Cost of a Data Breach Report 2025
			</p>
		</div>
		<div
			class="bg-[var(--color-bg-panel)] border border-[var(--color-border-muted)] rounded-xl p-6 text-center"
			data-testid="stat-governance"
		>
			<p class="text-4xl font-bold text-[var(--color-risk-moderate)] mb-2">&lt;40%</p>
			<p class="text-sm text-[var(--color-text-secondary)]">
				of organizations have a formal AI governance policy in place
			</p>
			<p class="text-xs text-[var(--color-text-muted)] mt-2">
				Source: Reco AI Risk Report 2024
			</p>
		</div>
	</div>

	<!-- What you'll get -->
	<div
		class="bg-[var(--color-bg-panel)] border border-[var(--color-border-muted)] rounded-xl p-8 max-w-2xl mx-auto"
	>
		<h2 class="text-xl font-semibold text-[var(--color-text-primary)] mb-4">What you'll receive</h2>
		<ul class="space-y-3 text-sm text-[var(--color-text-secondary)]">
			<li class="flex items-start gap-3">
				<span class="text-[var(--color-accent)] font-bold mt-0.5" aria-hidden="true">✓</span>
				<span
					>Scored assessment across 5 governance categories: AI Inventory, Policy, Risk Management,
					Compliance, and Human Oversight</span
				>
			</li>
			<li class="flex items-start gap-3">
				<span class="text-[var(--color-accent)] font-bold mt-0.5" aria-hidden="true">✓</span>
				<span
					>Prioritized recommendations with urgency mapped to EU AI Act and Colorado AI Act
					deadlines</span
				>
			</li>
			<li class="flex items-start gap-3">
				<span class="text-[var(--color-accent)] font-bold mt-0.5" aria-hidden="true">✓</span>
				<span>Downloadable PDF report for sharing with leadership and compliance teams</span>
			</li>
			<li class="flex items-start gap-3">
				<span class="text-[var(--color-accent)] font-bold mt-0.5" aria-hidden="true">✓</span>
				<span>100% client-side — your answers never leave your browser. No account required.</span>
			</li>
		</ul>
	</div>
</div>
