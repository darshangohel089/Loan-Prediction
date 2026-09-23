import { CheckCircle, XCircle, TrendingUp, TrendingDown } from 'lucide-react'

function ProbBar({ label, value, color }) {
  const pct = Math.round((value ?? 0) * 100)
  return (
    <div>
      <div className="flex justify-between text-xs text-gray-600 mb-1">
        <span>{label}</span>
        <span className="font-semibold">{pct}%</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2.5">
        <div
          className="h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}

function SingleResult({ result }) {
  const isDefault = result.prediction === 1
  const hasProbability = result.confidence !== null && result.confidence !== undefined

  return (
    <div className={`rounded-xl border-2 p-5 ${isDefault
      ? 'border-red-200 bg-red-50'
      : 'border-green-200 bg-green-50'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {isDefault
            ? <XCircle size={22} className="text-red-500" />
            : <CheckCircle size={22} className="text-green-500" />}
          <span className="font-semibold text-gray-700 text-sm">
            {result.model_label}
          </span>
        </div>
        <span className={`text-lg font-bold ${isDefault ? 'text-red-600' : 'text-green-600'}`}>
          {result.prediction_label}
        </span>
      </div>

      {hasProbability && (
        <div className="space-y-2">
          <ProbBar
            label="No Default probability"
            value={result.no_default_probability}
            color="#22c55e"
          />
          <ProbBar
            label="Default probability"
            value={result.default_probability}
            color="#ef4444"
          />
        </div>
      )}
      {!hasProbability && (
        <p className="text-xs text-gray-500">This model does not output probabilities.</p>
      )}
    </div>
  )
}

export default function PredictionResult({ result, allResults, inputSummary }) {
  // Show all-model results if available, else single result
  const results = allResults ?? (result ? [result] : [])

  if (!results.length) return null

  const defaultCount = results.filter(r => r.prediction === 1).length
  const noDefaultCount = results.length - defaultCount
  const isMulti = results.length > 1

  return (
    <div className="space-y-5 mt-6">
      {/* Header banner */}
      {isMulti && (
        <div className="card flex items-center gap-4 bg-blue-50 border border-blue-100">
          <TrendingUp className="text-blue-500" size={20} />
          <div>
            <p className="font-semibold text-gray-800">All Models Comparison</p>
            <p className="text-sm text-gray-500">
              {noDefaultCount} model(s) predicted <span className="text-green-600 font-medium">No Default</span>,{' '}
              {defaultCount} predicted <span className="text-red-600 font-medium">Default</span>
            </p>
          </div>
        </div>
      )}

      {/* Individual results */}
      <div className={isMulti ? 'grid grid-cols-1 sm:grid-cols-2 gap-4' : ''}>
        {results.map((r) => (
          <SingleResult key={r.model_name} result={r} />
        ))}
      </div>

      {/* Input summary */}
      {inputSummary && (
        <details className="card cursor-pointer">
          <summary className="font-medium text-gray-700 text-sm list-none flex items-center justify-between">
            <span>Input Summary</span>
            <span className="text-blue-500 text-xs">Click to expand ▾</span>
          </summary>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.entries(inputSummary).map(([k, v]) => (
              <div key={k} className="bg-gray-50 rounded-lg p-2.5">
                <p className="text-xs text-gray-500 capitalize">
                  {k.replace(/_/g, ' ')}
                </p>
                <p className="text-sm font-medium text-gray-800 truncate">{String(v)}</p>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  )
}
