import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, BrainCircuit, BarChart3,
  Database, History, Info, Shield
} from 'lucide-react'
import { useState } from 'react'

const links = [
  { to: '/',           label: 'Dashboard',   icon: LayoutDashboard },
  { to: '/predict',    label: 'Predict',     icon: BrainCircuit },
  { to: '/compare',    label: 'Compare',     icon: BarChart3 },
  { to: '/statistics', label: 'Statistics',  icon: Database },
  { to: '/history',    label: 'History',     icon: History },
  { to: '/about',      label: 'About',       icon: Info },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2 font-bold text-xl">
            <Shield className="text-blue-400" size={22} />
            <span>Loan<span className="text-blue-400">Guard</span></span>
          </NavLink>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ` +
                  (isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white')
                }
              >
                <Icon size={15} />
                {label}
              </NavLink>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <span className="block w-5 h-0.5 bg-current mb-1" />
            <span className="block w-5 h-0.5 bg-current mb-1" />
            <span className="block w-5 h-0.5 bg-current" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700 px-4 pb-4 pt-2">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2.5 rounded-md text-sm font-medium mb-1 ` +
                (isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white')
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  )
}
