'use client';

import { useEffect, useRef } from 'react';

/**
 * ViewTracker monitors authentic reader visits to an article.
 * Uses sessionStorage de-duplication to prevent repeated view counts
 * on re-renders or page refreshes within the same student session.
 */
export default function ViewTracker({ slug }) {
  const hasTracked = useRef(false);

  useEffect(() => {
    if (!slug || hasTracked.current) return;

    const storageKey = `tl_viewed_${slug}`;
    try {
      if (sessionStorage.getItem(storageKey)) {
        return;
      }
    } catch (e) {
      // ignore storage access issues
    }

    hasTracked.current = true;

    fetch('/api/blogs/track-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
      keepalive: true
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.success) {
          try {
            sessionStorage.setItem(storageKey, 'true');
          } catch (e) {}
        }
      })
      .catch(() => {});
  }, [slug]);

  return null;
}
