<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<a
	href="#main-content"
	class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--color-accent)] focus:text-white focus:rounded-md focus:font-semibold"
>
	Skip to main content
</a>

<div class="min-h-screen flex flex-col bg-[var(--color-bg-primary)]">
	<header class="border-b border-[var(--color-border-muted)] px-6 py-4">
		<nav class="max-w-5xl mx-auto flex items-center justify-between">
			<a
				href="/"
				class="text-lg font-bold text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded"
				data-testid="nav-home"
			>
				AI Governance Readiness
			</a>
		</nav>
	</header>

	<main id="main-content" class="flex-1 px-6 py-8" data-testid="main-content">
		<div class="max-w-5xl mx-auto">
			{@render children()}
		</div>
	</main>

	<footer class="border-t border-[var(--color-border-muted)] px-6 py-4">
		<p class="text-center text-xs text-[var(--color-text-muted)]">
			Built by Krystal Martinez |
			<a
				href="https://governance.krystalmartinez.com"
				class="hover:text-[var(--color-text-secondary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded"
			>
				governance.krystalmartinez.com
			</a>
		</p>
	</footer>
</div>
