'use client';
import { useEffect, useState } from 'react';
import ReceiptCard from '@/components/ReceiptCard';

export default function SentPage() {
  const [receipt, setReceipt] = useState(null);
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('lastTokenSent');
    const storedEmail = localStorage.getItem('lastEmailUsed');
    if (!storedToken) return;

    setToken(storedToken);
    setEmail(storedEmail);

    fetch(`/api/receipt?token=${storedToken}`)
      .then(res => res.json())
      .then(data => setReceipt(data.receipt || null));
  }, []);

  return (
    <>
      {receipt ? (
        <ReceiptCard receipt={receipt} token={token} email={email} />
      ) : (
        <p style={{ textAlign: 'center', marginTop: '4rem' }}>Loading receipt...</p>
      )}
    </>
  );
}
