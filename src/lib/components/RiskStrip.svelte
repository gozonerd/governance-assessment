<script lang="ts">
	import type { CategoryScore } from '$lib/types.js';
	import { categories } from '$lib/data/categories.js';

	interface Props {
		categoryScores: CategoryScore[];
	}

	let { categoryScores }: Props = $props();

	const riskColors: Record<string, string> = {
		critical: 'var(--color-risk-critical)',
		high: 'var(--color-risk-high)',
		moderate: 'var(--color-risk-moderate)',
		low: 'var(--color-risk-low)'
	};

	const riskBg: Record<string, string> = {
		critical: 'bg-[var(--color-risk-critical)]',
		high: 'bg-[var(--color-risk-high)]',
		moderate: 'bg-[var(--color-risk-moderate)]',
		low: 'bg-[var(--color-risk-low)]'
	};

	function getCategoryLabel(id: string): string {
		return categories.find((c) => c.id === id)?.label ?? id;
	}
</script>

<div class="w-full" data-testid="risk-strip" aria-label="Risk level by category">
	<div class="flex gap-1 rounded-lg overflow-hidden">
		{#each categoryScores as cs (cs.categoryId)}
			<div
				class="flex-1 flex flex-col items-center {riskBg[cs.riskLevel]} py-3 px-1"
				data-testid="risk-strip-{cs.categoryId}"
				style="opacity: 0.85"
			>
				<span class="text-white text-xs font-bold uppercase tracking-wide">
					{cs.riskLevel}
				</span>
				<span class="text-white text-[10px] opacity-80 mt-1 text-center leading-tight">
					{cs.percentage}%
				</span>
			</div>
		{/each}
	</div>
	<!-- Category labels below -->
	<div class="flex gap-1 mt-2">
		{#each categoryScores as cs (cs.categoryId)}
			<div class="flex-1 text-center">
				<span
					class="text-[10px] text-[var(--color-text-secondary)]"
					style="color: {riskColors[cs.riskLevel]};"
				>
					{getCategoryLabel(cs.categoryId).split(' ')[0]}
				</span>
			</div>
		{/each}
	</div>
</div>
