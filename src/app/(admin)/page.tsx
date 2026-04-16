import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function AdminIndexPage() {
  const cookieStore = await cookies()
  const authUser = cookieStore.get('auth_user')?.value

  if (!authUser) {
    redirect('/login')
  }

  try {
    const user = JSON.parse(authUser) as { workspace?: string }
    redirect(user.workspace === 'admin' ? '/dashboard' : '/login')
  } catch {
    redirect('/login')
  }
}
