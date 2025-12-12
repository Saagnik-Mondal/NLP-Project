
import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2';

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
    // Check if we have data (some browsers use event.data directly, others nest it)
    const { task, text, id } = event.data;

    try {
        let result;
        switch (task) {
            case 'sentiment':
                const sentPipe = await PipelineSingleton.getSentimentPipeline();
                // returns [{'label': 'POSITIVE', 'score': 0.99...}]
                let sentRes = await sentPipe(text);
                
                // Process result to match desired format: [{label, score}, {label, score}]
                // The model usually returns one top label. We manually construct the other.
                if (!Array.isArray(sentRes)) sentRes = [sentRes];
                
                const top = sentRes[0];
                const isPos = top.label === 'POSITIVE';
                result = [
                    { label: top.label, score: top.score },
                    { label: isPos ? 'NEGATIVE' : 'POSITIVE', score: 1 - top.score }
                ].sort((a, b) => b.score - a.score);
                break;

            case 'emotion':
                const emoPipe = await PipelineSingleton.getEmotionPipeline();
                // top_k: 5
                const emoRes = await emoPipe(text, { top_k: 5 });
                result = emoRes;
                break;

            case 'summary':
                const sumPipe = await PipelineSingleton.getSummaryPipeline();
                const sumRes = await sumPipe(text);
                // returns [{'summary_text': '...'}]
                result = sumRes[0].summary_text;
                break;

            default:
                throw new Error(`Unknown task: ${task}`);
        }

        self.postMessage({ status: 'complete', result, id });
    } catch (error) {
        self.postMessage({ status: 'error', error: error.message, id });
    }
});
