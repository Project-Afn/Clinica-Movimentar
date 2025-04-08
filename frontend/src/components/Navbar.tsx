
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Users, FileText, LogOut } from 'lucide-react';

interface NavbarProps {
  userName: string;
  userRole: string;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ userName, userRole, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { path: '/dashboard', icon: <Home className="h-5 w-5 mr-2" />, label: 'Dashboard' },
    { path: '/patients', icon: <Users className="h-5 w-5 mr-2" />, label: 'Pacientes' },
    { path: '/records', icon: <FileText className="h-5 w-5 mr-2" />, label: 'Prontuários' },
  ];

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex-shrink-0 flex items-center">
              <span className="text-primary font-bold text-xl">Movimentar</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive(item.path)
                      ? 'border-primary text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            <div className="hidden sm:flex sm:items-center sm:ml-6">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {userName} <span className="text-xs ml-1">({userRole})</span>
                </span>
                <Button variant="ghost" size="sm" onClick={onLogout} className="flex items-center">
                  <LogOut className="h-4 w-4 mr-1" />
                  Sair
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className="sm:hidden border-t">
        <div className="grid grid-cols-3 text-xs">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-2 ${
                isActive(item.path) 
                  ? 'text-primary' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="mb-1">{item.icon}</div>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
