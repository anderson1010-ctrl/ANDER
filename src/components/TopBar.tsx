import { PetCategory, ViewType } from '../types';
import { PawPrint, Bell, Search, Menu } from 'lucide-react';

interface TopBarProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
  favoritesCount: number;
}

export default function TopBar({ currentView, setView, favoritesCount }: TopBarProps) {
  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm flex items-center justify-between px-5 h-16 w-full sticky top-0 z-50">
      {/* Brand Logo & Name */}
      <button 
        onClick={() => setView('inicio')} 
        className="flex items-center gap-2 group transition-transform duration-200 active:scale-95"
        id="logo-brand-btn"
      >
        <div className="flex items-center justify-center bg-primary/10 p-2 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
          <PawPrint className="w-6 h-6 fill-current" />
        </div>
        <span className="font-headline text-2xl font-bold tracking-tight text-primary">
          Pet<span className="text-urgent-orange">Rescue</span>
        </span>
      </button>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-6">
        <button
          onClick={() => setView('inicio')}
          className={`font-headline font-semibold text-sm transition-colors duration-200 ${
            currentView === 'inicio' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
          }`}
          id="nav-inicio-btn"
        >
          Inicio
        </button>
        <button
          onClick={() => setView('adoptar')}
          className={`font-headline font-semibold text-sm transition-colors duration-200 ${
            currentView === 'adoptar' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
          }`}
          id="nav-adoptar-btn"
        >
          Adoptar
        </button>
        <button
          onClick={() => setView('perdidos')}
          className={`font-headline font-semibold text-sm transition-colors duration-200 ${
            currentView === 'perdidos' ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
          }`}
          id="nav-perdidos-btn"
        >
          Perdidos
        </button>
        <button
          onClick={() => setView('reportar')}
          className={`px-5 py-2 rounded-full font-headline font-semibold text-sm transition-all duration-300 ${
            currentView === 'reportar'
              ? 'bg-primary text-white shadow-md'
              : 'bg-primary-container/10 text-primary hover:bg-primary hover:text-white'
          }`}
          id="nav-reportar-btn"
        >
          Reportar Extravío
        </button>
      </nav>

      {/* Right Side Buttons */}
      <div className="flex items-center gap-3">
        {favoritesCount > 0 && (
          <button 
            onClick={() => setView('adoptar')} 
            className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
            title="Mis Favoritos"
            id="fav-header-btn"
          >
            <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
              {favoritesCount}
            </span>
            <span className="text-red-500 font-bold text-xs">♥</span>
          </button>
        )}

        <button 
          className="relative p-2 rounded-full text-on-surface-variant hover:bg-gray-100 hover:text-primary transition-all active:scale-95 duration-200"
          id="notifications-btn"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-urgent-orange rounded-full ring-2 ring-white"></span>
        </button>

        <button 
          onClick={() => setView('onboarding')}
          className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant hover:ring-2 hover:ring-primary/40 transition-all duration-200 active:scale-90"
          title="Ver Onboarding"
          id="user-profile-btn"
        >
          <img 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGxtnF8_l_m4z3df-J-hvL4j-oGPdKQ0of7Pxef8efL8KlwoPXu5DRohpClHK9tGMkSirzJDDCF-6ek66p0N9NuRf-XaRrNk5ca0Gma7HAO3GSpjn3IEfRO9V_gDvI_8FtCrjiIYmds5VAWn4g2tSpvgRbqko70rmMp5GdF0ySUL-MV4g8JGs1QnVItzlcenKsa-nVr6ZDmznVXyupuxEmr22BKttsFSaOnJRqJyw7Ht09EbF96dTz" 
            alt="Volunteer Avatar" 
          />
        </button>
      </div>
    </header>
  );
}
