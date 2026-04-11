import { describe, it, expect, beforeEach } from 'vitest';
import { assessment } from '$lib/stores/assessment.svelte.js';

// Reset store to initial state before each test
beforeEach(() => {
	assessment.reset();
});

describe('AssessmentStore — initial state', () => {
	it('starts at step 0', () => {
		expect(assessment.currentStep).toBe(0);
	});

	it('starts with empty responses', () => {
		expect(assessment.responses.size).toBe(0);
	});

	it('starts as not complete', () => {
		expect(assessment.isComplete).toBe(false);
	});

	it('starts with null results', () => {
		expect(assessment.results).toBeNull();
	});

	it('reports totalQuestions as 18', () => {
		expect(assessment.totalQuestions).toBe(18);
	});

	it('reports progress as 0.0 at step 0', () => {
		expect(assessment.progress).toBe(0);
	});
});

describe('AssessmentStore — answerQuestion', () => {
	it('records a response with the correct score', () => {
		assessment.answerQuestion('q01', 2);
		const response = assessment.responses.get('q01');
		expect(response).toBeDefined();
		expect(response?.selectedIndex).toBe(2);
		expect(response?.score).toBe(2);
	});

	it('overwrites a previous answer for the same question', () => {
		assessment.answerQuestion('q01', 1);
		assessment.answerQuestion('q01', 3);
		const response = assessment.responses.get('q01');
		expect(response?.score).toBe(3);
		expect(response?.selectedIndex).toBe(3);
		expect(assessment.responses.size).toBe(1);
	});

	it('silently ignores an unknown question ID', () => {
		assessment.answerQuestion('q_nonexistent', 0);
		expect(assessment.responses.size).toBe(0);
	});

	it('correctly records score for option 0', () => {
		assessment.answerQuestion('q01', 0);
		expect(assessment.responses.get('q01')?.score).toBe(0);
	});

	it('correctly records score for option 3 (max)', () => {
		assessment.answerQuestion('q01', 3);
		expect(assessment.responses.get('q01')?.score).toBe(3);
	});
});

describe('AssessmentStore — nextStep / previousStep', () => {
	it('increments step when nextStep is called', () => {
		assessment.nextStep();
		expect(assessment.currentStep).toBe(1);
	});

	it('clamps at totalQuestions — does not exceed', () => {
		for (let i = 0; i < 20; i++) {
			assessment.nextStep();
		}
		expect(assessment.currentStep).toBe(assessment.totalQuestions);
	});

	it('decrements step when previousStep is called', () => {
		assessment.nextStep();
		assessment.nextStep();
		assessment.previousStep();
		expect(assessment.currentStep).toBe(1);
	});

	it('clamps at 0 — does not go negative', () => {
		assessment.previousStep();
		assessment.previousStep();
		expect(assessment.currentStep).toBe(0);
	});
});

describe('AssessmentStore — progress', () => {
	it('returns correct fraction after advancing steps', () => {
		assessment.nextStep();
		assessment.nextStep();
		assessment.nextStep();
		expect(assessment.progress).toBeCloseTo(3 / 18);
	});

	it('returns 1.0 when at totalQuestions', () => {
		for (let i = 0; i < 18; i++) {
			assessment.nextStep();
		}
		expect(assessment.progress).toBe(1);
	});
});

describe('AssessmentStore — calculateResults', () => {
	it('sets isComplete to true after calculateResults', () => {
		assessment.calculateResults();
		expect(assessment.isComplete).toBe(true);
	});

	it('produces a valid AssessmentResult with all 5 categories', () => {
		// Answer all questions with score 2 (moderate performance)
		const ids = [
			'q01',
			'q02',
			'q03',
			'q04',
			'q05',
			'q06',
			'q07',
			'q08',
			'q09',
			'q10',
			'q11',
			'q12',
			'q13',
			'q14',
			'q15',
			'q16',
			'q17',
			'q18'
		];
		for (const id of ids) {
			assessment.answerQuestion(id, 2);
		}
		assessment.calculateResults();

		const results = assessment.results;
		expect(results).not.toBeNull();
		expect(results?.categoryScores).toHaveLength(5);
		expect(results?.overallScore).toBeGreaterThanOrEqual(0);
		expect(results?.overallScore).toBeLessThanOrEqual(100);
		expect(results?.overallRiskLevel).toBeDefined();
		expect(results?.completedAt).toBeInstanceOf(Date);
	});

	it('produces recommendations for low-scoring assessment', () => {
		// Answer all questions with score 0 (critical performance)
		const ids = [
			'q01',
			'q02',
			'q03',
			'q04',
			'q05',
			'q06',
			'q07',
			'q08',
			'q09',
			'q10',
			'q11',
			'q12',
			'q13',
			'q14',
			'q15',
			'q16',
			'q17',
			'q18'
		];
		for (const id of ids) {
			assessment.answerQuestion(id, 0);
		}
		assessment.calculateResults();
		expect(assessment.results?.recommendations.length).toBeGreaterThan(0);
	});
});

describe('AssessmentStore — reset', () => {
	it('clears all state back to initial values', () => {
		assessment.answerQuestion('q01', 3);
		assessment.nextStep();
		assessment.nextStep();
		assessment.calculateResults();

		assessment.reset();

		expect(assessment.currentStep).toBe(0);
		expect(assessment.responses.size).toBe(0);
		expect(assessment.isComplete).toBe(false);
		expect(assessment.results).toBeNull();
		expect(assessment.progress).toBe(0);
	});
});
