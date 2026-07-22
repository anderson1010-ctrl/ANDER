import { useState, useEffect } from 'react';
import { Pet, LostPetReport, ViewType } from './types';
import { INITIAL_ADOPTION_PETS, INITIAL_LOST_REPORTS } from './data';
import {
  fetchAdoptionPets,
  fetchLostReports,
  updatePetStatus,
  createLostReport,
} from './api';
import TopBar from './components/TopBar';
import BottomNav from './components/BottomNav';
import Onboarding from './components/Onboarding';
import HomeDashboard from './components/HomeDashboard';
import AdoptFeed from './components/AdoptFeed';
import LostFeed from './components/LostFeed';
import ReportForm from './components/ReportForm';
import PetDetailsModal from './components/PetDetailsModal';
import ContactModal from './components/ContactModal';
import MapModal from './components/MapModal';
import { PawPrint, Star, MessageCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [view, setView] = useState<ViewType>('onboarding');

  // Persistence backed state
  const [adoptionPets, setAdoptionPets] = useState<Pet[]>([]);
  const [lostReports, setLostReports] = useState<LostPetReport[]>([]);
  const [favoritedIds, setFavoritedIds] = useState<string[]>([]);
  const [favoritedReportIds, setFavoritedReportIds] = useState<string[]>([]);

  // Selection & modal overlays
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [contactReport, setContactReport] = useState<LostPetReport | null>(null);
  const [isMapOpen, setIsMapOpen] = useState(false);

  // Initialize data from API, falling back to localStorage or static data when necessary
  useEffect(() => {
    const cachedPets = localStorage.getItem('petrescue_adoption_pets');
    const cachedReports = localStorage.getItem('petrescue_lost_reports');
    const cachedFavs = localStorage.getItem('petrescue_favorited_ids');
    const cachedFavReports = localStorage.getItem('petrescue_favorited_report_ids');
    const cachedOnboarded = localStorage.getItem('petrescue_onboarded');

    if (cachedFavs) {
      setFavoritedIds(JSON.parse(cachedFavs));
    }

    if (cachedFavReports) {
      setFavoritedReportIds(JSON.parse(cachedFavReports));
    }

    if (cachedOnboarded === 'true') {
      setView('inicio');
    }

    async function loadData() {
      try {
        const [pets, reports] = await Promise.all([fetchAdoptionPets(), fetchLostReports()]);
        setAdoptionPets(pets);
        setLostReports(reports);
        localStorage.setItem('petrescue_adoption_pets', JSON.stringify(pets));
        localStorage.setItem('petrescue_lost_reports', JSON.stringify(reports));
      } catch (error) {
        console.error('API fetch failed, loading fallback data', error);

        if (cachedPets) {
          setAdoptionPets(JSON.parse(cachedPets));
        } else {
          setAdoptionPets(INITIAL_ADOPTION_PETS);
          localStorage.setItem('petrescue_adoption_pets', JSON.stringify(INITIAL_ADOPTION_PETS));
        }

        if (cachedReports) {
          setLostReports(JSON.parse(cachedReports));
        } else {
          setLostReports(INITIAL_LOST_REPORTS);
          localStorage.setItem('petrescue_lost_reports', JSON.stringify(INITIAL_LOST_REPORTS));
        }
      }
    }

    loadData();
  }, []);

  // Save changes to localStorage
  const savePets = (newPets: Pet[]) => {
    setAdoptionPets(newPets);
    localStorage.setItem('petrescue_adoption_pets', JSON.stringify(newPets));
  };

  const saveReports = (newReports: LostPetReport[]) => {
    setLostReports(newReports);
    localStorage.setItem('petrescue_lost_reports', JSON.stringify(newReports));
  };

  const handleToggleFavorite = (petId: string) => {
    const updated = favoritedIds.includes(petId)
      ? favoritedIds.filter((id) => id !== petId)
      : [...favoritedIds, petId];
    setFavoritedIds(updated);
    localStorage.setItem('petrescue_favorited_ids', JSON.stringify(updated));
  };

  const handleToggleFavoriteReport = (reportId: string) => {
    const updated = favoritedReportIds.includes(reportId)
      ? favoritedReportIds.filter((id) => id !== reportId)
      : [...favoritedReportIds, reportId];
    setFavoritedReportIds(updated);
    localStorage.setItem('petrescue_favorited_report_ids', JSON.stringify(updated));
  };

  const handleAddReport = async (newReportData: Omit<LostPetReport, 'id' | 'reportedAt'>) => {
    try {
      const createdReport = await createLostReport(newReportData);
      const updated = [createdReport, ...lostReports];
      saveReports(updated);
    } catch (error) {
      console.error('Failed to create lost report:', error);
      const fallbackReport: LostPetReport = {
        ...newReportData,
        id: `report-${Date.now()}`,
        reportedAt: 'Ahora mismo',
      };
      const updated = [fallbackReport, ...lostReports];
      saveReports(updated);
    }
  };

  const handleAdoptRequested = async (petId: string) => {
    try {
      const updatedPet = await updatePetStatus(petId, 'En Proceso');
      const updated = adoptionPets.map((pet) =>
        pet.id === petId ? updatedPet : pet
      );
      savePets(updated);

      if (selectedPet && selectedPet.id === petId) {
        setSelectedPet(updatedPet);
      }
    } catch (error) {
      console.error('Failed to update pet status:', error);
      const updated = adoptionPets.map((pet) =>
        pet.id === petId ? { ...pet, status: 'En Proceso' as const } : pet
      );
      savePets(updated);
      if (selectedPet && selectedPet.id === petId) {
        setSelectedPet((prev) => prev ? { ...prev, status: 'En Proceso' as const } : null);
      }
    }
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem('petrescue_onboarded', 'true');
    setView('inicio');
  };

  const handleResetApp = () => {
    localStorage.removeItem('petrescue_onboarded');
    localStorage.removeItem('petrescue_adoption_pets');
    localStorage.removeItem('petrescue_lost_reports');
    localStorage.removeItem('petrescue_favorited_ids');
    localStorage.removeItem('petrescue_favorited_report_ids');
    setAdoptionPets(INITIAL_ADOPTION_PETS);
    setLostReports(INITIAL_LOST_REPORTS);
    setFavoritedIds([]);
    setFavoritedReportIds([]);
    setView('onboarding');
  };

  // Render subviews dynamically
  const renderContent = () => {
    switch (view) {
      case 'inicio':
        return (
          <HomeDashboard
            pets={adoptionPets}
            reports={lostReports}
            setView={setView}
            onSelectPet={(pet) => setSelectedPet(pet)}
            onSelectReport={(report) => setContactReport(report)}
          />
        );
      case 'adoptar':
        return (
          <AdoptFeed
            pets={adoptionPets}
            onSelectPet={(pet) => setSelectedPet(pet)}
            favoritedIds={favoritedIds}
            onToggleFavorite={handleToggleFavorite}
          />
        );
      case 'perdidos':
        return (
          <LostFeed
            reports={lostReports}
            onContactOwner={(report) => setContactReport(report)}
            onOpenMap={() => setIsMapOpen(true)}
            onGoToReport={() => setView('reportar')}
            favoritedReportIds={favoritedReportIds}
            onToggleFavoriteReport={handleToggleFavoriteReport}
          />
        );
      case 'reportar':
        return (
          <ReportForm
            onAddReport={handleAddReport}
            onSuccessRedirect={() => setView('perdidos')}
          />
        );
      default:
        return (
          <HomeDashboard
            pets={adoptionPets}
            reports={lostReports}
            setView={setView}
            onSelectPet={(pet) => setSelectedPet(pet)}
            onSelectReport={(report) => setContactReport(report)}
          />
        );
    }
  };

  if (view === 'onboarding') {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col antialiased selection:bg-primary selection:text-white">
      {/* Top Header navbar */}
      <TopBar
        currentView={view}
        setView={setView}
        favoritesCount={favoritedIds.length}
      />

      {/* Main layout container with animations */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 pt-6 pb-28 md:pb-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom navbar for mobile viewport devices */}
      <BottomNav currentView={view} setView={setView} />

      {/* Persistent floating developer utility button to clear/reset the state */}
      <button
        onClick={handleResetApp}
        className="fixed bottom-24 right-5 md:bottom-6 md:right-6 bg-white hover:bg-gray-100 text-gray-500 hover:text-primary p-3 rounded-full shadow-lg border border-gray-200 z-40 transition-transform active:rotate-185 duration-500"
        title="Resetear demo"
        id="dev-reset-app-btn"
      >
        <RefreshCw className="w-4.5 h-4.5" />
      </button>

      {/* Overlays / Modal Views */}
      {selectedPet && (
        <PetDetailsModal
          pet={selectedPet}
          onClose={() => setSelectedPet(null)}
          isFavorited={favoritedIds.includes(selectedPet.id)}
          onToggleFavorite={() => handleToggleFavorite(selectedPet.id)}
          onAdoptRequested={handleAdoptRequested}
        />
      )}

      {contactReport && (
        <ContactModal
          report={contactReport}
          onClose={() => setContactReport(null)}
        />
      )}

      {isMapOpen && (
        <MapModal
          reports={lostReports}
          onClose={() => setIsMapOpen(false)}
          onContactOwner={(report) => {
            setIsMapOpen(false);
            setContactReport(report);
          }}
        />
      )}
    </div>
  );
}
