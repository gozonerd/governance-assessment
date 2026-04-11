<script lang="ts">
	import { goto } from '$app/navigation';
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
</script>

<svelte:head>
	<title>Assessment — AI Governance Readiness</title>
</svelte:head>

<div class="max-w-2xl mx-auto py-8" data-testid="assess-page">
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
