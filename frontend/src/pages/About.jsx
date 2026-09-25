import { Info, Code2, BrainCircuit, GraduationCap } from 'lucide-react'

const MODELS = [
  {
    name: 'Logistic Regression',
    accuracy: '88.59%',
    description:
      'A linear model that estimates the probability of default using a logistic (sigmoid) function. Best accuracy in the notebook. Relatively low recall (3.1%) suggests it prefers high-precision predictions.',
    hyperparams: 'Default scikit-learn settings, max_iter=1000',
    color: 'border-blue-300 bg-blue-50',
    badge: 'bg-blue-100 text-blue-700',
  },
  {
    name: 'Decision Tree',
    accuracy: '80.25%',
    description:
      'A tree-based model that recursively splits data on feature thresholds. Highest recall (23.1%) among all models — it catches more actual defaults at the cost of lower accuracy.',
    hyperparams: 'random_state=42, default depth (unpruned)',
    color: 'border-purple-300 bg-purple-50',
    badge: 'bg-purple-100 text-purple-700',
  },
  {
    name: 'K-Nearest Neighbors (k=5)',
    accuracy: '87.57%',
    description:
      'A non-parametric model that classifies based on the majority class of the 5 nearest training samples. Balanced performance between LR and DT.',
    hyperparams: 'n_neighbors=5',
    color: 'border-orange-300 bg-orange-50',
    badge: 'bg-orange-100 text-orange-700',
  },
  {
    name: 'Naive Bayes (Gaussian)',
    accuracy: '88.54%',
    description:
      'A probabilistic classifier assuming feature independence. Highest precision (66.4%) but very low recall (1.6%) — extremely conservative in flagging defaults.',
    hyperparams: 'GaussianNB, default priors',
    color: 'border-teal-300 bg-teal-50',
    badge: 'bg-teal-100 text-teal-700',
  },
]

function Section({ icon: Icon, title, children }) {
  return (
    <div className="card mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Icon size={18} className="text-blue-500" />
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      </div>
      {children}
    </div>
  )
}

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gray-100 rounded-lg">
          <Info className="text-gray-600" size={22} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">About LoanGuard</h1>
          <p className="text-sm text-gray-500">Project overview, models, and technical details</p>
        </div>
      </div>

      {/* Project overview */}
      <Section icon={GraduationCap} title="Project Overview">
        <p className="text-sm text-gray-600 leading-relaxed">
          LoanGuard is a full-stack ML web application built as a college Semester 5 ML project.
          It predicts whether a loan applicant will default based on 16 financial and demographic
          features, using four classical classification algorithms trained on 255,347 real-world
          loan records.
        </p>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          {[
            ['255,347', 'Records'],
            ['16',      'Features'],
            ['4',       'ML Models'],
            ['80/20',   'Train/Test Split'],
          ].map(([val, label]) => (
            <div key={label} className="bg-gray-50 rounded-lg p-3">
              <p className="text-xl font-bold text-blue-600">{val}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Models */}
      <Section icon={BrainCircuit} title="Classification Models">
        <div className="space-y-4">
          {MODELS.map(m => (
            <div key={m.name} className={`border rounded-xl p-4 ${m.color}`}>
              <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                <h3 className="font-semibold text-gray-800">{m.name}</h3>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${m.badge}`}>
                  Accuracy: {m.accuracy}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{m.description}</p>
              <p className="text-xs text-gray-500">
                <span className="font-medium">Hyperparameters:</span> {m.hyperparams}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Tech stack */}
      <Section icon={Code2} title="Tech Stack">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Backend</p>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• Python 3.11+ / FastAPI</li>
              <li>• scikit-learn (LR, DT, KNN, NB)</li>
              <li>• pandas + numpy</li>
              <li>• SQLite + SQLAlchemy (history)</li>
              <li>• joblib (model persistence)</li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Frontend</p>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• React 18 + Vite</li>
              <li>• Tailwind CSS</li>
              <li>• Recharts (bar, pie, radar)</li>
              <li>• React Router v6</li>
              <li>• Axios + react-hot-toast</li>
            </ul>
          </div>
        </div>
      </Section>
    </div>
  )
}
