import sgMail from '@sendgrid/mail';
import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function sendEmail(token, email) {
  const receiptRef = doc(db, 'transactions', token);
  const snapshot = await getDoc(receiptRef);

  if (!snapshot.exists()) {
    throw new Error('Receipt not found');
  }

  const data = snapshot.data();
  const { items, total, terminal, createdAt } = data;
  const date = new Date(createdAt.seconds * 1000).toLocaleString();

  const html = `
    <div style="font-family: monospace; max-width: 400px; margin: auto; padding: 1rem; border: 1px dashed #aaa;">
      <h2 style="text-align: center;">Costa Coffee</h2>
      <p style="text-align: center; margin: 0;">VAT Reg No: GB310031975</p>
      <p><strong>Terminal:</strong> ${terminal}</p>
      <p><strong>Date:</strong> ${date}</p>
      <hr />
      ${items.map(item => `
        <div style="display: flex; justify-content: space-between;">
          <span>${item.name} x${item.qty}</span>
          <span>£${(item.price * item.qty).toFixed(2)}</span>
        </div>
      `).join('')}
      <hr />
      <h3 style="display: flex; justify-content: space-between;">
        <span>Total</span>
        <span>£${total.toFixed(2)}</span>
      </h3>
      <p style="font-size: 0.75rem; text-align: center; margin-top: 1rem;">Token: ${token}</p>
      <p style="text-align: center; color: #777; font-size: 0.75rem;">Powered by Fordify Limited</p>
    </div>
  `;

  await sgMail.send({
    to: email,
    from: 'fordify@outlook.com',
    subject: 'Your Costa Coffee Receipt',
    html,
  });
}

