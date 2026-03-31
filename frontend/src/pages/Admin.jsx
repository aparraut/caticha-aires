import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Lock, Search, RefreshCw, MessageCircle, MapPin, User, Hash, LogOut, ArrowUpDown, CheckCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getRequests, updateStatus } from '../api/gas';

const STATUS_OPTIONS = [
  { value: 'Pendiente', label: '🔴 Pendiente', colorClass: 'text-rose-400 bg-rose-400/10 border-rose-400/20' },
  { value: 'Agendada', label: '🟡 Agendada', colorClass: 'text-amber-400 bg-amber-400/10 border-amber-400/20' },
  { value: 'En Proceso', label: '🔵 En Proceso', colorClass: 'text-sky-400 bg-sky-400/10 border-sky-400/20' },
  { value: 'Finalizada', label: '🟢 Finalizada', colorClass: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' },
  { value: 'Cancelada', label: '⚫ Cancelada', colorClass: 'text-slate-400 bg-slate-400/10 border-slate-400/20' },
];

const getStatusColor = (status) => {
  const found = STATUS_OPTIONS.find(s => s.value.toLowerCase() === status?.toLowerCase());
  return found ? found.colorClass : 'text-slate-400 bg-slate-500/10 border-slate-500/20';
};

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);
  
  // Sorting state (default: newest first)
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'desc' });

  const correctPassword = 'Caticha26*';

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getRequests();
      if (result.status === 'success') {
        const cleanedData = result.data.filter(req => req.id); // Remover filas vacías
        setRequests(cleanedData);
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
    if (isAuthenticated) fetchRequests();
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

  const handleUpdateStatus = async (id, newStatus) => {
    setUpdatingId(id.toString());
    try {
      const result = await updateStatus(id, newStatus);
      if (result.status === 'success') {
        setRequests(prev => prev.map(req => req.id.toString() === id.toString() ? { ...req, status: newStatus } : req));
      } else {
        console.error("Error from sheet:", result);
        alert("Error al actualizar estado en la hoja (Asegúrate de haber implementado el nuevo código GAS).");
      }
    } catch (error) {
      alert("Error de red al actualizar estado.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSort = (key) => {
    let direction = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const sortedAndFilteredRequests = useMemo(() => {
    let filterable = [...requests];
    
    // 1. Filtrar
    if (search) {
      const s = search.toLowerCase();
      filterable = filterable.filter(req => 
        req.name?.toLowerCase().includes(s) || 
        req.whatsapp?.toString().includes(s) ||
        req.zone?.toLowerCase().includes(s) ||
        req.service?.toLowerCase().includes(s) ||
        req.status?.toLowerCase().includes(s)
      );
    }

    // 2. Ordenar
    filterable.sort((a, b) => {
      let valA = a[sortConfig.key];
      let valB = b[sortConfig.key];

      // Convertir IDs o Fechas a números para orden preciso
      if (sortConfig.key === 'id') {
        valA = Number(valA);
        valB = Number(valB);
      }

      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return filterable;
  }, [requests, search, sortConfig]);

  const getWhatsAppLink = (number, name) => {
    const cleanNumber = number?.toString().replace(/\s+/g, '') || '';
    const message = encodeURIComponent(`Hola ${name}, te hablamos de Caticha Aire Acondicionado sobre tu solicitud...`);
    return `https://wa.me/${cleanNumber}?text=${message}`;
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-20 animate-fade-in px-4">
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
    <div className="space-y-6 pb-20 animate-fade-in px-2 sm:px-6">
      {/* Header Admin */}
      <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 lg:gap-6 glass p-4 lg:p-6 rounded-[2rem] border-white/5 shadow-xl">
        <div className="flex items-center gap-3 lg:gap-4">
          <div className="p-2 lg:p-3 rounded-2xl bg-sky-500 text-white shadow-lg shadow-sky-500/20">
            <Hash size={20} className="lg:w-6 lg:h-6" />
          </div>
          <div>
            <h1 className="text-xl lg:text-3xl font-bold tracking-tight">Gestión de Pedidos</h1>
            <p className="text-slate-400 text-xs lg:text-sm">{requests.length} solicitudes en el sistema</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="relative flex-grow min-w-[200px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por cliente, zona, estado..."
              className="input-glass !pl-12 pr-4 py-2 w-full text-sm lg:text-base border-white/10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button 
              onClick={fetchRequests} 
              className="flex-1 sm:flex-none px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-sky-400 border border-white/5 flex gap-2 items-center justify-center font-bold"
              title="Sincronizar"
            >
              <RefreshCw className={loading ? 'animate-spin' : ''} size={18} />
              <span className="hidden sm:inline">Refrescar</span>
            </button>
            <button 
              onClick={() => setIsAuthenticated(false)}
              className="flex-1 sm:flex-none px-4 py-3 rounded-xl bg-white/5 hover:bg-rose-500/10 hover:text-rose-500 transition-all text-slate-400 border border-white/5 flex items-center justify-center font-bold"
              title="Cerrar Sesión"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>

      {loading && !requests.length ? (
        <div className="flex flex-col items-center justify-center py-32 gap-6 opacity-60">
           <div className="relative">
             <div className="absolute inset-0 bg-sky-500 blur-2xl opacity-20 animate-pulse rounded-full"></div>
             <RefreshCw className="animate-spin text-sky-400 relative z-10" size={56} />
           </div>
           <p className="font-bold tracking-widest text-slate-400 uppercase">Cargando Base de Datos...</p>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl border border-white/5 shadow-2xl overflow-hidden w-full backdrop-blur-2xl bg-slate-900/40"
        >
          <div className="overflow-x-auto w-full scrollbar-thin scrollbar-thumb-sky-500/20 scrollbar-track-transparent">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead className="bg-[#0f172a] border-b border-white/5 shadow-xl">
                <tr className="text-xs uppercase tracking-widest text-slate-400">
                  <th className="px-6 py-5 font-bold cursor-pointer hover:text-sky-400 transition-colors group select-none" onClick={() => handleSort('id')}>
                    <div className="flex items-center gap-2">Fecha / ID <ArrowUpDown size={14} className="opacity-50 group-hover:opacity-100" /></div>
                  </th>
                  <th className="px-6 py-5 font-bold cursor-pointer hover:text-sky-400 transition-colors group select-none" onClick={() => handleSort('name')}>
                    <div className="flex items-center gap-2">Cliente / Detalles <ArrowUpDown size={14} className="opacity-50 group-hover:opacity-100" /></div>
                  </th>
                  <th className="px-6 py-5 font-bold cursor-pointer hover:text-sky-400 transition-colors group select-none" onClick={() => handleSort('service')}>
                    <div className="flex items-center gap-2">Servicio <ArrowUpDown size={14} className="opacity-50 group-hover:opacity-100" /></div>
                  </th>
                  <th className="px-6 py-5 font-bold cursor-pointer hover:text-sky-400 transition-colors group select-none" onClick={() => handleSort('status')}>
                    <div className="flex items-center gap-2">Estado Activo <ArrowUpDown size={14} className="opacity-50 group-hover:opacity-100" /></div>
                  </th>
                  <th className="px-6 py-5 font-bold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <AnimatePresence>
                  {sortedAndFilteredRequests.length > 0 ? (
                    sortedAndFilteredRequests.map((req, i) => (
                      <motion.tr 
                        key={req.id || i}
                        layout
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, opacity: 0 }}
                        transition={{ delay: i * 0.02 }}
                        className="hover:bg-white/[0.03] transition-colors group"
                      >
                        {/* Fecha */}
                        <td className="px-6 py-4 whitespace-nowrap align-top pt-6">
                          <div className="text-sm font-semibold text-sky-100 flex items-center gap-2">
                             <Clock size={14} className="text-sky-500/50" />
                             {req.date?.split(',')[0]}
                          </div>
                          <div className="text-xs text-slate-500 ml-6 mt-1 font-mono">{req.date?.split(',')[1]?.trim()}</div>
                          <div className="text-[10px] text-slate-600 ml-6 mt-1 hidden group-hover:block transition-all italic">ID: {req.id}</div>
                        </td>

                        {/* Cliente Info */}
                        <td className="px-6 py-4 align-top pt-6">
                          <div className="flex flex-col">
                            <span className="font-extrabold text-base text-white flex items-center gap-2">
                              <User size={16} className="text-slate-400" />
                              {req.name}
                            </span>
                            <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                              <span className="flex items-center gap-1.5 bg-slate-800/50 px-2 py-1 rounded-md"><MapPin size={12} className="text-sky-500"/> {req.zone}</span>
                              <span className="flex items-center gap-1.5 bg-slate-800/50 px-2 py-1 rounded-md"><MessageCircle size={12} className="text-green-500"/> {req.whatsapp}</span>
                            </div>
                            {req.description && (
                              <div className="mt-3 p-3 rounded-xl bg-black/20 border border-white/[0.02] text-sm text-slate-400 italic backdrop-blur-sm max-w-[300px]">
                                "{req.description}"
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Service Type */}
                        <td className="px-6 py-4 align-top pt-6">
                           <span className="px-3 py-1.5 text-xs font-bold rounded-lg bg-sky-500/10 text-sky-400 uppercase tracking-wider inline-flex items-center border border-sky-500/20">
                             {req.service}
                           </span>
                        </td>

                        {/* Status (Editable) */}
                        <td className="px-6 py-4 align-top pt-6 min-w-[200px]">
                          <div className="relative">
                            {updatingId === req.id.toString() ? (
                              <div className="flex items-center justify-center gap-2 text-sky-400 bg-sky-400/10 px-4 py-3 rounded-xl text-sm font-bold border border-sky-400/20 shadow-inner w-full">
                                <RefreshCw className="animate-spin" size={16} />
                                Guardando...
                              </div>
                            ) : (
                              <div className="relative">
                                <select
                                  className={`appearance-none w-full border-2 font-bold text-sm px-4 py-3 pr-10 rounded-xl outline-none transition-all cursor-pointer hover:brightness-110 shadow-lg ${getStatusColor(req.status || 'Pendiente')}`}
                                  value={req.status || 'Pendiente'}
                                  onChange={(e) => handleUpdateStatus(req.id, e.target.value)}
                                >
                                  {STATUS_OPTIONS.map(opt => (
                                    <option className="bg-[#0f172a] text-slate-200 py-2 font-semibold" key={opt.value} value={opt.value}>
                                      {opt.label}
                                    </option>
                                  ))}
                                </select>
                                {/* Flecha del select */}
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-inherit opacity-70">
                                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 align-top pt-6 text-center">
                          <a 
                            href={getWhatsAppLink(req.whatsapp, req.name)}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-3 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white border border-green-500/20 text-sm font-bold rounded-xl transition-all shadow-lg hover:shadow-green-500/30 whitespace-nowrap"
                          >
                            <MessageCircle size={18} /> Contactar
                          </a>
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-20 text-center text-slate-500 italic">
                        <div className="flex flex-col items-center gap-4">
                           <Search size={40} className="opacity-20" />
                           <p>No se encontraron pedidos con esos criterios.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Admin;
