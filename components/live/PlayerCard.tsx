
import Image from 'next/image';
import { Database } from '@/types/supabase';

type Player = Database['public']['Tables']['players']['Row'];

interface PlayerCardProps {
  player: Player;
  isThrowing: boolean;
  align?: 'left' | 'right';
}

export function PlayerCard({ player, isThrowing, align = 'left' }: PlayerCardProps) {
  const textAlign = align === 'left' ? 'text-left' : 'text-right';
  const flexDirection = align === 'left' ? 'flex-row' : 'flex-row-reverse';
  const itemAlign = align === 'left' ? 'items-start' : 'items-end';

  const images = player.images as { photo?: string; country_flag?: string };
  const playerPhoto = images?.photo || `https://placehold.co/128x128/2d3748/e2e8f0?text=${player.name.charAt(0)}`;
  const countryFlag = player.country_code ? `https://flagcdn.com/${player.country_code.toLowerCase()}.svg` : 'https://placehold.co/32x24';

  return (
    <div className={`flex ${flexDirection} items-center gap-4`}>
      <div className={`relative ${isThrowing ? 'ring-4 ring-accent rounded-full' : ''}`}>
        <Image 
          src={playerPhoto}
          alt={player.name}
          width={80}
          height={80}
          className="rounded-full border-2 border-panel-foreground/20"
        />
        {isThrowing && <div className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs font-bold px-1.5 py-0.5 rounded-full animate-pulse">AT OCHE</div>}
      </div>
      <div className={`${textAlign} ${itemAlign} flex flex-col`}>
        <div className={`flex ${flexDirection} items-center gap-2`}>
            <Image src={countryFlag} alt={`${player.country_code} flag`} width={24} height={18} />
            <p className="text-xl md:text-2xl font-bold truncate">{player.name}</p>
        </div>
        <p className="text-sm text-panel-foreground/70">{player.nickname}</p>
        {/* Mini stats could go here */}
      </div>
    </div>
  );
}
