// Technology Detail View Type Definitions

export type TRLLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type DomainTag = 
  | "AI/ML" 
  | "Quantum Computing" 
  | "Biotechnology" 
  | "Robotics" 
  | "Clean Energy"
  | "Advanced Materials"
  | "Space Technology"
  | "Cybersecurity"
  | "5G/6G"
  | "Blockchain";

export type SourceType = 
  | "patent" 
  | "paper" 
  | "demo" 
  | "startup" 
  | "funding" 
  | "news"
  | "regulation"
  | "standard";

export type ConfidenceLevel = "high" | "medium" | "low";

export interface TechnologyMetadata {
  id: string;
  name: string;
  canonicalSummary: string;
  domains: DomainTag[];
  currentTRL: TRLLevel;
  confidence: ConfidenceLevel;
  lastUpdated: string;
  isWatched: boolean;
  relatedTechCount: number;
  sourceCount: number;
}

export interface TRLHistoryEntry {
  trl: TRLLevel;
  date: string;
  confidence: ConfidenceLevel;
  evidenceIds: string[]; // Links to sources that support this TRL level
  reasoning: string;
  keyMilestones: string[];
}

export interface TimelineEvent {
  id: string;
  type: SourceType;
  title: string;
  date: string;
  description: string;
  sourceUrl?: string;
  confidence: ConfidenceLevel;
  impactScore: number; // 0-100, influences TRL or forecast
  organization?: string;
  country?: string;
  tags: string[];
}

export interface SignalDataPoint {
  date: string;
  value: number;
  confidence?: ConfidenceLevel;
}

export interface TechSignals {
  patents: {
    timeseries: SignalDataPoint[];
    total: number;
    growth: number; // percentage
  };
  papers: {
    timeseries: SignalDataPoint[];
    total: number;
    citations: number;
  };
  funding: {
    timeseries: SignalDataPoint[];
    totalAmount: number; // in millions
    rounds: number;
  };
  googleTrends: {
    timeseries: SignalDataPoint[];
    currentInterest: number; // 0-100
  };
  startups: {
    timeseries: SignalDataPoint[];
    total: number;
    activeCount: number;
  };
}

export interface Source {
  id: string;
  type: SourceType;
  title: string;
  date: string;
  authors?: string[];
  organization?: string;
  url?: string;
  abstract?: string;
  confidence: ConfidenceLevel;
  citationCount?: number;
  impactScore: number;
  tags: string[];
  rawDocumentUrl?: string;
  usedInForecast: boolean;
  forecastWeight?: number; // 0-1, contribution to forecast
}

export interface KnowledgeGraphNode {
  id: string;
  type: "technology" | "company" | "author" | "funder" | "institution";
  label: string;
  description?: string;
  size: number; // Visual size based on importance
  color: string;
  metadata?: Record<string, any>;
}

export interface KnowledgeGraphEdge {
  source: string; // node id
  target: string; // node id
  type: "cites" | "funds" | "collaborates" | "develops" | "related";
  weight: number; // 0-1, strength of connection
  label?: string;
}

export interface KnowledgeGraph {
  nodes: KnowledgeGraphNode[];
  edges: KnowledgeGraphEdge[];
  centerNodeId: string; // The current technology
}

export interface SCurveData {
  observed: Array<{
    date: string;
    adoption: number; // 0-100 percentage
    confidence: ConfidenceLevel;
  }>;
  fitted: Array<{
    date: string;
    adoption: number;
    upperBound?: number;
    lowerBound?: number;
  }>;
  inflectionPoint?: {
    date: string;
    adoption: number;
  };
  maturityPhase: "emergence" | "growth" | "maturity" | "decline";
}

export interface HypeCurveData {
  phases: Array<{
    phase: "trigger" | "peak" | "trough" | "slope" | "plateau";
    date: string;
    intensity: number; // 0-100
    confidence: ConfidenceLevel;
  }>;
  currentPhase: string;
  peakDate?: string;
  plateauEstimate?: string;
}

export interface ForecastScenario {
  scenario: "optimistic" | "baseline" | "pessimistic";
  predictions: Array<{
    date: string;
    trl: TRLLevel;
    marketSize?: number; // in billions
    adoptionRate?: number; // percentage
    confidence: ConfidenceLevel;
  }>;
  keyAssumptions: string[];
  uncertaintyBands: {
    upper: number[];
    lower: number[];
  };
}

export interface ForecastModel {
  id: string;
  name: string;
  version: string;
  lastRun: string;
  scenarios: ForecastScenario[];
  inputSources: {
    sourceId: string;
    weight: number; // 0-1
    contribution: string;
  }[];
  accuracy: {
    score: number; // 0-100
    historicalError: number; // percentage
    confidenceInterval: [number, number];
  };
  explanation: {
    topDrivers: Array<{
      factor: string;
      impact: number; // -100 to 100
      reasoning: string;
    }>;
    methodology: string;
    limitations: string[];
  };
}

export interface ForecastRequest {
  techId: string;
  model: "s-curve" | "ml-ensemble" | "expert-hybrid";
  scenario: "optimistic" | "baseline" | "pessimistic";
  timeHorizon: number; // years
  parameters?: Record<string, any>;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  isPinned: boolean;
  attachedSourceIds?: string[];
  replies?: Comment[];
}

export interface Annotation {
  id: string;
  userId: string;
  sourceId?: string;
  chartType?: string;
  content: string;
  highlightedText?: string;
  position?: { x: number; y: number };
  createdAt: string;
  tags: string[];
}

// API Response Types
export interface TechDetailResponse {
  metadata: TechnologyMetadata;
  trlHistory: TRLHistoryEntry[];
}

export interface TechSignalsResponse {
  techId: string;
  signals: TechSignals;
  lastUpdated: string;
}

export interface TechSourcesResponse {
  techId: string;
  sources: Source[];
  total: number;
  page: number;
  pageSize: number;
}

export interface KnowledgeGraphResponse {
  techId: string;
  graph: KnowledgeGraph;
  generatedAt: string;
}

export interface ForecastResponse {
  techId: string;
  model: ForecastModel;
  sCurve: SCurveData;
  hypeCurve: HypeCurveData;
  generatedAt: string;
}

// UI State Types
export interface TimelineFilter {
  types: SourceType[];
  dateRange: {
    start: string;
    end: string;
  };
  minImpactScore: number;
}

export interface ChartViewState {
  selectedChart: "s-curve" | "hype-cycle" | "citations" | "funding";
  timeRange: string; // "1y", "3y", "5y", "all"
  showUncertainty: boolean;
  compareScenarios: boolean;
}

export interface ExportOptions {
  format: "pdf" | "pptx" | "docx" | "json";
  includeCharts: boolean;
  includeSources: boolean;
  includeTimeline: boolean;
  includeForecast: boolean;
  maxSources: number;
}
