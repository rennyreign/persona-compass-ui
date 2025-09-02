import { CampaignBlueprint } from "../../types/campaignBlueprint";

// Environment-driven config
const OPENAI_PROXY_URL = import.meta.env.VITE_OPENAI_PROXY_URL as string | undefined; // Recommended: secure server/edge function URL
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY as string | undefined; // Not recommended in browser
const ALLOW_CLIENT_OPENAI = (import.meta.env.VITE_ALLOW_CLIENT_OPENAI as string | undefined) === "true";
const OPENAI_MODEL = (import.meta.env.VITE_OPENAI_MODEL as string | undefined) || "gpt-4o-mini"; // Allow overriding to "gpt-5" if available

export type PersonaInput = any;
export type ProgramContext = any;

export class GPTBlueprintGenerator {
  static isConfigured(): boolean {
    const configured = Boolean(OPENAI_PROXY_URL || (OPENAI_API_KEY && ALLOW_CLIENT_OPENAI));
    if (!configured) {
      console.info("[GPTBlueprint] Not configured: set VITE_OPENAI_PROXY_URL or VITE_OPENAI_API_KEY+VITE_ALLOW_CLIENT_OPENAI=true");
    }
    return configured;
  }

  static async generateBlueprint(persona: PersonaInput, program?: ProgramContext): Promise<CampaignBlueprint | null> {
    if (!this.isConfigured()) return null;

    const prompt = buildPrompt(persona, program);

    // Prefer proxy for security; fallback to direct OpenAI if explicitly allowed
    try {
      if (OPENAI_PROXY_URL) {
        console.info(`[GPTBlueprint] Using proxy: ${OPENAI_PROXY_URL} | model=${OPENAI_MODEL}`);
        const res = await fetch(OPENAI_PROXY_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: OPENAI_MODEL,
            messages: [
              { role: "system", content: SYSTEM_INSTRUCTIONS },
              { role: "user", content: prompt },
            ],
            response_format: { type: "json_object" },
            temperature: 0.7,
          }),
        });

        if (!res.ok) throw new Error(`Proxy error ${res.status}`);
        const data = await res.json();
        return parseBlueprintFromLLM(data);
      }

      if (OPENAI_API_KEY && ALLOW_CLIENT_OPENAI) {
        console.warn(`[GPTBlueprint] Using OpenAI directly from client (dev only). model=${OPENAI_MODEL}`);
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: OPENAI_MODEL,
            messages: [
              { role: "system", content: SYSTEM_INSTRUCTIONS },
              { role: "user", content: prompt },
            ],
            response_format: { type: "json_object" },
            temperature: 0.7,
          }),
        });
        if (!res.ok) throw new Error(`OpenAI error ${res.status}`);
        const data = await res.json();
        return parseBlueprintFromLLM(data);
      }
    } catch (err) {
      console.error("[GPTBlueprint] Generation failed, will fallback:", err);
      return null;
    }

    return null;
  }
}

const SYSTEM_INSTRUCTIONS = `You are an expert campaign strategist creating comprehensive campaign blueprints. Generate detailed, strategic campaign frameworks that include:

1. Strategic campaign overview with reasoning ("Why this campaign, why now")
2. Multiple detailed audience segments (3+ segments with full demographics, characteristics, motivations, challenges)
3. Consumer avatars with full narrative profiles (names, ages, backgrounds, interests, motivations, challenges)
4. Multiple creative angles with specific instructions for creative teams
5. Sequential email campaign structure (4+ emails with detailed value propositions)
6. 4-phase campaign implementation plan
7. Strategic reasoning behind messaging choices

Create campaigns that are strategic, comprehensive, and actionable - not basic templates.

CRITICAL: Return ONLY a valid JSON object. No markdown code fences, no explanatory text, no commentary. Just the raw JSON object starting with { and ending with }.`;

function buildPrompt(persona: PersonaInput, program?: ProgramContext): string {
  return [
    "Generate a comprehensive campaign blueprint JSON following the detailed framework example provided in the RAG context.",
    "",
    "Create a strategic campaign that includes:",
    "- Detailed campaign overview with strategic reasoning (why this campaign, why now, core message reasoning)",
    "- 3+ detailed audience segments with full demographics, characteristics, motivations, challenges", 
    "- Consumer avatars with narrative profiles (names, ages, backgrounds, interests, motivations, challenges)",
    "- Multiple creative angles with specific creative team instructions and examples",
    "- Sequential email campaign structure (4+ emails with detailed value propositions and angle instructions)",
    "- 4-phase campaign implementation plan (launch, segmentation, targeting, optimization)",
    "- Strategic KPIs with specific targets and measurement windows",
    "",
    "Follow this schema strictly:",
    JSON.stringify(LLM_OUTPUT_SCHEMA, null, 2),
    "",
    "Base the campaign on this persona:",
    JSON.stringify(persona, null, 2),
    "",
    "Program Context:",
    JSON.stringify(program || {}, null, 2),
    "",
    "Generate a campaign blueprint that matches the depth and strategic thinking of the Six Sigma example in the RAG context."
  ].join("\n");
}

// Minimal blueprint schema for the LLM and parser. The service will coerce to CampaignBlueprint after.
const LLM_OUTPUT_SCHEMA = {
  id: "string (optional; if omitted, client will assign)",
  name: "string",
  overview: {
    why_now: "string - detailed strategic reasoning for why this campaign should launch now",
    who_and_why: "string - detailed explanation of target audience and strategic rationale",
    core_message: "string - primary campaign message",
    message_rationale: "string - strategic reasoning behind message choice over alternatives",
    desired_outcomes: ["string - specific, measurable campaign objectives"],
  },
  segments: [
    {
      id: "string",
      name: "string - segment name like 'Early-Career Quality Enthusiasts'",
      demographics: "string - detailed age ranges, job titles, education levels",
      characteristics: "string - behavioral traits, digital habits, professional patterns",
      motivations: "string - what drives this segment professionally and personally",
      challenges: "string - specific pain points and obstacles they face",
      avatars: [
        {
          name: "string - realistic first and last name",
          age: "number - specific age",
          role: "string - specific job title",
          background: "string - detailed professional and educational background",
          interests: "string - professional development interests and activities",
          motivations: "string - specific career and personal motivations",
          challenges: "string - detailed challenges and pain points",
        },
      ],
    },
  ],
  creative_angles: {
    ads: [
      { 
        label: "string - creative angle name like 'Career Acceleration'", 
        value_prop: "string - clear value proposition", 
        instructions: "string - detailed instructions for creative teams on tone, messaging, target audience", 
        example: "string - specific example ad copy or headline" 
      },
    ],
    emails: [
      { 
        label: "string - email subject/theme like 'Introduction to Value'", 
        value_prop: "string - email's core value proposition", 
        instructions: "string - detailed content guidance, tone, call-to-action instructions" 
      },
    ],
  },
  phases: [
    {
      phase: "number - 1, 2, 3, or 4",
      name: "string - phase name like 'Campaign Launch with Role-Agnostic Messaging'",
      objective: "string - specific phase objective",
      implementation: "string - detailed implementation strategy and tactics"
    }
  ],
  kpis: [
    {
      name: "string - KPI name",
      target: "number - specific target value",
      window: "string - time window like 'Quarter', 'Month', 'Campaign'"
    }
  ],
  experiments: ["string - detailed experiment descriptions"],
  assets: [
    {
      type: "string - asset type like 'doc', 'template', 'guide'",
      title: "string - asset title",
      description: "string - detailed asset description"
    }
  ]
};

function parseBlueprintFromLLM(raw: any): CampaignBlueprint | null {
  try {
    // Try OpenAI chat.completions style first
    const content = raw?.choices?.[0]?.message?.content;
    let parsed: any;
    
    if (typeof content === "string") {
      // First try direct JSON parse
      try {
        parsed = JSON.parse(content);
      } catch (e) {
        // If that fails, try to extract JSON from markdown or mixed content
        console.warn("[GPTBlueprint] Direct JSON parse failed, attempting extraction from:", content.substring(0, 200) + "...");
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[0]);
          console.info("[GPTBlueprint] Successfully extracted JSON from mixed content");
        } else {
          console.error("[GPTBlueprint] No JSON object found in response content");
          return null;
        }
      }
    } else {
      parsed = raw;
    }

    if (!parsed || !parsed.name || !parsed.overview) {
      console.error("[GPTBlueprint] Parsed object missing required fields:", { hasName: !!parsed?.name, hasOverview: !!parsed?.overview });
      return null;
    }

    const now = new Date().toISOString();

    const blueprint: CampaignBlueprint = {
      id: parsed.id || `camp-${(parsed.name as string).toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
      name: parsed.name,
      program_context: { program_ids: [], notes: "" },
      owners: { strategist: "", technician_lead: "", analyst: "" },
      overview: parsed.overview,
      segments: parsed.segments || [],
      creative_angles: parsed.creative_angles || { ads: [], emails: [] },
      assets: [],
      kpis: parsed.kpis || [],
      experiments: parsed.experiments || [],
      desired_intelligence: [],
      links: { video_walkthrough: "", docs: [] },
      integration_refs: {
        hubspot: { campaign_id: "", program_ids: [], custom_object_ids: [] },
        airtable: { base: "", table: "", record_id: "" },
      },
      governance: {
        version: "1.0.0",
        reviewers: [],
        signoff_dates: { direction: "", build: "", launch: "" },
      },
      rag_metadata: { namespace: "", tags: [] },
      timestamps: { created_at: now, updated_at: now },
    } as CampaignBlueprint;

    console.info(`[GPTBlueprint] Successfully parsed blueprint: id=${blueprint.id}, name="${blueprint.name}", segments=${blueprint.segments.length}, ads=${blueprint.creative_angles.ads.length}`);
    return blueprint;
  } catch (e) {
    console.error("Failed to parse LLM blueprint JSON:", e);
    return null;
  }
}
