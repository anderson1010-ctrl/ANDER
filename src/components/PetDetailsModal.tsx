import { useState } from 'react';
import { Pet } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, MapPin, Shield, Check, Info, HeartHandshake, ArrowRight } from 'lucide-react';

interface PetDetailsModalProps {
  pet: Pet;
  onClose: () => void;
  isFavorited: boolean;
  onToggleFavorite: () => void;
  onAdoptRequested: (petId: string) => void;
}

export default function PetDetailsModal({
  pet,
  onClose,
  isFavorited,
  onToggleFavorite,
  onAdoptRequested,
}: PetDetailsModalProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1: Details, 2: Adoption Form Q1, 3: Adoption Form Q2, 4: Success
  const [reason, setReason] = useState('');
  const [hasOtherPets, setHasOtherPets] = useState<boolean | null>(null);
  const [phone, setPhone] = useState('');

  const handleNextStep = () => {
    if (step === 2 && !reason.trim()) return;
    if (step === 3 && hasOtherPets === null) return;
    setStep((prev) => (prev + 1) as any);
  };

  const handleFinalSubmit = () => {
    onAdoptRequested(pet.id);
    setStep(4);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="bg-white rounded-3xl overflow-hidden w-full max-w-2xl shadow-2xl relative max-h-[90vh] flex flex-col"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/80 backdrop-blur text-gray-800 p-2.5 rounded-full hover:bg-gray-100 transition-colors z-20 shadow-md border border-gray-100"
            id="close-details-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Body */}
          <div className="overflow-y-auto flex-1">
            {step === 1 && (
              <div>
                {/* Hero Image */}
                <div className="relative aspect-video md:aspect-[2/1] w-full bg-gray-100">
                  <img
                    className="w-full h-full object-cover"
                    src={pet.image}
                    alt={pet.name}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

                  {/* Favorite button */}
                  <button
                    onClick={onToggleFavorite}
                    className="absolute bottom-4 right-4 bg-white p-3 rounded-full shadow-lg text-red-500 hover:scale-110 active:scale-90 transition-transform"
                    id="favorite-toggle-modal-btn"
                  >
                    <Heart className={`w-6 h-6 ${isFavorited ? 'fill-current' : ''}`} />
                  </button>

                  {/* Status chip */}
                  <div className="absolute top-4 left-4">
                    <span
                      className={`px-4 py-1.5 text-xs uppercase font-extrabold tracking-wider rounded-full shadow-md ${
                        pet.status === 'Urgente'
                          ? 'bg-urgent text-white animate-pulse'
                          : pet.status === 'En Proceso'
                          ? 'bg-outline text-white'
                          : 'bg-primary text-white'
                      }`}
                    >
                      {pet.status}
                    </span>
                  </div>

                  {/* Title overlay */}
                  <div className="absolute bottom-4 left-4 text-white">
                    <h2 className="font-headline text-3xl font-extrabold tracking-tight drop-shadow-md">
                      {pet.name}
                    </h2>
                    <p className="text-white/90 text-sm font-semibold flex items-center gap-1 drop-shadow-sm">
                      <MapPin className="w-4 h-4 text-urgent-orange" /> {pet.location || 'PetRescue Shelter, CDMX'}
                    </p>
                  </div>
                </div>

                {/* Info and stats */}
                <div className="p-6 md:p-8 space-y-6">
                  {/* Grid attributes */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center">
                      <span className="text-xs text-on-surface-variant/60 font-bold uppercase tracking-wider block mb-1">Raza</span>
                      <span className="font-headline font-semibold text-on-surface text-sm block truncate">{pet.breed}</span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center">
                      <span className="text-xs text-on-surface-variant/60 font-bold uppercase tracking-wider block mb-1">Edad</span>
                      <span className="font-headline font-semibold text-on-surface text-sm block">{pet.age}</span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center">
                      <span className="text-xs text-on-surface-variant/60 font-bold uppercase tracking-wider block mb-1">Género</span>
                      <span className="font-headline font-semibold text-on-surface text-sm block">{pet.gender}</span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center">
                      <span className="text-xs text-on-surface-variant/60 font-bold uppercase tracking-wider block mb-1">Tamaño</span>
                      <span className="font-headline font-semibold text-on-surface text-sm block">{pet.size || 'Mediano'}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="font-headline text-lg font-bold text-on-surface mb-2">Sobre mí</h3>
                    <p className="text-on-surface-variant text-sm leading-relaxed">{pet.description}</p>
                  </div>

                  {/* Temperament tags */}
                  {pet.temperament && (
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Mi temperamento</h4>
                      <div className="flex flex-wrap gap-2">
                        {pet.temperament.map((tag) => (
                          <span key={tag} className="px-3.5 py-1.5 bg-primary/5 text-primary text-xs font-bold rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Health checks */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="flex items-center gap-3 bg-green-50/50 p-4 rounded-2xl border border-green-100/50 text-green-800">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700">
                        <Check className="w-5 h-5 font-bold" />
                      </div>
                      <div>
                        <span className="text-xs font-bold uppercase block tracking-wider">Vacunación</span>
                        <span className="text-sm font-semibold">{pet.vaccinated !== false ? 'Al día completo' : 'Esquema pendiente'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-teal-50/50 p-4 rounded-2xl border border-teal-100/50 text-teal-800">
                      <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700">
                        <Check className="w-5 h-5 font-bold" />
                      </div>
                      <div>
                        <span className="text-xs font-bold uppercase block tracking-wider">Esterilizado</span>
                        <span className="text-sm font-semibold">{pet.neutered !== false ? 'Sí, esterilizado' : 'Pendiente de agendar'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Call to action */}
                  <div className="pt-4 border-t border-gray-100">
                    {pet.status === 'Adoptado' ? (
                      <div className="w-full bg-gray-100 text-gray-500 py-4 rounded-full text-center font-bold">
                        🎉 ¡Ya tiene un hogar feliz!
                      </div>
                    ) : pet.status === 'En Proceso' ? (
                      <div className="w-full bg-amber-50 text-amber-700 border border-amber-100 p-4 rounded-2xl flex flex-col gap-2">
                        <p className="text-sm font-semibold text-center">⚠️ Esta adopción está en proceso de revisión por otra solicitud.</p>
                        <button
                          onClick={() => setStep(2)}
                          className="w-full bg-primary hover:bg-primary-container text-white py-3 rounded-full font-headline font-bold text-center active:scale-95 transition-transform"
                          id="adopt-alternative-btn"
                        >
                          Enviar Solicitud Alternativa
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setStep(2)}
                        className="w-full bg-primary hover:bg-primary-container text-white py-4 rounded-full font-headline font-bold text-base shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                        id="start-adopt-process-btn"
                      >
                        <HeartHandshake className="w-5 h-5" />
                        Adoptar a {pet.name}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Adoption Form - Reason */}
            {step === 2 && (
              <div className="p-6 md:p-8 space-y-6">
                <div className="flex items-center gap-2 text-primary font-headline font-bold text-sm">
                  <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">1</span>
                  <span>Proceso de Adopción Responsable</span>
                </div>

                <div className="space-y-2">
                  <h3 className="font-headline text-2xl font-extrabold text-on-surface">¿Por qué deseas adoptar a {pet.name}?</h3>
                  <p className="text-on-surface-variant text-sm">Cuéntanos sobre tu estilo de vida y cómo planeas integrar a {pet.name} a tu rutina diaria.</p>
                </div>

                <div className="flex flex-col gap-1">
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Describe detalladamente el espacio donde vivirá, tu experiencia con mascotas..."
                    rows={5}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-sm"
                    id="adopt-reason-input"
                  />
                  <span className="text-[11px] text-gray-400 text-right">{reason.length} caracteres</span>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 text-gray-500 font-headline font-semibold text-center hover:bg-gray-100 rounded-full active:scale-95 transition-all"
                    id="cancel-step-2"
                  >
                    Regresar
                  </button>
                  <button
                    onClick={handleNextStep}
                    disabled={!reason.trim()}
                    className="flex-1 bg-primary text-white hover:bg-primary-container disabled:opacity-50 disabled:pointer-events-none py-3 rounded-full font-headline font-bold shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
                    id="next-step-2"
                  >
                    Siguiente <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Adoption Form - Other pets & contact */}
            {step === 3 && (
              <div className="p-6 md:p-8 space-y-6">
                <div className="flex items-center gap-2 text-primary font-headline font-bold text-sm">
                  <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">2</span>
                  <span>Proceso de Adopción Responsable</span>
                </div>

                <div className="space-y-4">
                  <h3 className="font-headline text-2xl font-extrabold text-on-surface">Últimos detalles</h3>

                  {/* Other pets query */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-on-surface block">¿Tienes otras mascotas actualmente?</label>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setHasOtherPets(true)}
                        className={`flex-1 py-3 rounded-xl border text-sm font-semibold transition-all ${
                          hasOtherPets === true
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                        }`}
                        id="has-pets-yes-btn"
                      >
                        Sí, tengo mascotas
                      </button>
                      <button
                        type="button"
                        onClick={() => setHasOtherPets(false)}
                        className={`flex-1 py-3 rounded-xl border text-sm font-semibold transition-all ${
                          hasOtherPets === false
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                        }`}
                        id="has-pets-no-btn"
                      >
                        No tengo otras mascotas
                      </button>
                    </div>
                  </div>

                  {/* Phone number */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-on-surface block">Número de teléfono celular</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Ej: +52 55 1234 5678"
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-sm"
                      id="adopt-phone-input"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 py-3 text-gray-500 font-headline font-semibold text-center hover:bg-gray-100 rounded-full active:scale-95 transition-all"
                    id="back-to-step-2"
                  >
                    Regresar
                  </button>
                  <button
                    onClick={handleFinalSubmit}
                    disabled={hasOtherPets === null || !phone.trim()}
                    className="flex-1 bg-primary text-white hover:bg-primary-container disabled:opacity-50 disabled:pointer-events-none py-3 rounded-full font-headline font-bold shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
                    id="submit-adopt-btn"
                  >
                    Enviar Solicitud
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Success Screen */}
            {step === 4 && (
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                className="p-8 text-center space-y-6 flex flex-col items-center justify-center min-h-[300px]"
              >
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl shadow-lg border-4 border-white animate-bounce">
                  🎉
                </div>

                <div className="space-y-2">
                  <h3 className="font-headline text-3xl font-extrabold text-on-surface">¡Solicitud Enviada!</h3>
                  <p className="text-on-surface-variant text-sm max-w-sm mx-auto leading-relaxed">
                    Hemos recibido tu solicitud de adopción para <span className="font-bold text-primary">{pet.name}</span>. Un voluntario de PetRescue se pondrá en contacto contigo al <span className="font-bold text-gray-700">{phone}</span> en un plazo menor a 24 horas.
                  </p>
                </div>

                <div className="w-full max-w-xs">
                  <button
                    onClick={onClose}
                    className="w-full bg-primary hover:bg-primary-container text-white py-3.5 rounded-full font-headline font-bold transition-all active:scale-95 shadow-md"
                    id="finish-adoption-process"
                  >
                    Regresar al Feed
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
