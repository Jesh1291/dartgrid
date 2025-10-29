
'use server'

import { createServerClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

export async function submitTip(formData: FormData) {
  const cookieStore = await cookies()
  const supabase = createServerClient(cookieStore)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in to submit a tip.' }
  }

  const matchId = formData.get('match_id') as string
  const pickWinner = formData.get('pick_winner') as string
  const pickSetsA = parseInt(formData.get('pick_sets_a') as string, 10)
  const pickSetsB = parseInt(formData.get('pick_sets_b') as string, 10)

  if (!matchId || !pickWinner || isNaN(pickSetsA) || isNaN(pickSetsB)) {
    return { error: 'Invalid data provided.' }
  }

  const { error } = await supabase.from('tips').upsert({
    user_id: user.id,
    match_id: matchId,
    pick_winner: pickWinner,
    pick_sets_a: pickSetsA,
    pick_sets_b: pickSetsB,
  }, { onConflict: 'user_id,match_id' });

  if (error) {
    console.error('Error submitting tip:', error)
    return { error: 'Database error: Could not submit tip.' }
  }

  revalidatePath('/')
  revalidatePath('/tips')
  return { success: true }
}

export async function createGroup(formData: FormData) {
    // ... group creation logic
    return { error: 'Not implemented yet.'}
}

export async function joinGroup(formData: FormData) {
    // ... join group logic
    return { error: 'Not implemented yet.'}
}
