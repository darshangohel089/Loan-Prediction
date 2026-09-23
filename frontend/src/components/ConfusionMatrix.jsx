export default function ConfusionMatrix({ matrix, labels = ['No Default', 'Default'] }) {
  if (!matrix || !matrix.length) return null

  const [[tn, fp], [fn, tp]] = matrix
  const total = tn + fp + fn + tp

  const cells = [
    { label: 'True Negative',  value: tn, bg: 'bg-green-100', text: 'text-green-800', corner: 'top-left' },
    { label: 'False Positive', value: fp, bg: 'bg-red-100',   text: 'text-red-800',   corner: 'top-right' },
    { label: 'False Negative', value: fn, bg: 'bg-red-100',   text: 'text-red-800',   corner: 'bottom-left' },
    { label: 'True Positive',  value: tp, bg: 'bg-green-100', text: 'text-green-800', corner: 'bottom-right' },
  ]

  return (
    <div className="mt-3">
      {/* Header row */}
      <div className="flex justify-center mb-1">
        <div className="w-24" />
        <div className="flex-1 text-center">
          <p className="text-xs text-gray-500 font-medium mb-1">Predicted</p>
          <div className="grid grid-cols-2 gap-1">
            {labels.map(l => (
              <p key={l} className="text-xs font-semibold text-gray-600 text-center">{l}</p>
            ))}
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Y-axis label */}
        <div className="flex items-center justify-end w-24 pr-2">
          <p className="text-xs text-gray-500 font-medium -rotate-90 whitespace-nowrap">Actual</p>
        </div>

        {/* Matrix */}
        <div className="flex-1">
          <div className="grid grid-cols-2 gap-1">
            {cells.map(({ label, value, bg, text }) => (
              <div key={label}
                className={`${bg} rounded-lg p-3 text-center`}
              >
                <p className={`text-lg font-bold ${text}`}>{value.toLocaleString()}</p>
                <p className={`text-[10px] font-medium ${text} opacity-80`}>{label}</p>
                <p className="text-[10px] text-gray-500 mt-0.5">
                  {((value / total) * 100).toFixed(1)}%
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
