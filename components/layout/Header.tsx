
import React from 'react';

interface HeaderProps {
    title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
    return (
        <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">BizFlow</h1>
                    <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">{title}</h2>
                </div>
            </div>
        </header>
    );
};

export default Header;
