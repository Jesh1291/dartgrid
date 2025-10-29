"use client"

// FIX: Import FormEvent to resolve 'Cannot find namespace 'React'' error for the event handler type.
import { useState, FormEvent } from 'react';
import { User } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';
import { submitTip } from '@/lib/actions/tips';

type Player = Database['public']['Tables']['players']['Row'];
type Match = Database['public']['Tables']['matches']['Row'] & {
  player_a: Player;
  player_b: Player;
};
type PickemFormTranslations = {
  winner: string;
  score: string;
  submitTip: string;
  updateTip: string;
  loginToPredict: string;
  picksLocked: string;
  success: string;
  error: string;
};

interface PickemFormProps {
  match: Match;
  user: User | null;
  translations: PickemFormTranslations;
}

export function PickemForm({ match, user, translations }: PickemFormProps) {
  const [winner, setWinner] = useState<'a' | 'b'>('a');
  const [setsA, setSetsA] = useState(0);
  const [setsB, setSetsB] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const isLocked = new Date() > new Date(match.lock_at);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || isLocked) return;

    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('match_id', match.id);
    formData.append('pick_winner', winner);
    formData.append('pick_sets_a', setsA.toString());
    formData.append('pick_sets_b', setsB.toString());
    
    const result = await submitTip(formData);

    setLoading(false);

    if (result.error) {
      setMessage({ type: 'error', text: result.error });
    } else {
      setMessage({ type: 'success', text: translations.success });
    }
  };

  if (!user) {
    return (
      <div className="text-center bg-panel p-6 rounded-lg">
        <Button asChild>
          <Link href="/login">{translations.loginToPredict}</Link>
        </Button>
      </div>
    );
  }

  if (isLocked) {
      return (
        <div className="text-center bg-panel p-6 rounded-lg">
          <p className="font-semibold">{translations.picksLocked}</p>
        </div>
      );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-panel p-6 rounded-lg">
      <div className="space-y-2">
        <label className="font-semibold">{translations.winner}</label>
        <div className="grid grid-cols-2 gap-4">
          <Button type="button" variant={winner === 'a' ? 'default' : 'outline'} onClick={() => setWinner('a')}>
            {match.player_a.name}
          </Button>
          <Button type="button" variant={winner === 'b' ? 'default' : 'outline'} onClick={() => setWinner('b')}>
            {match.player_b.name}
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <label className="font-semibold">{translations.score}</label>
        <div className="flex items-center gap-4">
          <Input 
            type="number" 
            value={setsA} 
            onChange={(e) => setSetsA(parseInt(e.target.value, 10) || 0)} 
            min="0" 
            className="text-center"
            required
          />
          <span className="font-bold">:</span>
          <Input 
            type="number" 
            value={setsB} 
            onChange={(e) => setSetsB(parseInt(e.target.value, 10) || 0)} 
            min="0" 
            className="text-center"
            required
          />
        </div>
      </div>
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Submitting...' : translations.submitTip}
      </Button>
      {message && (
        <p className={`text-sm text-center ${message.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
          {message.text}
        </p>
      )}
    </form>
  );
}
