import { getGenAI } from "../../llm";

export interface ImageUnderstandingResult {
  productName: string;
  category: string;
  attributes: {
    color: string;
    material: string;
    style: string;
    targetAudience?: string;
  };
  generatedTitle: string;
  generatedDescription: string;
  qualityReview: {
    qualityCheckPassed: boolean;
    issuesDetected: string[];
    shelfSuitabilityScore: number; // 0-100
  };
  brandDetection: {
    detectedBrand: string;
    brandConsistencyScore: number; // 0-100
  };
}

/**
 * Analyzes a product image using Gemini 3.5 multi-modal capability.
 */
export async function analyzeProductImage(
  base64Image: string,
  mimeType: string,
  additionalContext?: string
): Promise<ImageUnderstandingResult> {
  const ai = getGenAI();

  const imagePart = {
    inlineData: {
      mimeType,
      data: base64Image,
    },
  };

  const prompt = `
    Analyze this product image to assist an e-commerce merchant. Return a structured JSON response.
    Context: ${additionalContext || "No additional context specified."}

    Your output MUST strictly conform to this JSON schema:
    {
      "productName": "string representing the detected product name",
      "category": "e.g. Sports, Electronics, Apparel, Accessories",
      "attributes": {
        "color": "primary colors",
        "material": "e.g., stainless steel, plastic, wool, cotton",
        "style": "e.g., minimal, sporty, premium, industrial",
        "targetAudience": "customer profiles"
      },
      "generatedTitle": "SEO-optimized product title for Shopify/Amazon",
      "generatedDescription": "High-converting marketing copywriting",
      "qualityReview": {
        "qualityCheckPassed": true/false (based on professional product standard),
        "issuesDetected": ["issue 1", "issue 2", ...],
        "shelfSuitabilityScore": 0-100
      },
      "brandDetection": {
        "detectedBrand": "brand logo or name seen",
        "brandConsistencyScore": 0-100
      }
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: {
        parts: [
          imagePart,
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        temperature: 0.2,
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    return {
      productName: parsed.productName || "General Product",
      category: parsed.category || "General Catalog",
      attributes: {
        color: parsed.attributes?.color || "Unknown",
        material: parsed.attributes?.material || "Unknown",
        style: parsed.attributes?.style || "Unknown",
        targetAudience: parsed.attributes?.targetAudience || "General Public",
      },
      generatedTitle: parsed.generatedTitle || "Premium Selected Item",
      generatedDescription: parsed.generatedDescription || "A beautiful selected modern utility product.",
      qualityReview: {
        qualityCheckPassed: parsed.qualityReview?.qualityCheckPassed !== false,
        issuesDetected: parsed.qualityReview?.issuesDetected || [],
        shelfSuitabilityScore: parsed.qualityReview?.shelfSuitabilityScore ?? 95,
      },
      brandDetection: {
        detectedBrand: parsed.brandDetection?.detectedBrand || "Selected Boutique",
        brandConsistencyScore: parsed.brandDetection?.brandConsistencyScore ?? 90,
      },
    };
  } catch (error) {
    console.error("Failed to analyze product image via Gemini multi-modal Vision:", error);
    throw error;
  }
}
