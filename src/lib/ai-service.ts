
// --- Helper Types ---
export type SentimentResult = {
    label: string;
    score: number;
};

export type EmotionResult = {
    label: string;
    score: number;
};

// --- Worker Client ---
// Singleton to manage the worker instance
class AIWorkerClient {
    private worker: Worker | null = null;
    private listeners: Map<string, { resolve: (val: any) => void; reject: (err: any) => void }> = new Map();

    private getWorker(): Worker {
        if (!this.worker && typeof window !== "undefined") {
            this.worker = new Worker("/worker.js", { type: "module" });

            this.worker.addEventListener("message", (event) => {
                const { status, result, error, id } = event.data;
                if (this.listeners.has(id)) {
                    const { resolve, reject } = this.listeners.get(id)!;
                    if (status === "complete") {
                        resolve(result);
                    } else {
                        reject(new Error(error));
                    }
                    this.listeners.delete(id);
                }
            });
        }
        if (!this.worker) throw new Error("Worker not initialized (are you on the server?)");
        return this.worker;
    }

    public async processTask(task: string, text: string): Promise<any> {
        const worker = this.getWorker();
        const id = Math.random().toString(36).substring(7);

        return new Promise((resolve, reject) => {
            this.listeners.set(id, { resolve, reject });
            worker.postMessage({ task, text, id });
        });
    }
}

const aiClient = new AIWorkerClient();

// --- AI Functions ---

export async function analyzeSentiment(text: string): Promise<SentimentResult[]> {
    return aiClient.processTask("sentiment", text);
}

export async function detectEmotion(text: string): Promise<EmotionResult[]> {
    return aiClient.processTask("emotion", text);
}

export async function summarizeText(text: string): Promise<string> {
    return aiClient.processTask("summary", text);
}

