// FIX: Aliased the imported `createServerClient` to `createSupabaseServerClient` to avoid a name collision
// with this module's exported `createServerClient` function. This resolves a type error where the
// function was incorrectly seen as non-generic, which caused downstream errors in server components.
import { createServerClient as createSupabaseServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/types/supabase'

// FIX: The `cookies()` function is incorrectly typed as returning a Promise. This function now accepts the Awaited (resolved)
// type. Inside, `cookieStore` is cast to `any` for `set` calls to handle both read-only (from Server Components) and
// read-write (from Server Actions/Route Handlers) cookie stores.
export function createServerClient(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  return createSupabaseServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            (cookieStore as any).set({ name, value, ...options })
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            (cookieStore as any).set({ name, value: '', ...options })
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
