'use client';
import { useEffect, useState } from 'react';

export default function SentPage() {
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('lastTokenSent');
    if (!stored) return;

    fetch(`/api/receipt?token=${stored}`)
      .then(res => res.json())
      .then(data => setReceipt(data.receipt || null));
  }, []);

  return (
    <div style={{
      fontFamily: 'monospace',
      maxWidth: '400px',
      margin: '2rem auto',
      padding: '1.5rem',
      textAlign: 'center',
      border: '1px dashed #aaa'
    }}>
      <h2>📨 Receipt Sent</h2>
      <p>Your receipt has been emailed to your saved address.</p>

      {receipt ? (
        <div style={{ marginTop: '2rem', textAlign: 'left' }}>
          <p><strong>Terminal:</strong> {receipt.terminal}</p>
          <p><strong>Date:</strong> {new Date(receipt.createdAt.seconds * 1000).toLocaleString()}</p>
          <hr />
          {receipt.items.map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{item.name} x{item.qty}</span>
              <span>£{(item.price * item.qty).toFixed(2)}</span>
            </div>
          ))}
          <hr />
          <h3 style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Total</span>
            <span>£{receipt.total.toFixed(2)}</span>
          </h3>
        </div>
      ) : (
        <p>🕐 Loading receipt...</p>
      )}

      <p style={{ fontSize: '0.75rem', marginTop: '2rem', color: '#777' }}>
        Powered by Fordify Limited
      </p>
    </div>
  );
}
