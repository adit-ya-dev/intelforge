// types/search.ts
export interface SearchResult {
  id: string
  type: "Patent" | "Paper" | "Company" | "Report" | "News"
  title: string
  snippet: string
  abstract?: string
  date?: string
  country?: string
  organization?: string
  trl?: number
  citations?: number
  fundingAmount?: number
  relevanceScore: number
  tags?: string[]
  entities?: string[]
  sourceUrl?: string
  matchedChunks?: string[]
}

export interface SearchFilters {
  domain: string[]
  trl: string[]
  dateRange: {
    from: Date | null
    to: Date | null
  }
  country: string[]
  sourceType: string[]
  organization: string[]
  fundingRange: {
    min: number | null
    max: number | null
  }
  confidence: [number, number]
}

export interface SearchParams {
  query: string
  semantic: boolean
  filters: SearchFilters
  page: number
  size: number
  sortBy: string
}
