'use server'

import { createServerClient } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { TablesUpdate } from '@/types/supabase'

export async function updateProfile(formData: FormData) {
  const cookieStore = await cookies()
  const supabase = createServerClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    // This should ideally not be reachable if the form is protected
    return redirect('/login')
  }

  const displayName = formData.get('displayName') as string | null
  const countryCode = formData.get('countryCode') as string | null

  // Create a simple, untyped object first to avoid triggering the TS inference bug.
  const payload: { [key: string]: any } = {}

  // Conditionally add properties to the payload only if they have a valid value.
  if (displayName && displayName.trim() !== '') {
    payload.display_name = displayName
  }
  if (countryCode && countryCode.trim() !== '') {
    payload.country_code = countryCode
  }

  // If the payload is empty, there's nothing to update.
  if (Object.keys(payload).length === 0) {
    revalidatePath('/profile')
    // Return a success message as the user might just click "Update" without changing anything.
    return { success: 'No changes submitted.' }
  }

  // Explicitly cast the dynamically built object to the required Supabase type.
  // This is the key to bypassing the compiler's faulty type inference.
  const { error } = await supabase
    .from('profiles')
    .update(payload as TablesUpdate<'profiles'>)
    .eq('id', user.id)

  if (error) {
    console.error('Update Profile Error:', error)
    return { error: 'Database error: Failed to update profile.' }
  }

  revalidatePath('/profile')
  return { success: 'Profile updated successfully!' }
}

export async function signOut() {
  const cookieStore = await cookies()
  const supabase = createServerClient(cookieStore)
  await supabase.auth.signOut()
  return redirect('/')
}
