export default function ReceiptCard({ receipt, token, email }) {
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
      <h2 style={{ textAlign: 'center', marginBottom: '0.25rem' }}>Costa Coffee</h2>
      <p style={{ textAlign: 'center', margin: 0, fontSize: '0.85rem' }}>VAT Reg No: GB310031975</p>

      <p><strong>Terminal:</strong> {terminal}</p>
      <p><strong>Date:</strong> {date}</p>

      <hr />

      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>{item.name} x{item.qty}</span>
          <span>£{(item.price * item.qty).toFixed(2)}</span>
        </div>
      ))}

      <hr />

      <h3 style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>Total</span>
        <span>£{total.toFixed(2)}</span>
      </h3>

      <p style={{ fontSize: '0.75rem', textAlign: 'center', marginTop: '1rem' }}>
        Token: {token}
      </p>

      {email && (
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <strong>{email}</strong>
          <p style={{ marginTop: '0.5rem', color: 'green' }}>✅ Receipt emailed successfully!</p>
        </div>
      )}

      <p style={{ fontSize: '0.75rem', textAlign: 'center', marginTop: '2rem', color: '#777' }}>
        Powered by Fordify Limited
      </p>
    </div>
  );
}
