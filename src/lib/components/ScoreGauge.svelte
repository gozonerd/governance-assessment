<script lang="ts">
	import type { RiskLevel } from '$lib/types.js';

	interface Props {
		score: number;
		riskLevel: RiskLevel;
	}

	let { score, riskLevel }: Props = $props();

	// Semi-circle SVG arc
	const cx = 100;
	const r = 80;
	const circumference = Math.PI * r; // half circumference for semi-circle

	// Arc goes from 180° (left) to 0° (right) — a top semi-circle
	// stroke-dasharray trick: portion of circumference to fill
	const filled = $derived((score / 100) * circumference);

	const riskColors: Record<RiskLevel, string> = {
		critical: 'var(--color-risk-critical)',
		high: 'var(--color-risk-high)',
		moderate: 'var(--color-risk-moderate)',
		low: 'var(--color-risk-low)'
	};

	const riskLabels: Record<RiskLevel, string> = {
		critical: 'Critical Risk',
		high: 'High Risk',
		moderate: 'Moderate Risk',
		low: 'Low Risk'
	};

	const arcColor = $derived(riskColors[riskLevel]);
	const riskLabel = $derived(riskLabels[riskLevel]);
</script>

<div
	class="flex flex-col items-center"
	data-testid="score-gauge"
	aria-label="Overall score: {score} out of 100, {riskLabel}"
>
	<svg viewBox="0 0 200 115" class="w-56 h-32" aria-hidden="true" role="img">
		<!-- Background track (gray semi-circle) -->
		<path
			d="M 20 100 A 80 80 0 0 1 180 100"
			fill="none"
			stroke="var(--color-bg-card)"
			stroke-width="16"
			stroke-linecap="round"
		/>
		<!-- Colored score arc -->
		<path
			d="M 20 100 A 80 80 0 0 1 180 100"
			fill="none"
			stroke={arcColor}
			stroke-width="16"
			stroke-linecap="round"
			stroke-dasharray="{filled} {circumference}"
			style="transition: stroke-dasharray 0.6s ease-out;"
		/>
		<!-- Score number -->
		<text
			x={cx}
			y="88"
			text-anchor="middle"
			dominant-baseline="middle"
			class="text-3xl font-bold"
			fill="var(--color-text-primary)"
			font-size="32"
			font-weight="700"
		>
			{score}
		</text>
		<!-- /100 label -->
		<text x={cx} y="108" text-anchor="middle" fill="var(--color-text-secondary)" font-size="11">
			/ 100
		</text>
	</svg>

	<p class="mt-1 text-sm font-semibold" style="color: {arcColor};" data-testid="gauge-risk-label">
		{riskLabel}
	</p>
</div>
