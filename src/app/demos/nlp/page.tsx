"use client";

import { useState, Suspense } from "react";
import { ArrowLeft, Flame, Zap, Shield, Loader2, Sparkles, Snowflake, Minus, Skull, Droplets, Smile, Frown, ThumbsUp, ThumbsDown, Heart, CloudRain, AlertTriangle, HelpCircle, Meh, Search } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { analyzeSentiment, summarizeText, detectEmotion, type SentimentResult, type EmotionResult } from "@/lib/ai-service";
import { motion, AnimatePresence } from "framer-motion";
import { ElementalCard } from "@/components/ui/elemental-card";
import { KAGGLE_SAMPLES, type SampleData } from "@/data/kaggle_samples";

function NLPContent() {
    const searchParams = useSearchParams();
    const defaultTab = searchParams.get("tab") as "sentiment" | "emotion" | "summary" | null;
    const [activeTab, setActiveTab] = useState<"sentiment" | "emotion" | "summary">(defaultTab || "sentiment");
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const [sentimentResult, setSentimentResult] = useState<SentimentResult[] | null>(null);
    const [emotionResult, setEmotionResult] = useState<EmotionResult[] | null>(null);
    const [summaryResult, setSummaryResult] = useState<string | null>(null);

    // Derived UI states
    const activeElement = activeTab === "sentiment" ? "fire" : activeTab === "emotion" ? "aura" : "steel";
    const accentColor = activeTab === "sentiment" ? "text-orange-500" : activeTab === "emotion" ? "text-cyan-400" : "text-blue-400";

    // Tools configuration
    const tools = [
        { id: "sentiment", label: "Sentiment", icon: Flame, color: "hover:text-orange-400 hover:border-orange-500/50 hover:bg-orange-500/10" },
        { id: "emotion", label: "Emotion", icon: Zap, color: "hover:text-cyan-400 hover:border-cyan-500/50 hover:bg-cyan-500/10" },
        { id: "summary", label: "Summarizer", icon: Shield, color: "hover:text-blue-400 hover:border-blue-500/50 hover:bg-blue-500/10" }
    ];

    const handleAnalyze = async () => {
        if (!input.trim()) return;
        setLoading(true);
        // Reset previous results
        setSentimentResult(null);
        setEmotionResult(null);
        setSummaryResult(null);

        try {
            switch (activeTab) {
                case "sentiment":
                    const sentRes = await analyzeSentiment(input);
                    setSentimentResult(Array.isArray(sentRes) ? sentRes : [sentRes]);
                    break;
                case "emotion":
                    const emoRes = await detectEmotion(input);
                    setEmotionResult(emoRes);
                    break;
                case "summary":
                    const sumRes = await summarizeText(input);
                    setSummaryResult(sumRes);
                    break;
            }
        } catch (e) {
            console.error("Analysis failed:", e);
        } finally {
            setLoading(false);
        }
    };

    const getIconForLabel = (label: string) => {
        const l = label.toUpperCase();

        // Sentiment
        if (l.includes("POS")) return <ThumbsUp className="w-4 h-4 text-green-500" />;
        if (l.includes("NEG")) return <ThumbsDown className="w-4 h-4 text-red-500" />;
        if (l.includes("NEU") && !l.includes("NEUTRAL")) return <Minus className="w-4 h-4 text-zinc-400" />; // Covers NEU sentiment tag

        // Emotions (SamLowe/go_emotions)
        // Groups: 
        // Happy/Positive
        if (l.includes("JOY") || l.includes("EXCITEMENT") || l.includes("AMUSEMENT")) return <Smile className="w-4 h-4 text-yellow-400" />;
        if (l.includes("LOVE") || l.includes("ADMIRATION") || l.includes("CARING")) return <Heart className="w-4 h-4 text-pink-500" />;
        if (l.includes("OPTIMISM") || l.includes("PRIDE") || l.includes("GRATITUDE")) return <Sparkles className="w-4 h-4 text-amber-400" />;

        // Sad/Negative
        if (l.includes("SAD") || l.includes("GRIEF") || l.includes("DISAPPOINTMENT") || l.includes("REMORSE")) return <CloudRain className="w-4 h-4 text-blue-400" />;
        if (l.includes("ANGER") || l.includes("ANNOYANCE") || l.includes("DISAPPROVAL")) return <Flame className="w-4 h-4 text-red-500" />;
        if (l.includes("FEAR") || l.includes("NERVOUSNESS")) return <Skull className="w-4 h-4 text-purple-400" />;
        if (l.includes("DISGUST")) return <Frown className="w-4 h-4 text-green-600" />;

        // Surprise/Ambiguous
        if (l.includes("SURPRISE") || l.includes("REALIZATION") || l.includes("CONFUSION")) return <AlertTriangle className="w-4 h-4 text-orange-400" />;
        if (l.includes("CURIOSITY")) return <Search className="w-4 h-4 text-cyan-400" />;

        // Neutral
        if (l.includes("NEUTRAL")) return <Meh className="w-4 h-4 text-zinc-500" />;

        return <Sparkles className="w-4 h-4 text-white" />;
    };

    return (
        <div className="w-full max-w-6xl px-4 py-8">

            {/* Header */}
            <div className="w-full flex items-center justify-between mb-8 border-b border-white/10 pb-6 backdrop-blur-md bg-black/20 rounded-xl px-6">
                <div>
                    <Link href="/" className="inline-flex items-center text-xs font-bold font-mono text-zinc-500 hover:text-white transition-colors mb-2 uppercase tracking-widest group">
                        <ArrowLeft className="w-3 h-3 mr-2 group-hover:-translate-x-1 transition-transform" /> <span className="group-hover:text-glow-cyan">Back to Home</span>
                    </Link>
                    <h1 className={cn("font-orbitron text-2xl md:text-3xl font-bold uppercase tracking-widest", accentColor)}>
                        {tools.find(t => t.id === activeTab)?.label || "Analysis Tool"}
                    </h1>
                </div>
            </div>

            <div className="grid md:grid-cols-[1fr_300px] gap-8 w-full z-10">
                <div className="space-y-8">
                    {/* Input Area */}
                    <ElementalCard element={activeElement} className="min-h-[250px]">
                        <div className="space-y-4">
                            <label className="text-xs font-bold text-zinc-500 block uppercase tracking-widest">Input Text</label>
                            <textarea
                                className="flex min-h-[150px] w-full bg-black/50 border border-white/10 rounded-none px-4 py-4 text-sm font-mono text-white placeholder:text-zinc-700 focus-visible:outline-none focus:border-white/30 transition-all resize-none shadow-inner"
                                placeholder={
                                    activeTab === "sentiment" ? "Enter text to analyze sentiment..." :
                                        activeTab === "emotion" ? "Enter text to detect emotions..." :
                                            "Paste text here to summarize..."
                                }
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                            <div className="flex justify-end pt-2">
                                <Button
                                    onClick={handleAnalyze}
                                    disabled={loading || !input.trim()}
                                    className={cn(
                                        "rounded-none px-8 h-10 shadow-none border font-orbitron text-xs tracking-widest uppercase transition-all",
                                        activeTab === "sentiment" ? "bg-orange-600 hover:bg-orange-700 border-orange-500 text-white" :
                                            activeTab === "emotion" ? "bg-cyan-600 hover:bg-cyan-700 border-cyan-500 text-white" :
                                                "bg-blue-600 hover:bg-blue-700 border-blue-500 text-white"
                                    )}
                                >
                                    {loading ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : <Zap className="mr-2 h-3 w-3" />}
                                    {loading ? "Analyzing..." : "Run Analysis"}
                                </Button>
                            </div>
                        </div>
                    </ElementalCard>

                    {/* Results Display */}
                    <AnimatePresence mode="wait">
                        {(sentimentResult || emotionResult || summaryResult) && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                            >
                                <div className="border border-white/10 bg-black/80 backdrop-blur-xl p-1 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none" />

                                    <div className="p-6 relative z-10">
                                        <label className={cn("text-xs font-bold block uppercase tracking-widest mb-6 flex items-center gap-2", accentColor)}>
                                            <Sparkles className="w-3 h-3" /> Results
                                        </label>

                                        {activeTab === "sentiment" && sentimentResult && (
                                            <div className="space-y-6">
                                                {sentimentResult.map((res, i) => (
                                                    <div key={i} className="space-y-2">
                                                        <div className="flex justify-between items-center text-lg font-orbitron tracking-wide">
                                                            <span className="flex items-center gap-2">{getIconForLabel(res.label)} {res.label}</span>
                                                            <span className="font-mono text-orange-400">{(res.score * 100).toFixed(1)}%</span>
                                                        </div>
                                                        <div className="h-2 w-full bg-zinc-900 border border-white/10 relative overflow-hidden">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${res.score * 100}%` }}
                                                                transition={{ duration: 0.8 }}
                                                                className={cn("h-full relative",
                                                                    res.label.toLowerCase().includes('pos') ? 'bg-orange-500' :
                                                                        res.label.toLowerCase().includes('neu') ? 'bg-zinc-500' :
                                                                            'bg-red-900'
                                                                )}
                                                            >
                                                                <div className="absolute inset-0 bg-white/20 animate-pulse" />
                                                            </motion.div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {activeTab === "emotion" && emotionResult && (
                                            <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                                                {emotionResult.slice(0, 4).map((res, i) => (
                                                    <div key={i} className="space-y-2 group">
                                                        <div className="flex justify-between items-center text-sm font-bold font-mono uppercase text-zinc-400 group-hover:text-cyan-400 transition-colors">
                                                            <span className="flex items-center gap-2">{getIconForLabel(res.label)} {res.label}</span>
                                                            <span className="text-white">{(res.score * 100).toFixed(0)}%</span>
                                                        </div>
                                                        <div className="h-1 w-full bg-zinc-900">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${res.score * 100}%` }}
                                                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                                                className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {activeTab === "summary" && summaryResult && (
                                            <div className="leading-relaxed font-mono text-sm text-blue-100/80 border-l-2 border-blue-500 pl-4 py-2">
                                                {summaryResult}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Sidebar Controls */}
                <div className="space-y-4">
                    <div className="bg-black/40 border border-white/10 p-4 backdrop-blur-sm">
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600 mb-4 border-b border-white/5 pb-2">Select Tool</h3>
                        <div className="space-y-2">
                            {tools.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        setActiveTab(item.id as any);
                                        setSentimentResult(null);
                                        setEmotionResult(null);
                                        setSummaryResult(null);
                                        setInput("");
                                    }}
                                    className={cn(
                                        "w-full flex items-center justify-between px-4 py-3 text-sm font-mono uppercase tracking-wider border transition-all duration-300 group relative overflow-hidden",
                                        activeTab === item.id
                                            ? "border-white bg-white/5 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                                            : "border-transparent text-zinc-500 bg-transparent " + item.color
                                    )}
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        <item.icon className={cn("w-4 h-4", activeTab === item.id ? "text-white animate-pulse" : "opacity-50")} />
                                        {item.label}
                                    </span>
                                    {activeTab === item.id && <div className="w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_5px_white]" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Sample Data Selection */}
                    {(activeTab === "sentiment" || activeTab === "emotion" || activeTab === "summary") && (
                        <div className="bg-black/40 border border-white/10 p-4 backdrop-blur-sm">
                            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600 mb-4 border-b border-white/5 pb-2">
                                Examples
                            </h3>
                            <div className="space-y-2">
                                {(KAGGLE_SAMPLES[activeTab] || []).map((sample: SampleData, idx: number) => (
                                    <button
                                        key={idx}
                                        onClick={() => setInput(sample.text)}
                                        className="w-full text-left px-3 py-2 text-xs font-mono text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-all truncate"
                                    >
                                        {sample.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function NLPPage() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center h-screen"><Loader2 className="w-8 h-8 animate-spin text-orange-500" /></div>}>
            <NLPContent />
        </Suspense>
    );
}
