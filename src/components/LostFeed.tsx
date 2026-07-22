import { useState } from 'react';
import { LostPetReport } from '../types';
import { MapPin, Clock, Phone, AlertTriangle, Compass, MessageSquare, Info, Star } from 'lucide-react';

type LostFilter = 'cerca' | 'recientes' | 'favoritos';

interface LostFeedProps {
  reports: LostPetReport[];
  onContactOwner: (report: LostPetReport) => void;
  onOpenMap: () => void;
  onGoToReport: () => void;
  favoritedReportIds: string[];
  onToggleFavoriteReport: (reportId: string) => void;
}

export default function LostFeed({
  reports,
  onContactOwner,
  onOpenMap,
  onGoToReport,
  favoritedReportIds,
  onToggleFavoriteReport,
}: LostFeedProps) {
  const [activeFilter, setActiveFilter] = useState<LostFilter>('cerca');

  // "Cerca de mí" shows every active report (all reports already carry a CDMX location),
  // "Recientes" re-sorts newest-first, and "Favoritos" narrows the list to starred reports.
  const visibleReports =
    activeFilter === 'favoritos'
      ? reports.filter((r) => favoritedReportIds.includes(r.id))
      : reports;

  return (
    <div className="space-y-8 pb-10">
      {/* Intro banner */}
      <section className="space-y-1">
        <h1 className="font-headline text-3xl font-extrabold text-on-surface">
          Mascotas Perdidas Cercanas
        </h1>
        <p className="text-sm text-on-surface-variant font-medium leading-relaxed">
          Ayúdanos a traerlos de vuelta a casa. Estos reportes son de las últimas 48 horas.
        </p>

        {/* Filters bar */}
        <div className="pt-3 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setActiveFilter('cerca')}
            className={`flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-headline font-bold shrink-0 transition-all border ${
              activeFilter === 'cerca'
                ? 'bg-secondary-container/20 text-on-secondary-container border-secondary-container/30'
                : 'bg-white text-on-surface-variant hover:bg-gray-50 border-gray-100'
            }`}
            id="filter-cerca-btn"
          >
            <Compass className="w-4 h-4 text-[#8e4e14]" />
            Cerca de mí
          </button>
          <button
            onClick={() => setActiveFilter('recientes')}
            className={`flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-headline font-bold shrink-0 transition-all border ${
              activeFilter === 'recientes'
                ? 'bg-secondary-container/20 text-on-secondary-container border-secondary-container/30'
                : 'bg-white text-on-surface-variant hover:bg-gray-50 border-gray-100'
            }`}
            id="filter-recientes-btn"
          >
            ⚡ Recientes
          </button>
          <button
            onClick={() => setActiveFilter('favoritos')}
            className={`flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-headline font-bold shrink-0 transition-all border ${
              activeFilter === 'favoritos'
                ? 'bg-secondary-container/20 text-on-secondary-container border-secondary-container/30'
                : 'bg-white text-on-surface-variant hover:bg-gray-50 border-gray-100'
            }`}
            id="filter-favoritos-btn"
          >
            <Star className="w-4 h-4 text-red-500" />
            Favoritos {favoritedReportIds.length > 0 && `(${favoritedReportIds.length})`}
          </button>
        </div>
      </section>

      {/* Empty state for the favorites filter */}
      {activeFilter === 'favoritos' && visibleReports.length === 0 && (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mx-auto">
            <Star className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="font-headline text-lg font-bold text-on-surface">Aún no tienes favoritos</h3>
            <p className="text-sm text-on-surface-variant max-w-xs mx-auto">
              Toca la estrella en cualquier reporte para guardarlo aquí y darle seguimiento fácilmente.
            </p>
          </div>
        </div>
      )}

      {/* Grid of Lost Pets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleReports.map((report) => (
          <div
            key={report.id}
            className="border-2 border-[#F4A261] bg-white rounded-3xl shadow-[0px_4px_12px_rgba(38,70,83,0.05)] overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-[0px_8px_20px_rgba(38,70,83,0.1)] relative"
            id={`lost-card-${report.id}`}
          >
            {/* Image Aspect Box */}
            <div className="relative aspect-square overflow-hidden bg-gray-50">
              <img
                src={report.image}
                alt={report.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* URGENTE Orange Alert Badge */}
              <div className="absolute top-3 left-3 bg-[#F4A261] text-white px-3.5 py-1.5 rounded-xl text-[10px] font-bold flex items-center gap-1 shadow-md">
                <AlertTriangle className="w-3.5 h-3.5 fill-current" />
                URGENTE
              </div>

              {/* Favorites pin indicator button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavoriteReport(report.id);
                }}
                className="absolute top-3 right-3 bg-white/80 backdrop-blur text-red-500 p-2.5 rounded-full shadow-sm hover:scale-110 active:scale-90 transition-transform"
                title={favoritedReportIds.includes(report.id) ? 'Quitar de favoritos' : 'Guardar en favoritos'}
                id={`fav-report-btn-${report.id}`}
              >
                <Star
                  className={`w-4 h-4 text-red-500 ${favoritedReportIds.includes(report.id) ? 'fill-current' : ''}`}
                />
              </button>
            </div>

            {/* Profile specifications */}
            <div className="p-5 flex flex-col gap-4 flex-1">
              <div className="flex justify-between items-start gap-1">
                <div>
                  <h3 className="font-headline text-xl font-bold text-on-surface leading-tight">
                    {report.name}
                  </h3>
                  <span className="text-xs text-gray-400 font-medium">{report.breed}</span>
                </div>
                <span className="bg-gray-100 text-on-surface-variant font-sans font-bold text-[9px] uppercase px-2.5 py-1 rounded-full">
                  {report.reportedAt}
                </span>
              </div>

              {/* Description body snippet */}
              <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2">
                {report.description}
              </p>

              {/* Last seen time and location rows */}
              <div className="space-y-1.5 border-t border-gray-50 pt-3">
                <div className="flex items-center gap-2 text-on-surface-variant text-xs">
                  <MapPin className="w-4 h-4 text-[#F4A261] shrink-0" />
                  <span className="truncate font-medium">{report.lastLocation}</span>
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant text-xs">
                  <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="truncate font-medium">Visto: {report.lastSeenTime}</span>
                </div>
              </div>

              {/* CTA button */}
              <div className="mt-auto pt-2">
                <button
                  onClick={() => onContactOwner(report)}
                  className="w-full bg-[#F4A261] hover:bg-orange-500 text-white py-3 rounded-full font-headline font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md"
                  id={`contact-owner-btn-${report.id}`}
                >
                  <MessageSquare className="w-4 h-4" />
                  Contactar Dueño
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Map Interactive Banner Segment */}
      <section className="bg-primary text-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 shadow-xl relative overflow-hidden">
        {/* Abstract design vector bubble */}
        <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-[#008376]/40 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex-1 space-y-4 relative z-10">
          <div className="space-y-1">
            <h2 className="font-headline text-2xl font-extrabold tracking-tight">¿Viste a alguno?</h2>
            <p className="text-white/95 text-sm leading-relaxed max-w-lg">
              Usa nuestro mapa interactivo en tiempo real para reportar avistamientos o ver la última zona de búsqueda establecida por los dueños.
            </p>
          </div>
          <button
            onClick={onOpenMap}
            className="bg-white hover:bg-gray-50 text-primary px-6 py-3 rounded-full font-headline font-bold text-sm shadow-md active:scale-95 transition-transform"
            id="open-map-view-cta"
          >
            Ver Mapa de Avistamientos
          </button>
        </div>

        {/* Small inline preview map with rounded corners */}
        <div className="w-full md:w-1/3 aspect-video bg-white/10 rounded-2xl overflow-hidden shadow-inner border border-white/20 select-none cursor-pointer group" onClick={onOpenMap}>
          <div
            className="w-full h-full bg-cover bg-center opacity-85 group-hover:scale-105 transition-transform duration-500"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAMHp9lhrkY-pwXczXAiMomo5-JX-DNzqYyBjjt1lwu3wcwHH1mdTYbMABdhgXsjh46GixtmT5D8ZsEnYgtRA6KDeScV8KHviWeBcWycssdffbhhBRw8rkMW_cFXo06TWGaQldRUGeAdDWlphVh0olYO7hTQZvPNeHBd3jWnWsaEHxsomFDF3wgMXvxhQiuSvghNcLZy5FanFZY_z1no42kvis3NExtC5vF3NdPouKI0bMZwnYvvDuf')`,
            }}
          ></div>
        </div>
      </section>

      {/* Mobile Floating Action Button for quick reporting */}
      <button
        onClick={onGoToReport}
        className="fixed bottom-28 right-5 bg-[#F4A261] hover:bg-orange-500 text-white h-14 px-6 rounded-full shadow-lg flex items-center gap-2 font-headline font-bold z-40 active:scale-90 transition-transform md:hidden"
        id="quick-report-fab"
      >
        <AlertTriangle className="w-5 h-5" />
        Reportar Extravío
      </button>
    </div>
  );
}
