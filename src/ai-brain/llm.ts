/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from "@google/genai";

// Lazy-initialize client to prevent compile/boot crashes if the key is initially unavailable.
let aiInstance: GoogleGenAI | null = null;

export function getGenAI(): GoogleGenAI {
  if (!aiInstance) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("WARNING: GEMINI_API_KEY environment variable is not set. Real LLM capabilities will be degraded.");
    }
    aiInstance = new GoogleGenAI({
      apiKey: key || "DUMMY_KEY",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiInstance;
}

export const CURRENT_MODEL = "gemini-3.5-flash";

/**
 * Calls Gemini to generate structured output conforming to a specific schema.
 */
export async function generateStructuredOutput<T>(
  prompt: string,
  systemInstruction: string,
  responseSchema: any
): Promise<T> {
  const ai = getGenAI();
  try {
    const response = await ai.models.generateContent({
      model: CURRENT_MODEL,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema,
        temperature: 0.1, // Lower temperature for high-precision structural reasoning
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response received from GenAI model.");
    }

    return JSON.parse(text) as T;
  } catch (error: any) {
    console.error("GenAI structured output generation failed:", error);
    throw error;
  }
}
