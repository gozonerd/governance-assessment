import type { AssessmentQuestion } from '$lib/types.js';

export const questions: AssessmentQuestion[] = [
	// ─── INVENTORY (4 questions) ─────────────────────────────────────────────────

	{
		id: 'q01',
		category: 'inventory',
		weight: 3,
		text: 'How does your organization track AI tools used by employees?',
		helpText:
			'Research shows 98% of organizations have unapproved AI tools in use — often called "shadow AI." Only 12% of organizations can detect all shadow AI usage. Without a complete inventory, governance and risk management are impossible.',
		regulatoryRef: 'EU AI Act Art. 9',
		options: [
			{ score: 0, label: 'We have no tracking in place' },
			{ score: 1, label: 'We track AI tools when employees report them voluntarily' },
			{ score: 2, label: 'We have partial tracking through IT policies or software audits' },
			{ score: 3, label: 'We maintain a comprehensive, continuously updated AI inventory' }
		]
	},
	{
		id: 'q02',
		category: 'inventory',
		weight: 2,
		text: 'Are employees using personal accounts or consumer AI tools for work tasks?',
		helpText:
			'47% of employees use personal AI accounts for work tasks, creating data governance and security risks. When AI interactions happen outside enterprise accounts, your organization loses audit trails, data controls, and IP protection.',
		options: [
			{ score: 0, label: 'We have no policy and no visibility into personal AI use' },
			{ score: 1, label: 'We have a policy but no way to verify compliance' },
			{ score: 2, label: 'We have policies and some enforcement mechanisms in place' },
			{
				score: 3,
				label: 'We have clear policies with active monitoring and verified compliance'
			}
		]
	},
	{
		id: 'q03',
		category: 'inventory',
		weight: 2,
		text: 'How are new AI tools evaluated and approved before use in your organization?',
		helpText:
			'Shadow AI often enters organizations because legitimate evaluation channels are too slow or unclear. A fast, lightweight approval process reduces shadow AI adoption while maintaining governance.',
		regulatoryRef: 'EU AI Act Art. 9; NIST AI RMF – GOVERN 1.1',
		options: [
			{ score: 0, label: 'There is no formal evaluation or approval process' },
			{ score: 1, label: 'Approval happens informally or inconsistently' },
			{ score: 2, label: 'A defined process exists but is not consistently followed' },
			{
				score: 3,
				label: 'All AI tools go through a formal evaluation and approval process before use'
			}
		]
	},
	{
		id: 'q04',
		category: 'inventory',
		weight: 2,
		text: 'Can you identify all data types that your AI systems have access to?',
		helpText:
			'Without knowing what data AI systems can access, you cannot assess regulatory exposure under the EU AI Act or Colorado AI Act, or adequately respond to a data breach. Data access documentation is a prerequisite for risk assessment under both frameworks.',
		regulatoryRef: 'EU AI Act Art. 10',
		options: [
			{ score: 0, label: 'We cannot identify data access for our AI systems' },
			{ score: 1, label: 'We can identify data access for some, but not all, AI systems' },
			{ score: 2, label: 'We have documented data access for most AI systems' },
			{
				score: 3,
				label: 'We have complete, current documentation of data access for all AI systems'
			}
		]
	},

	// ─── POLICY (4 questions) ─────────────────────────────────────────────────────

	{
		id: 'q05',
		category: 'policy',
		weight: 3,
		text: 'Does your organization have a formal AI governance policy?',
		helpText:
			'Only 36% of organizations have a formal AI governance policy. Without documented governance, you cannot demonstrate compliance with the EU AI Act, Colorado AI Act, or other emerging regulations — and you are exposed when incidents occur.',
		regulatoryRef: 'EU AI Act Art. 9; Colorado SB 24-205 §6-1-1703',
		options: [
			{ score: 0, label: 'No AI governance policy exists' },
			{ score: 1, label: 'A policy is in development but not yet finalized' },
			{
				score: 2,
				label: 'A policy exists but is not widely communicated or consistently enforced'
			},
			{
				score: 3,
				label: 'A comprehensive, enforced policy is in place and known to all relevant staff'
			}
		]
	},
	{
		id: 'q06',
		category: 'policy',
		weight: 2,
		text: 'How are AI use cases reviewed and approved before deployment?',
		helpText:
			'The EU AI Act requires conformity assessments before deploying high-risk AI systems. Colorado SB 24-205 requires risk assessments for algorithmic decision-making. Both require documented evidence of pre-deployment review.',
		regulatoryRef: 'EU AI Act Art. 43; Colorado SB 24-205 §6-1-1703(4)',
		options: [
			{ score: 0, label: 'AI use cases are not reviewed before deployment' },
			{ score: 1, label: 'Review happens informally for some use cases' },
			{ score: 2, label: 'A review process exists for new use cases but coverage is incomplete' },
			{
				score: 3,
				label: 'All AI use cases undergo a documented, risk-based review before deployment'
			}
		]
	},
	{
		id: 'q07',
		category: 'policy',
		weight: 2,
		text: 'Are roles and responsibilities for AI oversight clearly defined in your organization?',
		helpText:
			'Both the EU AI Act and Colorado AI Act require organizations to designate responsible parties for AI systems. Without clear ownership, governance gaps go unaddressed and accountability after an incident is unclear.',
		regulatoryRef: 'EU AI Act Art. 16; Colorado SB 24-205 §6-1-1704',
		options: [
			{ score: 0, label: 'No one has explicit responsibility for AI oversight' },
			{ score: 1, label: 'Responsibility exists informally but is not formally assigned' },
			{ score: 2, label: 'Roles are defined for some AI oversight activities' },
			{
				score: 3,
				label:
					'AI oversight responsibilities are fully defined, documented, and owned by named individuals'
			}
		]
	},
	{
		id: 'q08',
		category: 'policy',
		weight: 1,
		text: 'How are AI governance policies communicated to employees?',
		helpText:
			'A policy that no one knows about provides no protection. Employees who discover AI tools without guidance will create their own workarounds, contributing to shadow AI proliferation and data risk.',
		regulatoryRef: 'EU AI Act Art. 16(e); NIST AI RMF – GOVERN 5.1',
		options: [
			{ score: 0, label: 'Policies are not communicated beyond those who drafted them' },
			{ score: 1, label: 'Policies exist but are only accessible if employees seek them out' },
			{
				score: 2,
				label: 'Policies are communicated at onboarding or through general awareness training'
			},
			{
				score: 3,
				label:
					'Policies are actively communicated, reinforced regularly, and employees confirm understanding'
			}
		]
	},

	// ─── RISK (3 questions) ───────────────────────────────────────────────────────

	{
		id: 'q09',
		category: 'risk',
		weight: 3,
		text: 'How does your organization identify and assess risks from AI systems?',
		helpText:
			'The OWASP LLM Top 10 (2025) identifies prompt injection, sensitive information disclosure, and supply chain vulnerabilities as leading AI risks. Identifying these risks requires systematic assessment — reactive approaches miss risks until harm occurs. The NIST AI Risk Management Framework (AI RMF) provides a complementary structured approach for identifying and managing AI-specific risks.',
		regulatoryRef: 'OWASP LLM Top 10 2025; EU AI Act Art. 9; NIST AI RMF – MAP 1.1',
		options: [
			{ score: 0, label: 'We do not formally assess risks from AI systems' },
			{ score: 1, label: 'Risk assessment happens reactively after incidents' },
			{
				score: 2,
				label: 'We conduct risk assessments for some AI systems but coverage is inconsistent'
			},
			{
				score: 3,
				label:
					'We conduct documented risk assessments for all AI systems before deployment and on a regular cadence'
			}
		]
	},
	{
		id: 'q10',
		category: 'risk',
		weight: 2,
		text: 'Are OWASP LLM Top 10 risks addressed in your AI security program?',
		helpText:
			'The OWASP LLM Top 10 (2025) covers prompt injection, insecure output handling, training data poisoning, model denial of service, and supply chain vulnerabilities. These are the most commonly exploited attack surfaces in AI applications.',
		regulatoryRef: 'OWASP LLM Top 10 2025',
		options: [
			{ score: 0, label: 'We are not familiar with or do not address OWASP LLM Top 10 risks' },
			{
				score: 1,
				label: 'We are aware of the OWASP LLM Top 10 but have not systematically addressed them'
			},
			{ score: 2, label: 'We have addressed some OWASP LLM Top 10 risks but not all' },
			{
				score: 3,
				label: 'We have systematically assessed and mitigated all relevant OWASP LLM Top 10 risks'
			}
		]
	},
	{
		id: 'q11',
		category: 'risk',
		weight: 2,
		text: 'What controls exist to prevent AI-related data breaches?',
		helpText:
			'1 in 5 organizations has experienced a data breach directly attributable to shadow AI. When a breach involves AI, the average additional cost is $670,000 beyond a standard breach. AI-specific controls — including output monitoring and prompt injection detection — are now essential.',
		regulatoryRef: 'OWASP LLM Top 10 2025 (LLM02: Sensitive Information Disclosure)',
		options: [
			{ score: 0, label: 'No specific controls exist for AI-related data exposure' },
			{
				score: 1,
				label: 'General data security controls exist but none are AI-specific'
			},
			{
				score: 2,
				label: 'Some AI-specific controls exist (output filtering, access controls)'
			},
			{
				score: 3,
				label:
					'Comprehensive AI-specific controls with monitoring, alerting, and incident response playbooks'
			}
		]
	},

	// ─── COMPLIANCE (4 questions) ─────────────────────────────────────────────────

	{
		id: 'q12',
		category: 'compliance',
		weight: 2,
		text: 'How familiar is your leadership team with EU AI Act requirements?',
		helpText:
			'EU AI Act high-risk system requirements take effect August 2, 2026. Organizations that have not begun compliance work are at risk of missing this deadline. High-risk categories include AI used in employment, education, critical infrastructure, and law enforcement.',
		regulatoryRef: 'EU AI Act Art. 6, Annex III',
		options: [
			{ score: 0, label: 'Little to no awareness of EU AI Act requirements' },
			{
				score: 1,
				label: 'General awareness but limited understanding of specific obligations'
			},
			{
				score: 2,
				label: 'Good understanding of requirements but gap analysis is not yet complete'
			},
			{
				score: 3,
				label:
					'Full understanding of applicable requirements with gap analysis complete and remediation underway'
			}
		]
	},
	{
		id: 'q13',
		category: 'compliance',
		weight: 2,
		text: 'Are you tracking Colorado AI Act (SB 24-205) obligations?',
		helpText:
			'Colorado SB 24-205 takes effect June 30, 2026 — the earliest state AI law in the US. It requires risk assessments and disclosures for algorithmic decision-making in consequential decisions (employment, credit, education, housing). Many organizations do not realize they are covered. Note: The Colorado legislature may amend the June 30, 2026 effective date — monitor for updates.',
		regulatoryRef: 'Colorado SB 24-205 §6-1-1703',
		options: [
			{ score: 0, label: 'Not aware of or not tracking Colorado AI Act obligations' },
			{
				score: 1,
				label: 'Aware of the law but have not assessed its applicability to our organization'
			},
			{
				score: 2,
				label:
					'Have assessed applicability and identified obligations but remediation has not begun'
			},
			{
				score: 3,
				label:
					'Have completed applicability assessment, identified all obligations, and remediation is underway'
			}
		]
	},
	{
		id: 'q14',
		category: 'compliance',
		weight: 1,
		text: 'Do you have a process for monitoring AI regulatory developments and updating your policies?',
		helpText:
			'AI regulation is evolving faster than any previous technology sector. In 2025 alone, more than 45 states introduced AI-related legislation. Reactive compliance is more expensive — and more disruptive — than proactive monitoring.',
		options: [
			{ score: 0, label: 'No process exists for tracking AI regulatory changes' },
			{ score: 1, label: 'Informal tracking by one or two individuals with no documentation' },
			{
				score: 2,
				label:
					'Defined responsibility for regulatory monitoring but policy updates are not systematic'
			},
			{
				score: 3,
				label:
					'Formal regulatory monitoring process with documented policy update triggers and review cadence'
			}
		]
	},
	{
		id: 'q15',
		category: 'compliance',
		weight: 3,
		text: 'How are high-risk AI systems identified and documented in your organization?',
		helpText:
			'EU AI Act Annex III lists categories of high-risk AI systems. If your organization uses AI in hiring, loan decisions, access to education, or public services, you almost certainly have high-risk systems requiring specific documentation, conformity assessments, and registration.',
		regulatoryRef: 'EU AI Act Art. 11, Annex III',
		options: [
			{
				score: 0,
				label: 'We have not assessed which of our AI systems are high-risk under any framework'
			},
			{
				score: 1,
				label: 'Some systems have been informally assessed but no documentation exists'
			},
			{ score: 2, label: 'We have identified high-risk systems but documentation is incomplete' },
			{
				score: 3,
				label:
					'All AI systems have been assessed; high-risk systems have complete required technical documentation'
			}
		]
	},

	// ─── OVERSIGHT (3 questions) ──────────────────────────────────────────────────

	{
		id: 'q16',
		category: 'oversight',
		weight: 3,
		text: 'Is there meaningful human review of consequential AI-assisted decisions?',
		helpText:
			'Both the EU AI Act and Colorado AI Act require human oversight of high-risk AI systems. "Meaningful" oversight means reviewers have access to the AI system\'s reasoning, the ability to override decisions, and protection from retaliation for doing so.',
		regulatoryRef: 'EU AI Act Art. 14; Colorado SB 24-205 §6-1-1703(1)(b)',
		options: [
			{ score: 0, label: 'AI decisions are implemented without human review' },
			{ score: 1, label: 'Human review exists but is cursory or functions as rubber-stamping' },
			{
				score: 2,
				label: 'Human reviewers have authority and sufficient information to override AI decisions'
			},
			{
				score: 3,
				label:
					'Structured review with documented criteria, override capability, and full audit trails'
			}
		]
	},
	{
		id: 'q17',
		category: 'oversight',
		weight: 2,
		text: 'How are AI system errors, failures, and near-misses identified and escalated?',
		helpText:
			'The EU AI Act requires logging and monitoring for high-risk AI systems. Without proactive error detection, you learn about AI failures from affected users or regulators — not from your own monitoring program.',
		regulatoryRef: 'EU AI Act Art. 12, 72, 73',
		options: [
			{ score: 0, label: 'No process exists for identifying or escalating AI errors' },
			{ score: 1, label: 'Errors are identified reactively after significant harm has occurred' },
			{ score: 2, label: 'Some monitoring exists but the escalation path is unclear' },
			{
				score: 3,
				label: 'Proactive monitoring with defined escalation paths and documented incident records'
			}
		]
	},
	{
		id: 'q18',
		category: 'oversight',
		weight: 2,
		text: 'Does your organization have an AI-specific incident response process?',
		helpText:
			'AI incidents differ from traditional IT incidents: the cause may be a model behavior that is hard to reproduce, affected parties may be large groups, and regulatory notification requirements may apply under the EU AI Act, Colorado AI Act, and sector-specific regulations.',
		regulatoryRef: 'EU AI Act Art. 73; Colorado SB 24-205 §6-1-1705',
		options: [
			{ score: 0, label: 'No AI-specific incident response process exists' },
			{
				score: 1,
				label: 'General IT incident response is used but has no AI-specific elements'
			},
			{
				score: 2,
				label: 'AI-specific elements have been added to our general incident response process'
			},
			{
				score: 3,
				label:
					'Dedicated AI incident response process with tested procedures, regulatory notification workflows, and post-incident review'
			}
		]
	}
];
