import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { submitRequest } from '../api/gas';

const RequestForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    zone: '',
    service: 'Instalacion',
    description: ''
  });

  useEffect(() => {
    if (location.state?.selectedService) {
      setFormData(prev => ({
        ...prev,
        service: location.state.selectedService
      }));
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await submitRequest(formData);
      setSuccess(true);
      setTimeout(() => navigate('/'), 5000);
    } catch (err) {
      setError('Hubo un error al enviar tu solicitud. Por favor intenta de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (success) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto glass p-12 rounded-3xl text-center flex flex-col items-center gap-6"
      >
        <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-3xl font-bold italic tracking-tight">¡Solicitud Enviada!</h2>
        <p className="text-slate-400 text-lg">
          Gracias por confiar en <strong>Caticha</strong>. Nos pondremos en contacto contigo por WhatsApp a la brevedad.
        </p>
        <button 
          onClick={() => navigate('/')}
          className="mt-4 px-8 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all font-semibold"
        >
          Volver al Inicio
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h2 className="text-4xl font-black mb-4">Solicitar Servicio</h2>
        <p className="text-slate-400">Completa el formulario y te enviaremos una cotización personalizada.</p>
      </motion.div>

      <motion.form 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        onSubmit={handleSubmit}
        className="glass p-8 md:p-12 rounded-3xl shadow-2xl border-white/5 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300 ml-1">Nombre Completo</label>
            <input 
              required
              type="text" 
              name="name"
              placeholder="Ej: Juan Pérez"
              className="input-glass"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300 ml-1">Número de WhatsApp</label>
            <input 
              required
              type="tel" 
              name="whatsapp"
              placeholder="Ej: 099 123 456"
              className="input-glass"
              value={formData.whatsapp}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300 ml-1">Zona / Barrio</label>
            <input 
              required
              type="text" 
              name="zone"
              placeholder="Ej: Pocitos, Montevideo"
              className="input-glass"
              value={formData.zone}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300 ml-1">Tipo de Servicio</label>
            <select 
              name="service"
              className="input-glass"
              value={formData.service}
              onChange={handleChange}
            >
              <option value="Instalacion">Instalación Nueva</option>
              <option value="Mantenimiento">Mantenimiento / Limpieza</option>
              <option value="Reparacion">Reparación / Falla</option>
              <option value="Carga de Gas">Carga de Gas</option>
              <option value="Otros">Otros</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-300 ml-1">Descripción del Problema/Pedido</label>
          <textarea 
            required
            name="description"
            rows="4" 
            placeholder="Contanos un poco más sobre lo que necesitás..."
            className="input-glass resize-none"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-3 p-4 bg-red-500/20 text-red-400 border border-red-500/50 rounded-xl text-sm"
            >
              <AlertCircle size={18} />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          disabled={loading}
          type="submit" 
          className="btn-premium w-full flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed h-[60px]"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={24} />
          ) : (
            <>
              Enviar Solicitud
              <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </>
          )}
        </button>
      </motion.form>
    </div>
  );
};

export default RequestForm;
