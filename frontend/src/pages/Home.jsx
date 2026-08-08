import { useState } from "react";
import Navbar from "../components/Navbar";
import UrlForm from "../components/UrlForm";
import ResultCard from "../components/ResultCard";

function Home() {
  const [result, setResult] = useState(null);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-14">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold">
            URL <span className="text-blue-500">Shortener</span>
          </h1>

          <p className="text-slate-400 mt-4 text-lg">
            Shorten, manage and share your links instantly.
          </p>
        </div>

        <UrlForm setResult={setResult} />

        {result && (
          <div className="mt-10">
            <ResultCard result={result} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;