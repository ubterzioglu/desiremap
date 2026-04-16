const config = {
  baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:3000',
  publicHost: process.env.PLAYWRIGHT_PUBLIC_HOST || 'desiremap.de',
  adminHost: process.env.PLAYWRIGHT_ADMIN_HOST || 'admin.desiremap.de',
  port: process.env.PLAYWRIGHT_PORT || '3000',
}

export default config
