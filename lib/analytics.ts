"use client";

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

/**
 * Stub for logging analytics events.
 * In a real app, this would send data to a service like Google Analytics, Vercel Analytics, etc.
 * @param eventName The name of the event.
 * @param payload Additional data for the event.
 */
export function logEvent(eventName: string, payload?: Record<string, any>) {
  console.info(`[Analytics Event] ${eventName}`, payload || '');
  // TODO: Replace with a real analytics pipeline.
}

export function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    logEvent('page_view', { url });
  }, [pathname, searchParams]);
  
  return null;
}
