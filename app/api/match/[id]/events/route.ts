
import { NextRequest } from 'next/server';
import { isDemoMode } from '@/lib/demo-mode';

export const runtime = 'edge';

// NOTE: In a real application, this would connect to a real-time data source like Supabase Realtime or a Redis pub/sub.
// For this MVP, we simulate events being pushed.
async function* createDemoEventStream(matchId: string) {
  let thrower: 'a' | 'b' = 'a';
  let sets_a = 1, legs_a = 2, sets_b = 2, legs_b = 3;

  const eventTypes: (Database['public']['Enums']['event_type'])[] = ['t20', '140', 'throw', 'throw', 'd20', 'x'];

  for (let i = 0; i < 50; i++) {
    await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds
    
    const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    const newEvent: Database['public']['Tables']['match_events']['Row'] = {
      id: crypto.randomUUID(),
      match_id: matchId,
      by_player: thrower,
      type,
      payload: { score: Math.floor(Math.random() * 180) + 1 },
      created_at: new Date().toISOString(),
    };
    
    // Simulate score changes
    if (i % 5 === 0) {
      if (thrower === 'a') legs_a++;
      else legs_b++;
    }
    if (legs_a > 4) { sets_a++; legs_a=0; legs_b=0; }
    if (legs_b > 4) { sets_b++; legs_a=0; legs_b=0; }

    thrower = thrower === 'a' ? 'b' : 'a';

    const state = {
      score: { sets_a, legs_a, sets_b, legs_b },
      thrower,
    };

    yield { state, newEvents: [newEvent] };
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isDemoMode()) {
    // NOTE: Replace with real Supabase Realtime subscription logic
    console.warn("SSE route is running in demo mode. Connect to a real-time backend for live data.");
  }
  
  const iterator = createDemoEventStream(params.id);
  const stream = new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next();
      if (done) {
        controller.close();
      } else {
        const payload = `data: ${JSON.stringify(value)}\n\n`;
        controller.enqueue(new TextEncoder().encode(payload));
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

// Dummy type for demo mode
type Database = {
    public: {
      Enums: {
        event_type: 't20'|'140'|'180'|'d20'|'checkout'|'x'|'pause'|'9d'|'throw';
      },
      Tables: {
        match_events: {
          Row: {
            id: string;
            match_id: string;
            by_player: 'a' | 'b';
            type: Database['public']['Enums']['event_type'];
            payload: any;
            created_at: string;
          };
        };
      };
    };
  };
