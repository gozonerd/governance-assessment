export type RiskLevel = 'critical' | 'high' | 'moderate' | 'low';

export type OptionScore = 0 | 1 | 2 | 3;
export type QuestionWeight = 1 | 2 | 3;
export type RecommendationPriority = 'immediate' | 'short-term' | 'medium-term';

export interface AssessmentCategory {
	id: string;
	label: string;
	description: string;
	icon: string;
}

export interface QuestionOption {
	label: string;
	score: OptionScore;
}

export interface AssessmentQuestion {
	id: string;
	text: string;
	category: string;
	helpText: string;
	options: [QuestionOption, QuestionOption, QuestionOption, QuestionOption];
	weight: QuestionWeight;
	regulatoryRef?: string;
}

export interface AssessmentResponse {
	questionId: string;
	selectedIndex: number;
	score: OptionScore;
}

export interface CategoryScore {
	categoryId: string;
	earned: number;
	possible: number;
	percentage: number;
	riskLevel: RiskLevel;
}

export interface Recommendation {
	text: string;
	category: string;
	priority: RecommendationPriority;
	regulatoryDeadline?: string;
}

export interface AssessmentResult {
	categoryScores: CategoryScore[];
	overallScore: number;
	overallRiskLevel: RiskLevel;
	recommendations: Recommendation[];
	completedAt: Date;
	responses?: ReadonlyMap<string, AssessmentResponse>;
}
