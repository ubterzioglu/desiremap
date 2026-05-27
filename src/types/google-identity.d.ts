declare global {
  interface GoogleCredentialResponse {
    credential?: string
    select_by?: string
  }

  interface GoogleIdConfiguration {
    client_id: string
    callback: (response: GoogleCredentialResponse) => void
    auto_select?: boolean
    cancel_on_tap_outside?: boolean
    context?: 'signin' | 'signup' | 'use'
    locale?: string
    ux_mode?: 'popup' | 'redirect'
  }

  interface GoogleButtonConfiguration {
    locale?: string
    logo_alignment?: 'left' | 'center'
    shape?: 'circle' | 'pill' | 'rectangular' | 'square'
    size?: 'large' | 'medium' | 'small'
    text?: 'continue_with' | 'signin_with' | 'signup_with'
    theme?: 'filled_black' | 'filled_blue' | 'outline'
    type?: 'icon' | 'standard'
    width?: number | string
  }

  interface GoogleAccountsIdApi {
    cancel: () => void
    initialize: (configuration: GoogleIdConfiguration) => void
    renderButton: (parent: HTMLElement, options: GoogleButtonConfiguration) => void
  }

  interface GoogleIdentityServices {
    accounts: {
      id: GoogleAccountsIdApi
    }
  }

  interface Window {
    google?: GoogleIdentityServices
  }
}

export {}
