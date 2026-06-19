import { analyzeProductImage, ImageUnderstandingResult } from "./image-understanding";
import { understandDocument, DocumentUnderstandingResult } from "./document-understanding";
import { analyzeChartImage, ChartUnderstandingResult } from "./chart-understanding";
import { MultimodalRagEngine, VisualKnowledgeRecord } from "./multimodal-rag";

export type VisionTaskType = "PRODUCT_INSPECT" | "DOCUMENT_OCR" | "CHART_ANALYZE";

export interface VisionCoordinatorPayload {
  task: VisionTaskType;
  base64Image: string;
  mimeType: string;
  contextPrompt?: string;
}

export interface VisionCoordinatorResponse {
  taskEvaluated: VisionTaskType;
  timestamp: string;
  parsedImageMeta?: ImageUnderstandingResult;
  parsedDocumentMeta?: DocumentUnderstandingResult;
  parsedChartMeta?: ChartUnderstandingResult;
  vectorMatches?: VisualKnowledgeRecord[];
}

/**
 * VisionCoordinator unifies products analysis, OCR invoices parsing, and marketing charts analysis under a single, cohesive engine.
 */
export class VisionCoordinator {
  /**
   * Route and execute multi-modal queries
   */
  public static async executeVisionAnalysis(
    payload: VisionCoordinatorPayload
  ): Promise<VisionCoordinatorResponse> {
    const { task, base64Image, mimeType, contextPrompt } = payload;
    const timestamp = new Date().toISOString();

    console.log(`[VisionCoordinator] Dispatching vision task: [${task}] with mimeType: ${mimeType}`);

    switch (task) {
      case "PRODUCT_INSPECT": {
        const parsedImageMeta = await analyzeProductImage(base64Image, mimeType, contextPrompt);
        // Automatically querying multimodal RAG for matching supplier stocks
        const queryDesc = `${parsedImageMeta.productName} ${parsedImageMeta.attributes.material} ${parsedImageMeta.attributes.color}`;
        const vectorMatches = MultimodalRagEngine.queryVisualMatches(queryDesc);

        return {
          taskEvaluated: task,
          timestamp,
          parsedImageMeta,
          vectorMatches
        };
      }

      case "DOCUMENT_OCR": {
        const parsedDocumentMeta = await understandDocument(base64Image, mimeType, contextPrompt);
        return {
          taskEvaluated: task,
          timestamp,
          parsedDocumentMeta
        };
      }

      case "CHART_ANALYZE": {
        const parsedChartMeta = await analyzeChartImage(base64Image, mimeType, contextPrompt);
        return {
          taskEvaluated: task,
          timestamp,
          parsedChartMeta
        };
      }

      default:
        throw new Error(`Unsupported Vision System task descriptor: [${task}]`);
    }
  }
}
