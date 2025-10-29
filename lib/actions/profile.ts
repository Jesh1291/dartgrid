
'use server'

import { createServerClient } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function updateProfile(formData: FormData) {
  const cookieStore = await cookies()
  const supabase = createServerClient(cookieStore)

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'You must be logged in to update your profile.' }
  }

  const displayName = formData.get('displayName')
  const countryCode = formData.get('countryCode')

  // Type guard to ensure values are not File objects
  if (displayName instanceof File || countryCode instanceof File) {
    return { error: 'Invalid form data. File uploads are not supported for these fields.' }
  }
  
  const { error } = await supabase.from('profiles').update({
    display_name: displayName,
    country_code: countryCode,
    updated_at: new Date().toISOString()
  }).eq('id', user.id)

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