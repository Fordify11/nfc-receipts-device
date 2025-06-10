import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import sendEmail from '@/lib/sendEmail'; // 🔧 Make sure this exists and works

export default async function handler(req, res) {
  const { deviceId } = req.query;

  try {
    const snapshot = await getDocs(collection(db, 'transactions'));
    const tokens = snapshot.docs.map(doc => doc.data().token);

    if (!tokens.length) {
      return res.status(404).json({ message: 'No tokens found' });
    }

    const randomToken = tokens[Math.floor(Math.random() * tokens.length)];

    if (deviceId) {
      // Look up deviceId to see if we have a saved email
      const linkRef = doc(db, 'deviceLinks', deviceId);
      const linkSnap = await getDoc(linkRef);

      if (linkSnap.exists()) {
        const { email } = linkSnap.data();

        // ✅ Send the receipt to stored email
        await sendEmail(randomToken, email);

        // ✅ Redirect to confirmation page
        res.writeHead(302, { Location: '/sent' });
        return res.end();
      }
    }

    // Default fallback: just redirect to receipt page
    res.writeHead(302, { Location: `/r/${randomToken}` });
    res.end();

  } catch (err) {
    console.error('Error in /api/random-token:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
