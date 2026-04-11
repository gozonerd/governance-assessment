<svelte:head>
	<title>About — AI Governance Readiness Assessment</title>
	<meta
		name="description"
		content="About the AI Governance Readiness Assessment tool — methodology, governance frameworks, and the builder behind it."
	/>
</svelte:head>

<div class="max-w-3xl mx-auto py-8" data-testid="about-page">
	<h1 class="text-3xl font-bold text-[var(--color-text-primary)] mb-2">About This Tool</h1>
	<p class="text-sm text-[var(--color-text-muted)] mb-8">AI Governance Readiness Assessment</p>

	<div class="space-y-10 text-sm text-[var(--color-text-secondary)] leading-relaxed">

		<!-- Who built it -->
		<section>
			<h2 class="text-lg font-semibold text-[var(--color-text-primary)] mb-3">Who Built This</h2>
			<p>
				This tool was designed and built by <strong class="text-[var(--color-text-primary)]">Krystal Martinez</strong>, an AI governance and data systems professional based in the United States. Krystal works at the intersection of AI adoption, compliance risk, and organizational readiness — helping organizations understand their exposure and build practical governance programs.
			</p>
			<p class="mt-3">
				This assessment was created to fill a gap: most governance checklists are either vendor-gated, require consultants, or produce generic output. This tool is free, takes about five minutes, and gives you a scored, actionable result grounded in real regulatory requirements.
			</p>
			<p class="mt-3">
				<a
					href="https://krystalmartinez.com"
					target="_blank"
					rel="noopener noreferrer"
					class="text-[var(--color-accent)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded"
				>
					→ Krystal's portfolio and professional work
				</a>
			</p>
		</section>

		<!-- Methodology -->
		<section>
			<h2 class="text-lg font-semibold text-[var(--color-text-primary)] mb-3">Methodology</h2>
			<p>
				The assessment evaluates AI governance readiness across <strong class="text-[var(--color-text-primary)]">5 categories</strong> using <strong class="text-[var(--color-text-primary)]">18 weighted questions</strong>:
			</p>
			<ul class="mt-3 space-y-2 pl-4 list-disc">
				<li><strong class="text-[var(--color-text-primary)]">AI Inventory</strong> — Can your organization see all the AI tools in use, including unsanctioned ones?</li>
				<li><strong class="text-[var(--color-text-primary)]">Policy</strong> — Do you have documented governance that covers approval, roles, and communication?</li>
				<li><strong class="text-[var(--color-text-primary)]">Risk Management</strong> — Are AI-specific risks formally assessed and controlled?</li>
				<li><strong class="text-[var(--color-text-primary)]">Compliance</strong> — Are you tracking and addressing applicable regulatory requirements?</li>
				<li><strong class="text-[var(--color-text-primary)]">Human Oversight</strong> — Are consequential AI decisions subject to meaningful human review?</li>
			</ul>
			<p class="mt-4">
				Each question is scored 0–3 (no capability → partial → substantial → full capability), weighted by governance importance, and aggregated into a category score (0–100%). The overall score is the average of all category scores. Risk levels:
			</p>
			<ul class="mt-2 space-y-1 pl-4 list-disc">
				<li><span class="text-[var(--color-risk-critical)] font-semibold">Critical (0–25%)</span> — Immediate action required</li>
				<li><span class="text-[var(--color-risk-high)] font-semibold">High (26–50%)</span> — Material gaps; prioritized remediation needed</li>
				<li><span class="text-[var(--color-risk-moderate)] font-semibold">Moderate (51–75%)</span> — Partial controls in place; improvement plan recommended</li>
				<li><span class="text-[var(--color-risk-low)] font-semibold">Low (76–100%)</span> — Solid foundation; focus on maintenance and continuous improvement</li>
			</ul>
		</section>

		<!-- Governance frameworks -->
		<section>
			<h2 class="text-lg font-semibold text-[var(--color-text-primary)] mb-3">
				Governance Frameworks Referenced
			</h2>
			<div class="space-y-4">
				<div class="bg-[var(--color-bg-panel)] border border-[var(--color-border-muted)] rounded-lg p-4">
					<h3 class="font-semibold text-[var(--color-text-primary)] mb-1">EU AI Act (Regulation (EU) 2024/1689)</h3>
					<p>The European Union's comprehensive AI regulation. High-risk system requirements take effect <strong class="text-[var(--color-text-primary)]">August 2, 2026</strong>. Covers conformity assessments, technical documentation, human oversight, transparency, and post-market monitoring for AI systems in high-risk categories.</p>
				</div>
				<div class="bg-[var(--color-bg-panel)] border border-[var(--color-border-muted)] rounded-lg p-4">
					<h3 class="font-semibold text-[var(--color-text-primary)] mb-1">Colorado AI Act (SB 24-205)</h3>
					<p>The first US state AI law, effective <strong class="text-[var(--color-text-primary)]">June 30, 2026</strong> (subject to legislative amendment). Requires risk assessments, disclosure obligations, and appeal mechanisms for algorithmic decision-making in consequential decisions (employment, credit, education, housing).</p>
				</div>
				<div class="bg-[var(--color-bg-panel)] border border-[var(--color-border-muted)] rounded-lg p-4">
					<h3 class="font-semibold text-[var(--color-text-primary)] mb-1">NIST AI Risk Management Framework (AI RMF 1.0)</h3>
					<p>Published by the National Institute of Standards and Technology in January 2023. Provides a voluntary, flexible framework for organizations to manage AI risks across the GOVERN, MAP, MEASURE, and MANAGE functions. Used in this assessment as a structural reference for governance maturity.</p>
				</div>
				<div class="bg-[var(--color-bg-panel)] border border-[var(--color-border-muted)] rounded-lg p-4">
					<h3 class="font-semibold text-[var(--color-text-primary)] mb-1">OWASP LLM Top 10 (2025)</h3>
					<p>The Open Worldwide Application Security Project's top 10 security risks for large language model applications. Covers prompt injection, sensitive information disclosure, training data poisoning, model denial of service, and supply chain vulnerabilities — the most commonly exploited attack surfaces in production AI systems.</p>
				</div>
			</div>
		</section>

		<!-- Privacy -->
		<section>
			<h2 class="text-lg font-semibold text-[var(--color-text-primary)] mb-3">Privacy by Design</h2>
			<p>
				This tool is 100% client-side. Your assessment responses, scores, and PDF report are processed entirely within your browser. Nothing is transmitted to any server. No account is required. No cookies are set by this application.
			</p>
			<p class="mt-2">
				<a
					href="/privacy"
					class="text-[var(--color-accent)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded"
				>
					→ Read the full Privacy Policy
				</a>
			</p>
		</section>

		<!-- Limitations -->
		<section>
			<h2 class="text-lg font-semibold text-[var(--color-text-primary)] mb-3">Limitations & Disclaimer</h2>
			<p>
				This assessment is a self-reported diagnostic tool, not a formal audit or legal compliance determination. Results reflect your answers as provided. The tool cannot verify claims, audit systems, or account for jurisdiction-specific variations in regulatory interpretation.
			</p>
			<p class="mt-2">
				This tool does not constitute legal advice. Organizations facing significant AI regulatory exposure should engage qualified legal counsel and compliance professionals.
			</p>
		</section>

	</div>
</div>
