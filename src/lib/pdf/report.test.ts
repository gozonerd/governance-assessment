import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateReport } from './report.js';
import type { AssessmentResult, RiskLevel } from '$lib/types.js';

const { mockAddPage, mockSave } = vi.hoisted(() => ({
	mockAddPage: vi.fn(),
	mockSave: vi.fn()
}));

vi.mock('jspdf', () => ({
	jsPDF: class {
		internal = {
			pageSize: {
				getWidth: () => 210,
				getHeight: () => 297
			}
		};
		setFillColor = vi.fn();
		setTextColor = vi.fn();
		setDrawColor = vi.fn();
		setFontSize = vi.fn();
		setFont = vi.fn();
		setLineWidth = vi.fn();
		rect = vi.fn();
		text = vi.fn();
		circle = vi.fn();
		line = vi.fn();
		splitTextToSize = vi.fn(() => ['mocked line']);
		addPage = mockAddPage;
		save = mockSave;
	}
}));

function makeModerateResults(): AssessmentResult {
	return {
		overallScore: 63,
		overallRiskLevel: 'moderate' as RiskLevel,
		completedAt: new Date('2026-04-11'),
		categoryScores: [
			{ categoryId: 'inventory', earned: 9, possible: 12, percentage: 75, riskLevel: 'moderate' },
			{ categoryId: 'policy', earned: 9, possible: 12, percentage: 75, riskLevel: 'moderate' },
			{ categoryId: 'risk', earned: 6, possible: 9, percentage: 67, riskLevel: 'moderate' },
			{ categoryId: 'compliance', earned: 9, possible: 12, percentage: 75, riskLevel: 'moderate' },
			{ categoryId: 'oversight', earned: 6, possible: 9, percentage: 67, riskLevel: 'moderate' }
		],
		recommendations: [
			{ text: 'Create a formal AI inventory', category: 'inventory', priority: 'short-term' },
			{ text: 'Develop AI governance policy', category: 'policy', priority: 'medium-term' },
			{ text: 'Implement risk management framework', category: 'risk', priority: 'medium-term' }
		]
	};
}

function makeZeroResults(): AssessmentResult {
	return {
		overallScore: 0,
		overallRiskLevel: 'critical' as RiskLevel,
		completedAt: new Date('2026-04-11'),
		categoryScores: [
			{ categoryId: 'inventory', earned: 0, possible: 12, percentage: 0, riskLevel: 'critical' },
			{ categoryId: 'policy', earned: 0, possible: 12, percentage: 0, riskLevel: 'critical' },
			{ categoryId: 'risk', earned: 0, possible: 9, percentage: 0, riskLevel: 'critical' },
			{ categoryId: 'compliance', earned: 0, possible: 12, percentage: 0, riskLevel: 'critical' },
			{ categoryId: 'oversight', earned: 0, possible: 9, percentage: 0, riskLevel: 'critical' }
		],
		recommendations: [
			{
				text: 'Conduct immediate AI audit',
				category: 'inventory',
				priority: 'immediate',
				regulatoryDeadline: '2026-06-30'
			},
			{
				text: 'Establish governance committee',
				category: 'policy',
				priority: 'immediate'
			}
		]
	};
}

function makePerfectResults(): AssessmentResult {
	return {
		overallScore: 100,
		overallRiskLevel: 'low' as RiskLevel,
		completedAt: new Date('2026-04-11'),
		categoryScores: [
			{ categoryId: 'inventory', earned: 12, possible: 12, percentage: 100, riskLevel: 'low' },
			{ categoryId: 'policy', earned: 12, possible: 12, percentage: 100, riskLevel: 'low' },
			{ categoryId: 'risk', earned: 9, possible: 9, percentage: 100, riskLevel: 'low' },
			{ categoryId: 'compliance', earned: 12, possible: 12, percentage: 100, riskLevel: 'low' },
			{ categoryId: 'oversight', earned: 9, possible: 9, percentage: 100, riskLevel: 'low' }
		],
		recommendations: []
	};
}

describe('generateReport', () => {
	beforeEach(() => {
		mockAddPage.mockClear();
		mockSave.mockClear();
	});

	it('does not throw with all-moderate scores', async () => {
		await expect(generateReport(makeModerateResults())).resolves.toBeUndefined();
	});

	it('does not throw with all-zero scores (critical risk)', async () => {
		await expect(generateReport(makeZeroResults())).resolves.toBeUndefined();
	});

	it('does not throw with all-perfect scores (low risk)', async () => {
		await expect(generateReport(makePerfectResults())).resolves.toBeUndefined();
	});

	it('generates exactly 7 pages (addPage called 6 times)', async () => {
		await generateReport(makeModerateResults());
		expect(mockAddPage).toHaveBeenCalledTimes(6);
	});

	it('calls doc.save() with correct filename pattern', async () => {
		await generateReport(makeModerateResults());
		expect(mockSave).toHaveBeenCalledTimes(1);
		expect(mockSave).toHaveBeenCalledWith(expect.stringContaining('AI_Governance_Assessment_'));
	});
});
