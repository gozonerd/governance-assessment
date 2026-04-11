import { describe, it, expect } from 'vitest';
import { questions } from '$lib/data/questions.js';
import { categoryIds } from '$lib/data/categories.js';

describe('questions data integrity', () => {
	it('contains exactly 18 questions', () => {
		expect(questions).toHaveLength(18);
	});

	it('has no duplicate question IDs', () => {
		const ids = questions.map((q) => q.id);
		const unique = new Set(ids);
		expect(unique.size).toBe(questions.length);
	});

	it('every question has exactly 4 options', () => {
		for (const question of questions) {
			expect(question.options).toHaveLength(4);
		}
	});

	it('every option score is 0, 1, 2, or 3', () => {
		const validScores = new Set([0, 1, 2, 3]);
		for (const question of questions) {
			for (const option of question.options) {
				expect(validScores.has(option.score)).toBe(true);
			}
		}
	});

	it('options are in strictly ascending score order (0, 1, 2, 3)', () => {
		for (const question of questions) {
			const scores = question.options.map((o) => o.score);
			expect(scores).toEqual([0, 1, 2, 3]);
		}
	});

	it('every question weight is 1, 2, or 3', () => {
		const validWeights = new Set([1, 2, 3]);
		for (const question of questions) {
			expect(validWeights.has(question.weight)).toBe(true);
		}
	});

	it('every question references a valid category ID', () => {
		const validIds = new Set(categoryIds);
		for (const question of questions) {
			expect(validIds.has(question.category)).toBe(true);
		}
	});

	it('every question has non-empty text and helpText', () => {
		for (const question of questions) {
			expect(question.text.trim().length).toBeGreaterThan(0);
			expect(question.helpText.trim().length).toBeGreaterThan(0);
		}
	});

	it('every option has a non-empty label', () => {
		for (const question of questions) {
			for (const option of question.options) {
				expect(option.label.trim().length).toBeGreaterThan(0);
			}
		}
	});

	it('all 5 categories are represented', () => {
		const categoryCounts = new Map<string, number>();
		for (const id of categoryIds) {
			categoryCounts.set(id, 0);
		}
		for (const question of questions) {
			const count = categoryCounts.get(question.category) ?? 0;
			categoryCounts.set(question.category, count + 1);
		}
		for (const id of categoryIds) {
			expect(categoryCounts.get(id)).toBeGreaterThan(0);
		}
	});

	it('each category has at least 3 questions', () => {
		const categoryCounts = new Map<string, number>();
		for (const question of questions) {
			const count = categoryCounts.get(question.category) ?? 0;
			categoryCounts.set(question.category, count + 1);
		}
		for (const [_catId, count] of categoryCounts) {
			expect(count).toBeGreaterThanOrEqual(3);
		}
	});
});
