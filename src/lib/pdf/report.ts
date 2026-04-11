import type { AssessmentResult, RiskLevel } from '$lib/types.js';
import { categories } from '$lib/data/categories.js';

const SITE_URL = 'governance.krystalmartinez.com';

// ─── Color helpers ────────────────────────────────────────────────────────────

const RISK_COLORS: Record<RiskLevel, [number, number, number]> = {
	critical: [239, 68, 68],
	high: [249, 115, 22],
	moderate: [234, 179, 8],
	low: [34, 197, 94]
};

const COLOR_PRIMARY: [number, number, number] = [30, 58, 95];
const COLOR_ACCENT: [number, number, number] = [13, 148, 136];
const COLOR_BG: [number, number, number] = [15, 23, 42];
const COLOR_TEXT_PRIMARY: [number, number, number] = [241, 245, 249];
const COLOR_TEXT_SECONDARY: [number, number, number] = [148, 163, 184];
const COLOR_PANEL: [number, number, number] = [30, 41, 59];

// ─── PDF helpers ──────────────────────────────────────────────────────────────

interface PDFDoc {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any;
}

function setFill(doc: PDFDoc, rgb: [number, number, number]) {
	doc.setFillColor(rgb[0], rgb[1], rgb[2]);
}

function setTextColor(doc: PDFDoc, rgb: [number, number, number]) {
	doc.setTextColor(rgb[0], rgb[1], rgb[2]);
}

function setDrawColor(doc: PDFDoc, rgb: [number, number, number]) {
	doc.setDrawColor(rgb[0], rgb[1], rgb[2]);
}

function pageWidth(doc: PDFDoc): number {
	return doc.internal.pageSize.getWidth();
}

function addFooter(doc: PDFDoc, pageNum: number, totalPages: number) {
	const w = pageWidth(doc);
	const footerY = doc.internal.pageSize.getHeight() - 8;

	setDrawColor(doc, COLOR_PANEL);
	doc.setLineWidth(0.3);
	doc.line(12, footerY - 4, w - 12, footerY - 4);

	doc.setFontSize(8);
	setTextColor(doc, COLOR_TEXT_SECONDARY);
	doc.text(SITE_URL, 12, footerY);
	doc.text(
		`Generated ${new Date().toISOString().split('T')[0]} | Page ${pageNum} of ${totalPages}`,
		w - 12,
		footerY,
		{ align: 'right' }
	);
}

function sectionHeader(doc: PDFDoc, text: string, y: number): number {
	setFill(doc, COLOR_PRIMARY);
	doc.rect(12, y, pageWidth(doc) - 24, 8, 'F');
	doc.setFontSize(10);
	doc.setFont('helvetica', 'bold');
	setTextColor(doc, COLOR_TEXT_PRIMARY);
	doc.text(text, 16, y + 5.5);
	return y + 12;
}

function wrappedText(
	doc: PDFDoc,
	text: string,
	x: number,
	y: number,
	maxWidth: number,
	lineHeight: number
): number {
	const lines: string[] = doc.splitTextToSize(text, maxWidth);
	doc.text(lines, x, y);
	return y + lines.length * lineHeight;
}

// ─── Page builders ────────────────────────────────────────────────────────────

function buildCoverPage(doc: PDFDoc, results: AssessmentResult) {
	const w = pageWidth(doc);

	// Dark background
	setFill(doc, COLOR_BG);
	doc.rect(0, 0, w, doc.internal.pageSize.getHeight(), 'F');

	// Top accent bar
	setFill(doc, COLOR_ACCENT);
	doc.rect(0, 0, w, 3, 'F');

	// Title
	doc.setFontSize(22);
	doc.setFont('helvetica', 'bold');
	setTextColor(doc, COLOR_TEXT_PRIMARY);
	doc.text('AI Governance Readiness', w / 2, 40, { align: 'center' });
	doc.text('Assessment Report', w / 2, 52, { align: 'center' });

	// Subtitle
	doc.setFontSize(10);
	doc.setFont('helvetica', 'normal');
	setTextColor(doc, COLOR_TEXT_SECONDARY);
	doc.text('Prepared by governance.krystalmartinez.com', w / 2, 62, { align: 'center' });
	doc.text(
		`Generated: ${results.completedAt.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`,
		w / 2,
		70,
		{ align: 'center' }
	);

	// Score circle
	const scoreColor = RISK_COLORS[results.overallRiskLevel];
	setDrawColor(doc, scoreColor);
	doc.setLineWidth(3);
	doc.circle(w / 2, 105, 22);

	doc.setFontSize(28);
	doc.setFont('helvetica', 'bold');
	setTextColor(doc, scoreColor);
	doc.text(String(results.overallScore), w / 2, 109, { align: 'center' });

	doc.setFontSize(8);
	setTextColor(doc, COLOR_TEXT_SECONDARY);
	doc.text('/ 100', w / 2, 117, { align: 'center' });

	const riskLabels: Record<RiskLevel, string> = {
		critical: 'Critical Risk',
		high: 'High Risk',
		moderate: 'Moderate Risk',
		low: 'Low Risk'
	};
	doc.setFontSize(11);
	doc.setFont('helvetica', 'bold');
	setTextColor(doc, scoreColor);
	doc.text(riskLabels[results.overallRiskLevel], w / 2, 128, { align: 'center' });

	addFooter(doc, 1, 6);
}

function buildExecutiveSummary(doc: PDFDoc, results: AssessmentResult) {
	const w = pageWidth(doc);

	setFill(doc, COLOR_BG);
	doc.rect(0, 0, w, doc.internal.pageSize.getHeight(), 'F');
	setFill(doc, COLOR_ACCENT);
	doc.rect(0, 0, w, 3, 'F');

	doc.setFontSize(16);
	doc.setFont('helvetica', 'bold');
	setTextColor(doc, COLOR_TEXT_PRIMARY);
	doc.text('Executive Summary', 12, 18);

	let y = 28;

	y = sectionHeader(doc, 'Overall Readiness', y);
	doc.setFontSize(9);
	doc.setFont('helvetica', 'normal');
	setTextColor(doc, COLOR_TEXT_SECONDARY);
	const summaryText = `Your organization scored ${results.overallScore}/100 (${results.overallRiskLevel} risk). This assessment evaluated ${results.categoryScores.length} governance categories across ${18} questions covering AI visibility, policy structure, risk management, regulatory compliance, and human oversight.`;
	y = wrappedText(doc, summaryText, 12, y, w - 24, 5) + 4;

	y = sectionHeader(doc, 'Top 3 Findings', y);
	const sortedCats = [...results.categoryScores].sort((a, b) => a.percentage - b.percentage);
	const top3 = sortedCats.slice(0, 3);
	for (const cs of top3) {
		const label = categories.find((c) => c.id === cs.categoryId)?.label ?? cs.categoryId;
		const scoreColor = RISK_COLORS[cs.riskLevel];
		setFill(doc, scoreColor);
		doc.rect(12, y - 3, 3, 4, 'F');
		doc.setFontSize(9);
		doc.setFont('helvetica', 'bold');
		setTextColor(doc, scoreColor);
		doc.text(`${cs.percentage}% — ${label}`, 18, y);
		doc.setFont('helvetica', 'normal');
		setTextColor(doc, COLOR_TEXT_SECONDARY);
		doc.text(`(${cs.riskLevel} risk)`, 18, y + 4.5);
		y += 12;
	}
	y += 4;

	// Shadow AI risk indicator
	const inventoryScore = results.categoryScores.find((cs) => cs.categoryId === 'inventory');
	if (inventoryScore && inventoryScore.percentage < 50) {
		y = sectionHeader(doc, 'Shadow AI Risk Indicator', y);
		doc.setFontSize(9);
		doc.setFont('helvetica', 'normal');
		setTextColor(doc, COLOR_TEXT_SECONDARY);
		const shadowText =
			'Your AI Inventory score indicates significant shadow AI risk. 98% of organizations have unapproved AI tools in use. 1 in 5 has experienced a data breach attributable to shadow AI. The average additional breach cost is $670,000. Immediate inventory and access controls are recommended.';
		y = wrappedText(doc, shadowText, 12, y, w - 24, 5) + 4;
	}

	// Regulatory urgency
	const complianceScore = results.categoryScores.find((cs) => cs.categoryId === 'compliance');
	if (complianceScore && complianceScore.percentage < 50) {
		y = sectionHeader(doc, 'Regulatory Urgency', y);
		doc.setFontSize(9);
		doc.setFont('helvetica', 'normal');
		setTextColor(doc, COLOR_TEXT_SECONDARY);
		const regText =
			'Colorado AI Act (SB 24-205) takes effect June 30, 2026. EU AI Act high-risk system requirements are effective August 2, 2026. Your compliance score indicates gaps that require immediate action to meet these deadlines.';
		wrappedText(doc, regText, 12, y, w - 24, 5);
	}

	addFooter(doc, 2, 6);
}

function buildCategoryPage(
	doc: PDFDoc,
	results: AssessmentResult,
	catIds: string[],
	pageNum: number
) {
	const w = pageWidth(doc);

	setFill(doc, COLOR_BG);
	doc.rect(0, 0, w, doc.internal.pageSize.getHeight(), 'F');
	setFill(doc, COLOR_ACCENT);
	doc.rect(0, 0, w, 3, 'F');

	doc.setFontSize(16);
	doc.setFont('helvetica', 'bold');
	setTextColor(doc, COLOR_TEXT_PRIMARY);
	doc.text('Category Detail', 12, 18);

	let y = 26;

	for (const catId of catIds) {
		const cs = results.categoryScores.find((s) => s.categoryId === catId);
		const cat = categories.find((c) => c.id === catId);
		if (!cs || !cat) continue;

		const scoreColor = RISK_COLORS[cs.riskLevel];

		// Category header
		setFill(doc, COLOR_PANEL);
		doc.rect(12, y, w - 24, 7, 'F');
		setFill(doc, scoreColor);
		doc.rect(12, y, 3, 7, 'F');

		doc.setFontSize(10);
		doc.setFont('helvetica', 'bold');
		setTextColor(doc, COLOR_TEXT_PRIMARY);
		doc.text(cat.label, 18, y + 5);

		doc.setFontSize(10);
		setTextColor(doc, scoreColor);
		doc.text(`${cs.percentage}%`, w - 14, y + 5, { align: 'right' });
		y += 11;

		// Score bar
		doc.setFontSize(8);
		doc.setFont('helvetica', 'normal');
		setTextColor(doc, COLOR_TEXT_SECONDARY);
		doc.text(`Score: ${cs.earned}/${cs.possible} weighted points — ${cs.riskLevel} risk`, 12, y);
		y += 5;

		const barW = w - 24;
		setFill(doc, COLOR_PANEL);
		doc.rect(12, y, barW, 3, 'F');
		setFill(doc, scoreColor);
		doc.rect(12, y, barW * (cs.percentage / 100), 3, 'F');
		y += 7;

		// Top recommendation
		const topRec = results.recommendations.find((r) => r.category === catId);
		if (topRec) {
			setTextColor(doc, COLOR_TEXT_SECONDARY);
			doc.setFontSize(8);
			const recLines: string[] = doc.splitTextToSize(`→ ${topRec.text}`, w - 24);
			doc.text(recLines, 12, y);
			y += recLines.length * 4.5 + 4;
		}

		y += 4;
	}

	addFooter(doc, pageNum, 6);
}

function buildActionPlan(doc: PDFDoc, results: AssessmentResult) {
	const w = pageWidth(doc);

	setFill(doc, COLOR_BG);
	doc.rect(0, 0, w, doc.internal.pageSize.getHeight(), 'F');
	setFill(doc, COLOR_ACCENT);
	doc.rect(0, 0, w, 3, 'F');

	doc.setFontSize(16);
	doc.setFont('helvetica', 'bold');
	setTextColor(doc, COLOR_TEXT_PRIMARY);
	doc.text('90-Day Action Plan', 12, 18);

	let y = 28;
	let recNum = 1;

	const buckets: Array<{
		label: string;
		filter: (r: (typeof results.recommendations)[0]) => boolean;
		color: [number, number, number];
	}> = [
		{
			label: '0–30 Days: Immediate Actions',
			filter: (r) => r.priority === 'immediate',
			color: RISK_COLORS.critical
		},
		{
			label: '30–60 Days: Short-Term Actions',
			filter: (r) => r.priority === 'short-term',
			color: RISK_COLORS.high
		},
		{
			label: '60–90 Days: Medium-Term Actions',
			filter: (r) => r.priority === 'medium-term',
			color: RISK_COLORS.moderate
		}
	];

	for (const bucket of buckets) {
		const recs = results.recommendations.filter(bucket.filter);
		if (recs.length === 0) continue;

		y = sectionHeader(doc, bucket.label, y);

		for (const rec of recs) {
			if (y > 260) break; // avoid overflow
			doc.setFontSize(8);
			doc.setFont('helvetica', 'bold');
			setTextColor(doc, bucket.color);
			doc.text(`${recNum}.`, 12, y);
			doc.setFont('helvetica', 'normal');
			setTextColor(doc, COLOR_TEXT_SECONDARY);
			const lines: string[] = doc.splitTextToSize(rec.text, w - 30);
			doc.text(lines, 20, y);
			y += lines.length * 4.5;
			if (rec.regulatoryDeadline) {
				doc.setFontSize(7);
				setTextColor(doc, RISK_COLORS.critical);
				doc.text(`Deadline: ${rec.regulatoryDeadline}`, 20, y);
				y += 4.5;
			}
			y += 3;
			recNum++;
		}
	}

	addFooter(doc, 5, 6);
}

function buildMethodology(doc: PDFDoc) {
	const w = pageWidth(doc);

	setFill(doc, COLOR_BG);
	doc.rect(0, 0, w, doc.internal.pageSize.getHeight(), 'F');
	setFill(doc, COLOR_ACCENT);
	doc.rect(0, 0, w, 3, 'F');

	doc.setFontSize(16);
	doc.setFont('helvetica', 'bold');
	setTextColor(doc, COLOR_TEXT_PRIMARY);
	doc.text('Methodology & Sources', 12, 18);

	let y = 28;

	y = sectionHeader(doc, 'Assessment Framework', y);
	doc.setFontSize(9);
	doc.setFont('helvetica', 'normal');
	setTextColor(doc, COLOR_TEXT_SECONDARY);
	const methodText =
		'This assessment evaluates AI governance readiness across 5 categories using 18 weighted questions. Each question is scored 0–3 (no capability to full capability). Category scores are calculated using weighted averages. Risk levels: Critical (0–25%), High (26–50%), Moderate (51–75%), Low (76–100%).';
	y = wrappedText(doc, methodText, 12, y, w - 24, 5) + 6;

	y = sectionHeader(doc, 'Regulatory References', y);
	doc.setFontSize(9);
	setTextColor(doc, COLOR_TEXT_SECONDARY);
	const refs = [
		'EU AI Act (Regulation (EU) 2024/1689) — High-risk system requirements effective August 2, 2026',
		'Colorado SB 24-205 (AI Act) — Algorithmic decision-making requirements effective June 30, 2026',
		'OWASP LLM Top 10 (2025) — AI security risk framework'
	];
	for (const ref of refs) {
		setFill(doc, COLOR_ACCENT);
		doc.rect(12, y - 2.5, 2, 3, 'F');
		doc.text(ref, 17, y);
		y += 6;
	}
	y += 4;

	y = sectionHeader(doc, 'Disclaimer', y);
	doc.setFontSize(8);
	setTextColor(doc, COLOR_TEXT_SECONDARY);
	const disclaimer =
		'This assessment is for informational purposes only and does not constitute legal advice. Results reflect self-reported responses and should be validated with qualified legal, compliance, and security professionals. Regulatory requirements vary by jurisdiction, industry, and organizational context.';
	wrappedText(doc, disclaimer, 12, y, w - 24, 5);

	addFooter(doc, 6, 6);
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Generates a 6-page jsPDF report from assessment results and triggers a browser download.
 * Uses dynamic import to avoid SSR issues.
 */
export async function generateReport(results: AssessmentResult): Promise<void> {
	const { jsPDF } = await import('jspdf');
	const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' }) as PDFDoc;

	// Page 1: Cover
	buildCoverPage(doc, results);

	// Page 2: Executive Summary
	doc.addPage();
	buildExecutiveSummary(doc, results);

	// Page 3: Category Detail (inventory, policy, risk)
	doc.addPage();
	buildCategoryPage(doc, results, ['inventory', 'policy', 'risk'], 3);

	// Page 4: Category Detail (compliance, oversight)
	doc.addPage();
	buildCategoryPage(doc, results, ['compliance', 'oversight'], 4);

	// Page 5: 90-Day Action Plan
	doc.addPage();
	buildActionPlan(doc, results);

	// Page 6: Methodology & Sources
	doc.addPage();
	buildMethodology(doc);

	doc.save(`AI_Governance_Assessment_${new Date().toISOString().split('T')[0]}.pdf`);
}
