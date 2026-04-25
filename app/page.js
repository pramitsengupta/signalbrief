"use client";

import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  return (
    
    <main className="min-h-screen bg-[#0f0f0f] text-white px-6 py-16">
      
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-10">
      <h1 className="text-5xl font-semibold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          SignalBrief
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
            console.log("START");
          
            setLoading(true);
          
            const res = await fetch("/api/generate", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ input }),
            });
          
            console.log("RESPONSE", res);
          
            const data = await res.json();   // 🔥 THIS IS MISSING
          
            console.log("DATA", data);
          
            try {
              setResult(JSON.parse(data.result));
            } catch (e) {
              console.error("JSON parse error:", data.result);
            }        // 🔥 THIS USES ACTUAL DATA
          
            setLoading(false);
          }}
          className="mt-5 w-full bg-white text-black py-3 rounded-lg font-medium hover:opacity-90 active:scale-[0.98] transition"
        >
          {loading ? "Generating..." : "Generate Signals"}
        </button>
      </div>
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