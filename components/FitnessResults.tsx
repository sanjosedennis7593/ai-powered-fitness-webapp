'use client'

import { Card } from '@/components/ui/card'

interface FitnessResultsProps {
  analysis: string
  tdee: string
  bmr: string
  bmi: string
}

export function FitnessResults({
  analysis,
  tdee,
  bmr,
  bmi,
}: FitnessResultsProps) {
  const parseAnalysis = (text: string) => {
    // Split by numbered sections
    const sections = text.split(/\n(?=\d+\.\s+\*\*|##\s+)/)

    return sections.map((section, idx) => {
      // Check if section starts with a numbered header
      const headerMatch = section.match(/^(\d+\.\s+\*\*)?(.+?)(\*\*)?:?/)

      return (
        <div key={idx} className="space-y-2">
          {section
            .split('\n')
            .filter((line) => line.trim())
            .map((line, lineIdx) => {
              const trimmed = line.trim()

              // Headers
              if (trimmed.match(/^\d+\.\s+\*\*/)) {
                return (
                  <h3
                    key={lineIdx}
                    className="mt-4 text-lg font-bold text-indigo-900"
                  >
                    {trimmed.replace(/\*\*/g, '')}
                  </h3>
                )
              }

              // Subheaders
              if (trimmed.match(/^\*\*/)) {
                return (
                  <h4
                    key={lineIdx}
                    className="mt-2 font-semibold text-indigo-800"
                  >
                    {trimmed.replace(/\*\*/g, '')}
                  </h4>
                )
              }

              // Bullet points
              if (trimmed.startsWith('-')) {
                return (
                  <p
                    key={lineIdx}
                    className="ml-4 text-gray-700 before:mr-2 before:content-['•'] before:text-indigo-500"
                  >
                    {trimmed.substring(1).trim()}
                  </p>
                )
              }

              // Bold text inline
              if (trimmed.includes('**')) {
                const parts = trimmed.split(/\*\*/)
                return (
                  <p key={lineIdx} className="text-gray-700">
                    {parts.map((part, partIdx) =>
                      partIdx % 2 === 1 ? (
                        <strong key={partIdx} className="text-indigo-700">{part}</strong>
                      ) : (
                        part
                      )
                    )}
                  </p>
                )
              }

              // Regular text
              if (trimmed) {
                return (
                  <p key={lineIdx} className="text-gray-700 leading-relaxed">
                    {trimmed}
                  </p>
                )
              }

              return null
            })}
        </div>
      )
    })
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-t-indigo-600 bg-white p-6 shadow-sm">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">Basal Metabolic Rate (BMR)</p>
            <p className="mt-2 text-3xl font-bold text-indigo-700">{bmr}</p>
            <p className="mt-1 text-xs text-indigo-600">cal/day</p>
            <p className="mt-3 text-xs text-gray-600">Calories burned at rest</p>
          </div>
        </Card>

        <Card className="border-t-indigo-600 bg-white p-6 shadow-sm">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">Total Daily Energy Expenditure (TDEE)</p>
            <p className="mt-2 text-3xl font-bold text-indigo-700">{tdee}</p>
            <p className="mt-1 text-xs text-indigo-600">cal/day</p>
            <p className="mt-3 text-xs text-gray-600">Daily calories with activity</p>
          </div>
        </Card>

        <Card className="border-t-indigo-600 bg-white p-6 shadow-sm">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">Body Mass Index (BMI)</p>
            <p className="mt-2 text-3xl font-bold text-indigo-700">{bmi}</p>
            <p className="mt-1 text-xs text-indigo-600">kg/m²</p>
            <p className="mt-3 text-xs text-gray-600">Body mass index</p>
          </div>
        </Card>
      </div>



      {/* Main Analysis */}
      <Card className=" border-l-indigo-600 bg-white p-6 shadow-sm">
        <div className="space-y-4 text-gray-700">
          {parseAnalysis(analysis)}
        </div>
      </Card>
    </div>
  )
}
