'use client'

import { useMemo } from 'react'
import { Ban, RotateCcw, Trash2 } from 'lucide-react'
import {
  useAdminOperators,
  useDeprovisionBusinessOperator,
  useDisableBusinessOperator,
  useReactivateBusinessOperator,
} from '@/hooks/useQueries'
import { Button } from '@/components/ui/button'
import { getConfiguredVenuePublicId } from '@/lib/admin-config'

export function AdminOperatorsWorkspace() {
  const { data: operators = [], isLoading } = useAdminOperators()
  const disableOperator = useDisableBusinessOperator()
  const reactivateOperator = useReactivateBusinessOperator()
  const deprovisionOperator = useDeprovisionBusinessOperator()
  const configuredVenuePublicId = getConfiguredVenuePublicId()
  const rows = useMemo(() => Array.isArray(operators) ? operators : [], [operators])

  if (isLoading) {
    return <div className="rounded-[32px] border border-white/10 bg-slate-950/70 p-6 text-slate-300">Operatoren werden geladen...</div>
  }

  return (
    <div className="rounded-[32px] border border-white/10 bg-slate-950/70 p-6">
      <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Business Operators</div>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">Team und Lifecycle Aktionen</h2>
      <div className="mt-6 overflow-hidden rounded-[24px] border border-white/10">
        <div className="grid grid-cols-[1.3fr_1fr_1fr_1.2fr] gap-4 border-b border-white/10 bg-white/[0.03] px-5 py-4 text-xs uppercase tracking-[0.18em] text-slate-500">
          <div>Operator</div>
          <div>Status</div>
          <div>Venue Rollen</div>
          <div>Aktionen</div>
        </div>
        {rows.length === 0 && (
          <div className="px-5 py-8 text-sm text-slate-400">
            Keine Operatoren gefunden. Sobald der Business-Kontext gueltig ist, erscheinen hier Disable-, Reactivate- und Deprovision-Aktionen.
          </div>
        )}
        {rows.map((operator: any) => (
          <div key={operator.operatorPublicId} className="grid grid-cols-[1.3fr_1fr_1fr_1.2fr] gap-4 border-b border-white/10 px-5 py-4 text-sm last:border-b-0">
            <div>
              <div className="font-medium text-white">{operator.displayName || operator.invitedEmail}</div>
              <div className="mt-1 text-slate-500">{operator.invitedEmail}</div>
            </div>
            <div className="text-slate-300">{operator.accountStatus}</div>
            <div className="text-slate-400">
              {Array.isArray(operator.venues) && operator.venues.length > 0
                ? operator.venues.map((venue: any) => venue.roleCode).join(', ')
                : 'Keine aktiven Rollen'}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-white/10 bg-transparent hover:bg-white/5"
                onClick={() => disableOperator.mutateAsync({ action: 'disable', operatorPublicId: operator.operatorPublicId })}
              >
                <Ban className="mr-1.5 h-3.5 w-3.5" />
                Disable
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-white/10 bg-transparent hover:bg-white/5"
                onClick={() => reactivateOperator.mutateAsync({
                  action: 'reactivate',
                  operatorPublicId: operator.operatorPublicId,
                  venuePublicId: configuredVenuePublicId,
                  roleCode: operator.venues?.[0]?.roleCode || 'VENUE_MANAGER',
                })}
              >
                <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                Reactivate
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-white/10 bg-transparent hover:bg-white/5"
                onClick={() => deprovisionOperator.mutateAsync({ action: 'deprovision', operatorPublicId: operator.operatorPublicId })}
              >
                <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                Deprovision
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
