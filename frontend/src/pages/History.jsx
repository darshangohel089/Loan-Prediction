import { useEffect, useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import { getHistory, deleteHistory, clearHistory } from '../api/axios'
import { History as HistoryIcon, Trash2, RefreshCw, Loader2, XCircle, CheckCircle } from 'lucide-react'

const MODEL_LABELS = {
  logistic_regression: 'Logistic Regression',
  decision_tree:       'Decision Tree',
  knn:                 'KNN (k=5)',
  naive_bayes:         'Naive Bayes',
}

function formatDate(iso) {
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function History() {
  const [records, setRecords]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [expanded, setExpanded] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getHistory(0, 100)
      setRecords(res.data)
    } catch (err) {
      toast.error('Failed to load history')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const handleDelete = async (id) => {
    try {
      await deleteHistory(id)
      setRecords(prev => prev.filter(r => r.id !== id))
      toast.success('Record deleted')
    } catch {
      toast.error('Delete failed')
    }
  }

  const handleClear = async () => {
    if (!window.confirm('Clear all prediction history? This cannot be undone.')) return
    try {
      await clearHistory()
      setRecords([])
      toast.success('History cleared')
    } catch {
      toast.error('Clear failed')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <HistoryIcon className="text-orange-600" size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Prediction History</h1>
            <p className="text-sm text-gray-500">
              {records.length} record{records.length !== 1 ? 's' : ''} stored
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={load}
            className="btn-secondary flex items-center gap-2 text-sm py-2">
            <RefreshCw size={14} /> Refresh
          </button>
          {records.length > 0 && (
            <button onClick={handleClear}
              className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg
                         bg-red-50 text-red-600 border border-red-200 hover:bg-red-100
                         transition-colors font-medium">
              <Trash2 size={14} /> Clear All
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="animate-spin text-blue-500" size={32} />
        </div>
      ) : records.length === 0 ? (
        <div className="card text-center py-16">
          <HistoryIcon size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 font-medium">No predictions yet</p>
          <p className="text-gray-400 text-sm mt-1">
            Go to the Predict page to make your first loan default prediction.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map((r) => (
            <div key={r.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                {/* Left info */}
                <div className="flex items-center gap-3">
                  {r.prediction === 1
                    ? <XCircle size={20} className="text-red-500 flex-shrink-0" />
                    : <CheckCircle size={20} className="text-green-500 flex-shrink-0" />}
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-base font-semibold ${
                        r.prediction === 1 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {r.prediction_label}
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {MODEL_LABELS[r.model_used] ?? r.model_used}
                      </span>
                      {r.confidence !== null && r.confidence !== undefined && (
                        <span className="text-xs text-gray-400">
                          {(r.confidence * 100).toFixed(1)}% confidence
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{formatDate(r.created_at)}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                    className="text-xs text-blue-500 hover:text-blue-700 font-medium"
                  >
                    {expanded === r.id ? 'Hide ▴' : 'Details ▾'}
                  </button>
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 
                               rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Expanded input features */}
              {expanded === r.id && r.input_features && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    Input Features
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {Object.entries(r.input_features).map(([k, v]) => (
                      <div key={k} className="bg-gray-50 rounded-lg p-2">
                        <p className="text-[10px] text-gray-400 capitalize">
                          {k.replace(/_/g, ' ')}
                        </p>
                        <p className="text-xs font-semibold text-gray-700">{String(v)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
