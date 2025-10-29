
import Link from 'next/link';
import { LanguageSwitcher } from './LanguageSwitcher';
import { createServerClient } from '@/lib/supabase';
import { cookies } from 'next/headers';
import { getDictionary } from '@/lib/i18n';
import { Button } from '../ui/Button';

export async function Header() {
  const cookieStore = await cookies();
  const lang = cookieStore.get('lang')?.value || 'de-CH';
  const t = await getDictionary(lang);
  const supabase = createServerClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="h-6 w-6"><rect width="256" height="256" fill="none"></rect><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></circle><circle cx="128" cy="128" r="32" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></circle><line x1="128" y1="96" x2="128" y2="32" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line><line x1="96" y1="128" x2="32" y2="128" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line><line x1="128" y1="160" x2="128" y2="224" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line><line x1="160" y1="128" x2="224" y2="128" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line></svg>
            <span className="font-bold">Dartgrid</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/" className="transition-colors hover:text-foreground/80 text-foreground/60">{t.header.home}</Link>
            <Link href="/oom" className="transition-colors hover:text-foreground/80 text-foreground/60">{t.header.oom}</Link>
            <Link href="/tips" className="transition-colors hover:text-foreground/80 text-foreground/60">{t.header.tips}</Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <LanguageSwitcher />
          {user ? (
            <Button asChild variant="secondary" size="sm">
                <Link href="/profile">{t.header.profile}</Link>
            </Button>
          ) : (
            <Button asChild size="sm">
                <Link href="/login">{t.header.login}</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
