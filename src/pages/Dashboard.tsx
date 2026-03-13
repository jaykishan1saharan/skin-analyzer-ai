import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Camera, Activity, Droplets, Sun, AlertCircle, ArrowRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard({ user }: { user: any }) {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/users/${user.id}/history`)
      .then(res => res.json())
      .then(data => {
        setHistory(data);
        setLoading(false);
      });
  }, [user.id]);

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-neutral-500">Loading dashboard...</div>;
  }

  const latestAnalysis = history[0];

  // Prepare chart data (reverse to show oldest to newest)
  const chartData = [...history].reverse().map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    acne: item.acne_score,
    dryness: item.dryness_score,
    oiliness: item.oiliness_score,
  }));

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-neutral-900">Hello, {user.name}</h1>
        <p className="text-neutral-500 mt-1">Here is your skin health overview.</p>
      </header>

      {history.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-neutral-200 shadow-sm">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Camera className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-semibold text-neutral-900 mb-2">No Analysis Yet</h2>
          <p className="text-neutral-500 mb-6 max-w-md mx-auto">
            Start your skincare journey by taking your first skin analysis. We'll use AI to detect conditions and recommend products.
          </p>
          <Link
            to="/new-analysis"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            <Camera className="w-5 h-5" />
            Analyze My Skin
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm col-span-1 md:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-neutral-900">Latest Analysis</h2>
                <span className="text-sm text-neutral-500">{new Date(latestAnalysis.date).toLocaleDateString()}</span>
              </div>
              
              <div className="flex gap-6 items-start">
                <div className="w-32 h-32 rounded-xl overflow-hidden bg-neutral-100 shrink-0">
                  <img src={latestAnalysis.image_path} alt="Latest scan" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-1">
                  <p className="text-neutral-700 mb-4">{latestAnalysis.overall_condition}</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-neutral-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-neutral-500 mb-1">
                        <AlertCircle className="w-4 h-4" /> Acne
                      </div>
                      <div className="text-xl font-semibold text-neutral-900">{latestAnalysis.acne_score}/10</div>
                    </div>
                    <div className="bg-neutral-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-neutral-500 mb-1">
                        <Droplets className="w-4 h-4" /> Dryness
                      </div>
                      <div className="text-xl font-semibold text-neutral-900">{latestAnalysis.dryness_score}/10</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-emerald-600 text-white p-6 rounded-2xl shadow-sm flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-semibold mb-2">Ready for a checkup?</h2>
                <p className="text-emerald-100 text-sm mb-6">Track your progress by taking a new photo today.</p>
              </div>
              <Link
                to="/new-analysis"
                className="bg-white text-emerald-700 hover:bg-emerald-50 px-4 py-3 rounded-xl font-medium text-center transition-colors flex items-center justify-center gap-2"
              >
                <Camera className="w-5 h-5" />
                New Analysis
              </Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-neutral-900">Skin Progress</h2>
              <Link to="/history" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#737373', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#737373', fontSize: 12 }} domain={[0, 10]} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line type="monotone" dataKey="acne" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} name="Acne" />
                  <Line type="monotone" dataKey="dryness" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} name="Dryness" />
                  <Line type="monotone" dataKey="oiliness" stroke="#eab308" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} name="Oiliness" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Recommended Routine</h2>
            <ul className="space-y-3">
              {latestAnalysis.recommendations.map((rec: string, idx: number) => (
                <li key={idx} className="flex items-start gap-3 bg-neutral-50 p-4 rounded-xl">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 text-sm font-bold mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="text-neutral-700">{rec}</p>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
