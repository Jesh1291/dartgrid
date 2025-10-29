'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Languages } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useCookies } from 'next-client-cookies';

export function LanguageSwitcher() {
  const cookies = useCookies();
  const router = useRouter();
  const pathname = usePathname();
  
  const languages = [
    { code: 'de-CH', name: 'DE' },
    { code: 'en', name: 'EN' },
    { code: 'nl', name: 'NL' },
  ];
  const currentLang = cookies.get('lang') || 'de-CH';

  const changeLanguage = (lang: string) => {
    cookies.set('lang', lang, { path: '/' });
    router.refresh(); // Re-renders the page with the new dictionary
  };

  const nextLang = languages[(languages.findIndex(l => l.code === currentLang) + 1) % languages.length];

  return (
    <Button variant="ghost" size="sm" onClick={() => changeLanguage(nextLang.code)}>
      <Languages className="h-4 w-4 mr-2" />
      {nextLang.name}
    </Button>
  );
}
