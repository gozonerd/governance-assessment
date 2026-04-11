<script lang="ts">
	import type { AssessmentQuestion } from '$lib/types.js';

	interface Props {
		question: AssessmentQuestion;
		selectedIndex: number | null;
		onAnswer: (index: number) => void;
	}

	let { question, selectedIndex, onAnswer }: Props = $props();

	function handleKeydown(event: KeyboardEvent, index: number) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			onAnswer(index);
		} else if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
			event.preventDefault();
			const next = Math.min(index + 1, question.options.length - 1);
			(document.querySelector(`[data-testid="option-${next}"]`) as HTMLElement | null)?.focus();
		} else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
			event.preventDefault();
			const prev = Math.max(index - 1, 0);
			(document.querySelector(`[data-testid="option-${prev}"]`) as HTMLElement | null)?.focus();
		}
	}
</script>

<div
	role="radiogroup"
	aria-labelledby="question-{question.id}"
	data-testid="question-{question.id}"
	class="w-full"
>
	<div class="mb-6">
		<p
			id="question-{question.id}"
			class="text-lg font-semibold text-[var(--color-text-primary)] leading-snug"
		>
			{question.text}
		</p>
		{#if question.helpText}
			<p class="mt-3 text-sm text-[var(--color-text-secondary)] leading-relaxed">
				{question.helpText}
			</p>
		{/if}
		{#if question.regulatoryRef}
			<p class="mt-2 text-xs text-[var(--color-accent)] font-medium">
				Ref: {question.regulatoryRef}
			</p>
		{/if}
	</div>

	<div class="space-y-3">
		{#each question.options as option, index (option.score)}
			<button
				role="radio"
				aria-checked={selectedIndex === index}
				tabindex={selectedIndex === index || (selectedIndex === null && index === 0) ? 0 : -1}
				data-testid="option-{index}"
				onclick={() => onAnswer(index)}
				onkeydown={(e) => handleKeydown(e, index)}
				class="w-full text-left px-5 py-4 rounded-lg border transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-primary)]
				{selectedIndex === index
					? 'border-[var(--color-accent)] bg-[var(--color-accent-muted)] text-[var(--color-text-primary)]'
					: 'border-[var(--color-border-default)] bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-text-primary)]'}"
			>
				<span class="flex items-start gap-3">
					<span
						class="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center
						{selectedIndex === index
							? 'border-[var(--color-accent)] bg-[var(--color-accent)]'
							: 'border-[var(--color-border-default)]'}"
						aria-hidden="true"
					>
						{#if selectedIndex === index}
							<span class="w-2 h-2 rounded-full bg-white"></span>
						{/if}
					</span>
					<span class="text-sm leading-relaxed">{option.label}</span>
				</span>
			</button>
		{/each}
	</div>
</div>
