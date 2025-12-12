"use client";

import Link from "next/link";
import { ArrowRight, Brain, FileText, Smile, Flame, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ElementalCard } from "@/components/ui/elemental-card";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function Home() {
    const fighters = [
        {
            title: "Sentiment Analysis",
            description: "Detect positive or negative tone in text with high precision.",
            href: "/demos/nlp?tab=sentiment",
            icon: <Flame className="w-8 h-8 text-orange-500" />,
            element: "fire" as const,
        },
        {
            title: "Emotion Detection",
            description: "Identify subtle emotions like Joy, Anger, and Sorrow in any text.",
            href: "/demos/nlp?tab=emotion",
            icon: <Zap className="w-8 h-8 text-cyan-400" />,
            element: "aura" as const,
        },
        {
            title: "Text Summarizer",
            description: "Condense long articles into concise, meaningful summaries.",
            href: "/demos/nlp?tab=summary",
            icon: <Shield className="w-8 h-8 text-blue-400" />,
            element: "steel" as const,
        },
    ];

    return (
        <div className="w-full flex-grow flex flex-col items-center justify-center relative overflow-hidden">

            {/* Background Energy Field */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
                <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="z-10 w-full max-w-6xl px-4 py-12 md:py-24 space-y-20">

                {/* Title Section */}
                <div className="text-center space-y-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 2 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, type: 'spring' }}
                        className="inline-block"
                    >
                        <h1 className="text-6xl md:text-9xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500 drop-shadow-[0_0_25px_rgba(255,255,255,0.3)]">
                            UNLEASH
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 text-glow-orange">
                                INTELLECT
                            </span>
                        </h1>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-zinc-400 max-w-2xl mx-auto text-lg md:text-xl font-mono uppercase tracking-widest"
                    >
                        Select a neural module from the registry
                    </motion.p>
                </div>

                {/* Character Select Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {fighters.map((fighter, index) => (
                        <Link href={fighter.href} key={index} className="block h-full">
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 + (index * 0.1) }}
                                className="h-full"
                            >
                                <ElementalCard element={fighter.element} className="h-full min-h-[300px]">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="p-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                                            {fighter.icon}
                                        </div>
                                    </div>

                                    <div className="mt-auto space-y-4">
                                        <h2 className={cn(
                                            "text-3xl font-black italic tracking-wide uppercase",
                                            fighter.element === 'fire' ? 'text-orange-500' :
                                                fighter.element === 'aura' ? 'text-cyan-400' : 'text-blue-400'
                                        )}>
                                            {fighter.title}
                                        </h2>
                                        <div className="h-1 w-12 bg-white/20" />
                                        <p className="text-zinc-400 font-mono text-sm leading-relaxed">
                                            {fighter.description}
                                        </p>

                                        <div className="pt-6 flex justify-end items-center mt-4">
                                            <span className="group-hover:translate-x-2 transition-transform duration-300">
                                                <ArrowRight className="w-5 h-5 opacity-60 group-hover:opacity-100 group-hover:text-white" />
                                            </span>
                                        </div>
                                    </div>
                                </ElementalCard>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
