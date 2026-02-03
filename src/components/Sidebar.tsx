
import React from 'react';
import { NavLink } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navItems = [
    { 
      name: 'Dashboard', 
      path: '/dashboard', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>
      )
    },
    { 
      name: 'My Equbs', 
      path: '/equbs', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
      )
    },
    { 
      name: 'Notifications', 
      path: '/notifications', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
      )
    }
  ];

  const baseClasses = "fixed inset-y-0 left-0 z-40 w-64 transform bg-slate-900 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0";
  const stateClasses = isOpen ? "translate-x-0" : "-translate-x-full";

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`${baseClasses} ${stateClasses}`}>
        <div className="flex flex-col h-full">
          <div className="flex h-24 items-center justify-center border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                <span className="text-xl font-black text-white">E</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">EqubPro</span>
            </div>
          </div>

          <nav className="flex-1 space-y-2 p-4 pt-6">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => `
                  flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all
                  ${isActive 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
                `}
              >
                {item.icon}
                {item.name}
              </NavLink>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-800">
            <div className="rounded-2xl bg-slate-800 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Support</p>
              <p className="text-sm text-slate-300">Need help with your Equb?</p>
              <button className="mt-3 w-full rounded-lg bg-slate-700 py-2 text-xs font-bold text-white hover:bg-slate-600">
                Contact Admin
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
