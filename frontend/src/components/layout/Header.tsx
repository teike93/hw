import { Link, useLocation } from 'react-router-dom';
import { Ticket, Plus } from 'lucide-react';

export function Header() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (path === '/' || path === '/tickets') {
      return location.pathname === '/' || location.pathname === '/tickets';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="bg-white border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <Link to="/" className="flex items-center space-x-2">
            <Ticket className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">
              Helpdesk
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/tickets"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/tickets')
                  ? 'text-primary'
                  : 'text-muted-foreground'
              }`}
            >
              All Tickets
            </Link>
            <Link
              to="/tickets/new"
              className={`inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-md transition-colors ${
                isActive('/tickets/new')
                  ? 'bg-primary/90'
                  : ''
              }`}
            >
              <Plus className="h-4 w-4" />
              <span>New Ticket</span>
            </Link>
          </nav>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Link
              to="/tickets/new"
              className="inline-flex items-center space-x-2 px-3 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-md transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>New</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}