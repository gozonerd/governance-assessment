import type { AssessmentResult, RiskLevel } from '$lib/types.js';
import { categories } from '$lib/data/categories.js';
import { questions } from '$lib/data/questions.js';

const SITE_URL = 'governance.krystalmartinez.com';
const TOTAL_PAGES = 7;

// ─── Color helpers ────────────────────────────────────────────────────────────

const RISK_COLORS: Record<RiskLevel, [number, number, number]> = {
	critical: [220, 38, 38],
	high: [234, 88, 12],
	moderate: [202, 138, 4],
	low: [22, 163, 74]
};

// Light professional theme
const COLOR_BG: [number, number, number] = [255, 255, 255];
const COLOR_HEADER: [number, number, number] = [30, 58, 95]; // navy header bars
const COLOR_PANEL: [number, number, number] = [241, 245, 249]; // light gray panels
const COLOR_ACCENT: [number, number, number] = [13, 148, 136]; // teal
const COLOR_TEXT_PRIMARY: [number, number, number] = [15, 23, 42]; // near black
const COLOR_TEXT_SECONDARY: [number, number, number] = [71, 85, 105]; // medium gray
const COLOR_TEXT_MUTED: [number, number, number] = [148, 163, 184]; // light gray
const COLOR_BORDER: [number, number, number] = [203, 213, 225]; // light border

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

function pageHeight(doc: PDFDoc): number {
	return doc.internal.pageSize.getHeight();
}

function addFooter(doc: PDFDoc, pageNum: number) {
	const w = pageWidth(doc);
	const footerY = pageHeight(doc) - 8;

	setDrawColor(doc, COLOR_BORDER);
	doc.setLineWidth(0.3);
	doc.line(12, footerY - 4, w - 12, footerY - 4);

	doc.setFontSize(8);
	setTextColor(doc, COLOR_TEXT_MUTED);
	doc.text(SITE_URL, 12, footerY);
	doc.text(
		`Generated ${new Date().toISOString().split('T')[0]} | Page ${pageNum} of ${TOTAL_PAGES}`,
		w - 12,
		footerY,
		{ align: 'right' }
	);
}

function sectionHeader(doc: PDFDoc, text: string, y: number): number {
	setFill(doc, COLOR_HEADER);
	doc.rect(12, y, pageWidth(doc) - 24, 8, 'F');
	doc.setFontSize(9);
	doc.setFont('helvetica', 'bold');
	setTextColor(doc, [255, 255, 255]);
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

/** Draws a thin border line (for card-style sections). */
function panelRect(doc: PDFDoc, x: number, y: number, w: number, h: number) {
	setFill(doc, COLOR_PANEL);
	doc.rect(x, y, w, h, 'F');
	setDrawColor(doc, COLOR_BORDER);
	doc.setLineWidth(0.2);
	doc.rect(x, y, w, h, 'S');
}

// ─── Page builders ────────────────────────────────────────────────────────────

function buildCoverPage(doc: PDFDoc, results: AssessmentResult, orgName?: string) {
	const w = pageWidth(doc);
	const h = pageHeight(doc);

	// White background
	setFill(doc, COLOR_BG);
	doc.rect(0, 0, w, h, 'F');

	// Top navy accent bar
	setFill(doc, COLOR_HEADER);
	doc.rect(0, 0, w, 4, 'F');

	// Teal side accent bar
	setFill(doc, COLOR_ACCENT);
	doc.rect(0, 4, 4, h - 12, 'F');

	// Title block
	doc.setFontSize(22);
	doc.setFont('helvetica', 'bold');
	setTextColor(doc, COLOR_TEXT_PRIMARY);
	doc.text('AI Governance Readiness', w / 2, 38, { align: 'center' });
	doc.text('Assessment Report', w / 2, 50, { align: 'center' });

	// Subtitle line
	doc.setFontSize(10);
	doc.setFont('helvetica', 'normal');
	setTextColor(doc, COLOR_TEXT_SECONDARY);
	if (orgName) {
		doc.text(`Prepared for: ${orgName}`, w / 2, 61, { align: 'center' });
		doc.text(`governance.krystalmartinez.com`, w / 2, 68, { align: 'center' });
		doc.text(
			`Generated: ${results.completedAt.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`,
			w / 2,
			75,
			{ align: 'center' }
		);
	} else {
		doc.text('Prepared by governance.krystalmartinez.com', w / 2, 61, { align: 'center' });
		doc.text(
			`Generated: ${results.completedAt.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`,
			w / 2,
			69,
			{ align: 'center' }
		);
	}

	// Score circle — centered at y=112, radius 22
	const circleY = 112;
	const circleR = 22;
	const scoreColor = RISK_COLORS[results.overallRiskLevel];

	// Light gray fill + colored stroke
	setFill(doc, COLOR_PANEL);
	doc.circle(w / 2, circleY, circleR, 'F');
	setDrawColor(doc, scoreColor);
	doc.setLineWidth(3);
	doc.circle(w / 2, circleY, circleR, 'S');

	// Score number
	doc.setFontSize(26);
	doc.setFont('helvetica', 'bold');
	setTextColor(doc, scoreColor);
	doc.text(String(results.overallScore), w / 2, circleY + 4, { align: 'center' });

	// /100 below score number, inside circle
	doc.setFontSize(8);
	doc.setFont('helvetica', 'normal');
	setTextColor(doc, COLOR_TEXT_SECONDARY);
	doc.text('/ 100', w / 2, circleY + 11, { align: 'center' });

	// Risk label BELOW the circle with clear spacing
	const riskLabels: Record<RiskLevel, string> = {
		critical: '● Critical Risk',
		high: '● High Risk',
		moderate: '● Moderate Risk',
		low: '● Low Risk'
	};
	const riskLabelY = circleY + circleR + 12; // 12px below circle bottom
	doc.setFontSize(12);
	doc.setFont('helvetica', 'bold');
	setTextColor(doc, scoreColor);
	doc.text(riskLabels[results.overallRiskLevel], w / 2, riskLabelY, { align: 'center' });

	// Category summary table
	const tableTop = riskLabelY + 14;
	doc.setFontSize(9);
	doc.setFont('helvetica', 'bold');
	setTextColor(doc, COLOR_TEXT_PRIMARY);
	doc.text('Category Scores', w / 2, tableTop, { align: 'center' });

	let rowY = tableTop + 6;
	const colX = w / 2 - 48;
	const colW = 96;

	for (const cs of results.categoryScores) {
		const cat = categories.find((c) => c.id === cs.categoryId);
		const label = cat?.label ?? cs.categoryId;
		const rc = RISK_COLORS[cs.riskLevel];

		panelRect(doc, colX, rowY, colW, 7);
		// Color bar
		setFill(doc, rc);
		doc.rect(colX, rowY, 3, 7, 'F');

		doc.setFontSize(8);
		doc.setFont('helvetica', 'normal');
		setTextColor(doc, COLOR_TEXT_SECONDARY);
		doc.text(label, colX + 6, rowY + 4.8);

		doc.setFont('helvetica', 'bold');
		setTextColor(doc, rc);
		doc.text(`${cs.percentage}%`, colX + colW - 2, rowY + 4.8, { align: 'right' });

		rowY += 9;
	}

	addFooter(doc, 1);
}

function buildExecutiveSummary(doc: PDFDoc, results: AssessmentResult, orgName?: string) {
	const w = pageWidth(doc);

	setFill(doc, COLOR_BG);
	doc.rect(0, 0, w, pageHeight(doc), 'F');
	setFill(doc, COLOR_HEADER);
	doc.rect(0, 0, w, 4, 'F');
	setFill(doc, COLOR_ACCENT);
	doc.rect(0, 4, 4, pageHeight(doc) - 12, 'F');

	doc.setFontSize(16);
	doc.setFont('helvetica', 'bold');
	setTextColor(doc, COLOR_TEXT_PRIMARY);
	doc.text('Executive Summary', 12, 18);
	if (orgName) {
		doc.setFontSize(9);
		doc.setFont('helvetica', 'normal');
		setTextColor(doc, COLOR_TEXT_SECONDARY);
		doc.text(orgName, 12, 25);
	}

	let y = orgName ? 32 : 28;

	y = sectionHeader(doc, 'Overall Readiness', y);
	doc.setFontSize(9);
	doc.setFont('helvetica', 'normal');
	setTextColor(doc, COLOR_TEXT_SECONDARY);
	const summaryText = `Your organization scored ${results.overallScore}/100 (${results.overallRiskLevel} risk). This assessment evaluated ${results.categoryScores.length} governance categories across 18 questions covering AI visibility, policy structure, risk management, regulatory compliance, and human oversight.`;
	y = wrappedText(doc, summaryText, 12, y, w - 24, 5) + 4;

	y = sectionHeader(doc, 'Top 3 Findings (Lowest Scoring Categories)', y);
	const sortedCats = [...results.categoryScores].sort((a, b) => a.percentage - b.percentage);
	const top3 = sortedCats.slice(0, 3);
	for (const cs of top3) {
		const label = categories.find((c) => c.id === cs.categoryId)?.label ?? cs.categoryId;
		const scoreColor = RISK_COLORS[cs.riskLevel];

		panelRect(doc, 12, y - 1, w - 24, 12);
		setFill(doc, scoreColor);
		doc.rect(12, y - 1, 3, 12, 'F');

		doc.setFontSize(9);
		doc.setFont('helvetica', 'bold');
		setTextColor(doc, scoreColor);
		doc.text(`${cs.percentage}%`, 18, y + 4);

		doc.setFont('helvetica', 'normal');
		setTextColor(doc, COLOR_TEXT_SECONDARY);
		doc.text(`${label} — ${cs.riskLevel} risk`, 32, y + 4);

		y += 15;
	}
	y += 2;

	// Shadow AI indicator
	const inventoryScore = results.categoryScores.find((cs) => cs.categoryId === 'inventory');
	if (inventoryScore && inventoryScore.percentage < 50) {
		y = sectionHeader(doc, 'Shadow AI Risk Indicator', y);
		doc.setFontSize(9);
		doc.setFont('helvetica', 'normal');
		setTextColor(doc, COLOR_TEXT_SECONDARY);
		const shadowText =
			'Your AI Inventory score indicates significant shadow AI risk. 98% of organizations have unapproved AI tools in use (Reco AI Risk Report 2024). The average additional breach cost when shadow AI is involved is $670,000 (IBM Cost of a Data Breach 2025). Immediate inventory and access controls are recommended.';
		y = wrappedText(doc, shadowText, 12, y, w - 24, 5) + 4;
	}

	// Regulatory urgency
	const complianceScore = results.categoryScores.find((cs) => cs.categoryId === 'compliance');
	if (complianceScore && complianceScore.percentage < 50 && y < 230) {
		y = sectionHeader(doc, 'Regulatory Urgency', y);
		doc.setFontSize(9);
		doc.setFont('helvetica', 'normal');
		setTextColor(doc, COLOR_TEXT_SECONDARY);
		const regText =
			'Colorado AI Act (SB 24-205) takes effect June 30, 2026. EU AI Act high-risk system requirements are effective August 2, 2026. Your compliance score indicates gaps that require immediate action to meet these deadlines. Note: The Colorado legislature may amend the effective date — monitor for updates.';
		wrappedText(doc, regText, 12, y, w - 24, 5);
	}

	addFooter(doc, 2);
}

function buildCategoryPage(
	doc: PDFDoc,
	results: AssessmentResult,
	catIds: string[],
	pageNum: number
) {
	const w = pageWidth(doc);
	const maxY = pageHeight(doc) - 18;

	setFill(doc, COLOR_BG);
	doc.rect(0, 0, w, pageHeight(doc), 'F');
	setFill(doc, COLOR_HEADER);
	doc.rect(0, 0, w, 4, 'F');
	setFill(doc, COLOR_ACCENT);
	doc.rect(0, 4, 4, pageHeight(doc) - 12, 'F');

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

		// Category header panel
		setFill(doc, COLOR_HEADER);
		doc.rect(12, y, w - 24, 8, 'F');
		setFill(doc, scoreColor);
		doc.rect(12, y, 3, 8, 'F');

		doc.setFontSize(10);
		doc.setFont('helvetica', 'bold');
		setTextColor(doc, [255, 255, 255]);
		doc.text(cat.label, 18, y + 5.5);
		doc.text(`${cs.percentage}%`, w - 14, y + 5.5, { align: 'right' });
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
			doc.setFont('helvetica', 'italic');
			const recLines: string[] = doc.splitTextToSize(`Recommendation: ${topRec.text}`, w - 26);
			doc.text(recLines, 14, y);
			y += recLines.length * 4.5 + 3;
		}

		// Question-level response detail
		if (results.responses && results.responses.size > 0) {
			const catQuestions = questions.filter((q) => q.category === catId);
			if (catQuestions.length > 0) {
				doc.setFontSize(8);
				doc.setFont('helvetica', 'bold');
				setTextColor(doc, COLOR_TEXT_SECONDARY);
				doc.text('Response Detail:', 12, y);
				y += 5;

				for (const q of catQuestions) {
					if (y > maxY - 10) break;

					const resp = results.responses.get(q.id);
					const selectedLabel =
						resp !== undefined ? (q.options[resp.selectedIndex]?.label ?? '—') : '(not answered)';

					panelRect(doc, 12, y - 1, w - 24, 12);

					doc.setFontSize(7);
					doc.setFont('helvetica', 'bold');
					setTextColor(doc, COLOR_TEXT_SECONDARY);
					const qLines: string[] = doc.splitTextToSize(q.text, w - 38);
					doc.text(qLines, 14, y + 3);

					doc.setFont('helvetica', 'normal');
					setTextColor(doc, scoreColor);
					const aLines: string[] = doc.splitTextToSize(`→ ${selectedLabel}`, w - 38);
					const qH = qLines.length * 3.5;
					doc.text(aLines, 14, y + 3 + qH);

					y += Math.max(12, qH + aLines.length * 3.5 + 4);
				}
				y += 3;
			}
		}

		y += 5;
	}

	addFooter(doc, pageNum);
}

function buildActionPlan(doc: PDFDoc, results: AssessmentResult) {
	const w = pageWidth(doc);
	const maxY = pageHeight(doc) - 18;

	setFill(doc, COLOR_BG);
	doc.rect(0, 0, w, pageHeight(doc), 'F');
	setFill(doc, COLOR_HEADER);
	doc.rect(0, 0, w, 4, 'F');
	setFill(doc, COLOR_ACCENT);
	doc.rect(0, 4, 4, pageHeight(doc) - 12, 'F');

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
			label: '31–60 Days: Short-Term Actions',
			filter: (r) => r.priority === 'short-term',
			color: RISK_COLORS.high
		},
		{
			label: '61–90 Days: Medium-Term Actions',
			filter: (r) => r.priority === 'medium-term',
			color: RISK_COLORS.moderate
		}
	];

	for (const bucket of buckets) {
		const recs = results.recommendations.filter(bucket.filter);
		if (recs.length === 0) continue;

		if (y > maxY - 20) break;
		y = sectionHeader(doc, bucket.label, y);

		for (const rec of recs) {
			if (y > maxY - 8) break;

			const lines: string[] = doc.splitTextToSize(rec.text, w - 32);
			const blockH = lines.length * 4.5 + (rec.regulatoryDeadline ? 8 : 4);

			if (y + blockH > maxY) break;

			panelRect(doc, 12, y - 2, w - 24, blockH + 2);

			doc.setFontSize(8);
			doc.setFont('helvetica', 'bold');
			setTextColor(doc, bucket.color);
			doc.text(`${recNum}.`, 14, y + 2);

			doc.setFont('helvetica', 'normal');
			setTextColor(doc, COLOR_TEXT_SECONDARY);
			doc.text(lines, 22, y + 2);
			y += lines.length * 4.5;

			if (rec.regulatoryDeadline) {
				doc.setFontSize(7);
				setTextColor(doc, RISK_COLORS.critical);
				doc.text(`⚠ Regulatory deadline: ${rec.regulatoryDeadline}`, 22, y + 2);
				y += 5;
			}
			y += 5;
			recNum++;
		}
		y += 2;
	}

	addFooter(doc, 5);
}

function buildSources(doc: PDFDoc) {
	const w = pageWidth(doc);

	setFill(doc, COLOR_BG);
	doc.rect(0, 0, w, pageHeight(doc), 'F');
	setFill(doc, COLOR_HEADER);
	doc.rect(0, 0, w, 4, 'F');
	setFill(doc, COLOR_ACCENT);
	doc.rect(0, 4, 4, pageHeight(doc) - 12, 'F');

	doc.setFontSize(16);
	doc.setFont('helvetica', 'bold');
	setTextColor(doc, COLOR_TEXT_PRIMARY);
	doc.text('Data Sources & Citations', 12, 18);

	let y = 28;

	y = sectionHeader(doc, 'Statistics Cited in This Report', y);

	const sources = [
		{
			stat: '98% of organizations have unapproved AI tools ("shadow AI") in use',
			citation: 'Reco AI. "AI Risk Report 2024." Reco AI / Programs.com, 2024.',
			url: 'programs.com/reco-ai-risk-report-2024'
		},
		{
			stat: '$670,000 — average additional breach cost when shadow AI is involved',
			citation: 'IBM Security. "Cost of a Data Breach Report 2025." IBM Corporation, 2025.',
			url: 'ibm.com/reports/data-breach'
		},
		{
			stat: '47% of employees use personal AI accounts for work tasks',
			citation: 'Vectra AI. "State of AI Cybersecurity 2024." Vectra AI, Inc., 2024.',
			url: 'vectra.ai/resources'
		},
		{
			stat: '12% of organizations can detect all shadow AI usage',
			citation: 'Second Talent. "AI at Work: 2024 Report." Second Talent, 2024.',
			url: 'secondtalent.com/ai-at-work-2024'
		},
		{
			stat: 'Fewer than 40% of organizations have a formal AI governance policy',
			citation: 'Reco AI. "AI Risk Report 2024." Reco AI / Programs.com, 2024.',
			url: 'programs.com/reco-ai-risk-report-2024'
		}
	];

	for (const src of sources) {
		panelRect(doc, 12, y, w - 24, 20);
		setFill(doc, COLOR_ACCENT);
		doc.rect(12, y, 3, 20, 'F');

		doc.setFontSize(8);
		doc.setFont('helvetica', 'bold');
		setTextColor(doc, COLOR_TEXT_PRIMARY);
		const statLines: string[] = doc.splitTextToSize(src.stat, w - 32);
		doc.text(statLines, 18, y + 5);

		doc.setFont('helvetica', 'italic');
		setTextColor(doc, COLOR_TEXT_SECONDARY);
		doc.text(src.citation, 18, y + 5 + statLines.length * 4.5);

		doc.setFont('helvetica', 'normal');
		setTextColor(doc, COLOR_ACCENT);
		doc.text(src.url, 18, y + 5 + statLines.length * 4.5 + 4.5);

		y += 24;
	}

	y += 4;
	y = sectionHeader(doc, 'Regulatory Framework References', y);

	const regRefs = [
		'EU AI Act (Regulation (EU) 2024/1689). Official Journal of the European Union, July 12, 2024. High-risk system requirements effective August 2, 2026.',
		'Colorado SB 24-205 (Colorado AI Act). Colorado General Assembly, signed May 17, 2024. Effective June 30, 2026 (date subject to legislative amendment).',
		'OWASP Foundation. "OWASP Top 10 for Large Language Model Applications, Version 2.0." 2025. owasp.org/www-project-top-10-for-large-language-model-applications',
		'NIST. "Artificial Intelligence Risk Management Framework (AI RMF 1.0)." National Institute of Standards and Technology, January 2023. nist.gov/system/files/documents/2023/01/26/NIST.AI.100-1.pdf'
	];

	doc.setFontSize(8);
	doc.setFont('helvetica', 'normal');
	setTextColor(doc, COLOR_TEXT_SECONDARY);
	for (const ref of regRefs) {
		setFill(doc, COLOR_ACCENT);
		doc.rect(12, y - 2.5, 2, 3, 'F');
		const lines: string[] = doc.splitTextToSize(ref, w - 22);
		doc.text(lines, 17, y);
		y += lines.length * 5 + 2;
	}

	addFooter(doc, 6);
}

function buildMethodology(doc: PDFDoc) {
	const w = pageWidth(doc);

	setFill(doc, COLOR_BG);
	doc.rect(0, 0, w, pageHeight(doc), 'F');
	setFill(doc, COLOR_HEADER);
	doc.rect(0, 0, w, 4, 'F');
	setFill(doc, COLOR_ACCENT);
	doc.rect(0, 4, 4, pageHeight(doc) - 12, 'F');

	doc.setFontSize(16);
	doc.setFont('helvetica', 'bold');
	setTextColor(doc, COLOR_TEXT_PRIMARY);
	doc.text('Methodology', 12, 18);

	let y = 28;

	y = sectionHeader(doc, 'Assessment Framework', y);
	doc.setFontSize(9);
	doc.setFont('helvetica', 'normal');
	setTextColor(doc, COLOR_TEXT_SECONDARY);
	const methodText =
		'This assessment evaluates AI governance readiness across 5 categories using 18 weighted questions. Each question is scored 0–3 (no capability to full capability). Category scores are calculated using weighted averages. Risk levels: Critical (0–25%), High (26–50%), Moderate (51–75%), Low (76–100%).';
	y = wrappedText(doc, methodText, 12, y, w - 24, 5) + 6;

	y = sectionHeader(doc, 'Referenced Frameworks', y);
	doc.setFontSize(9);
	setTextColor(doc, COLOR_TEXT_SECONDARY);
	const refs = [
		'EU AI Act (Regulation (EU) 2024/1689) — High-risk system requirements effective August 2, 2026',
		'Colorado SB 24-205 (AI Act) — Algorithmic decision-making requirements effective June 30, 2026',
		'OWASP LLM Top 10 (2025) — AI security risk framework',
		'NIST AI Risk Management Framework (AI RMF 1.0) — Structured AI risk governance approach'
	];
	for (const ref of refs) {
		setFill(doc, COLOR_ACCENT);
		doc.rect(12, y - 2.5, 2, 3, 'F');
		doc.text(ref, 17, y);
		y += 6;
	}
	y += 4;

	y = sectionHeader(doc, 'Scoring', y);
	doc.setFontSize(9);
	setTextColor(doc, COLOR_TEXT_SECONDARY);

	const scoreRows: [string, string][] = [
		[
			'Critical Risk (0–25%)',
			'Immediate action required; significant regulatory and operational exposure'
		],
		['High Risk (26–50%)', 'Material gaps; prioritized remediation needed within 30–60 days'],
		[
			'Moderate Risk (51–75%)',
			'Partial controls in place; structured improvement plan recommended'
		],
		[
			'Low Risk (76–100%)',
			'Solid foundation; focus on maintenance, monitoring, and continuous improvement'
		]
	];
	for (const [level, desc] of scoreRows) {
		doc.setFont('helvetica', 'bold');
		setTextColor(doc, COLOR_TEXT_PRIMARY);
		doc.text(`${level}:`, 12, y);
		doc.setFont('helvetica', 'normal');
		setTextColor(doc, COLOR_TEXT_SECONDARY);
		const dLines: string[] = doc.splitTextToSize(desc, w - 50);
		doc.text(dLines, 60, y);
		y += Math.max(6, dLines.length * 5);
	}
	y += 4;

	y = sectionHeader(doc, 'Disclaimer', y);
	doc.setFontSize(8);
	setTextColor(doc, COLOR_TEXT_SECONDARY);
	const disclaimer =
		'This assessment is for informational purposes only and does not constitute legal advice. Results reflect self-reported responses and should be validated with qualified legal, compliance, and security professionals. Regulatory requirements vary by jurisdiction, industry, and organizational context.';
	wrappedText(doc, disclaimer, 12, y, w - 24, 5);

	addFooter(doc, 7);
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Generates a 7-page jsPDF report from assessment results and triggers a browser download.
 * Uses dynamic import to avoid SSR issues.
 *
 * @param results - The completed assessment results (include `responses` for question-level detail)
 * @param orgName - Optional organization name to appear on the cover page and headers
 */
export async function generateReport(results: AssessmentResult, orgName?: string): Promise<void> {
	const { jsPDF } = await import('jspdf');
	const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' }) as PDFDoc;

	// Page 1: Cover
	buildCoverPage(doc, results, orgName);

	// Page 2: Executive Summary
	doc.addPage();
	buildExecutiveSummary(doc, results, orgName);

	// Page 3: Category Detail (inventory, policy, risk)
	doc.addPage();
	buildCategoryPage(doc, results, ['inventory', 'policy', 'risk'], 3);

	// Page 4: Category Detail (compliance, oversight)
	doc.addPage();
	buildCategoryPage(doc, results, ['compliance', 'oversight'], 4);

	// Page 5: 90-Day Action Plan
	doc.addPage();
	buildActionPlan(doc, results);

	// Page 6: Data Sources & Citations
	doc.addPage();
	buildSources(doc);

	// Page 7: Methodology
	doc.addPage();
	buildMethodology(doc);

	const orgSlug = orgName ? `_${orgName.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30)}` : '';
	doc.save(`AI_Governance_Assessment${orgSlug}_${new Date().toISOString().split('T')[0]}.pdf`);
}
