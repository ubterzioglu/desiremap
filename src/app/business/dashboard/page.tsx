'use client'

import { OperatorShell } from '@/components/operator/OperatorShell'
import { OperatorDashboardWorkspace } from '@/components/operator/OperatorDashboardWorkspace'

export default function BusinessDashboardPage() {
  return (
    <OperatorShell activeTab="dashboard" title="Dashboard" subtitle="Übersicht Ihres Betreiber-Portals">
      <OperatorDashboardWorkspace />
    </OperatorShell>
  )
}
