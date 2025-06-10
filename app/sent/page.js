export default function SentPage() {
  return (
    <div style={{
      fontFamily: 'monospace',
      maxWidth: '400px',
      margin: '5rem auto',
      padding: '2rem',
      textAlign: 'center',
      border: '1px dashed #aaa'
    }}>
      <h2>📨 Receipt Sent</h2>
      <p>Your receipt has been emailed to your saved address.</p>
      <p style={{ fontSize: '0.85rem', color: '#888' }}>Powered by Fordify Limited</p>
    </div>
  );
}
