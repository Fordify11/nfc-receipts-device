import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  const token = req.query.token?.trim();
  if (!token) {
    return res.status(400).json({ error: 'Missing token' });
  }

  try {
    const receiptRef = doc(db, 'transactions', token);
    const snapshot = await getDoc(receiptRef);

    if (!snapshot.exists()) {
      console.warn('⚠️ No receipt found for token:', token);
      return res.status(404).json({ error: 'Receipt not found' });
    }

    const receipt = snapshot.data();
    console.log('✅ Receipt found:', receipt);

    return res.status(200).json({ receipt });
  } catch (err) {
    console.error('❌ Error fetching receipt:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

