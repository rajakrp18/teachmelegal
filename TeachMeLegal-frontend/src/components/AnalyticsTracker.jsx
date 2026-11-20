"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    async function trackVisit() {
      try {
        await fetch('http://localhost:5000/api/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            path: pathname,
            referrer: document.referrer || null,
          }),
        });
      } catch (err) {
        // Silently ignore errors
      }
    }
    
    trackVisit();
  }, [pathname]);

  return null;
}
