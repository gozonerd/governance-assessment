<script lang="ts">
	import type { CategoryScore, AssessmentCategory, Recommendation } from '$lib/types.js';

	interface Props {
		categoryScore: CategoryScore;
		category: AssessmentCategory;
		topRecommendation: Recommendation | null;
	}

	let { categoryScore, category, topRecommendation }: Props = $props();

	const riskColors: Record<string, string> = {
		critical: 'var(--color-risk-critical)',
		high: 'var(--color-risk-high)',
		moderate: 'var(--color-risk-moderate)',
		low: 'var(--color-risk-low)'
	};

	const riskBadge: Record<string, string> = {
		critical: 'bg-[var(--color-risk-critical)]/20 text-[var(--color-risk-critical)]',
		high: 'bg-[var(--color-risk-high)]/20 text-[var(--color-risk-high)]',
		moderate: 'bg-[var(--color-risk-moderate)]/20 text-[var(--color-risk-moderate)]',
		low: 'bg-[var(--color-risk-low)]/20 text-[var(--color-risk-low)]'
	};

	const riskLabels: Record<string, string> = {
		critical: 'Critical',
		high: 'High',
		moderate: 'Moderate',
		low: 'Low'
	};
</script>

<div
	class="bg-[var(--color-bg-panel)] border border-[var(--color-border-muted)] rounded-xl p-6"
	data-testid="category-{categoryScore.categoryId}"
>
	<!-- Header -->
	<div class="flex items-start justify-between gap-3 mb-4">
		<h3 class="text-base font-semibold text-[var(--color-text-primary)] leading-snug">
			{category.label}
		</h3>
		<span
			class="flex-shrink-0 text-xs font-semibold px-2 py-1 rounded-full capitalize {riskBadge[
				categoryScore.riskLevel
			]}"
			data-testid="risk-badge-{categoryScore.categoryId}"
		>
			{riskLabels[categoryScore.riskLevel]} Risk
		</span>
	</div>

	<!-- Score bar -->
	<div class="mb-4">
		<div class="flex items-center justify-between mb-1">
			<span class="text-sm text-[var(--color-text-secondary)]">Score</span>
			<span
				class="text-lg font-bold"
				style="color: {riskColors[categoryScore.riskLevel]};"
				data-testid="score-{categoryScore.categoryId}"
			>
				{categoryScore.percentage}%
			</span>
		</div>
		<div
			class="w-full h-2 bg-[var(--color-bg-card)] rounded-full overflow-hidden"
			role="progressbar"
			aria-valuenow={categoryScore.percentage}
			aria-valuemin={0}
			aria-valuemax={100}
			aria-label="{category.label} score: {categoryScore.percentage}%"
		>
			<div
				class="h-full rounded-full transition-all duration-500"
				style="width: {categoryScore.percentage}%; background-color: {riskColors[
					categoryScore.riskLevel
				]};"
			></div>
		</div>
	</div>

	<!-- Top recommendation -->
	{#if topRecommendation}
		<div
			class="text-xs text-[var(--color-text-secondary)] leading-relaxed border-t border-[var(--color-border-muted)] pt-3"
			data-testid="rec-{categoryScore.categoryId}"
		>
			<span class="font-semibold text-[var(--color-text-primary)] block mb-1"> Next step: </span>
			{topRecommendation.text}
		</div>
	{/if}
</div>
