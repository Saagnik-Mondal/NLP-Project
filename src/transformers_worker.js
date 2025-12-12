
import { pipeline, env } from "@xenova/transformers";

// Skip local model checks since we are running in browser
env.allowLocalModels = false;
env.useBrowserCache = true;

class PipelineSingleton {
    static sentimentTask = null;
    static emotionTask = null;
    static summaryTask = null;

    static async getSentimentPipeline() {
        if (!this.sentimentTask) {
            this.sentimentTask = await pipeline('sentiment-analysis', 'Xenova/distilbert-base-uncased-finetuned-sst-2-english');
        }
        return this.sentimentTask;
    }

    static async getEmotionPipeline() {
        if (!this.emotionTask) {
            this.emotionTask = await pipeline('text-classification', 'Xenova/emotion-english-distilroberta-base');
        }
        return this.emotionTask;
    }

    static async getSummaryPipeline() {
        if (!this.summaryTask) {
            this.summaryTask = await pipeline('summarization', 'Xenova/distilbart-cnn-6-6');
        }
        return this.summaryTask;
    }
}

self.addEventListener('message', async (event) => {
    const { task, text } = event.data;

    try {
        let result;
        switch (task) {
            case 'sentiment':
                const sentPipe = await PipelineSingleton.getSentimentPipeline();
                const sentRes = await sentPipe(text);
                // Process result
                const top = sentRes[0];
                const isPos = top.label === 'POSITIVE';
                result = [
                    { label: top.label, score: top.score },
                    { label: isPos ? 'NEGATIVE' : 'POSITIVE', score: 1 - top.score }
                ].sort((a, b) => b.score - a.score);
                break;

            case 'emotion':
                const emoPipe = await PipelineSingleton.getEmotionPipeline();
                const emoRes = await emoPipe(text, { top_k: 5 });
                result = emoRes;
                break;

            case 'summary':
                const sumPipe = await PipelineSingleton.getSummaryPipeline();
                const sumRes = await sumPipe(text);
                result = sumRes[0].summary_text;
                break;

            default:
                throw new Error(`Unknown task: ${task}`);
        }

        self.postMessage({ status: 'complete', result });
    } catch (error) {
        self.postMessage({ status: 'error', error: error.message });
    }
});
