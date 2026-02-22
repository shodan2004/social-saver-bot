import React, { useState, useEffect } from 'react'
import { AlertCircle, CheckCircle, Info } from 'lucide-react'

export function Toast({ message, type = 'info', duration = 4000 }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration)
    return () => clearTimeout(timer)
  }, [duration])

  if (!visible) return null

  const colors = {
    info: 'bg-blue-100 border-blue-400 text-blue-800',
    success: 'bg-green-100 border-green-400 text-green-800',
    error: 'bg-red-100 border-red-400 text-red-800',
  }

  const icons = {
    info: <Info size={18} />,
    success: <CheckCircle size={18} />,
    error: <AlertCircle size={18} />,
  }

  return (
    <div className={`fixed top-4 right-4 flex items-center gap-3 px-4 py-3 rounded-lg border-l-4 ${colors[type]} shadow-lg`}>
      {icons[type]}
      <span className="font-semibold">{message}</span>
    </div>
  )
}

export function ToastContainer() {
  return <div id="toast-container" className="fixed top-0 right-0 p-4 space-y-2 z-50" />
}

export function showToast(message, duration = 4000) {
  const container = document.getElementById('toast-container')
  if (container) {
    const toastElement = document.createElement('div')
    container.appendChild(toastElement)

    // This is a simplified version - in production you'd use a proper state manager
    const timer = setTimeout(() => {
      toastElement.remove()
    }, duration)

    return () => {
      clearTimeout(timer)
      toastElement.remove()
    }
  }
}
