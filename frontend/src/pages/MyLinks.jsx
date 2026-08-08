import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function MyLinks() {
  const [urls, setUrls] = useState([]);

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const res = await api.get("/my-links");
        setUrls(res.data);
      } catch (err) {
        console.log(err.response?.data || err.message);
      }
    };

    fetchUrls();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold mb-10">My Links</h1>

        {urls.length === 0 ? (
          <p className="text-slate-400">No links found.</p>
        ) : (
          <div className="space-y-5">
            {urls.map((url) => (
              <div
                key={url._id}
                className="bg-slate-800 rounded-2xl p-6 flex justify-between items-center"
              >
                <div>
                  <p className="text-slate-400 break-all">
                    {url.originalUrl}
                  </p>

                  <a
                    href={url.shortUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:underline block mt-2"
                  >
                    {url.shortUrl}
                  </a>

                  <p className="text-slate-400 mt-2">
                    Clicks : {url.clicks}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(url.shortUrl);
                      alert("Copied!");
                    }}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
                  >
                    Copy
                  </button>

                  <Link
                    to={`/analytics/${url.customAlias || url.shortId}`}
                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg"
                  >
                    Analytics
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyLinks;