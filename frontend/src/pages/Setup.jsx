import React from 'react'
import { Code, MessageSquare, Zap } from 'lucide-react'

export function SetupPage({ onBackToDashboard }) {
  const webhookBaseUrl =
    import.meta.env.VITE_WEBHOOK_BASE_URL ||
    import.meta.env.VITE_API_URL ||
    'https://your-backend-domain.com'

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
      <main className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Setup Your Social Saver Bot</h1>
          <p className="text-lg text-gray-600">
            Follow these steps to get your bot running and start saving content from social media.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-8">
          {/* Step 1: Environment Setup */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-primary-100 rounded-lg p-3">
                <Code className="text-primary-600" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Step 1: Environment Setup</h2>
                <p className="text-gray-600 mt-2">Configure environment variables for the backend.</p>
              </div>
            </div>

            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm mb-4 overflow-x-auto">
              <div className="text-gray-400"># Copy backend/.env.example to backend/.env</div>
              <div className="mt-2">TWILIO_ACCOUNT_SID=your_account_sid</div>
              <div>TWILIO_AUTH_TOKEN=your_auth_token</div>
              <div>TWILIO_PHONE_NUMBER=your_bot_number</div>
              <div>HF_API_TOKEN=your_hf_api_token</div>
            </div>

            <a
              href="https://www.twilio.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              Get Twilio Credentials →
            </a>
          </div>

          {/* Step 2: Backend Setup */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-blue-100 rounded-lg p-3">
                <MessageSquare className="text-blue-600" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Step 2: Start Backend Server</h2>
                <p className="text-gray-600 mt-2">Install dependencies and run the FastAPI server.</p>
              </div>
            </div>

            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm space-y-2">
              <div className="text-gray-400"># Install dependencies</div>
              <div>cd backend</div>
              <div>pip install -r requirements.txt</div>
              <div className="mt-4 text-gray-400"># Start server</div>
              <div>python main.py</div>
            </div>

            <p className="text-gray-600 mt-4 text-sm">The API will run on http://localhost:8000</p>
          </div>

          {/* Step 3: Frontend Setup */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-purple-100 rounded-lg p-3">
                <Zap className="text-purple-600" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Step 3: Start Frontend</h2>
                <p className="text-gray-600 mt-2">Install dependencies and run the React dashboard.</p>
              </div>
            </div>

            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm space-y-2">
              <div className="text-gray-400"># Install dependencies</div>
              <div>cd frontend</div>
              <div>npm install</div>
              <div className="mt-4 text-gray-400"># Start dev server</div>
              <div>npm run dev</div>
            </div>

            <p className="text-gray-600 mt-4 text-sm">The dashboard will run on http://localhost:3000</p>
          </div>

          {/* Step 4: Setup WhatsApp Webhook */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Step 4: Configure WhatsApp Webhook</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                <span className="font-semibold">1.</span> Go to Twilio Dashboard → WhatsApp → Sandbox
              </p>
              <p>
                <span className="font-semibold">2.</span> Set Webhook URL to: <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                  {webhookBaseUrl}/api/whatsapp/webhook
                </code>
              </p>
              <p>
                <span className="font-semibold">3.</span> Save your bot number and environment variables
              </p>
              <p>
                <span className="font-semibold">4.</span> Test by sending a WhatsApp message with an Instagram/Twitter link
              </p>
            </div>
          </div>

          {/* Troubleshooting */}
          <div className="bg-yellow-50 rounded-xl shadow-lg p-8 border border-yellow-200">
            <h2 className="text-2xl font-bold text-yellow-900 mb-4">Troubleshooting</h2>
            <ul className="space-y-2 text-yellow-800">
              <li>
                <strong>API returns 500:</strong> Check that all environment variables are set correctly
              </li>
              <li>
                <strong>WhatsApp webhook not triggering:</strong> Verify the webhook URL is accessible and using HTTPS
              </li>
              <li>
                <strong>HF API errors:</strong> Make sure your Hugging Face token is valid and has sufficient credits
              </li>
              <li>
                <strong>Database errors:</strong> Delete social_saver.db and restart the server to reinitialize
              </li>
            </ul>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={onBackToDashboard}
            className="inline-block px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-semibold transition"
          >
            Go to Dashboard
          </button>
        </div>
      </main>
    </div>
  )
}
