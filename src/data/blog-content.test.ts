import { describe, expect, test } from 'bun:test'

import { premiumErotikPlattformContent } from './blog-content'
import { blogPosts } from './blog-posts'

describe('blog content contracts', () => {
  test('premium article content avoids stale default-locale and dead venue links', () => {
    expect(premiumErotikPlattformContent).not.toContain('/de/')
    expect(premiumErotikPlattformContent).not.toContain('diamond-frankfurt')
    expect(premiumErotikPlattformContent).not.toContain('cafe-del-sol-hamburg')
    expect(premiumErotikPlattformContent).not.toContain('royal-munchen')
  })

  test('premium article author metadata uses the current DesireMap author identity', () => {
    const post = blogPosts.find((item) => item.slug === 'premium-erotik-plattform')

    expect(post?.author.name).toBe('Shahindzhan Yozbakar')
    expect(post?.author.jobTitle).toBe('Software developer')
  })

  test('premium article mentions use canonical non-locale URLs', () => {
    const post = blogPosts.find((item) => item.slug === 'premium-erotik-plattform')

    expect(post?.mentions?.every((item) => !item.url.includes('/de/'))).toBe(true)
    expect(post?.mentions?.some((item) => item.url.includes('diamond-frankfurt'))).toBe(false)
  })
})
