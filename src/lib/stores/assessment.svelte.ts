import { SvelteMap } from 'svelte/reactivity';
import type { AssessmentResponse, AssessmentResult, OptionScore } from '$lib/types.js';
import { questions } from '$lib/data/questions.js';
import { categories } from '$lib/data/categories.js';
import {
	calculateCategoryScore,
	calculateOverallScore,
	determineRiskLevel,
	generateRecommendations
} from '$lib/scoring.js';

class AssessmentStore {
	private _currentStep = $state(0);
	private _responses = $state<SvelteMap<string, AssessmentResponse>>(new SvelteMap());
	private _isComplete = $state(false);
	private _results = $state<AssessmentResult | null>(null);

	get currentStep(): number {
		return this._currentStep;
	}

	get responses(): SvelteMap<string, AssessmentResponse> {
		return this._responses;
	}

	get isComplete(): boolean {
		return this._isComplete;
	}

	get results(): AssessmentResult | null {
		return this._results;
	}

	get totalQuestions(): number {
		return questions.length;
	}

	/** Progress as a fraction from 0.0 to 1.0. */
	get progress(): number {
		if (this.totalQuestions === 0) return 0;
		return this._currentStep / this.totalQuestions;
	}

	/** Records the user's answer for a question by question ID and option index. */
	answerQuestion(questionId: string, selectedIndex: number): void {
		const question = questions.find((q) => q.id === questionId);
		if (!question) return;

		const score = question.options[selectedIndex]?.score as OptionScore | undefined;
		if (score === undefined) return;

		this._responses.set(questionId, { questionId, selectedIndex, score });
	}

	/** Advance to the next step. Clamps at totalQuestions. */
	nextStep(): void {
		if (this._currentStep < this.totalQuestions) {
			this._currentStep = this._currentStep + 1;
		}
	}

	/** Go back to the previous step. Clamps at 0. */
	previousStep(): void {
		if (this._currentStep > 0) {
			this._currentStep = this._currentStep - 1;
		}
	}

	/** Calculates results from all responses and marks the assessment complete. */
	calculateResults(): void {
		const categoryScores = categories.map((cat) =>
			calculateCategoryScore(this._responses, questions, cat.id)
		);

		const overallScore = calculateOverallScore(categoryScores);
		const overallRiskLevel = determineRiskLevel(overallScore);
		const recommendations = generateRecommendations(categoryScores, this._responses, questions);

		this._results = {
			categoryScores,
			overallScore,
			overallRiskLevel,
			recommendations,
			completedAt: new Date(),
			responses: new Map(this._responses)
		};
		this._isComplete = true;
	}

	/** Resets all state to initial values. */
	reset(): void {
		this._currentStep = 0;
		this._responses = new SvelteMap();
		this._isComplete = false;
		this._results = null;
	}
}

export const assessment = new AssessmentStore();
