// app/admin-ingestion/components/ConnectorSetupWizard.tsx
"use client";

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useAdminIngestionData } from '@/hooks/useAdminIngestionData';
import { ConnectorTemplate } from '@/types/admin-ingestion';
import { Check, Loader2, AlertCircle, X, Plug } from 'lucide-react';


  onClose,
  onSuccess
}: ConnectorSetupWizardProps) {
  const { connectorTemplates, refetch } = useAdminIngestionData();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const template =
    connectorTemplates.find(t => t.id === templateId) ||
    templates.find(t => t.id === templateId);

  const [formData, setFormData] = useState({
    name: template?.name || '',
    apiKey: '',
    clientId: '',
    clientSecret: '',
    rateLimit: template?.defaultConfig?.rateLimit || 100,
    batchSize: template?.defaultConfig?.batchSize || 50,
    backfillEnabled: true,
    backfillStartDate: '2020-01-01'
  });

  const handleSubmit = async () => {
    if (!template) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const newConnector = {
        id: `conn-${Date.now()}`,
        name: formData.name || `${template.name} Connector`,
        type: template.type,
        provider: template.provider,
        status: 'active' as const,
        api_endpoint: template.documentationUrl?.includes('uspto')
          ? 'https://api.uspto.gov/patents/v2'
          : 'https://api.example.com',
        description: template.description,
        icon: template.icon || Plug, // ✅ use React component
        requires_auth: true,
        auth_type: template.requiredFields.includes('clientId') ? 'oauth' : 'api_key',
        polling_interval: 60,
        last_sync: null,
        next_sync: new Date(Date.now() + 3600000),
        total_documents: 0,
        documents_today: 0,
        error_count: 0,
        config: {
          apiKey: formData.apiKey || undefined,
          clientId: formData.clientId || undefined,
          clientSecret: formData.clientSecret || undefined,
          rateLimit: formData.rateLimit,
          batchSize: formData.batchSize,
          backfillEnabled: formData.backfillEnabled,
          backfillStartDate: formData.backfillEnabled ? formData.backfillStartDate : null
        },
        capabilities: ['full_text', 'citations'],
        health_score: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error: supabaseError } = await supabase
        .from('data_connectors')
        .insert([newConnector]);

      if (supabaseError) throw supabaseError;

      setSuccess(true);
      await refetch();
      await onSuccess();
      setTimeout(() => onClose(), 2000);

    } catch (err: any) {
      console.error("Failed to create connector:", err);
      setError(err.message || "Failed to create connector. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!template) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-card border border-border rounded-xl p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-white text-lg font-medium">Template not found!</p>
          <button
            onClick={onClose}
            aria-label="Close error dialog"
            className="mt-6 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ...your unchanged JSX goes here */}
    </>
  );
}

