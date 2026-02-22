import React from 'react'
import { Zap } from 'lucide-react'

export function SetupGuide({ userId }) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = () => {
    const text = `Your User ID: ${userId}`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <Zap className="text-yellow-500" size={28} />
        <h2 className="text-2xl font-bold text-gray-900">Quick Setup</h2>
      </div>

      <div className="space-y-6">
        {/* Step 1 */}
        <div className="border-l-4 border-primary-600 pl-6 py-3">
          <h3 className="font-bold text-gray-900 mb-2">Step 1: Get Your WhatsApp Bot Number</h3>
          <p className="text-gray-600 text-sm mb-3">
            Save this number on WhatsApp: <code className="bg-gray-100 px-2 py-1 rounded">+1 234 567 890</code>
          </p>
          <p className="text-gray-500 text-xs">📱 This is your Twilio Sandbox Number (replace with your actual number)</p>
        </div>

        {/* Step 2 */}
        <div className="border-l-4 border-primary-600 pl-6 py-3">
          <h3 className="font-bold text-gray-900 mb-2">Step 2: Send a Test Link</h3>
          <p className="text-gray-600 text-sm mb-3">
            Forward any Instagram/Twitter/Blog link to start. The bot will:
          </p>
          <ul className="text-gray-600 text-sm space-y-1 list-disc list-inside">
            <li>Analyze the content</li>
            <li>Auto-categorize it</li>
            <li>Generate a summary</li>
            <li>Save it to your dashboard</li>
          </ul>
        </div>

        {/* Step 3 */}
        <div className="border-l-4 border-primary-600 pl-6 py-3">
          <h3 className="font-bold text-gray-900 mb-2">Step 3: View in Dashboard</h3>
          <p className="text-gray-600 text-sm mb-3">
            Your saved content will appear here automatically. Search, filter, and organize everything.
          </p>
        </div>

        {/* User ID */}
        <div className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-lg p-4 border border-primary-200">
          <p className="text-sm text-gray-600 mb-2">Your User ID (for testing):</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-white px-3 py-2 rounded border border-gray-300 text-sm font-mono">
              {userId}
            </code>
            <button
              onClick={handleCopy}
              className={`px-4 py-2 rounded font-semibold transition ${
                copied
                  ? 'bg-green-500 text-white'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              }`}
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Support */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-sm text-blue-900">
            <strong>🤔 Need help?</strong> Check the setup documentation or contact support.
          </p>
        </div>
      </div>
    </div>
  )
}
