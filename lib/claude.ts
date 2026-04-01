import Anthropic from '@anthropic-ai/sdk'
import type { ClaudeAnalysisResult } from '@/types'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const SYSTEM_PROMPT = `You are LeaseGuard, an expert contract and lease analyzer. Your job is to protect consumers from unfair, illegal, or financially harmful contract terms. You analyze documents with the precision of a real estate attorney combined with the clarity of a consumer advocate.

Always respond with valid JSON only. No markdown, no preamble.`

function buildUserMessage(extractedText: string): string {
  return `Analyze this contract document. Return a JSON object with exactly this structure:

{
  "document_type": "lease|gym|car|employment|insurance|other",
  "risk_score": <integer 0-100, where 0=completely safe, 100=extremely dangerous>,
  "risk_level": "low|medium|high|critical",
  "summary": "<2-3 sentence plain-English summary of what this contract is and the overall risk>",
  "total_cost_estimate": "<plain-English estimate of total financial obligation, e.g. '$18,000 over 12 months + potential $2,400 in fees'>",
  "flagged_clauses": [
    {
      "id": "<unique string>",
      "severity": "critical|warning|info",
      "title": "<short title of the clause issue>",
      "original_text": "<exact quote from the document, max 200 chars>",
      "explanation": "<plain-English explanation of why this is a problem>",
      "recommendation": "<specific action the user should take or ask for>",
      "potentially_illegal": <boolean>
    }
  ],
  "negotiation_points": [
    {
      "title": "<what to negotiate>",
      "current_term": "<what the contract says>",
      "ask_for": "<specific language to request instead>"
    }
  ],
  "market_comparison": "<2-3 sentences comparing these terms to typical market standards>"
}

Document to analyze:
${extractedText}`
}

export async function analyzeContract(
  extractedText: string,
  _documentType: string,
  _fileName: string
): Promise<ClaudeAnalysisResult> {
  const timeoutMs = 30_000

  async function callClaude(strict = false): Promise<ClaudeAnalysisResult> {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)

    try {
      const message = await client.messages.create(
        {
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4096,
          system: strict
            ? SYSTEM_PROMPT + '\n\nCRITICAL: Return ONLY raw JSON. No text before or after. No code fences.'
            : SYSTEM_PROMPT,
          messages: [
            {
              role: 'user',
              content: buildUserMessage(extractedText),
            },
          ],
        },
        { signal: controller.signal }
      )

      const content = message.content[0]
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from Claude')
      }

      const raw = content.text.trim()
      // Strip markdown code fences if present
      const jsonText = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()

      return JSON.parse(jsonText) as ClaudeAnalysisResult
    } finally {
      clearTimeout(timer)
    }
  }

  try {
    return await callClaude(false)
  } catch (firstError) {
    if ((firstError as Error).name === 'AbortError') {
      throw new Error('Analysis timed out after 30 seconds. Please try again.')
    }
    // Retry once with stricter prompt
    try {
      return await callClaude(true)
    } catch (secondError) {
      if ((secondError as Error).name === 'AbortError') {
        throw new Error('Analysis timed out after 30 seconds. Please try again.')
      }
      throw new Error('Failed to parse AI analysis. Please try again.')
    }
  }
}
