<script lang="ts">
	import type { Recommendation } from '$lib/types.js';
	import { categories } from '$lib/data/categories.js';

	interface Props {
		recommendations: Recommendation[];
	}

	let { recommendations }: Props = $props();

	const immediate = $derived(recommendations.filter((r) => r.priority === 'immediate'));
	const shortTerm = $derived(recommendations.filter((r) => r.priority === 'short-term'));
	const mediumTerm = $derived(recommendations.filter((r) => r.priority === 'medium-term'));

	const priorityBorder: Record<string, string> = {
		immediate: 'border-l-4 border-[var(--color-risk-critical)]',
		'short-term': 'border-l-4 border-[var(--color-risk-high)]',
		'medium-term': 'border-l-4 border-[var(--color-risk-moderate)]'
	};

	function getCategoryLabel(id: string): string {
		return categories.find((c) => c.id === id)?.label ?? id;
	}
</script>

<div class="space-y-8" data-testid="recommendation-list">
	{#if immediate.length > 0}
		<section data-testid="recs-immediate">
			<h3
				class="text-base font-semibold text-[var(--color-risk-critical)] mb-3 flex items-center gap-2"
			>
				<span aria-hidden="true">⚡</span> Immediate (0–30 days)
			</h3>
			<ol class="space-y-3">
				{#each immediate as rec, i (rec.text)}
					<li
						class="bg-[var(--color-bg-panel)] rounded-lg pl-4 pr-5 py-4 {priorityBorder[
							'immediate'
						]}"
						data-testid="rec-item-{i}"
					>
						<div class="flex items-start gap-3">
							<span class="text-sm font-bold text-[var(--color-text-muted)] flex-shrink-0 mt-0.5">
								{i + 1}.
							</span>
							<div class="flex-1 min-w-0">
								<p class="text-sm text-[var(--color-text-primary)] leading-relaxed">{rec.text}</p>
								<div class="flex flex-wrap items-center gap-2 mt-2">
									<span class="text-xs text-[var(--color-text-muted)] capitalize">
										{getCategoryLabel(rec.category)}
									</span>
									{#if rec.regulatoryDeadline}
										<span
											class="text-xs font-semibold text-[var(--color-risk-critical)] bg-[var(--color-risk-critical)]/10 px-2 py-0.5 rounded"
										>
											Deadline: {rec.regulatoryDeadline}
										</span>
									{/if}
								</div>
							</div>
						</div>
					</li>
				{/each}
			</ol>
		</section>
	{/if}

	{#if shortTerm.length > 0}
		<section data-testid="recs-short-term">
			<h3
				class="text-base font-semibold text-[var(--color-risk-high)] mb-3 flex items-center gap-2"
			>
				<span aria-hidden="true">📋</span> Short-Term (30–60 days)
			</h3>
			<ol class="space-y-3">
				{#each shortTerm as rec, i (rec.text)}
					<li
						class="bg-[var(--color-bg-panel)] rounded-lg pl-4 pr-5 py-4 {priorityBorder[
							'short-term'
						]}"
						data-testid="rec-st-item-{i}"
					>
						<div class="flex items-start gap-3">
							<span class="text-sm font-bold text-[var(--color-text-muted)] flex-shrink-0 mt-0.5">
								{i + 1}.
							</span>
							<div class="flex-1 min-w-0">
								<p class="text-sm text-[var(--color-text-primary)] leading-relaxed">{rec.text}</p>
								<div class="flex flex-wrap items-center gap-2 mt-2">
									<span class="text-xs text-[var(--color-text-muted)] capitalize">
										{getCategoryLabel(rec.category)}
									</span>
									{#if rec.regulatoryDeadline}
										<span
											class="text-xs font-semibold text-[var(--color-risk-high)] bg-[var(--color-risk-high)]/10 px-2 py-0.5 rounded"
										>
											Deadline: {rec.regulatoryDeadline}
										</span>
									{/if}
								</div>
							</div>
						</div>
					</li>
				{/each}
			</ol>
		</section>
	{/if}

	{#if mediumTerm.length > 0}
		<section data-testid="recs-medium-term">
			<h3
				class="text-base font-semibold text-[var(--color-risk-moderate)] mb-3 flex items-center gap-2"
			>
				<span aria-hidden="true">🗓️</span> Medium-Term (60–90 days)
			</h3>
			<ol class="space-y-3">
				{#each mediumTerm as rec, i (rec.text)}
					<li
						class="bg-[var(--color-bg-panel)] rounded-lg pl-4 pr-5 py-4 {priorityBorder[
							'medium-term'
						]}"
						data-testid="rec-mt-item-{i}"
					>
						<div class="flex items-start gap-3">
							<span class="text-sm font-bold text-[var(--color-text-muted)] flex-shrink-0 mt-0.5">
								{i + 1}.
							</span>
							<div class="flex-1 min-w-0">
								<p class="text-sm text-[var(--color-text-primary)] leading-relaxed">{rec.text}</p>
								<span class="text-xs text-[var(--color-text-muted)] capitalize mt-1 block">
									{getCategoryLabel(rec.category)}
								</span>
							</div>
						</div>
					</li>
				{/each}
			</ol>
		</section>
	{/if}
</div>
