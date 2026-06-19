import { getGenAI } from "../../llm";

export interface ChartDataPoint {
  seriesName: string;
  variable: string; // e.g. "Conversion Rate", "ROAS", "Impressions"
  trendDirection: "increasing" | "decreasing" | "volatile" | "stable";
  estimatedValue?: string;
}

export interface ChartUnderstandingResult {
  chartTitle: string;
  sourceDashboardType: string; // e.g., "Meta Ads", "Google Search Console", "Shopify Sales"
  dataExtracted: ChartDataPoint[];
  detectedAnomalies: string[];
  strategicInsights: string[];
  recommendedDecisions: {
    title: string;
    actionRequired: string;
    expectedGainEstimate: string;
  }[];
}

/**
 * Extracts trends, numbers, and discrepancies from snapshots of dashboard analytics.
 */
export async function analyzeChartImage(
  base64Image: string,
  mimeType: string,
  customBusinessGoal?: string
): Promise<ChartUnderstandingResult> {
  const ai = getGenAI();

  const imagePart = {
    inlineData: {
      mimeType,
      data: base64Image,
    },
  };

  const prompt = `
    You are the CEO-Brain Chief Strategic Analyst in AI Commerce OS.
    Analyze this analytical chart or dashboard screenshot. Locate key data lines, curves, bar metrics, and ROAS indicators.
    Current Business Goal Context: ${customBusinessGoal || "Maintain maximum profit margin and clear overstocks."}

    Your output MUST strictly conform to this JSON schema:
    {
      "chartTitle": "title of the chart or detected dashboard section",
      "sourceDashboardType": "e.g., Meta Business Suite, Shopify Analytics, Google Ads",
      "dataExtracted": [
        {
          "seriesName": "CPC or ROAS or sales quantity",
          "variable": "metric type",
          "trendDirection": "increasing" | "decreasing" | "volatile" | "stable",
          "estimatedValue": "e.g., 2.3x ROAS, +12%, ¥160/lead"
        }
      ],
      "detectedAnomalies": [
        "anomaly descriptions (e.g., ad fatigue, sudden spikes, CPC skyrocketing on Sundays)"
      ],
      "strategicInsights": [
        "executive-level business observations"
      ],
      "recommendedDecisions": [
        {
          "title": "short executive resolution",
          "actionRequired": "specific operational instruction",
          "expectedGainEstimate": "+¥12,000 net profit / -15% acquisition waste"
        }
      ]
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
        temperature: 0.15,
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    return {
      chartTitle: parsed.chartTitle || "E-commerce Revenue Metrics",
      sourceDashboardType: parsed.sourceDashboardType || "Shopify Sidekick Analytics",
      dataExtracted: parsed.dataExtracted || [],
      detectedAnomalies: parsed.detectedAnomalies || [],
      strategicInsights: parsed.strategicInsights || [],
      recommendedDecisions: parsed.recommendedDecisions || [],
    };
  } catch (error) {
    console.error("Failed to analyze dashboard chart photo via e-commerce brain:", error);
    throw error;
  }
}
export default analyzeChartImage;
