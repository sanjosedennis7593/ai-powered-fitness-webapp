'use client'

import { useState } from 'react'
import { FitnessForm } from '@/components/FitnessForm'
import { FitnessResults } from '@/components/FitnessResults'

interface FormData {
  age: number | ''
  gender: 'male' | 'female'
  weight: number | ''
  height: number | ''
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
  goal: 'lose_fat' | 'build_muscle' | 'gain_weight' | 'recomposition'
  weightUnit: 'lbs' | 'kg'
  heightUnit: 'cm' | 'inches'
}

interface AnalysisResult {
  success: boolean
  analysis: string
  tdee: string
  bmr: string
  bmi: string
}

export default function Page() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFormSubmit = async (data: FormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/fitness-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
          errorData.error || 'Failed to analyze fitness data'
        )
      }

      const result = await response.json()
      setResult(result)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err: any) {
      setError(
        err.message ||
        'An error occurred. Please ensure GOOGLE_API_KEY is set.'
      )
      console.error('Error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900">
            AI Fitness Coach
          </h1>
          <p className="text-lg text-gray-600">
            Get personalized workout plans and nutrition guidance powered by AI
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            <p className="font-semibold">Error</p>
            <p className="text-sm">{error}</p>
            {error.includes('GOOGLE_API_KEY') && (
              <p className="mt-2 text-sm">
                Get a free API key at{' '}
                <a
                  href="https://makersuite.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:no-underline"
                >
                  makersuite.google.com/app/apikey
                </a>
              </p>
            )}
          </div>
        )}

        {/* Main Content */}
        {!result ? (
          <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
            <FitnessForm
              onSubmit={handleFormSubmit}
              isLoading={isLoading}
            />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Your Fitness Plan
              </h2>
              <button
                onClick={() => {
                  setResult(null)
                  setError(null)
                }}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Start Over
              </button>
            </div>
            <FitnessResults
              analysis={result.analysis}
              tdee={result.tdee}
              bmr={result.bmr}
              bmi={result.bmi}
            />
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/20">
            <div className="rounded-lg bg-white p-6 text-center shadow-lg">
              <div className="mb-4 flex justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
              </div>
              <p className="font-semibold text-gray-900">
                Analyzing your fitness profile...
              </p>
              <p className="text-sm text-gray-600">
                This may take a moment
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
