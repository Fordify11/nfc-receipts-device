'use client';
import { useEffect } from 'react';

export default function TapRedirectPage() {
  useEffect(() => {
    const deviceId = localStorage.getItem('deviceId');
    const url = deviceId
      ? `/api/random-token?deviceId=${deviceId}`
      : '/api/random-token';

    window.location.href = url;
  }, []);

  return <p>🔄 Tapping... redirecting to your receipt.</p>;
}
