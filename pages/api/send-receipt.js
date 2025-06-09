import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '@/lib/firebase'; // adjust path if needed
import sgMail from '@sendgrid/mail';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { token } = req.body;

  const q = query(collection(db, 'transactions'), where('token', '==', token));
  const snapshot = await getDocs(q);

  if (snapshot.empty) return res.status(404).json({ error: 'Receipt not found' });

  const receipt = snapshot.docs[0].data();

  if (!receipt.email) return res.status(400).json({ error: 'Email not provided in receipt' });

  const message = {
    to: receipt.email,
    from: 'your_verified_sender@example.com',
    subject: 'Your Receipt',
    text: `Thanks for your purchase!\n\nTerminal: ${receipt.terminal}\nTotal: £${receipt.total.toFixed(2)}\nToken: ${token}`,
    html: `
      <h2>Your Receipt</h2>
      <p><strong>Terminal:</strong> ${receipt.terminal}</p>
      <p><strong>Total:</strong> £${receipt.total.toFixed(2)}</p>
      <p><strong>Token:</strong> ${token}</p>
      <p>Powered by Fordify Limited</p>
    `,
  };

  try {
    await sgMail.send(message);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
