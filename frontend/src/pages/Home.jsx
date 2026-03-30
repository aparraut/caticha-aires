import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, Shield, Zap, Wind } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-16 md:gap-24 overflow-visible pb-20">
      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row items-center gap-12 pt-8">
        <div className="flex-1 space-y-6 text-center lg:text-left z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-extrabold leading-tight tracking-tighter">
              Climatización <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600">
                de Alto Nivel
              </span>
            </h1>
            <p className="mt-6 text-slate-400 max-w-xl mx-auto lg:mx-0 text-balance opacity-90">
              Servicio técnico especializado en instalación y mantenimiento de aire acondicionado. 
              Garantizamos confort y eficiencia en cada rincón de tu hogar.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap gap-4 justify-center lg:justify-start"
          >
            <button 
              onClick={() => navigate('/solicitud')}
              className="btn-premium group flex items-center gap-2 text-lg"
            >
              Pedir Servicio
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 relative"
        >
          <div className="absolute -inset-4 bg-sky-500/20 blur-3xl rounded-full opacity-50"></div>
          <div className="relative glass p-2 rounded-3xl overflow-hidden aspect-[4/3] group shadow-2xl">
            <img 
              src="/hero-ac.png" 
              alt="Aire Acondicionado Caticha" 
              className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 p-4 glass rounded-xl border-white/10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-400">
                <CheckCircle size={20} />
              </div>
              <div>
                <p className="text-sm font-bold">Instalación Certificada</p>
                <p className="text-xs text-slate-400">Más de 10 años de experiencia</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Services Grid */}
      <section id="servicios" className="space-y-10 py-10">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold tracking-tight">Nuestros Servicios</h2>
          <p className="text-slate-400 max-w-2xl mx-auto italic">Soluciones integrales para garantizar tu confort durante todo el año.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { 
              icon: <Wind size={32} className="text-sky-400" />, 
              title: "Instalación", 
              desc: "Colocación profesional de unidades Split y Multisplit.",
              serviceValue: "Instalacion",
              theme: "from-sky-500/20 to-blue-500/5"
            },
            { 
              icon: <CheckCircle size={32} className="text-emerald-400" />, 
              title: "Mantenimiento", 
              desc: "Limpieza profunda y chequeo preventivo de eficiencia.",
              serviceValue: "Mantenimiento",
              theme: "from-emerald-500/20 to-teal-500/5"
            },
            { 
              icon: <Zap size={32} className="text-amber-400" />, 
              title: "Reparación", 
              desc: "Diagnóstico técnico y solución de fallas críticas.",
              serviceValue: "Reparacion",
              theme: "from-amber-500/20 to-orange-500/5"
            },
            { 
              icon: <Shield size={32} className="text-indigo-400" />, 
              title: "Carga de Gas", 
              desc: "Recarga de refrigerantes R410A y R22 con sellado.",
              serviceValue: "Carga de Gas",
              theme: "from-indigo-500/20 to-purple-500/5"
            },
          ].map((s, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative glass p-8 rounded-3xl border-white/5 overflow-hidden group hover:border-white/20 transition-all hover:-translate-y-2`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${s.theme} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
              <div className="relative z-10 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  {s.icon}
                </div>
                <h3 className="text-xl font-bold">{s.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
                <button 
                  onClick={() => navigate('/solicitud', { state: { selectedService: s.serviceValue } })}
                  className="mt-4 flex items-center gap-2 text-sky-400 font-bold text-sm tracking-widest hover:gap-3 transition-all"
                >
                  SOLICITAR <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
