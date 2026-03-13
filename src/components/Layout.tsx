import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Camera, History, LogOut, User, ShoppingBag } from 'lucide-react';

export default function Layout({ user, onLogout }: { user: any, onLogout: () => void }) {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/new-analysis', label: 'New Analysis', icon: Camera },
    { path: '/history', label: 'History', icon: History },
    { path: '/products', label: 'Products', icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-neutral-200 flex flex-col">
        <div className="p-6 border-b border-neutral-200">
          <h1 className="text-xl font-semibold text-emerald-600 flex items-center gap-2">
            <Camera className="w-6 h-6" />
            SkinAnalyzer AI
          </h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive 
                    ? 'bg-emerald-50 text-emerald-700 font-medium' 
                    : 'text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-neutral-200">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
              <User className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-900 truncate">{user.name}</p>
              <p className="text-xs text-neutral-500 truncate">{user.skin_type} Skin</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-xl text-neutral-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
