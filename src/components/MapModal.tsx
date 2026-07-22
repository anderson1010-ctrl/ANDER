import React, { useState } from 'react';
import { LostPetReport } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Search, Navigation, AlertTriangle, Eye, Compass } from 'lucide-react';

interface MapModalProps {
  reports: LostPetReport[];
  onClose: () => void;
  onContactOwner: (report: LostPetReport) => void;
}

export default function MapModal({ reports, onClose, onContactOwner }: MapModalProps) {
  const [selectedReport, setSelectedReport] = useState<LostPetReport | null>(reports[0] || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [customSighting, setCustomSighting] = useState<{ x: number; y: number } | null>(null);
  const [isSightingSuccess, setIsSightingSuccess] = useState(false);

  // Pin locations aligned manually on the digital CDMX map image
  const pinCoordinates: Record<string, { top: string; left: string }> = {
    'lost-1': { top: '38%', left: '35%' }, // Colonia Roma
    'lost-2': { top: '22%', left: '15%' }, // Polanco
    'lost-3': { top: '55%', left: '50%' }, // Condesa
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Prevent clicking on the pins themselves from triggering a new sighting location
    if ((e.target as HTMLElement).closest('.map-pin-btn')) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setCustomSighting({ x, y });
    setIsSightingSuccess(false);
  };

  const handleReportSighting = () => {
    setIsSightingSuccess(true);
    setTimeout(() => {
      setCustomSighting(null);
      setIsSightingSuccess(false);
    }, 2500);
  };

  const filteredReports = reports.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.lastLocation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6 bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          className="bg-white rounded-none md:rounded-3xl overflow-hidden w-full max-w-5xl shadow-2xl flex flex-col md:flex-row h-full md:h-[85vh] relative"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/90 backdrop-blur text-gray-800 p-2.5 rounded-full hover:bg-gray-100 transition-colors z-20 shadow-md border border-gray-200"
            id="close-map-btn"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Panel: Search & Lost Pets alerts list */}
          <div className="w-full md:w-80 bg-gray-50 border-r border-gray-100 flex flex-col h-[40vh] md:h-full z-10">
            <div className="p-4 space-y-3 bg-white border-b border-gray-100">
              <h3 className="font-headline text-lg font-extrabold text-on-surface flex items-center gap-2">
                <Compass className="w-5 h-5 text-primary" />
                Mapa de Avistamientos
              </h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar alerta de mascota..."
                  className="w-full pl-9 pr-3 py-2 bg-gray-100 border-none rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary outline-none transition-all"
                  id="map-search-alerts"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Alertas Activas (Últimas 48h)</span>
              {filteredReports.map((report) => {
                const isSelected = selectedReport?.id === report.id;
                return (
                  <button
                    key={report.id}
                    onClick={() => {
                      setSelectedReport(report);
                      setCustomSighting(null);
                    }}
                    className={`w-full text-left p-3 rounded-2xl border transition-all duration-200 flex gap-3 ${
                      isSelected
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-gray-100 bg-white hover:border-gray-200 shadow-sm'
                    }`}
                    id={`alert-item-${report.id}`}
                  >
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                      <img src={report.image} alt={report.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <span className="font-headline font-bold text-xs text-on-surface truncate">{report.name}</span>
                        <span className="bg-red-50 text-red-600 px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase">Urgente</span>
                      </div>
                      <span className="text-[10px] text-gray-400 block truncate mt-0.5">{report.breed}</span>
                      <div className="flex items-center gap-1 text-[10px] text-on-surface-variant mt-1">
                        <MapPin className="w-3 h-3 text-urgent" />
                        <span className="truncate">{report.lastLocation}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Panel: Interactive Canvas Map */}
          <div className="flex-1 bg-gray-100 relative overflow-hidden h-[60vh] md:h-full">
            {/* Styled Map Image Background */}
            <div
              onClick={handleMapClick}
              className="w-full h-full bg-cover bg-center cursor-crosshair relative select-none"
              style={{
                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAMHp9lhrkY-pwXczXAiMomo5-JX-DNzqYyBjjt1lwu3wcwHH1mdTYbMABdhgXsjh46GixtmT5D8ZsEnYgtRA6KDeScV8KHviWeBcWycssdffbhhBRw8rkMW_cFXo06TWGaQldRUGeAdDWlphVh0olYO7hTQZvPNeHBd3jWnWsaEHxsomFDF3wgMXvxhQiuSvghNcLZy5FanFZY_z1no42kvis3NExtC5vF3NdPouKI0bMZwnYvvDuf')`,
              }}
              id="cdmx-interactive-canvas-map"
            >
              {/* Markers for Lost Pets */}
              {reports.map((report) => {
                const coords = pinCoordinates[report.id] || { top: '50%', left: '50%' };
                const isSelected = selectedReport?.id === report.id;

                return (
                  <div
                    key={report.id}
                    style={{ top: coords.top, left: coords.left }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedReport(report);
                        setCustomSighting(null);
                      }}
                      className={`map-pin-btn group flex flex-col items-center justify-center transition-transform active:scale-90 ${
                        isSelected ? 'scale-110' : 'hover:scale-105'
                      }`}
                      id={`map-marker-${report.id}`}
                    >
                      <div className="relative">
                        <MapPin
                          className={`w-10 h-10 drop-shadow-lg transition-colors ${
                            isSelected ? 'text-red-600 fill-red-100' : 'text-urgent-orange fill-white'
                          }`}
                        />
                        {/* Avatar/Thumbnail embedded in pin */}
                        <div className="absolute top-[6px] left-[10px] w-5 h-5 rounded-full overflow-hidden border border-white z-10 bg-white">
                          <img src={report.image} alt={report.name} className="w-full h-full object-cover" />
                        </div>
                      </div>
                      <span className="bg-white/90 backdrop-blur px-2 py-0.5 rounded-full text-[9px] font-bold shadow-sm border border-gray-100 text-on-surface">
                        {report.name}
                      </span>
                    </button>
                  </div>
                );
              })}

              {/* Custom click sighting locator pin */}
              {customSighting && (
                <div
                  style={{ top: `${customSighting.y}%`, left: `${customSighting.x}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-30"
                >
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center"
                  >
                    <div className="bg-primary text-white p-3.5 rounded-2xl shadow-xl border-2 border-white text-xs font-semibold flex flex-col items-center gap-2 max-w-[180px]">
                      {isSightingSuccess ? (
                        <span className="text-center">🎉 ¡Avistamiento Registrado!</span>
                      ) : (
                        <>
                          <span className="text-center font-bold text-[10px] leading-tight">¿Viste a alguna mascota aquí?</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReportSighting();
                            }}
                            className="bg-white text-primary px-3 py-1 rounded-full font-bold text-[10px] shadow-sm active:scale-95 transition-transform"
                            id="submit-sighting-btn"
                          >
                            Reportar Avistamiento
                          </button>
                        </>
                      )}
                    </div>
                    <div className="w-3 h-3 bg-primary rotate-45 -mt-1.5 shadow-md border-r border-b border-white"></div>
                  </motion.div>
                </div>
              )}
            </div>

            {/* Instruction tooltip */}
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-2 rounded-2xl shadow-md border border-gray-100 text-[10px] font-bold text-gray-500 max-w-[200px] pointer-events-none">
              💡 Haz clic en cualquier parte del mapa para reportar un avistamiento rápido.
            </div>

            {/* Bottom Sighting Info Card Overlay */}
            {selectedReport && !customSighting && (
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-3xl border border-gray-100 shadow-xl z-20 flex gap-4 animate-fade-in">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                  <img src={selectedReport.image} alt={selectedReport.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-headline font-bold text-base text-on-surface leading-tight">
                      {selectedReport.name}
                    </h4>
                    <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded text-[8px] font-extrabold uppercase">
                      Urgente
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant font-medium leading-relaxed truncate">
                    Última ubicación: <span className="font-bold text-primary">{selectedReport.lastLocation}</span> • Visto: <span className="font-bold">{selectedReport.lastSeenTime}</span>
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1 line-clamp-1 leading-relaxed">
                    {selectedReport.description}
                  </p>
                </div>
                <div className="shrink-0 flex items-center">
                  <button
                    onClick={() => onContactOwner(selectedReport)}
                    className="bg-[#F4A261] hover:bg-orange-500 text-white font-headline font-bold text-xs px-4 py-2.5 rounded-full shadow-md active:scale-95 transition-all flex items-center gap-1.5"
                    id="map-contact-owner-btn"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Contactar
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
