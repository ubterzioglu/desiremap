import { QueryProvider } from '@/components/providers/QueryProvider'
import { AdminAuthProvider } from '@/components/providers/AdminAuthProvider'
import { Toaster } from '@/components/ui/toaster'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminAuthProvider>
      <QueryProvider>
        {children}
        <Toaster />
      </QueryProvider>
    </AdminAuthProvider>
  )
}
