import { getGenAI } from "../../llm";

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface DocumentUnderstandingResult {
  documentType: "Invoice" | "PurchaseOrder" | "LogisticsReceipt" | "Contract" | "Unknown";
  language: string;
  metadata: {
    documentNumber?: string;
    issueDate?: string;
    supplierName?: string;
    taxId?: string;
    purchaseOrderRef?: string;
  };
  items: InvoiceItem[];
  totals: {
    subtotal: number;
    taxAmount: number;
    shippingCosts: number;
    totalAmount: number;
    currency: string;
  };
  operationalWarning: string | null; // Flags anomalies such as suspicious charges or math discrepancy
}

/**
 * Extracts items, metadata, totals and identifies compliance threats on receipts, pdf captures, invoices & supplier contracts.
 */
export async function understandDocument(
  base64Image: string,
  mimeType: string,
  additionalInstructions?: string
): Promise<DocumentUnderstandingResult> {
  const ai = getGenAI();

  const imagePart = {
    inlineData: {
      mimeType,
      data: base64Image,
    },
  };

  const prompt = `
    You are an expert financial and logistics audit intelligence officer inside AI Commerce OS.
    Analyze this document (invoice, contract, PO, or delivery slip) carefully. Conduct OCR and extract all details perfectly.
    Additional instructions: ${additionalInstructions || "None."}

    Your output MUST strictly conform to this JSON schema:
    {
      "documentType": "Invoice" | "PurchaseOrder" | "LogisticsReceipt" | "Contract" | "Unknown",
      "language": "detected invoice language code",
      "metadata": {
        "documentNumber": "invoice or PO serial number",
        "issueDate": "YYYY-MM-DD",
        "supplierName": "registered vendor name",
        "taxId": "merchant tax number, if visible",
        "purchaseOrderRef": "referenced PO number if present"
      },
      "items": [
        {
          "description": "line item description",
          "quantity": 10,
          "unitPrice": 120.50,
          "totalPrice": 1205.00
        }
      ],
      "totals": {
        "subtotal": 1205.00,
        "taxAmount": 120.50,
        "shippingCosts": 0,
        "totalAmount": 1325.50,
        "currency": "EUR" | "USD" | "CNY" | "GBP"
      },
      "operationalWarning": "string describing any warning, maths errors, unusual fee additions, mismatching totals, or tax compliance issues. Return null if none."
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
        temperature: 0.1, // High precision required for numbers
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    return {
      documentType: parsed.documentType || "Unknown",
      language: parsed.language || "Unknown",
      metadata: parsed.metadata || {},
      items: parsed.items || [],
      totals: {
        subtotal: parsed.totals?.subtotal ?? 0,
        taxAmount: parsed.totals?.taxAmount ?? 0,
        shippingCosts: parsed.totals?.shippingCosts ?? 0,
        totalAmount: parsed.totals?.totalAmount ?? 0,
        currency: parsed.totals?.currency || "EUR",
      },
      operationalWarning: parsed.operationalWarning || null,
    };
  } catch (error) {
    console.error("Failed to parse and extract logistics & finance document via vision:", error);
    throw error;
  }
}
