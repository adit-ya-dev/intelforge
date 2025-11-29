import React from 'react';
import { Plug, GitBranch, ArrowRight, Server, Zap, Globe } from "lucide-react";

// --- PLACEHOLDER TYPES (You should replace these with your actual types) ---
// These are defined to satisfy the type-checking in page.tsx
interface DataConnector {
  id: string;
  name: string;
  source: string;
  status: 'active' | 'paused' | 'error';
  lastRun: string;
}

interface ConnectorTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}
// --------------------------------------------------------------------------

// 1. Define the component's props interface (ConnectorsCatalogProps)
export interface ConnectorsCatalogProps {
  connectors: DataConnector[];
  templates: ConnectorTemplate[];
  onAddConnector: (templateId: string) => void;
}

// 2. Mock Data for the Catalog view (replace with your data if needed)
const defaultTemplates: ConnectorTemplate[] = [
  { id: 'web', name: 'Web Crawler', description: 'Crawl and index public website content.', icon: Globe },
  { id: 'git', name: 'Git Repository', description: 'Sync content from Git, like documentation.', icon: GitBranch },
  { id: 'db', name: 'SQL Database', description: 'Connect to an internal relational database.', icon: Server },
  { id: 'api', name: 'Custom API', description: 'Create a custom source via a defined API endpoint.', icon: Zap },
];


// 3. The ConnectorsCatalog Functional Component
export default function ConnectorsCatalog({ 
  connectors, 
  templates = defaultTemplates, // Use mock templates if none are provided
  onAddConnector 
}: ConnectorsCatalogProps) {

  const templateList = templates.length > 0 ? templates : defaultTemplates;

  return (
    <div className="space-y-8 p-4 bg-white shadow-lg rounded-xl">
      {/* ----------------- Active Connectors Section ----------------- */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Plug className="w-5 h-5 text-blue-500" />
          Active Connectors ({connectors.length})
        </h2>
        
        {connectors.length === 0 ? (
          <div className="text-center p-12 border-2 border-dashed border-gray-200 rounded-lg text-gray-500">
            <Plug className="w-8 h-8 mx-auto mb-2" />
            <p className="font-medium">No active connectors found.</p>
            <p className="text-sm">Use the catalog below to add your first data source.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {connectors.map(connector => (
              <div 
                key={connector.id} 
                className="bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm transition duration-150 hover:shadow-md"
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-gray-900">{connector.name}</h3>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    connector.status === 'active' ? 'bg-green-100 text-green-700' :
                    connector.status === 'paused' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {connector.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">Source: {connector.source}</p>
                <p className="text-xs text-gray-400 mt-3">Last Run: {connector.lastRun}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ----------------- Connector Catalog Section ----------------- */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Connector Catalog
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {templateList.map(template => {
            const Icon = template.icon;
            return (
              <div 
                key={template.id} 
                className="group p-6 border-2 border-gray-100 rounded-xl bg-white transition-all duration-300 hover:border-blue-500 hover:shadow-lg"
              >
                <Icon className="w-8 h-8 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{template.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                <button
                  onClick={() => onAddConnector(template.id)}
                  className="flex items-center gap-1 text-blue-600 font-medium text-sm group-hover:text-blue-700 transition-colors"
                >
                  Configure
                  <ArrowRight className="w-4 h-4 mt-0.5 transform translate-x-0 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}