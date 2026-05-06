import { Sidebar } from './Sidebar';

export function Layout({ children }) {
  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      backgroundColor: '#0a0a0a',
      overflow: 'hidden',
    }}>
      <Sidebar />
      <main style={{
        flex: 1,
        marginLeft: '220px',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        backgroundColor: '#0a0a0a',
      }}>
        <div style={{ padding: '32px', minHeight: '100vh' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
