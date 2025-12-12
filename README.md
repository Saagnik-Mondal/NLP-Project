# NLP Power Suite

A high-performance AI showcase featuring advanced NLP capabilities powered by a Python backend and a modern Next.js frontend.

## 🚀 Live Demo

Check out the live application here: [**NLP Power Suite Live**](https://nlp-project-nu.vercel.app)

## ✨ Features

- **Sentiment Analysis**: Detect positive, negative, and neutral tones with precision.
- **Emotion Detection**: Identify subtle emotions like Joy, Anger, Sorrow, and more.
- **Text Summarizer**: Condense long articles into concise summaries.
- **Modern UI**: Built with a "Clash of Clans" inspired aesthetic using Tailwind CSS and Framer Motion.

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, Lucide React, Framer Motion.
- **Backend**: Python, FastAPI, Transformers (Hugging Face), Torch.

## 💻 Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Saagnik-Mondal/NLP-Project.git
   cd NLP-Project
   ```

2. **Frontend Setup**
   ```bash
   npm install
   npm run dev
   ```

3. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```

4. **Access the App**
   Open [http://localhost:3000](http://localhost:3000) for the frontend and [http://localhost:8000](http://localhost:8000) for the API.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
