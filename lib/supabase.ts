// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Type definitions for database tables
export type Database = {
  public: {
    Tables: {
      kpis: {
        Row: {
          id: string
          label: string
          value: string
          change: number
          change_label: string
          icon: string
          trend: 'up' | 'down' | 'neutral'
          created_at: string
        }
      }
      signals: {
        Row: {
          id: string
          type: 'patent' | 'funding' | 'publication' | 'breakthrough'
          title: string
          tech: string
          importance: 'high' | 'medium' | 'low'
          date: string
          value: string | null
          created_at: string
        }
      }
      activities: {
        Row: {
          id: string
          type: string
          description: string
          timestamp: string
          tech: string
          link: string | null
          created_at: string
        }
      }
      patent_data: {
        Row: {
          id: string
          date: string
          filings: number
          citations: number
          created_at: string
        }
      }
      funding_data: {
        Row: {
          id: string
          month: string
          amount: number
          created_at: string
        }
      }
      trl_distribution: {
        Row: {
          id: string
          name: string
          value: number
          color: string
          created_at: string
        }
      }
    }
  }
}