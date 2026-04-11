<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';

	let { children } = $props();

	let isDark = $state(true);

	onMount(() => {
		const stored = localStorage.getItem('theme');
		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		const useDark = stored ? stored === 'dark' : prefersDark !== false;
		isDark = useDark;
		if (!useDark) {
			document.documentElement.classList.add('light');
		} else {
			document.documentElement.classList.remove('light');
		}
	});

	function toggleTheme() {
		isDark = !isDark;
		if (isDark) {
			document.documentElement.classList.remove('light');
			localStorage.setItem('theme', 'dark');
		} else {
			document.documentElement.classList.add('light');
			localStorage.setItem('theme', 'light');
		}
	}
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

			<button
				onclick={toggleTheme}
				aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
				class="p-2 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-panel)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
				data-testid="theme-toggle"
			>
				{#if isDark}
					<!-- Sun icon for dark mode (click to go light) -->
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<circle cx="12" cy="12" r="5"/>
						<line x1="12" y1="1" x2="12" y2="3"/>
						<line x1="12" y1="21" x2="12" y2="23"/>
						<line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
						<line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
						<line x1="1" y1="12" x2="3" y2="12"/>
						<line x1="21" y1="12" x2="23" y2="12"/>
						<line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
						<line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
					</svg>
				{:else}
					<!-- Moon icon for light mode (click to go dark) -->
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
					</svg>
				{/if}
			</button>
		</nav>
	</header>

	<main id="main-content" class="flex-1 px-6 py-8" data-testid="main-content">
		<div class="max-w-5xl mx-auto">
			{@render children()}
		</div>
	</main>

	<footer class="border-t border-[var(--color-border-muted)] px-6 py-4">
		<div class="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
			<p class="text-xs text-[var(--color-text-secondary)]">
				Built by Krystal Martinez |
				<a
					href="https://governance.krystalmartinez.com"
					class="hover:text-[var(--color-text-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded"
				>
					governance.krystalmartinez.com
				</a>
			</p>
			<nav class="flex gap-4 text-xs text-[var(--color-text-secondary)]" aria-label="Footer navigation">
				<a
					href="/about"
					class="hover:text-[var(--color-text-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded"
					data-testid="footer-about"
				>
					About
				</a>
				<a
					href="/privacy"
					class="hover:text-[var(--color-text-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded"
					data-testid="footer-privacy"
				>
					Privacy Policy
				</a>
				<a
					href="/terms"
					class="hover:text-[var(--color-text-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded"
					data-testid="footer-terms"
				>
					Terms of Use
				</a>
			</nav>
		</div>
	</footer>
</div>
