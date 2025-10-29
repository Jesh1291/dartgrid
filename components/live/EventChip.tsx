// FIX: Import React to resolve 'Cannot find namespace 'React'' error for React.ReactNode and JSX.
import * as React from 'react';
import { Database } from '@/types/supabase';
import { Flame, Star, Target, XCircle, CheckCircle, PauseCircle, Zap } from 'lucide-react';

type MatchEvent = Database['public']['Tables']['match_events']['Row'];

interface EventChipProps {
  event: MatchEvent;
}

const eventStyles: { [key: string]: { icon: React.ReactNode; label: string; color: string; } } = {
  't20': { icon: <Target size={14} />, label: 'T20', color: 'bg-yellow-500 text-yellow-900' },
  '140': { icon: <Flame size={14} />, label: '140+', color: 'bg-orange-500 text-white' },
  '180': { icon: <Flame size={14} className="text-red-500" />, label: '180!', color: 'bg-red-500 text-white' },
  '9d': { icon: <Zap size={14} />, label: '9-DART!', color: 'bg-purple-600 text-white' },
  'd20': { icon: <Star size={14} />, label: 'D20', color: 'bg-green-500 text-white' },
  'checkout': { icon: <CheckCircle size={14} />, label: 'Checkout', color: 'bg-emerald-500 text-white' },
  'x': { icon: <XCircle size={14} />, label: 'Fail', color: 'bg-gray-500 text-white' },
  'pause': { icon: <PauseCircle size={14} />, label: 'Pause', color: 'bg-blue-500 text-white' },
  'throw': { icon: <Target size={14} />, label: 'Throw', color: 'bg-sky-500 text-white' },
};

export function EventChip({ event }: EventChipProps) {
  const style = eventStyles[event.type] || eventStyles['throw'];
  
  // NOTE: assuming payload is { score: number } for 'throw' type
  const payload = event.payload as { score?: number };
  const label = event.type === 'throw' && payload.score ? `${payload.score}` : style.label;

  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold animate-slide-in shadow-md ${style.color}`}>
      {style.icon}
      <span>{label}</span>
    </div>
  );
}
