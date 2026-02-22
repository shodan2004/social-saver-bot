import React, { useState, useEffect } from 'react'
import { Header, Footer } from './components/Layout'
import { ToastContainer } from './components/Toast'
import { DashboardPage } from './pages/Dashboard'
import { SetupPage } from './pages/Setup'
import { getUserIdFromStorage } from './utils/helpers'
import { healthAPI } from './utils/api'
import './index.css'

function App() {
  const userId = getUserIdFromStorage()
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [isHealthy, setIsHealthy] = useState(null)

  // Check backend health on mount
  useEffect(() => {
    const checkHealth = async () => {
      try {
        await healthAPI.check()
        setIsHealthy(true)
      } catch (error) {
        console.warn('Backend not available:', error)
        setIsHealthy(false)
      }
    }

    checkHealth()
    const interval = setInterval(checkHealth, 30000) // Check every 30 seconds
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        userId={userId}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
      />
      
      {/* Health Warning */}
      {isHealthy === false && (
        <div className="bg-red-100 border-b-2 border-red-400 text-red-800 px-4 py-3 text-center">
          ⚠️ Backend server is not running. Features will be limited. Start the backend with: <code className="bg-white px-2 py-1 rounded text-sm ml-2">python backend/main.py</code>
        </div>
      )}

      <main className="flex-1">
        {currentPage === 'dashboard' ? (
          <DashboardPage />
        ) : (
          <SetupPage onBackToDashboard={() => setCurrentPage('dashboard')} />
        )}
      </main>

      <Footer />
      <ToastContainer />
    </div>
  )
}

export default App
