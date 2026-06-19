import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Sliders,
  ShieldCheck,
  Zap,
  CheckCircle2,
  XCircle,
  HelpCircle,
  FolderOpen,
  Sparkles,
  AlertTriangle,
  Play,
  RotateCw,
  ChevronRight,
  ChevronDown,
  Info,
  Layers,
  Award,
  BookOpen,
  Network,
  Cpu,
  Bookmark,
  Activity,
  ThumbsUp,
  LineChart,
  BarChart4,
  RefreshCw,
  Eye,
  Settings,
  Scale
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Product } from "../types";

interface CEOBrainHubProps {
  products: Product[];
  onTriggerRestock: (sku: string, qty: number) => Promise<void>;
  onTriggerPreset: (preset: string) => void;
  isRunning: boolean;
}

export default function CEOBrainHub({ products, onTriggerRestock, onTriggerPreset, isRunning }: CEOBrainHubProps) {
  // Debate simulation state
  const [debateRound, setDebateRound] = useState<number>(0);
  const [isDebating, setIsDebating] = useState<boolean>(false);
  const [debateLogs, setDebateLogs] = useState<any[]>([]);

  // Why-tree diagnostic state
  const [selectedProblem, setSelectedProblem] = useState<string>("french_ctr_drop");

  // Goal tree state
  const [expandedGoals, setExpandedGoals] = useState<Record<string, boolean>>({
    root: true,
    margin: true,
    holding: true,
  });

  // Approved sandbox indicator
  const [hasApprovedSandbox, setHasApprovedSandbox] = useState<boolean>(false);
  const [approvingLoading, setApprovingLoading] = useState<boolean>(false);

  // Self-Evolution sub-tabs state (8 modules)
  const [activeEvoTab, setActiveEvoTab] = useState<string>("reflection");

  // MODULE 1: Self-Reflection Local State
  const [reflectionLogs, setReflectionLogs] = useState<any[]>([
    {
      timestamp: "Today, 08:15 AM",
      goal: "Insulate margin for Italian wool coat sales during seasonal bid spikes",
      action: "Automatically adjusted local dynamic MSRP multipliers to 1.1x during Thursday luxury peaks",
      outcome: "Conversion stayed flat but average order value rose by 14%. Succeeded local margin insulation.",
      lesson: "High-net-worth Italian buyer cohorts exhibit low coupon price elasticity, and prefer bundled accessories."
    }
  ]);
  const [isReflecting, setIsReflecting] = useState<boolean>(false);

  // MODULE 2: Strategy Evolution Local State
  const [strategyVersion, setStrategyVersion] = useState<string>("v1.2.0");
  const [isMutatingStrategy, setIsMutatingStrategy] = useState<boolean>(false);
  const [strategyVersionsHistory, setStrategyVersionsHistory] = useState<any[]>([
    { version: "v1.2.0", date: "June 18", reward: 84.5, status: "Active Runway" },
    { version: "v1.1.0", date: "June 10", reward: 72.1, status: "Archived" },
    { version: "v1.0.0", date: "June 01", reward: 61.4, status: "Archived" }
  ]);

  // MODULE 3: Memory Consolidation State
  const [unconsolidatedCount, setUnconsolidatedCount] = useState<number>(14242);
  const [isConsolidating, setIsConsolidating] = useState<boolean>(false);
  const [consolidatedLaws, setConsolidatedLaws] = useState<string[]>([
    "COMMERCE_LAW_01: Italian region coupon discounting above 15.0% has a negative net margin cross-elasticity coefficient.",
    "COMMERCE_LAW_02: French buyers express a 32% high affinity trigger for digital audio accessories when bundled directly with luxury outwear."
  ]);

  // MODULE 4: Reward Model Weights
  const [rewardWeights, setRewardWeights] = useState({
    profit: 40,
    holding: 25,
    customerLTV: 15,
    cashSafety: 20
  });
  const computedRewardScore = Math.min(
    100,
    Math.round(
      84.5 +
      (rewardWeights.profit - 40) * 0.15 -
      (rewardWeights.holding - 25) * 0.2 +
      (rewardWeights.customerLTV - 15) * 0.1
    )
  );

  // MODULE 5: Failure Analysis Vault
  const [inspectedFailure, setInspectedFailure] = useState<string>("leak_q2");
  const failuresDatabase: Record<string, any> = {
    leak_q2: {
      event: "Q2 Broad Match Ad Margin Leak",
      date: "May 15",
      effect: "-€4,300.00 Cumulative Net Loss",
      analysis: "Google Ads keyword matches default matching was set too loose by CMO executor. AI spent ad credits targeting secondary keywords ('cheap second-hand coat fabrics') failing luxury demographics pricing guidelines.",
      preventativePolicy: "Inject policy constraint DSL forbidding CMO from allocating budget to ad networks with keyword match confidence < 0.85."
    },
    stockout_winter: {
      event: "Winter Early Stockout Elysée Coat",
      date: "Jan 12",
      effect: "Estimated €12,500.00 Missed Revenue Opportunity",
      analysis: "Forecasting agent used standard autoregressive algorithms which failed to compute localized influencer media traction spike correctly.",
      preventativePolicy: "Hardcoded safety triggers that mandate a baseline replenishment order if localized search volume triggers climb over 20% week-over-week."
    }
  };

  // MODULE 6: Hypothesis Generator Local State
  const [hypotheses, setHypotheses] = useState<any[]>([
    {
      id: "HYPO-102",
      premise: "If we discount Wireless Earbuds by 50% only when co-purchased with Elysée Wool jacket...",
      expectedOutcome: "+12.0% Overall Wool jacket velocity + Clears static Earbud warehouse holding congestion within 14 days.",
      confidence: 89,
      status: "Waiting for shadow Dry Run"
    }
  ]);
  const [isGeneratingHypothesis, setIsGeneratingHypothesis] = useState<boolean>(false);

  // MODULE 7: Autonomic Experiment A/B Simulator state
  const [isABying, setIsABying] = useState<boolean>(false);
  const [abStream, setAbStream] = useState<any[]>([]);

  // MODULE 8: Policy Parameter Tuner State
  const [marginFloor, setMarginFloor] = useState<number>(35.0);
  const [safetyStockFloor, setSafetyStockFloor] = useState<number>(15);

  const [hasTunedParameter, setHasTunedParameter] = useState<boolean>(false);

  // MODULE 9: Autonomous Web Research Engine State
  const [researchQuery, setResearchQuery] = useState<string>("");
  const [isResearching, setIsResearching] = useState<boolean>(false);
  const [researchPlan, setResearchPlan] = useState<any[]>([]);
  const [researchReport, setResearchReport] = useState<any | null>(null);
  const [researchHistory, setResearchHistory] = useState<any[]>([]);
  const [researchStepsOutput, setResearchStepsOutput] = useState<string[]>([]);

  // ==========================================================
  // ADVANCED COGNITIVE META-CAPABILITIES STATES & HANDLERS
  // ==========================================================
  
  // Custom alerts from scan-anomalies
  const [scanAlerts, setScanAlerts] = useState<any[]>([]);

  // 1. Experience Validator State
  const [isValidatingExperience, setIsValidatingExperience] = useState<boolean>(false);
  const [validationResult, setValidationResult] = useState<{
    status: "IDLE" | "PENDING" | "ALERT" | "VERIFIED";
    concludingText: string;
    confoundingFactor: string;
    correlationCoefficient: number;
    experienceTested: string;
  }>({
    status: "IDLE",
    concludingText: "Experience validation chamber stands ready. Select triggers to resolve overlapping events.",
    confoundingFactor: "None analyzed yet",
    correlationCoefficient: 0.0,
    experienceTested: "Learned Rule Hint: Discounting luxury Elysee Wool jackets by 15.0% has directly increased purchase conversion rates by 30%."
  });

  // 2. Strategy Versioning State
  const [strategyVersionHistoryExt, setStrategyVersionHistoryExt] = useState([
    {
      version: "v1.2.0",
      date: "June 18, 2026",
      reason: "Prioritize Le Havre overstock drainage & leverage dynamic VIP bundles",
      results: { roi: "+12%", margins: "38.2%", restockWeeks: "7 weeks" },
      rollbackState: "Stable Active",
      isRollbackable: false
    },
    {
      version: "v1.1.2",
      date: "June 12, 2026",
      reason: "Calibrate localized French MSRP threshold to isolate bid rate inflation",
      results: { roi: "+8%", margins: "36.1%", restockWeeks: "11 weeks" },
      rollbackState: "Release Candidate",
      isRollbackable: true
    },
    {
      version: "v1.0.1",
      date: "June 04, 2026",
      reason: "Legacy procurement policies (No dynamic margin floors or safety bounds)",
      results: { roi: "-4%", margins: "31.5%", restockWeeks: "2 weeks" },
      rollbackState: "Archived Draft",
      isRollbackable: true
    }
  ]);

  // 3. Forgetting Engine State
  const [isGCing, setIsGCing] = useState<boolean>(false);
  const [knowledgeDecayList, setKnowledgeDecayList] = useState([
    { id: "LAW-009", law: "French localized summer outerwear coupon conversion curves (2019 data)", confidence: 14, lastUsedDays: 735, decayScore: 94, state: "Active memory ledger" },
    { id: "LAW-014", law: "First-quarter post-pandemic supply chain raw transport indices", confidence: 28, lastUsedDays: 412, decayScore: 82, state: "Active memory ledger" },
    { id: "LAW-094", law: "Friday morning dynamic email cashmere VIP bundle affiliation coefficients", confidence: 96, lastUsedDays: 1, decayScore: 2, state: "Retained (High Frequency)" }
  ]);

  // 4. Goal Arbitration Solver State
  const [activeArbitrationStrategy, setActiveArbitrationStrategy] = useState<"BALANCED" | "AGGRESSIVE" | "DEFENSIVE">("BALANCED");
  const [arbitrationConflictRatio, setArbitrationConflictRatio] = useState<number>(64);

  // 5. Capability Self-Assessment State
  const [isSelfAuditing, setIsSelfAuditing] = useState<boolean>(false);
  const [microAssessments, setMicroAssessments] = useState([
    { department: "Dynamic Pricing Core", confidence: 96, state: "Autonomic execution approved", description: "Validated against Past localized price elasticities. Direct Policy DSL safeguards injected." },
    { department: "Inventory Replenishment", confidence: 94, state: "Autonomic execution approved", description: "Aligned with Spanish Mill logistics contracts and Maritime Le Havre sensor APIs." },
    { department: "TimesFM Sales Forecast", confidence: 81, state: "Human sign-off recommended", description: "Zero-shot forecasting model calibrated with 14-day rolling historical demand vectors." },
    { department: "Paid Ads Copywriting Gen", confidence: 62, state: "Mandatory human review", description: "Feedback loop limits regional pixel performance data. Highly subject to creative ad fatigue." }
  ]);
  const [bypassLowConfidenceApproval, setBypassLowConfidenceApproval] = useState<boolean>(false);

  // --- FULL STACK SYNC EFFECT ---
  const loadResearchHistory = async () => {
    try {
      const res = await fetch("/api/research/history");
      const body = await res.json();
      if (body.status === "success") {
        setResearchHistory(body.history || []);
      }
    } catch (e) {
      console.error("Failed to load web research histories:", e);
    }
  };

  const handleRunResearch = async (targetQuery: string) => {
    if (!targetQuery.trim()) return;
    setIsResearching(true);
    setResearchReport(null);
    setResearchPlan([]);
    setResearchStepsOutput([`[Research Brain] Handshaking with Google Search Grounding & Web Scraper proxy...`]);
    
    try {
      const response = await fetch("/api/research/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: targetQuery })
      });
      const body = await response.json();
      if (body.status === "success") {
        setResearchPlan(body.plan || []);
        setResearchReport(body.report || null);
        setResearchStepsOutput(prev => [
          ...prev,
          `✓ Resolved entity core type: ${body.resolved.type}`,
          `✓ Grounding metadata fetched: ${body.report.citations.length} live primary sources indexed recursively.`,
          `✓ Extracted body cleaned and formatted. Integrated results directly into active corporate Memory nodes.`
        ]);
        await loadResearchHistory();
      } else {
        setResearchStepsOutput(prev => [...prev, `❌ Autonomous Research failed: ${body.error}`]);
      }
    } catch (e: any) {
      setResearchStepsOutput(prev => [...prev, `❌ Connection error occurred: ${e.message}`]);
    } finally {
      setIsResearching(false);
    }
  };

  const loadCognitiveState = async () => {
    try {
      // 1. Fetch live metrics
      const evalRes = await fetch("/api/cognitive/online-evaluation");
      const evalBody = await evalRes.json();
      if (evalBody.status === "success") {
        const met = evalBody.metrics;
        setMicroAssessments([
          { department: "Dynamic Pricing Core", confidence: Math.round(met.pricingAccuracy), state: "Autonomic execution approved", description: "Validated against Past localized price elasticities. Direct Policy DSL safeguards injected." },
          { department: "Inventory Replenishment", confidence: Math.round(met.restockAccuracy), state: "Autonomic execution approved", description: "Aligned with Spanish Mill logistics contracts and Maritime Le Havre sensor APIs." },
          { department: "TimesFM Sales Forecast", confidence: Math.round(81 + (met.forecastErrorMAE < 0.20 ? 4 : -3)), state: "Human sign-off recommended", description: "Zero-shot forecasting model calibrated with 14-day rolling historical demand vectors." },
          { department: "Paid Ads Copywriting Gen", confidence: 62, state: "Mandatory human review", description: "Feedback loop limits regional pixel performance data. Highly subject to creative ad fatigue." }
        ]);
      }

      // 2. Fetch active anomalies
      const scanRes = await fetch("/api/cognitive/scan-anomalies");
      const scanBody = await scanRes.json();
      if (scanBody.status === "success") {
        setScanAlerts(scanBody.anomalies || []);
        setActiveArbitrationStrategy(scanBody.activeArbitrationStrategy || "BALANCED");
      }

      // 3. Load continuous research history
      await loadResearchHistory();
    } catch (err) {
      console.error("Failed to load backend cognitive settings:", err);
    }
  };

  useEffect(() => {
    loadCognitiveState();
  }, [strategyVersion, marginFloor, safetyStockFloor]);

  // Sync Slider values back using debounce / click save
  const syncPolicyTunedParameters = async (mFloor: number, sFloor: number) => {
    try {
      await fetch("/api/cognitive/policy-tune", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ marginFloor: mFloor, safetyStockFloor: sFloor })
      });
      setHasTunedParameter(true);
    } catch (err) {
      console.error("Failed to update policy tuning parameters:", err);
    }
  };

  // META HANDLERS:
  const handleValidateExperience = async () => {
    setIsValidatingExperience(true);
    setValidationResult(prev => ({
      ...prev,
      status: "PENDING",
      concludingText: "Running multi-variable regression with seasonal and promotion calendars..."
    }));
    try {
      const res = await fetch("/api/cognitive/validate-experience", { method: "POST" });
      const body = await res.json();
      if (body.status === "success") {
        setValidationResult(body.validationResult);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsValidatingExperience(false);
    }
  };

  const handleRollbackToVersion = async (version: string, index: number) => {
    if (version === strategyVersion) return;
    try {
      const res = await fetch("/api/cognitive/rollback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ version, index })
      });
      const body = await res.json();
      if (body.status === "success") {
        setStrategyVersion(version);
        setMarginFloor(body.data.floorVal);
        
        // Adjust strategy version arrays
        setStrategyVersionHistoryExt(prev => {
          const next = [...prev];
          next.forEach((item, i) => {
            if (item.version === version) {
              item.rollbackState = "Active Run (Restored)";
            } else {
              item.rollbackState = i === 0 ? "Ousted Champion" : "Archived Draft";
            }
          });
          return next;
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRunMemoryGC = async () => {
    setIsGCing(true);
    try {
      const res = await fetch("/api/cognitive/forget-gc", { method: "POST" });
      const body = await res.json();
      if (body.status === "success") {
        setKnowledgeDecayList(body.knowledgeDecayList);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGCing(false);
    }
  };

  const handleChangeArbitration = async (mode: "BALANCED" | "AGGRESSIVE" | "DEFENSIVE") => {
    setActiveArbitrationStrategy(mode);
    try {
      const res = await fetch("/api/cognitive/arbitration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode })
      });
      const body = await res.json();
      if (body.status === "success") {
        const floor = body.data.computedFloor;
        setMarginFloor(floor);
        if (mode === "DEFENSIVE") {
          setArbitrationConflictRatio(18);
          setRewardWeights({
            profit: 55,
            holding: 15,
            customerLTV: 10,
            cashSafety: 20
          });
        } else if (mode === "AGGRESSIVE") {
          setArbitrationConflictRatio(32);
          setRewardWeights({
            profit: 25,
            holding: 10,
            customerLTV: 50,
            cashSafety: 15
          });
        } else {
          setArbitrationConflictRatio(64);
          setRewardWeights({
            profit: 40,
            holding: 25,
            customerLTV: 15,
            cashSafety: 20
          });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAuditingSelfCapabilities = async () => {
    setIsSelfAuditing(true);
    try {
      await loadCognitiveState();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSelfAuditing(false);
    }
  };

  const simulateSpeech = [
    {
      agent: "CMO Brain",
      role: "Marketing Director",
      stance: "pro",
      color: "text-rose-400 bg-rose-500/10 border-rose-500/10",
      argument: "French search volume indices for Wool Blazers is up 22%. I urge the board to approve an immediate €1,500 budget boost for localized French paid search campaigns, supported by a localized 15% coupon discount to capture front-loaded trans-seasonal demand.",
      confidence: 0.88
    },
    {
      agent: "CFO Brain",
      role: "Financial Comptroller",
      stance: "con",
      color: "text-amber-400 bg-amber-500/10 border-amber-500/10",
      argument: "I must raise an absolute veto on pure discount coupons. Our gross profit margin for the jackets is currently sitting at 38%. Introducing a flat 15% price cut reduces our net unit margin below our absolute mandatory Policy DSL limit of 35.0%. I suggest optimizing bundle combinations instead of cutting raw unit retail pricing.",
      confidence: 0.94
    },
    {
      agent: "COO Brain",
      role: "Operations & Supply",
      stance: "neutral",
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/10",
      argument: "Our Le Havre Maritime Depot reports only 45 units remaining of Elysée Coats. With seasonal velocity, we face a critical stockout event in 12 days. I recommend placing a restocking order of 300 units with our Spanish Premium Cotton & Wool Mills immediately, before raw material logistics fees spike.",
      confidence: 0.91
    },
    {
      agent: "Critic Brain",
      role: "Risk & Compliance Assur",
      stance: "con",
      color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/10",
      argument: "Agreement with CFO. Running uncoordinated promo campaigns and restocking outlays concurrently triggers a high short-term cashflow warning (Projected 21-day restock deficit of €8,400). We must synchronize these tasks rather than running them in visual parallel.",
      confidence: 0.87
    },
    {
      agent: "CEO Consensus Brain",
      role: "Strategic Executive Director",
      stance: "neutral",
      color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
      argument: "Consensus Resolution reached: 1. Authorize Le Havre restocking order of 300 units immediately to avoid seasonal stockout penalty. 2. Reject the flat 15% coupon. Instead, CMO will configure a 'Merino-Cashmere Bundle Combination' targeting VIP segments with a bundled 8% margin retention. Let's deploy to Shadow Sandbox dry-run now.",
      confidence: 0.95
    }
  ];

  const handleRunDebate = () => {
    setIsDebating(true);
    setDebateRound(1);
    setDebateLogs([]);
    let currentIdx = 0;
    
    const interval = setInterval(() => {
      if (currentIdx < simulateSpeech.length) {
        setDebateLogs((prev) => [...prev, simulateSpeech[currentIdx]]);
        currentIdx++;
        setDebateRound((r) => r + 1);
      } else {
        clearInterval(interval);
        setIsDebating(false);
      }
    }, 1500);
  };

  const handleApproveAction = async () => {
    setApprovingLoading(true);
    try {
      await onTriggerRestock("elysee-wool-jacket", 300);
      setHasApprovedSandbox(true);
    } catch (err) {
      console.error(err);
    } finally {
      setApprovingLoading(false);
    }
  };

  const toggleGoal = (id: string) => {
    setExpandedGoals(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Why-Tree Database for Root Cause Analysis
  const whyTrees: Record<string, {
    title: string;
    description: string;
    confidence: number;
    remedy: string;
    nodes: { level: string; label: string; cause: string; evidence: string }[];
  }> = {
    french_ctr_drop: {
      title: "French Campaign ROAS Decrease (-18% Daily Drift)",
      description: "Organic conversion rates are rising, but overall paid acquisition return on ad spend has slipped below statutory thresholds due to competitive bidding saturation.",
      confidence: 91,
      remedy: "Pause broad-match French apparel paid ads. Shift budget to long-tail sustainable premium merino keywords targeting Paris & Monaco VIP demographics.",
      nodes: [
        {
          level: "Symptom (Why 1)",
          label: "Aggregate daily sales revenue flatlined despite high local organic retail demand.",
          cause: "Conversion rate drop inside foreign-sourced campaign referrals.",
          evidence: "Shopify pixel confirms checkout exit rate increased 18%."
        },
        {
          level: "Direct Cause (Why 2)",
          label: "Local advertisement click-through rates drifted from 2.4% down to 1.6%.",
          cause: "Direct copy fatigue after 45 days of unoptimized static asset rotations.",
          evidence: "Facebook CPC analytics dashboard (Sensory upload) show high brand overlap."
        },
        {
          level: "Underlying Link (Why 3)",
          label: "Competitor bid inflation for keyword 'Luxe Wool Outerwear' rose 42%.",
          cause: "Three competing luxury labels launched aggressive VIP early-autumn promos concurrently.",
          evidence: "Market Intelligence crawlers scrape active competitor index multipliers."
        },
        {
          level: "Root Cause (Why 4)",
          label: "Local marketing strategy lacks automated cross-entity margin insulation.",
          cause: "Prices stayed rigid at top-tier MSRP while competitors applied fluid localized price elasticity cuts.",
          evidence: "Commerce knowledge graph highlights lack of dynamic price triggers."
        }
      ]
    },
    overstock_holding_earbuds: {
      title: "Stockholding Capital Congestion (Excess Wireless Earbuds)",
      description: "HydroFlask inventory is secure, but Wireless Earbuds inventory turnover rate has slowed, capturing €9,400 in locked working capital.",
      confidence: 85,
      remedy: "Deploy localized bundle promotion: Purchase Elysée Wool Jacket, receive Wireless Earbuds at a 50% discount to unlock holding costs.",
      nodes: [
        {
          level: "Symptom (Why 1)",
          label: "Le Havre inventory holding fees rose by 14% month-over-month.",
          cause: "Slow inventory rotation of secondary non-seasonal SKU lines.",
          evidence: "Le Havre warehouse telemetry ledger registers 540 static cubic meters of Earbuds."
        },
        {
          level: "Direct Cause (Why 2)",
          label: "Slowing sales velocity (Only 1.2 units sold daily, down from 8.5 units safety standard).",
          cause: "Product demand reaching market saturation with major discount alternatives.",
          evidence: "30-day product demand registry."
        },
        {
          level: "Root Cause (Why 3)",
          label: "Misaligned forecasting multipliers during procurement phase.",
          cause: "Procurement planner used pure rolling statistical fits instead of multi-quantile TimesFM zero-shot seasonality trends.",
          evidence: "Self-Benchmark reveals 24% projection error in legacy forecasting algorithms."
        }
      ]
    },
    cashflow_strain_restock: {
      title: "Compound Cashflow Strain Alert (21-Day Risk)",
      description: "Concurrently funding wool fabric purchase orders and paid digital media acquisition creates a temporary margin buffer depletion.",
      confidence: 95,
      remedy: "Implement structured 365-day strategic plan: Delay non-essential CMO ad expansion by 9 days until Spanish Mills order arrives at warehouse and releases initial unit margins.",
      nodes: [
        {
          level: "Symptom (Why 1)",
          label: "Projected cash reserves drift toward minimum operating floor of €12,000.",
          cause: "Outward capital outlays occur in identical high-cost cycles.",
          evidence: "CFO ledger balances."
        },
        {
          level: "Direct Cause (Why 2)",
          label: "Restocking costs of Elysée jackets require upfront supply chain payment.",
          cause: "Supplier terms with Spanish Mills mandate 100% upfront margin commitment before cargo departures.",
          evidence: "Supplier contract OCR document scan (invoice PO ref compliance verification)."
        },
        {
          level: "Root Cause (Why 3)",
          label: "Absence of Goal-Conflict Solver optimization weights.",
          cause: "Planner approved simultaneous execution of separate goals (Accelerate ROAS & Maintain Safety Stock) without calculating temporal cash-flow overlaps.",
          evidence: "Autonomous Planner history trace files."
        }
      ]
    }
  };

  // HANDLERS FOR SELF-EVOLUTION PLAYGROUNDS:
  const triggerReflectionManual = () => {
    setIsReflecting(true);
    setTimeout(() => {
      const freshLogs = [
        {
          timestamp: "Just Now",
          goal: "Clear excess non-seasonal static earbud volume from warehouses",
          action: "Generated Wool Blazer co-bundle checkout prompt for French customers",
          outcome: "Attracted 45 cross-sell conversions in 6 hours. Zero margin penalty on blazer MSRP.",
          lesson: "Low cost accessories are optimal margin shields when used as checkout incentives rather than price adjustments."
        },
        ...reflectionLogs
      ];
      setReflectionLogs(freshLogs);
      setIsReflecting(false);
    }, 1200);
  };

  const triggerStrategyMutation = () => {
    setIsMutatingStrategy(true);
    setTimeout(() => {
      const parts = strategyVersion.split(".");
      const patch = parseInt(parts[2]) + 1;
      const nextVer = `${parts[0]}.${parts[1]}.${patch}`;
      setStrategyVersion(nextVer);
      setStrategyVersionsHistory([
        { version: nextVer, date: "Today", reward: computedRewardScore, status: "Active Runway" },
        ...strategyVersionsHistory.map(v => ({ ...v, status: "Archived" }))
      ]);
      setIsMutatingStrategy(false);
    }, 1500);
  };

  const triggerConsolidationTask = () => {
    setIsConsolidating(true);
    setTimeout(() => {
      setUnconsolidatedCount(12);
      setConsolidatedLaws([
        "COMMERCE_LAW_03: Friday morning email dispatch targeting Italian VIP subscribers achieves a 42% ROI premium when marketing cashmere bundles instead of static jacket retail price points.",
        ...consolidatedLaws
      ]);
      setIsConsolidating(false);
    }, 2000);
  };

  const triggerHypothesisGeneration = () => {
    setIsGeneratingHypothesis(true);
    setTimeout(() => {
      const speculativeList = [
        {
          id: `HYPO-${Math.round(100 + Math.random() * 500)}`,
          premise: "If we target Italy VIP demographics on Friday morning with a specialized Cashmere outfit pairing...",
          expectedOutcome: "+15% expansion in unit checkout values with 41% net profit retention.",
          confidence: Math.round(75 + Math.random() * 20),
          status: "Waiting for shadow Dry Run"
        },
        ...hypotheses
      ];
      setHypotheses(speculativeList);
      setIsGeneratingHypothesis(false);
    }, 1200);
  };

  const startABSimTesting = () => {
    setIsABying(true);
    setAbStream([]);
    let counter = 0;
    const ticker = [
      { step: "Observe baseline metrics", v1_score: "84.5", v2_score: "85.2", status: "Matching profiles" },
      { step: "Applying monte-carlo demand noise (1,000 runs)", v1_score: "83.9", v2_score: "87.4", status: "Calculating limits" },
      { step: "Review dynamic pricing elasticity curves", v1_score: "84.1", v2_score: "89.2", status: "Applying constraints" },
      { step: "Audit completed: Strategy Beta achieves 6.1% improvement", v1_score: "84.5 (legacy)", v2_score: "90.6 (champion)", status: "COMPLETED" }
    ];

    const interv = setInterval(() => {
      if (counter < ticker.length) {
        setAbStream(prev => [...prev, ticker[counter]]);
        counter++;
      } else {
        clearInterval(interv);
        setIsABying(false);
      }
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-1 min-h-[450px]">
      
      {/* HEADER OVERVIEW BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/40 to-indigo-950/20 rounded-xl p-5 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
            AI COMMERCE OS - ACTIVE EXECUTIVE COGNITION DASHBOARD
          </h2>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-[700px]">
            Shopify Sidekick level commercial brain. Continuous self-monitoring, strategic planning, cross-agent evaluation, and risk-insulated shadow execution. Fully explainable retail operations.
          </p>
        </div>
        <div className="bg-slate-950 px-3.5 py-1.5 rounded-lg border border-slate-800 font-mono text-[10px] uppercase text-right shrink-0">
          <div className="text-slate-500">Global Operating Mode</div>
          <div className="text-emerald-400 font-bold flex items-center gap-1 mt-0.5 justify-end">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            Autonomous Loop Active
          </div>
        </div>
      </div>

      {/* TIER 1: AI CEO TODAY'S OPERATING REPORT */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-slate-950/90 border border-slate-850 p-4 rounded-xl relative overflow-hidden group hover:border-cyan-500/20 transition">
          <div className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-500">Today's Sales Revenue</div>
          <div className="text-2xl font-bold font-mono text-white mt-1.5">€8,520</div>
          <div className="text-[10px] text-emerald-400 font-mono mt-1 flex items-center gap-1">
            <span>↑ 12%</span>
            <span className="text-slate-500">vs historical median</span>
          </div>
          <div className="absolute top-2 right-2 text-cyan-400/5 group-hover:text-cyan-400/10 transition text-5xl font-bold select-none font-mono">1</div>
        </div>

        <div className="bg-slate-950/90 border border-slate-850 p-4 rounded-xl relative overflow-hidden group hover:border-cyan-500/20 transition">
          <div className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-500">Net Operating Profit</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1.5">€2,341</div>
          <div className="text-[10px] text-emerald-400 font-mono mt-1 flex items-center gap-1">
            <span>↑ 8%</span>
            <span className="text-slate-500">units margin peak</span>
          </div>
          <div className="absolute top-2 right-2 text-emerald-400/5 group-hover:text-emerald-400/10 transition text-5xl font-bold select-none font-mono">2</div>
        </div>

        <div className="bg-slate-950/90 border border-slate-850 p-4 rounded-xl relative overflow-hidden group hover:border-rose-500/20 transition">
          <div className="text-[10px] uppercase font-mono font-bold tracking-wider text-rose-400">Inventory Holding Risks</div>
          <div className="text-2xl font-bold font-mono text-rose-300 mt-1.5">
            {scanAlerts.filter(a => a.type === "STOCKS").length > 0
              ? `${scanAlerts.filter(a => a.type === "STOCKS").length} SKU Warn`
              : "0 SKU Alerts"}
          </div>
          <div className="text-[10px] text-rose-400 font-mono mt-1 leading-snug">
            {scanAlerts.find(a => a.type === "STOCKS")?.message || "All products are safely stocked above replenished triggers."}
          </div>
          <div className="absolute top-2 right-2 text-rose-500/5 group-hover:text-rose-500/10 transition text-5xl font-bold select-none font-mono">3</div>
        </div>

        <div className="bg-slate-950/90 border border-slate-850 p-4 rounded-xl relative overflow-hidden group hover:border-amber-500/20 transition">
          <div className="text-[10px] uppercase font-mono font-bold tracking-wider text-amber-400">Paid Media ROAS Risks</div>
          <div className="text-2xl font-bold font-mono text-amber-300 mt-1.5">
            {scanAlerts.filter(a => a.type === "ADS").length > 0
              ? `${scanAlerts.filter(a => a.type === "ADS").length} Ad Alert`
              : "0 Active Risks"}
          </div>
          <div className="text-[10px] text-amber-400 font-mono mt-1 leading-snug">
            {scanAlerts.find(a => a.type === "ADS")?.message || "France CPA digital campaigns are within positive target ROI bounds."}
          </div>
          <div className="absolute top-2 right-2 text-amber-500/5 group-hover:text-amber-500/10 transition text-5xl font-bold select-none font-mono">4</div>
        </div>

        <div className="bg-slate-950/90 border border-slate-850 p-4 rounded-xl relative overflow-hidden group hover:border-purple-500/20 transition">
          <div className="text-[10px] uppercase font-mono font-bold tracking-wider text-purple-400">Cashflow Forecasts</div>
          <div className="text-2xl font-bold font-mono text-purple-300 mt-1.5">
            {scanAlerts.filter(a => a.type === "CASHFLOW").length > 0 ? "Capital Cap" : "Normal Cap"}
          </div>
          <div className="text-[10px] text-purple-400 font-mono mt-1 leading-snug font-semibold">
            {scanAlerts.find(a => a.type === "CASHFLOW")?.message || "Cash reserves buffer exceeds minimum operating threshold for 30d."}
          </div>
          <div className="absolute top-2 right-2 text-purple-500/5 group-hover:text-purple-500/10 transition text-5xl font-bold select-none font-mono">5</div>
        </div>
      </div>

      {/* COGNITIVE SELF-EVOLUTION SYSTEM CORE - 8 STANDARD MODULES PLAYGROUND */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-900 pb-3 gap-3">
          <div>
            <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-400 animate-spin" />
              COGNITIVE COREGONAL SELF-EVOLUTION OS (自我进化核心)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              The AI refines its pricing formulae, consolidates experiences, formulates hypotheses, analyzes post-mortems and validates strategies in risk-insulated digital twins.
            </p>
          </div>
          <div className="px-3 py-1 bg-cyan-950/30 border border-cyan-800/40 rounded-lg text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
            <span>RUNNING Runway:</span>
            <span>{strategyVersion}</span>
          </div>
        </div>

        {/* Outer Grid: Tab buttons and Subsystem display */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Nav column: 8 precise learning components */}
          <div className="flex flex-col gap-1.5">
            <button
              onClick={() => setActiveEvoTab("reflection")}
              className={`p-2.5 rounded-xl border font-mono text-xs text-left transition flex items-center justify-between cursor-pointer ${
                activeEvoTab === "reflection"
                  ? "bg-gradient-to-r from-slate-900 to-slate-950 border-cyan-500 text-cyan-400 font-bold"
                  : "bg-slate-950/50 border-slate-900 text-slate-450 hover:bg-slate-900/40 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2">
                <Bookmark className="w-3.5 h-3.5" />
                <span>1. Self-Reflection</span>
              </span>
              <span className="text-[9px] bg-cyan-950/80 px-1 rounded border border-cyan-800/20 text-cyan-400">ACTIVE</span>
            </button>

            <button
              onClick={() => setActiveEvoTab("mutation")}
              className={`p-2.5 rounded-xl border font-mono text-xs text-left transition flex items-center justify-between cursor-pointer ${
                activeEvoTab === "mutation"
                  ? "bg-gradient-to-r from-slate-900 to-slate-950 border-cyan-500 text-cyan-400 font-bold"
                  : "bg-slate-950/50 border-slate-900 text-slate-450 hover:bg-slate-900/40 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5" />
                <span>2. Strategy Mutation</span>
              </span>
              <span className="text-[9px] text-slate-500">{strategyVersion}</span>
            </button>

            <button
              onClick={() => setActiveEvoTab("consolidation")}
              className={`p-2.5 rounded-xl border font-mono text-xs text-left transition flex items-center justify-between cursor-pointer ${
                activeEvoTab === "consolidation"
                  ? "bg-gradient-to-r from-slate-900 to-slate-950 border-cyan-500 text-cyan-400 font-bold"
                  : "bg-slate-950/50 border-slate-900 text-slate-450 hover:bg-slate-900/40 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5" />
                <span>3. Memory Compress</span>
              </span>
              <span className="text-[9px] bg-slate-900 px-1 rounded text-slate-400">{unconsolidatedCount} event</span>
            </button>

            <button
              onClick={() => setActiveEvoTab("reward")}
              className={`p-2.5 rounded-xl border font-mono text-xs text-left transition flex items-center justify-between cursor-pointer ${
                activeEvoTab === "reward"
                  ? "bg-gradient-to-r from-slate-900 to-slate-950 border-cyan-500 text-cyan-400 font-bold"
                  : "bg-slate-950/50 border-slate-900 text-slate-450 hover:bg-slate-900/40 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2">
                <Scale className="w-3.5 h-3.5" />
                <span>4. Business Reward</span>
              </span>
              <span className="text-[10px] font-bold text-emerald-405 text-emerald-400">{computedRewardScore} index</span>
            </button>

            <button
              onClick={() => setActiveEvoTab("failure")}
              className={`p-2.5 rounded-xl border font-mono text-xs text-left transition flex items-center justify-between cursor-pointer ${
                activeEvoTab === "failure"
                  ? "bg-gradient-to-r from-slate-900 to-slate-950 border-cyan-500 text-cyan-400 font-bold"
                  : "bg-slate-950/50 border-slate-900 text-slate-450 hover:bg-slate-900/40 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>5. Failure Diagnostics</span>
              </span>
              <span className="text-[9px] text-rose-400 font-bold">2 INCIDENTS</span>
            </button>

            <button
              onClick={() => setActiveEvoTab("hypothesis")}
              className={`p-2.5 rounded-xl border font-mono text-xs text-left transition flex items-center justify-between cursor-pointer ${
                activeEvoTab === "hypothesis"
                  ? "bg-gradient-to-r from-slate-900 to-slate-950 border-cyan-500 text-cyan-400 font-bold"
                  : "bg-slate-950/50 border-slate-900 text-slate-450 hover:bg-slate-900/40 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>6. Hypotheses Bay</span>
              </span>
              <span className="text-[9px] bg-slate-900/80 px-1 rounded text-slate-400">Hypotheses: {hypotheses.length}</span>
            </button>

            <button
              onClick={() => setActiveEvoTab("experiment")}
              className={`p-2.5 rounded-xl border font-mono text-xs text-left transition flex items-center justify-between cursor-pointer ${
                activeEvoTab === "experiment"
                  ? "bg-gradient-to-r from-slate-900 to-slate-950 border-cyan-500 text-cyan-400 font-bold"
                  : "bg-slate-950/50 border-slate-900 text-slate-450 hover:bg-slate-900/40 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2">
                <LineChart className="w-3.5 h-3.5" />
                <span>7. Digital Twin A/B</span>
              </span>
              <span className="text-[9px] text-slate-500">MONTE-CARLO</span>
            </button>

            <button
              onClick={() => setActiveEvoTab("tuner")}
              className={`p-2.5 rounded-xl border font-mono text-xs text-left transition flex items-center justify-between cursor-pointer ${
                activeEvoTab === "tuner"
                  ? "bg-gradient-to-r from-slate-900 to-slate-950 border-cyan-500 text-cyan-400 font-bold"
                  : "bg-slate-950/50 border-slate-900 text-slate-450 hover:bg-slate-900/40 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5" />
                <span>8. Policy DSL Tuner</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-bold">INSULATED</span>
            </button>

            <button
              onClick={() => setActiveEvoTab("research")}
              className={`p-2.5 rounded-xl border font-mono text-xs text-left transition flex items-center justify-between cursor-pointer ${
                activeEvoTab === "research"
                  ? "bg-gradient-to-r from-slate-900 to-slate-950 border-cyan-500 text-cyan-400 font-bold"
                  : "bg-slate-950/50 border-slate-900 text-slate-450 hover:bg-slate-900/40 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>9. Research Brain</span>
              </span>
              <span className="text-[9px] bg-cyan-950/80 px-1 rounded border border-cyan-850 text-cyan-400 font-bold uppercase animate-pulse">AUTO WEB</span>
            </button>
          </div>

          {/* Subsystem console display */}
          <div className="col-span-1 lg:col-span-3 bg-slate-900/30 rounded-2xl border border-slate-850 p-5 min-h-[300px] flex flex-col justify-between">
            
            <AnimatePresence mode="wait">
              {/* TAB 1: SELF-REFLECTION */}
              {activeEvoTab === "reflection" && (
                <motion.div
                  initial={{ opacity: 0, x: 5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-3.5"
                >
                  <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                    <span className="text-xs font-bold font-mono text-slate-100 flex items-center gap-1.5 uppercase">
                      <Bookmark className="w-4 h-4 text-cyan-450" /> [Module 1] Deep Self-Reflection Register
                    </span>
                    <button
                      onClick={triggerReflectionManual}
                      disabled={isReflecting}
                      className="px-3 py-1 bg-cyan-950 hover:bg-cyan-900 border border-cyan-700/50 text-cyan-400 rounded text-[10px] font-mono font-bold transition cursor-pointer"
                    >
                      {isReflecting ? "COGNIZING TRANSACTION AUDIT..." : "TRIGGER IMMEDIATE MANUAL REFLECTION"}
                    </button>
                  </div>

                  <p className="text-xs text-slate-400 font-sans leading-relaxed">
                    Every autonomous action registers in our cognitive cycle. After outcome measurements, the reflection engine logs discrepancies between the projected world model state and true outcomes, converting raw observations to enduring laws of high business precision.
                  </p>

                  <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
                    {reflectionLogs.map((log, i) => (
                      <div key={i} className="p-3 bg-slate-950 rounded-xl border border-slate-900 font-mono text-xs flex flex-col gap-1.5">
                        <div className="flex justify-between text-[10px]">
                          <span className="text-cyan-400 font-bold">TARGET: {log.goal}</span>
                          <span className="text-slate-500">{log.timestamp}</span>
                        </div>
                        <div className="text-slate-200 mt-1">
                          <strong className="text-slate-400">Action:</strong> {log.action}
                        </div>
                        <div className="p-2 bg-slate-900/50 rounded border border-slate-900/80 mt-1 flex justify-between items-center">
                          <span className="text-emerald-400">✓ Outcome: {log.outcome}</span>
                        </div>
                        <div className="text-[11px] text-indigo-300 italic">
                          💡 Learned Lesson: "{log.lesson}"
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* TAB 2: STRATEGY MUTATION */}
              {activeEvoTab === "mutation" && (
                <motion.div
                  initial={{ opacity: 0, x: 5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-4"
                >
                  <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                    <span className="text-xs font-bold font-mono text-slate-100 flex items-center gap-1.5 uppercase">
                      <RefreshCw className="w-4 h-4 text-cyan-400" /> [Module 2] Strategic Strategy Mutation Engine
                    </span>
                    <button
                      onClick={triggerStrategyMutation}
                      disabled={isMutatingStrategy}
                      className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white rounded text-[10px] font-mono font-bold transition cursor-pointer"
                    >
                      {isMutatingStrategy ? "MUTATING STRATEGIC GENES..." : "MUTATE CURRENT ACTIVE STRATEGY"}
                    </button>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    The cognitive meta-controller is capable of mutating local retail strategy configurations (pricing thresholds, search keyword boundaries, restocking timelines) inside safe policies parameters to seek overall Pareto optimizations.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-850 font-mono text-xs flex flex-col gap-2">
                      <div className="text-slate-400 uppercase text-[10px] tracking-wider">Active Strategic Version</div>
                      <div className="text-2xl font-bold text-white tracking-widest">{strategyVersion}</div>
                      <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Running: Enforcing 15% net Margin Protection & 300 Stock replenishment buffers</span>
                      </div>
                    </div>

                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                      <div className="text-[10px] uppercase font-bold text-slate-500 font-mono">Mutation History Tree</div>
                      {strategyVersionsHistory.map((v, idx) => (
                        <div key={idx} className="p-2 bg-slate-950/60 rounded border border-slate-900 font-mono text-[11px] flex justify-between items-center">
                          <span className="text-slate-300">{v.version} ({v.date})</span>
                          <span className="text-cyan-400 font-bold">{v.reward} Pt Reward</span>
                          <span className={`text-[9px] px-1 py-0.5 rounded ${v.status === "Active Runway" ? "bg-emerald-950 text-emerald-400 border border-emerald-900" : "bg-slate-900 text-slate-500"}`}>{v.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 3: MEMORY CONSOLIDATION */}
              {activeEvoTab === "consolidation" && (
                <motion.div
                  initial={{ opacity: 0, x: 5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-4"
                >
                  <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                    <span className="text-xs font-bold font-mono text-slate-100 flex items-center gap-1.5 uppercase">
                      <Layers className="w-4 h-4 text-cyan-400" /> [Module 3] Memory Consolidation Core
                    </span>
                    <button
                      onClick={triggerConsolidationTask}
                      disabled={isConsolidating || unconsolidatedCount < 100}
                      className="px-3 py-1 bg-cyan-950 hover:bg-cyan-900 border border-cyan-800 text-cyan-400 rounded text-[10px] font-mono font-bold transition cursor-pointer disabled:opacity-50"
                    >
                      {isConsolidating ? "EXECUTING HYBRID CLUSTERING..." : "COMPRESS EVENTS BUFFER"}
                    </button>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    With hours of operations, raw trace logs and telemetry databases expand endlessly. Periodically, the Consolidation agent clusters redundant events, deleting transient noise logs, and compacting patterns to immutable, high-priority **Commerce Laws (商业定律库)**.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-900 font-mono text-xs flex flex-col justify-between">
                      <div>
                        <div className="text-slate-500 uppercase text-[9px]">Unconsolidated Raw Buffer State</div>
                        <div className="text-3xl font-bold text-slate-100 mt-1 font-mono">{unconsolidatedCount.toLocaleString()} events</div>
                        <p className="text-[10px] text-slate-500 mt-1.5">Includes raw API checks, coordinate traces, and telemetry spikes.</p>
                      </div>
                      <div className="mt-4">
                        <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-cyan-500 h-full rounded" style={{ width: unconsolidatedCount > 1000 ? "85%" : "5%" }} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-[10px] font-bold text-slate-500 uppercase font-mono">Consolidated Commerce Laws:</div>
                      {consolidatedLaws.map((law, idx) => (
                        <div key={idx} className="p-2.5 bg-indigo-950/20 rounded border border-indigo-900/30 text-[11px] font-mono leading-relaxed text-indigo-300">
                          {law}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 4: REWARD SCORE */}
              {activeEvoTab === "reward" && (
                <motion.div
                  initial={{ opacity: 0, x: 5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-4"
                >
                  <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                    <span className="text-xs font-bold font-mono text-slate-100 flex items-center gap-1.5 uppercase">
                      <Scale className="w-4 h-4 text-cyan-400" /> [Module 4] Enterprise Integrated Reward Ledger
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400">Score: {computedRewardScore} / 100</span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    Unlike typical single-metric heuristics, AI Commerce OS optimizes for a combined corporate reward matrix. You can adjust strategic goals emphasizing margin profiles, holding reserves or capital margins to let the AI retune weights.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-3 font-mono text-xs text-slate-300">
                      <div>
                        <div className="flex justify-between text-[11px] font-bold mb-1">
                          <span>Net Profit Velocity Weights:</span>
                          <span className="text-cyan-400">{rewardWeights.profit}%</span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="70"
                          value={rewardWeights.profit}
                          onChange={(e) => setRewardWeights({ ...rewardWeights, profit: parseInt(e.target.value) })}
                          className="w-full h-1 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] font-bold mb-1">
                          <span>Holding Costs Relief Coefficient:</span>
                          <span className="text-cyan-400">{rewardWeights.holding}%</span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="50"
                          value={rewardWeights.holding}
                          onChange={(e) => setRewardWeights({ ...rewardWeights, holding: parseInt(e.target.value) })}
                          className="w-full h-1 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] font-bold mb-1">
                          <span>VIP cohort LTV velocity:</span>
                          <span className="text-cyan-400">{rewardWeights.customerLTV}%</span>
                        </div>
                        <input
                          type="range"
                          min="5"
                          max="40"
                          value={rewardWeights.customerLTV}
                          onChange={(e) => setRewardWeights({ ...rewardWeights, customerLTV: parseInt(e.target.value) })}
                          className="w-full h-1 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                        />
                      </div>
                    </div>

                    <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-900 flex flex-col justify-between font-mono">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-bold text-[9px]">Optimized Cognitive Grade:</span>
                        <div className="text-4xl font-bold text-center text-emerald-400 my-2 font-mono">{computedRewardScore} pt</div>
                      </div>
                      <p className="text-[10px] text-slate-450 leading-relaxed italic border-t border-slate-900 pt-2 text-center">
                        "Weighted matrix matches corporate DNA thresholds. Dynamic profit and stocking risk curves aligned."
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 5: FAILURE DIAGNOSTICS */}
              {activeEvoTab === "failure" && (
                <motion.div
                  initial={{ opacity: 0, x: 5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-4"
                >
                  <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                    <span className="text-xs font-bold font-mono text-slate-100 flex items-center gap-1.5 uppercase">
                      <AlertTriangle className="w-4 h-4 text-cyan-400" /> [Module 5] Post-Mortem Failure Analysis
                    </span>
                    <select
                      value={inspectedFailure}
                      onChange={(e) => setInspectedFailure(e.target.value)}
                      className="bg-slate-950 border border-slate-850 text-xs px-2.5 py-1.5 rounded text-slate-300 font-mono focus:border-cyan-500 outline-none"
                    >
                      <option value="leak_q2">Q2 Ad Match Margin Fatigue</option>
                      <option value="stockout_winter">Early Winter Elysée Jackets Stockout</option>
                    </select>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    True evolution depends on treating failures as structural lessons. Our system analyzes any stockouts, margins deficits or ROAS drops to hardcode corrective rules into the Governance DSL.
                  </p>

                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-905 flex flex-col gap-2.5 font-mono text-xs">
                    <div className="flex justify-between text-slate-100 font-bold">
                      <span className="text-rose-450">Event Class: {failuresDatabase[inspectedFailure].event}</span>
                      <span className="text-slate-500">Recorded: {failuresDatabase[inspectedFailure].date}</span>
                    </div>
                    <div className="text-rose-400 font-bold font-mono mt-0.5">Impact: {failuresDatabase[inspectedFailure].effect}</div>
                    
                    <div className="p-2.5 bg-slate-900/60 rounded border border-slate-900 mt-1 leading-relaxed text-slate-350">
                      <strong>Diagnostic Breakdown:</strong> {failuresDatabase[inspectedFailure].analysis}
                    </div>

                    <div className="p-2.5 bg-emerald-950/20 border border-emerald-900/30 rounded mt-1 flex gap-2 items-start text-emerald-300 leading-relaxed text-[11px]">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <strong>Injected Preventative Rule constraint:</strong> {failuresDatabase[inspectedFailure].preventativePolicy}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 6: HYPOTHESIS GENERATOR */}
              {activeEvoTab === "hypothesis" && (
                <motion.div
                  initial={{ opacity: 0, x: 5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-4"
                >
                  <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                    <span className="text-xs font-bold font-mono text-slate-100 flex items-center gap-1.5 uppercase">
                      <Sparkles className="w-4 h-4 text-cyan-400" /> [Module 6]speculative Business Hypothesis Bay
                    </span>
                    <button
                      onClick={triggerHypothesisGeneration}
                      disabled={isGeneratingHypothesis}
                      className="px-3 py-1 bg-cyan-950 hover:bg-cyan-950/50 border border-cyan-700 text-cyan-400 rounded text-[10px] font-mono font-bold transition cursor-pointer"
                    >
                      {isGeneratingHypothesis ? "CONJURING RETAIL EQUATIONS..." : "GENERATE NEWspeculative HYPOTHESIS"}
                    </button>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    The cognitive engine continuously runs generative loops exploring potential strategic actions (promotions, price modifications, supply channels changes). Hypotheses are tested inside simulated twins before deployment proposed.
                  </p>

                  <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                    {hypotheses.map((hypo, idx) => (
                      <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-900 font-mono text-xs flex flex-col gap-1.5">
                        <div className="flex justify-between text-[11px] font-bold">
                          <span className="text-cyan-400">{hypo.id}</span>
                          <span className="px-1.5 py-0.5 bg-slate-900 text-slate-500 rounded text-[9px] uppercase border border-slate-850">CONFIDENCE: {hypo.confidence}%</span>
                        </div>
                        <div className="text-slate-200 mt-1 leading-relaxed">
                          <strong className="text-slate-400">Premise:</strong> {hypo.premise}
                        </div>
                        <div className="text-[11px] text-slate-400 border-t border-slate-900/50 pt-1.5 mt-1 leading-relaxed">
                          <strong className="text-indigo-300">Expected Outcome:</strong> {hypo.expectedOutcome}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* TAB 7: EXPERIMENT A/B */}
              {activeEvoTab === "experiment" && (
                <motion.div
                  initial={{ opacity: 0, x: 5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-4"
                >
                  <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                    <span className="text-xs font-bold font-mono text-slate-100 flex items-center gap-1.5 uppercase">
                      <LineChart className="w-4 h-4 text-cyan-400" /> [Module 7] Digital Twin Strategy A/B Simulation
                    </span>
                    <button
                      onClick={startABSimTesting}
                      disabled={isABying}
                      className="px-3 py-1 bg-cyan-950 hover:bg-cyan-900 border border-cyan-700 text-cyan-400 rounded text-[10px] font-mono font-bold transition cursor-pointer"
                    >
                      {isABying ? "STREAMING SIMULATION PATHS..." : "START VIRTUAL A/B BATCH"}
                    </button>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    We benchmark proposed strategy updates by running parallel 1,000-point Monte-Carlo demand simulations side-by-side using real pricing elasticities, seasonal vectors and catalog parameters.
                  </p>

                  {abStream.length === 0 ? (
                    <div className="text-center py-6 text-slate-600 border border-dashed border-slate-850 rounded-xl bg-slate-950/10 font-mono text-xs">
                      Simulation Chamber Idle. Trigger virtual A/B batch to verify profile parameters.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-40 overflow-y-auto font-mono text-xs pr-1">
                      {abStream.map((s, idx) => (
                        <div key={idx} className="p-2.5 bg-slate-950 rounded border border-slate-900 flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="text-cyan-400 font-bold">•</span>
                            <span className="text-slate-300">{s.step}</span>
                          </div>
                          <div className="flex gap-4 font-mono text-[11px]">
                            <span>V1 Score: <strong className="text-slate-400">{s.v1_score}</strong></span>
                            <span>V2 Score: <strong className="text-emerald-400">{s.v2_score}</strong></span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* TAB 8: POLICY TUNER */}
              {activeEvoTab === "tuner" && (
                <motion.div
                  initial={{ opacity: 0, x: 5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-4"
                >
                  <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                    <span className="text-xs font-bold font-mono text-slate-100 flex items-center gap-1.5 uppercase">
                      <Sliders className="w-4 h-4 text-cyan-400" /> [Module 8] Permanent Governance DSL parameters
                    </span>
                    {hasTunedParameter && (
                      <span className="text-[10px] bg-emerald-950 border border-emerald-900 text-emerald-400 font-bold px-2 py-0.5 rounded font-mono uppercase">
                        Active Safeguards Re-compiled
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    The AI operates within statutory bounds dictated by your brand DSL rules. You can adjust the minimum gross profit threshold margin boundaries or safety inventory levels to retune active compliance safeguards.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-4 font-mono text-xs text-slate-300">
                      <div>
                        <div className="flex justify-between text-[11px] font-bold mb-1">
                          <span>Mandatory Enterprise profit Margin Floor:</span>
                          <span className="text-emerald-400 font-bold">{marginFloor}%</span>
                        </div>
                        <input
                          type="range"
                          min="20"
                          max="60"
                          step="0.5"
                          value={marginFloor}
                          onChange={(e) => {
                            setMarginFloor(parseFloat(e.target.value));
                            setHasTunedParameter(true);
                          }}
                          className="w-full h-1 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-emerald-405 accent-emerald-400"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] font-bold mb-1">
                          <span>Replenishment Safety Stock Threshold (Units):</span>
                          <span className="text-rose-400 font-bold">{safetyStockFloor} units</span>
                        </div>
                        <input
                          type="range"
                          min="5"
                          max="50"
                          value={safetyStockFloor}
                          onChange={(e) => {
                            setSafetyStockFloor(parseInt(e.target.value));
                            setHasTunedParameter(true);
                          }}
                          className="w-full h-1 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-rose-400"
                        />
                      </div>
                    </div>

                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-900 text-[11px] font-mono text-slate-400 leading-relaxed flex flex-col justify-between">
                      <div>
                        <span className="text-slate-500 uppercase font-bold text-[8px] block">DSL Parser Verification:</span>
                        <div className="text-slate-350 mt-1">
                          Calculated safe retail boundary envelope for current winter lines. Minimum price point is verified dynamically as Cost Price + <strong className="text-emerald-400 font-bold">{(marginFloor/(100-marginFloor)*100).toFixed(0)}%</strong> buffer.
                        </div>
                      </div>
                      <div className="border-t border-slate-900 pt-1.5 mt-2 flex flex-col gap-1.5 matches-corporate font-mono text-[10px]">
                        {hasTunedParameter ? (
                          <button
                            onClick={() => {
                              syncPolicyTunedParameters(marginFloor, safetyStockFloor);
                              setHasTunedParameter(false);
                            }}
                            className="w-full py-1 bg-emerald-950 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 font-bold rounded transition cursor-pointer text-center"
                          >
                            COMMIT & RECOMPILE ACTIVE SAFEGUARDS
                          </button>
                        ) : (
                          <div className="text-emerald-400 flex items-center gap-1.5 py-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Safeguards synchronized. DSL Engine verified.</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 9: AUTONOMOUS RESEARCH BRAIN */}
              {activeEvoTab === "research" && (
                <motion.div
                  initial={{ opacity: 0, x: 5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-4 text-slate-300"
                >
                  <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                    <span className="text-xs font-bold font-mono text-slate-100 flex items-center gap-1.5 uppercase">
                      <BookOpen className="w-4 h-4 text-cyan-400" /> [Module 9] Grounded Web Research Engine
                    </span>
                    <span className="text-[10px] bg-cyan-950 border border-cyan-850 text-cyan-400 font-bold px-2 py-0.5 rounded font-mono uppercase">
                      Search Grounding Enabled
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                     Provide a brand URL, GitHub Repository, Competitive item link, or high-value market concept. The Research Brain automatically resolves the entity, schedules a multi-source research plan, scrapes clean Markdown pages, correlates live web search results, and writes suggestions back into corporate DNA.
                  </p>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 bg-slate-950/80 border border-slate-800 text-xs font-mono px-3 py-2 rounded-xl text-slate-200 placeholder-slate-650 focus:border-cyan-500 outline-none"
                      placeholder="e.g. 'Nike', 'https://github.com/openclaw/openclaw', 'French luxury apparel trend'"
                      value={researchQuery}
                      onChange={(e) => setResearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !isResearching) {
                          handleRunResearch(researchQuery);
                        }
                      }}
                    />
                    <button
                      onClick={() => handleRunResearch(researchQuery)}
                      disabled={isResearching || !researchQuery.trim()}
                      className="px-4 py-2 bg-cyan-950/80 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 hover:text-cyan-200 font-bold text-xs rounded-xl font-mono cursor-pointer disabled:opacity-40"
                    >
                      {isResearching ? "BOTS RESEARCHING..." : "DEPLOY BOTS"}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mt-1">
                    {/* LEFT PANEL: RESOLUTION & PLANNER */}
                    <div className="space-y-4">
                      <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-900 flex flex-col gap-3 min-h-[160px]">
                        <span className="text-[10px] font-bold font-mono text-slate-500 uppercase tracking-widest block border-b border-slate-900/60 pb-1">
                          Research Tunnel Console
                        </span>
                        
                        <div className="space-y-1.5 font-mono text-[11px]">
                          {researchStepsOutput.map((out, idx) => (
                            <div key={idx} className={out.startsWith("❌") ? "text-rose-400" : out.startsWith("✓") ? "text-emerald-400" : "text-slate-400"}>
                              {out}
                            </div>
                          ))}
                        </div>

                        {researchPlan.length > 0 && (
                          <div className="mt-2 space-y-2">
                            <span className="text-[9px] uppercase font-mono text-slate-500">Autonomous Plan Steps:</span>
                            <div className="grid grid-cols-1 gap-1.5 max-h-[160px] overflow-y-auto pr-1">
                              {researchPlan.map((step) => (
                                <div key={step.id} className="flex items-center justify-between p-2 bg-slate-900/40 border border-slate-900 rounded text-[11.5px] font-mono">
                                  <span className="text-slate-350">{step.stepName}</span>
                                  <span className="text-[10px] text-emerald-404 text-emerald-400 font-bold uppercase">APPROVED</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* HISTORY RECALL */}
                      <div className="p-4 bg-slate-950/30 rounded-xl border border-slate-900 flex flex-col gap-3">
                        <span className="text-[10px] font-bold font-mono text-slate-550 text-slate-500 uppercase tracking-widest block border-b border-slate-900/60 pb-1">
                          Corporate Research Vault ({researchHistory.length})
                        </span>
                        {researchHistory.length === 0 ? (
                          <div className="text-[11px] font-mono text-slate-500 italic py-2">
                            No previously compiled research vectors stored in persistent memory.
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 gap-2 max-h-[180px] overflow-y-auto pr-1">
                            {researchHistory.map((item, idx) => (
                              <button
                                key={idx}
                                onClick={() => {
                                  setResearchReport(item);
                                  setResearchQuery(item.query);
                                }}
                                className="w-full text-left p-2.5 bg-slate-950/90 hover:bg-slate-900 border border-slate-900 hover:border-slate-800 rounded-lg text-[11px] font-mono transition flex justify-between items-center cursor-pointer"
                              >
                                <div>
                                  <div className="text-cyan-405 text-cyan-400 font-bold">{item.resolvedName}</div>
                                  <div className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[200px]">{item.suggestedIntegrationAction}</div>
                                </div>
                                <div className="text-right text-xs shrink-0 pl-2">
                                  <div className="text-[10px] text-emerald-400 font-bold">{item.estimatedMarginProfitDelta}</div>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* RIGHT PANEL: RICH RESEARCH REPORT */}
                    <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-900 min-h-[300px] flex flex-col justify-between">
                      {researchReport ? (
                        <div className="space-y-4">
                          <div className="flex justify-between items-start border-b border-slate-900 pb-2">
                            <div>
                              <span className="text-[9px] uppercase font-mono text-cyan-400 font-bold tracking-widest bg-cyan-950/40 px-1.5 py-0.5 border border-cyan-850 rounded">
                                {researchReport.entityType}
                              </span>
                              <h4 className="text-sm font-extrabold text-white font-mono mt-1.5 uppercase">
                                {researchReport.resolvedName}
                              </h4>
                              <p className="text-[10px] text-slate-500 font-mono mt-0.5">{researchReport.marketScope}</p>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] uppercase font-mono text-slate-500 block">ESTIMATED IMPACT:</span>
                              <span className="text-xs font-black font-mono text-emerald-400 bg-emerald-950/20 px-2 py-1 rounded inline-block mt-1 border border-emerald-900/30">
                                {researchReport.estimatedMarginProfitDelta}
                              </span>
                            </div>
                          </div>

                          <div className="text-[12px] text-slate-350 leading-relaxed font-sans border-b border-slate-900/60 pb-3">
                            <span className="text-[9px] uppercase font-mono text-slate-550 text-slate-500 font-bold block mb-1">Executive Summary:</span>
                            {researchReport.summary}
                          </div>

                          {/* SWOT GRID */}
                          <div>
                            <span className="text-[9px] uppercase font-mono text-slate-500 font-bold block mb-2">Live Competitive SWOT:</span>
                            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                              <div className="p-2.5 bg-emerald-950/25 border border-emerald-900/20 rounded-lg">
                                <span className="text-emerald-400 font-bold text-[9px] uppercase tracking-wider block mb-1">Strengths</span>
                                <ul className="list-disc list-inside text-slate-300 space-y-0.5 max-h-[70px] overflow-y-auto">
                                  {researchReport.swot.strengths.map((s: string, i: number) => (
                                    <li key={i} className="truncate">{s}</li>
                                  ))}
                                </ul>
                              </div>
                              <div className="p-2.5 bg-rose-950/25 border border-rose-900/20 rounded-lg">
                                <span className="text-rose-400 font-bold text-[9px] uppercase tracking-wider block mb-1">Weaknesses</span>
                                <ul className="list-disc list-inside text-slate-300 space-y-0.5 max-h-[70px] overflow-y-auto">
                                  {researchReport.swot.weaknesses.map((s: string, i: number) => (
                                    <li key={i} className="truncate">{s}</li>
                                  ))}
                                </ul>
                              </div>
                              <div className="p-2.5 bg-cyan-950/25 border border-cyan-900/20 rounded-lg col-span-2">
                                <span className="text-cyan-400 font-bold text-[9px] uppercase tracking-wider block mb-1">Opportunities & Action Guidelines</span>
                                <ul className="list-disc list-inside text-slate-300 space-y-0.5 max-h-[70px] overflow-y-auto">
                                  {researchReport.swot.opportunities.map((s: string, i: number) => (
                                    <li key={i} className="truncate">{s}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>

                          {/* ACTIONABLE RECOMMENDATION */}
                          <div className="p-3 bg-slate-950 border border-slate-900 rounded-xl">
                            <span className="text-[9px] uppercase font-mono text-cyan-400 font-bold block mb-1">AI CEO Decision Recommendations:</span>
                            <div className="text-xs text-slate-100 font-sans leading-snug">
                              {researchReport.suggestedIntegrationAction}
                            </div>
                          </div>

                          {/* CITATIONS */}
                          {researchReport.citations && researchReport.citations.length > 0 && (
                            <div>
                              <span className="text-[9px] uppercase font-mono text-slate-500 font-bold block mb-1.5">Evidence Grounded Sources ({researchReport.citations.length}):</span>
                              <div className="flex flex-wrap gap-1.5">
                                {researchReport.citations.map((c: any) => (
                                  <a
                                    key={c.id}
                                    href={c.uri}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-2 py-1 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-[10px] font-mono rounded text-cyan-400 flex items-center gap-1.5 transition decoration-transparent"
                                  >
                                    <span>{c.title}</span>
                                    <span className="text-[9px] text-emerald-400 font-bold">({c.trustScore}%)</span>
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
                          <BookOpen className="w-8 h-8 text-slate-800 mb-2" />
                          <span className="text-xs font-mono text-slate-500 uppercase tracking-widest block">No Active Report Compiled</span>
                          <span className="text-[10px] text-slate-600 font-sans mt-0.5 max-w-[220px]">
                            Input a brand name, company URL, or repository link to summon web scraping models safely.
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>

            <div className="text-[10px] font-mono text-slate-500 border-t border-slate-900/60 pt-3 flex justify-between items-center shrink-0 mt-3 bg-slate-950/20 px-3 py-1 rounded">
              <span>ACTIVE SYSTEM CONTEXT AUDIT PATHS: RUNNING</span>
              <span className="text-slate-700">|</span>
              <span>EPISODIC LEARNING BUFFER SIZE: 4.5MB</span>
            </div>

          </div>
        </div>
      </div>

      {/* TIER 6.5: ADVANCED META-COGNITIVE SECURITY CHAIN */}
      <div className="bg-slate-950 border border-slate-850 rounded-2xl p-5 flex flex-col gap-5">
        <div className="border-b border-slate-900 pb-3">
          <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2 uppercase tracking-wide">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            🛡️ AI CEO ADVANCED META-COGNITIVE CHAIN (高级元认知与安全进化链)
          </h3>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Ensure the AI CEO evolves safely, with zero false learning, granular strategy versioning, automated memory decay, dynamic goal conflict resolution, and self-diagnostic confidence gating.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          
          {/* COLUMN 1: EXPERIENCE VALIDATOR */}
          <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-850 flex flex-col justify-between gap-3 xl:col-span-1">
            <div className="flex flex-col gap-1.5 font-mono">
              <span className="text-[10px] bg-indigo-950/50 border border-indigo-900 text-indigo-400 px-2 py-0.5 rounded w-fit text-[9px] uppercase font-bold">1. Exp Validator</span>
              <h4 className="text-xs font-bold text-slate-200 mt-1">Confounding Filter</h4>
              <p className="text-[11px] text-slate-450 leading-relaxed font-sans">
                Never save biased links. Audit seasonal overlaps, discounts and traffic spikes before updating permanent corporate rules.
              </p>

              <div className="p-2.5 bg-slate-950 rounded border border-slate-900 mt-2 text-[10.5px] leading-relaxed flex flex-col gap-1">
                <span className="text-slate-400 font-semibold">Under Audit:</span>
                <span className="text-slate-300 italic">"Discounting Elysee Wool jackets by 15.0% directly increases conversions by 30%."</span>
                
                {validationResult.status === "PENDING" && (
                  <div className="text-cyan-400 font-bold mt-2 animate-pulse flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-450 bg-cyan-450 animate-ping" />
                    <span>Crunching regression...</span>
                  </div>
                )}

                {validationResult.status === "ALERT" && (
                  <div className="mt-2 flex flex-col gap-1">
                    <div className="text-rose-400 font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>Bias Isolation Alert!</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-snug">
                      {validationResult.confoundingFactor}
                    </p>
                    <div className="mt-1 text-[9.5px] text-rose-300 border-t border-slate-900 pt-1 flex justify-between">
                      <span>Isolated Elasticity Index:</span>
                      <strong className="font-bold">{validationResult.correlationCoefficient}</strong>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleValidateExperience}
              disabled={isValidatingExperience}
              className="w-full py-1.5 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 rounded font-mono text-[10.5px] font-bold transition cursor-pointer disabled:opacity-50"
            >
              {isValidatingExperience ? "REGRESSION RUNNING..." : "CROSS-VERIFY CORRELATION"}
            </button>
          </div>

          {/* COLUMN 2: STRATEGY VERSIONING */}
          <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-850 flex flex-col justify-between gap-3 xl:col-span-1">
            <div className="flex flex-col gap-2 font-mono">
              <span className="text-[10px] bg-cyan-950/50 border border-cyan-900 text-cyan-400 px-2 py-0.5 rounded w-fit text-[9px] uppercase font-bold">2. STRATEGY ROLLBACK</span>
              <h4 className="text-xs font-bold text-slate-200">Governance Versions</h4>
              <p className="text-[11px] text-slate-450 leading-relaxed font-sans">
                Restore the brand's optimal operating state instantly. Every policy mutation retains full telemetry trace profiles.
              </p>

              <div className="space-y-1.5 mt-2 max-h-[140px] overflow-y-auto pr-1">
                {strategyVersionHistoryExt.map((item, index) => (
                  <div 
                    key={index} 
                    className={`p-2 rounded border transition text-[10px] flex flex-col gap-1 ${
                      item.version === strategyVersion
                        ? "bg-emerald-950/20 border-emerald-900 text-emerald-300"
                        : "bg-slate-950 border-slate-900 text-slate-400 hover:border-slate-800"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white">{item.version}</span>
                      <span className={`text-[8.5px] px-1 rounded font-bold uppercase ${
                        item.version === strategyVersion 
                          ? "bg-emerald-900 text-white" 
                          : "bg-slate-905 bg-slate-900 text-slate-500"
                      }`}>
                        {item.rollbackState}
                      </span>
                    </div>
                    <div className="text-[9.5px] text-slate-450 leading-tight">
                      Cause: {item.reason}
                    </div>
                    <div className="flex justify-between text-[9px] border-t border-slate-900 pt-1 text-slate-500 mt-0.5">
                      <span>ROI: <strong className="text-slate-300 font-bold">{item.results.roi}</strong></span>
                      <span>Margin: <strong className="text-emerald-400 font-bold">{item.results.margins}</strong></span>
                    </div>
                    {item.version !== strategyVersion && (
                      <button
                        onClick={() => handleRollbackToVersion(item.version, index)}
                        className="mt-1 w-full text-center py-0.5 bg-slate-900 hover:bg-slate-850 hover:text-white border border-slate-850 rounded text-[9px] text-cyan-400 font-semibold transition"
                      >
                        RESTORE THIS VERSION
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* COLUMN 3: FORGETTING ENGINE */}
          <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-850 flex flex-col justify-between gap-3 xl:col-span-1">
            <div className="flex flex-col gap-1.5 font-mono">
              <span className="text-[10px] bg-red-950/50 border border-red-900 text-red-400 px-2 py-0.5 rounded w-fit text-[9px] uppercase font-bold">3. FORGETTING & DECAY</span>
              <h4 className="text-xs font-bold text-slate-200 mt-1">Dormant Knowledge GC</h4>
              <p className="text-[11px] text-slate-450 leading-relaxed font-sans">
                Compact memory footprints. Decays outdated, obsolete rules with time or low usage frequency to reduce cognitive overhead.
              </p>

              <div className="space-y-2 mt-2">
                {knowledgeDecayList.map((item, idx) => (
                  <div key={idx} className="p-2 bg-slate-950 border border-slate-900 rounded text-[10.5px]">
                    <div className="flex justify-between text-[9.5px] font-bold">
                      <span className="text-slate-455 text-slate-400">{item.id}</span>
                      <span className={`px-1 rounded text-[8px] uppercase ${item.confidence === 0 ? "bg-red-950 text-red-400 font-bold" : "bg-slate-900 text-slate-500"}`}>
                        {item.state}
                      </span>
                    </div>
                    <p className="text-[10px] mt-0.5 text-slate-300 text-ellipsis overflow-hidden whitespace-nowrap">
                      {item.law}
                    </p>
                    <div className="flex justify-between items-center text-[9px] mt-1 border-t border-slate-900 pt-1 text-slate-500">
                      <span>Dormant for: <strong className="text-slate-350">{item.lastUsedDays} days</strong></span>
                      <span>Decay Score: <strong className={item.decayScore > 80 ? "text-red-400" : "text-emerald-400"}>{item.decayScore}%</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleRunMemoryGC}
              disabled={isGCing}
              className="w-full py-1.5 bg-red-950/20 hover:bg-red-950/40 border border-red-900/40 text-red-400 rounded font-mono text-[10.5px] font-bold transition cursor-pointer"
            >
              {isGCing ? "COGNITIVE PRUNING ACTIVE..." : "RUN COMPACT GARBAGE COLLECTION"}
            </button>
          </div>

          {/* COLUMN 4: GOAL ARBITRATION */}
          <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-850 flex flex-col justify-between gap-3 xl:col-span-1">
            <div className="flex flex-col gap-1.5 font-mono">
              <span className="text-[10px] bg-amber-950/50 border border-amber-900 text-amber-400 px-2 py-0.5 rounded w-fit text-[9px] uppercase font-bold">4. Goal Arbitration</span>
              <h4 className="text-xs font-bold text-slate-200 mt-1">Multi-Objective Balancing</h4>
              <p className="text-[11px] text-slate-450 leading-relaxed font-sans">
                Resolve conflicts between Profit, Holding cost relief and LTV. Modify strategic priority based on enterprise focus.
              </p>

              <div className="p-2.5 bg-slate-950 border border-slate-900 rounded font-mono text-[10.5px] mt-2 space-y-2">
                <div className="flex justify-between border-b border-slate-900 pb-1 text-[9.5px] text-slate-450">
                  <span>Current Focus Profile:</span>
                  <span className="text-amber-400 font-bold uppercase">{activeArbitrationStrategy}</span>
                </div>
                
                <div className="grid grid-cols-3 gap-1">
                  <button
                    onClick={() => handleChangeArbitration("BALANCED")}
                    className={`py-1 rounded font-mono text-[9px] font-semibold text-center uppercase transition ${
                      activeArbitrationStrategy === "BALANCED" ? "bg-cyan-950 border border-cyan-800 text-cyan-400" : "bg-slate-900 text-slate-500 hover:text-white"
                    }`}
                  >
                    Balanced
                  </button>
                  <button
                    onClick={() => handleChangeArbitration("AGGRESSIVE")}
                    className={`py-1 rounded font-mono text-[9px] font-semibold text-center uppercase transition ${
                      activeArbitrationStrategy === "AGGRESSIVE" ? "bg-purple-950 border border-purple-800 text-purple-400" : "bg-slate-900 text-slate-500 hover:text-white"
                    }`}
                  >
                    Aggressive
                  </button>
                  <button
                    onClick={() => handleChangeArbitration("DEFENSIVE")}
                    className={`py-1 rounded font-mono text-[9px] font-semibold text-center uppercase transition ${
                      activeArbitrationStrategy === "DEFENSIVE" ? "bg-emerald-950 border border-emerald-800 text-emerald-400" : "bg-slate-900 text-slate-500 hover:text-white"
                    }`}
                  >
                    Defensive
                  </button>
                </div>

                <div className="text-[9px] text-slate-500 pt-1 leading-snug">
                  {activeArbitrationStrategy === "DEFENSIVE" && "Defensive focus: Injected tight 42.0% Margin rule. Restock buffers held strictly."}
                  {activeArbitrationStrategy === "AGGRESSIVE" && "Aggressive focus: Diluted dynamic Margin to 24.0% to drive checkout velocity."}
                  {activeArbitrationStrategy === "BALANCED" && "Balanced focus: standard 35.0% price floor dynamic calibration index."}
                </div>

                <div className="flex justify-between items-center text-[10px] border-t border-slate-900 pt-1">
                  <span>Pareto Conflict Ratio:</span>
                  <span className={`${arbitrationConflictRatio < 30 ? "text-emerald-400" : "text-amber-400"} font-bold`}>
                    {arbitrationConflictRatio}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMN 5: SELF PERFORMANCE AUDIT */}
          <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-850 flex flex-col justify-between gap-3 xl:col-span-1">
            <div className="flex flex-col gap-1.5 font-mono">
              <span className="text-[10px] bg-purple-950/50 border border-purple-904 border-purple-900 text-purple-400 px-2 py-0.5 rounded w-fit text-[9px] uppercase font-bold">5. SELF-ASSESSMENT</span>
              <h4 className="text-xs font-bold text-slate-200 mt-1">Specialized Confidence Gating</h4>
              <p className="text-[11px] text-slate-450 leading-relaxed font-sans">
                Audit confidence metrics across departments. Bypass human approval limits for validated modules with &gt;=90% accuracy.
              </p>

              <div className="space-y-1.5 mt-2">
                {microAssessments.map((item, idx) => (
                  <div key={idx} className="p-1 px-2 bg-slate-950 border border-slate-900 rounded text-[9.5px] flex flex-col gap-0.5">
                    <div className="flex justify-between items-center font-bold">
                      <span className="text-slate-300">{item.department}</span>
                      <span className={`${item.confidence >= 90 ? "text-emerald-450 text-emerald-450 text-emerald-400" : "text-amber-450 text-amber-400"} font-mono`}>
                        {item.confidence}%
                      </span>
                    </div>
                    <div className="text-[8.5px] text-slate-500 leading-tight">
                      {item.description}
                    </div>
                    <div className="text-[8px] uppercase tracking-wider text-slate-450">
                      Gating Status: <strong className={item.confidence >= 90 ? "text-emerald-400" : "text-amber-400"}>{item.state}</strong>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-1.5 mt-1 border-t border-slate-900 pt-2 text-[9.5px]">
                <input
                  type="checkbox"
                  id="bypassCheck"
                  checked={bypassLowConfidenceApproval}
                  onChange={(e) => setBypassLowConfidenceApproval(e.target.checked)}
                  className="rounded border-slate-800 bg-slate-950 text-cyan-400 accent-cyan-400 cursor-pointer"
                />
                <label htmlFor="bypassCheck" className="text-slate-400 cursor-pointer font-sans">
                  Autonomously authorize low-confidence runs
                </label>
              </div>
            </div>

            <button
              onClick={handleAuditingSelfCapabilities}
              disabled={isSelfAuditing}
              className="w-full py-1.5 bg-purple-950/20 hover:bg-purple-950/40 border border-purple-900/40 text-purple-400 rounded font-mono text-[10.5px] font-bold transition cursor-pointer"
            >
              {isSelfAuditing ? "RE-AUDITING HISTORICAL LOGS..." : "RE-AUDIT COGNITIVE DEPARTS"}
            </button>
          </div>

        </div>
      </div>

      {/* TIER 7: AI BOARDROOM DEBATE - CONSENSUS CONTEXT */}
      <div className="bg-slate-950 border border-slate-850 rounded-xl p-5 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-slate-900 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2 tracking-wide uppercase">
              <span className="text-cyan-400 text-lg">⚖️</span> MULTI-AGENT BOARDROOM CONSENSUS DEBATE
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Let specialized regional agents clash on pricing strategies and supply timelines to isolate pareto-optimal trade outcomes</p>
          </div>
          <div>
            <button
              onClick={handleRunDebate}
              disabled={isDebating}
              className="px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-mono font-bold text-xs rounded-md shadow transition cursor-pointer disabled:opacity-50"
            >
              {isDebating ? "DEBATE CONFLICT RECONCILATION..." : "LAUNCH CORE AGENTS CONFLUENCE"}
            </button>
          </div>
        </div>

        {debateLogs.length === 0 ? (
          <div className="text-center py-8 text-slate-600 border border-dashed border-slate-850 rounded-xl bg-slate-900/10 font-mono text-xs">
            Director chamber idled. Click the button to witness live negotiations between corporate agents.
          </div>
        ) : (
          <div className="space-y-3.5 max-h-96 overflow-y-auto pr-1">
            {classNameTransitionElements(debateLogs)}
          </div>
        )}
      </div>

      {/* TWO PANEL SECTION: HIERARCHICAL STRATEGIC GOAL TREE & ROOT CAUSE WHY-TREE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* PANEL D1: HIERARCHICAL STRATEGIC GOAL TREE */}
        <div className="bg-slate-950 border border-slate-850 rounded-xl p-5 flex flex-col gap-4">
          <div>
            <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2 uppercase">
              <Network className="w-5 h-5 text-indigo-400" /> HIERARCHICAL GOAL-CONFLICT TREE
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Corporate objectives autonomously structured. Goals can conflict; AI continuous seeks Pareto improvements.</p>
          </div>

          <div className="font-mono text-xs select-none space-y-3 p-3 bg-slate-900/30 rounded-xl border border-slate-850">
            {/* Seed Node */}
            <div>
              <div
                onClick={() => toggleGoal("root")}
                className="flex items-center gap-2 p-2 bg-slate-905 hover:bg-slate-900 border border-slate-800 rounded-md cursor-pointer text-white font-bold transition"
              >
                {expandedGoals.root ? <ChevronDown className="w-4 h-4 text-emerald-400" /> : <ChevronRight className="w-4 h-4 text-emerald-400" />}
                <span className="text-[10px] px-1 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-900 rounded font-bold text-[9px]">ROOT</span>
                <span>Insulate Annual Enterprise Net Profit (Target: €120k)</span>
              </div>

              {expandedGoals.root && (
                <div className="pl-6 pt-2 space-y-2 border-l border-slate-800 mt-1 ml-4">
                  
                  {/* Goal A: Expand Margin */}
                  <div>
                    <div
                      onClick={() => toggleGoal("margin")}
                      className="flex items-center gap-2 p-2 bg-slate-950/60 hover:bg-slate-900/60 border border-slate-800/80 rounded cursor-pointer leading-snug transition"
                    >
                      {expandedGoals.margin ? <ChevronDown className="w-3.5 h-3.5 text-cyan-400" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      <span className="text-[10px] px-1 py-0.5 bg-cyan-950 text-cyan-300 border border-cyan-800/40 rounded font-bold text-[8px]">BRANCH</span>
                      <span className="text-slate-200">Accelerate Unit Profit Margins (Limit &gt; 35%)</span>
                    </div>

                    {expandedGoals.margin && (
                      <div className="pl-6 pt-2 space-y-1.5 border-l border-slate-800 mt-1 ml-3.5 text-[11px] text-slate-400">
                        <div className="p-2.5 bg-slate-950 rounded border border-slate-900 flex justify-between">
                          <span>• Dynamic localized MSRP multipliers with French Index</span>
                          <span className="text-emerald-400 font-bold font-mono">38.2% (OK)</span>
                        </div>
                        <div className="p-2.5 bg-slate-950 rounded border border-slate-900 flex justify-between">
                          <span>• Bundle Optimization with non-seasonal dead assets (Earbuds)</span>
                          <span className="text-indigo-400 font-bold font-mono">Active</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Goal B: Reduce Holding Cost */}
                  <div>
                    <div
                      onClick={() => toggleGoal("holding")}
                      className="flex items-center gap-2 p-2 bg-slate-950/60 hover:bg-slate-900/60 border border-slate-800/80 rounded cursor-pointer leading-snug transition"
                    >
                      {expandedGoals.holding ? <ChevronDown className="w-3.5 h-3.5 text-rose-450 text-rose-400" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      <span className="text-[10px] px-1 py-0.5 bg-rose-950 text-rose-300 border border-rose-800/40 rounded font-bold text-[8px]">BRANCH</span>
                      <span className="text-slate-200 font-medium">Decongest Warehouse Holdings Capital</span>
                    </div>

                    {expandedGoals.holding && (
                      <div className="pl-6 pt-2 space-y-1.5 border-l border-slate-800 mt-1 ml-3.5 text-[11px] text-slate-400">
                        <div className="p-2.5 bg-slate-950 rounded border border-slate-900">
                          <div>• Relocate Le Havre excess stock via multi-bundle promos</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">Target SKU: Wireless Earbuds. Hold state: high warning.</div>
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              )}
            </div>
          </div>
        </div>

        {/* PANEL D2: ROOT CAUSE WHY-TREE EXPLORER */}
        <div className="bg-slate-950 border border-slate-850 rounded-xl p-5 flex flex-col gap-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-slate-900 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2 uppercase">
                <Sliders className="w-5 h-5 text-rose-400" /> DYNAMIC WHY-TREE DIAGNOSTICS
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Trace underlying core factors triggers for retail performance drift</p>
            </div>
            <div>
              <select
                value={selectedProblem}
                onChange={(e) => setSelectedProblem(e.target.value)}
                className="bg-slate-900 font-mono text-xs border border-slate-800 rounded px-2.5 py-1 text-slate-200 outline-none focus:border-rose-500"
              >
                <option value="french_ctr_drop">French Paid Ads ROAS Drop</option>
                <option value="overstock_holding_earbuds">Earbuds Capital Congestion</option>
                <option value="cashflow_strain_restock">Operating Cashflow Tension</option>
              </select>
            </div>
          </div>

          {/* Why-Tree Node Map */}
          {selectedProblem && (
            <div className="flex flex-col gap-3 font-mono">
              <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                <div className="text-xs font-bold text-white uppercase">{getTreeData(selectedProblem).title}</div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{getTreeData(selectedProblem).description}</p>
                <div className="flex justify-between items-center text-[10px] text-slate-500 mt-2 border-t border-slate-900/40 pt-2">
                  <span>Algorithmic Diagnosis Confidence:</span>
                  <span className="text-emerald-400 font-bold">{getTreeData(selectedProblem).confidence}% Confirmed</span>
                </div>
              </div>

              {/* Collapsible nodes directory */}
              <div className="space-y-3.5 pl-2 border-l-2 border-dashed border-slate-850 ml-1 py-1.5">
                {getTreeData(selectedProblem).nodes.map((node, index) => (
                  <div key={index} className="pl-4 relative">
                    {/* Visual Connector Dot */}
                    <div className="absolute top-2 -left-[14px] w-2.5 h-2.5 rounded-full bg-slate-950 border-2 border-slate-700 font-mono flex items-center justify-center font-bold text-[8px] z-10" />
                    
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-900 hover:border-slate-800 transition">
                      <div className="text-[10px] font-bold text-rose-400 uppercase tracking-widest leading-none flex items-center gap-1.5">
                        <Info className="w-3 h-3 text-slate-500" /> {node.level}
                      </div>
                      <div className="text-white font-medium text-xs mt-1 leading-snug">{node.label}</div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-900 text-[10px]">
                        <div>
                          <span className="text-slate-500 uppercase text-[8px] block">Hypothesis Cause</span>
                          <span className="text-slate-400 mt-0.5 block">{node.cause}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 uppercase text-[8px] block">Extracted Evidence</span>
                          <span className="text-slate-350 font-bold block mt-0.5 text-cyan-400">{node.evidence}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3.5 bg-rose-950/10 border border-rose-900/30 text-rose-200 text-xs rounded-lg font-sans flex gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <strong>Recommended Remedy Action:</strong> {getTreeData(selectedProblem).remedy}
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* FOOTER COGNITIVE AUDIT COMPLIANCE REPORT (Explainable AI) */}
      <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="font-mono text-xs text-slate-500 flex items-center gap-2">
          <ShieldCheck className="w-4.5 h-4.5 text-emerald-400" />
          <span>OPERATIONAL EXPLAINABLE COMPLIANCE AUDITED: YES</span>
          <span className="text-slate-700">|</span>
          <span>SYSTEM TRUST FACTOR: <strong className="text-emerald-400 font-bold">98.4%</strong></span>
        </div>
        <div className="text-[10px] font-mono text-slate-500">
          Governance DSL Standard v2.10. Permanent immutable audit trails.
        </div>
      </div>

    </div>
  );

  function getTreeData(key: string) {
    if (key === "french_ctr_drop") return whyTrees.french_ctr_drop;
    if (key === "overstock_holding_earbuds") return whyTrees.overstock_holding_earbuds;
    return whyTrees.cashflow_strain_restock;
  }

  function classNameTransitionElements(logs: any[]) {
    return logs.map((log, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`p-3.5 rounded-xl border ${log.color}`}
      >
        <div className="flex justify-between items-center text-[10px] font-mono border-b border-slate-900 pb-2 mb-2.5">
          <div>
            <span className="font-bold text-slate-200 uppercase tracking-wide">{log.agent}</span>
            <span className="text-slate-400 text-[9px] font-medium ml-2">({log.role})</span>
          </div>

          <div className="text-slate-500 font-bold flex items-center gap-1.5 scale-95 uppercase">
            <span>STANCE: {log.stance}</span>
            <span className="text-slate-705 text-slate-700">|</span>
            <span>CONF: {Math.round(log.confidence * 100)}%</span>
          </div>
        </div>
        <p className="font-sans text-xs text-slate-200 leading-relaxed italic">"{log.argument}"</p>
      </motion.div>
    ));
  }
}
