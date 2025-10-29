
import { createServerClient } from "@/lib/supabase";
import { cookies } from "next/headers";
import { LiveTicker } from "@/components/live/LiveTicker";
import { PickemForm } from "@/components/tips/PickemForm";
import { getDictionary } from "@/lib/i18n";
import { isDemoMode } from "@/lib/demo-mode";
import { demoMatchWithPlayers } from "@/lib/demo-mode";
import { Database } from "@/types/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default async function HomePage() {
  const cookieStore = await cookies();
  const lang = cookieStore.get('lang')?.value || 'de-CH';
  const t = await getDictionary(lang);
  
  let match: Database['public']['Tables']['matches']['Row'] & { player_a: any; player_b: any; } | null = null;
  let user = null;
  let oomTop5: Database['public']['Tables']['oom']['Row'][] = [];

  if (isDemoMode()) {
    match = demoMatchWithPlayers;
  } else {
    const supabase = createServerClient(cookieStore);
    const { data: { user: authUser } } = await supabase.auth.getUser();
    user = authUser;

    const { data: liveMatch } = await supabase
      .from("matches")
      .select(`
        *,
        player_a:players!player_a_id(*),
        player_b:players!player_b_id(*)
      `)
      .order('started_at', { ascending: false })
      .limit(1)
      .single();
    match = liveMatch;

    const { data: oomData } = await supabase
      .from('oom')
      .select('*')
      .order('rank', { ascending: true })
      .limit(5);
    oomTop5 = oomData || [];
  }

  return (
    <div className="space-y-16">
      <section className="text-center py-8">
        <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl mb-4">
          {t.home.heroTitle}
        </h1>
        <p className="max-w-2xl mx-auto text-foreground/80 md:text-xl mb-8">
          {t.home.heroSubtitle}
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Button asChild size="lg">
            <Link href="#live-ticker">{t.home.openLiveView}</Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="/oom">{t.home.openOom}</Link>
          </Button>
        </div>
      </section>

      <section id="live-ticker">
        {match ? (
          <LiveTicker initialMatch={match} translations={t.liveTicker} />
        ) : (
          <div className="text-center py-12 bg-panel rounded-lg">
            <h2 className="text-2xl font-bold">{t.home.noLiveMatch}</h2>
            <p className="text-panel-foreground/80 mt-2">{t.home.checkBackLater}</p>
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-8">
        <div className="lg:col-span-2">
          {match && (
            <section>
              <h2 className="text-3xl font-bold text-center mb-6">{t.home.makeYourPick}</h2>
              <PickemForm match={match} user={user} translations={t.pickemForm} />
            </section>
          )}
        </div>
        
        <section>
            <Card>
                <CardHeader>
                    <CardTitle>{t.home.oomTitle}</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4">
                        {oomTop5.map(p => (
                            <li key={p.rank} className="flex items-center space-x-4">
                                <span className="font-bold text-lg w-6 text-center">{p.rank}</span>
                                <Image src={`https://flagcdn.com/${p.country_code.toLowerCase()}.svg`} alt={`${p.country_code} flag`} width={24} height={18} className="rounded-sm"/>
                                <span className="flex-grow font-medium">{p.player_name}</span>
                                {p.trend === 1 && <TrendingUp className="h-5 w-5 text-green-500" />}
                                {p.trend === -1 && <TrendingDown className="h-5 w-5 text-red-500" />}
                                {p.trend === 0 && <Minus className="h-5 w-5 text-gray-500" />}
                            </li>
                        ))}
                    </ul>
                    <Button asChild className="w-full mt-6">
                        <Link href="/oom">{t.home.viewFullOom}</Link>
                    </Button>
                </CardContent>
            </Card>
        </section>
      </div>
    </div>
  );
}
