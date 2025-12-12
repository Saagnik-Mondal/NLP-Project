import type { Metadata } from "next";
import Link from "next/link";
import { Orbitron, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ClickBurst } from "@/components/ui/click-burst";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { ClashBackground } from "@/components/ui/clash-background";

const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-orbitron" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
    title: "AI Power Suite",
    description: "High-performance AI tools for text analysis and generation.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <body className={cn(jetbrains.variable, orbitron.variable, "antialiased bg-[#020204] text-white min-h-screen font-mono selection:bg-orange-500/30 selection:text-orange-200")}>
                <ClashBackground />
                <CustomCursor />
                <ClickBurst />
                <main className="flex min-h-screen flex-col items-center">
                    {/* Header */}
                    <div className="z-50 w-full max-w-7xl items-center justify-between py-6 px-6 flex border-b border-white/5 bg-black/50 backdrop-blur-xl fixed top-0 left-0 right-0 mx-auto">
                        <Link href="/" className="font-orbitron text-lg font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600 drop-shadow-[0_0_10px_rgba(234,88,12,0.5)] hover:opacity-80 transition-opacity">
                            SAAGNIK_AI
                        </Link>
                        <nav className="text-xs font-bold tracking-widest text-zinc-500 space-x-6 uppercase">
                            <a href="https://github.com/Saagnik-Mondal/NLP-Project" target="_blank" className="hover:text-cyan-400 transition-colors hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">Source_Code</a>
                        </nav>
                    </div>
                    <div className="pt-24 w-full flex flex-col items-center">
                        {children}
                    </div>
                </main>
            </body>
        </html>
    );
}
