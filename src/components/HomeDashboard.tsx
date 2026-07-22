import { Pet, LostPetReport, ViewType } from '../types';
import { Heart, HelpCircle, Map, PawPrint, Megaphone, CheckCircle, Shield, Award } from 'lucide-react';

interface HomeDashboardProps {
  pets: Pet[];
  reports: LostPetReport[];
  setView: (view: ViewType) => void;
  onSelectPet: (pet: Pet) => void;
  onSelectReport: (report: LostPetReport) => void;
}

export default function HomeDashboard({ pets, reports, setView, onSelectPet, onSelectReport }: HomeDashboardProps) {
  // Take 2 featured pets
  const featuredPets = pets.slice(0, 3);
  // Take 2 featured reports
  const recentReports = reports.slice(0, 2);

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Welcome banner */}
      <section className="bg-gradient-to-br from-primary to-primary-container text-white rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-xl">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
        <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-white/5 rounded-full blur-lg pointer-events-none"></div>

        <div className="space-y-4 relative z-10 max-w-lg">
          <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white/95">
            🐾 Salvando vidas juntos
          </span>
          <div className="space-y-2">
            <h1 className="font-headline text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
              Encuentra, adopta y reporta mascotas
            </h1>
            <p className="text-white/90 text-sm leading-relaxed font-medium">
              PetRescue es la red de apoyo mutuo para encontrar compañeros ideales y reportar mascotas extraviadas en tu colonia.
            </p>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setView('adoptar')}
              className="bg-white hover:bg-gray-50 text-primary px-5 py-2.5 rounded-full font-headline font-bold text-xs shadow-md active:scale-95 transition-transform"
              id="hero-adopt-btn"
            >
              Adoptar Mascota
            </button>
            <button
              onClick={() => setView('reportar')}
              className="bg-transparent hover:bg-white/10 text-white border border-white/30 px-5 py-2.5 rounded-full font-headline font-bold text-xs active:scale-95 transition-transform"
              id="hero-report-btn"
            >
              Reportar Extravío
            </button>
          </div>
        </div>
      </section>

      {/* Impact Numbers */}
      <section className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
          <span className="font-headline font-extrabold text-2xl text-primary block">142</span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/60">Adoptados</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
          <span className="font-headline font-extrabold text-2xl text-[#8e4e14] block">89</span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/60">Encontrados</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
          <span className="font-headline font-extrabold text-2xl text-urgent-orange block">12</span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/60">Refugios</span>
        </div>
      </section>

      {/* Core Services Menu */}
      <section className="space-y-3">
        <h2 className="font-headline text-lg font-extrabold text-on-surface">¿Cómo deseas ayudar hoy?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setView('adoptar')}
            className="flex items-center gap-4 p-4 bg-white hover:bg-primary/5 rounded-2xl border border-gray-100 hover:border-primary/20 shadow-sm transition-all duration-300 text-left active:scale-[0.98]"
            id="quick-card-adopt"
          >
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
              <Heart className="w-6 h-6 fill-current" />
            </div>
            <div>
              <h3 className="font-headline font-bold text-sm text-on-surface">Adoptar un Compañero</h3>
              <p className="text-[11px] text-gray-400 mt-0.5">Dale un hogar feliz a un cachorro o gato refugiado.</p>
            </div>
          </button>

          <button
            onClick={() => setView('reportar')}
            className="flex items-center gap-4 p-4 bg-white hover:bg-orange-50 rounded-2xl border border-gray-100 hover:border-orange-200 shadow-sm transition-all duration-300 text-left active:scale-[0.98]"
            id="quick-card-report"
          >
            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center shrink-0">
              <Megaphone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-headline font-bold text-sm text-on-surface">Reportar una Mascota</h3>
              <p className="text-[11px] text-gray-400 mt-0.5">Crea una alerta de extravío con foto y última ubicación.</p>
            </div>
          </button>

          <button
            onClick={() => setView('perdidos')}
            className="flex items-center gap-4 p-4 bg-white hover:bg-blue-50 rounded-2xl border border-gray-100 hover:border-blue-200 shadow-sm transition-all duration-300 text-left active:scale-[0.98]"
            id="quick-card-map"
          >
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
              <Map className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-headline font-bold text-sm text-on-surface">Mapa de Alertas</h3>
              <p className="text-[11px] text-gray-400 mt-0.5">Explora avistamientos rápidos en tiempo real.</p>
            </div>
          </button>
        </div>
      </section>

      {/* Featured Adoptable Pets */}
      <section className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="font-headline text-lg font-extrabold text-on-surface">Mascotas en Adopción</h2>
          <button onClick={() => setView('adoptar')} className="text-primary text-xs font-bold hover:underline">
            Ver todas →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {featuredPets.map((pet) => (
            <div
              key={pet.id}
              onClick={() => onSelectPet(pet)}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group flex flex-col"
              id={`featured-pet-${pet.id}`}
            >
              <div className="relative aspect-video bg-gray-50 overflow-hidden">
                <img src={pet.image} alt={pet.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-primary/90 text-white text-[8px] font-bold rounded">
                  {pet.status}
                </span>
              </div>
              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-headline font-bold text-sm text-on-surface">{pet.name}</h4>
                  <p className="text-[10px] text-gray-400 font-medium">{pet.breed} • {pet.age}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Lost Reports */}
      <section className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="font-headline text-lg font-extrabold text-on-surface">Reportes Recientes</h2>
          <button onClick={() => setView('perdidos')} className="text-primary text-xs font-bold hover:underline">
            Ver todos →
          </button>
        </div>

        <div className="space-y-3">
          {recentReports.map((report) => (
            <div
              key={report.id}
              onClick={() => onSelectReport(report)}
              className="bg-white p-4 rounded-2xl border border-red-100 hover:border-red-200 shadow-sm transition-all duration-200 flex gap-4 cursor-pointer relative"
              id={`recent-report-${report.id}`}
            >
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                <img src={report.image} alt={report.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h4 className="font-headline font-bold text-sm text-on-surface">{report.name}</h4>
                  <span className="bg-red-50 text-red-600 px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase">
                    Urgente
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5">{report.breed}</p>
                <div className="flex items-center gap-1.5 text-[10px] text-on-surface-variant mt-2 font-medium">
                  <span className="text-[#F4A261]">📍</span>
                  <span className="truncate">{report.lastLocation}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tips / Informative Banner */}
      <section className="bg-gray-50 border border-gray-100 p-5 rounded-2xl flex gap-4 items-start">
        <div className="p-2.5 bg-[#F4A261]/10 rounded-xl text-[#8e4e14] shrink-0">
          <Award className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="font-headline font-bold text-sm text-on-surface">¿Cómo proceder si encuentras un extraviado?</h3>
          <p className="text-[11px] text-on-surface-variant leading-relaxed">
            Acércate con suavidad, ofrécele agua limpia y alimento. Toma una foto clara y publícala inmediatamente en la pestaña <span className="font-bold text-primary">Reportar</span>. ¡La comunidad te ayudará a localizar al dueño!
          </p>
        </div>
      </section>
    </div>
  );
}
