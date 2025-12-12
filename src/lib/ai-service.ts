
// --- Helper Types ---
export type SentimentResult = {
    label: string;
    score: number;
};

export type EmotionResult = {
    label: string;
    score: number;
};



// --- API Configuration ---
const API_URL = "http://localhost:8000";

// --- AI Functions ---

export async function analyzeSentiment(text: string): Promise<SentimentResult[]> {
    const res = await fetch(`${API_URL}/analyze/sentiment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
    });
    if (!res.ok) throw new Error("Failed to analyze sentiment");
    return res.json();
}

export async function detectEmotion(text: string): Promise<EmotionResult[]> {
    const res = await fetch(`${API_URL}/analyze/emotion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
    });
    if (!res.ok) throw new Error("Failed to detect emotion");
    return res.json();
}

export async function summarizeText(text: string): Promise<string> {
    const res = await fetch(`${API_URL}/analyze/summary`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
    });
    if (!res.ok) throw new Error("Failed to summarize text");
    const data = await res.json();
    return data.summary_text;
}
