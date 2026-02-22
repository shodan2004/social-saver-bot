import React from 'react'
import { Menu, X, Settings, LogOut } from 'lucide-react'

export function Header({ userId, currentPage, onNavigate }) {
  const [showMenu, setShowMenu] = React.useState(false)

  const navButtonClass = (page) =>
    `transition font-semibold ${currentPage === page ? 'text-primary-600' : 'text-gray-700 hover:text-primary-600'}`

  const handleNavigate = (page) => {
    onNavigate(page)
    setShowMenu(false)
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-2xl">✨</span>
          <h1 className="text-2xl font-bold text-primary-600">Social Saver</h1>
        </div>

        <nav className="hidden md:flex gap-6 items-center">
          <button onClick={() => handleNavigate('dashboard')} className={navButtonClass('dashboard')}>
            Dashboard
          </button>
          <button onClick={() => handleNavigate('setup')} className={navButtonClass('setup')}>
            Setup
          </button>
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden md:block text-sm text-gray-600">
            User ID: <code className="bg-gray-100 px-2 py-1 rounded text-xs">{userId}</code>
          </div>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="md:hidden text-gray-600 hover:text-primary-600"
          >
            {showMenu ? <X size={24} /> : <Menu size={24} />}
          </button>

          {showMenu && (
            <div className="absolute top-16 right-4 bg-white rounded-lg shadow-lg p-4 md:hidden">
              <button
                onClick={() => handleNavigate('dashboard')}
                className="flex items-center gap-2 text-gray-700 hover:text-primary-600 w-full text-left p-2"
              >
                Dashboard
              </button>
              <button
                onClick={() => handleNavigate('setup')}
                className="flex items-center gap-2 text-gray-700 hover:text-primary-600 w-full text-left p-2"
              >
                Setup
              </button>
              <button className="flex items-center gap-2 text-gray-700 hover:text-primary-600 w-full text-left p-2">
                <Settings size={18} /> Settings
              </button>
              <button className="flex items-center gap-2 text-gray-700 hover:text-red-600 w-full text-left p-2">
                <LogOut size={18} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Social Saver Bot</h3>
            <p className="text-gray-400">
              Turn your Instagram saves into a searchable knowledge base.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">How it works</h4>
            <ol className="text-gray-400 space-y-2 text-sm">
              <li>1. Forward a link to your WhatsApp bot</li>
              <li>2. Bot analyzes and categorizes it</li>
              <li>3. Appears in your dashboard</li>
              <li>4. Search anytime, anywhere</li>
            </ol>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Supported Platforms</h4>
            <ul className="text-gray-400 space-y-2 text-sm">
              <li>📸 Instagram</li>
              <li>𝕏 Twitter/X</li>
              <li>📝 Blogs & Articles</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-8 text-center text-gray-400 text-sm">
          <p>© 2026 Social Saver Bot. Built with ❤️ for the hackathon.</p>
        </div>
      </div>
    </footer>
  )
}
