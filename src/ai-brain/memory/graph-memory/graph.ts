/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type GraphNodeType = "Customer" | "Product" | "Supplier" | "Warehouse" | "Campaign";
export type GraphEdgeType = "Purchased" | "SuppliedBy" | "StoredIn" | "TargetCampaign" | "ManagedBy" | "PromotedIn";

export interface GraphNode {
  id: string;
  type: GraphNodeType;
  label: string;
  properties: Record<string, any>;
}

export interface GraphEdge {
  id: string;
  sourceId: string;
  targetId: string;
  type: GraphEdgeType;
  weight: number;
}

export interface GraphQueryMatch {
  node: GraphNode;
  relationChain: string[];
}

/**
 * Advanced Enterprise Graph Memory Database aligning with Codebase Memory MCP schemas.
 * Maintains transactional networks of retail operations.
 */
export class CommerceGraphMemory {
  private nodes: Map<string, GraphNode> = new Map();
  private edges: GraphEdge[] = [];

  constructor() {
    this.seedDefaultGraph();
  }

  /**
   * Seed standard transactional nodes and edges to model full customer to campaign context
   */
  private seedDefaultGraph(): void {
    // 1. Suppliers
    this.addNode("sup-spain-mills", "Supplier", "Spanish Cotton & Wool Mills", {
      leadTimeDays: 14,
      reliabilityScore: 0.94,
      baseRegion: "Galicia, Spain"
    });
    this.addNode("sup-paris-leather", "Supplier", "Parisian Atelier Leather Co.", {
      leadTimeDays: 7,
      reliabilityScore: 0.98,
      baseRegion: "Île-de-France, France"
    });

    // 2. Warehouses
    this.addNode("wh-le-havre", "Warehouse", "Le Havre Main Maritime Depot", {
      capacityUnits: 15000,
      occupiedUnits: 8400,
      coolingSystem: false
    });
    this.addNode("wh-milan", "Warehouse", "Milan Fast-Dispatch Hub", {
      capacityUnits: 5000,
      occupiedUnits: 3100,
      coolingSystem: true
    });

    // 3. Products
    this.addNode("elysee-wool-jacket", "Product", "Elysée Wool Jacket Premium", {
      sku: "elysee-wool-jacket",
      costPrice: 42.0,
      suggestedPrice: 119.0,
      stockLevel: 120
    });
    this.addNode("monaco-loafers", "Product", "Monaco Suede Loafers", {
      sku: "monaco-loafers",
      costPrice: 55.0,
      suggestedPrice: 169.0,
      stockLevel: 45
    });

    // 4. Marketing Campaigns
    this.addNode("camp-eu-autumn", "Campaign", "VIP Autumn Ensemble Push 2026", {
      dailyBudgetEuro: 350.0,
      channel: "Instagram Ads",
      roiTarget: 2.5
    });

    // 5. High-Value Customers
    this.addNode("cust-jean-luxury", "Customer", "Jean-Pierre Durand (VIP)", {
      lifetimeValueEuro: 4320.0,
      demographics: "Paris, FR"
    });

    // --- Wire Up Structured Commercial Edges ---
    // Products supplied by supplier mills
    this.addEdge("sup-spain-mills", "elysee-wool-jacket", "SuppliedBy", 0.95);
    this.addEdge("sup-paris-leather", "monaco-loafers", "SuppliedBy", 0.98);

    // Products stored in warehouses
    this.addEdge("elysee-wool-jacket", "wh-le-havre", "StoredIn", 1.0);
    this.addEdge("monaco-loafers", "wh-milan", "StoredIn", 1.0);

    // Campaigns promoting specific items
    this.addEdge("camp-eu-autumn", "elysee-wool-jacket", "PromotedIn", 0.9);
    this.addEdge("camp-eu-autumn", "monaco-loafers", "PromotedIn", 0.85);

    // Sales conversions matching customer purchase behavior
    this.addEdge("cust-jean-luxury", "elysee-wool-jacket", "Purchased", 1.0);
  }

  public addNode(id: string, type: GraphNodeType, label: string, properties: Record<string, any> = {}): void {
    this.nodes.set(id, { id, type, label, properties });
  }

  public addEdge(sourceId: string, targetId: string, type: GraphEdgeType, weight: number = 1.0): void {
    const id = `edge-${sourceId}-${targetId}-${type}`;
    if (!this.edges.some(e => e.id === id)) {
      this.edges.push({ id, sourceId, targetId, type, weight });
    }
  }

  public getNodes(): GraphNode[] {
    return Array.from(this.nodes.values());
  }

  public getEdges(): GraphEdge[] {
    return this.edges;
  }

  /**
   * Search query based traversing to find semantic pathways
   * e.g., Finding how a customer maps to suppliers.
   */
  public findTransitiveLinks(startNodeId: string, depth: number = 2): GraphQueryMatch[] {
    const matches: GraphQueryMatch[] = [];
    const visited = new Set<string>();

    const search = (currentId: string, path: string[], currentDepth: number) => {
      if (currentDepth > depth) return;
      visited.add(currentId);

      // Find all adjacent edges
      const adjEdges = this.edges.filter(e => e.sourceId === currentId || e.targetId === currentId);

      for (const edge of adjEdges) {
        const neighborId = edge.sourceId === currentId ? edge.targetId : edge.sourceId;
        if (visited.has(neighborId)) continue;

        const neighborNode = this.nodes.get(neighborId);
        if (neighborNode) {
          const relationship = `${edge.sourceId === currentId ? "-->" : "<--"}[${edge.type}]`;
          const newPath = [...path, relationship, neighborNode.label];
          
          matches.push({
            node: neighborNode,
            relationChain: newPath
          });

          search(neighborId, newPath, currentDepth + 1);
        }
      }
    };

    const startNode = this.nodes.get(startNodeId);
    if (startNode) {
      search(startNodeId, [startNode.label], 1);
    }
    return matches;
  }

  /**
   * Performs an MCP code context lookup to match entity query nodes
   */
  public queryByProperty(key: string, value: any): GraphNode[] {
    return this.getNodes().filter(n => n.properties[key] === value);
  }
}
