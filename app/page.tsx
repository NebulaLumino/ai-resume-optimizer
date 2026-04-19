"use client";
import { useState } from "react";

export default function Home() {
  const [resume, setResume] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOutput("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Optimize this resume for the following job description:\n\n=== RESUME ===\n${resume}\n\n=== JOB DESCRIPTION ===\n${jobDesc}`,
        }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      setOutput(d.text);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-3xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
            AI Resume Optimizer
          </h1>
          <p className="text-gray-400 text-lg">Match your resume to any job with AI-powered keyword optimization</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Your Resume (paste text)</label>
              <textarea value={resume} onChange={e=>setResume(e.target.value)} rows={10} placeholder="Paste the full text of your resume here (or copy-paste from PDF/Word)..." className="w-full bg-gray-900/80 border border-gray-600 rounded-lg p-4 text-gray-100 placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-xs"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Job Description</label>
              <textarea value={jobDesc} onChange={e=>setJobDesc(e.target.value)} rows={8} placeholder="Paste the complete job description here..." className="w-full bg-gray-900/80 border border-gray-600 rounded-lg p-4 text-gray-100 placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"/>
            </div>
          </div>

          <button type="submit" disabled={loading || !resume || !jobDesc} className="w-full py-3 px-6 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2">
            {loading ? <><svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Analyzing & optimizing...</> : "Optimize My Resume"}
          </button>
        </form>

        {error && <div className="bg-red-900/30 border border-red-700 rounded-xl p-4 text-red-300 text-sm">{error}</div>}
        {output && <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6"><h2 className="text-lg font-semibold text-gray-200 mb-3">Optimization Report & Rewritten Resume</h2><div className="text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">{output}</div></div>}
      </div>
    </main>
  );
}
