import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.NEXT_PUBLIC_HF_TOKEN);

export type SentimentResult = {
    label: string;
    score: number;
};

export type SummaryResult = {
    summary_text: string;
};

export async function analyzeSentiment(text: string): Promise<SentimentResult[]> {
    try {
        const result = await hf.textClassification({
            model: "distilbert-base-uncased-finetuned-sst-2-english",
            inputs: text,
        });
        return result;
    } catch (error) {
        console.error("Sentiment Analysis Error:", error);
        // Return mock data for development
        return [
            { label: "POSITIVE", score: 0.95 },
            { label: "NEGATIVE", score: 0.05 }
        ].sort((a, b) => b.score - a.score);
    }
}

export async function summarizeText(text: string): Promise<string> {
    try {
        const result = await hf.summarization({
            model: "facebook/bart-large-cnn",
            inputs: text,
            parameters: {
                max_length: 100,
            }
        });
        return result.summary_text;
    } catch (error) {
        console.error("Summarization Error:", error);
        return "Error generating summary. Please try again or check API limits.";
    }
}
