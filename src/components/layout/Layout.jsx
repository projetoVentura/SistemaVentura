import { Sidebar } from './Sidebar';

export function Layout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0a0a0a' }}>
      <Sidebar />
      <main style={{ marginLeft: '220px', flex: 1, backgroundColor: '#0a0a0a', padding: '24px', minHeight: '100vh' }}>
        {children}
      </main>
    </div>
  );
}
