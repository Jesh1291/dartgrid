import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { Database } from '@/types/supabase';

config({ path: '.env.local' });

type PlayerInsert = Database['public']['Tables']['players']['Insert'];
type MatchInsert = Database['public']['Tables']['matches']['Insert'];
type OomInsert = Database['public']['Tables']['oom']['Insert'];

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function seed() {
  console.log('🌱 Starting database seed...');

  // 1. Create Players
  console.log('Creating players...');
  const players: PlayerInsert[] = [
    {
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
    },
    {
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
    },
    {
        slug: "peter-wright",
        name: "Peter Wright",
        nickname: "Snakebite",
        country_code: "gb-sct",
        handed: 'right'
    },
    {
        slug: "gerwyn-price",
        name: "Gerwyn Price",
        nickname: "The Iceman",
        country_code: "gb-wls",
        handed: 'right'
    },
    {
        slug: "michael-smith",
        name: "Michael Smith",
        nickname: "Bully Boy",
        country_code: "gb-eng",
        handed: 'right'
    }
  ];

  const { data: insertedPlayers, error: playerError } = await supabase
    .from('players')
    .upsert(players, { onConflict: 'slug' })
    .select();

  if (playerError) {
    console.error('Error inserting players:', playerError);
    return;
  }
  console.log(`✅ Inserted ${insertedPlayers.length} players.`);

  // 2. Create a Match
  console.log('Creating a match...');
  const mvg = insertedPlayers.find(p => p.slug === 'michael-van-gerwen');
  const littler = insertedPlayers.find(p => p.slug === 'luke-littler');

  if (!mvg || !littler) {
      console.error('Could not find seeded players to create a match.');
      return;
  }

  const match: MatchInsert = {
    id: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    player_a_id: mvg.id,
    player_b_id: littler.id,
    tournament: "World Darts Championship",
    round: "Final",
    best_of: 13,
    sets_a: 1,
    legs_a: 2,
    sets_b: 2,
    legs_b: 3,
    started_at: new Date().toISOString(),
    lock_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
  };

  const { error: matchError } = await supabase
    .from('matches')
    .upsert(match, { onConflict: 'id' });

  if (matchError) {
    console.error('Error inserting match:', matchError);
    return;
  }
  console.log('✅ Inserted 1 match.');

  // 3. Create Order of Merit Data
  console.log('Creating Order of Merit data...');
  const oomData: OomInsert[] = insertedPlayers.map((player, index) => ({
      season: new Date().getFullYear(),
      rank: index + 1,
      player_id: player.id,
      player_name: player.name,
      country_code: player.country_code || 'xx',
      prize_money: `£${(1500000 / (index + 1)).toLocaleString()}`,
      trend: index % 3 - 1 // Randomly assign up, down, same
  }));

  const { error: oomError } = await supabase.from('oom').upsert(oomData);
  if (oomError) {
    console.error('Error inserting OoM data:', oomError);
    return;
  }
  console.log(`✅ Inserted ${oomData.length} OoM entries.`);
  
  console.log('🎉 Seed complete!');
}

seed();
