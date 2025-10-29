"use client";

import { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from './Button';

export function SoundToggle() {
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const savedMuteState = localStorage.getItem('dartgrid-sound-muted');
    if (savedMuteState !== null) {
      setIsMuted(JSON.parse(savedMuteState));
    }
  }, []);

  const toggleMute = () => {
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);
    localStorage.setItem('dartgrid-sound-muted', JSON.stringify(newMuteState));
    // NOTE: Add logic to control global audio context here
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggleMute} aria-label={isMuted ? "Unmute sounds" : "Mute sounds"}>
      {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
    </Button>
  );
}
