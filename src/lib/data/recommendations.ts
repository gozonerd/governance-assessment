import type { RecommendationPriority, RiskLevel } from '$lib/types.js';

export interface RecommendationTemplate {
	text: string;
	priority: RecommendationPriority;
	regulatoryDeadline?: string;
}

export const recommendationTemplates: Record<
	string,
	Partial<Record<RiskLevel, RecommendationTemplate[]>>
> = {
	inventory: {
		critical: [
			{
				text: 'Conduct an emergency AI inventory audit using department self-reporting to establish a baseline of AI tool usage within 2 weeks.',
				priority: 'immediate'
			},
			{
				text: 'Implement an AI tool registry requiring all employees to report AI tools currently in use.',
				priority: 'immediate'
			},
			{
				text: 'Issue an interim policy prohibiting use of unapproved AI tools with personal accounts while inventory work is underway.',
				priority: 'immediate'
			}
		],
		high: [
			{
				text: 'Deploy shadow AI detection capabilities to identify unmanaged AI tool usage on corporate networks and endpoints.',
				priority: 'immediate'
			},
			{
				text: 'Establish an AI tool intake process with a defined approval SLA (target: 5 business days) to reduce shadow AI pressure.',
				priority: 'short-term'
			},
			{
				text: 'Document data access scope for all known AI systems to support risk assessment and regulatory compliance.',
				priority: 'short-term'
			}
		],
		moderate: [
			{
				text: 'Establish a quarterly AI inventory refresh cadence to capture newly adopted tools.',
				priority: 'short-term'
			},
			{
				text: 'Integrate AI tool tracking into your existing software asset management process.',
				priority: 'short-term'
			}
		],
		low: [
			{
				text: 'Review and validate your AI inventory annually, with spot checks each quarter.',
				priority: 'medium-term'
			}
		]
	},

	policy: {
		critical: [
			{
				text: 'Draft and publish an AI governance policy within 30 days — even a two-page interim policy provides necessary guardrails while a comprehensive version is developed.',
				priority: 'immediate'
			},
			{
				text: 'Assign explicit AI governance ownership to a named individual or committee immediately.',
				priority: 'immediate'
			},
			{
				text: 'Define and communicate AI use case categories (approved, restricted, prohibited) to halt ungoverned adoption.',
				priority: 'immediate'
			}
		],
		high: [
			{
				text: 'Establish a formal AI use case review process with defined criteria and decision authority.',
				priority: 'immediate'
			},
			{
				text: 'Create an AI governance committee or assign AI responsibilities to an existing risk committee.',
				priority: 'short-term'
			},
			{
				text: 'Conduct mandatory AI governance awareness training for all employees with access to AI tools.',
				priority: 'short-term'
			}
		],
		moderate: [
			{
				text: 'Implement a policy acknowledgment process so you have documented evidence that employees have read and understood AI governance requirements.',
				priority: 'short-term'
			},
			{
				text: 'Establish an annual AI governance policy review cycle with input from legal, security, and business stakeholders.',
				priority: 'medium-term'
			}
		],
		low: [
			{
				text: 'Review AI governance policies annually and update to reflect regulatory changes and organizational AI adoption.',
				priority: 'medium-term'
			}
		]
	},

	risk: {
		critical: [
			{
				text: 'Conduct an immediate OWASP LLM Top 10 risk assessment for all AI systems in production or development.',
				priority: 'immediate'
			},
			{
				text: 'Implement output filtering and access controls for any AI system that handles sensitive, regulated, or confidential data.',
				priority: 'immediate'
			},
			{
				text: 'Establish an AI-specific security incident playbook covering prompt injection, data exfiltration, and model abuse scenarios.',
				priority: 'immediate'
			}
		],
		high: [
			{
				text: 'Train your security team on AI-specific attack vectors including prompt injection (LLM01), insecure output handling (LLM02), and supply chain risks (LLM05).',
				priority: 'immediate'
			},
			{
				text: 'Integrate AI risk assessment into your standard risk management framework and annual risk register.',
				priority: 'short-term'
			},
			{
				text: 'Deploy monitoring for anomalous AI system behavior, including unusual output patterns and potential data exfiltration.',
				priority: 'short-term'
			}
		],
		moderate: [
			{
				text: 'Schedule annual AI risk assessments aligned with your existing risk management cadence.',
				priority: 'short-term'
			},
			{
				text: 'Subscribe to OWASP LLM Top 10 and NIST AI RMF updates to stay current on emerging AI risks.',
				priority: 'medium-term'
			}
		],
		low: [
			{
				text: 'Conduct annual AI risk reviews and update your risk register to reflect new AI capabilities and threat landscape developments.',
				priority: 'medium-term'
			}
		]
	},

	compliance: {
		critical: [
			{
				text: 'Engage legal counsel immediately to assess your exposure under the EU AI Act (deadline: August 2, 2026) and Colorado AI Act (deadline: June 30, 2026).',
				priority: 'immediate',
				regulatoryDeadline: '2026-06-30'
			},
			{
				text: 'Conduct an AI inventory audit specifically to identify systems that may qualify as high-risk under EU AI Act Annex III.',
				priority: 'immediate',
				regulatoryDeadline: '2026-08-02'
			},
			{
				text: 'Assign a regulatory compliance owner for AI and schedule a gap analysis against applicable requirements.',
				priority: 'immediate'
			}
		],
		high: [
			{
				text: 'Begin gap analysis against EU AI Act requirements for all identified high-risk AI systems.',
				priority: 'immediate',
				regulatoryDeadline: '2026-08-02'
			},
			{
				text: 'Assess applicability of Colorado SB 24-205 to your AI-assisted decision-making processes in employment, credit, education, or housing.',
				priority: 'immediate',
				regulatoryDeadline: '2026-06-30'
			},
			{
				text: 'Establish a regulatory monitoring process to track AI law developments across applicable jurisdictions.',
				priority: 'short-term'
			}
		],
		moderate: [
			{
				text: 'Complete technical documentation for high-risk AI systems as required by EU AI Act Art. 11.',
				priority: 'short-term',
				regulatoryDeadline: '2026-08-02'
			},
			{
				text: 'Formalize your AI compliance monitoring cadence with quarterly regulatory landscape reviews.',
				priority: 'short-term'
			}
		],
		low: [
			{
				text: 'Maintain current compliance documentation and conduct annual reviews to capture regulatory changes.',
				priority: 'medium-term'
			}
		]
	},

	oversight: {
		critical: [
			{
				text: 'Establish immediate human review checkpoints for all consequential AI-assisted decisions (hiring, credit, benefits, access to services).',
				priority: 'immediate'
			},
			{
				text: 'Create an AI incident escalation procedure and communicate it to all staff interacting with AI systems within 2 weeks.',
				priority: 'immediate'
			},
			{
				text: 'Implement basic logging for all AI system inputs and outputs to support post-incident review.',
				priority: 'immediate'
			}
		],
		high: [
			{
				text: 'Define meaningful human oversight criteria: what information must reviewers have, what authority do they hold, and how are overrides recorded.',
				priority: 'immediate'
			},
			{
				text: 'Develop an AI-specific incident response playbook covering regulatory notification requirements under EU AI Act Art. 73.',
				priority: 'short-term'
			},
			{
				text: 'Implement monitoring and alerting for AI system outputs that fall outside defined confidence thresholds or exhibit anomalous patterns.',
				priority: 'short-term'
			}
		],
		moderate: [
			{
				text: 'Test your AI incident response process with a tabletop exercise to validate escalation paths and notification timelines.',
				priority: 'short-term'
			},
			{
				text: 'Enhance reviewer training to ensure human oversight is meaningful — not performative.',
				priority: 'short-term'
			}
		],
		low: [
			{
				text: 'Conduct annual reviews of your human oversight processes to ensure they remain appropriate as AI capabilities and usage evolve.',
				priority: 'medium-term'
			}
		]
	}
};
