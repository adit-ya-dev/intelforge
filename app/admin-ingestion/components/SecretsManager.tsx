// app/admin-ingestion/components/SecretsManager.tsx

"use client";

import { useState, useEffect } from "react";
import { ApiSecret } from "@/types/admin-ingestion";

interface SecretsManagerProps {
  secrets: ApiSecret[];
}

export default function SecretsManager({ secrets: initialSecrets }: SecretsManagerProps) {
  const [secrets, setSecrets] = useState<ApiSecret[]>(initialSecrets);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSecret, setShowSecret] = useState<string | null>(null);

  const [newSecret, setNewSecret] = useState({
    name: "",
    service: "",
    key: "",
    permissions: [] as string[],
  });

  useEffect(() => {
    setSecrets(initialSecrets || []);
  }, [initialSecrets]);

  const handleAddSecret = () => {
    if (!newSecret.name || !newSecret.key) return;

    const secret: ApiSecret = {
      id: `secret-${Date.now()}`,
      name: newSecret.name,
      service: newSecret.service,
      createdAt: new Date(),
      lastUsed: null,
      status: "active",
      permissions: newSecret.permissions,
      masked: `${newSecret.key.slice(0, 3)}...${newSecret.key.slice(-4)}`,
    };

    setSecrets([secret, ...secrets]);
    setShowAddModal(false);
    setNewSecret({ name: "", service: "", key: "", permissions: [] });
  };

  const handleRevoke = (id: string) => {
    setSecrets((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "revoked" } : s))
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400 border-green-500/50";
      case "revoked":
        return "bg-red-500/20 text-red-400 border-red-500/50";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/50";
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl border border-border p-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-white">API Keys & Secrets</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Manage API keys securely
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            aria-label="Add API Key"
          >
            +
            Add API Key
          </button>
        </div>

        {/* Secret List */}
        <div className="space-y-3">
          {secrets.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No API keys configured
            </div>
          ) : (
            secrets.map((secret) => (
              <div
                key={secret.id}
                className="bg-background border border-border rounded-lg p-4"
              >
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-white font-medium">{secret.name}</h3>

                    <div className="text-xs text-muted-foreground mt-1">
                      Service: {secret.service || "N/A"}
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-muted-foreground">Key:</span>
                      <code className="px-2 py-1 bg-card rounded text-xs text-white">
                        {showSecret === secret.id ? secret.masked : secret.masked}
                      </code>

                      <button
                        aria-label="Show Key"
                        onClick={() =>
                          setShowSecret(showSecret === secret.id ? null : secret.id)
                        }
                        className="text-muted-foreground hover:text-white transition"
                      >
                        👁
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`px-2 py-1 rounded-full border text-xs ${getStatusColor(
                        secret.status
                      )}`}
                    >
                      {secret.status}
                    </span>

                    {secret.status === "active" && (
                      <button
                        aria-label="Revoke Key"
                        onClick={() => handleRevoke(secret.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        ✖
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
