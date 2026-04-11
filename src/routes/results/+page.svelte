<script lang="ts">
	import { goto } from '$app/navigation';
	import { assessment } from '$lib/stores/assessment.svelte.js';
	import Button from '$lib/components/Button.svelte';

	// Guard: if no results, redirect to landing
	$effect(() => {
		if (!assessment.results) {
			goto('/');
		}
	});
</script>

<svelte:head>
	<title>Your Results — AI Governance Readiness</title>
</svelte:head>

{#if assessment.results}
	<div class="max-w-4xl mx-auto py-8" data-testid="results-page">
		<div class="text-center mb-12">
			<h1 class="text-3xl font-bold text-[var(--color-text-primary)] mb-4">
				Your Assessment Results
			</h1>
			<div
				class="inline-flex items-center justify-center w-32 h-32 rounded-full border-4 border-[var(--color-accent)] bg-[var(--color-bg-panel)] mb-4"
				data-testid="overall-score"
				aria-label="Overall score: {assessment.results.overallScore} out of 100, {assessment.results
					.overallRiskLevel} risk"
			>
				<div class="text-center">
					<p class="text-4xl font-bold text-[var(--color-text-primary)]">
						{assessment.results.overallScore}
					</p>
					<p class="text-xs text-[var(--color-text-secondary)] uppercase tracking-wide">/ 100</p>
				</div>
			</div>
			<p class="text-lg text-[var(--color-text-secondary)]">
				Overall Risk Level: <span class="font-semibold text-[var(--color-text-primary)] capitalize"
					>{assessment.results.overallRiskLevel}</span
				>
			</p>
		</div>

		<div class="flex flex-col sm:flex-row gap-4 justify-center" data-testid="results-actions">
			<Button
				variant="secondary"
				onclick={() => {
					assessment.reset();
					goto('/');
				}}
				data-testid="btn-retake"
			>
				Retake Assessment
			</Button>
		</div>
	</div>
{/if}
