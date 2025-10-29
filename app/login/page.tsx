'use client'

// FIX: Import FormEvent to resolve 'Cannot find namespace 'React'' error for the event handler type.
import { useState, FormEvent } from 'react'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    })

    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Check your email for the magic link!')
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-col items-center justify-center pt-12">
      <div className="w-full max-w-sm">
        <form
          className="bg-panel shadow-md rounded-lg px-8 pt-6 pb-8 mb-4"
          onSubmit={handleLogin}
        >
          <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
          <div className="mb-4">
            <label className="block text-panel-foreground/80 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send Magic Link'}
            </Button>
          </div>
          {message && <p className="text-center text-sm mt-4">{message}</p>}
        </form>
      </div>
    </div>
  )
}
