"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function analyzeFinances(prompt: string) {
  const response = await generateText({
    model: openai("gpt-4"),
    prompt: `Analyze the following financial query: ${prompt}`,
    system:
      "You are a helpful financial advisor AI. Provide clear, concise advice and analysis based on the user's financial data and questions.",
  })

  return response.text
}

