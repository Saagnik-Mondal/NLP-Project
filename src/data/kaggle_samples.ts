
export type SampleData = {
    label: string;
    text: string;
    source: string;
};

export const KAGGLE_SAMPLES: Record<string, SampleData[]> = {
    sentiment: [
        {
            label: "Movie Review (Positive)",
            text: "This movie was absolutely wonderful. The acting was superb and the plot kept me on the edge of my seat. A definite must-watch for everyone!",
            source: "IMDB Dataset"
        },
        {
            label: "Movie Review (Negative)",
            text: "I wasted two hours of my life on this garbage. The script was terrible, the characters were flat, and the directing was amateurish at best.",
            source: "IMDB Dataset"
        },
        {
            label: "Customer Support (Neutral)",
            text: "I asked for a refund three days ago and I am still waiting for a response from your support team.",
            source: "Twitter US Airline Sentiment"
        }
    ],
    emotion: [
        {
            label: "Social Post (Joy)",
            text: "I just got promoted at work! I am so incredibly happy and proud of myself right now! #blessed",
            source: "Emotion Dataset (Twitter)"
        },
        {
            label: "Social Post (Anger)",
            text: "Why does the internet always go down when I need it the most? This service is absolutely pathetic.",
            source: "Emotion Dataset (Twitter)"
        },
        {
            label: "Social Post (Sadness)",
            text: "It feels like everything is falling apart. I don't know how much more of this I can take.",
            source: "Emotion Dataset (Twitter)"
        }
    ],
    summary: [
        {
            label: "Tech Article",
            text: "Artificial intelligence (AI) is intelligence demonstrated by machines, as opposed to the natural intelligence displayed by humans or animals. Leading AI textbooks define the field as the study of 'intelligent agents': any system that perceives its environment and takes actions that maximize its chance of achieving its goals. Some popular accounts use the term 'artificial intelligence' to describe machines that mimic 'cognitive' functions that humans associate with the human mind, such as 'learning' and 'problem solving'. However, this definition is rejected by major AI researchers. AI applications include advanced web search engines (e.g., Google), recommendation systems (used by YouTube, Amazon and Netflix), understanding human speech (such as Siri and Alexa), self-driving cars (e.g., Tesla), automated decision-making and competing at the highest level in strategic game systems (such as chess and Go).",
            source: "BBC News Dataset"
        },
        {
            label: "Science Article",
            text: "The International Space Station (ISS) is a modular space station (habitable artificial satellite) in low Earth orbit. It is a multinational collaborative project involving five participating space agencies: NASA (United States), Roscosmos (Russia), JAXA (Japan), ESA (Europe), and CSA (Canada). The ownership and use of the space station is established by intergovernmental treaties and agreements. The station serves as a microgravity and space environment research laboratory in which scientific research is conducted in astrobiology, astronomy, meteorology, physics, and other fields. The ISS is suited for the testing of spacecraft systems and equipment required for possible future long-duration missions to the Moon and Mars.",
            source: "Wikipedia"
        }
    ]
};
