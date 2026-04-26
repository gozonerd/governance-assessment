<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { assessment } from '$lib/stores/assessment.svelte.js';
	import { questions } from '$lib/data/questions.js';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import QuestionCard from '$lib/components/QuestionCard.svelte';
	import Button from '$lib/components/Button.svelte';

	// Guard: if already complete, redirect to results
	$effect(() => {
		if (assessment.isComplete) {
			goto('/results');
		}
	});

	const currentQuestion = $derived(questions[assessment.currentStep] ?? questions[0]);
	const currentResponse = $derived(assessment.responses.get(currentQuestion.id) ?? null);
	const selectedIndex = $derived(currentResponse?.selectedIndex ?? null);
	const isFirstQuestion = $derived(assessment.currentStep === 0);
	const isLastQuestion = $derived(assessment.currentStep === assessment.totalQuestions - 1);
	const hasAnswer = $derived(selectedIndex !== null);
	const hasStarted = $derived(assessment.responses.size > 0);

	function handleAnswer(index: number) {
		assessment.answerQuestion(currentQuestion.id, index);
	}

	function handleNext() {
		if (isLastQuestion) {
			assessment.calculateResults();
			goto('/results');
		} else {
			assessment.nextStep();
		}
	}

	function handlePrevious() {
		assessment.previousStep();
	}

	// Warn before unload if assessment is in progress
	onMount(() => {
		function handleBeforeUnload(e: BeforeUnloadEvent) {
			if (hasStarted && !assessment.isComplete) {
				e.preventDefault();
				e.returnValue = '';
			}
		}
		window.addEventListener('beforeunload', handleBeforeUnload);
		return () => window.removeEventListener('beforeunload', handleBeforeUnload);
	});
</script>

<svelte:head>
	<title>Assessment — AI Governance Readiness</title>
</svelte:head>

<div class="max-w-2xl mx-auto py-8" data-testid="assess-page">
	<!-- Data persistence notice -->
	<div
		class="mb-6 flex items-start gap-2 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-panel)] px-4 py-3 text-xs text-[var(--color-text-secondary)]"
		role="note"
		aria-label="Data persistence notice"
	>
		<svg
			width="14"
			height="14"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			class="mt-0.5 shrink-0 text-[var(--color-accent)]"
			aria-hidden="true"
		>
			<circle cx="12" cy="12" r="10" />
			<line x1="12" y1="8" x2="12" y2="12" />
			<line x1="12" y1="16" x2="12.01" y2="16" />
		</svg>
		<span
			>Responses are stored in memory only. Closing or refreshing this tab will discard your
			progress. Download the PDF report on the results page to keep your results.</span
		>
	</div>

	<div class="mb-8">
		<ProgressBar current={assessment.currentStep} total={assessment.totalQuestions} />
	</div>

	<div
		class="bg-[var(--color-bg-panel)] border border-[var(--color-border-muted)] rounded-xl p-8 mb-8 transition-opacity duration-150"
	>
		<QuestionCard question={currentQuestion} {selectedIndex} onAnswer={handleAnswer} />
	</div>

	<div class="flex items-center justify-between gap-4">
		{#if !isFirstQuestion}
			<Button variant="ghost" onclick={handlePrevious} data-testid="btn-previous">
				← Previous
			</Button>
		{:else}
			<div></div>
		{/if}

		<Button
			variant="primary"
			disabled={!hasAnswer}
			onclick={handleNext}
			data-testid={isLastQuestion ? 'btn-see-results' : 'btn-next'}
		>
			{isLastQuestion ? 'See My Results →' : 'Next →'}
		</Button>
	</div>
</div>
