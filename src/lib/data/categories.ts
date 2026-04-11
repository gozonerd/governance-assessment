import type { AssessmentCategory } from '$lib/types.js';

export const categories: AssessmentCategory[] = [
	{
		id: 'inventory',
		label: 'AI Inventory & Visibility',
		description: 'Your ability to identify, track, and document all AI tools and systems in use.',
		icon: 'search'
	},
	{
		id: 'policy',
		label: 'Policy & Governance Structure',
		description: 'Formal governance frameworks, policies, and defined roles for AI oversight.',
		icon: 'file-text'
	},
	{
		id: 'risk',
		label: 'Risk Management & Security',
		description: 'Identification and mitigation of AI-specific security and operational risks.',
		icon: 'shield-alert'
	},
	{
		id: 'compliance',
		label: 'Compliance & Regulatory Readiness',
		description: 'Preparedness for EU AI Act, Colorado AI Act, and other emerging AI regulations.',
		icon: 'scale'
	},
	{
		id: 'oversight',
		label: 'Human Oversight & Accountability',
		description: 'Mechanisms for human review, error escalation, and AI incident response.',
		icon: 'users'
	}
];

export const categoryIds = categories.map((c) => c.id);
