import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function Layout({ children, title }) {
  return (
    <div className="layout-container">
      <Sidebar />
      <div className="main-content">
        <Header title={title} />
        <main className="main-inner">{children}</main>
      </div>
    </div>
  );
}
