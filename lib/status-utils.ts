// src/lib/status-utils.ts   ← YA PHIR   lib/status-utils.ts
// YE FILE PURI REPLACE KAR DO!

export const getStatusColor = (status: string): string => {
  switch (status?.toLowerCase()) {
    case 'active':
    case 'completed':
    case 'running':
    case 'connected':
      return 'bg-green-500/20 text-green-400 border-green-500/50';
    
    case 'error':
    case 'failed':
    case 'revoked':
    case 'disconnected':
      return 'bg-red-500/20 text-red-400 border-red-500/50';
    
    case 'paused':
    case 'pending':
    case 'uploading':
    case 'processing':
    case 'warning':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
    
    case 'cancelled':
    case 'expired':
      return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    
    default:
      return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
  }
};

// YE FUNCTION ADD KIYA — JO MISSING THA!
export const getLevelColor = (level: string): string => {
  switch (level?.toLowerCase()) {
    case 'info':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
    case 'warning':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
    case 'error':
      return 'bg-red-500/20 text-red-400 border-red-500/50';
    case 'success':
      return 'bg-green-500/20 text-green-400 border-green-500/50';
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
  }
};