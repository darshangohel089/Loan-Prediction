import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BrainCircuit, Database, BarChart3, History,
  TrendingUp, Users, CheckCircle2, AlertTriangle
} from 'lucide-react'
import { getModels, getHistoryCount } from '../api/axios'

const BEST_MODEL = {
  name: 'Logistic Regression',
  accuracy: '88.59%',
}

function StatCard({ icon: Icon, label, value, color, sub }) {
  return (
    <div className="card flex items-start gap-4">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <p className="text-sm font-medium text-gray-600">{label}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

function QuickAction({ icon: Icon, label, to, color }) {
  return (
    <Link
      to={to}
      className={`flex flex-col items-center gap-2 p-5 rounded-xl border-2 
                  hover:shadow-md transition-all duration-200 ${color} group`}
    >
      <Icon size={28} className="transition-transform group-hover:scale-110" />
      <span className="text-sm font-semibold">{label}</span>
    </Link>
  )
}

export default function Dashboard() {
  const [historyCount, setHistoryCount] = useState('—')

  useEffect(() => {
    getHistoryCount()
      .then(r => setHistoryCount(r.data.count))
      .catch(() => setHistoryCount('—'))
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-500 rounded-2xl text-white p-8 mb-8 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">LoanGuard</h1>
            <p className="text-blue-100 max-w-xl">
              An ML-powered loan default prediction system using Logistic Regression,
              Decision Tree, KNN, and Naive Bayes classifiers trained on 255,347 loan records.
            </p>
          </div>
          <Link to="/predict"
            className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg 
                       hover:bg-blue-50 transition-colors whitespace-nowrap shadow">
            Predict Now →
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard icon={Database} label="Dataset Records"  value="255,347"
          color="bg-blue-500"   sub="Loan_default.csv" />
        <StatCard icon={BrainCircuit} label="ML Models"   value="4"
          color="bg-purple-500" sub="LR · DT · KNN · NB" />
        <StatCard icon={TrendingUp} label="Best Accuracy"  value={BEST_MODEL.accuracy}
          color="bg-green-500"  sub={BEST_MODEL.name} />
        <StatCard icon={History} label="Total Predictions" value={historyCount}
          color="bg-orange-500" sub="Since app started" />
      </div>

      {/* Quick actions */}
      <div className="card mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <QuickAction icon={BrainCircuit} label="New Prediction"
            to="/predict" color="border-blue-200 text-blue-600 hover:border-blue-400" />
          <QuickAction icon={BarChart3} label="Compare Models"
            to="/compare" color="border-purple-200 text-purple-600 hover:border-purple-400" />
          <QuickAction icon={Database} label="Statistics"
            to="/statistics" color="border-green-200 text-green-600 hover:border-green-400" />
          <QuickAction icon={History} label="View History"
            to="/history" color="border-orange-200 text-orange-600 hover:border-orange-400" />
        </div>
      </div>

      {/* Model summary table */}
      <div className="card mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Model Performance Summary</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['Model', 'Accuracy', 'Precision', 'Recall', 'F1-Score', 'Status'].map(h => (
                  <th key={h} className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[
                ['Logistic Regression', '88.59', '62.03', '3.10',  '5.91',  true],
                ['Decision Tree',       '80.25', '19.72', '23.12', '21.29', false],
                ['KNN (k=5)',           '87.57', '32.53', '7.08',  '11.64', false],
                ['Naive Bayes',         '88.54', '66.43', '1.58',  '3.08',  false],
              ].map(([name, acc, prec, rec, f1, isBest]) => (
                <tr key={name} className={isBest ? 'bg-blue-50' : 'hover:bg-gray-50'}>
                  <td className="py-2.5 px-3 font-medium text-gray-800">
                    {name} {isBest && <span className="ml-1 text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded-full">BEST</span>}
                  </td>
                  <td className="py-2.5 px-3 text-gray-700">{acc}%</td>
                  <td className="py-2.5 px-3 text-gray-700">{prec}%</td>
                  <td className="py-2.5 px-3 text-gray-700">{rec}%</td>
                  <td className="py-2.5 px-3 text-gray-700">{f1}%</td>
                  <td className="py-2.5 px-3">
                    {isBest
                      ? <span className="badge-no-default"><CheckCircle2 size={10} className="mr-1" />Best</span>
                      : <span className="badge-default"><AlertTriangle size={10} className="mr-1" />Lower</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="card bg-green-50 border border-green-100">
          <CheckCircle2 className="text-green-500 mb-2" size={20} />
          <h3 className="font-semibold text-gray-800">No Default (Class 0)</h3>
          <p className="text-sm text-gray-500 mt-1">Loan repaid successfully. Approx. 78% of dataset.</p>
        </div>
        <div className="card bg-red-50 border border-red-100">
          <AlertTriangle className="text-red-500 mb-2" size={20} />
          <h3 className="font-semibold text-gray-800">Default (Class 1)</h3>
          <p className="text-sm text-gray-500 mt-1">Loan defaulted. Approx. 22% of dataset.</p>
        </div>
        <div className="card bg-blue-50 border border-blue-100">
          <Users className="text-blue-500 mb-2" size={20} />
          <h3 className="font-semibold text-gray-800">16 Input Features</h3>
          <p className="text-sm text-gray-500 mt-1">Age, income, credit score, DTI ratio, employment, and more.</p>
        </div>
      </div>
    </div>
  )
}
