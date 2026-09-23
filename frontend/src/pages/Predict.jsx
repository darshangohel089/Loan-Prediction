import { useState } from 'react'
import toast from 'react-hot-toast'
import PredictionForm from '../components/PredictionForm'
import PredictionResult from '../components/PredictionResult'
import { predictSingle, predictAll } from '../api/axios'
import { BrainCircuit } from 'lucide-react'

export default function Predict() {
  const [loading, setLoading]     = useState(false)
  const [result, setResult]       = useState(null)
  const [allResults, setAllResults] = useState(null)
  const [inputSummary, setInputSummary] = useState(null)
  const [mode, setMode] = useState(null)   // 'single' | 'all'

  const handleSingle = async (payload) => {
    setLoading(true)
    setResult(null)
    setAllResults(null)
    try {
      const res = await predictSingle(payload)
      setResult(res.data.result)
      setInputSummary(res.data.input_summary)
      setMode('single')
      toast.success('Prediction complete!')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAll = async (payload) => {
    setLoading(true)
    setResult(null)
    setAllResults(null)
    try {
      const res = await predictAll(payload)
      setAllResults(res.data.results)
      setInputSummary(res.data.input_summary)
      setMode('all')
      toast.success('All models compared!')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <BrainCircuit className="text-blue-600" size={22} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Loan Default Prediction</h1>
          <p className="text-sm text-gray-500">Fill in the applicant's details and select a model to predict</p>
        </div>
      </div>

      {/* Form */}
      <PredictionForm
        onSubmit={handleSingle}
        onSubmitAll={handleAll}
        loading={loading}
      />

      {/* Results */}
      {(result || allResults) && (
        <PredictionResult
          result={mode === 'single' ? result : null}
          allResults={mode === 'all' ? allResults : null}
          inputSummary={inputSummary}
        />
      )}
    </div>
  )
}
