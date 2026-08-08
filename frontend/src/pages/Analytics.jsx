import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

function Analytics() {
  const { id } = useParams();

  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get(`/analytics/${id}`);
        setData(res.data);
      } catch (err) {
        console.log(err.response?.data || err.message);
      }
    };

    fetchAnalytics();
  }, [id]);

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-10">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-3xl mx-auto p-10">
        <h1 className="text-4xl font-bold mb-8">
          URL Analytics
        </h1>

        <div className="bg-slate-800 rounded-2xl p-8 space-y-5">

          <div>
            <p className="text-slate-400">Original URL</p>
            <p>{data.originalUrl}</p>
          </div>

          <div>
            <p className="text-slate-400">Short URL</p>
            <a
              href={data.shortUrl}
              target="_blank"
              rel="noreferrer"
              className="text-blue-400 hover:underline"
            >
              {data.shortUrl}
            </a>
          </div>

          <div>
            <p className="text-slate-400">Clicks</p>
            <p>{data.clicks}</p>
          </div>

          <div>
            <p className="text-slate-400">Custom Alias</p>
            <p>{data.customAlias || "Not Used"}</p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Analytics;