
"use client";

import { useState, useEffect, useMemo } from 'react';
import { useLiveMatch } from '@/hooks/useLiveMatch';
import { PlayerCard } from './PlayerCard';
import { Scoreboard } from './Scoreboard';
import { EventChip } from './EventChip';
import { SoundToggle } from '../ui/SoundToggle';
import { CollapsibleSection } from '../ui/CollapsibleSection';
import { Database } from '@/types/supabase';

type Player = Database['public']['Tables']['players']['Row'];
type Match = Database['public']['Tables']['matches']['Row'] & {
  player_a: Player;
  player_b: Player;
};
type LiveTickerTranslations = {
  live: string;
  sets: string;
  legs: string;
  moreDetails: string;
  legHistory: string;
  noEvents: string;
};

interface LiveTickerProps {
  initialMatch: Match;
  translations: LiveTickerTranslations;
}

export function LiveTicker({ initialMatch, translations }: LiveTickerProps) {
  const { matchState, isConnected } = useLiveMatch(initialMatch.id, initialMatch);

  const { score, thrower, events } = matchState;

  const playerA = useMemo(() => initialMatch.player_a, [initialMatch.player_a]);
  const playerB = useMemo(() => initialMatch.player_b, [initialMatch.player_b]);

  const playerAEvents = useMemo(() => events.filter(e => e.by_player === 'a').slice(-3).reverse(), [events]);
  const playerBEvents = useMemo(() => events.filter(e => e.by_player === 'b').slice(-3).reverse(), [events]);

  return (
    <div className="bg-panel rounded-xl shadow-lg p-4 md:p-6 relative text-panel-foreground">
      <div className="absolute top-3 right-3 flex items-center space-x-4">
        <SoundToggle />
        <div className={`flex items-center space-x-2 ${isConnected ? 'text-green-400' : 'text-amber-400'}`}>
          <span className="relative flex h-3 w-3">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isConnected ? 'bg-green-400' : 'bg-amber-400'} opacity-75`}></span>
            <span className={`relative inline-flex rounded-full h-3 w-3 ${isConnected ? 'bg-green-500' : 'bg-amber-500'}`}></span>
          </span>
          <span className="text-sm font-semibold">{isConnected ? translations.live : 'Ticker Lite'}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-3 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
        <PlayerCard player={playerA} isThrowing={thrower === 'a'} />
        
        <Scoreboard 
          scoreA={{ sets: score.sets_a, legs: score.legs_a }}
          scoreB={{ sets: score.sets_b, legs: score.legs_b }}
          bestOf={initialMatch.best_of}
          translations={{ sets: translations.sets, legs: translations.legs }}
        />
        
        <PlayerCard player={playerB} isThrowing={thrower === 'b'} align="right" />
      </div>

      <div className="mt-4 grid grid-cols-[1fr_auto_1fr] gap-4 min-h-[50px]">
        <div className="flex flex-col items-start gap-2">
            {playerAEvents.map(event => <EventChip key={event.id} event={event} />)}
        </div>
        <div></div>
        <div className="flex flex-col items-end gap-2">
            {playerBEvents.map(event => <EventChip key={event.id} event={event} />)}
        </div>
      </div>

      <div className="mt-6">
        <CollapsibleSection title={translations.moreDetails}>
            <div className="bg-background/50 p-4 rounded-md">
                <h4 className="font-bold text-lg mb-2">{translations.legHistory}</h4>
                <p className="text-sm text-foreground/70">{translations.noEvents}</p>
                 {/* NOTE: Full leg history would be rendered here */}
            </div>
        </CollapsibleSection>
      </div>
    </div>
  );
}
