// app/admin-ingestion/components/PipelineMetricsCard.tsx

"use client";

import { PipelineMetrics } from '@/types/admin-ingestion';

interface PipelineMetricsCardProps {
  metrics: PipelineMetrics;
}

export default function PipelineMetricsCard({ metrics }: PipelineMetricsCardProps) {
  const successRate = ((metrics.successfulRuns / metrics.totalRuns) * 100).toFixed(1);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Total Documents</span>
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="4" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <path d="M7 8h8M7 12h8M7 16h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <p className="text-2xl font-bold text-white">
          {(metrics.totalDocumentsProcessed / 1000000).toFixed(1)}M
        </p>
        <p className="text-xs text-green-400 mt-2">
          +{metrics.processingRate.toLocaleString()}/hour
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Success Rate</span>
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
            <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="text-2xl font-bold text-white">{successRate}%</p>
        <p className="text-xs text-muted-foreground mt-2">
          {metrics.successfulRuns}/{metrics.totalRuns} runs
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Queue Depth</span>
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
            <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>
        <p className="text-2xl font-bold text-white">
          {metrics.queueDepth.toLocaleString()}
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          {metrics.activeJobs} active jobs
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Error Rate</span>
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h17.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 9v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className={`text-2xl font-bold ${metrics.errorRate > 5 ? 'text-red-400' : 'text-white'}`}>
          {metrics.errorRate.toFixed(1)}%
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          {metrics.failedRuns} failed runs
        </p>
      </div>
    </div>
  );
}