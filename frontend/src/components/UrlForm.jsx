import { useState } from "react";
import api from "../services/api";

function UrlForm({ setResult }) {
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidUrl = (value) => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!url.trim()) {
      alert("Please enter a URL");
      return;
    }

    if (!isValidUrl(url)) {
      alert("Please enter a valid URL");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/shorten", {
        originalUrl: url,
        customAlias: alias,
      });

      setResult(res.data);

      alert("URL Shortened Successfully!");

      setUrl("");
      setAlias("");
    } catch (err) {
      console.error(err.response?.data || err.message);

      alert(
        err.response?.data?.error || "Something went wrong!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-2xl p-8 shadow-xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <input
          type="text"
          placeholder="Paste your long URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full rounded-xl bg-slate-900 border border-slate-700 px-5 py-4 outline-none focus:border-blue-500"
        />

        <input
          type="text"
          placeholder="Custom Alias (optional)"
          value={alias}
          onChange={(e) => setAlias(e.target.value)}
          className="w-full rounded-xl bg-slate-900 border border-slate-700 px-5 py-4 outline-none focus:border-blue-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed py-4 rounded-xl font-semibold transition"
        >
          {loading ? "Shortening..." : "Shorten URL"}
        </button>
      </form>
    </div>
  );
}

export default UrlForm;