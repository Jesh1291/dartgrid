
'use server'

import { createServerClient } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import type { TablesUpdate } from '@/types/supabase'

export async function updateProfile(formData: FormData) {
  const cookieStore = await cookies()
  const supabase = createServerClient(cookieStore)

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'You must be logged in to update your profile.' }
  }

  const displayName = formData.get('displayName')
  const countryCode = formData.get('countryCode')

  // Dynamically build the update payload to avoid a TypeScript issue with `null` values.
  const payload: TablesUpdate<'profiles'> = {
    updated_at: new Date().toISOString(),
  };

  if (displayName !== null) {
    if (displayName instanceof File) {
      return { error: 'Invalid display name.' };
    }
    // Set to null if the string is empty, otherwise use the value
    payload.display_name = displayName || null;
  }

  if (countryCode !== null) {
    if (countryCode instanceof File) {
      return { error: 'Invalid country code.' };
    }
    // Set to null if the string is empty, otherwise use the value
    payload.country_code = countryCode || null;
  }
  
  const { error } = await supabase.from('profiles').update(payload).eq('id', user.id)

  if (error) {
    console.error('Update Profile Error:', error)
    return { error: 'Failed to update profile.' }
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
