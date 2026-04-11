<script lang="ts">
	import { goto } from '$app/navigation';
	import { assessment } from '$lib/stores/assessment.svelte.js';
	import { categories } from '$lib/data/categories.js';
	import { generateReport } from '$lib/pdf/report.js';
	import ScoreGauge from '$lib/components/ScoreGauge.svelte';
	import RegulatoryBanner from '$lib/components/RegulatoryBanner.svelte';
	import CategoryCard from '$lib/components/CategoryCard.svelte';
	import RiskStrip from '$lib/components/RiskStrip.svelte';
	import RecommendationList from '$lib/components/RecommendationList.svelte';
	import Button from '$lib/components/Button.svelte';

	// Guard: if no results, redirect to landing
	$effect(() => {
		if (!assessment.results) {
			goto('/');
		}
	});

	const results = $derived(assessment.results);

	function getCategoryData(categoryId: string) {
		return categories.find((c) => c.id === categoryId) ?? categories[0];
	}

	function getTopRecommendation(categoryId: string) {
		return results?.recommendations.find((r) => r.category === categoryId) ?? null;
	}

	function getComplianceScore(): number {
		return results?.categoryScores.find((cs) => cs.categoryId === 'compliance')?.percentage ?? 100;
	}

	let isGeneratingPdf = $state(false);

	async function handleDownload() {
		if (!results) return;
		isGeneratingPdf = true;
		try {
			await generateReport(results);
		} finally {
			isGeneratingPdf = false;
		}
	}

	function handleRetake() {
		assessment.reset();
		goto('/');
	}
</script>

<svelte:head>
	<title>Your Results — AI Governance Readiness Assessment</title>
</svelte:head>

{#if results}
	<div class="max-w-4xl mx-auto py-8" data-testid="results-page">
		<!-- Overall Score -->
		<div class="text-center mb-10">
			<h1 class="text-3xl font-bold text-[var(--color-text-primary)] mb-6">
				Your AI Governance Readiness Score
			</h1>
			<ScoreGauge score={results.overallScore} riskLevel={results.overallRiskLevel} />
			<p class="mt-4 text-sm text-[var(--color-text-secondary)]">
				Assessment completed {results.completedAt.toLocaleDateString('en-US', {
					month: 'long',
					day: 'numeric',
					year: 'numeric'
				})}
			</p>
		</div>

		<!-- Regulatory Banner (conditional — only if compliance < 50%) -->
		<RegulatoryBanner compliancePercentage={getComplianceScore()} />

		<!-- Category Cards (responsive grid) -->
		<section class="mb-10" data-testid="category-grid" aria-labelledby="category-heading">
			<h2 id="category-heading" class="text-xl font-semibold text-[var(--color-text-primary)] mb-5">
				Results by Category
			</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
				{#each results.categoryScores as cs (cs.categoryId)}
					<CategoryCard
						categoryScore={cs}
						category={getCategoryData(cs.categoryId)}
						topRecommendation={getTopRecommendation(cs.categoryId)}
					/>
				{/each}
			</div>
		</section>

		<!-- Risk Strip -->
		<section class="mb-10" data-testid="risk-strip-section" aria-labelledby="risk-heading">
			<h2 id="risk-heading" class="text-xl font-semibold text-[var(--color-text-primary)] mb-5">
				Risk Overview
			</h2>
			<RiskStrip categoryScores={results.categoryScores} />
		</section>

		<!-- Recommendations -->
		{#if results.recommendations.length > 0}
			<section class="mb-10" data-testid="recommendations-section" aria-labelledby="rec-heading">
				<h2 id="rec-heading" class="text-xl font-semibold text-[var(--color-text-primary)] mb-5">
					90-Day Action Plan
				</h2>
				<RecommendationList recommendations={results.recommendations} />
			</section>
		{/if}

		<!-- Action Bar -->
		<div
			class="flex flex-col sm:flex-row gap-4 justify-center border-t border-[var(--color-border-muted)] pt-8"
			data-testid="results-actions"
		>
			<Button
				variant="primary"
				onclick={handleDownload}
				disabled={isGeneratingPdf}
				data-testid="btn-download-pdf"
			>
				{isGeneratingPdf ? 'Generating...' : 'Download PDF Report'}
			</Button>
			<Button variant="secondary" onclick={handleRetake} data-testid="btn-retake">
				Retake Assessment
			</Button>
		</div>
	</div>
{/if}
