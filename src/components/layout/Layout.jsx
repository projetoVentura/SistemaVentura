import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function Layout({ children, title }) {
  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      <div className="ml-[220px] w-[calc(100%-220px)]">
        <Header title={title} />
        <main className="p-6 bg-gray-50 min-h-[calc(100vh-73px)]">{children}</main>
      </div>
    </div>
  );
}
