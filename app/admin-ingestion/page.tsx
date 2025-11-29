"use client";

import { useState, useCallback, useMemo } from "react";
import {
  Home,
  Plug,
  Settings,
  Upload,
  Database,
  Key,
  ScrollText,
  Plus,
  AlertCircle,
  Loader2,
  RefreshCw,
  Zap,
  Clock,
  CheckCircle,
  XCircle,
  FileText
} from "lucide-react";

// ===============================================
// INLINE TYPES (To replace types/admin-ingestion.ts)
// ===============================================

type PipelineMetrics = {
    totalRuns: number;
    successfulRuns: number;
    failedRuns: number;
    averageDuration: number; // in seconds
    totalDocumentsProcessed: number;
    processingRate: number; // docs/sec
    queueDepth: number;
    activeJobs: number;
    errorRate: number; // percentage
};

type DataConnector = {
    id: string;
    name: string;
    source: string;
    lastRun: Date | null;
    type: string;
    provider: string;
    status: 'active' | 'error' | 'paused';
    apiEndpoint: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    requiresAuth: boolean;
    authType?: string;
    pollingInterval?: number; // minutes
    lastSync: Date | null;
    nextSync: Date | null;
    totalDocuments: number;
    documentsToday: number;
    errorCount: number;
    config: Record<string, any>;
    capabilities: string[];
    healthScore: number;
};

type PipelineRun = {
    id: string;
    connectorId: string;
    connectorName: string;
    status: 'running' | 'completed' | 'failed';
    startTime: Date;
    endTime?: Date;
    duration?: number; // seconds
    documentsProcessed: number;
    documentsQueued: number;
    documentsFailed: number;
    errorMessages: string[];
    throughput: number; // docs/sec
    memoryUsage: number; // MB
    cpuUsage: number; // percent
};

type IngestionLog = {
    id: string;
    timestamp: Date;
    level: 'info' | 'warning' | 'error';
    connectorId: string;
    message: string;
    documentId?: string;
    details?: Record<string, any>;
    retryable: boolean;
    retryCount: number;
    maxRetries: number;
};

type DocumentUpload = {
    id: string;
    fileName: string;
    fileType: string;
    fileSize: number; // bytes
    uploadDate: Date;
    status: 'completed' | 'processing' | 'failed';
    progress: number; // percentage
    documentsExtracted: number;
    mappingTemplate?: string;
    errors?: string[];
};

type IndexOperation = {
    id: string;
    type: 'reindex' | 'rebuild_embeddings' | 'optimize_storage';
    status: 'running' | 'completed' | 'failed';
    startTime: Date;
    endTime?: Date;
    affectedDocuments: number;
    progress: number;
    estimatedTimeRemaining?: number; // seconds
};

type ApiSecret = {
    id: string;
    name: string;
    service: string;
    createdAt: Date;
    lastUsed: Date;
    expiresAt?: Date;
    status: 'active' | 'expired' | 'revoked';
    permissions: string[];
    masked: string;
};

type ThroughputData = {
    timestamp: Date;
    documentsPerSecond: number;
    bytesPerSecond: number;
    activeConnectors: number;
};

type ConnectorTemplate = {
    id: string;
    name: string;
    type: string;
    provider: string;
    description: string;
    requiredFields: string[];
    optionalFields: string[];
    defaultConfig: Record<string, any>;
    documentationUrl: string;
    popular: boolean;
    icon: React.ComponentType<{ className?: string }>;
};

type UseAdminIngestionDataReturn = {
    connectors: DataConnector[];
    runs: PipelineRun[]; 
    pipelineMetrics: PipelineMetrics | null;
    logs: IngestionLog[]; 
    uploads: DocumentUpload[]; 
    indexOps: IndexOperation[]; 
    secrets: ApiSecret[]; 
    throughput: ThroughputData[]; 
    templates: ConnectorTemplate[]; 
    isLoading: boolean;
    error: string | null;
    refreshAll: () => void; 
};


// ===============================================
// INLINE MOCK DATA 
// ===============================================

// A placeholder component that returns null to avoid JSX errors in a pure TS environment
const IconPlaceholder: React.ComponentType<{ className?: string }> = () => null;

const now = new Date();
const oneHourAgo = new Date(now.getTime() - 3600000);
const twoHoursAgo = new Date(now.getTime() - 2 * 3600000);
const sixHoursAgo = new Date(now.getTime() - 6 * 3600000);
const yesterday = new Date(now.getTime() - 24 * 3600000);
const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 3600000);

const mockPipelineMetrics: PipelineMetrics = {
  totalRuns: 1247,
  successfulRuns: 1198,
  failedRuns: 49,
  averageDuration: 2400,
  totalDocumentsProcessed: 3568926,
  processingRate: 8500,
  queueDepth: 2450,
  activeJobs: 3,
  errorRate: 3.9
};

const mockConnectors: DataConnector[] = [
  {
    id: 'conn-001',
    name: 'USPTO Patents',
    source: 'API Polling',
    lastRun: oneHourAgo,
    type: 'patent',
    provider: 'USPTO',
    status: 'active',
    apiEndpoint: 'https://api.uspto.gov/patents/v2',
    description: 'United States Patent and Trademark Office patent database',
    icon: Zap, // Using Lucide icon for better visualization
    requiresAuth: true,
    authType: 'api_key',
    pollingInterval: 60,
    lastSync: oneHourAgo,
    nextSync: new Date(now.getTime() + 1800000),
    totalDocuments: 1250000,
    documentsToday: 3420,
    errorCount: 2,
    config: {
      apiKey: 'masked_key_123',
      rateLimit: 100,
      batchSize: 50,
      backfillEnabled: true
    },
    capabilities: ['full_text', 'citations'],
    healthScore: 98
  },
  {
    id: 'conn-004',
    name: 'Crunchbase Funding',
    source: 'API Polling',
    lastRun: twoDaysAgo,
    type: 'funding',
    provider: 'Crunchbase',
    status: 'error',
    apiEndpoint: 'https://api.crunchbase.com/v4',
    description: 'Startup funding rounds and investor data',
    icon: XCircle, // Using Lucide icon for better visualization
    requiresAuth: true,
    authType: 'api_key',
    pollingInterval: 360,
    lastSync: twoDaysAgo,
    nextSync: null,
    totalDocuments: 125000,
    documentsToday: 0,
    errorCount: 15,
    config: {
      apiKey: 'masked_key_456',
      rateLimit: 20,
      batchSize: 25
    },
    capabilities: ['funding_rounds'],
    healthScore: 45
  },
];

const mockPipelineRuns: PipelineRun[] = [
  {
    id: 'run-001',
    connectorId: 'conn-001',
    connectorName: 'USPTO Patents',
    status: 'running',
    startTime: oneHourAgo,
    documentsProcessed: 1250,
    documentsQueued: 750,
    documentsFailed: 2,
    errorMessages: [],
    throughput: 12.5,
    memoryUsage: 256,
    cpuUsage: 45
  },
  {
    id: 'run-003',
    connectorId: 'conn-004',
    connectorName: 'Crunchbase Funding',
    status: 'failed',
    startTime: twoDaysAgo,
    endTime: new Date(twoDaysAgo.getTime() + 300000),
    duration: 300,
    documentsProcessed: 0,
    documentsQueued: 450,
    documentsFailed: 15,
    errorMessages: [
      'API rate limit exceeded',
      'Authentication failed: Invalid API key'
    ],
    throughput: 0,
    memoryUsage: 64,
    cpuUsage: 10
  }
];

const mockIngestionLogs: IngestionLog[] = [
  {
    id: 'log-003',
    timestamp: new Date(now.getTime() - 420000),
    level: 'error',
    connectorId: 'conn-004',
    message: 'Failed to parse funding round data',
    details: { error: 'Invalid JSON response', statusCode: 500 },
    documentId: 'funding-round-xyz',
    retryable: true,
    retryCount: 2,
    maxRetries: 3
  },
  {
    id: 'log-001',
    timestamp: new Date(now.getTime() - 300000),
    level: 'info',
    connectorId: 'conn-001',
    message: 'Successfully processed batch of 50 patents',
    documentId: 'US11234567B2',
    retryable: false,
    retryCount: 0,
    maxRetries: 3
  },
];

const mockDocumentUploads: DocumentUpload[] = [
  {
    id: 'upload-001',
    fileName: 'research_papers_2024.csv',
    fileType: 'csv',
    fileSize: 15728640,
    uploadDate: sixHoursAgo,
    status: 'completed',
    progress: 100,
    documentsExtracted: 1250,
    mappingTemplate: 'research_paper_template'
  },
];

const mockIndexOperations: IndexOperation[] = [
  {
    id: 'idx-001',
    type: 'rebuild_embeddings',
    status: 'running',
    startTime: oneHourAgo,
    affectedDocuments: 50000,
    progress: 35,
    estimatedTimeRemaining: 1800
  },
];

const mockApiSecrets: ApiSecret[] = [
  {
    id: 'secret-001',
    name: 'USPTO API Key',
    service: 'USPTO',
    createdAt: new Date(now.getTime() - 7 * 30 * 24 * 3600000),
    lastUsed: oneHourAgo,
    expiresAt: new Date(now.getTime() + 5 * 30 * 24 * 3600000),
    status: 'active',
    permissions: ['read', 'search'],
    masked: 'sk-...abc123'
  },
];

const mockThroughputData: ThroughputData[] = Array.from({ length: 24 }, (_, i) => ({
  timestamp: new Date(now.getTime() - (23 - i) * 3600000),
  documentsPerSecond: Math.random() * 20 + 5,
  bytesPerSecond: Math.random() * 1000000 + 500000,
  activeConnectors: Math.floor(Math.random() * 3) + 2
}));

const mockConnectorTemplates: ConnectorTemplate[] = [
  {
    id: 'template-001',
    name: 'USPTO Patents',
    type: 'patent',
    provider: 'USPTO',
    description: 'Connect to US Patent and Trademark Office database',
    requiredFields: ['apiKey'],
    optionalFields: ['rateLimit'],
    defaultConfig: { rateLimit: 100 },
    documentationUrl: 'https://developer.uspto.gov',
    popular: true,
    icon: Plug 
  },
];

// ===============================================
// INLINE HOOK 
// ===============================================

const useAdminIngestionData = (): UseAdminIngestionDataReturn => {
    const [data, setData] = useState<Omit<UseAdminIngestionDataReturn, 'isLoading' | 'error' | 'refreshAll'>>({
        connectors: mockConnectors,
        runs: mockPipelineRuns,
        pipelineMetrics: mockPipelineMetrics,
        logs: mockIngestionLogs,
        uploads: mockDocumentUploads,
        indexOps: mockIndexOperations,
        secrets: mockApiSecrets,
        throughput: mockThroughputData,
        templates: mockConnectorTemplates,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refreshAll = useCallback(() => {
        setIsLoading(true);
        setError(null);
        // Simulate API call delay and success
        setTimeout(() => {
            // In a real app, you would fetch new data here
            setData({
                connectors: mockConnectors,
                runs: mockPipelineRuns,
                pipelineMetrics: mockPipelineMetrics,
                logs: mockIngestionLogs,
                uploads: mockDocumentUploads,
                indexOps: mockIndexOperations,
                secrets: mockApiSecrets,
                throughput: mockThroughputData,
                templates: mockConnectorTemplates,
            });
            setIsLoading(false);
        }, 1000);
    }, []);

    const result = useMemo(() => ({
        ...data,
        isLoading,
        error,
        refreshAll,
    }), [data, isLoading, error, refreshAll]);

    // Alias the short names to the long names expected by the Page component
    return {
        connectors: result.connectors,
        runs: result.runs,
        pipelineMetrics: result.pipelineMetrics,
        logs: result.logs,
        uploads: result.uploads,
        indexOps: result.indexOps,
        secrets: result.secrets,
        throughput: result.throughput,
        templates: result.templates,
        isLoading: result.isLoading,
        error: result.error,
        refreshAll: result.refreshAll,
    };
};

// ===============================================
// INLINE PLACEHOLDER COMPONENTS 
// ===============================================

const SectionCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
        {children}
    </div>
);

const PipelineMetricsCard: React.FC<{ metrics: PipelineMetrics }> = ({ metrics }) => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg shadow-sm flex items-center gap-3">
            <Zap className="h-6 w-6 text-blue-600" />
            <div>
                <p className="text-sm text-gray-500">Total Runs</p>
                <p className="text-xl font-bold text-blue-700">{metrics.totalRuns.toLocaleString()}</p>
            </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg shadow-sm flex items-center gap-3">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <div>
                <p className="text-sm text-gray-500">Success Rate</p>
                <p className="text-xl font-bold text-green-700">{((metrics.successfulRuns / metrics.totalRuns) * 100).toFixed(1)}%</p>
            </div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg shadow-sm flex items-center gap-3">
            <Clock className="h-6 w-6 text-yellow-600" />
            <div>
                <p className="text-sm text-gray-500">Rate (Docs/s)</p>
                <p className="text-xl font-bold text-yellow-700">{metrics.processingRate}</p>
            </div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg shadow-sm flex items-center gap-3">
            <XCircle className="h-6 w-6 text-red-600" />
            <div>
                <p className="text-sm text-gray-500">Active Errors</p>
                <p className="text-xl font-bold text-red-700">{metrics.errorRate}%</p>
            </div>
        </div>
    </div>
);

const ConnectorsCatalog: React.FC<{ 
    connectors: DataConnector[]; 
    templates: ConnectorTemplate[]; 
    onAddConnector: (templateId: string) => void;
}> = ({ connectors, templates, onAddConnector }) => (
    <SectionCard title="Data Connectors Catalog">
        <p className="text-gray-600 mb-4">You have {connectors.length} active connectors.</p>
        <div className="space-y-4">
            {connectors.map(c => (
                <div key={c.id} className="p-3 border rounded-lg flex justify-between items-center bg-gray-50">
                    <div className="flex items-center gap-3">
                        <c.icon className="h-5 w-5 text-gray-600" />
                        <span className="font-medium">{c.name}</span>
                        <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${c.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {c.status}
                        </span>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => onAddConnector(c.id)} 
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                        View Details
                    </button>
                </div>
            ))}
        </div>
        <h3 className="mt-6 text-lg font-medium">Available Templates ({templates.length})</h3>
        <div className="flex gap-4 overflow-x-auto mt-2 pb-2">
            {templates.map(t => (
                <div key={t.id} className="min-w-[150px] p-4 border rounded-xl shadow-md flex flex-col items-center text-center bg-white">
                    <t.icon className="h-6 w-6 text-purple-600 mb-2" />
                    <p className="text-sm font-medium">{t.name}</p>
                    <button 
                        type="button" 
                        onClick={() => onAddConnector(t.id)}
                        className="mt-3 text-xs px-3 py-1 bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200"
                    >
                        Setup
                    </button>
                </div>
            ))}
        </div>
    </SectionCard>
);

const PipelineDashboard: React.FC<{ runs: PipelineRun[]; throughputData: ThroughputData[] }> = ({ runs, throughputData }) => (
    <SectionCard title="Recent Pipeline Activity">
        <p className="text-gray-600 mb-4">Last 3 pipeline runs:</p>
        <div className="space-y-3">
            {runs.slice(0, 3).map(r => (
                <div key={r.id} className="p-3 border rounded-lg flex justify-between items-center bg-white shadow-sm">
                    <div className="flex flex-col">
                        <span className="font-medium">{r.connectorName}</span>
                        <span className="text-xs text-gray-500">Processed: {r.documentsProcessed} docs</span>
                    </div>
                    <span className={`text-sm font-semibold ${r.status === 'completed' ? 'text-green-500' : r.status === 'running' ? 'text-blue-500' : 'text-red-500'}`}>
                        {r.status.toUpperCase()}
                    </span
>
                </div>
            ))}
        </div>
        <p className="mt-4 text-sm text-gray-500">Throughput data for the last 24 hours is available for visualization (Chart Placeholder).</p>
    </SectionCard>
);

const ManualIngest: React.FC<{ uploads: DocumentUpload[] }> = ({ uploads }) => (
    <SectionCard title="Manual Document Ingestion">
        <p className="mb-4 text-gray-600">Drag and drop files here to begin manual upload.</p>
        <div className="border-2 border-dashed border-gray-300 p-8 rounded-lg text-center text-gray-500">
            <Upload className="h-8 w-8 mx-auto mb-2" />
            <p>PDF, DOCX, CSV files supported. (Max 50MB)</p>
        </div>
        <h3 className="mt-6 text-lg font-medium">Recent Uploads</h3>
        <div className="space-y-3 mt-2">
            {uploads.map(u => (
                <div key={u.id} className="p-3 border rounded-lg flex justify-between items-center bg-white shadow-sm">
                    <div className="flex flex-col">
                        <span className="font-medium">{u.fileName}</span>
                        <span className="text-xs text-gray-500">Size: {(u.fileSize / 1048576).toFixed(2)} MB</span>
                    </div>
                    <span className={`text-sm font-semibold ${u.status === 'completed' ? 'text-green-500' : 'text-blue-500'}`}>
                        {u.status.toUpperCase()} ({u.progress}%)
                    </span>
                </div>
            ))}
        </div>
    </SectionCard>
);

const IndexControls: React.FC<{ operations: IndexOperation[] }> = ({ operations }) => (
    <SectionCard title="Index Management and Controls">
        <p className="mb-4 text-gray-600">Control index rebuilds and optimization tasks.</p>
        <button 
          type="button" 
          className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors mb-4"
        >
            Start Full Re-Index
        </button>
        <h3 className="mt-6 text-lg font-medium">Current Operations</h3>
        <div className="space-y-3 mt-2">
            {operations.map(o => (
                <div key={o.id} className="p-3 border rounded-lg bg-white shadow-sm">
                    <div className="flex justify-between items-center">
                        <span className="font-medium">{o.type.replace('_', ' ').toUpperCase()}</span>
                        <span className={`text-sm font-semibold ${o.status === 'running' ? 'text-blue-500' : 'text-green-500'}`}>
                            {o.status.toUpperCase()}
                        </span>
                    </div>
                    {/* PROGRESS BAR: Dynamic style is necessary here for variable width */}
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div 
                            className="bg-blue-600 h-2.5 rounded-full" 
                            style={{ width: `${o.progress}%` }} 
                        ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{o.progress}% complete</p>
                </div>
            ))}
        </div>
    </SectionCard>
);

const SecretsManager: React.FC<{ secrets: ApiSecret[] }> = ({ secrets }) => (
    <SectionCard title="API Key and Secrets Manager">
        <p className="mb-4 text-gray-600">Manage external service authentication tokens.</p>
        <button 
          type="button" 
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors mb-4"
        >
            Add New Secret
        </button>
        <h3 className="mt-6 text-lg font-medium">Stored Secrets</h3>
        <div className="space-y-3 mt-2">
            {secrets.map(s => (
                <div key={s.id} className="p-3 border rounded-lg flex justify-between items-center bg-white shadow-sm">
                    <div className="flex flex-col">
                        <span className="font-medium">{s.name} ({s.service})</span>
                        <span className="text-xs text-gray-500">Last Used: {s.lastUsed.toLocaleDateString()}</span>
                    </div>
                    <span className="text-sm font-mono text-gray-700">{s.masked}</span>
                </div>
            ))}
        </div>
    </SectionCard>
);

const IngestionLogs: React.FC<{ logs: IngestionLog[]; limit?: number }> = ({ logs, limit }) => {
    const displayLogs = limit ? logs.slice(0, limit) : logs;
    return (
        <SectionCard title={limit ? "Latest Ingestion Logs" : "Full Ingestion Logs"}>
            <p className="text-gray-600 mb-4">Displaying {displayLogs.length} logs.</p>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {displayLogs.map(l => (
                    <div key={l.id} className="p-3 border rounded-lg flex flex-col bg-white shadow-sm">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${l.level === 'error' ? 'bg-red-100 text-red-700' : l.level === 'warning' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {l.level.toUpperCase()}
                                </span>
                                <span className="text-sm font-medium text-gray-800">{l.message}</span>
                            </div>
                            <span className="text-xs text-gray-500">
                                {new Date(l.timestamp).toLocaleTimeString()}
                            </span>
                        </div>
                        {l.documentId && <p className="text-xs text-gray-500 mt-1 ml-1">Doc ID: {l.documentId}</p>}
                    </div>
                ))}
            </div>
        </SectionCard>
    );
};

const ConnectorSetupWizard: React.FC<{ 
    templateId: string | null; 
    templates: ConnectorTemplate[];
    onClose: () => void;
    onSuccess: () => void;
}> = ({ templateId, templates, onClose }) => {
    const template = templates.find(t => t.id === templateId) || templates[0];
    const [step, setStep] = useState(1);

    if (!template) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Setup {template.name} Connector</h2>
                    <button 
                      type="button" 
                      onClick={onClose} 
                      className="text-gray-400 hover:text-gray-600"
                      aria-label="Close Setup Wizard" 
                    >
                        <XCircle className="h-6 w-6" />
                    </button>
                </div>
                
                {step === 1 ? (
                    <div className="space-y-4">
                        <p className="text-gray-600">{template.description}</p>
                        <p className="font-semibold text-sm">Required Fields: {template.requiredFields.join(', ')}</p>
                        <div className="space-y-2">
                            {template.requiredFields.map(field => (
                                <input 
                                    key={field}
                                    type={field.toLowerCase().includes('key') ? 'password' : 'text'}
                                    placeholder={field}
                                    className="w-full p-2 border rounded-lg"
                                />
                            ))}
                        </div>
                        <button 
                            type="button" 
                            onClick={() => setStep(2)}
                            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Next: Configure Sync
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <h3 className="text-xl font-medium">Step 2: Sync Settings</h3>
                        <p className="text-gray-600">Define polling interval and backfill options.</p>
                        <button 
                            type="button" 
                            onClick={onClose} // Simplified: treats close as success for mock
                            className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                            Complete Setup (Mock Success)
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};


// ===============================================
// MAIN COMPONENT 
// ===============================================

export default function AdminIngestionPage() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "connectors" | "pipeline" | "manual" | "index" | "secrets" | "logs"
  >("overview");

  const [showSetupWizard, setShowSetupWizard] = useState(false);
  const [selectedConnectorTemplate, setSelectedConnectorTemplate] = useState<string | null>(null);

  // Get all data from the hook. 
  const {
    // Variables with the same name:
    connectors,
    pipelineMetrics,
    isLoading,
    error,
    
    // Aliased variables:
    runs: pipelineRuns,
    logs: ingestionLogs,
    uploads: documentUploads,
    indexOps: indexOperations,
    secrets: apiSecrets,
    throughput: throughputData,
    templates: connectorTemplates,
    refreshAll: refetch, 
  } = useAdminIngestionData();

  const tabs = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "connectors", label: "Connectors", icon: Plug },
    { id: "pipeline", label: "Pipeline", icon: Settings },
    { id: "manual", label: "Manual Upload", icon: Upload },
    { id: "index", label: "Index Control", icon: Database },
    { id: "secrets", label: "API Keys", icon: Key },
    { id: "logs", label: "Logs", icon: ScrollText },
  ];

  const handleAddConnector = (templateId: string) => {
    setSelectedConnectorTemplate(templateId);
    setShowSetupWizard(true);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
              <p className="text-gray-500">Loading admin ingestion data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 max-w-md">
              <div className="flex items-center gap-3 mb-3">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <h3 className="text-lg font-semibold text-red-500">Error Loading Data</h3>
              </div>
              <p className="text-red-700 mb-4">{error}</p>
              <button
                type="button" 
                onClick={refetch}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Data Ingestion & Pipeline
            </h1>
            <p className="text-gray-500 mt-2">
              Manage data sources, monitor pipeline health, and control ingestion processes
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button" 
              onClick={refetch}
              title="Refresh All Data" 
              className="inline-flex items-center gap-2 rounded-lg bg-gray-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-700 transition-colors shadow-md"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
            <button
              type="button" 
              onClick={() => setShowSetupWizard(true)}
              title="Add New Data Connector" 
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-md"
            >
              <Plus className="h-4 w-4" />
              Add Connector
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-white rounded-t-xl shadow-sm">
          <nav className="flex gap-8 px-6" aria-label="Ingestion tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  type="button" 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
                    isActive
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-800"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="bg-white p-6 rounded-b-xl shadow-lg">
          <div className="space-y-8">
            {activeTab === "overview" && (
              <div className="grid gap-8">
                {pipelineMetrics && <PipelineMetricsCard metrics={pipelineMetrics} />}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <PipelineDashboard 
                    runs={pipelineRuns} 
                    throughputData={throughputData}
                  />
                  <IngestionLogs logs={ingestionLogs} limit={5} />
                </div>
              </div>
            )}

            {activeTab === "connectors" && (
              <ConnectorsCatalog 
                connectors={connectors}
                templates={connectorTemplates}
                onAddConnector={handleAddConnector} 
              />
            )}
            
            {activeTab === "pipeline" && (
              <PipelineDashboard 
                runs={pipelineRuns}
                throughputData={throughputData}
              />
            )}
            
            {activeTab === "manual" && (
              <ManualIngest uploads={documentUploads} />
            )}
            
            {activeTab === "index" && (
              <IndexControls operations={indexOperations} />
            )}
            
            {activeTab === "secrets" && (
              <SecretsManager secrets={apiSecrets} />
            )}
            
            {activeTab === "logs" && (
              <IngestionLogs logs={ingestionLogs} />
            )}
          </div>
        </div>
      </div>

      {/* Setup Wizard Modal */}
      {showSetupWizard && (
        <ConnectorSetupWizard
          templateId={selectedConnectorTemplate}
          templates={connectorTemplates}
          onClose={() => {
            setShowSetupWizard(false);
            setSelectedConnectorTemplate(null);
          }}
          onSuccess={refetch}
        />
      )}
    </div>
  );
}