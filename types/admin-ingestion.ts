// types/admin-ingestion.ts
// Full TypeScript types for IntelForge Admin Ingestion Panel
import { ComponentType } from "react"; // <--- FIX: Must import ComponentType from 'react'

export type ConnectorType =
  | "patent"
  | "research"
  | "funding"
  | "news"
  | "custom";

export type ConnectorStatus = "active" | "paused" | "error" | "configuring";
export type RunStatus = "running" | "completed" | "failed" | "cancelled";
export type LogLevel = "info" | "warning" | "error";
export type UploadStatus = "uploading" | "processing" | "completed" | "failed";
export type IndexOpType = "reindex" | "rebuild_embeddings" | "purge" | "optimize";
export type IndexOpStatus = "pending" | "running" | "completed" | "failed";
export type SecretStatus = "active" | "expired" | "revoked";

export interface DataConnector {
  id: string;
  name: string;

  // REQUIRED for your hook — previously missing
  source?: string;
  lastRun?: Date | null;

  type: ConnectorType;
  provider: string;
  status: ConnectorStatus;

  apiEndpoint: string;
  description: string;

  // icon must be a ComponentType, NOT string
  icon: ComponentType<{ className?: string }>;

  requiresAuth: boolean;
  authType?: "api_key" | "oauth" | "basic";
  pollingInterval: number;

  lastSync: Date | null;
  nextSync: Date | null;

  totalDocuments: number;
  documentsToday: number;
  errorCount: number;

  config: ConnectorConfig;
  capabilities: string[];
  healthScore: number;

  created_at?: string;
  updated_at?: string;
}

export interface ConnectorConfig {
  apiKey?: string;
  clientId?: string;
  clientSecret?: string;
  username?: string;
  password?: string;
  baseUrl?: string;
  rateLimit?: number;
  batchSize?: number;
  backfillEnabled?: boolean;
  backfillStartDate?: string | null;
  customHeaders?: Record<string, string>;
  fieldMappings?: FieldMapping[];
}

export interface FieldMapping {
  sourceField: string;
  targetField: string;
  transformation?:
    | "none"
    | "date"
    | "lowercase"
    | "uppercase"
    | "number"
    | "json";
  required: boolean;
}

export interface PipelineRun {
  id: string;
  connectorId: string;
  connectorName: string;
  status: RunStatus;
  startTime: Date;
  endTime?: Date | null;
  duration?: number | null;
  documentsProcessed: number;
  documentsQueued: number;
  documentsFailed: number;
  errorMessages: string[];
  throughput?: number;
  memoryUsage?: number;
  cpuUsage?: number;
  created_at?: string;
}

export interface PipelineMetrics {
  totalRuns: number;
  successfulRuns: number;
  failedRuns: number;
  averageDuration: number;
  totalDocumentsProcessed: number;
  processingRate: number;
  queueDepth: number;
  activeJobs: number;
  errorRate: number;
}

export interface IngestionLog {
  id: string;
  timestamp: Date;
  level: LogLevel;
  connectorId: string;
  message: string;
  details?: any;
  documentId?: string | null;
  retryable: boolean;
  retryCount: number;
  maxRetries: number;
  created_at?: string;
}

export interface DocumentUpload {
  id: string;
  fileName: string;
  fileType: "pdf" | "csv" | "json" | "xml" | "zip" | "txt";
  fileSize: number;
  uploadDate: Date;
  status: UploadStatus;
  progress: number;
  documentsExtracted: number;
  mappingTemplate?: string;
  errors?: string[];
  created_at?: string;
}

export interface IndexOperation {
  id: string;
  type: IndexOpType;
  status: IndexOpStatus;
  startTime: Date;
  endTime?: Date | null;
  affectedDocuments: number;
  progress: number;
  estimatedTimeRemaining?: number | null;
  created_at?: string;
}

export interface ApiSecret {
  id: string;
  name: string;
  service: string;
  createdAt: Date;
  lastUsed?: Date | null;
  expiresAt?: Date | null;
  status: SecretStatus;
  permissions: string[];
  masked: string;
  key_encrypted?: string;
}

export interface ThroughputData {
  id?: number;
  timestamp: Date;
  documentsPerSecond: number;
  bytesPerSecond: number;
  activeConnectors: number;
}

export interface ConnectorTemplate {
  id: string;
  name: string;
  type: ConnectorType;
  provider: string;
  description: string;
  requiredFields: string[];
  optionalFields?: string[];
  defaultConfig?: Partial<ConnectorConfig>;
  documentationUrl?: string;
  popular?: boolean;

  // must be ComponentType (error from before)
  icon: ComponentType<{ className?: string }>;
}

/**
 * Interface for the return type of the useAdminIngestionData hook.
 * Added for full compatibility with page.tsx usage.
 */
export interface AdminIngestionData {
    connectors: DataConnector[];
    pipelineRuns: PipelineRun[];
    pipelineMetrics: PipelineMetrics | null;
    ingestionLogs: IngestionLog[];
    documentUploads: DocumentUpload[];
    indexOperations: IndexOperation[];
    apiSecrets: ApiSecret[];
    throughputData: ThroughputData[];
    connectorTemplates: ConnectorTemplate[];
    isLoading: boolean;
    error: string | null;
    refetch: () => void;
}