<script lang="ts">
	interface Props {
		compliancePercentage: number;
	}

	let { compliancePercentage }: Props = $props();

	const shouldShow = $derived(compliancePercentage < 50);

	const coloradoDeadline = new Date('2026-06-30');
	const euDeadline = new Date('2026-08-02');
	const now = new Date();

	function daysUntil(target: Date): number {
		return Math.max(0, Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
	}

	const coloradoDays = $derived(daysUntil(coloradoDeadline));
	const euDays = $derived(daysUntil(euDeadline));

	function urgencyClass(days: number): string {
		if (days < 60) return 'text-[var(--color-risk-critical)]';
		if (days < 120) return 'text-[var(--color-risk-high)]';
		return 'text-[var(--color-risk-moderate)]';
	}
</script>

{#if shouldShow}
	<div
		class="bg-[var(--color-risk-critical)]/10 border border-[var(--color-risk-critical)]/30 rounded-xl p-6 mb-8"
		role="alert"
		data-testid="regulatory-banner"
	>
		<div class="flex items-start gap-3">
			<span class="text-2xl flex-shrink-0" aria-hidden="true">⚠️</span>
			<div class="flex-1">
				<h2 class="text-base font-bold text-[var(--color-text-primary)] mb-1">
					Regulatory Deadlines Approaching
				</h2>
				<p class="text-sm text-[var(--color-text-secondary)] mb-4">
					Your compliance score indicates significant gaps. The following regulatory deadlines
					require immediate attention.
				</p>
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div class="bg-[var(--color-bg-panel)] rounded-lg p-4" data-testid="deadline-colorado">
						<p class="text-xs text-[var(--color-text-secondary)] uppercase tracking-wide mb-1">
							Colorado AI Act (SB 24-205)
						</p>
						<p class="text-sm font-semibold text-[var(--color-text-primary)]">June 30, 2026</p>
						<p class="text-xl font-bold {urgencyClass(coloradoDays)}" data-testid="colorado-days">
							{coloradoDays} days
						</p>
					</div>
					<div class="bg-[var(--color-bg-panel)] rounded-lg p-4" data-testid="deadline-eu">
						<p class="text-xs text-[var(--color-text-secondary)] uppercase tracking-wide mb-1">
							EU AI Act (High-Risk Systems)
						</p>
						<p class="text-sm font-semibold text-[var(--color-text-primary)]">August 2, 2026</p>
						<p class="text-xl font-bold {urgencyClass(euDays)}" data-testid="eu-days">
							{euDays} days
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
