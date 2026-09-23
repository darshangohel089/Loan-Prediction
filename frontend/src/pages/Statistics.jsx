import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts'
import { Database } from 'lucide-react'

const CLASS_DATA = [
  { name: 'No Default (0)', value: 78, fill: '#22c55e' },
  { name: 'Default (1)',     value: 22, fill: '#ef4444' },
]

const FEATURE_DATA = [
  { feature: 'Age',            type: 'Numeric', range: '18 – 75',        example: '35' },
  { feature: 'Income',         type: 'Numeric', range: '~\$1K – \$200K',  example: '60,000' },
  { feature: 'Loan Amount',    type: 'Numeric', range: '~\$1K – \$500K',  example: '50,000' },
  { feature: 'Credit Score',   type: 'Numeric', range: '300 – 850',       example: '650' },
  { feature: 'Months Employed',type: 'Numeric', range: '0 – 120',         example: '36' },
  { feature: 'Credit Lines',   type: 'Numeric', range: '0 – 10',          example: '3' },
  { feature: 'Interest Rate',  type: 'Numeric', range: '2% – 25%',        example: '10.5%' },
  { feature: 'Loan Term',      type: 'Numeric', range: '12–60 months',    example: '36' },
  { feature: 'DTI Ratio',      type: 'Numeric', range: '0.00 – 1.00',     example: '0.35' },
  { feature: 'Education',      type: 'Categorical', range: '4 classes',   example: "Bachelor's" },
  { feature: 'Employment Type',type: 'Categorical', range: '4 classes',   example: 'Full-time' },
  { feature: 'Marital Status', type: 'Categorical', range: '3 classes',   example: 'Married' },
  { feature: 'Has Mortgage',   type: 'Binary',  range: 'Yes / No',        example: 'No' },
  { feature: 'Has Dependents', type: 'Binary',  range: 'Yes / No',        example: 'No' },
  { feature: 'Loan Purpose',   type: 'Categorical', range: '5 classes',   example: 'Home' },
  { feature: 'Has Co-Signer',  type: 'Binary',  range: 'Yes / No',        example: 'No' },
]

const PREPROCESSING_STEPS = [
  { step: '1', action: 'Load CSV',           detail: 'Read Loan_default.csv (255,347 rows)' },
  { step: '2', action: 'Drop Duplicates',    detail: 'No duplicates found in dataset' },
  { step: '3', action: 'Rename Column',      detail: 'DTIRatio → DTI_Ratio' },
  { step: '4', action: 'Drop Columns',       detail: 'LoanID, index (non-predictive)' },
  { step: '5', action: 'Label Encoding',     detail: 'Education, EmploymentType, MaritalStatus, HasMortgage, HasDependents, LoanPurpose, HasCoSigner' },
  { step: '6', action: 'Normalize Names',    detail: 'All column names lowercased' },
  { step: '7', action: 'Train-Test Split',   detail: '80% train / 20% test, random_state=42' },
  { step: '8', action: 'StandardScaler',     detail: 'Fit on train, transform both train & test' },
]

const TYPE_COLORS = {
  Numeric:     'bg-blue-100 text-blue-700',
  Categorical: 'bg-purple-100 text-purple-700',
  Binary:      'bg-green-100 text-green-700',
}

export default function Statistics() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-green-100 rounded-lg">
          <Database className="text-green-600" size={22} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dataset & Model Statistics</h1>
          <p className="text-sm text-gray-500">Overview of the Loan_default.csv dataset and preprocessing pipeline</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          ['255,347', 'Total Records'],
          ['16',      'Input Features'],
          ['2',       'Target Classes'],
          ['78 / 22%','Class Distribution'],
        ].map(([val, label]) => (
          <div key={label} className="card text-center">
            <p className="text-2xl font-bold text-blue-600">{val}</p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Class distribution pie */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Class Distribution</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={CLASS_DATA} cx="50%" cy="50%" outerRadius={80}
                   dataKey="value" label={({ name, value }) => `${value}%`}>
                {CLASS_DATA.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Preprocessing pipeline */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Preprocessing Pipeline</h2>
          <div className="space-y-2">
            {PREPROCESSING_STEPS.map(({ step, action, detail }) => (
              <div key={step} className="flex gap-3 items-start">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white 
                                text-xs flex items-center justify-center font-bold mt-0.5">
                  {step}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{action}</p>
                  <p className="text-xs text-gray-500">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feature table */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Feature Descriptions</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['Feature', 'Type', 'Range / Values', 'Example'].map(h => (
                  <th key={h} className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {FEATURE_DATA.map(({ feature, type, range, example }) => (
                <tr key={feature} className="hover:bg-gray-50">
                  <td className="py-2.5 px-3 font-medium text-gray-800">{feature}</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${TYPE_COLORS[type]}`}>
                      {type}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-gray-600 text-xs">{range}</td>
                  <td className="py-2.5 px-3 text-gray-500 text-xs font-mono">{example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
