
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Database } from '@/types/supabase';

type Match = Database['public']['Tables']['matches']['Row'];
type MatchEvent = Database['public']['Tables']['match_events']['Row'];

type MatchScore = {
  sets_a: number;
  legs_a: number;
  sets_b: number;
  legs_b: number;
};

type MatchState = {
  score: MatchScore;
  thrower: 'a' | 'b';
  events: MatchEvent[];
};

export function useLiveMatch(matchId: string, initialMatch: Match) {
  const [matchState, setMatchState] = useState<MatchState>({
    score: {
      sets_a: initialMatch.sets_a,
      legs_a: initialMatch.legs_a,
      sets_b: initialMatch.sets_b,
      legs_b: initialMatch.legs_b,
    },
    thrower: 'a', // NOTE: assumption, server should send initial thrower
    events: [],
  });
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const eventSource = new EventSource(`/api/match/${matchId}/events`);

    eventSource.onopen = () => {
      setIsConnected(true);
    };

    eventSource.onmessage = (event) => {
      try {
        const data: { state: MatchState, newEvents: MatchEvent[] } = JSON.parse(event.data);
        setMatchState(prevState => ({
          ...data.state,
          events: [...prevState.events, ...data.newEvents]
        }));
      } catch (error) {
        console.error("Failed to parse SSE event data:", error);
      }
    };

    eventSource.onerror = (err) => {
      console.error("EventSource failed:", err);
      setIsConnected(false);
      eventSource.close();
    };

    return () => {
      eventSource.close();
      setIsConnected(false);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchId]);

  return { matchState, isConnected };
}
