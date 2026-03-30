import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Wind, LayoutDashboard, Home as HomeIcon } from 'lucide-react';

const Layout = ({ children }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Background Animated Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-sky-900/20 blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/10 blur-[120px] animate-pulse-slow delay-1000"></div>
      </div>

      <header className="sticky top-0 z-50 glass-header px-4 md:px-6 py-3 md:py-4">
        <nav className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 group transition-all">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl overflow-hidden bg-white shadow-lg group-hover:scale-105 transition-transform">
              <img 
                src="/logo-caticha.jpg" 
                alt="Caticha Aire" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-bold tracking-tight text-white leading-tight">
                Caticha
              </span>
              <span className="text-[10px] md:text-xs font-medium tracking-[0.2em] text-sky-400 uppercase">
                Aire Acondicionado
              </span>
            </div>
          </Link>
          
          <div className="flex gap-2 md:gap-4">
            <Link to="/" className={`p-2 rounded-full transition-all ${location.pathname === '/' ? 'text-sky-400 bg-sky-400/10' : 'text-slate-400 hover:text-slate-200'}`}>
              <HomeIcon size={18} className="md:w-5 md:h-5" />
            </Link>
            <Link to="/admin" className={`p-2 rounded-full transition-all ${location.pathname === '/admin' ? 'text-sky-400 bg-sky-400/10' : 'text-slate-400 hover:text-slate-200'}`}>
              <LayoutDashboard size={18} className="md:w-5 md:h-5" />
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-grow z-10 p-4 md:p-10">
        <div className="max-w-7xl mx-auto h-full">
          {children}
        </div>
      </main>

      <footer className="z-10 py-8 px-6 text-center text-slate-500 text-sm border-t border-white/5 backdrop-blur-md">
        <p>© 2026 Caticha - Servicio de Aire Acondicionado • Uruguay</p>
      </footer>
    </div>
  );
};

export default Layout;
