"use client";

import { useState } from "react";
import { ArrowLeft, Brain, FileText, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { analyzeSentiment, summarizeText, type SentimentResult } from "@/lib/ai-service";

export default function NLPPage() {
    const [activeTab, setActiveTab] = useState<"sentiment" | "summary">("sentiment");
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [sentimentResult, setSentimentResult] = useState<SentimentResult[] | null>(null);
    const [summaryResult, setSummaryResult] = useState<string | null>(null);

    const handleAnalyze = async () => {
        if (!input.trim()) return;
        setLoading(true);
        setSentimentResult(null);
        setSummaryResult(null);

        try {
            if (activeTab === "sentiment") {
                const res = await analyzeSentiment(input);
                // Hf returns array of classification results, usually wrapped or just array
                // normalized to SentimentResult[] in service
                setSentimentResult(Array.isArray(res) ? res : [res]);
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

    return (
        <div className="flex min-h-screen flex-col items-center p-8 md:p-24 relative overflow-hidden">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>

            <div className="z-10 w-full max-w-4xl space-y-8">
                <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/"><ArrowLeft className="h-4 w-4" /></Link>
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight">NLP Suite</h1>
                </div>

                <div className="grid md:grid-cols-[1fr_300px] gap-6">
                    <div className="space-y-6">
                        <Card className="border-2">
                            <CardHeader>
                                <CardTitle>Input Text</CardTitle>
                                <CardDescription>Enter text to {activeTab === "sentiment" ? "analyze sentiment" : "summarize"}.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <textarea
                                    className="flex min-h-[200px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder={activeTab === "sentiment" ? "I absolutely loved this product! It's amazing..." : "Paste a long article here to summarize..."}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                />
                            </CardContent>
                            <CardFooter className="justify-end">
                                <Button onClick={handleAnalyze} disabled={loading || !input.trim()}>
                                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                                    {activeTab === "sentiment" ? "Analyze Sentiment" : "Summarize"}
                                </Button>
                            </CardFooter>
                        </Card>

                        {/* Results Area */}
                        {(sentimentResult || summaryResult) && (
                            <Card className="bg-muted/50 border-primary/20">
                                <CardHeader>
                                    <CardTitle>Results</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {activeTab === "sentiment" && sentimentResult && (
                                        <div className="space-y-4">
                                            {sentimentResult.map((res, i) => (
                                                <div key={i} className="space-y-1">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="font-medium uppercase">{res.label}</span>
                                                        <span>{(res.score * 100).toFixed(1)}%</span>
                                                    </div>
                                                    <div className="h-2 w-full rounded-full bg-secondary">
                                                        <div
                                                            className={cn("h-full rounded-full transition-all", res.label === 'POSITIVE' ? 'bg-green-500' : 'bg-red-500')}
                                                            style={{ width: `${res.score * 100}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {activeTab === "summary" && summaryResult && (
                                        <p className="leading-7">{summaryResult}</p>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar / Controls */}
                    <div className="space-y-4">
                        <Card>
                            <CardHeader><CardTitle>Mode</CardTitle></CardHeader>
                            <CardContent className="grid gap-2">
                                <Button
                                    variant={activeTab === "sentiment" ? "default" : "outline"}
                                    className="justify-start"
                                    onClick={() => { setActiveTab("sentiment"); setSentimentResult(null); setSummaryResult(null); }}
                                >
                                    <Brain className="mr-2 h-4 w-4" /> Sentiment
                                </Button>
                                <Button
                                    variant={activeTab === "summary" ? "default" : "outline"}
                                    className="justify-start"
                                    onClick={() => { setActiveTab("summary"); setSentimentResult(null); setSummaryResult(null); }}
                                >
                                    <FileText className="mr-2 h-4 w-4" /> Summarizer
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
