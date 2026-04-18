import { AdminShell } from '@/components/admin/AdminShell'
import { AdminBusinessesWorkspace } from '@/components/admin/AdminBusinessesWorkspace'

export default function AdminBusinessesPage() {
  return (
    <AdminShell activeTab="businesses" title="Businesses" subtitle="Betriebe anlegen und Operator-Accounts verwalten">
      <AdminBusinessesWorkspace />
    </AdminShell>
  )
}
