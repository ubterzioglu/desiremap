const siteUrl = 'https://desiremap.de'

export async function GET() {
  const body = [
    'User-Agent: *',
    'Allow: /',
    'Disallow: /admin/',
    'Disallow: /_next/',
    'Content-Signal: ai-train=no, search=yes, ai-input=no',
    '',
    'User-Agent: Googlebot',
    'Allow: /',
    '',
    'User-Agent: Bingbot',
    'Allow: /',
    '',
    `Host: ${siteUrl}`,
    `Sitemap: ${siteUrl}/sitemap.xml`,
  ].join('\n')

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain' },
  })
}
