export type RiskLevel = 'low' | 'medium' | 'high' | 'critical'
export type SeverityLevel = 'critical' | 'warning' | 'info'
export type SubscriptionStatus = 'free' | 'active' | 'canceled' | 'past_due'
export type DocumentType = 'lease' | 'rental' | 'gym' | 'car' | 'employment' | 'insurance' | 'other'
export type AnalysisStatus = 'processing' | 'complete' | 'failed'

export interface FlaggedClause {
  id: string
  severity: SeverityLevel
  title: string
  original_text: string
  explanation: string
  recommendation: string
  potentially_illegal: boolean
}

export interface NegotiationPoint {
  title: string
  current_term: string
  ask_for: string
}

export interface Analysis {
  id: string
  user_id: string
  file_name: string
  file_url: string
  document_type: DocumentType
  status: AnalysisStatus
  risk_score: number
  risk_level: RiskLevel
  summary: string
  total_cost_estimate: string
  flagged_clauses: FlaggedClause[]
  negotiation_points: NegotiationPoint[]
  market_comparison: string
  payment_type: string
  created_at: string
  completed_at: string | null
}

export interface Profile {
  id: string
  email: string
  full_name: string | null
  stripe_customer_id: string | null
  subscription_status: SubscriptionStatus
  subscription_id: string | null
  free_analyses_used: number
  created_at: string
}

export interface ClaudeAnalysisResult {
  document_type: DocumentType
  risk_score: number
  risk_level: RiskLevel
  summary: string
  total_cost_estimate: string
  flagged_clauses: FlaggedClause[]
  negotiation_points: NegotiationPoint[]
  market_comparison: string
}
