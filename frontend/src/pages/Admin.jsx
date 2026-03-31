import React, { useState, useEffect, useCallback } from 'react';
import { Lock, Search, RefreshCw, MessageCircle, Clock, MapPin, User, ChevronRight, Hash, LogOut, Wind } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getRequests } from '../api/gas';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);

  const correctPassword = 'Caticha26*';

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getRequests();
      if (result.status === 'success') {
        // Reverse to show newest first
        setRequests(result.data.reverse());
      } else {
        setError(result.message || 'Error al obtener datos');
      }
    } catch (err) {
      setError('Error de conexión con el servidor. Intenta de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchRequests();
    }
  }, [isAuthenticated, fetchRequests]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === correctPassword) {
      setIsAuthenticated(true);
      setError(null);
    } else {
      setError('Contraseña incorrecta');
    }
  };

  const filteredRequests = requests.filter(req => 
    req.name?.toLowerCase().includes(search.toLowerCase()) || 
    req.whatsapp?.toString().includes(search) ||
    req.zone?.toLowerCase().includes(search.toLowerCase())
  );

  const getWhatsAppLink = (number, name) => {
    const cleanNumber = number.toString().replace(/\s+/g, '');
    const message = encodeURIComponent(`Hola ${name}, te hablamos de Caticha Servicio de Aire Acondicionado sobre tu solicitud de servicio...`);
    return `https://wa.me/${cleanNumber}?text=${message}`;
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-20 animate-fade-in">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass p-10 rounded-3xl border-white/10 shadow-2xl space-y-6"
        >
          <div className="flex flex-col items-center gap-4 mb-4">
            <div className="p-4 rounded-2xl bg-sky-500/20 text-sky-400">
              <Lock size={32} />
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight">Acceso Admin</h2>
            <p className="text-slate-400 text-center">Ingresa la contraseña maestra para gestionar pedidos.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              className="input-glass text-center text-lg tracking-widest"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-red-400 text-sm text-center font-semibold">{error}</p>}
            <button type="submit" className="btn-premium w-full">Ingresar</button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 animate-fade-in">
      {/* Header Admin */}
      <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 lg:gap-6 glass p-4 lg:p-6 rounded-[2rem] border-white/5 shadow-xl">
        <div className="flex items-center gap-3 lg:gap-4">
          <div className="p-2 lg:p-3 rounded-2xl bg-sky-500 text-white shadow-lg shadow-sky-500/20">
            <Hash size={20} className="lg:w-6 lg:h-6" />
          </div>
          <div>
            <h1 className="text-xl lg:text-3xl font-bold tracking-tight">Panel de Control</h1>
            <p className="text-slate-400 text-xs lg:text-sm">{requests.length} pedidos registrados</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="relative flex-grow min-w-[200px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Buscar..."
              className="input-glass !pl-12 pr-4 py-2 w-full text-sm lg:text-base"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button 
              onClick={fetchRequests} 
              className="flex-1 sm:flex-none p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-sky-400 border border-white/5 flex justify-center"
              title="Sincronizar"
            >
              <RefreshCw className={loading ? 'animate-spin' : ''} size={20} />
            </button>
            <button 
              onClick={() => setIsAuthenticated(false)}
              className="flex-1 sm:flex-none p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-red-400 border border-white/5 flex justify-center"
              title="Cerrar Sesión"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>

      {loading && !requests.length ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-50">
          <RefreshCw className="animate-spin text-sky-400" size={48} />
          <p className="font-bold tracking-widest text-slate-400">CARGANDO PEDIDOS...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <AnimatePresence>
            {filteredRequests.map((req, i) => (
              <motion.div 
                key={req.id || i}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass p-6 rounded-3xl border-white/5 group hover:border-sky-500/30 transition-all relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Wind size={60} className="rotate-12" />
                </div>

                <div className="flex flex-col gap-4 relative z-10">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-sky-500/10 flex items-center justify-center text-sky-400">
                        <User size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl">{req.name}</h3>
                        <div className="flex items-center gap-2 text-xs text-sky-400 font-semibold tracking-wider">
                          <span className="px-2 py-0.5 rounded-full bg-sky-400/10 uppercase">{req.service}</span>
                          <span className="flex items-center gap-1 opacity-60">
                            <Clock size={12} /> {req.date}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <MapPin size={16} className="text-sky-400/50" />
                      {req.zone}
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <MessageCircle size={16} className="text-green-500/50" />
                      {req.whatsapp}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-sm text-slate-300 leading-relaxed italic">
                    "{req.description}"
                  </div>

                  <div className="flex gap-3 justify-end items-center pt-2">
                    <a 
                      href={getWhatsAppLink(req.whatsapp, req.name)}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-green-500 text-white font-bold hover:bg-green-600 transition-all shadow-lg shadow-green-900/40"
                    >
                      <MessageCircle size={20} />
                      Contactar WhatsApp
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {!loading && filteredRequests.length === 0 && (
        <div className="text-center py-20 glass rounded-3xl opacity-50">
          <p className="text-xl">No se encontraron pedidos.</p>
        </div>
      )}
    </div>
  );
};

export default Admin;
