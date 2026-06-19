export interface VisualKnowledgeRecord {
  id: string;
  imageDescription: string;
  category: string;
  matchedSku: string;
  confidenceScore: number;
  inventorySource: "FactoryWarehouse" | "SupplierFrance" | "SupplierItaly" | "LocalStore";
}

/**
 * Multi-modal RAG allows searching, ranking, and matching product image descriptors with textual inventory records.
 */
export class MultimodalRagEngine {
  private static visualKnowledgeBase: VisualKnowledgeRecord[] = [
    {
      id: "v-knox-1",
      imageDescription: "Premium double-wall vacuum insulated stainless steel drinking flask with black powder coating and leak-proof cap.",
      category: "Tumbler/Accessories",
      matchedSku: "HYDROFLASK-M01",
      confidenceScore: 0.98,
      inventorySource: "FactoryWarehouse"
    },
    {
      id: "v-knox-2",
      imageDescription: "Ergonomic white noise-cancelling open-ear sports headphones with charging capsule, featuring battery percentage indicators.",
      category: "Electronics",
      matchedSku: "WIRELESS-EARBUDS-E01",
      confidenceScore: 0.96,
      inventorySource: "LocalStore"
    },
    {
      id: "v-knox-3",
      imageDescription: "Sleek, minimalist matte gray desktop light stand with circular top halo diffuser, soft color temperature control knobs on white cord.",
      category: "Lighting/Home Decor",
      matchedSku: "SMART-GLOW-LAMP-L01",
      confidenceScore: 0.94,
      inventorySource: "SupplierFrance"
    },
    {
      id: "v-knox-4",
      imageDescription: "Luxury woven wool-blend light beige apparel coat or sports jacket with wooden buttons, elegant lapels, French cuff tailoring.",
      category: "Apparel/Jackets",
      matchedSku: "WOOL-JACKET-W01",
      confidenceScore: 0.91,
      inventorySource: "SupplierItaly"
    }
  ];

  /**
   * Performs semantic-visual matching across registered commercial catalogs
   */
  public static queryVisualMatches(queryImageDescriptor: string): VisualKnowledgeRecord[] {
    const queryWords = queryImageDescriptor.toLowerCase().split(/\s+/);
    
    return this.visualKnowledgeBase
      .map(record => {
        let matches = 0;
        const descWords = record.imageDescription.toLowerCase();
        for (const word of queryWords) {
          if (word.length > 3 && descWords.includes(word)) {
            matches++;
          }
        }
        
        // Simulating fine-grained cosine similarity calculation
        const tfidfAdjustment = Math.min(1.0, 0.4 + (matches * 0.15));
        const finalConfidence = Math.round((record.confidenceScore * tfidfAdjustment) * 100) / 100;

        return {
          ...record,
          confidenceScore: Math.min(0.99, Math.max(0.32, finalConfidence))
        };
      })
      .sort((a, b) => b.confidenceScore - a.confidenceScore);
  }

  /**
   * Dynamically appends a new parsed model analysis into the visual visualKnowledgeBase
   */
  public static insertVisualRecord(
    description: string,
    category: string,
    matchedSku: string,
    source: "FactoryWarehouse" | "SupplierFrance" | "SupplierItaly" | "LocalStore"
  ): VisualKnowledgeRecord {
    const newRecord: VisualKnowledgeRecord = {
      id: `v-knox-${Date.now()}`,
      imageDescription: description,
      category,
      matchedSku,
      confidenceScore: 0.95,
      inventorySource: source
    };
    this.visualKnowledgeBase.push(newRecord);
    return newRecord;
  }
}
