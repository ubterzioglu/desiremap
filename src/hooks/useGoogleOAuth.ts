'use client'

import { useEffect, useState } from 'react'
import { authApi } from '@/lib/api'

export function useGoogleOAuth() {
  const [enabled, setEnabled] = useState(false)
  const [oauthUrl, setOauthUrl] = useState('')

  useEffect(() => {
    authApi.getConfig()
      .then((config) => {
        setEnabled(config.googleOAuth)
        setOauthUrl(config.googleOAuthUrl || '')
      })
      .catch(() => {
        setEnabled(false)
        setOauthUrl('')
      })
  }, [])

  const login = async () => {
    const targetUrl = oauthUrl || await authApi.getGoogleLoginUrl()
    window.location.href = targetUrl
  }

  return {
    enabled,
    login
  }
}
