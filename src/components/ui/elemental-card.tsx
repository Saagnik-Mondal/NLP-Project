"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import React from "react";

interface ElementalCardProps {
    children: React.ReactNode;
    element: "fire" | "aura" | "steel";
    className?: string;
    onClick?: () => void;
}

export const ElementalCard = ({ children, element, className, onClick }: ElementalCardProps) => {

    // Elemental Configurations
    const styles = {
        fire: {
            border: "border-orange-500/50",
            bg: "bg-gradient-to-br from-black to-orange-950/20",
            glow: "group-hover:shadow-[0_0_30px_rgba(255,69,0,0.6)]",
            textAccent: "text-orange-500",
            gradient: "from-orange-500 to-red-600",
            particleColor: "bg-orange-500"
        },
        aura: {
            border: "border-cyan-500/50",
            bg: "bg-gradient-to-br from-black to-cyan-950/20",
            glow: "group-hover:shadow-[0_0_30px_rgba(0,229,255,0.6)]",
            textAccent: "text-cyan-400",
            gradient: "from-cyan-400 to-purple-500",
            particleColor: "bg-cyan-400"
        },
        steel: {
            border: "border-blue-400/50",
            bg: "bg-gradient-to-br from-black to-slate-900",
            glow: "group-hover:shadow-[0_0_30px_rgba(96,165,250,0.6)]",
            textAccent: "text-blue-400",
            gradient: "from-blue-400 to-slate-300",
            particleColor: "bg-blue-400"
        }
    };

    const config = styles[element];

    return (
        <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            transition={{ duration: 0.15 }}
            onClick={onClick}
            className={cn(
                "relative group rounded-xl border-2 overflow-hidden cursor-pointer transition-all duration-150",
                config.border,
                config.bg,
                config.glow,
                className
            )}
        >
            {/* Ambient Pulse Background */}
            <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-150 bg-gradient-to-t", config.gradient)} />

            {/* Scanning Line Effect */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-white/50 opacity-0 group-hover:opacity-100 animate-[scan_1s_linear_infinite]" />

            {/* Corner Markers (Tech Look) */}
            <div className={cn("absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2", config.textAccent)} />
            <div className={cn("absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2", config.textAccent)} />

            {/* Content */}
            <div className="relative z-10 p-6 h-full flex flex-col">
                {children}
            </div>

            {/* Particle Dust (Simulated) */}
            <div className={cn("absolute bottom-0 left-1/2 w-1 h-1 rounded-full opacity-0 group-hover:animate-ping", config.particleColor)} />

        </motion.div>
    );
};
