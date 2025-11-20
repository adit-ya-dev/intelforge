// app/admin-ingestion/page.tsx

"use client";

import { useState } from 'react';
import ConnectorsCatalog from './components/ConnectorsCatalog';
import PipelineDashboard from './components/PipelineDashboard';
import ManualIngest from './components/ManualIngest';
import IndexControls from './components/IndexControls';
import SecretsManager from './components/SecretsManager';
import IngestionLogs from './components/IngestionLogs';
import ConnectorSetupWizard from './components/ConnectorSetupWizard';
import PipelineMetricsCard from './components/PipelineMetricsCard';

export default function AdminIngestionPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'connectors' | 'pipeline' | 'manual' | 'index' | 'secrets' | 'logs'>('overview');
  const [showSetupWizard, setShowSetupWizard] = useState(false);
  const [selectedConnectorTemplate, setSelectedConnectorTemplate] = useState<string | null>(null);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'connectors', label: 'Connectors', icon: '🔌' },
    { id: 'pipeline', label: 'Pipeline', icon: '⚙️' },
    { id: 'manual', label: 'Manual Upload', icon: '📤' },
    { id: 'index', label: 'Index Control', icon: '🗄️' },
    { id: 'secrets', label: 'API Keys', icon: '🔐' },
    { id: 'logs', label: 'Logs', icon: '📝' }
  ];

  const handleAddConnector = (templateId: string) => {
    setSelectedConnectorTemplate(templateId);
    setShowSetupWizard(true);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Data Ingestion & Pipeline</h1>
            <p className="text-muted-foreground mt-2">
              Manage data sources, monitor pipeline health, and control ingestion processes
            </p>
          </div>
          <button
            onClick={() => setShowSetupWizard(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <span className="text-lg">➕</span>
            Add Connector
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 flex items-center gap-2 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-500'
                  : 'border-transparent text-muted-foreground hover:text-white'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <div className="grid gap-6">
              <PipelineMetricsCard />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PipelineDashboard />
                <IngestionLogs limit={5} />
              </div>
            </div>
          )}

          {activeTab === 'connectors' && (
            <ConnectorsCatalog onAddConnector={handleAddConnector} />
          )}

          {activeTab === 'pipeline' && <PipelineDashboard />}

          {activeTab === 'manual' && <ManualIngest />}

          {activeTab === 'index' && <IndexControls />}

          {activeTab === 'secrets' && <SecretsManager />}

          {activeTab === 'logs' && <IngestionLogs />}
        </div>
      </div>

      {/* Setup Wizard Modal */}
      {showSetupWizard && (
        <ConnectorSetupWizard
          templateId={selectedConnectorTemplate}
          onClose={() => {
            setShowSetupWizard(false);
            setSelectedConnectorTemplate(null);
          }}
        />
      )}
    </div>
  );
}