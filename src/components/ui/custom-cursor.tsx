"use client";

import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export const CustomCursor = () => {
    // using motion values for performance
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    // trail physics
    const trailX = useSpring(mouseX, { stiffness: 300, damping: 20, mass: 0.5 });
    const trailY = useSpring(mouseY, { stiffness: 300, damping: 20, mass: 0.5 });

    useEffect(() => {
        const mouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
            if (!isVisible) setIsVisible(true);
        };

        const checkHover = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const isClickable =
                target.tagName === "BUTTON" ||
                target.tagName === "A" ||
                target.closest("button") ||
                target.closest("a") ||
                target.getAttribute("role") === "button" ||
                target.classList.contains("cursor-pointer");

            setIsHovering(!!isClickable);
        };

        window.addEventListener("mousemove", mouseMove);
        window.addEventListener("mouseover", checkHover);

        return () => {
            window.removeEventListener("mousemove", mouseMove);
            window.removeEventListener("mouseover", checkHover);
        };
    }, [isVisible, mouseX, mouseY]);

    if (!isVisible) return null;

    return (
        <div className="pointer-events-none fixed inset-0 z-[10000] overflow-hidden mix-blend-screen">

            {/* The Shard (Main Pointer - Instant Response) */}
            <motion.div
                className="fixed top-0 left-0"
                style={{
                    x: mouseX,
                    y: mouseY,
                    marginLeft: "-6px",
                    marginTop: "-6px",
                }}
                animate={{
                    rotate: isHovering ? 45 : 0,
                    scale: isHovering ? 1.5 : 1,
                }}
                transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 25,
                    mass: 0.2
                }}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M12 2L2 22L12 18L22 22L12 2Z"
                        fill={isHovering ? "#FF4500" : "#00E5FF"}
                        className="drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                    />
                </svg>
            </motion.div>

            {/* Trailing Energy (Physics-based Spring Follow) */}
            <motion.div
                className="fixed top-0 left-0 opacity-40"
                style={{
                    x: trailX, // Uses spring values automatically
                    y: trailY,
                    marginLeft: "-6px",
                    marginTop: "-6px",
                }}
                animate={{
                    rotate: isHovering ? 45 : 0,
                    scale: isHovering ? 1.2 : 0.8,
                }}
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M12 2L2 22L12 18L22 22L12 2Z"
                        stroke={isHovering ? "#FF4500" : "#00E5FF"}
                        strokeWidth="2"
                    />
                </svg>
            </motion.div>

        </div>
    );
};
