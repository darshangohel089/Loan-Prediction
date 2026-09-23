import { useEffect, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, RadarChart, PolarGrid,
  PolarAngleAxis, Radar
} from 'recharts'
import { getModels } from '../api/axios'
import ModelCard from '../components/ModelCard'
import ConfusionMatrix from '../components/ConfusionMatrix'
import { BarChart3, Loader2 } from 'lucide-react'

const METRIC_COLORS = {
  accuracy:  '#3b82f6',
  precision: '#8b5cf6',
  recall:    '#f97316',
  f1_score:  '#14b8a6',
}

export default function ModelComparison() {
  const [models, setModels]   = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    getModels()
      .then(r => {
        setModels(r.data)
        setSelected(r.data[0]?.key ?? null)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    )
  }

  // Bar chart data
  const barData = models.map(m => ({
    name: m.name.replace('K-Nearest Neighbors (k=5)', 'KNN').replace('Logistic Regression', 'LR').replace('Naive Bayes', 'NB').replace('Decision Tree', 'DT'),
    Accuracy:  +(m.accuracy  * 100).toFixed(2),
    Precision: +(m.precision * 100).toFixed(2),
    Recall:    +(m.recall    * 100).toFixed(2),
    'F1-Score':+(m.f1_score  * 100).toFixed(2),
  }))

  // Radar data
  const radarData = [
    { metric: 'Accuracy',  ...Object.fromEntries(models.map(m => [m.name.split(' ')[0], +(m.accuracy * 100).toFixed(1)])) },
    { metric: 'Precision', ...Object.fromEntries(models.map(m => [m.name.split(' ')[0], +(m.precision * 100).toFixed(1)])) },
    { metric: 'Recall',    ...Object.fromEntries(models.map(m => [m.name.split(' ')[0], +(m.recall * 100).toFixed(1)])) },
    { metric: 'F1-Score',  ...Object.fromEntries(models.map(m => [m.name.split(' ')[0], +(m.f1_score * 100).toFixed(1)])) },
  ]

  const RADAR_COLORS = ['#3b82f6', '#8b5cf6', '#f97316', '#14b8a6']

  const selectedModel = models.find(m => m.key === selected)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-100 rounded-lg">
          <BarChart3 className="text-purple-600" size={22} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Model Comparison</h1>
          <p className="text-sm text-gray-500">
            Compare all 4 classification models from your notebook
          </p>
        </div>
      </div>

      {/* Model cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {models.map(m => <ModelCard key={m.key} model={m} />)}
      </div>

      {/* Bar chart */}
      <div className="card mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Metrics Comparison (Bar Chart)
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 12 }}
              tickFormatter={v => `${v}%`} />
            <Tooltip formatter={(v) => `${v}%`} />
            <Legend />
            <Bar dataKey="Accuracy"  fill={METRIC_COLORS.accuracy}  radius={[3,3,0,0]} />
            <Bar dataKey="Precision" fill={METRIC_COLORS.precision} radius={[3,3,0,0]} />
            <Bar dataKey="Recall"    fill={METRIC_COLORS.recall}    radius={[3,3,0,0]} />
            <Bar dataKey="F1-Score"  fill={METRIC_COLORS.f1_score}  radius={[3,3,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Confusion matrices */}
      <div className="card mb-8">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h2 className="text-lg font-semibold text-gray-800">Confusion Matrix</h2>
          <div className="flex gap-2 flex-wrap">
            {models.map(m => (
              <button
                key={m.key}
                onClick={() => setSelected(m.key)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  selected === m.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {m.name.replace('K-Nearest Neighbors (k=5)', 'KNN')}
              </button>
            ))}
          </div>
        </div>
        {selectedModel && (
          <div className="max-w-sm mx-auto">
            <p className="text-center text-sm text-gray-500 mb-2">
              Test set: ~51,070 samples
            </p>
            <ConfusionMatrix matrix={selectedModel.confusion_matrix} />
          </div>
        )}
      </div>

      {/* Full metrics table */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Detailed Metrics Table</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['Model', 'Accuracy', 'Precision', 'Recall', 'F1-Score'].map(h => (
                  <th key={h} className="text-left py-2 px-4 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {models.map(m => (
                <tr key={m.key} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-800">{m.name}</td>
                  <td className="py-3 px-4 text-gray-700">{(m.accuracy  * 100).toFixed(2)}%</td>
                  <td className="py-3 px-4 text-gray-700">{(m.precision * 100).toFixed(2)}%</td>
                  <td className="py-3 px-4 text-gray-700">{(m.recall    * 100).toFixed(2)}%</td>
                  <td className="py-3 px-4 text-gray-700">{(m.f1_score  * 100).toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-3">
          Metrics computed on 20% test split (random_state=42) as in the original notebook.
        </p>
      </div>
    </div>
  )
}
