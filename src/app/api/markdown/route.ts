import { NextRequest, NextResponse } from 'next/server'
import TurndownService from 'turndown'

const turndown = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
})

export async function GET(request: NextRequest): Promise<NextResponse> {
  const path = request.nextUrl.searchParams.get('_path') ?? '/'
  const host = request.headers.get('host') ?? 'localhost:3000'
  const protocol = request.headers.get('x-forwarded-proto') ?? 'https'

  try {
    const htmlUrl = `${protocol}://${host}${path}`
    const response = await fetch(htmlUrl, {
      headers: {
        accept: 'text/html',
        'x-markdown-internal': 'true',
      },
    })

    if (!response.ok) {
      return new NextResponse('Failed to fetch page', { status: response.status })
    }

    const html = await response.text()
    const markdown = turndown.turndown(html)
    const tokenEstimate = Math.ceil(markdown.length / 4)

    return new NextResponse(markdown, {
      status: 200,
      headers: {
        'content-type': 'text/markdown; charset=utf-8',
        'x-markdown-tokens': String(tokenEstimate),
        vary: 'accept',
      },
    })
  } catch {
    return new NextResponse('Error generating markdown', { status: 500 })
  }
}
