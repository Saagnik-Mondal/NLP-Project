"use client";

import { motion } from "framer-motion";

export const ClashBackground = () => {
    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#020101]">

            {/* Magma */}
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    x: [-20, 0, -20],
                    opacity: [0.6, 0.8, 0.6],
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute top-[-20%] left-[-20%] w-[80vw] h-[80vw] rounded-full blur-[120px] mix-blend-screen"
                style={{
                    background: "radial-gradient(circle at center, #ffaa00 0%, #ff4d00 30%, #8b0000 60%, transparent 80%)"
                }}
            />

            {/* Spirit */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    x: [20, 0, 20],
                    opacity: [0.5, 0.7, 0.5],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute bottom-[-10%] right-[-10%] w-[80vw] h-[80vw] rounded-full blur-[120px] mix-blend-screen"
                style={{
                    background: "radial-gradient(circle at center, #ccfbf1 0%, #2dd4bf 30%, #4c1d95 60%, transparent 80%)"
                }}
            />

            {/* Fog */}
            <motion.div
                animate={{
                    opacity: [0.2, 0.4, 0.2],
                    rotate: [0, 45, 0],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vw] rounded-full blur-[150px] mix-blend-overlay"
                style={{
                    background: "conic-gradient(from 0deg, #450a0a, #172554, #450a0a)"
                }}
            />

            {/* Organic Grain/Noise Overlay (Heavier for texture) */}
            <div
                className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opaciry='0.5'/%3E%3C/svg%3E")`,
                    filter: "contrast(150%) brightness(100%)"
                }}
            />

            {/* Vignette to focus center */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_90%)] pointer-events-none" />

        </div>
    );
};
