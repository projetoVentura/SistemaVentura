import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function Layout({ children, title }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Sidebar />
      <div className="ml-[220px] w-[calc(100%-220px)]">
        <Header title={title} />
        <main className="p-6 bg-[#0a0a0a] min-h-[calc(100vh-73px)]">{children}</main>
      </div>
    </div>
  );
}
