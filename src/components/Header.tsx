
import React from 'react';
import { useAuth } from '../auth/AuthContext';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center bg-background/80 backdrop-blur-md px-6 shadow-sm border-b border-border lg:px-10">
      <button
        onClick={onMenuClick}
        className="mr-4 rounded-lg p-2 text-muted-foreground hover:bg-muted lg:hidden"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
      </button>

      <div className="flex flex-1 items-center justify-between">
        <h1 className="text-lg font-bold text-foreground lg:text-xl">Equb Owner Panel</h1>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          <div className="hidden flex-col items-end sm:flex">
            <span className="text-sm font-semibold text-foreground">{user?.fullName || 'Owner Name'}</span>
            <span className="text-xs text-muted-foreground capitalize">{user?.role || 'Admin'}</span>
          </div>
          
          <div className="relative group">
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
              <span className="text-sm font-bold">{user?.fullName?.charAt(0) || 'O'}</span>
            </button>
            
            <div className="absolute right-0 top-full mt-2 hidden w-48 rounded-xl bg-card p-2 shadow-xl border border-border group-hover:block">
              <button 
                onClick={logout}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
