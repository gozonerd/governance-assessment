<script lang="ts">
	interface Props {
		variant?: 'primary' | 'secondary' | 'ghost';
		disabled?: boolean;
		onclick?: () => void;
		type?: 'button' | 'submit';
		'data-testid'?: string;
		children?: import('svelte').Snippet;
	}

	let {
		variant = 'primary',
		disabled = false,
		onclick,
		type = 'button',
		'data-testid': testId,
		children
	}: Props = $props();

	const baseClasses =
		'inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-primary)] disabled:opacity-50 disabled:cursor-not-allowed';

	const variantClasses = {
		primary:
			'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)] active:scale-[0.98]',
		secondary:
			'border border-[var(--color-border-default)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-card)] active:scale-[0.98]',
		ghost:
			'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-card)] active:scale-[0.98]'
	};
</script>

<button
	{type}
	{disabled}
	{onclick}
	data-testid={testId}
	class="{baseClasses} {variantClasses[variant]}"
>
	{#if children}
		{@render children()}
	{/if}
</button>
