import Link from "next/link";
import { ArrowRight, Brain, ImageIcon, MessageSquare, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function Home() {
    const demos = [
        {
            title: "NLP Suite",
            description: "Analyze sentiment and summarize text using state-of-the-art Hugging Face models.",
            icon: <Brain className="h-10 w-10 text-primary" />,
            href: "/demos/nlp",
            cta: "Try Analysis",
            active: true,
        },
        {
            title: "Image Classifier",
            description: "Real-time image classification using TensorFlow/Keras CNNs. (Coming Soon)",
            icon: <ImageIcon className="h-10 w-10 text-muted-foreground" />,
            href: "#",
            cta: "Coming Soon",
            active: false,
        },
        {
            title: "Smart Chatbot",
            description: "Conversational AI powered by RASA/LLM integrations. (Coming Soon)",
            icon: <MessageSquare className="h-10 w-10 text-muted-foreground" />,
            href: "#",
            cta: "Coming Soon",
            active: false,
        },
    ];

    return (
        <div className="flex flex-col items-center w-full max-w-6xl">
            <section className="flex flex-col items-center text-center space-y-6 py-24 md:py-32">
                <div className="inline-flex items-center rounded-lg bg-stone-100 px-3 py-1 text-sm font-medium dark:bg-stone-800">
                    <Sparkles className="mr-2 h-4 w-4 fill-yellow-500 text-yellow-500" />
                    <span>AI Project Portfolio</span>
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-white to-stone-400">
                    AI/ML <br className="hidden sm:inline" />
                    <span className="text-primary">Skills Demo</span>
                </h1>
                <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                    A collection of my experiments with Natural Language Processing and Computer Vision.
                </p>
                <div className="flex gap-4">
                    <Button size="lg" asChild>
                        <Link href="/demos/nlp">
                            Try It Out <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                    <Button variant="outline" size="lg" asChild>
                        <Link href="https://github.com/Saagnik-Mondal/NLP-Project" target="_blank">
                            Source Code
                        </Link>
                    </Button>
                </div>
            </section>

            <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 w-full px-4">
                {demos.map((demo, index) => (
                    <Card key={index} className={cn("transition-all hover:scale-105", !demo.active && "opacity-60 grayscale-[0.5]")}>
                        <CardHeader>
                            <div className="mb-4">{demo.icon}</div>
                            <CardTitle className="text-xl">{demo.title}</CardTitle>
                            <CardDescription>{demo.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                        </CardContent>
                        <CardFooter>
                            <Button asChild={demo.active} variant={demo.active ? "default" : "secondary"} className="w-full" disabled={!demo.active}>
                                {demo.active ? (
                                    <Link href={demo.href}>
                                        {demo.cta} <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                ) : (
                                    demo.cta
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </section>
        </div>
    );
}
