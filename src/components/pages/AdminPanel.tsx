'use client'

import { usePathname } from 'next/navigation'
import { AdminDashboard } from '@/components/admin/AdminDashboard'
import { AdminDiscoveryWorkspace } from '@/components/admin/AdminDiscoveryWorkspace'
import { AdminEventsWorkspace } from '@/components/admin/AdminEventsWorkspace'
import { AdminOperatorsWorkspace } from '@/components/admin/AdminOperatorsWorkspace'
import { AdminSettingsWorkspace } from '@/components/admin/AdminSettingsWorkspace'
import { AdminShell } from '@/components/admin/AdminShell'
import { AdminVenuesWorkspace } from '@/components/admin/AdminVenuesWorkspace'
import type { AdminTab } from '@/types'

const pageConfig: Record<string, { tab: AdminTab; title: string; subtitle: string; content: React.ReactNode }> = {
  '/dashboard': {
    tab: 'dashboard',
    title: 'Corporate Admin Dashboard',
    subtitle: 'Kompakter Ueberblick ueber Business-Kontext, Event-Lifecycle und Teamsteuerung.',
    content: <AdminDashboard />,
  },
  '/venues': {
    tab: 'venues',
    title: 'Venue Workspace',
    subtitle: 'Neue Locations anlegen, Kontext setzen und die manuelle Fallback-Auswahl kontrollieren.',
    content: <AdminVenuesWorkspace />,
  },
  '/events': {
    tab: 'events',
    title: 'Event Workspace',
    subtitle: 'Events erstellen, publizieren und absagen. Optimiert fuer den taeglichen Operator-Ablauf.',
    content: <AdminEventsWorkspace />,
  },
  '/operators': {
    tab: 'operators',
    title: 'Operator Workspace',
    subtitle: 'Business-Operatoren pruefen und Lifecycle-Aktionen sicher ausfuehren.',
    content: <AdminOperatorsWorkspace />,
  },
  '/discovery': {
    tab: 'discovery',
    title: 'Discovery',
    subtitle: 'Öffentlich sichtbare Locations verwalten und Seed-Daten einpflegen.',
    content: <AdminDiscoveryWorkspace />,
  },
  '/settings': {
    tab: 'settings',
    title: 'Admin Settings',
    subtitle: 'Technische Rahmenbedingungen und naechste Ausbaustufen fuer das Operator-UI.',
    content: <AdminSettingsWorkspace />,
  },
}

export function AdminPanel() {
  const pathname = usePathname()
  const currentPage = pageConfig[pathname] || pageConfig['/dashboard']

  return (
    <AdminShell
      activeTab={currentPage.tab}
      title={currentPage.title}
      subtitle={currentPage.subtitle}
    >
      {currentPage.content}
    </AdminShell>
  )
}
