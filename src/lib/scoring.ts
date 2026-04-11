import type {
	AssessmentQuestion,
	AssessmentResponse,
	CategoryScore,
	Recommendation,
	RecommendationPriority,
	RiskLevel
} from '$lib/types.js';
import { recommendationTemplates } from '$lib/data/recommendations.js';

/**
 * Determines risk level from a percentage score.
 * 0–25 → critical, 26–50 → high, 51–75 → moderate, 76–100 → low
 */
export function determineRiskLevel(percentage: number): RiskLevel {
	if (percentage <= 25) return 'critical';
	if (percentage <= 50) return 'high';
	if (percentage <= 75) return 'moderate';
	return 'low';
}

/**
 * Calculates the score for a single category, applying question weights.
 * earned = Σ(response.score × question.weight)
 * possible = Σ(3 × question.weight)
 */
export function calculateCategoryScore(
	responses: Map<string, AssessmentResponse>,
	questions: AssessmentQuestion[],
	categoryId: string
): CategoryScore {
	const categoryQuestions = questions.filter((q) => q.category === categoryId);

	let earned = 0;
	let possible = 0;

	for (const question of categoryQuestions) {
		possible += question.weight * 3;
		const response = responses.get(question.id);
		if (response) {
			earned += response.score * question.weight;
		}
	}

	const percentage = possible > 0 ? Math.round((earned / possible) * 100) : 0;

	return {
		categoryId,
		earned,
		possible,
		percentage,
		riskLevel: determineRiskLevel(percentage)
	};
}

/**
 * Calculates the overall score as the average of all category percentages.
 * Returns 0 for an empty array.
 */
export function calculateOverallScore(categoryScores: CategoryScore[]): number {
	if (categoryScores.length === 0) return 0;
	const total = categoryScores.reduce((sum, cs) => sum + cs.percentage, 0);
	return Math.round(total / categoryScores.length);
}

const PRIORITY_ORDER: Record<RecommendationPriority, number> = {
	immediate: 0,
	'short-term': 1,
	'medium-term': 2
};

/**
 * Generates prioritized recommendations based on category scores and response data.
 * Categories with any question scoring 0 receive 'immediate' priority regardless
 * of overall category risk level. Priority otherwise follows category risk level:
 * critical/high → immediate, moderate → short-term, low → medium-term.
 */
export function generateRecommendations(
	categoryScores: CategoryScore[],
	responses: Map<string, AssessmentResponse>,
	questions: AssessmentQuestion[]
): Recommendation[] {
	const result: Recommendation[] = [];

	for (const categoryScore of categoryScores) {
		const templates = recommendationTemplates[categoryScore.categoryId];
		if (!templates) continue;

		const recs = templates[categoryScore.riskLevel];
		if (!recs || recs.length === 0) continue;

		// Check if any question in this category scored 0 — boosts to immediate
		const categoryQuestions = questions.filter((q) => q.category === categoryScore.categoryId);
		const hasZeroScore = categoryQuestions.some((q) => {
			const response = responses.get(q.id);
			return !response || response.score === 0;
		});

		for (const template of recs) {
			const effectivePriority: RecommendationPriority =
				hasZeroScore && template.priority !== 'immediate' ? 'immediate' : template.priority;

			result.push({
				text: template.text,
				category: categoryScore.categoryId,
				priority: effectivePriority,
				...(template.regulatoryDeadline && {
					regulatoryDeadline: template.regulatoryDeadline
				})
			});
		}
	}

	return result.sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
}
