'use client'

import { useState } from 'react'
import { Plus, Trash } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  useCustomerProfile,
  useCustomerVisits,
  useCustomerAddresses,
  useCustomerBadges,
  useCreateAddress,
  useDeleteAddress
} from '@/hooks/useQueries'
import type { DashboardTab } from '@/types'

interface DashboardTabsProps {
  activeTab: DashboardTab
  sidebarOpen: boolean
}

export function DashboardTabs({ activeTab, sidebarOpen }: DashboardTabsProps) {
  const { data: profile, isLoading: profileLoading } = useCustomerProfile()
  const { data: visits = [], isLoading: visitsLoading } = useCustomerVisits()
  const { data: addresses = [], isLoading: addressesLoading } = useCustomerAddresses()
  const { data: badges = [], isLoading: badgesLoading } = useCustomerBadges()
  const createAddress = useCreateAddress()
  const deleteAddress = useDeleteAddress()

  const [showAddressForm, setShowAddressForm] = useState(false)
  const [newAddress, setNewAddress] = useState({
    label: '', street: '', city: '', zip: ''
  })

  const handleCreateAddress = async () => {
    if (!newAddress.label || !newAddress.street || !newAddress.city || !newAddress.zip) return

    await createAddress.mutateAsync({
      ...newAddress,
      country: 'Deutschland',
      isDefault: addresses.length === 0
    })

    setNewAddress({ label: '', street: '', city: '', zip: '' })
    setShowAddressForm(false)
  }

  const handleDeleteAddress = async (id: string) => {
    await deleteAddress.mutateAsync(id)
  }

  const isLoading = profileLoading || visitsLoading || addressesLoading || badgesLoading

  const renderDashboardTab = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Mein Dashboard</h1>
      {isLoading ? (
        <div className="text-gray-400">Laden...</div>
      ) : (
        <>
          <StatsGrid visits={visits.length} addresses={addresses.length} badges={badges.length} />
          {profile && <ProfileCard profile={profile} />}
        </>
      )}
    </div>
  )

  const renderVisitsTab = () => (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-white">Meine Besuche</h1>
      {visitsLoading ? (
        <div className="text-gray-400">Laden...</div>
      ) : visits.length === 0 ? (
        <div className="text-gray-400">Noch keine Besuche</div>
      ) : (
        visits.map((visit: any) => (
          <VisitCard key={visit.id} visit={visit} />
        ))
      )}
    </div>
  )

  const renderAddressesTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Meine Adressen</h1>
        <Button onClick={() => setShowAddressForm(true)} className="bg-[#8b1a4a] hover:bg-[#7a1640]">
          <Plus className="w-4 h-4 mr-2" />
          Neue Adresse
        </Button>
      </div>

      {showAddressForm && (
        <AddressForm
          newAddress={newAddress}
          setNewAddress={setNewAddress}
          onSubmit={handleCreateAddress}
          onCancel={() => setShowAddressForm(false)}
        />
      )}

      {addressesLoading ? (
        <div className="text-gray-400">Laden...</div>
      ) : addresses.length === 0 ? (
        <div className="text-gray-400">Noch keine Adressen</div>
      ) : (
        addresses.map((addr: any) => (
          <AddressCard key={addr.id} address={addr} onDelete={handleDeleteAddress} />
        ))
      )}
    </div>
  )

  const renderBadgesTab = () => (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-white">Meine Badges</h1>
      {badgesLoading ? (
        <div className="text-gray-400">Laden...</div>
      ) : badges.length === 0 ? (
        <div className="text-gray-400">Noch keine Badges verdient</div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {badges.map((badge: any) => (
            <BadgeCard key={badge.id} badge={badge} />
          ))}
        </div>
      )}
    </div>
  )

  const contentMap: Record<DashboardTab, React.ReactNode> = {
    dashboard: renderDashboardTab(),
    visits: renderVisitsTab(),
    addresses: renderAddressesTab(),
    badges: renderBadgesTab()
  }

  return (
    <main className={cn(
      'flex-1 transition-all duration-300 p-6',
      sidebarOpen ? 'ml-[280px]' : 'ml-20'
    )}>
      {contentMap[activeTab]}
    </main>
  )
}

// Sub-components
function StatsGrid({ visits, addresses, badges }: { visits: number; addresses: number; badges: number }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {[
        { label: 'Besuche', value: visits },
        { label: 'Adressen', value: addresses },
        { label: 'Badges', value: badges }
      ].map((stat) => (
        <div key={stat.label} className="bg-white/5 rounded-xl p-4">
          <div className="text-gray-400 text-sm mb-1">{stat.label}</div>
          <div className="text-2xl font-bold text-white">{stat.value}</div>
        </div>
      ))}
    </div>
  )
}

function ProfileCard({ profile }: { profile: any }) {
  return (
    <div className="bg-white/5 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Profil</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-gray-400 text-sm">Name</div>
          <div className="text-white">{profile.name || 'Nicht angegeben'}</div>
        </div>
        <div>
          <div className="text-gray-400 text-sm">Email</div>
          <div className="text-white">{profile.email}</div>
        </div>
        <div>
          <div className="text-gray-400 text-sm">Mitglied seit</div>
          <div className="text-white">{new Date(profile.memberSince).toLocaleDateString('de-DE')}</div>
        </div>
        <div>
          <div className="text-gray-400 text-sm">Gesamtausgaben</div>
          <div className="text-white">€{profile.totalSpent?.toFixed(2) || '0.00'}</div>
        </div>
      </div>
    </div>
  )
}

function VisitCard({ visit }: { visit: any }) {
  return (
    <div className="bg-white/5 rounded-xl p-4">
      <div className="flex justify-between">
        <div>
          <p className="text-white font-medium">{visit.bordellName}</p>
          <p className="text-gray-500 text-sm">{new Date(visit.date).toLocaleDateString('de-DE')}</p>
        </div>
        <div className="text-right">
          <p className="text-[#b76e79] font-bold">€{visit.price}</p>
          <p className="text-gray-500 text-sm">{visit.duration} min</p>
        </div>
      </div>
    </div>
  )
}

function AddressForm({
  newAddress,
  setNewAddress,
  onSubmit,
  onCancel
}: {
  newAddress: { label: string; street: string; city: string; zip: string }
  setNewAddress: (a: { label: string; street: string; city: string; zip: string }) => void
  onSubmit: () => void
  onCancel: () => void
}) {
  return (
    <div className="bg-white/5 rounded-xl p-4 space-y-4">
      <input
        type="text"
        placeholder="Label (z.B. Home)"
        value={newAddress.label}
        onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500"
      />
      <input
        type="text"
        placeholder="Straße"
        value={newAddress.street}
        onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500"
      />
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Stadt"
          value={newAddress.city}
          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500"
        />
        <input
          type="text"
          placeholder="PLZ"
          value={newAddress.zip}
          onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500"
        />
      </div>
      <div className="flex gap-2">
        <Button onClick={onSubmit} className="bg-[#8b1a4a] hover:bg-[#7a1640]">Speichern</Button>
        <Button onClick={onCancel} variant="outline" className="border-white/10">Abbrechen</Button>
      </div>
    </div>
  )
}

function AddressCard({ address, onDelete }: { address: any; onDelete: (id: string) => void }) {
  return (
    <div className="bg-white/5 rounded-xl p-4 flex justify-between items-start">
      <div>
        <div className="flex items-center gap-2">
          <p className="text-white font-medium">{address.label}</p>
          {address.isDefault && (
            <Badge className="bg-[#8b1a4a]/20 text-[#b76e79] text-xs">Standard</Badge>
          )}
        </div>
        <p className="text-gray-400 text-sm">{address.street}, {address.zip} {address.city}</p>
      </div>
      <Button
        onClick={() => onDelete(address.id)}
        variant="ghost"
        size="icon"
        className="text-gray-400 hover:text-red-400"
      >
        <Trash className="w-4 h-4" />
      </Button>
    </div>
  )
}

function BadgeCard({ badge }: { badge: any }) {
  return (
    <div className="bg-white/5 rounded-xl p-4 flex items-center gap-3">
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
        style={{ backgroundColor: `${badge.color}20` }}
      >
        {badge.icon}
      </div>
      <div>
        <p className="text-white font-medium">{badge.name}</p>
        <p className="text-gray-500 text-sm">{badge.description}</p>
      </div>
    </div>
  )
}
