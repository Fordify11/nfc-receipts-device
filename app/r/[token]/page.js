'use client';

import { use, useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

// ✅ NEW: Local device ID logic
function getOrCreateDeviceId() {
  if (typeof window === 'undefined') return null;
  let deviceId = localStorage.getItem('deviceId');
  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem('deviceId', deviceId);
  }
  return deviceId;
}

export default function ReceiptPage({ params }) {
  const { token } = use(params);

  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [deviceId, setDeviceId] = useState(null); // ✅ NEW

  useEffect(() => {
    const id = getOrCreateDeviceId(); // ✅ NEW
    setDeviceId(id);                 // ✅ NEW

    async function fetchReceipt() {
      const q = query(collection(db, 'transactions'), where('token', '==', token));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        setReceipt(snapshot.docs[0].data());
      }

      setLoading(false);
    }

    fetchReceipt();
  }, [token]);

  const handleSend = async () => {
    if (!email) {
      setStatus('❌ Please enter an email address.');
      return;
    }

    setStatus('⏳ Sending...');
    const res = await fetch('/api/send-receipt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, email, deviceId }), // ✅ Send deviceId
    });

    const data = await res.json();
    if (res.ok) {
      setStatus('✅ Receipt emailed successfully!');
    } else {
      setStatus(`❌ ${data.error || 'Failed to send email'}`);
    }
  };

  if (loading) return <div>Loading receipt...</div>;
  if (!receipt) return <div>Receipt not found.</div>;

  const { terminal, items, total, createdAt } = receipt;
  const date = new Date(createdAt.seconds * 1000).toLocaleString();

  return (
    <div style={{
      fontFamily: 'monospace',
      maxWidth: '380px',
      margin: '2rem auto',
      padding: '1rem',
      border: '1px dashed #aaa',
      background: '#fff'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '0.25rem' }}>Costa Coffee</h2>
      <p style={{ textAlign: 'center', margin: 0, fontSize: '0.85rem' }}>VAT Reg No: GB310031975</p>

      <p><strong>Terminal:</strong> {terminal}</p>
      <p><strong>Date:</strong> {date}</p>

      <hr />

      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>{item.name} x{item.qty}</span>
          <span>£{(item.price * item.qty).toFixed(2)}</span>
        </div>
      ))}

      <hr />

      <h3 style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>Total</span>
        <span>£{total.toFixed(2)}</span>
      </h3>

      <p style={{ fontSize: '0.75rem', textAlign: 'center', marginTop: '1rem' }}>
        Token: {token}
      </p>

      <div style={{ marginTop: '2rem' }}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem',
            marginBottom: '0.5rem',
            fontFamily: 'inherit',
            fontSize: '1rem'
          }}
        />
        <button
          onClick={handleSend}
          style={{
            width: '100%',
            padding: '0.5rem',
            backgroundColor: '#000',
            color: '#fff',
            fontFamily: 'inherit',
            cursor: 'pointer'
          }}
        >
          Send Receipt to Email
        </button>
        <p style={{ textAlign: 'center', marginTop: '0.5rem' }}>{status}</p>
      </div>

      <p style={{ fontSize: '0.75rem', textAlign: 'center', marginTop: '2rem', color: '#777' }}>
        Powered by Fordify Limited
      </p>
    </div>
  );
}
