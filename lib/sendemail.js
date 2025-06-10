import sgMail from '@sendgrid/mail';
import { db } from './firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function sendEmail(token, email) {
  // 🔍 Look up the receipt from Firestore
  const q = query(collection(db, 'transactions'), where('token', '==', token));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    throw new Error('Receipt not found');
  }

  const data = snapshot.docs[0].data();
  const { items, total, terminal, createdAt } = data;

  // 🧾 Format receipt HTML
  const html = `
    <h2>Costa Coffee Receipt</h2>
    <p><strong>Terminal:</strong> ${terminal}</p>
    <p><strong>Date:</strong> ${new Date(createdAt.seconds * 1000).toLocaleString()}</p>
    <hr />
    ${items.map(item => `
      <p>${item.name} x${item.qty} — £${(item.price * item.qty).toFixed(2)}</p>
    `).join('')}
    <hr />
    <h3>Total: £${total.toFixed(2)}</h3>
    <p>Token: ${token}</p>
    <p style="color:#888;font-size:12px;">Powered by Fordify Limited</p>
  `;

  // 📤 Send email
  await sgMail.send({
    to: email,
    from: 'you@yourdomain.com', // ✅ Replace with your verified sender
    subject: 'Your Costa Coffee Receipt',
    html,
  });
}
