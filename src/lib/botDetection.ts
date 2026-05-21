export const BOT_SIGNATURES: { pattern: RegExp; name: string }[] = [
  { pattern: /meta-externalagent/i, name: 'Meta External Agent' },
  { pattern: /PetalBot/i, name: 'PetalBot' },
  { pattern: /Googlebot/i, name: 'Googlebot' },
  { pattern: /Google-Extended/i, name: 'Google-Extended' },
  { pattern: /GoogleOther/i, name: 'GoogleOther' },
  { pattern: /Gemini-Deep-Research/i, name: 'Gemini Deep Research' },
  { pattern: /Gemini/i, name: 'Gemini' },
  { pattern: /GPTBot/i, name: 'GPTBot' },
  { pattern: /ChatGPT-User/i, name: 'ChatGPT-User' },
  { pattern: /OAI-SearchBot/i, name: 'OAI-SearchBot' },
  { pattern: /Claude-SearchBot/i, name: 'Claude SearchBot' },
  { pattern: /Claude-User/i, name: 'Claude User' },
  { pattern: /ClaudeBot/i, name: 'ClaudeBot' },
  { pattern: /anthropic-ai/i, name: 'anthropic-ai' },
  { pattern: /Claude-Web/i, name: 'Claude-Web' },
  { pattern: /PerplexityBot/i, name: 'PerplexityBot' },
  { pattern: /Applebot/i, name: 'Applebot' },
  { pattern: /DuckDuckBot/i, name: 'DuckDuckBot' },
  { pattern: /Twitterbot/i, name: 'Twitterbot' },
  { pattern: /facebookexternalhit/i, name: 'facebookexternalhit' },
  { pattern: /LinkedInBot/i, name: 'LinkedInBot' },
  { pattern: /Slurp/i, name: 'Yahoo Slurp' },
  { pattern: /YandexBot/i, name: 'YandexBot' },
  { pattern: /ia_archiver/i, name: 'Internet Archive' },
  { pattern: /AhrefsBot/i, name: 'AhrefsBot' },
  { pattern: /SemrushBot/i, name: 'SemrushBot' },
  { pattern: /MJ12bot/i, name: 'MJ12bot' },
  { pattern: /dotbot/i, name: 'dotbot' },
]

export function detectBot(ua: string): string | null {
  const normalizedUserAgent = ua.trim()
  if (!normalizedUserAgent) return 'Empty User-Agent'

  for (const { pattern, name } of BOT_SIGNATURES) {
    if (pattern.test(normalizedUserAgent)) return name
  }

  return null
}

export function isBotUserAgent(ua: string): boolean {
  return detectBot(ua) !== null
}
