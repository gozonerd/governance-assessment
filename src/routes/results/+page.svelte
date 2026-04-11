<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { assessment } from '$lib/stores/assessment.svelte.js';
	import { categories } from '$lib/data/categories.js';
	import { generateReport } from '$lib/pdf/report.js';
	import ScoreGauge from '$lib/components/ScoreGauge.svelte';
	import RegulatoryBanner from '$lib/components/RegulatoryBanner.svelte';
	import CategoryCard from '$lib/components/CategoryCard.svelte';
	import RiskStrip from '$lib/components/RiskStrip.svelte';
	import RecommendationList from '$lib/components/RecommendationList.svelte';
	import Button from '$lib/components/Button.svelte';

	// Guard: if no results, redirect to landing
	$effect(() => {
		if (!assessment.results) {
			goto('/');
		}
	});

	const results = $derived(assessment.results);

	function getCategoryData(categoryId: string) {
		return categories.find((c) => c.id === categoryId) ?? categories[0];
	}

	function getTopRecommendation(categoryId: string) {
		return results?.recommendations.find((r) => r.category === categoryId) ?? null;
	}

	function getComplianceScore(): number {
		return results?.categoryScores.find((cs) => cs.categoryId === 'compliance')?.percentage ?? 100;
	}

	let isGeneratingPdf = $state(false);
	let orgName = $state('');
	let pdfDownloaded = $state(false);

	async function handleDownload() {
		if (!results) return;
		isGeneratingPdf = true;
		try {
			await generateReport(results, orgName.trim() || undefined);
			pdfDownloaded = true;
		} finally {
			isGeneratingPdf = false;
		}
	}

	function handleRetake() {
		assessment.reset();
		goto('/');
	}

	// Warn before unload until PDF is downloaded
	onMount(() => {
		function handleBeforeUnload(e: BeforeUnloadEvent) {
			if (!pdfDownloaded) {
				e.preventDefault();
				e.returnValue = '';
			}
		}
		window.addEventListener('beforeunload', handleBeforeUnload);
		return () => window.removeEventListener('beforeunload', handleBeforeUnload);
	});

	// ─── Radar chart ────────────────────────────────────────────────────────────

	// Category order for radar (pentagon layout)
	const RADAR_CATEGORIES = ['inventory', 'policy', 'risk', 'compliance', 'oversight'];
	const RADAR_LABELS: Record<string, string> = {
		inventory: 'AI Inventory',
		policy: 'Policy',
		risk: 'Risk Mgmt',
		compliance: 'Compliance',
		oversight: 'Oversight'
	};
	const CX = 150;
	const CY = 150;
	const MAX_R = 95;

	function angleForIndex(i: number): number {
		return -Math.PI / 2 + (i * 2 * Math.PI) / 5;
	}

	function polygonPoints(radius: number): string {
		return RADAR_CATEGORIES.map((_, i) => {
			const a = angleForIndex(i);
			return `${CX + radius * Math.cos(a)},${CY + radius * Math.sin(a)}`;
		}).join(' ');
	}

	const radarData = $derived.by(() => {
		if (!results) return null;
		return RADAR_CATEGORIES.map((catId, i) => {
			const score = results.categoryScores.find((cs) => cs.categoryId === catId)?.percentage ?? 0;
			const riskLevel = results.categoryScores.find((cs) => cs.categoryId === catId)?.riskLevel ?? 'low';
			const a = angleForIndex(i);
			const r = (score / 100) * MAX_R;
			return {
				catId,
				score,
				riskLevel,
				px: CX + r * Math.cos(a),
				py: CY + r * Math.sin(a),
				// Label position — slightly outside the outer ring
				lx: CX + (MAX_R + 18) * Math.cos(a),
				ly: CY + (MAX_R + 18) * Math.sin(a)
			};
		});
	});

	const radarPolygon = $derived.by(() => {
		if (!radarData) return '';
		return radarData.map((p) => `${p.px},${p.py}`).join(' ');
	});

	const RISK_STROKE: Record<string, string> = {
		critical: '#ef4444',
		high: '#f97316',
		moderate: '#eab308',
		low: '#22c55e'
	};
</script>

<svelte:head>
	<title>Your Results — AI Governance Readiness Assessment</title>
</svelte:head>

{#if results}
	<div class="max-w-4xl mx-auto py-8" data-testid="results-page">
		<!-- Data loss notice -->
		<div
			class="mb-6 flex items-start gap-2 rounded-lg border border-[var(--color-risk-high)]/30 bg-[var(--color-bg-panel)] px-4 py-3 text-xs text-[var(--color-text-secondary)]"
			role="alert"
			aria-label="Data loss warning"
		>
			<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="mt-0.5 shrink-0 text-[var(--color-risk-high)]" aria-hidden="true">
				<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
				<line x1="12" y1="9" x2="12" y2="13"/>
				<line x1="12" y1="17" x2="12.01" y2="17"/>
			</svg>
			<span><strong class="text-[var(--color-text-primary)]">Your results exist only in this browser session.</strong> Closing or refreshing this tab will permanently discard your responses. Download the PDF report below to keep your results.</span>
		</div>

		<!-- Overall Score -->
		<div class="text-center mb-10">
			<h1 class="text-3xl font-bold text-[var(--color-text-primary)] mb-6">
				Your AI Governance Readiness Score
			</h1>
			<ScoreGauge score={results.overallScore} riskLevel={results.overallRiskLevel} />
			<p class="mt-4 text-sm text-[var(--color-text-secondary)]">
				Assessment completed {results.completedAt.toLocaleDateString('en-US', {
					month: 'long',
					day: 'numeric',
					year: 'numeric'
				})}
			</p>
		</div>

		<!-- Regulatory Banner (conditional — only if compliance < 50%) -->
		<RegulatoryBanner compliancePercentage={getComplianceScore()} />

		<!-- Category Cards (responsive grid) -->
		<section class="mb-10" data-testid="category-grid" aria-labelledby="category-heading">
			<h2 id="category-heading" class="text-xl font-semibold text-[var(--color-text-primary)] mb-5">
				Results by Category
			</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
				{#each results.categoryScores as cs (cs.categoryId)}
					<CategoryCard
						categoryScore={cs}
						category={getCategoryData(cs.categoryId)}
						topRecommendation={getTopRecommendation(cs.categoryId)}
					/>
				{/each}
			</div>
		</section>

		<!-- Radar Chart -->
		<section class="mb-10" aria-labelledby="radar-heading">
			<h2 id="radar-heading" class="text-xl font-semibold text-[var(--color-text-primary)] mb-5">
				Score by Category
			</h2>
			<div class="bg-[var(--color-bg-panel)] border border-[var(--color-border-muted)] rounded-xl p-6 flex flex-col items-center gap-6">
				{#if radarData}
					<svg
						viewBox="0 0 300 300"
						width="280"
						height="280"
						role="img"
						aria-labelledby="radar-title radar-desc"
					>
						<title id="radar-title">AI Governance Category Score Radar Chart</title>
						<desc id="radar-desc">
							Pentagon radar chart comparing scores across 5 governance categories:
							{#each radarData as d}
								{RADAR_LABELS[d.catId]}: {d.score}%.
							{/each}
						</desc>

						<!-- Grid rings at 25, 50, 75, 100 -->
						{#each [25, 50, 75, 100] as ring}
							<polygon
								points={polygonPoints((ring / 100) * MAX_R)}
								fill="none"
								stroke="var(--color-border-default)"
								stroke-width={ring === 100 ? '1.5' : '0.75'}
								stroke-dasharray={ring < 100 ? '3 3' : undefined}
							/>
							{#if ring < 100}
								<text
									x={CX + 3}
									y={CY - (ring / 100) * MAX_R - 2}
									font-size="7"
									fill="var(--color-text-muted)"
									text-anchor="start"
								>{ring}%</text>
							{/if}
						{/each}

						<!-- Axis lines from center to vertices -->
						{#each RADAR_CATEGORIES as _, i}
							{@const a = angleForIndex(i)}
							<line
								x1={CX}
								y1={CY}
								x2={CX + MAX_R * Math.cos(a)}
								y2={CY + MAX_R * Math.sin(a)}
								stroke="var(--color-border-default)"
								stroke-width="0.75"
							/>
						{/each}

						<!-- Score polygon -->
						<polygon
							points={radarPolygon}
							fill="rgba(13,148,136,0.18)"
							stroke="var(--color-accent)"
							stroke-width="2"
							stroke-linejoin="round"
						/>

						<!-- Score dots -->
						{#each radarData as d}
							<circle
								cx={d.px}
								cy={d.py}
								r="4"
								fill={RISK_STROKE[d.riskLevel] ?? 'var(--color-accent)'}
								stroke="var(--color-bg-panel)"
								stroke-width="1.5"
							/>
						{/each}

						<!-- Category labels -->
						{#each radarData as d, i}
							{@const a = angleForIndex(i)}
							<text
								x={d.lx}
								y={d.ly + (Math.sin(a) > 0.1 ? 4 : Math.sin(a) < -0.1 ? -4 : 0)}
								font-size="9"
								font-weight="600"
								fill="var(--color-text-secondary)"
								text-anchor={Math.cos(a) > 0.1 ? 'start' : Math.cos(a) < -0.1 ? 'end' : 'middle'}
								dominant-baseline="middle"
							>{RADAR_LABELS[d.catId]}</text>
						{/each}
					</svg>

					<!-- Text alternative (screen readers) -->
					<table class="sr-only" aria-label="Category scores data table">
						<thead>
							<tr><th>Category</th><th>Score</th><th>Risk Level</th></tr>
						</thead>
						<tbody>
							{#each radarData as d}
								<tr>
									<td>{RADAR_LABELS[d.catId]}</td>
									<td>{d.score}%</td>
									<td>{d.riskLevel}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				{/if}
			</div>
		</section>

		<!-- Risk Strip -->
		<section class="mb-10" data-testid="risk-strip-section" aria-labelledby="risk-heading">
			<h2 id="risk-heading" class="text-xl font-semibold text-[var(--color-text-primary)] mb-5">
				Risk Overview
			</h2>
			<RiskStrip categoryScores={results.categoryScores} />
		</section>

		<!-- Recommendations -->
		{#if results.recommendations.length > 0}
			<section class="mb-10" data-testid="recommendations-section" aria-labelledby="rec-heading">
				<h2 id="rec-heading" class="text-xl font-semibold text-[var(--color-text-primary)] mb-5">
					90-Day Action Plan
				</h2>
				<RecommendationList recommendations={results.recommendations} />
			</section>
		{/if}

		<!-- PDF Options + Action Bar -->
		<div
			class="border-t border-[var(--color-border-muted)] pt-8"
			data-testid="results-actions"
		>
			<!-- Optional org name -->
			<div class="mb-5 max-w-sm">
				<label
					for="org-name"
					class="block text-sm font-medium text-[var(--color-text-secondary)] mb-1"
				>
					Organization name <span class="text-[var(--color-text-muted)] font-normal">(optional — appears on PDF cover)</span>
				</label>
				<input
					id="org-name"
					type="text"
					bind:value={orgName}
					placeholder="e.g. Acme Corp"
					maxlength="80"
					class="w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-bg-panel)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
				/>
			</div>

			<div class="flex flex-col sm:flex-row gap-4">
				<Button
					variant="primary"
					onclick={handleDownload}
					disabled={isGeneratingPdf}
					data-testid="btn-download-pdf"
				>
					{isGeneratingPdf ? 'Generating...' : 'Download PDF Report'}
				</Button>
				<Button variant="secondary" onclick={handleRetake} data-testid="btn-retake">
					Retake Assessment
				</Button>
			</div>
		</div>
	</div>
{/if}
