import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import UpgradePlans from '@/components/UpgradePlans'

export default async function UpgradePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single()

  const currentPlan = profile?.plan ?? 'free'

  return <UpgradePlans currentPlan={currentPlan} />
}
