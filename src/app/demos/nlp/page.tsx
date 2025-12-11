"use client";

import { useState, Suspense } from "react";
import { ArrowLeft, Flame, Zap, Shield, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { analyzeSentiment, summarizeText, detectEmotion, type SentimentResult, type EmotionResult } from "@/lib/ai-service";
import { motion, AnimatePresence } from "framer-motion";
import { ElementalCard } from "@/components/ui/elemental-card";

function NLPContent() {
    const searchParams = useSearchParams();
    const defaultTab = searchParams.get("tab") as "sentiment" | "emotion" | "summary" | null;
    const [activeTab, setActiveTab] = useState<"sentiment" | "emotion" | "summary">(defaultTab || "sentiment");
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const [sentimentResult, setSentimentResult] = useState<SentimentResult[] | null>(null);
    const [emotionResult, setEmotionResult] = useState<EmotionResult[] | null>(null);
    const [summaryResult, setSummaryResult] = useState<string | null>(null);

    const handleAnalyze = async () => {
        if (!input.trim()) return;
        setLoading(true);
        setSentimentResult(null);
        setEmotionResult(null);
        setSummaryResult(null);

        try {
            if (activeTab === "sentiment") {
                const res = await analyzeSentiment(input);
                setSentimentResult(Array.isArray(res) ? res : [res]);
            } else if (activeTab === "emotion") {
                const res = await detectEmotion(input);
                setEmotionResult(res);
            } else {
                const res = await summarizeText(input);
                setSummaryResult(res);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const getEmojiForLabel = (label: string) => {
        const map: Record<string, string> = {
            joy: "😄",
            sadness: "😢",
            anger: "😠",
            fear: "😱",
            surprise: "😲",
            disgust: "🤢",
            neutral: "😐",
            POSITIVE: "🔥",
            NEGATIVE: "❄️"
        };
        return map[label] || label;
    };

    const activeElement = activeTab === "sentiment" ? "fire" : activeTab === "emotion" ? "aura" : "steel";
    const accentColor = activeTab === "sentiment" ? "text-orange-500" : activeTab === "emotion" ? "text-cyan-400" : "text-blue-400";
    const bgGlow = activeTab === "sentiment" ? "bg-orange-500" : activeTab === "emotion" ? "bg-cyan-400" : "bg-blue-400";

    return (
        <div className="flex min-h-screen flex-col items-center p-4 md:p-12 relative w-full max-w-7xl">

            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none z-[-1]">
                <div className={cn("absolute top-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full blur-[150px] opacity-20 transition-colors duration-1000", bgGlow)} />
            </div>

            {/* Header */}
            <div className="w-full flex items-center justify-between mb-8 border-b border-white/10 pb-6 backdrop-blur-md bg-black/20 rounded-xl px-6">
                <div>
                    <Link href="/" className="inline-flex items-center text-xs font-bold font-mono text-zinc-500 hover:text-white transition-colors mb-2 uppercase tracking-widest group">
                        <ArrowLeft className="w-3 h-3 mr-2 group-hover:-translate-x-1 transition-transform" /> <span className="group-hover:text-glow-cyan">Back to Home</span>
                    </Link>
                    <h1 className={cn("font-orbitron text-2xl md:text-3xl font-bold uppercase tracking-widest", accentColor)}>
                        {activeTab === 'sentiment' ? 'Sentiment Analysis' : activeTab === 'emotion' ? 'Emotion Detection' : 'Text Summarizer'}
                    </h1>
                </div>
            </div>

            <div className="grid md:grid-cols-[1fr_300px] gap-8 w-full z-10">
                <div className="space-y-8">
                    {/* Elemental Input Container */}
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
                                    {loading ? "Processing..." : "Run Analysis"}
                                </Button>
                            </div>
                        </div>
                    </ElementalCard>

                    {/* Results Area */}
                    <AnimatePresence mode="wait">
                        {(sentimentResult || emotionResult || summaryResult) && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                            >
                                <div className="border border-white/10 bg-black/80 backdrop-blur-xl p-1 relative overflow-hidden">
                                    {/* Scanline overlay */}
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
                                                            <span className="flex items-center gap-2">{getEmojiForLabel(res.label)} {res.label}</span>
                                                            <span className="font-mono text-orange-400">{(res.score * 100).toFixed(1)}%</span>
                                                        </div>
                                                        <div className="h-2 w-full bg-zinc-900 border border-white/10 relative overflow-hidden">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${res.score * 100}%` }}
                                                                transition={{ duration: 0.8 }}
                                                                className={cn("h-full relative", res.label === 'POSITIVE' ? 'bg-orange-500' : 'bg-red-900')}
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
                                                            <span className="flex items-center gap-2">{getEmojiForLabel(res.label)} {res.label}</span>
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

                {/* Sidebar Controls (Battle Menu Style) */}
                <div className="space-y-4">
                    <div className="bg-black/40 border border-white/10 p-4 backdrop-blur-sm">
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600 mb-4 border-b border-white/5 pb-2">Select Tool</h3>
                        <div className="space-y-2">
                            {[
                                { id: "sentiment", label: "Sentiment", icon: Flame, color: "hover:text-orange-400 hover:border-orange-500/50 hover:bg-orange-500/10" },
                                { id: "emotion", label: "Emotion", icon: Zap, color: "hover:text-cyan-400 hover:border-cyan-500/50 hover:bg-cyan-500/10" },
                                { id: "summary", label: "Summarizer", icon: Shield, color: "hover:text-blue-400 hover:border-blue-500/50 hover:bg-blue-500/10" }
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => { setActiveTab(item.id as any); setSentimentResult(null); setEmotionResult(null); setSummaryResult(null); }}
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
