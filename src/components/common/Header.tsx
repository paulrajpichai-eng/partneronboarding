import React from 'react';
import { Building2, User, LogOut } from 'lucide-react';

interface HeaderProps {
  title: string;
  userRole?: string;
  userName?: string;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, userRole, userName, onLogout }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Building2 className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-green-600 bg-clip-text text-transparent">
                Uncoded
              </h1>
              <p className="text-sm text-gray-600">{title}</p>
            </div>
          </div>

          {userRole && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-500" />
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{userName}</p>
                  <p className="text-gray-500">{userRole}</p>
                </div>
              </div>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;