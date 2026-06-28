import React from 'react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { isLocalSupabaseFallback, supabase } from '../../lib/supabase'
import { GraduationCap } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

export function AuthForm() {
  const { restoreDemoSession } = useAuth()

  if (isLocalSupabaseFallback) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-4">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Student Manager</h1>
            <p className="text-gray-600 dark:text-gray-300">Restored locally from your Supabase backup</p>
          </div>

          <div className="bg-white dark:bg-gray-800 dark:border-gray-700 rounded-2xl shadow-xl p-8 space-y-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              The hosted Supabase project is inactive, so this workspace is running from your backup data.
            </p>
            <button
              type="button"
              onClick={restoreDemoSession}
              className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
            >
              Open restored data
            </button>
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              Secure authentication powered by a local fallback for this backup
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Student Manager</h1>
          <p className="text-gray-600 dark:text-gray-300">Organize • Focus • Achieve</p>
        </div>

        {/* Auth Form */}
        <div className="bg-white dark:bg-gray-800 dark:border-gray-700 rounded-2xl shadow-xl p-8">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#4f46e5',
                    brandAccent: '#4338ca',
                  },
                },
              },
              className: {
                container: 'auth-container',
                button: 'auth-button',
                input: 'auth-input',
              },
            }}
            providers={['google']}
            redirectTo={`${window.location.origin}${import.meta.env.BASE_URL}`}
            onlyThirdPartyProviders={false}
          />
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Secure authentication powered by Supabase
          </p>
        </div>
      </div>
    </div>
  )
}