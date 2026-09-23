import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Predict from './pages/Predict'
import ModelComparison from './pages/ModelComparison'
import Statistics from './pages/Statistics'
import History from './pages/History'
import About from './pages/About'

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/"              element={<Dashboard />} />
            <Route path="/predict"       element={<Predict />} />
            <Route path="/compare"       element={<ModelComparison />} />
            <Route path="/statistics"    element={<Statistics />} />
            <Route path="/history"       element={<History />} />
            <Route path="/about"         element={<About />} />
          </Routes>
        </main>
        <footer className="bg-gray-800 text-gray-400 text-center text-xs py-4">
          © 2026 LoanGuard — Loan Default Prediction · ML College Project
        </footer>
      </div>
    </BrowserRouter>
  )
}
