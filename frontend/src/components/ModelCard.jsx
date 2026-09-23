import { TrendingUp } from 'lucide-react'

const METRIC_COLORS = {
  accuracy:  'bg-blue-500',
  precision: 'bg-purple-500',
  recall:    'bg-orange-500',
  f1_score:  'bg-teal-500',
}

function MetricBar({ label, value, colorClass }) {
  const pct = Math.round(value * 100)
  return (
    <div>
      <div className="flex justify-between text-xs text-gray-600 mb-1">
        <span>{label}</span>
        <span className="font-semibold">{(value * 100).toFixed(2)}%</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${colorClass} transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

export default function ModelCard({ model }) {
  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp size={18} className="text-blue-500" />
        <h3 className="font-semibold text-gray-800">{model.name}</h3>
      </div>
      <div className="space-y-3">
        <MetricBar label="Accuracy"  value={model.accuracy}  colorClass={METRIC_COLORS.accuracy} />
        <MetricBar label="Precision" value={model.precision} colorClass={METRIC_COLORS.precision} />
        <MetricBar label="Recall"    value={model.recall}    colorClass={METRIC_COLORS.recall} />
        <MetricBar label="F1-Score"  value={model.f1_score}  colorClass={METRIC_COLORS.f1_score} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 text-center">
        {[
          ['Accuracy',  model.accuracy],
          ['Precision', model.precision],
          ['Recall',    model.recall],
          ['F1-Score',  model.f1_score],
        ].map(([label, val]) => (
          <div key={label} className="bg-gray-50 rounded-lg py-2">
            <p className="text-[10px] text-gray-500 uppercase tracking-wide">{label}</p>
            <p className="text-sm font-bold text-gray-800">{(val * 100).toFixed(2)}%</p>
          </div>
        ))}
      </div>
    </div>
  )
}
