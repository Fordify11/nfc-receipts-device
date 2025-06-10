'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <main style={{
      fontFamily: 'sans-serif',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '2rem',
      backgroundColor: '#f9f9f9'
    }}>
      <div style={{
        maxWidth: '600px',
        width: '100%',
        background: '#fff',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
        textAlign: 'center'
      }}>
        <h1 style={{ marginBottom: '0.5rem' }}>NFC Smart Receipts</h1>
        <p style={{ color: '#555', marginBottom: '1.5rem' }}>
          Powered by Fordify Limited
        </p>
        <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>
          Tap your phone on an NFC tag to instantly preview a digital receipt.
          Enter your email to receive a copy — fast, simple, eco-friendly.
        </p>

        <Link href="/api/random-token" style={{
          display: 'inline-block',
          padding: '0.75rem 1.5rem',
          backgroundColor: '#000',
          color: '#fff',
          borderRadius: '8px',
          fontWeight: 'bold',
          textDecoration: 'none',
          transition: 'background 0.2s ease'
        }}>
          Tap to Demo a Receipt
        </Link>

        <p style={{ marginTop: '2rem', fontSize: '0.85rem', color: '#999' }}>
          For demonstration purposes only
        </p>
      </div>
    </main>
  );
}
