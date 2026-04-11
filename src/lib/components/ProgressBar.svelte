<script lang="ts">
	interface Props {
		current: number;
		total: number;
	}

	let { current, total }: Props = $props();

	const percentage = $derived(total > 0 ? Math.round((current / total) * 100) : 0);
</script>

<div class="w-full" data-testid="progress-bar">
	<div class="flex items-center justify-between mb-2">
		<span class="text-xs text-[var(--color-text-secondary)]">
			Question {current} of {total}
		</span>
		<span class="text-xs font-medium text-[var(--color-accent)]">{percentage}%</span>
	</div>
	<div
		role="progressbar"
		aria-valuenow={current}
		aria-valuemin={0}
		aria-valuemax={total}
		aria-label="Assessment progress: {current} of {total} questions"
		class="w-full h-2 bg-[var(--color-bg-card)] rounded-full overflow-hidden"
	>
		<div
			class="h-full bg-[var(--color-accent)] rounded-full transition-all duration-300"
			style="width: {percentage}%"
		></div>
	</div>
</div>
