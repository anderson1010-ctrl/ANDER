import { ViewType } from '../types';
import { Home, Heart, Compass, AlertCircle } from 'lucide-react';

interface BottomNavProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
}

export default function BottomNav({ currentView, setView }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full z-50 flex justify-around items-center px-4 pb-8 pt-2 bg-white/90 backdrop-blur-md border-t border-gray-100 shadow-[0px_-4px_12px_rgba(38,70,83,0.05)] rounded-t-2xl md:hidden">
      {/* Inicio */}
      <button
        onClick={() => setView('inicio')}
        className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 active:scale-90 ${
          currentView === 'inicio'
            ? 'text-primary font-bold'
            : 'text-on-surface-variant hover:text-primary'
        }`}
        id="btn-nav-inicio"
      >
        <Home className="w-5.5 h-5.5" />
        <span className="text-[10px] font-semibold font-sans mt-1">Inicio</span>
      </button>

      {/* Adoptar */}
      <button
        onClick={() => setView('adoptar')}
        className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 active:scale-90 ${
          currentView === 'adoptar'
            ? 'bg-secondary-container/20 text-secondary font-bold ring-1 ring-secondary-container/30'
            : 'text-on-surface-variant hover:text-primary'
        }`}
        id="btn-nav-adoptar"
      >
        <Heart className="w-5.5 h-5.5" />
        <span className="text-[10px] font-semibold font-sans mt-1">Adoptar</span>
      </button>

      {/* Perdidos */}
      <button
        onClick={() => setView('perdidos')}
        className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 active:scale-90 ${
          currentView === 'perdidos'
            ? 'bg-secondary-container/20 text-secondary font-bold ring-1 ring-secondary-container/30'
            : 'text-on-surface-variant hover:text-primary'
        }`}
        id="btn-nav-perdidos"
      >
        <Compass className="w-5.5 h-5.5" />
        <span className="text-[10px] font-semibold font-sans mt-1">Perdidos</span>
      </button>

      {/* Reportar */}
      <button
        onClick={() => setView('reportar')}
        className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 active:scale-90 ${
          currentView === 'reportar'
            ? 'bg-secondary-container/20 text-secondary font-bold ring-1 ring-secondary-container/30'
            : 'text-on-surface-variant hover:text-primary'
        }`}
        id="btn-nav-reportar"
      >
        <AlertCircle className="w-5.5 h-5.5" />
        <span className="text-[10px] font-semibold font-sans mt-1">Reportar</span>
      </button>
    </nav>
  );
}
