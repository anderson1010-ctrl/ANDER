import React, { useState, useRef } from 'react';
import { LostPetReport } from '../types';
import { Camera, MapPin, Send, Trash2, CheckCircle2, Navigation } from 'lucide-react';

interface ReportFormProps {
  onAddReport: (newReport: Omit<LostPetReport, 'id' | 'reportedAt'>) => void;
  onSuccessRedirect: () => void;
}

export default function ReportForm({ onAddReport, onSuccessRedirect }: ReportFormProps) {
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [description, setDescription] = useState('');
  const [lastLocation, setLastLocation] = useState('');
  const [lastSeenTime, setLastSeenTime] = useState('');
  const [ownerName, setOwnerName] = useState('Juan Pérez');
  const [contactNumber, setContactNumber] = useState('');

  // Image upload simulation
  const [imageFiles, setImageFiles] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // CDMX Map coordinates
  const [isMapPinned, setIsMapPinned] = useState(false);
  const [pinnedLocationName, setPinnedLocationName] = useState('Colonia Roma Norte, CDMX');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    // Convert to base64 data URLs (instead of blob: URLs) so previews survive
    // being saved to localStorage and remain valid after a page reload.
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setImageFiles((prev) => [...prev, reader.result as string].slice(0, 5));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePinCurrentLocation = () => {
    setIsMapPinned(true);
    const mockCDMXLocations = [
      'Av. Álvaro Obregón, Colonia Roma, CDMX',
      'Parque España, Condesa, CDMX',
      'Paseo de la Reforma, Juárez, CDMX',
      'Parque Lincoln, Polanco, CDMX',
      'Plaza de la Constitución, Centro Histórico, CDMX',
    ];
    const randomLoc = mockCDMXLocations[Math.floor(Math.random() * mockCDMXLocations.length)];
    setPinnedLocationName(randomLoc);
    setLastLocation(randomLoc);
    if (!lastSeenTime) setLastSeenTime('Hace unos momentos');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !breed || !description || !contactNumber) return;

    // Default placeholder images if they did not upload any
    const defaultImage = breed.toLowerCase().includes('gato') || breed.toLowerCase().includes('siames') || breed.toLowerCase().includes('persa')
      ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuDPgErH9PrVDUp6HC-vEtmRREWyE4pi4w5ebMSEgqn4wGIuRMTwtToM-eqbTDRJJqm1RoKRLKyT8oIiLfcK2luC9Iq-uB1R6CDGzQzlY_za757Y4KAsJ37__OlSJ0D46xS-DSGa5za6oBPWax-O4ZD-HCFyhfLvaYWwBiFSwVH-MPDPefpMAZPJk7_Dp995dSEzZQ5VKenBSTLlSo8nzemNq6U6myUFV4u990Cgtdj2Rj02cEUhuQmz'
      : 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNhUD5st_mw-hyyCv0umr5p76HEwiyCKtjKfiQTpHQy3MchN2CNoPemUD5UCe0AfSjL-fPlswBWmJHEMEK6jP1n-_aYkajls8rIqcRHUoRhY1n0v1Do7ci2hqueM1jy99ZAxObyQAxHRkWlkW4A9UZg6s4d9UgYCjaFKEA8YNI_1FhMD8dvcaIKH8ZjV51Q9erPadpLu2LOEAdknrQF_UNBtRYsDNsh9z6yJuPCYfx0igwGspDtQqR';

    onAddReport({
      name,
      breed,
      description,
      image: imageFiles[0] || defaultImage,
      lastLocation: lastLocation || pinnedLocationName,
      lastSeenTime: lastSeenTime || 'Hoy recientemente',
      contactNumber,
      isUrgent: true,
      ownerName: ownerName || 'FurryFriend Volunteer',
    });

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onSuccessRedirect();
    }, 2500);
  };

  if (isSubmitted) {
    return (
      <div className="max-w-xl mx-auto py-20 px-6 text-center space-y-6 flex flex-col items-center justify-center min-h-[70vh]">
        <CheckCircle2 className="w-24 h-24 text-green-500 animate-bounce" />
        <div className="space-y-2">
          <h2 className="font-headline text-3xl font-extrabold text-on-surface">¡Reporte Creado con Éxito!</h2>
          <p className="text-on-surface-variant text-base leading-relaxed max-w-sm mx-auto">
            Muchas gracias por publicar la alerta de <span className="font-bold text-primary">{name}</span>. Hemos agregado tu reporte a la base de datos local y se mostrará al inicio del feed.
          </p>
        </div>
        <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Cargando Perdidos Feed...</span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 md:px-6">
      <section className="mb-6 space-y-1">
        <h2 className="font-headline text-3xl font-extrabold text-on-surface">Nuevo Reporte</h2>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          Completa la información para ayudar a otros a identificar a tu mascota.
        </p>
      </section>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image upload widget */}
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`group relative bg-white border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all duration-300 cursor-pointer ${
            dragActive
              ? 'border-primary bg-primary/5'
              : 'border-outline-variant hover:border-primary hover:bg-gray-50/50'
          }`}
          id="upload-image-container"
        >
          <input
            ref={fileInputRef}
            onChange={handleFileInput}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            id="file-upload-input"
          />

          <div className="w-16 h-16 bg-primary-container/10 text-primary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            <Camera className="w-8 h-8" />
          </div>

          <p className="font-headline font-bold text-sm text-on-surface mb-1">
            Sube fotos de la mascota
          </p>
          <p className="text-xs text-on-surface-variant/60 font-semibold font-sans">
            Formatos JPG, PNG • Máx 5 fotos
          </p>
        </div>

        {/* Thumbnail preview list */}
        {imageFiles.length > 0 && (
          <div className="flex flex-wrap gap-3 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
            {imageFiles.map((url, index) => (
              <div key={index} className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-100 group">
                <img src={url} alt={`Pet preview ${index + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(index);
                  }}
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-200"
                  id={`remove-preview-${index}`}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Inputs row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider px-1">
              Nombre de la mascota
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Max"
              className="w-full bg-white border border-outline-variant rounded-2xl p-4 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-gray-400"
              id="report-name-input"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider px-1">
              Raza o Tipo
            </label>
            <input
              type="text"
              required
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              placeholder="Ej: Labrador, Siamés, Mestizo"
              className="w-full bg-white border border-outline-variant rounded-2xl p-4 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-gray-400"
              id="report-breed-input"
            />
          </div>
        </div>

        {/* Owner details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider px-1">
              Tu Nombre de Contacto
            </label>
            <input
              type="text"
              required
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              placeholder="Ej: Sofía Martínez"
              className="w-full bg-white border border-outline-variant rounded-2xl p-4 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-gray-400"
              id="report-owner-name"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider px-1">
              Teléfono de Contacto
            </label>
            <input
              type="tel"
              required
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              placeholder="Ej: +52 55 1234 5678"
              className="w-full bg-white border border-outline-variant rounded-2xl p-4 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-gray-400"
              id="report-phone-input"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider px-1">
            Descripción detallada (color, señas particulares)
          </label>
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe manchas, collares o cualquier rasgo distintivo para poder identificarlo rápido..."
            rows={4}
            className="w-full bg-white border border-outline-variant rounded-2xl p-4 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-gray-400 resize-none"
            id="report-description-textarea"
          />
        </div>

        {/* CDMX Interactive Map Placeholder widget */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider px-1">
            Última ubicación vista
          </label>
          <div className="relative w-full h-52 rounded-2xl overflow-hidden border border-outline-variant shadow-sm group">
            {/* CDMX Stylized Aerial Map Background */}
            <div
              className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-[1.02]"
              style={{
                backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuC26BwsSNVOYpd0EyujJhW7I9jruSAOh7NToi14gE4OqNVYtnCtDsa3wsicspw4qccwNlI0IegAutICz8eq7tlT3ZyzreOpwpRHUcEgUEXH2oepw0evnO50M7X7iaP4fU60iSeRK4hO9_SKjVqxbAKn5HM1gLeTZ5-yiDwS4c8Eg8AzkBqpxcLlDxMJaqmXnKf4hdUiv6N5fNmPhGKjsT0-E-9BY8964AQq6resFnFWudjZramm3SY3')`,
              }}
            ></div>

            {/* Glowing Map Overlay Pin */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <MapPin className="text-[#F4A261] w-12 h-12 drop-shadow-xl animate-bounce fill-red-100" />
              <span className="bg-white/95 px-3 py-1 rounded-full text-[10px] font-bold shadow-md border border-gray-100 mt-1">
                {isMapPinned ? pinnedLocationName : 'Roma Norte, CDMX'}
              </span>
            </div>

            {/* Navigation pin request button */}
            <button
              type="button"
              onClick={handlePinCurrentLocation}
              className="absolute bottom-4 right-4 bg-white hover:bg-gray-50 text-primary px-4 py-2 rounded-full shadow-lg border border-gray-100 flex items-center gap-1.5 text-xs font-headline font-bold transition-transform active:scale-95"
              id="pin-current-location-btn"
            >
              <Navigation className="w-3.5 h-3.5 fill-current" />
              Fijar ubicación actual
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-[#F4A261] hover:bg-orange-500 text-white font-headline font-bold text-base h-14 rounded-full shadow-xl hover:shadow-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
          id="submit-report-form-btn"
        >
          <Send className="w-5 h-5" />
          Publicar Reporte de Extravío
        </button>
      </form>
    </div>
  );
}
