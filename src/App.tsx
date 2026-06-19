/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  RotateCw,
  Terminal,
  Cpu,
  Bookmark,
  TrendingUp,
  Sliders,
  ShieldCheck,
  Zap,
  CheckCircle2,
  XCircle,
  HelpCircle,
  FolderOpen,
  Image,
  FileText,
  Eye,
  Upload,
  Sparkles,
  AlertTriangle,
  Search,
  Plus
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Product, TraceEvent, AgentState, ExperiencePattern } from "./types";
import CEOBrainHub from "./components/CEOBrainHub";
import FashionIntelHub from "./components/FashionIntelHub";

export default function App() {
  // Input goal text
  const [objective, setObjective] = useState<string>(
    "Optimize prices and clear excess stock for HydroFlask and Wireless Earbuds to maintain a 25% profit margin."
  );

  // Connection & Run states
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [sseConnected, setSseConnected] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<string>("");

  // System states (Read directly from API)
  const [products, setProducts] = useState<Product[]>([]);
  const [marketDemands, setMarketDemands] = useState<any[]>([]);
  const [agents, setAgents] = useState<AgentState[]>([]);
  const [experiences, setExperiences] = useState<ExperiencePattern[]>([]);

  // Local trace event streams
  const [traces, setTraces] = useState<TraceEvent[]>([]);
  const [executionPlan, setExecutionPlan] = useState<any | null>(null);

  // Auto-scroll ref for streaming console logs
  const consoleBottomRef = useRef<HTMLDivElement>(null);

  // Tab control states: "ceo_brain" as default and main hub
  const [activeMainTab, setActiveMainTab] = useState<"ceo_brain" | "orchestrator" | "forecasting" | "know_graph" | "safety_sandbox" | "vision" | "fashion_intel">("ceo_brain");

  // TimesFM zero-shot forecasting tab states
  const [timesFMProduct, setTimesFMProduct] = useState<string>("elysee-wool-jacket");
  const [timesFMData, setTimesFMData] = useState<any | null>(null);
  const [timesFMLoading, setTimesFMLoading] = useState<boolean>(false);

  // Graph Memory state variables
  const [graphNodes, setGraphNodes] = useState<any[]>([]);
  const [graphEdges, setGraphEdges] = useState<any[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string>("cust-jean-luxury");
  const [graphTraverseMatches, setGraphTraverseMatches] = useState<any[]>([]);
  const [graphLoading, setGraphLoading] = useState<boolean>(false);

  // Sandboxed Shadow execution variables
  const [shadowTxHistory, setShadowTxHistory] = useState<any[]>([]);
  const [sandboxSku, setSandboxSku] = useState<string>("elysee-wool-jacket");
  const [sandboxAction, setSandboxAction] = useState<"PRICE_ADJUST" | "INVENTORY_RESTOCK">("PRICE_ADJUST");
  const [sandboxVal, setSandboxVal] = useState<string>("119.00");
  const [sandboxStatusMsg, setSandboxStatusMsg] = useState<string | null>(null);
  const [sandboxLoading, setSandboxLoading] = useState<boolean>(false);

  // Load Zero-shot TimesFM projection
  const handleLoadTimesFM = async (sku: string) => {
    setTimesFMLoading(true);
    try {
      const res = await fetch(`/api/timesfm/forecast?skuId=${sku}`);
      const data = await res.json();
      if (data.status === "success") {
        setTimesFMData(data.projection);
      }
    } catch (err) {
      console.error("Failed to load TimesFM forecasting:", err);
    } finally {
      setTimesFMLoading(false);
    }
  };

  // Load Graph Memory elements
  const handleLoadGraphMemory = async () => {
    setGraphLoading(true);
    try {
      const res = await fetch("/api/graph-memory/visualize");
      const data = await res.json();
      setGraphNodes(data.nodes || []);
      setGraphEdges(data.edges || []);
      
      // Perform initial traverse mapping on first customerVIP
      const matchingTraverse = queryTransitiveLinks(data.nodes, data.edges, selectedNodeId, 2);
      setGraphTraverseMatches(matchingTraverse);
    } catch (err) {
      console.error("Failed to fetch Knowledge Graph Memory:", err);
    } finally {
      setGraphLoading(false);
    }
  };

  // Traverse algorithm emulation on frontend-side graph state for instantaneous feedback
  const queryTransitiveLinks = (allNodes: any[], allEdges: any[], startId: string, maxDepth: number = 2) => {
    const matches: any[] = [];
    const visited = new Set<string>();

    const search = (currId: string, path: string[], depth: number) => {
      if (depth > maxDepth) return;
      visited.add(currId);

      const adj = allEdges.filter((e: any) => e.sourceId === currId || e.targetId === currId);
      for (const edge of adj) {
        const neighborId = edge.sourceId === currId ? edge.targetId : edge.sourceId;
        if (visited.has(neighborId)) continue;

        const neighborNode = allNodes.find((n: any) => n.id === neighborId);
        if (neighborNode) {
          const relationship = `${edge.sourceId === currId ? "-->" : "<--"}[${edge.type}]`;
          const newPath = [...path, relationship, neighborNode.label];
          matches.push({
            node: neighborNode,
            relationChain: newPath,
          });
          search(neighborId, newPath, depth + 1);
        }
      }
    };

    const start = allNodes.find((n: any) => n.id === startId);
    if (start) {
      search(startId, [start.label], 1);
    }
    return matches;
  };

  // Handle graph traverse selections
  const handleNodeTraverseChange = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    const matches = queryTransitiveLinks(graphNodes, graphEdges, nodeId, 2);
    setGraphTraverseMatches(matches);
  };

  // Submit sandboxed dry-run execution
  const executeSandboxTransaction = async () => {
    setSandboxLoading(true);
    setSandboxStatusMsg(null);
    try {
      const res = await fetch("/api/shadow/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skuId: sandboxSku,
          actionType: sandboxAction,
          value: parseFloat(sandboxVal),
        }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setShadowTxHistory((prev) => [data.txResult, ...prev]);
        setSandboxStatusMsg(`Transaction ${data.txResult.transactionId} executed in SHADOW. Audit: ${data.txResult.isPassedSandboxAudit ? "PASSED" : "REJECTED (Violates governance rules)"}`);
        fetchSystemState(); // reload core details
      } else {
        setSandboxStatusMsg(`Execution Error: ${data.error}`);
      }
    } catch (err: any) {
      setSandboxStatusMsg(`Failed to submit: ${err.message}`);
    } finally {
      setSandboxLoading(false);
    }
  };

  // Revert / Rollback transaction state
  const rollbackTransaction = async (txId: string) => {
    try {
      const res = await fetch("/api/shadow/rollback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId: txId }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setShadowTxHistory((prev) =>
          prev.map((tx) => (tx.transactionId === txId ? data.txResult : tx))
        );
        setSandboxStatusMsg(`Successfully executed compensation ROLLBACK of transaction ${txId}. Store state restored.`);
        fetchSystemState(); // Reload prices to pristine states
      }
    } catch (err) {
      console.error("Failed to rollback sandbox transaction:", err);
    }
  };

  const handleTriggerRestock = async (sku: string, qty: number) => {
    try {
      const res = await fetch("/api/shadow/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skuId: sku,
          actionType: "INVENTORY_RESTOCK",
          value: qty,
        }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setShadowTxHistory((prev) => [data.txResult, ...prev]);
        fetchSystemState(); // reload core details
      }
    } catch (err) {
      console.error("Failed to commit sandbox restock action:", err);
    }
  };

  // Fetch initial forecast and graph memory triggers on tab select
  useEffect(() => {
    if (activeMainTab === "forecasting") {
      handleLoadTimesFM(timesFMProduct);
    } else if (activeMainTab === "know_graph") {
      handleLoadGraphMemory();
    }
  }, [activeMainTab]);

  useEffect(() => {
    if (activeMainTab === "forecasting") {
      handleLoadTimesFM(timesFMProduct);
    }
  }, [timesFMProduct]);


  // Vision Layer state engines
  const [selectedVisionTask, setSelectedVisionTask] = useState<"PRODUCT_INSPECT" | "DOCUMENT_OCR" | "CHART_ANALYZE">("PRODUCT_INSPECT");
  const [visionFileBase64, setVisionFileBase64] = useState<string | null>(null);
  const [visionFileMimeType, setVisionFileMimeType] = useState<string | null>(null);
  const [visionPreviewUrl, setVisionPreviewUrl] = useState<string | null>(null);
  const [visionContextPrompt, setVisionContextPrompt] = useState<string>("");
  const [visionLoading, setVisionLoading] = useState<boolean>(false);
  const [visionError, setVisionError] = useState<string | null>(null);
  const [visionResult, setVisionResult] = useState<any | null>(null);

  const handleVisionAnalyze = async () => {
    if (!visionFileBase64 || !visionFileMimeType) {
      setVisionError("Please drag and drop or upload an image file first.");
      return;
    }
    setVisionLoading(true);
    setVisionError(null);
    setVisionResult(null);

    try {
      const res = await fetch("/api/vision/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: selectedVisionTask,
          base64Image: visionFileBase64,
          mimeType: visionFileMimeType,
          contextPrompt: visionContextPrompt,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to analyze image via multi-modal vision cloud model.");
      }

      const data = await res.json();
      setVisionResult(data);
    } catch (err: any) {
      console.error(err);
      setVisionError(err.message || "Failed to query the e-commerce image understanding system.");
    } finally {
      setVisionLoading(false);
    }
  };

  const handleLoadDemo = (type: "PRODUCT_INSPECT" | "DOCUMENT_OCR" | "CHART_ANALYZE") => {
    setSelectedVisionTask(type);
    setVisionError(null);
    
    let svgUrl = "";
    if (type === "PRODUCT_INSPECT") {
      svgUrl = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="100%" height="100%" fill="%230f172a"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="%2322d3ee" font-family="sans-serif" font-weight="bold" font-size="14">ELYSEE_BLAZER_INSPECT.JPG</text></svg>`;
      setVisionContextPrompt("Focus brand inspection on Paris tailoring guidelines");
      setVisionResult({
        taskEvaluated: "PRODUCT_INSPECT",
        timestamp: new Date().toISOString(),
        parsedImageMeta: {
          productName: "Elysée Premium Wool Blazer",
          category: "Apparel & Jackets",
          attributes: {
            color: "Muted Light Beige",
            material: "85% Merino Wool, 15% Cashmere Blend",
            style: "Modern French lapel, luxury minimalist",
            targetAudience: "HNW corporate professionals & luxury fashion enthusiasts"
          },
          generatedTitle: "Elysée Men's Premium Merino Wool Blazer - Tailored Cashmere Blend Luxury Jacket",
          generatedDescription: "Experience unmatched Parisian tailoring. Crafted from a premium grade Merino wool and pure cashmere blend, this blazer features custom hand-stitched French lapels, durable mock horn buttons, and a structured classic drape. Ideal for trans-seasonal corporate wear or refined weekend coordination.",
          qualityReview: {
            qualityCheckPassed: true,
            issuesDetected: ["None. Hem stitching and brand placement fully inspects passed."],
            shelfSuitabilityScore: 98
          },
          brandDetection: {
            detectedBrand: "Elysée Atelier",
            brandConsistencyScore: 95
          }
        },
        vectorMatches: [
          {
            id: "v-knox-4",
            imageDescription: "Luxury woven wool-blend light beige apparel coat or sports jacket with wooden buttons, elegant lapels, French cuff tailoring.",
            category: "Apparel/Jackets",
            matchedSku: "WOOL-JACKET-W01",
            confidenceScore: 0.94,
            inventorySource: "SupplierItaly"
          }
        ]
      });
    } else if (type === "DOCUMENT_OCR") {
      svgUrl = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="100%" height="100%" fill="%230f172a"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="%23f472b6" font-family="sans-serif" font-weight="bold" font-size="14">WOOLEN_MILLS_INV.PDF</text></svg>`;
      setVisionContextPrompt("Audit for unapproved freight surcharges and tax-item math errors");
      setVisionResult({
        taskEvaluated: "DOCUMENT_OCR",
        timestamp: new Date().toISOString(),
        parsedDocumentMeta: {
          documentType: "Invoice",
          language: "fr",
          metadata: {
            documentNumber: "INV-2026-8809",
            issueDate: "2026-06-12",
            supplierName: "Moulins de Laine Français Ltée",
            taxId: "FR-982374981",
            purchaseOrderRef: "PO-9912A"
          },
          items: [
            {
              description: "Superfine 160s Merino Wool fabric rolls (Beige)",
              quantity: 12,
              unitPrice: 485.00,
              totalPrice: 5820.00
            },
            {
              description: "Italian Cashmere Thread spools",
              quantity: 25,
              unitPrice: 38.00,
              totalPrice: 950.00
            },
            {
              description: "Horn-craft buttons (Medium packs)",
              quantity: 10,
              unitPrice: 15.00,
              totalPrice: 150.00
            }
          ],
          totals: {
            subtotal: 6920.00,
            taxAmount: 1384.00,
            shippingCosts: 216.00,
            totalAmount: 8520.00,
            currency: "EUR"
          },
          operationalWarning: "Warning: Supplier added 216.00 EUR 'Premium Freight Surcharge' not in original PO reference. Discrepancy detected between standard shipping contract rate and billed total."
        }
      });
    } else {
      svgUrl = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="100%" height="100%" fill="%230f172a"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="%23fbbf24" font-family="sans-serif" font-weight="bold" font-size="14">META_AD_FATIGUE_ROAS.PNG</text></svg>`;
      setVisionContextPrompt("Identify performance caps on organic vs paid France distribution");
      setVisionResult({
        taskEvaluated: "CHART_ANALYZE",
        timestamp: new Date().toISOString(),
        parsedChartMeta: {
          chartTitle: "Meta Conversions & ROAS (French Market Summer Jacket Campaign)",
          sourceDashboardType: "Meta Business Manager",
          dataExtracted: [
            { "seriesName": "Ad Spend Value", "variable": "Spend Value", "trendDirection": "increasing", "estimatedValue": "€4,200/Week" },
            { "seriesName": "ROAS (Return on Ad Spend)", "variable": "Return Coefficient", "trendDirection": "decreasing", "estimatedValue": "1.34x (Target 2.50x)" },
            { "seriesName": "Cost Per Click (CPC)", "variable": "Unit CPC", "trendDirection": "increasing", "estimatedValue": "€1.48 (Was €0.92)" }
          ],
          detectedAnomalies: [
            "Severe Ad Fatigue Detected: CTR dropped by 24% after week 3 of summer jacket campaign.",
            "Budget Spillover: Spent €850 on Sunday night with 0 conversions on high CPC bids in France."
          ],
          strategicInsights: [
            "Paris and Lyon CTRs are saturated. Users are ignoring the static beach-view creative overlays.",
            "Current 1.34x ROAS is rendering the €4,200 ad spend highly margin-dilutive (CFO warning zone)."
          ],
          recommendedDecisions: [
            {
              "title": "Pause Saturated Creative Sets",
              "actionRequired": "Immediately pause the 'Static Beach Summer' ad set in the France region account.",
              "expectedGainEstimate": "Save €1,800/Week wasteful capital burn"
            },
            {
              "title": "Redeploy to Low-Stock High-Margin bundle",
              "actionRequired": "Launch an active Dynamic Catalog Ad set featuring high-margin Elysée Wool Blazers bundled.",
              "expectedGainEstimate": "+€3,200 net margin recovery in 7 days"
            }
          ]
        }
      });
    }

    setVisionPreviewUrl(svgUrl);
    setVisionFileBase64("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7");
    setVisionFileMimeType("image/svg+xml");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setVisionError(null);
    setVisionResult(null);
    setVisionFileMimeType(file.type);
    
    const previewUrl = URL.createObjectURL(file);
    setVisionPreviewUrl(previewUrl);

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      setVisionFileBase64(base64);
    };
    reader.onerror = () => {
      setVisionError("Failed to convert image for upload.");
    };
    reader.readAsDataURL(file);
  };

  // Fetch stateful system DBs from backend
  const fetchSystemState = async () => {
    try {
      const [prodRes, demRes, agentRes, expRes] = await Promise.all([
        fetch("/api/commerce/products").then((r) => r.json()),
        fetch("/api/commerce/demands").then((r) => r.json()),
        fetch("/api/agents/status").then((r) => r.json()),
        fetch("/api/memory/experiences").then((r) => r.json()),
      ]);

      setProducts(prodRes.products || []);
      setMarketDemands(demRes.demands || []);
      setAgents(agentRes.agents || []);
      setExperiences(expRes.experiences || []);
    } catch (err) {
      console.error("Failed to query full-stack backend state API:", err);
    }
  };

  useEffect(() => {
    fetchSystemState();
  }, []);

  useEffect(() => {
    if (consoleBottomRef.current) {
      consoleBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [traces]);

  // Execute Goal utilizing real-time SSE stream
  const executeObjective = () => {
    if (!objective.trim() || isRunning) return;

    setIsRunning(true);
    setTraces([]);
    setExecutionPlan(null);
    setCurrentStep("");

    const encodedObjective = encodeURIComponent(objective);
    const eventSource = new EventSource(`/api/stream-trace?objective=${encodedObjective}`);

    eventSource.onopen = () => {
      setSseConnected(true);
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.connected) {
          setTraces((prev) => [
            ...prev,
            {
              id: "sse-init",
              timestamp: new Date().toISOString(),
              stage: "planner",
              message: "Connected to Server-Sent-Events (SSE) Stream. Commencing Core Orchestrator execution loop...",
            },
          ]);
          return;
        }

        if (data.completed) {
          eventSource.close();
          setIsRunning(false);
          setSseConnected(false);
          setCurrentStep("Completed");
          fetchSystemState(); // Dynamic reload backend state post-execution
          return;
        }

        if (data.error) {
          setTraces((prev) => [
            ...prev,
            {
              id: "err-init",
              timestamp: new Date().toISOString(),
              stage: "reflection",
              message: `CRITICAL EXECUTION ERROR: ${data.error}`,
            },
          ]);
          eventSource.close();
          setIsRunning(false);
          setSseConnected(false);
          return;
        }

        // Handle specific planner steps visualization
        if (data.stage === "planner" && data.data?.steps) {
          setExecutionPlan(data.data);
        }

        // Live task progression updater
        if (data.stage === "execution" && data.agent) {
          setCurrentStep(`${data.agent}: ${data.message}`);
        }

        // Add to streaming trace logs
        setTraces((prev) => [...prev, data]);
        fetchSystemState(); // Instant telemetry update
      } catch (err) {
        console.error("Failed parsing message chunk:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE stream error:", err);
      eventSource.close();
      setIsRunning(false);
      setSseConnected(false);
    };
  };

  // Preset triggers (pushed directly as raw goals)
  const presets = [
    "Increase HydroFlask tumbler velocity through clearance bundling; ensure final net margins remain above 10%.",
    "SmartGlow Bedside Lamp overstock markdown strategy paired with competitor matching protection tiers.",
    "Verify pricing and lift order margin trends across apparel shoes while stock values range below safety stock thresholds.",
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* 1. Technical Diagnostic Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shrink-0 transition-all">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-cyan-500 to-indigo-600 rounded-lg shadow-lg shadow-cyan-500/10 border border-cyan-400/20">
            <Cpu className="w-6 h-6 text-cyan-200 animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white font-mono flex items-center gap-2">
              AI Commerce OS <span className="text-xs px-2 py-0.5 bg-slate-800 border border-slate-700 text-slate-400 rounded-full font-sans font-medium">v1.2 Core</span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">Autonomous Agent & Decoupled LLM-Brain Controller Panel</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 md:gap-4 font-mono text-xs text-slate-400">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 rounded-md border border-slate-800">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Stream:</span>
            <span className={`inline-block w-2.5 h-2.5 rounded-full ${isRunning ? "bg-emerald-500 animate-ping" : "bg-slate-700"}`} />
            <span className={isRunning ? "text-emerald-400" : "text-slate-500"}>
              {isRunning ? "STREAMING" : "IDLE"}
            </span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 rounded-md border border-slate-800">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">SSE Conn:</span>
            <span className={`inline-block w-2.5 h-2.5 rounded-full ${sseConnected ? "bg-cyan-400" : "bg-slate-700"}`} />
            <span className={sseConnected ? "text-cyan-400" : "text-slate-500"}>
              {sseConnected ? "ACTIVE" : "STANDBY"}
            </span>
          </div>

          <button
            onClick={fetchSystemState}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-slate-200 rounded-md border border-slate-700 transition cursor-pointer"
            title="Refresh transactional database state"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>SYNC</span>
          </button>
        </div>
      </header>

      {/* 2. Primary Layout Framework (Three panels grid) */}
      <main className="flex-1 w-full max-w-[1700px] mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6 overflow-hidden">
        
        {/* PANEL A: Input Objectives & Controllers (Thin Client Client-to-API Boundary) */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-5 flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-white tracking-wide uppercase font-mono flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" /> Objective Input
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Define a dynamic commercial directive. This prompt will be routed to the Master Planner to generate procedural agent tasks.
            </p>

            <textarea
              id="objective-input"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              disabled={isRunning}
              className="w-full h-32 bg-slate-950/85 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 resize-none font-sans leading-relaxed focus:ring-1 focus:ring-cyan-500/20 disabled:opacity-50"
              placeholder="State a high-level operational objective..."
            />

            <button
              onClick={executeObjective}
              disabled={isRunning || !objective.trim()}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-mono font-medium rounded-lg text-sm transition shadow-lg shadow-cyan-550/15 disabled:opacity-50 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>DISPATCH ENGINE</span>
            </button>
          </div>

          <div className="bg-slate-900/40 rounded-xl border border-slate-800/80 p-5 flex flex-col gap-3">
            <h3 className="text-xs font-semibold text-slate-300 font-mono tracking-wider uppercase">Strategic Presets</h3>
            <div className="flex flex-col gap-2.5">
              {presets.map((p, i) => (
                <button
                  key={i}
                  onClick={() => setObjective(p)}
                  disabled={isRunning}
                  className="w-full text-left p-2.5 bg-slate-950/40 hover:bg-slate-900 border border-slate-800/60 hover:border-slate-700/80 text-xs text-slate-400 hover:text-slate-200 rounded-md transition duration-200 leading-relaxed disabled:opacity-40 text-ellipsis overflow-hidden"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* PANEL B: Dynamic Cognitive Orchestrator & Sensory Vision Center */}
        <div className="lg:col-span-2 flex flex-col gap-6 h-full min-h-[500px]">
          
          {/* Main Visual/Process Tab Controls */}
          <div className="flex flex-wrap border border-slate-800 bg-slate-900/50 p-1 rounded-xl gap-1 shrink-0 font-mono text-xs">
            <button
              onClick={() => setActiveMainTab("ceo_brain")}
              className={`flex-1 min-w-[130px] flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg font-bold transition duration-200 cursor-pointer ${
                activeMainTab === "ceo_brain"
                  ? "bg-gradient-to-r from-slate-800 to-slate-900 text-cyan-400 shadow-sm border border-cyan-500/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-950/40 text-slate-400"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>🚀 CEO BRAIN</span>
            </button>

            <button
              onClick={() => setActiveMainTab("orchestrator")}
              className={`flex-1 min-w-[130px] flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg font-bold transition duration-200 cursor-pointer ${
                activeMainTab === "orchestrator"
                  ? "bg-gradient-to-r from-slate-800 to-slate-900 text-cyan-400 shadow-sm border border-cyan-500/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-950/40 text-slate-400"
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>🧠 ORCHESTRATOR</span>
            </button>

            <button
              onClick={() => setActiveMainTab("forecasting")}
              className={`flex-1 min-w-[130px] flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg font-bold transition duration-200 cursor-pointer ${
                activeMainTab === "forecasting"
                  ? "bg-gradient-to-r from-slate-800 to-slate-900 text-cyan-400 shadow-sm border border-cyan-500/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-950/40 text-slate-400"
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-rose-400" />
              <span>📉 TIMESFM</span>
            </button>

            <button
              onClick={() => setActiveMainTab("know_graph")}
              className={`flex-1 min-w-[130px] flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg font-bold transition duration-200 cursor-pointer ${
                activeMainTab === "know_graph"
                  ? "bg-gradient-to-r from-slate-800 to-slate-900 text-cyan-400 shadow-sm border border-cyan-500/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-950/40 text-slate-400"
              }`}
            >
              <Search className="w-3.5 h-3.5 text-indigo-400" />
              <span>🕸️ GRAPH MEMORY</span>
            </button>

            <button
              onClick={() => setActiveMainTab("safety_sandbox")}
              className={`flex-1 min-w-[130px] flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg font-bold transition duration-200 cursor-pointer ${
                activeMainTab === "safety_sandbox"
                  ? "bg-gradient-to-r from-slate-800 to-slate-900 text-cyan-400 shadow-sm border border-cyan-500/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-950/40 text-slate-400"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>🛡️ SHADOW SANDBOX</span>
            </button>

            <button
              onClick={() => setActiveMainTab("vision")}
              className={`flex-1 min-w-[130px] flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg font-bold transition duration-200 cursor-pointer ${
                activeMainTab === "vision"
                  ? "bg-gradient-to-r from-slate-800 to-slate-900 text-cyan-400 shadow-sm border border-cyan-500/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-950/40 text-slate-400"
              }`}
            >
              <Image className="w-3.5 h-3.5" />
              <span className="relative">
                📷 VISION
                <span className="absolute top-1 -right-2 w-1 h-1 rounded-full bg-cyan-400 animate-pulse" />
              </span>
            </button>

            <button
              onClick={() => setActiveMainTab("fashion_intel")}
              className={`flex-1 min-w-[130px] flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg font-bold transition duration-200 cursor-pointer ${
                activeMainTab === "fashion_intel"
                  ? "bg-gradient-to-r from-slate-800 to-slate-900 text-cyan-400 shadow-sm border border-cyan-500/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-950/40 text-slate-400"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              <span>🧥 FASHION INTEL</span>
            </button>
          </div>

          {activeMainTab === "ceo_brain" && (
            <CEOBrainHub
              products={products}
              onTriggerRestock={handleTriggerRestock}
              onTriggerPreset={(preset) => {
                setObjective(preset);
                setActiveMainTab("orchestrator");
              }}
              isRunning={isRunning}
            />
          )}

          {activeMainTab === "orchestrator" && (
            <>
              {/* Active Process Step Dashboard */}
              <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-4 shrink-0">
                <h2 className="text-xs font-medium text-slate-400 font-mono uppercase tracking-wider">Operational Focus</h2>
                <div className="flex items-center gap-3 mt-2 font-mono">
                  <div className={`p-1.5 rounded bg-slate-950 border border-slate-800 ${isRunning ? "text-cyan-400 animate-spin" : "text-slate-600"}`}>
                    <Terminal className="w-4 h-4" />
                  </div>
                  <div className="text-sm font-semibold truncate text-white">
                    {isRunning ? currentStep || "Running diagnostics..." : "Steady State Monitoring"}
                  </div>
                </div>
              </div>

              {/* Stream Logs Output */}
              <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl flex flex-col overflow-hidden min-h-[300px]">
                <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">COGNITIVE ENGINE TRACE STREAM</span>
                  <span className="text-cyan-500/80 hover:text-cyan-400 transition cursor-pointer" onClick={() => setTraces([])}>
                    Clear
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 font-mono text-xs">
                  {traces.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-600 py-10">
                      <Terminal className="w-8 h-8 opacity-40 mb-2 stroke-[1.5]" />
                      <span>Terminal idle. Dispatch an objective to stream live traces.</span>
                    </div>
                  ) : (
                    traces.map((trace) => {
                      const stageStyles: Record<string, string> = {
                        planner: "text-purple-400 bg-purple-500/10 border-purple-500/20",
                        reasoning: "text-amber-400 bg-amber-500/10 border-amber-500/20",
                        decision: "text-sky-400 bg-sky-500/10 border-sky-500/20",
                        execution: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
                        reflection: "text-pink-400 bg-pink-500/10 border-pink-500/20",
                        learning: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
                        memory: "text-teal-400 bg-teal-500/10 border-teal-500/20",
                      };

                      return (
                        <div key={trace.id} className="border-l-2 border-slate-800 pl-3 py-1 bg-slate-900/20 rounded-r-md">
                          <div className="flex flex-wrap items-center gap-2 mb-1.5 text-[10px]">
                            <span className="text-slate-500">
                              {new Date(trace.timestamp).toLocaleTimeString()}
                            </span>
                            <span className={`px-2 py-0.5 border text-[9px] rounded font-bold uppercase tracking-wider ${stageStyles[trace.stage] || "text-slate-400"}`}>
                              {trace.stage}
                            </span>
                            {trace.agent && (
                              <span className="px-1.5 py-0.5 bg-slate-800 text-slate-300 border border-slate-700/80 rounded font-semibold text-[9px]">
                                {trace.agent}
                              </span>
                            )}
                          </div>
                          <p className="text-slate-200 mb-1 leading-relaxed text-sm">{trace.message}</p>

                          {/* Display structural data if appended */}
                          {trace.data && (
                            <pre className="mt-2 text-[11px] bg-slate-900/65 overflow-x-auto p-3 rounded border border-slate-800 max-h-72 leading-relaxed text-slate-400 font-mono">
                              {JSON.stringify(trace.data, null, 2)}
                            </pre>
                          )}
                        </div>
                      );
                    })
                  )}
                  <div ref={consoleBottomRef} />
                </div>
              </div>

              {/* Dependency Decomposition Step Graph Map */}
              {executionPlan && (
                <div className="bg-slate-900/55 rounded-xl border border-slate-800 p-5 flex flex-col gap-3 shrink-0">
                  <h3 className="text-xs font-semibold text-slate-300 font-mono tracking-wider uppercase">Decomposed Execution Steps</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {executionPlan.steps.map((step: any) => (
                      <div
                        key={step.id}
                        className={`p-3 rounded-lg border flex flex-col justify-between gap-2.5 transition ${
                          step.status === "completed"
                            ? "bg-emerald-950/20 border-emerald-800/40"
                            : step.status === "failed"
                            ? "bg-rose-950/20 border-rose-800/40"
                            : "bg-slate-950 border-slate-800"
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span className="text-slate-500 font-bold">{step.id}</span>
                          <span className="px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded text-[9px] font-medium border border-slate-700">
                            {step.assignedAgent}
                          </span>
                        </div>
                        <div className="font-sans text-xs text-slate-200 line-clamp-2 leading-snug">{step.title}</div>
                        <div className="flex items-center gap-1 mt-1 text-[10px] font-mono font-bold">
                          {step.status === "completed" ? (
                            <span className="text-emerald-400 flex items-center gap-1 uppercase tracking-wider text-[9px]">
                              <CheckCircle2 className="w-3 h-3" /> COMMITTED
                            </span>
                          ) : step.status === "failed" ? (
                            <span className="text-rose-400 flex items-center gap-1 uppercase tracking-wider text-[9px]">
                              <XCircle className="w-3 h-3" /> BYPASSED
                            </span>
                          ) : (
                            <span className="text-slate-500 tracking-wider">PENDING</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* TIMESFM FORECASTER SYSTEM (Tier 3-7 Forecasting) */}
          {activeMainTab === "forecasting" && (
            <div className="flex-1 bg-slate-900/40 rounded-xl border border-slate-800 p-5 flex flex-col gap-6 overflow-y-auto min-h-[450px]">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2 tracking-wide uppercase">
                    <span className="text-rose-400">📈</span> TIMESFM ZERO-SHOT TIME-SERIES PREDICTOR
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Google Research's Patch-Based Transformer architecture for deep temporal sequence forecasting</p>
                </div>

                <div className="flex items-center gap-2.5">
                  <label className="text-[11px] font-mono font-bold text-slate-500 uppercase">Select Target:</label>
                  <select
                    value={timesFMProduct}
                    onChange={(e) => setTimesFMProduct(e.target.value)}
                    className="bg-slate-950 font-mono text-xs border border-slate-800 rounded px-2 py-1.5 text-slate-200 outline-none focus:border-rose-500"
                  >
                    <option value="elysee-wool-jacket">Elysée Premium Wool Jacket</option>
                    <option value="monaco-loafers">Monaco Suede Loafers</option>
                  </select>
                </div>
              </div>

              {/* Architecture specs banner */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800/80 font-mono text-[11px]">
                  <div className="text-slate-500">Foundation weights</div>
                  <div className="text-rose-400 font-bold mt-0.5">timesfm-base-2.0</div>
                </div>
                <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800/80 font-mono text-[11px]">
                  <div className="text-slate-500">Patching architecture</div>
                  <div className="text-slate-300 font-bold mt-0.5">32 Sequence Patch Length</div>
                </div>
                <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800/80 font-mono text-[11px]">
                  <div className="text-slate-500">Zero-Shot Performance</div>
                  <div className="text-emerald-400 font-bold mt-0.5">0.214 MAE Mean Deviation</div>
                </div>
                <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800/80 font-mono text-[11px]">
                  <div className="text-slate-500">Forecast quantiles</div>
                  <div className="text-cyan-400 font-bold mt-0.5">p10 (Low) | p50 (Med) | p90 (High)</div>
                </div>
              </div>

              {timesFMLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-500 py-16">
                  <div className="w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                  <span className="font-mono text-xs">Computing patches & matrix weights...</span>
                </div>
              ) : timesFMData ? (
                <div className="flex-col gap-5 flex">
                  {/* Detailed Multi-quantile forecast metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-850">
                      <div className="text-[10px] uppercase font-mono font-bold tracking-widest text-slate-500">p10 Quantile Forecast (Conservative demand)</div>
                      <div className="text-2xl font-bold font-mono text-rose-300/90 mt-1">{(timesFMData.timesFMForecast.p10 * 30).toFixed(0)} <span className="text-xs text-slate-500">units / Mo</span></div>
                      <p className="text-[11px] text-slate-400 mt-1 leading-snug">Lower-bound projection with 90% likelihood of overperformance.</p>
                    </div>

                    <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-850">
                      <div className="text-[10px] uppercase font-mono font-bold tracking-widest text-slate-500">p50 Quantile Forecast (Expected trend)</div>
                      <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">{(timesFMData.timesFMForecast.p50 * 30).toFixed(0)} <span className="text-xs text-slate-500">units / Mo</span></div>
                      <p className="text-[11px] text-slate-400 mt-1 leading-snug">Median baseline projection aligning with historical elasticity indices.</p>
                    </div>

                    <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-850">
                      <div className="text-[10px] uppercase font-mono font-bold tracking-widest text-slate-500">p90 Quantile Forecast (Upside scale potential)</div>
                      <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">{(timesFMData.timesFMForecast.p90 * 30).toFixed(0)} <span className="text-xs text-slate-500">units / Mo</span></div>
                      <p className="text-[11px] text-slate-400 mt-1 leading-snug">Upper boundary cap mapping peak promotional response levels.</p>
                    </div>
                  </div>

                  {/* ASCII Temporal Trend Line Graphic */}
                  <div className="bg-slate-950/90 border border-slate-800 p-4 rounded-xl font-mono text-[11px] leading-relaxed text-slate-400">
                    <div className="flex items-center justify-between border-b border-slate-900 pb-2 mb-3 text-slate-500">
                      <span>TIME-SERIES VISUALIZER (30-DAY RESOLUTION)</span>
                      <span>TimesFM-ZeroShot-Engine v2</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-4">
                        <span className="w-16 shrink-0 text-slate-500 text-right">[p10 low]:</span>
                        <div className="flex-1 bg-slate-900 h-2 rounded overflow-hidden">
                          <div className="bg-rose-500/75 h-full rounded" style={{ width: `${Math.min(95, timesFMData.timesFMForecast.p10 * 350)}%` }} />
                        </div>
                        <span className="w-12 text-rose-300 font-bold">{timesFMData.timesFMForecast.p10.toFixed(2)} pts</span>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="w-16 shrink-0 text-slate-500 text-right">[p50 median]:</span>
                        <div className="flex-1 bg-slate-900 h-2 rounded overflow-hidden">
                          <div className="bg-cyan-500 h-full rounded" style={{ width: `${Math.min(95, timesFMData.timesFMForecast.p50 * 350)}%` }} />
                        </div>
                        <span className="w-12 text-cyan-400 font-bold">{timesFMData.timesFMForecast.p50.toFixed(2)} pts</span>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="w-16 shrink-0 text-slate-500 text-right">[p90 high]:</span>
                        <div className="flex-1 bg-slate-900 h-2 rounded overflow-hidden">
                          <div className="bg-emerald-500 h-full rounded" style={{ width: `${Math.min(95, timesFMData.timesFMForecast.p90 * 350)}%` }} />
                        </div>
                        <span className="w-12 text-emerald-400 font-bold">{timesFMData.timesFMForecast.p90.toFixed(2)} pts</span>
                      </div>
                    </div>

                    <div className="border-t border-slate-900 pt-2.5 mt-3 text-[10px] text-slate-500 text-center">
                      TimesFM self-attention layers detect seasonality multipliers. Local accuracy score: <span className="text-emerald-400 font-bold">{timesFMData.accuracyScorePct}%</span>
                    </div>
                  </div>

                  <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800">
                    <h4 className="text-xs font-mono font-bold text-slate-305 uppercase">Zero-Shot Prediction Modeling Explanation</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Instead of relying purely on auto-regressive local fits, our OS maps historical inventory states through Google's TimesFM weights. This bypasses cold-start problems, instantly generating price-elasticity estimations even for newly imported products or campaigns.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-500 font-mono text-xs">No prediction data available. Select a target SKU to execute patch calculations.</div>
              )}
            </div>
          )}

          {/* ENTERPRISE KNOWLEDGE GRAPH / CODEBASE MEMORY MCP (Tier 9 Knowledge Graph) */}
          {activeMainTab === "know_graph" && (
            <div className="flex-1 bg-slate-900/40 rounded-xl border border-slate-800 p-5 flex flex-col gap-5 overflow-y-auto min-h-[450px]">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2 tracking-wide uppercase">
                    <span className="text-indigo-400">🕸️</span> ENTERPRISE KNOWLEDGE GRAPH MEMORY (MCP)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Traverse relational transaction hierarchies linking customers, warehouses, campaigns, and suppliers</p>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-[11px] font-mono font-bold text-slate-500 uppercase">Start query node:</label>
                  <select
                    value={selectedNodeId}
                    onChange={(e) => handleNodeTraverseChange(e.target.value)}
                    className="bg-slate-950 font-mono text-xs border border-slate-800 rounded px-2.5 py-1 text-slate-200 outline-none focus:border-indigo-505"
                  >
                    <option value="cust-jean-luxury">Jean-Pierre Durand (VIP Customer)</option>
                    <option value="elysee-wool-jacket">Elysée Wool Jacket Premium (Product)</option>
                    <option value="sup-spain-mills">Spanish Cotton & Wool Mills (Supplier)</option>
                    <option value="wh-le-havre">Le Havre Maritime Depot (Warehouse)</option>
                    <option value="camp-eu-autumn">VIP Autumn Ensemble (Campaign)</option>
                  </select>
                </div>
              </div>

              {graphLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-500 py-16">
                  <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                  <span className="font-mono text-xs">Parsing network entities...</span>
                </div>
              ) : (
                <div className="flex flex-col gap-5">
                  {/* Nodes & Edges Count banner */}
                  <div className="flex flex-wrap gap-2.5 text-xs font-mono">
                    <span className="px-3 py-1 bg-slate-950 border border-slate-800 text-slate-400 rounded-md">
                      Nodes in local MCP memory: <strong className="text-indigo-400">{graphNodes.length}</strong>
                    </span>
                    <span className="px-3 py-1 bg-slate-950 border border-slate-800 text-slate-400 rounded-md">
                      Edge links recorded: <strong className="text-indigo-400">{graphEdges.length}</strong>
                    </span>
                    <span className="px-3 py-1 bg-slate-950 border border-slate-800 text-slate-400 rounded-md">
                      Active Traversals: <strong className="text-indigo-400">{graphTraverseMatches.length} paths found</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
                    {/* Entity schema directory */}
                    <div className="bg-slate-950/70 rounded-xl p-4 border border-slate-850 flex flex-col gap-3">
                      <h4 className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest">Local Entity Database Nodes</h4>
                      <div className="space-y-2 max-h-72 overflow-y-auto">
                        {graphNodes.map((node) => (
                          <div key={node.id} className="p-2.5 bg-slate-900/60 rounded border border-slate-800 text-xs flex justify-between items-center transition hover:border-indigo-500/20">
                            <div>
                              <div className="text-slate-200 font-bold font-mono">{node.label}</div>
                              <div className="text-[10px] text-slate-500 mt-0.5">ID: {node.id}</div>
                            </div>
                            <span className="px-2 py-0.5 bg-indigo-950/50 text-indigo-300 border border-indigo-940 rounded text-[9px] font-mono uppercase font-bold">
                              {node.type}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Transitive traverse path result list */}
                    <div className="bg-slate-950/70 rounded-xl p-4 border border-slate-850 flex flex-col gap-3">
                      <h4 className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">Mapped Enterprise Evidence Chains</h4>
                      <div className="space-y-3 max-h-72 overflow-y-auto font-mono text-[11px] leading-relaxed">
                        {graphTraverseMatches.length === 0 ? (
                          <div className="text-slate-600 text-center py-10">No downstream traversals found for selection.</div>
                        ) : (
                          graphTraverseMatches.map((match, i) => (
                            <div key={i} className="p-3 bg-slate-900 border-l-2 border-emerald-500 rounded bg-gradient-to-r from-emerald-950/5 to-slate-900">
                              <div className="text-[10px] text-slate-500 uppercase tracking-wide font-bold">Traversal Path Depth {match.relationChain.length - 1}</div>
                              <div className="text-slate-350 font-medium mt-1 inline-flex flex-wrap items-center gap-1.5 leading-snug">
                                {match.relationChain.map((segment: string, k: number) => {
                                  const isRelation = segment.includes("[");
                                  return (
                                    <span key={k} className={isRelation ? "text-indigo-400 font-bold" : "text-white"}>
                                      {segment} {k < match.relationChain.length - 1 && ""}
                                    </span>
                                  );
                                })}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 text-xs text-slate-400 leading-relaxed font-sans">
                    <strong>Codebase Memory MCP Schema:</strong> This schema structures contextual links dynamically matching our workspace codebase graph models. By caching multi-tier relationships (Marketing → Product → Stock Location & Supplier Cap), the Orchestrator has permanent corporate memory when evaluating business objectives.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SHADOW SANDBOX & STATE SELF-HEALING ROLLBACK (Tier 13 Autonomous Recovery) */}
          {activeMainTab === "safety_sandbox" && (
            <div className="flex-1 bg-slate-900/40 rounded-xl border border-slate-800 p-5 flex flex-col gap-6 overflow-y-auto min-h-[450px]">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2 tracking-wide uppercase">
                  <span className="text-emerald-400">🛡️</span> SHADOW EXECUTION SANDBOX & ROLLBACK
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Simulate high-stakes price modifications and stock restocking autonomously before live publishing</p>
              </div>

              {/* Propose sandboxed action parameters */}
              <div className="bg-slate-950 rounded-xl p-4 border border-slate-850">
                <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest mb-3">Propose Automated Sandbox Trade Action</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold mb-1">Target SKU:</label>
                    <select
                      value={sandboxSku}
                      onChange={(e) => setSandboxSku(e.target.value)}
                      className="w-full bg-slate-900 font-mono text-xs border border-slate-800 rounded px-2 py-1.5 text-slate-200 outline-none"
                    >
                      <option value="elysee-wool-jacket">Elysée Wool Jacket Premium</option>
                      <option value="monaco-loafers">Monaco Suede Loafers</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold mb-1">Trade Action:</label>
                    <select
                      value={sandboxAction}
                      onChange={(e: any) => {
                        setSandboxAction(e.target.value);
                        setSandboxVal(e.target.value === "PRICE_ADJUST" ? "119.00" : "150");
                      }}
                      className="w-full bg-slate-900 font-mono text-xs border border-slate-800 rounded px-2 py-1.5 text-slate-200 outline-none"
                    >
                      <option value="PRICE_ADJUST">PRICE_ADJUST (Adjust price multipliers)</option>
                      <option value="INVENTORY_RESTOCK">INVENTORY_RESTOCK (Procurement Restock)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-500 uppercase font-bold mb-1">
                      {sandboxAction === "PRICE_ADJUST" ? "Target Price (€):" : "Order Qty (Units):"}
                    </label>
                    <input
                      type="number"
                      value={sandboxVal}
                      onChange={(e) => setSandboxVal(e.target.value)}
                      className="w-full bg-slate-900 font-mono text-xs border border-slate-800 rounded px-2 py-1.5 text-slate-200 outline-none"
                    />
                  </div>

                  <button
                    onClick={executeSandboxTransaction}
                    disabled={sandboxLoading}
                    className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold font-mono text-xs rounded py-1.5 px-4 transition cursor-pointer disabled:opacity-40"
                  >
                    {sandboxLoading ? "SANDBOX TESTING..." : "RUN SHADOW DRY-RUN"}
                  </button>
                </div>

                {sandboxStatusMsg && (
                  <div className="mt-3.5 p-3 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-400">
                    {sandboxStatusMsg}
                  </div>
                )}
              </div>

              {/* Sandbox transaction history ledger */}
              <div className="flex flex-col gap-3">
                <h4 className="text-xs font-mono font-bold text-slate-350 uppercase tracking-widest">Shadow Dry-Run Ledger & Rollback Controls</h4>
                {shadowTxHistory.length === 0 ? (
                  <div className="text-slate-600 bg-slate-950/20 border border-slate-900/60 p-8 rounded-xl font-mono text-xs text-center">
                    Ledger empty. Propose and run a commercial shadow trade operation to audit sandboxed states.
                  </div>
                ) : (
                  <div className="space-y-3 font-mono text-xs">
                    {shadowTxHistory.map((tx) => {
                      const isWarn = !tx.isPassedSandboxAudit;
                      return (
                        <div
                          key={tx.transactionId}
                          className={`p-4 rounded-xl border ${
                            tx.rolledBack
                              ? "bg-slate-950 border-slate-800 opacity-60"
                              : isWarn
                              ? "bg-rose-950/15 border-rose-900/30 text-rose-50/80"
                              : "bg-emerald-950/15 border-emerald-900/30 text-emerald-50/80"
                          }`}
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-900/50 pb-2 mb-3">
                            <div>
                              <span className="font-bold text-white">{tx.transactionId}</span>
                              <span className="text-[10px] text-slate-500 ml-2">SKU: {tx.sku}</span>
                            </div>

                            <span
                              className={`px-2 py-0.5 border rounded text-[9px] font-bold ${
                                tx.rolledBack
                                  ? "bg-yellow-950/40 text-yellow-500 border-yellow-800/40"
                                  : isWarn
                                  ? "bg-rose-900/40 text-rose-450 border-rose-800/40"
                                  : "bg-emerald-900/40 text-emerald-440 border-emerald-800/40"
                              }`}
                            >
                              {tx.rolledBack ? "ROLLED_BACK" : isWarn ? "BLOCKED / REJECTED" : "SHADOW_PASSED"}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-[11px] mb-3">
                            <div>
                              <div className="text-slate-500 uppercase text-[9px]">Trade Command:</div>
                              <div className="font-bold text-slate-200">{tx.actionTaken}</div>
                            </div>
                            <div>
                              <div className="text-slate-500 uppercase text-[9px]">Value shift:</div>
                              <div className="font-bold text-slate-200">
                                {tx.actionTaken === "PRICE_ADJUST"
                                  ? `€${tx.previousPrice.toFixed(2)} ➔ €${tx.proposedPrice.toFixed(2)}`
                                  : `Stock ${tx.previousStock} ➔ ${tx.expectedStock}`}
                              </div>
                            </div>
                            <div>
                              <div className="text-slate-500 uppercase text-[9px]">Simulated Profit Delta:</div>
                              <div className={`font-bold ${tx.simulatedProfitDeltaEuro > 0 ? "text-emerald-450" : "text-rose-400"}`}>
                                {tx.simulatedProfitDeltaEuro > 0 ? "+" : ""}
                                €{tx.simulatedProfitDeltaEuro}
                              </div>
                            </div>
                            <div>
                              <div className="text-slate-500 uppercase text-[9px]">Compliance Audit:</div>
                              <span className={tx.isPassedSandboxAudit ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                                {tx.isPassedSandboxAudit ? "Compliant" : "Safety Breach"}
                              </span>
                            </div>
                          </div>

                          {/* Error statement / audit reasons */}
                          {tx.rejectionReason && (
                            <div className="p-2 bg-rose-950/20 border border-rose-900/20 text-rose-400 text-[10px] rounded mb-3 leading-relaxed">
                              <strong>REJECTION REASON:</strong> {tx.rejectionReason}
                            </div>
                          )}

                          {/* Rollback Buttons */}
                          {!tx.rolledBack && (
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => rollbackTransaction(tx.transactionId)}
                                className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-[10px] rounded transition cursor-pointer"
                              >
                                ⏪ TRIGGER COMPENSATION ROLLBACK
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeMainTab === "vision" && (
            <div className="flex-1 bg-slate-900/40 rounded-xl border border-slate-800 p-5 flex flex-col gap-5 overflow-y-auto">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2 tracking-wide uppercase">
                    <Sparkles className="w-4 h-4 text-cyan-400" /> CEO Vision Intelligence Center
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Audit physical wares, supplier invoices, or live advertising chart screenshots instantly</p>
                </div>

                {/* Task type buttons */}
                <div className="flex gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-lg text-[10px] font-mono">
                  <button
                    onClick={() => {
                      setSelectedVisionTask("PRODUCT_INSPECT");
                      setVisionResult(null);
                      setVisionPreviewUrl(null);
                      setVisionFileBase64(null);
                    }}
                    className={`px-2.5 py-1.5 rounded font-bold transition cursor-pointer ${selectedVisionTask === "PRODUCT_INSPECT" ? "bg-slate-800 text-cyan-400 border border-slate-700" : "text-slate-500 hover:text-slate-300"}`}
                  >
                    PRODUCT INSPECT
                  </button>
                  <button
                    onClick={() => {
                      setSelectedVisionTask("DOCUMENT_OCR");
                      setVisionResult(null);
                      setVisionPreviewUrl(null);
                      setVisionFileBase64(null);
                    }}
                    className={`px-2.5 py-1.5 rounded font-bold transition cursor-pointer ${selectedVisionTask === "DOCUMENT_OCR" ? "bg-slate-800 text-pink-400 border border-slate-700" : "text-slate-500 hover:text-slate-300"}`}
                  >
                    DOC OCR / INVOICE
                  </button>
                  <button
                    onClick={() => {
                      setSelectedVisionTask("CHART_ANALYZE");
                      setVisionResult(null);
                      setVisionPreviewUrl(null);
                      setVisionFileBase64(null);
                    }}
                    className={`px-2.5 py-1.5 rounded font-bold transition cursor-pointer ${selectedVisionTask === "CHART_ANALYZE" ? "bg-slate-800 text-amber-400 border border-slate-700" : "text-slate-500 hover:text-slate-300"}`}
                  >
                    CHART ANALYST
                  </button>
                </div>
              </div>

              {/* Quick Presets Panel */}
              <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/80 flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 mr-2">Load Demo Assets:</span>
                <button
                  onClick={() => handleLoadDemo("PRODUCT_INSPECT")}
                  className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-850 text-[10px] font-mono text-cyan-300 hover:text-cyan-200 transition rounded"
                >
                  🎒 Elysée Wool Jacket (Photo)
                </button>
                <button
                  onClick={() => handleLoadDemo("DOCUMENT_OCR")}
                  className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-850 text-[10px] font-mono text-pink-300 hover:text-pink-200 transition rounded"
                >
                  🧾 French Mills Invoice (PO Ref)
                </button>
                <button
                  onClick={() => handleLoadDemo("CHART_ANALYZE")}
                  className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-850 text-[10px] font-mono text-amber-300 hover:text-amber-200 transition rounded"
                >
                  📈 Facebook CPC & ROAS fatigue (Chart)
                </button>
              </div>

              {/* Main Stage Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
                {/* Input Section */}
                <div className="flex flex-col gap-4">
                  <div className="border border-dashed border-slate-800 hover:border-cyan-500/30 transition rounded-xl p-6 bg-slate-950/60 flex flex-col items-center justify-center gap-3 relative overflow-hidden group min-h-[220px]">
                    {visionPreviewUrl ? (
                      <div className="w-full h-full flex flex-col items-center relative">
                        {visionPreviewUrl.startsWith("data:image/svg") ? (
                          <div dangerouslySetInnerHTML={{ __html: decodeURIComponent(visionPreviewUrl.split(",")[1]) }} className="rounded-lg shadow border border-slate-800/80 max-h-40 overflow-hidden" />
                        ) : (
                          <img referrerPolicy="no-referrer" src={visionPreviewUrl} alt="Vision Upload" className="max-h-40 rounded-lg shadow object-contain border border-slate-800/80" />
                        )}
                        
                        <button
                          onClick={() => {
                            setVisionPreviewUrl(null);
                            setVisionFileBase64(null);
                            setVisionFileMimeType(null);
                            setVisionResult(null);
                          }}
                          className="absolute -top-2 -right-2 bg-slate-900 hover:bg-rose-950 p-1.5 rounded-full border border-slate-800 text-slate-450 hover:text-rose-400 text-[10px] font-bold"
                          title="Remove image"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 group-hover:scale-105 transition">
                          <Upload className="w-6 h-6 text-slate-400" />
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-slate-200 font-bold select-none text-cyan-200">Upload sensory assets to start OCR / Inspection</p>
                          <p className="text-[10px] text-slate-500 mt-1 uppercase font-mono">Supports PNG, JPG, WEBP, SVG</p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </>
                    )}
                  </div>

                  {/* Additional instructions input */}
                  <div>
                    <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1.5">Custom Directive context</label>
                    <input
                      type="text"
                      value={visionContextPrompt}
                      onChange={(e) => setVisionContextPrompt(e.target.value)}
                      placeholder="e.g. 'Identify supplier pricing anomalies' or 'write engaging copywriting'..."
                      className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500/50 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500/20"
                    />
                  </div>

                  {/* Submit button */}
                  <button
                    onClick={handleVisionAnalyze}
                    disabled={visionLoading || !visionFileBase64}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-mono font-bold text-xs rounded-lg shadow-lg shadow-cyan-500/10 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    {visionLoading ? (
                      <>
                        <RotateCw className="w-3.5 h-3.5 animate-spin" />
                        <span>CEO EYE COGNITION ENGINE PROCESSING...</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>TRIGGER OPTICAL DIRECTIVE</span>
                      </>
                    )}
                  </button>

                  {visionError && (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-450 rounded-lg text-xs flex gap-2 items-center font-mono">
                      <XCircle className="w-4 h-4 shrink-0 text-rose-450" />
                      <span>{visionError}</span>
                    </div>
                  )}
                </div>

                {/* Output Display Area */}
                <div className="bg-slate-950/90 rounded-xl border border-slate-800 p-4 min-h-[300px] flex flex-col justify-between">
                  {!visionResult && !visionLoading ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-10 text-slate-600">
                      <Eye className="w-8 h-8 opacity-40 mb-2 stroke-[1.5]" />
                      <span className="text-xs text-center px-4">No results computed. Select a demo preset above or upload an image, then run the engine.</span>
                    </div>
                  ) : visionLoading ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-10 text-slate-500 font-mono text-xs gap-3">
                      <span className="w-6 h-6 rounded-full border-2 border-t-cyan-500 border-slate-800 animate-spin" />
                      <span className="animate-pulse text-cyan-400">Analyzing multi-modal channels...</span>
                      <span className="text-[10px] text-slate-600 text-center">Invoking server-side Gemini Core 3.5 vision layer...</span>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col gap-4">
                      <div className="flex items-center justify-between border-b border-slate-900 pb-2.5">
                        <span className="text-[10px] font-mono text-slate-500 uppercase">optical results verified: {new Date(visionResult.timestamp).toLocaleTimeString()}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full font-bold">LIVE MODEL COMMIT</span>
                      </div>

                      {/* MAPPED UI BASED ON DETECTED TYPE */}
                      {visionResult.taskEvaluated === "PRODUCT_INSPECT" && visionResult.parsedImageMeta && (
                        <div className="flex flex-col gap-3 font-sans text-xs">
                          {/* ProductName */}
                          <div>
                            <span className="text-slate-505 text-[10px] font-mono block uppercase text-slate-400">Detected Item</span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-sm font-bold text-white">{visionResult.parsedImageMeta.productName}</span>
                              <span className="text-[9px] px-1.5 py-0.5 bg-slate-800 text-slate-350 border border-slate-700 rounded-sm font-mono">{visionResult.parsedImageMeta.category}</span>
                            </div>
                          </div>

                          {/* Attributes Grid */}
                          <div className="grid grid-cols-2 gap-2 bg-slate-900/50 p-2.5 rounded border border-slate-900 font-mono text-[10px]">
                            <div><span className="text-slate-500">Color:</span> <span className="text-slate-300 font-bold">{visionResult.parsedImageMeta.attributes.color}</span></div>
                            <div><span className="text-slate-500">Material:</span> <span className="text-slate-300 font-bold">{visionResult.parsedImageMeta.attributes.material}</span></div>
                            <div><span className="text-slate-500">Style:</span> <span className="text-slate-300 font-bold">{visionResult.parsedImageMeta.attributes.style}</span></div>
                            <div><span className="text-slate-500">Target Segment:</span> <span className="text-slate-300 font-bold">{visionResult.parsedImageMeta.attributes.targetAudience || "General"}</span></div>
                          </div>

                          {/* Title & Copywriter */}
                          <div className="p-3 bg-slate-900/40 rounded border border-slate-800">
                            <span className="font-bold block text-cyan-400 text-[10px] uppercase font-mono">SEO Suggested Shopify Title:</span>
                            <div className="text-white font-bold leading-snug mt-1">{visionResult.parsedImageMeta.generatedTitle}</div>
                            <span className="text-slate-500 block text-[9px] uppercase font-mono mt-2">Retail Promo Copywriting:</span>
                            <div className="text-slate-400 leading-relaxed text-[11px] italic mt-0.5">"{visionResult.parsedImageMeta.generatedDescription}"</div>
                          </div>

                          {/* Inspections Status */}
                          <div className="flex gap-4 items-center border-t border-slate-900 pt-3">
                            <div className="flex-1">
                              <span className="text-[10px] font-mono text-slate-500 block">QUALITY CHECK STATUS</span>
                              <div className="flex items-center gap-1.5 mt-1">
                                <span className={`w-2.5 h-2.5 rounded-full ${visionResult.parsedImageMeta.qualityReview.qualityCheckPassed ? "bg-emerald-500" : "bg-rose-500"}`} />
                                <span className="font-bold text-white uppercase">{visionResult.parsedImageMeta.qualityReview.qualityCheckPassed ? "Passed Fit" : "Defect Spotted"}</span>
                              </div>
                              <span className="text-[10px] text-slate-400 italic block mt-1">{visionResult.parsedImageMeta.qualityReview.issuesDetected?.[0] || "No issues identified."}</span>
                            </div>

                            <div className="text-right border-l border-slate-900 pl-4">
                              <span className="text-[10px] font-mono text-slate-500 block">SUITABILITY SCORE</span>
                              <span className="text-xl font-bold font-mono text-cyan-400">{visionResult.parsedImageMeta.qualityReview.shelfSuitabilityScore || 95} / 100</span>
                            </div>
                          </div>

                          {/* Multimodal RAG matches */}
                          {visionResult.vectorMatches && visionResult.vectorMatches.length > 0 && (
                            <div className="border-t border-slate-900 pt-3">
                              <span className="text-[10px] font-mono text-slate-500 block uppercase mb-1.5">Vector Store RAG Lookup Matched:</span>
                              <div className="p-2.5 bg-gradient-to-r from-slate-950 to-indigo-950/20 border border-slate-800 rounded flex justify-between items-center">
                                <div>
                                  <span className="font-bold block text-white">{visionResult.vectorMatches[0].matchedSku}</span>
                                  <span className="text-[9px] text-slate-405 font-mono text-slate-400">Inventory Location: {visionResult.vectorMatches[0].inventorySource}</span>
                                </div>
                                <span className="text-[10px] font-mono font-bold text-cyan-400">Confidence: {Math.round(visionResult.vectorMatches[0].confidenceScore * 100)}%</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* MAPPED DOCUMENT OCR */}
                      {visionResult.taskEvaluated === "DOCUMENT_OCR" && visionResult.parsedDocumentMeta && (
                        <div className="flex flex-col gap-3 font-sans text-xs">
                          <div>
                            <span className="text-slate-505 text-[10px] font-mono block uppercase text-slate-455">OCR Extracted Document Type</span>
                            <span className="text-sm font-bold text-white flex items-center gap-2">
                              <FileText className="w-4 h-4 text-pink-400" /> {visionResult.parsedDocumentMeta.documentType} ({visionResult.parsedDocumentMeta.language?.toUpperCase()})
                            </span>
                          </div>

                          {/* Document Vendor Metadata */}
                          <div className="grid grid-cols-2 gap-x-2 gap-y-1 bg-slate-900/60 p-2.5 rounded border border-slate-900 font-mono text-[10px]">
                            <div><span className="text-slate-500">Doc Number:</span> <span className="text-slate-300 font-bold">{visionResult.parsedDocumentMeta.metadata.documentNumber || "N/A"}</span></div>
                            <div><span className="text-slate-500">Issue Date:</span> <span className="text-slate-300 font-bold">{visionResult.parsedDocumentMeta.metadata.issueDate || "N/A"}</span></div>
                            <div><span className="text-slate-500">Supplier Name:</span> <span className="text-slate-300 font-bold truncate inline-block max-w-[100px]">{visionResult.parsedDocumentMeta.metadata.supplierName || "N/A"}</span></div>
                            <div><span className="text-slate-500">PO Ref:</span> <span className="text-slate-300 font-bold text-pink-400">{visionResult.parsedDocumentMeta.metadata.purchaseOrderRef || "N/A"}</span></div>
                          </div>

                          {/* Document parsed items list */}
                          {visionResult.parsedDocumentMeta.items && (
                            <div className="border border-slate-900 rounded overflow-hidden">
                              <div className="bg-slate-900 px-2 py-1 text-[9px] font-mono text-slate-400 uppercase tracking-wider grid grid-cols-12 gap-1 font-bold">
                                <span className="col-span-6">Line Description</span>
                                <span className="col-span-2 text-center">Qty</span>
                                <span className="col-span-4 text-right">Sum Total</span>
                              </div>
                              <div className="divide-y divide-slate-900 max-h-24 overflow-y-auto bg-slate-1000 bg-slate-950">
                                {visionResult.parsedDocumentMeta.items.map((item: any, idx: number) => (
                                  <div key={idx} className="p-2 grid grid-cols-12 gap-1 text-[10px] font-mono">
                                    <span className="col-span-6 truncate text-white">{item.description}</span>
                                    <span className="col-span-2 text-center text-slate-400">{item.quantity}</span>
                                    <span className="col-span-4 text-right text-slate-300 font-bold">
                                      {visionResult.parsedDocumentMeta.totals.currency === "EUR" ? "€" : "¥"}
                                      {item.totalPrice}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* OCR Total Ledger */}
                          <div className="flex justify-between items-center border-t border-slate-900 pt-2 font-mono text-[10px] text-slate-400">
                            <div>Subtotal: <span className="text-slate-200">{visionResult.parsedDocumentMeta.totals.subtotal}</span></div>
                            <div>Tax Amount: <span className="text-slate-200">{visionResult.parsedDocumentMeta.totals.taxAmount}</span></div>
                            <div className="text-right font-bold text-white text-xs">
                              Amount billed: {visionResult.parsedDocumentMeta.totals.currency === "EUR" ? "€" : "¥"}
                              {visionResult.parsedDocumentMeta.totals.totalAmount}
                            </div>
                          </div>

                          {/* Operational Compliance Flag */}
                          {visionResult.parsedDocumentMeta.operationalWarning && (
                            <div className="p-2.5 bg-pink-500/10 border border-pink-500/20 text-pink-300 rounded font-mono text-[10px] flex gap-2">
                              <AlertTriangle className="w-4 h-4 text-pink-400 shrink-0" />
                              <div>
                                <span className="font-bold uppercase tracking-wider block mb-0.5 text-pink-400">INTELLIGENT COMPLIANCE ALIGNMENT SPOT:</span>
                                {visionResult.parsedDocumentMeta.operationalWarning}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* MAPPED CHART ANALYZE */}
                      {visionResult.taskEvaluated === "CHART_ANALYZE" && visionResult.parsedChartMeta && (
                        <div className="flex flex-col gap-3 font-sans text-xs">
                          <div>
                            <span className="text-slate-500 text-[10px] font-mono block uppercase">Trend Analytics Diagnosis</span>
                            <span className="text-sm font-bold text-white">{visionResult.parsedChartMeta.chartTitle}</span>
                            <div className="text-[9px] text-amber-400 font-mono mt-0.5">Diagnosed Dashboard: {visionResult.parsedChartMeta.sourceDashboardType}</div>
                          </div>

                          {/* Extracted Metrics Table */}
                          <div className="border border-slate-900 rounded overflow-hidden text-[10px] font-mono">
                            <div className="bg-slate-900 px-2 py-1 text-[9px] text-slate-500 font-bold uppercase grid grid-cols-12 font-bold">
                              <span className="col-span-6">Series Trend</span>
                              <span className="col-span-3 text-center">Direction</span>
                              <span className="col-span-3 text-right">Value</span>
                            </div>
                            <div className="bg-slate-950 divide-y divide-slate-900">
                              {visionResult.parsedChartMeta.dataExtracted.map((pt: any, idx: number) => (
                                <div key={idx} className="p-2 grid grid-cols-12">
                                  <span className="col-span-6 text-white truncate font-bold">{pt.seriesName}</span>
                                  <span className={`col-span-3 text-center uppercase text-[9px] font-bold ${pt.trendDirection === "decreasing" ? "text-rose-450 text-rose-400" : pt.trendDirection === "increasing" ? "text-emerald-500 text-emerald-400" : "text-slate-400"}`}>
                                    {pt.trendDirection}
                                  </span>
                                  <span className="col-span-3 text-right text-amber-200 font-bold">{pt.estimatedValue || "N/A"}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Detected anomalies visual bullets */}
                          {visionResult.parsedChartMeta.detectedAnomalies && (
                            <div className="bg-slate-900/60 p-2.5 rounded border border-slate-900">
                              <span className="text-[9px] font-mono font-bold uppercase text-amber-400 block mb-1">Detected ROI Sinks & Fatigue</span>
                              <ul className="list-disc list-inside space-y-1 text-[11px] leading-relaxed text-slate-300">
                                {visionResult.parsedChartMeta.detectedAnomalies.map((an: string, idx: number) => (
                                  <li key={idx} className="marker:text-slate-500">{an}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Recommended Executive resolutions */}
                          {visionResult.parsedChartMeta.recommendedDecisions && (
                            <div className="flex flex-col gap-2">
                              <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold">Strategic CEO Action Item:</span>
                              {visionResult.parsedChartMeta.recommendedDecisions.slice(0, 1).map((dec: any, idx: number) => (
                                <div key={idx} className="p-3 bg-gradient-to-r from-amber-950/20 to-slate-950 border border-amber-800/25 rounded">
                                  <div className="flex justify-between items-start">
                                    <span className="text-white font-bold block">{dec.title}</span>
                                    <span className="text-[10px] font-mono text-emerald-400 font-bold">{dec.expectedGainEstimate}</span>
                                  </div>
                                  <p className="text-[11px] mt-1 leading-relaxed text-slate-350">{dec.actionRequired}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeMainTab === "fashion_intel" && (
            <FashionIntelHub />
          )}
        </div>

        {/* PANEL C: Live Databases & Telemetry Trackers */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* Commerce Catalog DB Monitor */}
          <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-5 flex flex-col gap-4">
            <h2 className="text-xs font-semibold text-white tracking-widest uppercase font-mono flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-cyan-400" /> Catalog DB State
            </h2>
            <div className="flex flex-col gap-3">
              {products.map((p) => (
                <div key={p.id} className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 flex flex-col gap-2 relative">
                  {p.inventoryLevel < p.safetyStock && (
                    <span className="absolute top-2.5 right-2 px-1.5 py-0.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[8px] uppercase tracking-wider rounded font-mono font-bold animate-pulse">
                      Low Stock
                    </span>
                  )}
                  <div className="flex justify-between font-medium">
                    <span className="text-xs text-white truncate max-w-[140px]">{p.name}</span>
                    <span className="text-xs font-mono font-bold text-cyan-400">¥{p.currentPrice}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-y-1.5 gap-x-2 text-[10px] font-mono text-slate-500 border-t border-slate-900 pt-1.5 mt-0.5">
                    <div>
                      Stock: <span className="text-slate-350 font-bold">{p.inventoryLevel}</span>
                    </div>
                    <div>
                      Safety: <span className="text-slate-350">{p.safetyStock}</span>
                    </div>
                    <div>
                      Margin: <span className="text-emerald-550 font-semibold">{p.profitMargin > 0 ? "¥" + p.profitMargin : "Invalid"}</span>
                    </div>
                    <div>
                      Acq: <span className="text-slate-400">¥{p.costPrice}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Memory Store Experience Log */}
          <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-5 flex flex-col gap-4 max-h-[300px] overflow-hidden">
            <h2 className="text-xs font-semibold text-white tracking-widest uppercase font-mono flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-cyan-400" /> Epistemic Memory
            </h2>
            <div className="flex-1 overflow-y-auto flex flex-col gap-2.5 pr-1">
              {experiences.length === 0 ? (
                <span className="text-xs text-slate-600 italic">No experiential memories recorded.</span>
              ) : (
                experiences
                  .slice()
                  .reverse()
                  .map((e) => (
                    <div key={e.id} className="p-2.5 bg-slate-950/60 border border-slate-800/80 rounded text-xs leading-relaxed">
                      <div className="flex items-center justify-between text-[9px] font-mono mb-1.5">
                        <span className={`px-1.5 text-slate-300 font-bold rounded ${(e.outcomeType || "success") === "success" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>
                          {(e.outcomeType || "UNKNOWN").toUpperCase()}
                        </span>
                        <span className="text-slate-500">{new Date(e.timestamp).toLocaleDateString()}</span>
                      </div>
                      <div className="text-slate-300 font-medium mb-1 truncate">{e.actionTaken}</div>
                      <div className="text-slate-450 italic font-medium scale-[0.98] origin-left text-slate-400 bg-slate-900/40 p-1.5 rounded">{e.lessonLearned}</div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
