import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function Layout({ children, title }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0a0a0a' }}>
      <Sidebar />
      <div style={{ marginLeft: '220px', flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header title={title} />
        <main style={{ flex: 1, padding: '24px', backgroundColor: '#0a0a0a' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
