import { GoogleGenAI } from "@google/genai";
import { EmailStep } from "../types";

// Helper to get provider configuration
function getProviderConfig() {
    const provider = localStorage.getItem('AI_PROVIDER') || 'gemini';
    const localUrl = localStorage.getItem('LOCAL_API_URL') || 'http://localhost:11434/v1';
    return { provider, localUrl };
}

// Local client helper
async function callLocalLLM(prompt: string, jsonMode: boolean = false) {
    const { localUrl } = getProviderConfig();
    const response = await fetch(`${localUrl}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: "default", // Assume some default model is loaded
            messages: [{ role: "user", content: prompt }],
            response_format: jsonMode ? { type: "json_object" } : undefined
        })
    });
    const data = await response.json();
    return data.choices[0].message.content;
}

// Gemini specific helpers
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function callGemini(prompt: string, jsonMode: boolean = false) {
    const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: prompt,
        config: jsonMode ? { responseMimeType: "application/json" } : {}
    });
    return response.text;
}

// Unified AI Caller
async function callAI(prompt: string, jsonMode: boolean = false) {
    const { provider } = getProviderConfig();
    if (provider === 'local') {
        return callLocalLLM(prompt, jsonMode);
    }
    return callGemini(prompt, jsonMode);
}

export async function generateSdrContent(prospectName: string, prospectCompany: string, goal: string) {
  const prompt = `
    You are an expert Sales Development Representative. 
    Write a personalized and compelling sales outreach email.
    Prospect Name: ${prospectName}
    Prospect Company: ${prospectCompany}
    Goal of the email: ${goal}
    The tone should be professional yet conversational and direct.
    `;
  return (await callAI(prompt)) || "Could not generate content.";
}

export async function generateFollowUp(prospectName: string, lastEmailBody: string, context: string): Promise<string> {
    const prompt = `
        You are an expert Sales Development Representative.
        Write a personalized follow-up email to ${prospectName}.
        Last email sent: "${lastEmailBody}"
        Context/Update: ${context}
        Keep it brief, polite, and actionable.
    `;
    return (await callAI(prompt)) || "Could not generate follow-up.";
}

export async function generateCadence(prospectName: string, prospectCompany: string, goal: string, stepsCount: number): Promise<EmailStep[]> {
     const prompt = `
        Create a ${stepsCount}-step email cadence for ${prospectName} at ${prospectCompany}.
        Goal: ${goal}
        Return a JSON array of objects with fields: sendDate, variants: [{id: "v1", subject: "...", body: "..."}, {id: "v2", ...}].
        Format: [ { "sendDate": "...", "variants": [...] } ]
    `;
    const responseText = await callAI(prompt, true);
    const steps = JSON.parse(responseText || "[]");
    return steps.map((s: any, i: number) => ({
        ...s,
        id: i.toString(),
        selectedVariantId: s.variants[0].id,
        status: 'pending'
    }));
}

export async function identifyICP(productDescription: string, usp: string, negativeAttributes: string): Promise<string> {
    const prompt = `
        Product: ${productDescription}
        USP: ${usp}
        Exclude: ${negativeAttributes}
        Identify the ideal customer profile (ICP) for this offering, considering exclusionary criteria.
    `;
    return (await callAI(prompt)) || "Could not identify ICP.";
}

export async function filterProspects(icp: string, negativeAttributes: string, prospects: any[]): Promise<any[]> {
    const prompt = `
        ICP: ${icp}
        Exclude: ${negativeAttributes}
        Prospects: ${JSON.stringify(prospects)}
        Return a JSON array of the IDs of the prospects that match this ICP while respecting exclusions.
        Format: ["id1", "id2"]
    `;
    const responseText = await callAI(prompt, true);
    const ids = JSON.parse(responseText || "[]");
    return prospects.filter(p => ids.includes(p.id));
}

export async function analyzeReply(content: string): Promise<{ 
    category: 'interested' | 'not interested' | 'objection' | 'neutral', 
    sentiment: 'positive' | 'negative' | 'neutral',
    intentScore: number,
    suggestedAction: string, 
    nuancedAction: string 
}> {
    const prompt = `
        Analyze the following email reply from a prospect:
        "${content}"
        
        Categorize into one of: interested, not interested, objection, neutral.
        Analyze sentiment: positive, negative, neutral.
        Calculate intent score (0-10).
        Suggest a short follow-up action.
        Provide a detailed, nuanced follow-up action.
        
        Return JSON Format: { 
            "category": "...", 
            "sentiment": "...", 
            "intentScore": number,
            "suggestedAction": "...",
            "nuancedAction": "..."
        }
    `;
    const responseText = await callAI(prompt, true);
    return JSON.parse(responseText || '{ "category": "neutral", "sentiment": "neutral", "intentScore": 0, "suggestedAction": "Review", "nuancedAction": "Review in detail" }');
}
