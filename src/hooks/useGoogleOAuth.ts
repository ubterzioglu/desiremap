'use client'

import { useQuery } from '@tanstack/react-query'
import { authApi } from '@/lib/api'

export function useGoogleOAuth() {
  const { data: config } = useQuery({
    queryKey: ['auth', 'config'],
    queryFn: () => authApi.getConfig(),
    staleTime: 5 * 60 * 1000,
  })

  const enabled = config?.googleOAuth ?? false

  const login = async () => {
    const targetUrl = config?.googleOAuthUrl || await authApi.getGoogleLoginUrl()
    window.location.href = targetUrl
  }

  return { enabled, login }
}
