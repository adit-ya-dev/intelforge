// hooks/useAdminIngestionData.tsx

import { useState, useEffect, useCallback } from 'react'
import {
  DataConnector,
  PipelineRun,
  PipelineMetrics,
  IngestionLog,
  DocumentUpload,
  IndexOperation,
  ApiSecret,
  ThroughputData,
  ConnectorTemplate,
} from '@/types/admin-ingestion' // <-- FIX: Removed ComponentType import

// -----------------------------
// MAIN DATA INTERFACE (matches API response shape)
// -----------------------------
interface AdminIngestionData {
  connectors: DataConnector[]
  pipelineRuns: PipelineRun[]
  pipelineMetrics: PipelineMetrics | null
  ingestionLogs: IngestionLog[]
  documentUploads: DocumentUpload[]
  indexOperations: IndexOperation[]
  apiSecrets: ApiSecret[]
  throughputData: ThroughputData[]
  connectorTemplates: ConnectorTemplate[]
}

// -----------------------------
// HOOK RETURN INTERFACE (matches page.tsx destructuring)
// -----------------------------
export interface UseAdminIngestionDataReturn {
  // Renamed properties to match page.tsx destructuring
  connectors: DataConnector[]
  runs: PipelineRun[] // pipelineRuns -> runs
  logs: IngestionLog[] // ingestionLogs -> logs
  uploads: DocumentUpload[] // documentUploads -> uploads
  indexOps: IndexOperation[] // indexOperations -> indexOps
  secrets: ApiSecret[] // apiSecrets -> secrets
  throughput: ThroughputData[] // throughputData -> throughput
  templates: ConnectorTemplate[] // connectorTemplates -> templates

  // Other return values
  pipelineMetrics: PipelineMetrics | null // Kept this in case it's used elsewhere
  isLoading: boolean
  error: string | null
  refreshAll: () => Promise<void> // refetch -> refreshAll
}

// Placeholder for missing/unknown icon (must match ComponentType<{ className?: string }>)
const NullIcon = () => null; // Use a simple arrow function for a null component

// -----------------------------
// HOOK
// -----------------------------
export function useAdminIngestionData(): UseAdminIngestionDataReturn {
  const [data, setData] = useState<AdminIngestionData>({
    connectors: [],
    pipelineRuns: [],
    pipelineMetrics: null,
    ingestionLogs: [],
    documentUploads: [],
    indexOperations: [],
    apiSecrets: [],
    throughputData: [],
    connectorTemplates: []
  })

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Use useCallback for fetchData for stability and to be used as refreshAll
  const fetchData = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/admin-ingestion')

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`)
      }

      const result = await response.json()

      if (result.error) throw new Error(result.error)

      // -----------------------------
      // TRANSFORM DATA SAFELY
      // -----------------------------
      const transformedData: AdminIngestionData = {
        connectors: (result.connectors || []).map((c: any): DataConnector => ({
          id: c.id,
          name: c.name,
          source: c.source ?? c.provider ?? c.type ?? "unknown",
          lastRun: c.last_run ? new Date(c.last_run) : null, // Added lastRun mapping
          type: c.type,
          provider: c.provider,
          status: c.status,
          lastSync: c.last_sync ? new Date(c.last_sync) : null,
          nextSync: c.next_sync ? new Date(c.next_sync) : null,
          apiEndpoint: c.api_endpoint || "",
          description: c.description || "",
          requiresAuth: !!c.requires_auth,
          authType: c.auth_type || undefined,
          pollingInterval: c.polling_interval || 0,
          icon: c.icon && typeof c.icon === 'function' ? c.icon : NullIcon, 
          totalDocuments: c.total_documents ?? 0,
          documentsToday: c.documents_today ?? 0,
          errorCount: c.error_count ?? 0,
          config: c.config || {},
          capabilities: c.capabilities || [],
          healthScore: c.health_score ?? 0,
          created_at: c.created_at || undefined,
          updated_at: c.updated_at || undefined
        })),

        pipelineRuns: (result.pipelineRuns || []).map((r: any): PipelineRun => ({
          id: r.id,
          connectorId: r.connector_id,
          connectorName: r.connector_name,
          status: r.status,
          startTime: new Date(r.start_time),
          endTime: r.end_time ? new Date(r.end_time) : null,
          duration: r.duration ?? undefined,
          documentsProcessed: r.documents_processed ?? 0,
          documentsQueued: r.documents_queued ?? 0,
          documentsFailed: r.documents_failed ?? 0,
          errorMessages: r.error_messages || [],
          throughput: parseFloat(r.throughput) || undefined,
          memoryUsage: r.memory_usage ?? undefined,
          cpuUsage: r.cpu_usage ?? undefined,
          created_at: r.created_at || undefined
        })),

        pipelineMetrics: result.pipelineMetrics
          ? {
              totalRuns: result.pipelineMetrics.total_runs ?? 0,
              successfulRuns: result.pipelineMetrics.successful_runs ?? 0,
              failedRuns: result.pipelineMetrics.failed_runs ?? 0,
              averageDuration: result.pipelineMetrics.average_duration ?? 0,
              totalDocumentsProcessed: parseInt(result.pipelineMetrics.total_documents_processed ?? "0"),
              processingRate: result.pipelineMetrics.processing_rate ?? 0,
              queueDepth: result.pipelineMetrics.queue_depth ?? 0,
              activeJobs: result.pipelineMetrics.active_jobs ?? 0,
              errorRate: parseFloat(result.pipelineMetrics.error_rate ?? "0")
            }
          : null,

        ingestionLogs: (result.ingestionLogs || []).map((l: any): IngestionLog => ({
          id: l.id,
          timestamp: new Date(l.timestamp),
          level: l.level,
          connectorId: l.connector_id,
          message: l.message,
          details: l.details || undefined,
          documentId: l.document_id || null,
          retryable: l.retryable ?? false,
          retryCount: l.retry_count ?? 0,
          maxRetries: l.max_retries ?? 0,
          created_at: l.created_at || undefined
        })),

        documentUploads: (result.documentUploads || []).map((u: any): DocumentUpload => ({
          id: u.id,
          fileName: u.file_name,
          fileType: u.file_type || "pdf",
          fileSize: parseInt(u.file_size ?? 0),
          uploadDate: new Date(u.upload_date),
          status: u.status,
          progress: u.progress ?? 0,
          documentsExtracted: u.documents_extracted ?? 0,
          mappingTemplate: u.mapping_template || undefined,
          errors: u.errors || undefined,
          created_at: u.created_at || undefined
        })),

        indexOperations: (result.indexOperations || []).map((o: any): IndexOperation => ({
          id: o.id,
          type: o.type,
          status: o.status,
          startTime: new Date(o.start_time),
          endTime: o.end_time ? new Date(o.end_time) : null,
          affectedDocuments: o.affected_documents ?? 0,
          progress: o.progress ?? 0,
          estimatedTimeRemaining: o.estimated_time_remaining ?? null,
          created_at: o.created_at || undefined
        })),

        apiSecrets: (result.apiSecrets || []).map((s: any): ApiSecret => ({
          id: s.id,
          name: s.name,
          service: s.service,
          createdAt: new Date(s.created_at),
          lastUsed: s.last_used ? new Date(s.last_used) : null,
          expiresAt: s.expires_at ? new Date(s.expires_at) : null,
          status: s.status,
          permissions: s.permissions || [],
          masked: s.masked ?? 'sk-...',
          key_encrypted: s.key_encrypted || undefined
        })),

        throughputData: (result.throughputData || []).map((t: any): ThroughputData => ({
          timestamp: new Date(t.timestamp),
          documentsPerSecond: parseFloat(t.documents_per_second ?? "0"),
          bytesPerSecond: parseInt(t.bytes_per_second ?? "0"),
          activeConnectors: t.active_connectors ?? 0
        })),

        connectorTemplates: (result.connectorTemplates || []).map((t: any): ConnectorTemplate => ({
          id: t.id,
          name: t.name,
          type: t.type,
          provider: t.provider,
          description: t.description,
          requiredFields: t.required_fields || [],
          optionalFields: t.optional_fields || undefined,
          defaultConfig: t.default_config || undefined,
          documentationUrl: t.documentation_url || undefined,
          popular: t.popular ?? false,
          icon: t.icon && typeof t.icon === 'function' ? t.icon : NullIcon,
        }))
      }

      setData(transformedData)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to fetch admin ingestion data'

      setError(message)
      console.error('Error fetching admin ingestion data:', err)
    } finally {
      setIsLoading(false)
    }
  }, []) 

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    isLoading,
    error,
    // Map the state variables to the names expected by page.tsx
    connectors: data.connectors,
    runs: data.pipelineRuns,
    logs: data.ingestionLogs,
    uploads: data.documentUploads,
    indexOps: data.indexOperations,
    secrets: data.apiSecrets,
    throughput: data.throughputData,
    templates: data.connectorTemplates,
    
    // Include this metric in case it's used elsewhere, even if not destructured in page.tsx
    pipelineMetrics: data.pipelineMetrics, 

    // Rename refetch to refreshAll
    refreshAll: fetchData
  }
}




