import { Sidebar } from './Sidebar';

export function Layout({ children }) {
  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#0a0a0a', overflow: 'hidden' }}>
      <Sidebar />
      <main style={{ flex: 1, marginLeft: '220px', display: 'flex', flexDirection: 'column', overflowY: 'auto', width: '100%' }}>
        <div style={{ flex: 1, backgroundColor: '#0a0a0a', width: '100%' }}>
          <div style={{ padding: '32px' }}>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
