"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Particle {
    id: number;
    x: number;
    y: number;
    color: string;
    velocity: { x: number; y: number };
    size: number;
}

export const ClickBurst = () => {
    const [particles, setParticles] = useState<Particle[]>([]);

    const spawnParticles = useCallback((e: MouseEvent) => {
        const particleCount = 12;
        const newParticles: Particle[] = [];

        for (let i = 0; i < particleCount; i++) {
            // Randomly choose between Fire (Orange) and Aura (Cyan) colors
            const isFire = Math.random() > 0.5;
            const color = isFire
                ? `hsl(${Math.random() * 40 + 10}, 100%, 50%)` // Orange/Red range
                : `hsl(${Math.random() * 40 + 180}, 100%, 60%)`; // Cyan/Blue range

            newParticles.push({
                id: Date.now() + i,
                x: e.clientX,
                y: e.clientY,
                color: color,
                velocity: {
                    x: (Math.random() - 0.5) * 15, // Spread X
                    y: (Math.random() - 0.5) * 15, // Spread Y
                },
                size: Math.random() * 6 + 2,
            });
        }

        setParticles((prev) => [...prev, ...newParticles]);

        // Cleanup particles after animation
        setTimeout(() => {
            setParticles((prev) => prev.filter(p => !newParticles.includes(p)));
        }, 1000);
    }, []);

    useEffect(() => {
        window.addEventListener("click", spawnParticles);
        return () => window.removeEventListener("click", spawnParticles);
    }, [spawnParticles]);

    return (
        <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
            <AnimatePresence>
                {particles.map((p) => (
                    <motion.div
                        key={p.id}
                        initial={{ opacity: 1, scale: 1, x: p.x, y: p.y }}
                        animate={{
                            opacity: 0,
                            scale: 0,
                            x: p.x + p.velocity.x * 20,
                            y: p.y + p.velocity.y * 20,
                        }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        style={{
                            position: "absolute",
                            width: p.size,
                            height: p.size,
                            backgroundColor: p.color,
                            borderRadius: "50%",
                            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
                        }}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
};
