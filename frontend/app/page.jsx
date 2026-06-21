"use client";
import { useState } from "react";

export default function Home() {
  const [step, setStep] = useState("upload"); // 'upload', 'interview', 'summary'
  const [role, setRole] = useState("AI/ML Engineer");
  const [file, setFile] = useState(null);
  const [sessionId, setSessionId] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState([]);
  const [questionCount, setQuestionCount] = useState(0);

  const startInterview = async () => {
    if (!file) return alert("Please upload a resume first");
    setIsLoading(true);
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("role", role);

    const res = await fetch("http://localhost:8000/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    setSessionId(data.session_id);
    
    await fetchNextQuestion(data.session_id);
    setStep("interview");
    setIsLoading(false);
  };

  const fetchNextQuestion = async (id) => {
    setIsLoading(true);
    const res = await fetch(`http://localhost:8000/api/question/${id}`);
    const data = await res.json();
    setQuestion(data.question);
    setIsLoading(false);
  };

  const submitAnswer = async () => {
    setIsLoading(true);
    await fetch("http://localhost:8000/api/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId, answer })
    });
    
    setAnswer("");
    const newCount = questionCount + 1;
    setQuestionCount(newCount);

    // End interview after 3 questions
    if (newCount >= 3) {
      const res = await fetch(`http://localhost:8000/api/summary/${sessionId}`);
      const data = await res.json();
      setSummary(data.summary);
      setStep("summary");
    } else {
      await fetchNextQuestion(sessionId);
    }
    setIsLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-100 p-10 font-sans text-gray-900">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        
        {step === "upload" && (
          <div className="space-y-6">
            <h1 className="text-3xl font-extrabold tracking-tight">AI Interview Setup</h1>
            <div>
              <label className="block text-sm font-semibold mb-2">Target Role</label>
              <select className="w-full border p-3 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500" value={role} onChange={e => setRole(e.target.value)}>
                <option>AI/ML Engineer</option>
                <option>Backend Engineer</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Upload Resume (PDF)</label>
              <input type="file" accept=".pdf" className="w-full border p-3 rounded-lg bg-gray-50" onChange={e => setFile(e.target.files[0])} />
            </div>
            <button onClick={startInterview} disabled={isLoading} className="w-full bg-blue-600 text-white font-bold p-3 rounded-lg hover:bg-blue-700 transition">
              {isLoading ? "Processing Pipeline..." : "Start Interview"}
            </button>
          </div>
        )}

        {step === "interview" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-2xl font-bold">Technical Evaluation</h2>
              <span className="text-sm font-semibold bg-blue-100 text-blue-800 py-1 px-3 rounded-full">Question {questionCount + 1} of 3</span>
            </div>
            
            {isLoading ? (
              <div className="animate-pulse flex flex-col space-y-4 py-8">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                <p className="text-sm text-gray-500 italic mt-4">Generative AI is reviewing context...</p>
              </div>
            ) : (
              <p className="text-lg leading-relaxed font-medium">{question}</p>
            )}

            <textarea 
              className="w-full border p-4 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500" 
              rows="5" 
              placeholder="Construct your answer here..." 
              value={answer} 
              onChange={e => setAnswer(e.target.value)} 
              disabled={isLoading} 
            />
            <button onClick={submitAnswer} disabled={isLoading || !answer.trim()} className="w-full bg-green-600 text-white font-bold p-3 rounded-lg hover:bg-green-700 transition">
              Submit Response
            </button>
          </div>
        )}

        {step === "summary" && (
          <div className="space-y-8">
            <h2 className="text-3xl font-extrabold border-b pb-4">Session Summary</h2>
            {summary.map((item, idx) => (
              <div key={idx} className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
                <p className="font-bold text-gray-800 mb-3">Q: {item.question}</p>
                <p className="text-gray-600"><strong>A:</strong> {item.answer}</p>
              </div>
            ))}
            <button onClick={() => window.location.reload()} className="w-full bg-gray-800 text-white font-bold p-3 rounded-lg hover:bg-gray-900 transition">
              Start New Session
            </button>
          </div>
        )}

      </div>
    </main>
  );
}