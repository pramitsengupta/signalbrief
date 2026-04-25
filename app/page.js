"use client";

import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [exampleUsed, setExampleUsed] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const getExample = (type) => {
    if (type === "product") {
      return `Product teams are increasingly shifting toward outcome-driven roadmaps instead of feature-based planning. Rather than committing to shipping specific features, teams are defining success metrics and iterating rapidly to achieve them. This has led to tighter collaboration between product, design, and engineering, with faster feedback loops and more experimentation.
  
However, this shift also creates ambiguity. Teams sometimes struggle with prioritization when clear feature definitions are absent, leading to misalignment across stakeholders. Leadership often finds it harder to track progress without tangible deliverables.

At the same time, there is a growing expectation for product managers to be more technical and hands-on, leveraging AI tools, analytics platforms, and prototyping tools to validate ideas quickly.
  
Overall, product management is evolving from roadmap ownership to problem ownership, requiring stronger judgment, adaptability, and cross-functional influence.`;
    }
  
    if (type === "tech") {
      return `The rapid advancement of AI infrastructure is reshaping how technology companies build and scale products. With the rise of large language models and cloud-native architectures, teams can now deploy intelligent features much faster than before.
  
However, this acceleration introduces new challenges. Managing costs, ensuring data privacy, and maintaining system reliability have become more complex. Many companies are facing unexpected spikes in infrastructure costs due to heavy AI usage.
  
There is also increasing fragmentation in the tech stack, with multiple tools and frameworks emerging simultaneously. This creates decision fatigue for engineering teams trying to choose the right solutions.
  
Despite these challenges, the pace of innovation continues to accelerate, and companies that can balance speed with stability are gaining a significant competitive advantage.`;
    }
  
    if (type === "finance") {
      return `The financial landscape is undergoing a transformation driven by digital platforms and changing consumer expectations. More users are adopting mobile-first banking solutions, expecting seamless experiences and real-time insights into their spending and investments.
  
At the same time, there is growing concern about financial literacy. While access to financial tools has increased, many users lack the understanding needed to make informed decisions, leading to poor investment choices or over-reliance on trends.
  
Fintech companies are responding by embedding educational content and personalized recommendations into their products. However, balancing simplicity with accuracy remains a challenge.
  
Regulatory pressures are also increasing, forcing companies to ensure transparency and compliance while continuing to innovate. This creates tension between speed and responsibility in financial product development.`;
    }
  
    if (type === "surprise") {
      return `The way people consume information is rapidly evolving, influenced by short-form content, AI-driven recommendations, and constant digital stimulation. Users are becoming accustomed to receiving highly personalized content instantly, reducing their tolerance for friction and slow experiences.
  
This shift is impacting not only entertainment platforms but also productivity tools and learning environments. Products are now expected to deliver value within seconds of engagement.
  
However, this trend raises concerns about depth and retention. While users consume more content than ever, their ability to retain and apply information may be declining.
  
Companies are beginning to explore ways to balance engagement with meaningful value, designing experiences that are both efficient and enriching. This tension between speed and depth is becoming a defining challenge for modern digital products.`;
    }
  };
  

  return (
    
    <main className="min-h-screen bg-[#0f0f0f] text-white px-6 py-16">
      
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-10">
      <h1 className="text-5xl font-semibold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          SignalBrief — 5-min Signals for PMs
        </h1>
        <p className="text-gray-400 mt-2">
          Turn noise into insights from articles & social posts
        </p>
      </div>

      {/* Input Section */}
      <div className="max-w-2xl mx-auto bg-[#171717] border border-gray-800 rounded-xl p-5">
        
        <textarea
          placeholder="Paste LinkedIn posts, Medium articles, or URLs..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-40 bg-transparent border border-gray-700 rounded-lg p-3 text-sm outline-none focus:border-white focus:ring-1 focus:ring-white resize-none"
        />
        

        <button
  onClick={() => {
    if (!exampleUsed) {
      setInput(getExample("product"));
      setExampleUsed(true);
      setShowOptions(true);
    } else {
      setShowOptions((prev) => !prev);
    }
  }}
  className="
  mt-3 w-full flex items-center justify-center gap-2
  text-sm font-semibold text-white py-2.5 rounded-lg
  bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
  hover:opacity-90 active:scale-[0.98] transition
  shadow-md shadow-purple-500/20
"
>
  ✨ {exampleUsed ? "Try another example" : "Try example"}
</button>
{showOptions && (
  <div className="mt-3 flex gap-2 flex-wrap justify-center">
    {[
      { key: "product", label: "💼 Product" },
      { key: "tech", label: "⚙️ Tech" },
      { key: "finance", label: "💰 Finance" },
      { key: "surprise", label: "🎲 Surprise me" },
    ].map((item) => (
      <button
        key={item.key}
        onClick={() => setInput(getExample(item.key))}
        className="
          relative rounded-full p-[1px] overflow-hidden
          opacity-80 hover:opacity-100 transition
        "
      >
        <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-spin-slow opacity-50"></span>

        <span className="relative block bg-[#0f0f0f] text-gray-300 text-xs px-3 py-1 rounded-full">
          {item.label}
        </span>
      </button>
    ))}
  </div>
)}

        {/* Source Options */}
        <div className="flex gap-4 mt-4 text-sm text-gray-400">
          <label className="flex items-center gap-2">
            <input type="checkbox" />
            Medium
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" />
            Blogs
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" />
            Custom URLs
          </label>
        </div>

        {/* Button */}
        <button
  onClick={async () => {
    if (!input.trim()) {
      alert("Please enter some content");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert("Something went wrong. Try again.");
      setLoading(false);
      return;
    }

    try {
      setResult(JSON.parse(data.result));
    } catch (e) {
      console.error("JSON parse error:", data.result);
    }

    setLoading(false);
  }}
  disabled={loading}
  className="
    mt-5 w-full py-3 rounded-xl font-semibold text-white
    bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600
    hover:opacity-95 active:scale-[0.98] transition-all duration-200
    shadow-lg shadow-purple-500/20
    disabled:opacity-50 disabled:cursor-not-allowed
  "
>
  {loading ? "Generating signals..." : "Generate Signals"}
</button>
      </div>
      {!result && (
  <div className="max-w-2xl mx-auto mt-10 text-gray-500 text-sm text-center">
    Paste content above or try an example to generate insights
  </div>
)}
      {/* Output Section */}
{result && Array.isArray(result) && (
  <div className="max-w-2xl mx-auto mt-10 space-y-6">
    {result.map((item, index) => (
      <div
        key={index}
        className="bg-[#171717] border border-gray-800 rounded-xl p-5 hover:border-gray-600 transition"
      >
        <h2 className="text-lg font-semibold mb-3">
          🧠 {item.title}
        </h2>

        <div className="text-sm text-gray-300 space-y-2">
          {item.points?.map((p, i) => (
            <p key={i}>• {p}</p>
          ))}
        </div>

        {item.conflict && (
          <div className="mt-3 text-sm text-yellow-400">
            ⚔️ {item.conflict}
          </div>
        )}

        <div className="mt-3 text-sm text-green-400">
          👉 {item.implication}
        </div>
      </div>
    ))}
  </div>
)}

    </main>
  );
}