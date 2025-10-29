
import { Database } from "@/types/supabase";

type Player = Database['public']['Tables']['players']['Row'];
type Match = Database['public']['Tables']['matches']['Row'];

export function isDemoMode() {
  return !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
}

export const demoPlayerA: Player = {
    id: "8f6b9c2b-83c8-4b72-8a3c-2a54de415b8a",
    slug: "michael-van-gerwen",
    name: "Michael van Gerwen",
    nickname: "Mighty Mike",
    country_code: "nl",
    handed: 'right',
    hometown: 'Vlijmen, Netherlands',
    birth_date: '1989-04-25',
    walk_on_song: 'Seven Nation Army',
    images: { photo: 'https://placehold.co/128x128/4A5568/FFFFFF?text=MVG' },
    stats: {},
    titles: {},
    created_at: new Date().toISOString()
};

export const demoPlayerB: Player = {
    id: "3d4e5f6a-7b8c-9d0e-1f2a-3b4c5d6e7f8g",
    slug: "luke-littler",
    name: "Luke Littler",
    nickname: "The Nuke",
    country_code: "gb-eng",
    handed: 'right',
    hometown: 'Warrington, England',
    birth_date: '2007-01-21',
    walk_on_song: 'Greenlight',
    images: { photo: 'https://placehold.co/128x128/A0AEC0/1A202C?text=LL' },
    stats: {},
    titles: {},
    created_at: new Date().toISOString()
};

export const demoMatch: Match = {
    id: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    player_a_id: demoPlayerA.id,
    player_b_id: demoPlayerB.id,
    tournament: "World Darts Championship",
    round: "Final",
    best_of: 13,
    sets_a: 1,
    legs_a: 2,
    sets_b: 2,
    legs_b: 3,
    started_at: new Date().toISOString(),
    lock_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes from now
};

export const demoMatchWithPlayers = {
    ...demoMatch,
    player_a: demoPlayerA,
    player_b: demoPlayerB
};
