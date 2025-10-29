
interface ScoreboardProps {
  scoreA: { sets: number; legs: number };
  scoreB: { sets: number; legs: number };
  bestOf: number;
  translations: {
    sets: string;
    legs: string;
  };
}

export function Scoreboard({ scoreA, scoreB, bestOf, translations }: ScoreboardProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center bg-background/50 rounded-lg p-2 md:p-4">
      <div className="flex items-center gap-4 md:gap-8">
        {/* Player A Score */}
        <div className="flex flex-col items-center">
          <span className="text-3xl md:text-5xl font-black">{scoreA.sets}</span>
          <span className="text-xs md:text-sm font-semibold uppercase tracking-wider">{translations.sets}</span>
        </div>
        
        {/* Divider / Best Of */}
        <div className="flex flex-col">
            <span className="text-lg md:text-2xl font-bold">:</span>
            <span className="text-xs text-foreground/60 -mt-1">Best of {bestOf}</span>
        </div>
        
        {/* Player B Score */}
        <div className="flex flex-col items-center">
          <span className="text-3xl md:text-5xl font-black">{scoreB.sets}</span>
          <span className="text-xs md:text-sm font-semibold uppercase tracking-wider">{translations.sets}</span>
        </div>
      </div>
      
      {/* Legs */}
      <div className="mt-2 flex items-center text-sm md:text-base font-medium text-foreground/80">
        <span>{scoreA.legs}</span>
        <span className="mx-2 text-xs uppercase">{translations.legs}</span>
        <span>{scoreB.legs}</span>
      </div>
    </div>
  );
}
