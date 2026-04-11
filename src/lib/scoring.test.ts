import { describe, it, expect } from 'vitest';
import {
	determineRiskLevel,
	calculateCategoryScore,
	calculateOverallScore,
	generateRecommendations
} from '$lib/scoring.js';
import type {
	AssessmentQuestion,
	AssessmentResponse,
	CategoryScore,
	OptionScore
} from '$lib/types.js';

// ─── Test fixtures ────────────────────────────────────────────────────────────

const makeQuestion = (id: string, category: string, weight: 1 | 2 | 3 = 1): AssessmentQuestion => ({
	id,
	category,
	weight,
	text: `Question ${id}`,
	helpText: `Help text for ${id}`,
	options: [
		{ score: 0, label: 'Option A' },
		{ score: 1, label: 'Option B' },
		{ score: 2, label: 'Option C' },
		{ score: 3, label: 'Option D' }
	]
});

const makeResponse = (questionId: string, score: OptionScore): AssessmentResponse => ({
	questionId,
	selectedIndex: score,
	score
});

const makeResponseMap = (pairs: [string, OptionScore][]): Map<string, AssessmentResponse> => {
	return new Map(pairs.map(([id, score]) => [id, makeResponse(id, score)]));
};

// ─── determineRiskLevel ───────────────────────────────────────────────────────

describe('determineRiskLevel', () => {
	it('returns critical for 0', () => {
		expect(determineRiskLevel(0)).toBe('critical');
	});

	it('returns critical for 25 (boundary)', () => {
		expect(determineRiskLevel(25)).toBe('critical');
	});

	it('returns high for 26 (boundary)', () => {
		expect(determineRiskLevel(26)).toBe('high');
	});

	it('returns high for 50 (boundary)', () => {
		expect(determineRiskLevel(50)).toBe('high');
	});

	it('returns moderate for 51 (boundary)', () => {
		expect(determineRiskLevel(51)).toBe('moderate');
	});

	it('returns moderate for 75 (boundary)', () => {
		expect(determineRiskLevel(75)).toBe('moderate');
	});

	it('returns low for 76 (boundary)', () => {
		expect(determineRiskLevel(76)).toBe('low');
	});

	it('returns low for 100', () => {
		expect(determineRiskLevel(100)).toBe('low');
	});
});

// ─── calculateCategoryScore ───────────────────────────────────────────────────

describe('calculateCategoryScore', () => {
	const questions = [
		makeQuestion('q01', 'inventory', 2),
		makeQuestion('q02', 'inventory', 3),
		makeQuestion('q03', 'policy', 1)
	];

	it('returns 0% when no responses are provided', () => {
		const result = calculateCategoryScore(new Map(), questions, 'inventory');
		expect(result.categoryId).toBe('inventory');
		expect(result.earned).toBe(0);
		expect(result.possible).toBe(15); // (2+3) * 3
		expect(result.percentage).toBe(0);
		expect(result.riskLevel).toBe('critical');
	});

	it('returns 100% when all questions answered perfectly', () => {
		const responses = makeResponseMap([
			['q01', 3],
			['q02', 3]
		]);
		const result = calculateCategoryScore(responses, questions, 'inventory');
		expect(result.earned).toBe(15); // 3*2 + 3*3
		expect(result.possible).toBe(15);
		expect(result.percentage).toBe(100);
		expect(result.riskLevel).toBe('low');
	});

	it('calculates weighted score correctly for mixed responses', () => {
		// q01 (weight 2): score 2 → 4 points
		// q02 (weight 3): score 1 → 3 points
		// earned = 7, possible = 15, percentage = round(7/15*100) = round(46.7) = 47
		const responses = makeResponseMap([
			['q01', 2],
			['q02', 1]
		]);
		const result = calculateCategoryScore(responses, questions, 'inventory');
		expect(result.earned).toBe(7);
		expect(result.possible).toBe(15);
		expect(result.percentage).toBe(47);
		expect(result.riskLevel).toBe('high');
	});

	it('only counts questions from the specified category', () => {
		const responses = makeResponseMap([['q03', 3]]);
		const inventoryResult = calculateCategoryScore(responses, questions, 'inventory');
		expect(inventoryResult.earned).toBe(0);
		expect(inventoryResult.possible).toBe(15);
	});

	it('handles a single question correctly', () => {
		const singleQ = [makeQuestion('q10', 'risk', 1)];
		const responses = makeResponseMap([['q10', 2]]);
		const result = calculateCategoryScore(responses, singleQ, 'risk');
		expect(result.earned).toBe(2);
		expect(result.possible).toBe(3);
		expect(result.percentage).toBe(67);
		expect(result.riskLevel).toBe('moderate');
	});

	it('returns 0% for a category with no matching questions', () => {
		const result = calculateCategoryScore(new Map(), questions, 'nonexistent');
		expect(result.percentage).toBe(0);
		expect(result.possible).toBe(0);
	});
});

// ─── calculateOverallScore ────────────────────────────────────────────────────

describe('calculateOverallScore', () => {
	it('returns 0 for an empty array', () => {
		expect(calculateOverallScore([])).toBe(0);
	});

	it('returns the single category percentage for one category', () => {
		const scores: CategoryScore[] = [
			{ categoryId: 'inventory', earned: 6, possible: 9, percentage: 67, riskLevel: 'moderate' }
		];
		expect(calculateOverallScore(scores)).toBe(67);
	});

	it('returns the average of all category percentages', () => {
		const scores: CategoryScore[] = [
			{ categoryId: 'inventory', earned: 9, possible: 9, percentage: 100, riskLevel: 'low' },
			{ categoryId: 'policy', earned: 0, possible: 9, percentage: 0, riskLevel: 'critical' }
		];
		expect(calculateOverallScore(scores)).toBe(50);
	});

	it('rounds the result to the nearest integer', () => {
		const scores: CategoryScore[] = [
			{ categoryId: 'a', earned: 1, possible: 3, percentage: 33, riskLevel: 'high' },
			{ categoryId: 'b', earned: 1, possible: 3, percentage: 34, riskLevel: 'high' }
		];
		// (33 + 34) / 2 = 33.5 → rounds to 34
		expect(calculateOverallScore(scores)).toBe(34);
	});
});

// ─── generateRecommendations ──────────────────────────────────────────────────

describe('generateRecommendations', () => {
	const inventoryQuestions = [
		makeQuestion('q01', 'inventory', 2),
		makeQuestion('q02', 'inventory', 3)
	];

	it('returns recommendations for a critical-risk category', () => {
		const categoryScores: CategoryScore[] = [
			{
				categoryId: 'inventory',
				earned: 0,
				possible: 15,
				percentage: 0,
				riskLevel: 'critical'
			}
		];
		const responses = makeResponseMap([
			['q01', 0],
			['q02', 0]
		]);
		const recs = generateRecommendations(categoryScores, responses, inventoryQuestions);
		expect(recs.length).toBeGreaterThan(0);
		expect(recs.every((r) => r.category === 'inventory')).toBe(true);
	});

	it('all recommendations for a critical category have immediate priority', () => {
		const categoryScores: CategoryScore[] = [
			{
				categoryId: 'inventory',
				earned: 0,
				possible: 15,
				percentage: 0,
				riskLevel: 'critical'
			}
		];
		const responses = makeResponseMap([
			['q01', 0],
			['q02', 0]
		]);
		const recs = generateRecommendations(categoryScores, responses, inventoryQuestions);
		expect(recs.every((r) => r.priority === 'immediate')).toBe(true);
	});

	it('returns recommendations sorted by priority (immediate before short-term)', () => {
		const categoryScores: CategoryScore[] = [
			{
				categoryId: 'inventory',
				earned: 12,
				possible: 15,
				percentage: 80,
				riskLevel: 'low'
			},
			{
				categoryId: 'policy',
				earned: 0,
				possible: 15,
				percentage: 0,
				riskLevel: 'critical'
			}
		];
		const policyQuestions = [makeQuestion('q05', 'policy', 3)];
		const responses = makeResponseMap([
			['q01', 3],
			['q02', 3],
			['q05', 0]
		]);
		const allQuestions = [...inventoryQuestions, ...policyQuestions];
		const recs = generateRecommendations(categoryScores, responses, allQuestions);

		const immediateIndex = recs.findIndex((r) => r.priority === 'immediate');
		const shortTermIndex = recs.findIndex((r) => r.priority === 'short-term');
		if (immediateIndex !== -1 && shortTermIndex !== -1) {
			expect(immediateIndex).toBeLessThan(shortTermIndex);
		}
	});

	it('boosts priority to immediate when any question in category scored 0', () => {
		const categoryScores: CategoryScore[] = [
			{
				categoryId: 'inventory',
				earned: 6,
				possible: 15,
				percentage: 40,
				riskLevel: 'high'
			}
		];
		// q01 scores 0 — should boost all recs to immediate
		const responses = makeResponseMap([
			['q01', 0],
			['q02', 3]
		]);
		const recs = generateRecommendations(categoryScores, responses, inventoryQuestions);
		expect(recs.every((r) => r.priority === 'immediate')).toBe(true);
	});

	it('returns empty array when no category templates match', () => {
		const categoryScores: CategoryScore[] = [
			{
				categoryId: 'unknown_category',
				earned: 0,
				possible: 9,
				percentage: 0,
				riskLevel: 'critical'
			}
		];
		const recs = generateRecommendations(categoryScores, new Map(), []);
		expect(recs).toEqual([]);
	});

	it('includes regulatory deadline when applicable', () => {
		const categoryScores: CategoryScore[] = [
			{
				categoryId: 'compliance',
				earned: 0,
				possible: 24,
				percentage: 0,
				riskLevel: 'critical'
			}
		];
		const complianceQuestions = [makeQuestion('q12', 'compliance', 2)];
		const responses = makeResponseMap([['q12', 0]]);
		const recs = generateRecommendations(categoryScores, responses, complianceQuestions);
		const withDeadline = recs.filter((r) => r.regulatoryDeadline !== undefined);
		expect(withDeadline.length).toBeGreaterThan(0);
	});
});
