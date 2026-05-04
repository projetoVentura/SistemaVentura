import { Bell, Search } from 'lucide-react';

export function Header({ title }) {
  return (
    <header className="bg-bg-card border-b border-border px-6 py-4 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-text-primary">{title}</h2>
        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <input
              type="text"
              placeholder="Buscar..."
              className="pl-9 pr-4 py-2 bg-bg-main border border-border rounded-lg text-sm text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent w-64"
            />
          </div>
          <button className="relative p-2 rounded-lg hover:bg-bg-sidebar transition-colors">
            <Bell className="w-5 h-5 text-text-secondary" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-500 rounded-full" />
          </button>
        </div>
      </div>
    </header>
  );
}
