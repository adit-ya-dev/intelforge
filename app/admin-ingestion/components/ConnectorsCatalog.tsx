// app/admin-ingestion/components/ConnectorsCatalog.tsx

"use client";

import { useState } from 'react';
import { mockConnectors, mockConnectorTemplates } from '@/lib/admin-ingestion-mock-data';
import { DataConnector, ConnectorTemplate } from '@/types/admin-ingestion';

interface ConnectorsCatalogProps {
  onAddConnector: (templateId: string) => void;
}

export default function ConnectorsCatalog({ onAddConnector }: ConnectorsCatalogProps) {
  const [connectors] = useState<DataConnector[]>(mockConnectors);
  const [templates] = useState<ConnectorTemplate[]>(mockConnectorTemplates);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const filteredConnectors = connectors.filter(connector => {
    const matchesSearch = connector.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         connector.provider.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || connector.type === filterType;
    return matchesSearch && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'paused': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'error': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getHealthColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6">
      {/* Active Connectors */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Active Connectors</h2>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search connectors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 bg-background border border-border rounded-lg text-white placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 bg-background border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="patent">Patents</option>
              <option value="research">Research</option>
              <option value="funding">Funding</option>
              <option value="news">News</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4">
          {filteredConnectors.map((connector) => (
            <div
              key={connector.id}
              className="bg-background border border-border rounded-lg p-4 hover:border-blue-500/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{connector.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-white">{connector.name}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(connector.status)}`}>
                        {connector.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{connector.description}</p>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Total Documents</p>
                        <p className="text-sm font-medium text-white">
                          {connector.totalDocuments.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Today</p>
                        <p className="text-sm font-medium text-white">
                          +{connector.documentsToday.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Last Sync</p>
                        <p className="text-sm font-medium text-white">
                          {connector.lastSync ? connector.lastSync.toLocaleTimeString() : 'Never'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Health Score</p>
                        <p className={`text-sm font-medium ${getHealthColor(connector.healthScore)}`}>
                          {connector.healthScore}%
                        </p>
                      </div>
                    </div>

                    {connector.errorCount > 0 && (
                      <div className="mt-3 p-2 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <p className="text-xs text-red-400">
                          ⚠️ {connector.errorCount} errors in last run
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-2 text-muted-foreground hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                  <button className={`p-2 ${connector.status === 'active' ? 'text-yellow-400' : 'text-green-400'} hover:opacity-80 transition-opacity`}>
                    {connector.status === 'active' ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <rect x="7" y="7" width="10" height="10" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </button>
                  <button className="p-2 text-red-400 hover:text-red-300 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Available Templates */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Available Connector Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className="bg-background border border-border rounded-lg p-4 hover:border-blue-500/50 transition-colors cursor-pointer"
              onClick={() => onAddConnector(template.id)}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-white">{template.name}</h3>
                {template.popular && (
                  <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded-full">
                    Popular
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{template.type}</span>
                <button className="text-blue-400 hover:text-blue-300 text-sm">
                  Add →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}