from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import pipeline
from typing import List
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Data Models ---
class TextRequest(BaseModel):
    text: str

class SentimentResult(BaseModel):
    label: str
    score: float

class EmotionResult(BaseModel):
    label: str
    score: float

class SummaryResponse(BaseModel):
    summary_text: str



# --- Global Pipelines ---
# We load them at startup to avoid re-loading on every request
sentiment_pipe = None
emotion_pipe = None
summary_pipe = None

@app.on_event("startup")
async def startup_event():
    # Use loop.run_in_executor to avoid blocking the main event loop with heavy CPU/IO
    import asyncio
    loop = asyncio.get_event_loop()
    loop.run_in_executor(None, load_models_sync)

def load_models_sync():
    """Blocking synchronous function to load models"""
    global sentiment_pipe, emotion_pipe, summary_pipe
    print("Background: Loading models (Thread)...")
    
    # Sentiment
    try:
        sentiment_pipe = pipeline("sentiment-analysis", model="cardiffnlp/twitter-roberta-base-sentiment-latest")
        print("Sentiment model loaded.")
    except Exception as e:
        print(f"Failed to load sentiment model: {e}")

    # Emotion
    try:
        emotion_pipe = pipeline("text-classification", model="SamLowe/roberta-base-go_emotions", top_k=5)
        print("Emotion model loaded.")
    except Exception as e:
        print(f"Failed to load emotion model: {e}")

    # Summarization
    try:
        summary_pipe = pipeline("summarization", model="sshleifer/distilbart-cnn-12-6")
        print("Summary model loaded.")
    except Exception as e:
        print(f"Failed to load summary model: {e}")


@app.get("/")
def read_root():
    return {"status": "ok", "message": "Antigravity AI Backend Running"}

@app.post("/analyze/sentiment", response_model=List[SentimentResult])
async def analyze_sentiment(request: TextRequest):
    if not sentiment_pipe:
        raise HTTPException(status_code=503, detail="Sentiment model not loaded")
    
    # The model returns labels like 'negative', 'neutral', 'positive' (lowercase? or Label_0?)
    # cardiffnlp/twitter-roberta-base-sentiment-latest usually returns 'negative', 'neutral', 'positive'
    # but let's check output. If it is LABEL_x, we map it.
    # Actually, recent transformers versions map it automatically for this model if config is present.
    # It returns [{'label': 'positive', 'score': 0.9...}] usually.
    
    results = sentiment_pipe(request.text, top_k=3)
    # results is [[{'label': 'positive', 'score': 0.9}, ...]] if single input
    # wait, pipeline output format varies. For single string input:
    # [{'label': 'positive', 'score': 0.9}, {'label': 'neutral', 'score': 0.1}...] if top_k > 1?
    # Actually for text-classification with top_k, it returns a list of dicts.
    
    # Normalizing output
    # If the labels are 'positive', 'neutral', 'negative', simply return them.
    # Uppercase them to match frontend expectations (POSITIVE, NEUTRAL, NEGATIVE)
    
    data = results # It's a list since top_k=3
    output = []
    for item in data:
        label = item['label'].upper()
        output.append(SentimentResult(label=label, score=item['score']))
    
    return output

@app.post("/analyze/emotion", response_model=List[EmotionResult])
async def analyze_emotion(request: TextRequest):
    if not emotion_pipe:
        raise HTTPException(status_code=503, detail="Emotion model not loaded")
    
    results = emotion_pipe(request.text) # top_k=5 defined in pipeline load
    # results is a list of dicts [{'label': 'joy', 'score': 0.9}, ...]
    # actually pipeline(..., top_k=5) returns a list of lists if batch, or list if single?
    # usually list of dicts for single text.
    
    # SamLowe model has many labels (28).
    # We just return the top ones.
    
    processed = []
    # If input is single string, results is `[{label:.., score:..}, ...]`
    # Wait, sometimes it's `[[{...}]]`. Let's handle both.
    data = results
    if isinstance(results, list) and len(results) > 0 and isinstance(results[0], list):
        data = results[0]

    for item in data:
        processed.append(EmotionResult(label=item['label'].lower(), score=item['score']))
    
    return processed

@app.post("/analyze/summary", response_model=SummaryResponse)
async def analyze_summary(request: TextRequest):
    if not summary_pipe:
        raise HTTPException(status_code=503, detail="Summary model not loaded")
    
    # clean input
    clean_text = request.text.strip()
    if not clean_text:
        return SummaryResponse(summary_text="")
        
    results = summary_pipe(clean_text, max_length=130, min_length=30, do_sample=False)
    # results -> [{'summary_text': '...'}]
    
    return SummaryResponse(summary_text=results[0]['summary_text'])



if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
