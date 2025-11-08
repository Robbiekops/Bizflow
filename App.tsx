
import React, { useState, useEffect } from 'react';
import { Page } from './types';
import Header from './components/layout/Header';
import BottomNav from './components/layout/BottomNav';
import DashboardPage from './components/pages/DashboardPage';
import InventoryPage from './components/pages/InventoryPage';
import SalesPage from './components/pages/SalesPage';
import ReportsPage from './components/pages/ReportsPage';
import SettingsPage from './components/pages/SettingsPage';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useAppContext } from './context/AppContext';

function App() {
  const [activePage, setActivePage] = useState<Page>(Page.Dashboard);
  const [isDarkMode, setIsDarkMode] = useLocalStorage('bizflow-dark-mode', false);
  const { state } = useAppContext();
  const unreadNotifications = state.notifications.filter(n => !n.read).length;

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const renderPage = () => {
    switch (activePage) {
      case Page.Dashboard:
        return <DashboardPage />;
      case Page.Inventory:
        return <InventoryPage />;
      case Page.Sales:
        return <SalesPage />;
      case Page.Reports:
        return <ReportsPage />;
      case Page.Settings:
        return <SettingsPage isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="flex flex-col h-screen font-sans text-gray-800 dark:text-gray-200">
      <Header title={activePage} />
      <main className="flex-grow overflow-y-auto pb-20 bg-gray-100 dark:bg-gray-900">
        <div className="p-4">
            {renderPage()}
        </div>
      </main>
      <BottomNav activePage={activePage} setActivePage={setActivePage} notificationCount={unreadNotifications} />
    </div>
  );
}

export default App;
