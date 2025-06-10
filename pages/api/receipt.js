import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default async function handler(req, res) {
  const { token } = req.query;
  if (!token) return res.status(400).json({ error: 'Missing token' });

  try {
    const q = query(collection(db, 'transactions'), where('token', '==', token));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return res.status(404).json({ error: 'Receipt not found' });
    }

    const receipt = snapshot.docs[0].data();
    res.status(200).json({ receipt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}
