import { useState } from 'react'
import { Loader2 } from 'lucide-react'

const EDUCATION_OPTIONS    = ["Bachelor's", "High School", "Master's", "PhD"]
const EMPLOYMENT_OPTIONS   = ["Full-time", "Part-time", "Self-employed", "Unemployed"]
const MARITAL_OPTIONS      = ["Divorced", "Married", "Single"]
const LOAN_PURPOSE_OPTIONS = ["Auto", "Business", "Education", "Home", "Other"]
const YES_NO_OPTIONS       = ["Yes", "No"]

const MODEL_OPTIONS = [
  { value: 'logistic_regression', label: 'Logistic Regression' },
  { value: 'decision_tree',       label: 'Decision Tree' },
  { value: 'knn',                 label: 'K-Nearest Neighbors (k=5)' },
  { value: 'naive_bayes',         label: 'Naive Bayes' },
]

const DEFAULT_VALUES = {
  age: 35,
  income: 60000,
  loanamount: 50000,
  creditscore: 650,
  monthsemployed: 36,
  numcreditlines: 3,
  interestrate: 10.5,
  loanterm: 36,
  dti_ratio: 0.35,
  education: "Bachelor's",
  employmenttype: 'Full-time',
  maritalstatus: 'Married',
  hasmortgage: 'No',
  hasdependents: 'No',
  loanpurpose: 'Home',
  hascosigner: 'No',
  model_name: 'logistic_regression',
}

function Field({ label, children, hint }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
      {hint && <p className="text-xs text-gray-400 mt-0.5">{hint}</p>}
    </div>
  )
}

function Select({ value, onChange, options }) {
  return (
    <select
      className="input-field"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((o) => (
        <option key={typeof o === 'string' ? o : o.value}
                value={typeof o === 'string' ? o : o.value}>
          {typeof o === 'string' ? o : o.label}
        </option>
      ))}
    </select>
  )
}

export default function PredictionForm({ onSubmit, onSubmitAll, loading }) {
  const [form, setForm] = useState(DEFAULT_VALUES)

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }))
  const setNum = (key) => (e) => setForm((f) => ({ ...f, [key]: Number(e.target.value) }))

  const buildPayload = () => ({ ...form })

  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">Loan Application Details</h2>

      {/* ── Model selector ── */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <Field label="Select Classification Model">
          <Select value={form.model_name} onChange={set('model_name')} options={MODEL_OPTIONS} />
        </Field>
      </div>

      {/* ── Numerical features ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
        <Field label="Age" hint="18 – 100">
          <input type="number" className="input-field" min={18} max={100}
            value={form.age} onChange={setNum('age')} />
        </Field>
        <Field label="Annual Income (USD)" hint="e.g. 60000">
          <input type="number" className="input-field" min={0}
            value={form.income} onChange={setNum('income')} />
        </Field>
        <Field label="Loan Amount (USD)" hint="min 1000">
          <input type="number" className="input-field" min={1000}
            value={form.loanamount} onChange={setNum('loanamount')} />
        </Field>
        <Field label="Credit Score" hint="300 – 850">
          <input type="number" className="input-field" min={300} max={850}
            value={form.creditscore} onChange={setNum('creditscore')} />
        </Field>
        <Field label="Months Employed" hint="0 if currently unemployed">
          <input type="number" className="input-field" min={0}
            value={form.monthsemployed} onChange={setNum('monthsemployed')} />
        </Field>
        <Field label="Number of Credit Lines" hint="Open credit accounts">
          <input type="number" className="input-field" min={0}
            value={form.numcreditlines} onChange={setNum('numcreditlines')} />
        </Field>
        <Field label="Interest Rate (%)" hint="0.0 – 30.0">
          <input type="number" className="input-field" min={0} max={30} step={0.01}
            value={form.interestrate} onChange={setNum('interestrate')} />
        </Field>
        <Field label="Loan Term (months)" hint="e.g. 12, 24, 36, 48, 60">
          <input type="number" className="input-field" min={6} max={360}
            value={form.loanterm} onChange={setNum('loanterm')} />
        </Field>
        <Field label="DTI Ratio" hint="Debt-to-Income ratio (0.00 – 1.00)">
          <input type="number" className="input-field" min={0} max={1} step={0.01}
            value={form.dti_ratio} onChange={setNum('dti_ratio')} />
        </Field>
      </div>

      {/* ── Categorical features ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        <Field label="Education">
          <Select value={form.education} onChange={set('education')} options={EDUCATION_OPTIONS} />
        </Field>
        <Field label="Employment Type">
          <Select value={form.employmenttype} onChange={set('employmenttype')} options={EMPLOYMENT_OPTIONS} />
        </Field>
        <Field label="Marital Status">
          <Select value={form.maritalstatus} onChange={set('maritalstatus')} options={MARITAL_OPTIONS} />
        </Field>
        <Field label="Has Mortgage?">
          <Select value={form.hasmortgage} onChange={set('hasmortgage')} options={YES_NO_OPTIONS} />
        </Field>
        <Field label="Has Dependents?">
          <Select value={form.hasdependents} onChange={set('hasdependents')} options={YES_NO_OPTIONS} />
        </Field>
        <Field label="Loan Purpose">
          <Select value={form.loanpurpose} onChange={set('loanpurpose')} options={LOAN_PURPOSE_OPTIONS} />
        </Field>
        <Field label="Has Co-Signer?">
          <Select value={form.hascosigner} onChange={set('hascosigner')} options={YES_NO_OPTIONS} />
        </Field>
      </div>

      {/* ── Actions ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          className="btn-primary flex items-center justify-center gap-2 flex-1"
          onClick={() => onSubmit(buildPayload())}
          disabled={loading}
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : null}
          Predict with {MODEL_OPTIONS.find(m => m.value === form.model_name)?.label}
        </button>
        <button
          className="btn-secondary flex items-center justify-center gap-2 flex-1"
          onClick={() => onSubmitAll(buildPayload())}
          disabled={loading}
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : null}
          Compare All Models
        </button>
      </div>
    </div>
  )
}
