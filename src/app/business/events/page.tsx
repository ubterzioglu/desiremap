'use client'

import { OperatorShell } from '@/components/operator/OperatorShell'
import { OperatorEventsWorkspace } from '@/components/operator/OperatorEventsWorkspace'

export default function BusinessEventsPage() {
  return (
    <OperatorShell activeTab="events" title="Events" subtitle="Events anlegen, veröffentlichen und verwalten">
      <OperatorEventsWorkspace />
    </OperatorShell>
  )
}
