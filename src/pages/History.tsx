import { useState, useEffect } from 'react';
import { Calendar, ChevronRight, Activity } from 'lucide-react';

export default function History({ user }: { user: any }) {
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
    return <div className="flex items-center justify-center h-64 text-neutral-500">Loading history...</div>;
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-neutral-900">Analysis History</h1>
        <p className="text-neutral-500 mt-1">Review your past skin analyses and track your progress over time.</p>
      </header>

      {history.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-neutral-200 shadow-sm">
          <div className="w-16 h-16 bg-neutral-50 text-neutral-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <Activity className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-semibold text-neutral-900 mb-2">No History Found</h2>
          <p className="text-neutral-500 max-w-md mx-auto">
            You haven't completed any skin analyses yet. Take your first photo to start tracking your skin health.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {history.map((record) => (
            <div key={record.id} className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-900">
                        {new Date(record.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </h3>
                      <p className="text-sm text-neutral-500">
                        {new Date(record.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <button className="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center gap-1">
                    View Details <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-48 h-48 rounded-xl overflow-hidden bg-neutral-100 shrink-0">
                    <img src={record.image_path} alt="Scan" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <p className="text-neutral-700 font-medium">{record.overall_condition}</p>
                    
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                      {[
                        { label: 'Acne', score: record.acne_score, color: 'text-red-600', bg: 'bg-red-50' },
                        { label: 'Dryness', score: record.dryness_score, color: 'text-blue-600', bg: 'bg-blue-50' },
                        { label: 'Oiliness', score: record.oiliness_score, color: 'text-yellow-600', bg: 'bg-yellow-50' },
                        { label: 'Pigment', score: record.pigmentation_score, color: 'text-purple-600', bg: 'bg-purple-50' },
                        { label: 'Wrinkles', score: record.wrinkle_score, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                        { label: 'Redness', score: record.redness_score, color: 'text-rose-600', bg: 'bg-rose-50' },
                      ].map((item) => (
                        <div key={item.label} className="text-center">
                          <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${item.bg} ${item.color} font-bold text-sm mb-1`}>
                            {item.score}
                          </div>
                          <p className="text-[10px] font-medium text-neutral-500 uppercase tracking-wider">{item.label}</p>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-neutral-100">
                      <h4 className="text-sm font-semibold text-neutral-900 mb-2">Key Recommendations:</h4>
                      <ul className="space-y-1">
                        {record.recommendations.slice(0, 2).map((rec: string, idx: number) => (
                          <li key={idx} className="text-sm text-neutral-600 flex items-start gap-2">
                            <span className="text-emerald-500 mt-0.5">•</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
