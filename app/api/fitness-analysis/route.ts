// import { ChatGoogleGenerativeAI } from '@langchain/google'

import { ChatGoogleGenerativeAI } from '@langchain/google-genai'


import { NextRequest, NextResponse } from 'next/server'

interface FitnessData {
  age: number
  gender: 'male' | 'female'
  weight: number
  height: number
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
  goal: 'lose_fat' | 'build_muscle' | 'gain_weight' | 'recomposition'
  weightUnit: 'lbs' | 'kg'
  heightUnit: 'cm' | 'inches'
}

const activityMultipliers: Record<string, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
}

export async function POST(req: NextRequest) {
  try {
    const data: FitnessData = await req.json()

    // Validate required fields
    if (
      !data.age ||
      !data.gender ||
      !data.weight ||
      !data.height ||
      !data.activityLevel ||
      !data.goal
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Convert to metric if needed
    let weightKg = data.weight
    let heightCm = data.height

    if (data.weightUnit === 'lbs') {
      weightKg = data.weight / 2.20462
    }
    if (data.heightUnit === 'inches') {
      heightCm = data.height * 2.54
    }

    // Calculate BMR using Mifflin-St Jeor equation
    let bmr: number
    if (data.gender === 'male') {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * data.age + 5
    } else {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * data.age - 161
    }

    // Calculate TDEE
    const activityMultiplier =
      activityMultipliers[data.activityLevel] || 1.2
    const tdee = bmr * activityMultiplier

    // Calculate BMI
    const heightM = heightCm / 100
    const bmi = weightKg / (heightM * heightM)

    // Create prompt for Gemini
    const prompt = `You are a professional fitness coach. Based on the following client data, provide detailed, actionable fitness recommendations.

CLIENT DATA:
- Age: ${data.age} years
- Gender: ${data.gender}
- Weight: ${weightKg.toFixed(1)} kg
- Height: ${heightCm.toFixed(1)} cm
- BMI: ${bmi.toFixed(1)}
- Activity Level: ${data.activityLevel}
- Fitness Goal: ${data.goal}
- Calculated BMR: ${bmr.toFixed(0)} cal/day
- Calculated TDEE: ${tdee.toFixed(0)} cal/day

Please provide:

1. **BODY ASSESSMENT**: Describe their body type (e.g., normal weight, overweight, underweight, skinny fat, etc.) based on BMI and the context provided.

2. **RECOMMENDED APPROACH**: Based on their goal and body type, clearly state whether they should be in a bulk (calorie surplus), cut (calorie deficit), or maintenance phase. Explain why.

3. **CALORIE TARGETS**: 
   - Daily caloric intake recommendation (specific number)
   - How much daily surplus/deficit from TDEE
   - Macro breakdown (protein, carbs, fats) with grams

4. **WORKOUT PLAN**: Provide a specific 4-week workout routine including:
   - Weekly split (e.g., Push/Pull/Legs, Upper/Lower, Full Body)
   - Specific exercises with sets and reps
   - Rest days and cardio recommendations
   - Progressive overload strategy

5. **NUTRITION GUIDELINES**:
   - Best foods to focus on
   - Foods to limit
   - Meal timing suggestions if relevant
   - Hydration recommendations

6. **PROGRESS TRACKING**:
   - Key metrics to track
   - Expected timeline for results
   - How often to reassess

7. **SUPPLEMENTATION**: Basic supplements that could help (if any)

8. **MOTIVATIONAL TIPS**: Provide 2-3 personalized tips for success based on their profile

Be specific, practical, and encouraging. Format the response with clear sections and bullet points for easy reading.`


    const model = new ChatGoogleGenerativeAI({
      model: 'gemini-2.5-flash',
      temperature: 0.7
    });


    const response = await model.invoke(prompt)

    // Extract text content
    const content =
      typeof response.content === 'string'
        ? response.content
        : response.content
          .map((block: any) => block.text)
          .join('')

    return NextResponse.json({
      success: true,
      analysis: content,
      tdee: tdee.toFixed(0),
      bmr: bmr.toFixed(0),
      bmi: bmi.toFixed(1),
    })
  } catch (error: any) {
    console.error('Fitness analysis error:', error)

    if (error.message?.includes('API key')) {
      return NextResponse.json(
        {
          error: 'API key not configured. Please add GOOGLE_API_KEY to environment variables.',
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        error: 'Failed to analyze fitness data. Please try again.',
      },
      { status: 500 }
    )
  }
}
