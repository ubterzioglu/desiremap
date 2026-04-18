'use client'

import { OperatorShell } from '@/components/operator/OperatorShell'
import { OperatorVenuesWorkspace } from '@/components/operator/OperatorVenuesWorkspace'

export default function BusinessVenuesPage() {
  return (
    <OperatorShell activeTab="venues" title="Venues" subtitle="Verwalten Sie Ihre Locations">
      <OperatorVenuesWorkspace />
    </OperatorShell>
  )
}
