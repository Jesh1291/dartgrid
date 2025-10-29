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
    return { error: 'You must be logged in to update your profile.' }
  }

  // Create a payload object that is explicitly typed.
  const payload: TablesUpdate<'profiles'> = {}

  // Get values from FormData.
  const displayName = formData.get('displayName')
  const countryCode = formData.get('countryCode')

  // Dynamically build the payload, only adding fields that were actually submitted with a string value.
  // This is a more robust pattern that avoids the underlying TypeScript inference bug with the Supabase client.
  if (typeof displayName === 'string') {
    payload.display_name = displayName
  }

  if (typeof countryCode === 'string') {
    payload.country_code = countryCode
  }

  // If no data was submitted, no need to call the database.
  if (Object.keys(payload).length === 0) {
    revalidatePath('/profile')
    return { success: 'No changes were submitted.' }
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
