import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default async function handler(req, res) {
  const snapshot = await getDocs(collection(db, 'transactions'));
  const tokens = snapshot.docs.map(doc => doc.data().token);

  if (!tokens.length) {
    return res.status(404).json({ message: 'No tokens found' });
  }

  const randomToken = tokens[Math.floor(Math.random() * tokens.length)];

  // Redirect to the random receipt
  res.writeHead(302, { Location: `/r/${randomToken}` });
  res.end();
}
