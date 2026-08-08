function ResultCard({ result }) {
  if (!result) return null;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(result.shortUrl);
      alert("Copied!");
    } catch (err) {
      alert("Failed to copy.");
    }
  };

  return (
    <div className="bg-slate-800 rounded-2xl p-6 shadow-lg">
      <h2 className="text-xl font-semibold mb-5">
        Shortened URL
      </h2>

      <div className="bg-slate-900 rounded-xl p-5 flex justify-between items-center gap-4">
        <div className="flex-1">
          <p className="text-slate-400 text-sm break-all">
            {result.originalUrl}
          </p>

          <a
            href={result.shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 mt-2 block break-all hover:underline"
          >
            {result.shortUrl}
          </a>
        </div>

        <button
          onClick={copyToClipboard}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
        >
          Copy
        </button>
      </div>
    </div>
  );
}

export default ResultCard;