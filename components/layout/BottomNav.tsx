
import React from 'react';
import { Page } from '../../types';
import { DashboardIcon, InventoryIcon, SalesIcon, ReportsIcon, SettingsIcon } from '../Icons';

interface BottomNavProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
  notificationCount: number;
}

const NavItem: React.FC<{
  page: Page;
  activePage: Page;
  setActivePage: (page: Page) => void;
  icon: React.ReactNode;
  label: string;
  hasNotification?: boolean;
}> = ({ page, activePage, setActivePage, icon, label, hasNotification }) => {
  const isActive = activePage === page;
  const activeClass = 'text-primary-600 dark:text-primary-400';
  const inactiveClass = 'text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-300';

  return (
    <button
      onClick={() => setActivePage(page)}
      className={`flex flex-col items-center justify-center w-full transition-colors duration-200 relative ${isActive ? activeClass : inactiveClass}`}
    >
      {icon}
      <span className={`text-xs font-medium mt-1 ${isActive ? 'font-bold' : ''}`}>{label}</span>
      {hasNotification && (
         <span className="absolute top-0 right-1/4 transform translate-x-1/2 -translate-y-1/2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
         </span>
      )}
    </button>
  );
};


const BottomNav: React.FC<BottomNavProps> = ({ activePage, setActivePage, notificationCount }) => {
  const navItems = [
    { page: Page.Dashboard, icon: <DashboardIcon className="w-6 h-6" />, label: 'Dashboard' },
    { page: Page.Inventory, icon: <InventoryIcon className="w-6 h-6" />, label: 'Inventory' },
    { page: Page.Sales, icon: <SalesIcon className="w-6 h-6" />, label: 'Sales' },
    { page: Page.Reports, icon: <ReportsIcon className="w-6 h-6" />, label: 'Reports', hasNotification: notificationCount > 0 },
    { page: Page.Settings, icon: <SettingsIcon className="w-6 h-6" />, label: 'Settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-t-md z-10">
      <div className="flex justify-around items-center h-full">
        {navItems.map(item => (
          <NavItem 
            key={item.page}
            page={item.page}
            activePage={activePage}
            setActivePage={setActivePage}
            icon={item.icon}
            label={item.label}
            hasNotification={item.hasNotification}
          />
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
