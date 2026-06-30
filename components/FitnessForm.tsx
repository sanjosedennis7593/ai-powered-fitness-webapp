'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

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

interface FitnessFormProps {
  onSubmit: (data: FormData) => Promise<void>
  isLoading: boolean
}

export function FitnessForm({ onSubmit, isLoading }: FitnessFormProps) {
  const [formData, setFormData] = useState<FormData>({
    age: '',
    gender: 'male',
    weight: '',
    height: '',
    activityLevel: 'moderate',
    goal: 'lose_fat',
    weightUnit: 'lbs',
    heightUnit: 'inches',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.age || formData.age < 15 || formData.age > 100) {
      newErrors.age = 'Age must be between 15 and 100'
    }
    if (!formData.weight || formData.weight <= 0) {
      newErrors.weight = 'Weight must be a positive number'
    }
    if (!formData.height || formData.height <= 0) {
      newErrors.height = 'Height must be a positive number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    await onSubmit(formData)
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    const numericFields = ['age', 'weight', 'height']

    setFormData((prev) => ({
      ...prev,
      [name]:
        numericFields.includes(name) && value
          ? parseFloat(value)
          : value,
    }))

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Age */}
        <div className="flex flex-col">
          <label htmlFor="age" className="mb-2 text-sm text-black font-semibold">
            Age
          </label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
            placeholder="25"
            min="15"
            max="100"
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.age && (
            <span className="mt-1 text-sm text-red-500">{errors.age}</span>
          )}
        </div>

        {/* Gender */}
        <div className="flex flex-col">
          <label htmlFor="gender" className="mb-2 text-sm text-black font-semibold">
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        {/* Weight */}
        <div className="flex flex-col">
          <div className="mb-2 flex items-center justify-between">
            <label htmlFor="weight" className="text-sm text-black font-semibold">
              Weight
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    weightUnit: 'lbs',
                  }))
                }
                className={`text-xs font-medium ${
                  formData.weightUnit === 'lbs'
                    ? 'text-indigo-600'
                    : 'text-gray-500'
                }`}
              >
                lbs
              </button>
              <span className="text-xs text-gray-400">/</span>
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    weightUnit: 'kg',
                  }))
                }
                className={`text-xs font-medium ${
                  formData.weightUnit === 'kg'
                    ? 'text-indigo-600'
                    : 'text-gray-500'
                }`}
              >
                kg
              </button>
            </div>
          </div>
          <input
            type="number"
            id="weight"
            name="weight"
            value={formData.weight}
            onChange={handleInputChange}
            placeholder={formData.weightUnit === 'lbs' ? '180' : '82'}
            step="0.1"
            min="0"
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.weight && (
            <span className="mt-1 text-sm text-red-500">{errors.weight}</span>
          )}
        </div>

        {/* Height */}
        <div className="flex flex-col">
          <div className="mb-2 flex items-center justify-between">
            <label htmlFor="height" className="text-sm text-black font-semibold">
              Height
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    heightUnit: 'inches',
                  }))
                }
                className={`text-xs font-medium ${
                  formData.heightUnit === 'inches'
                    ? 'text-indigo-600'
                    : 'text-gray-500'
                }`}
              >
                in
              </button>
              <span className="text-xs text-gray-400">/</span>
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    heightUnit: 'cm',
                  }))
                }
                className={`text-xs font-medium ${
                  formData.heightUnit === 'cm'
                    ? 'text-indigo-600'
                    : 'text-gray-500'
                }`}
              >
                cm
              </button>
            </div>
          </div>
          <input
            type="number"
            id="height"
            name="height"
            value={formData.height}
            onChange={handleInputChange}
            placeholder={formData.heightUnit === 'inches' ? '70' : '180'}
            step="0.1"
            min="0"
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.height && (
            <span className="mt-1 text-sm text-red-500">
              {errors.height}
            </span>
          )}
        </div>

        {/* Activity Level */}
        <div className="flex flex-col sm:col-span-2">
          <label htmlFor="activityLevel" className="mb-2 text-sm text-black font-semibold">
            Activity Level
          </label>
          <select
            id="activityLevel"
            name="activityLevel"
            value={formData.activityLevel}
            onChange={handleInputChange}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="sedentary">
              Sedentary (little or no exercise)
            </option>
            <option value="light">Light (exercise 1-3 days/week)</option>
            <option value="moderate">
              Moderate (exercise 3-5 days/week)
            </option>
            <option value="active">Active (exercise 6-7 days/week)</option>
            <option value="very_active">
              Very Active (intense exercise or physical job)
            </option>
          </select>
        </div>

        {/* Fitness Goal */}
        <div className="flex flex-col sm:col-span-2">
          <label htmlFor="goal" className="mb-2 text-sm text-black font-semibold">
            Fitness Goal
          </label>
          <select
            id="goal"
            name="goal"
            value={formData.goal}
            onChange={handleInputChange}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="lose_fat">Lose Fat</option>
            <option value="build_muscle">Build Muscle</option>
            <option value="gain_weight">Gain Weight</option>
            <option value="recomposition">Recomposition (Lose Fat & Gain Muscle)</option>
          </select>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? 'Analyzing...' : 'Get My Fitness Plan'}
      </Button>
    </form>
  )
}
