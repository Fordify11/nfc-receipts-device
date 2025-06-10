import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default async function handler(req, res) {
  const token = req.query.token?.trim(); // 🧼 Trim just in case
  if (!token) {
    return res.status(400).json({ error: 'Missing token' });
  }

  try {
    console.log('🔍 Looking up receipt for token:', token);

    const q = query(collection(db, 'transactions'), where('token', '==', token));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.warn('⚠️ No receipt found for token:', token);
      return res.status(404).json({ error: 'Receipt not found' });
    }

    const receipt = snapshot.docs[0].data();

    console.log('✅ Receipt found:', receipt);

    return res.status(200).json({ receipt });
  } catch (err) {
    console.error('❌ Error fetching receipt:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
