'use client';

import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';

export default function ReceiptPage({ params }) {
  const { token } = params;
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    async function fetchReceipt() {
      const q = query(collection(db, 'transactions'), where('token', '==', token));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const data = querySnapshot.docs[0].data();
        setReceipt(data);

        // 🔔 Email trigger
        fetch('/api/send-receipt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        });
      }
    }

    fetchReceipt();
  }, [token]);

  if (!receipt) {
    return <div>Receipt not found.</div>;
  }

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
      {/* Company Info */}
      <h2 style={{ textAlign: 'center', marginBottom: '0.25rem' }}>Costa Coffee</h2>
      <p style={{ textAlign: 'center', margin: 0, fontSize: '0.85rem' }}>VAT Reg No: GB310031975</p>

      {/* Metadata */}
      <p><strong>Terminal:</strong> {terminal}</p>
      <p><strong>Date:</strong> {date}</p>

      <hr />

      {/* Items */}
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>{item.name} x{item.qty}</span>
          <span>£{(item.price * item.qty).toFixed(2)}</span>
        </div>
      ))}

      <hr />

      {/* Total */}
      <h3 style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>Total</span>
        <span>£{total.toFixed(2)}</span>
      </h3>

      {/* Token */}
      <p style={{ fontSize: '0.75rem', textAlign: 'center', marginTop: '1rem' }}>
        Token: {token}
      </p>

      {/* Footer */}
      <p style={{ fontSize: '0.75rem', textAlign: 'center', marginTop: '2rem', color: '#777' }}>
        Powered by Fordify Limited
      </p>
    </div>
  );
}






