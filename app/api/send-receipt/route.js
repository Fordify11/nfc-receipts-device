import { getFirestore, collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import sgMail from '@sendgrid/mail';

const firebaseConfig = {
  apiKey: 'AIzaSyBnZ-3x0j5ME1S0wUTOGsmDOtQr3UZYp2w',
  authDomain: 'nfc-receipts.firebaseapp.com',
  projectId: 'nfc-receipts',
  storageBucket: 'nfc-receipts.firebasestorage.app',
  messagingSenderId: '420203098913',
  appId: '1:420203098913:web:bb8e49fcef636a21200460'
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function POST(req) {
  try {
    const { token, email, deviceId } = await req.json();
    const cleanedToken = token?.trim();

    if (!cleanedToken || !email) {
      console.warn('❌ Missing required fields:', { token, email });
      return new Response(JSON.stringify({ error: 'Token and email are required' }), { status: 400 });
    }

    console.log('🔍 Looking up receipt for token:', cleanedToken);

    const q = query(collection(db, 'transactions'), where('token', '==', cleanedToken));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.warn('⚠️ No receipt found for token:', cleanedToken);
      return new Response(JSON.stringify({ error: 'Receipt not found' }), { status: 404 });
    }

    const receipt = snapshot.docs[0].data();

    const createdAt = receipt.createdAt?.seconds
      ? new Date(receipt.createdAt.seconds * 1000).toLocaleString()
      : 'Unknown date';

    const emailHtml = `
      <div style="font-family: monospace; max-width: 400px; margin: auto;">
        <h2 style="text-align: center;">Costa Coffee</h2>
        <p style="text-align: center; margin: 0;">VAT Reg No: GB310031975</p>
        <p><strong>Terminal:</strong> ${receipt.terminal}</p>
        <p><strong>Date:</strong> ${createdAt}</p>
        <hr />
        <table style="width: 100%;">
          ${receipt.items.map(item => `
            <tr>
              <td>${item.name} x${item.qty}</td>
              <td style="text-align: right;">£${(item.price * item.qty).toFixed(2)}</td>
            </tr>
          `).join('')}
        </table>
        <hr />
        <h3 style="display: flex; justify-content: space-between;">
          <span>Total</span>
          <span>£${receipt.total.toFixed(2)}</span>
        </h3>
        <p style="text-align: center; font-size: 0.8rem;">Token: ${cleanedToken}</p>
        <p style="text-align: center; color: #777; font-size: 0.75rem;">Powered by Fordify Limited</p>
      </div>
    `;

    await sgMail.send({
      to: email,
      from: 'fordify@outlook.com',
      subject: 'Your Receipt',
      html: emailHtml
    });

    if (deviceId) {
      const deviceRef = doc(collection(db, 'deviceLinks'), deviceId);
      await setDoc(deviceRef, { email, updatedAt: new Date() });
    }

    console.log('✅ Email sent successfully to', email);

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (err) {
    console.error('❌ send-receipt error:', err);
    return new Response(JSON.stringify({ error: 'Failed to send email' }), { status: 500 });
  }
}
