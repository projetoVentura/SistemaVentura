import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function Layout({ children, title }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      <Sidebar />
      <div className="ml-[220px] flex-1 flex flex-col min-h-screen">
        <Header title={title} />
        <main className="flex-1 p-6 bg-[#0a0a0a]">{children}</main>
      </div>
    </div>
  );
}
