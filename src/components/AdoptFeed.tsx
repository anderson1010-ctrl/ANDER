import { useState } from 'react';
import { Pet, PetCategory } from '../types';
import { Search, Heart, MapPin, Sparkles, AlertCircle } from 'lucide-react';

interface AdoptFeedProps {
  pets: Pet[];
  onSelectPet: (pet: Pet) => void;
  favoritedIds: string[];
  onToggleFavorite: (petId: string) => void;
}

export default function AdoptFeed({ pets, onSelectPet, favoritedIds, onToggleFavorite }: AdoptFeedProps) {
  const [activeCategory, setActiveCategory] = useState<PetCategory>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Filtering
  const filteredPets = pets.filter((pet) => {
    const matchesCategory = activeCategory === 'Todos' || pet.category === activeCategory;
    const matchesSearch =
      pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pet.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (pet.location || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFavorites = !showFavoritesOnly || favoritedIds.includes(pet.id);
    return matchesCategory && matchesSearch && matchesFavorites;
  });

  const categories: PetCategory[] = ['Todos', 'Perros', 'Gatos', 'Otros'];

  return (
    <div className="space-y-6">
      {/* Search and Category Filters */}
      <section className="space-y-4">
        {/* Search Input */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors duration-200 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Busca tu compañero ideal..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-[0px_4px_12px_rgba(38,70,83,0.05)] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-sans text-base placeholder:text-gray-400"
            id="adopt-feed-search"
          />
        </div>

        {/* Categories Carousel */}
        <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar select-none">
          {categories.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2.5 rounded-full font-headline font-bold text-sm shadow-sm transition-all duration-200 active:scale-95 whitespace-nowrap ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'bg-white hover:bg-gray-50 border border-gray-100 text-on-surface-variant'
                }`}
                id={`category-btn-${category}`}
              >
                {category}
              </button>
            );
          })}

          {/* Favorites-only toggle */}
          <button
            onClick={() => setShowFavoritesOnly((prev) => !prev)}
            className={`flex items-center gap-1.5 px-6 py-2.5 rounded-full font-headline font-bold text-sm shadow-sm transition-all duration-200 active:scale-95 whitespace-nowrap ${
              showFavoritesOnly
                ? 'bg-red-500 text-white'
                : 'bg-white hover:bg-gray-50 border border-gray-100 text-on-surface-variant'
            }`}
            id="favorites-only-toggle"
          >
            <Heart className={`w-4 h-4 ${showFavoritesOnly ? 'fill-current' : ''}`} />
            Favoritos {favoritedIds.length > 0 && `(${favoritedIds.length})`}
          </button>
        </div>
      </section>

      {/* Grid of Pets */}
      {filteredPets.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mx-auto">
            🐾
          </div>
          <div className="space-y-1">
            <h3 className="font-headline text-lg font-bold text-on-surface">
              {showFavoritesOnly ? 'Aún no tienes favoritos' : 'No se encontraron mascotas'}
            </h3>
            <p className="text-sm text-on-surface-variant max-w-xs mx-auto">
              {showFavoritesOnly
                ? 'Toca el corazón en cualquier mascota para guardarla aquí.'
                : 'Intenta buscando con otra palabra clave o cambiando el filtro de categoría.'}
            </p>
          </div>
        </div>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPets.map((pet) => {
            const isFav = favoritedIds.includes(pet.id);
            return (
              <div
                key={pet.id}
                className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-[0px_4px_12px_rgba(38,70,83,0.05)] hover:shadow-[0px_8px_20px_rgba(38,70,83,0.1)] transition-all duration-300 flex flex-col group relative"
                id={`pet-card-${pet.id}`}
              >
                {/* Image & Badges */}
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                  <img
                    src={pet.image}
                    alt={pet.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Favorite heart button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(pet.id);
                    }}
                    className={`absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md transition-all active:scale-90 ${
                      isFav ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                    }`}
                    id={`fav-btn-${pet.id}`}
                  >
                    <Heart className={`w-5 h-5 ${isFav ? 'fill-current' : ''}`} />
                  </button>

                  {/* Status label badges */}
                  <div className="absolute bottom-3 left-3 flex gap-1.5">
                    {pet.status === 'Urgente' && (
                      <span className="px-3 py-1 bg-[#F4A261] text-white text-[10px] uppercase font-extrabold tracking-wider rounded-md shadow-sm">
                        Urgente
                      </span>
                    )}
                    {pet.status === 'Saludable' && (
                      <span className="px-3 py-1 bg-primary text-white text-[10px] uppercase font-extrabold tracking-wider rounded-md shadow-sm">
                        Saludable
                      </span>
                    )}
                    {pet.status === 'En Proceso' && (
                      <span className="px-3 py-1 bg-outline text-white text-[10px] uppercase font-extrabold tracking-wider rounded-md shadow-sm">
                        En Proceso
                      </span>
                    )}
                    {pet.status === 'Adoptado' && (
                      <span className="px-3 py-1 bg-gray-500 text-white text-[10px] uppercase font-extrabold tracking-wider rounded-md shadow-sm">
                        Adoptado
                      </span>
                    )}
                  </div>
                </div>

                {/* Profile content details */}
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-1 gap-1">
                    <h3 className="font-headline text-lg font-bold text-on-surface truncate group-hover:text-primary transition-colors duration-200">
                      {pet.name}
                    </h3>
                    <span className="font-sans font-bold text-xs text-outline bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100 shrink-0">
                      {pet.age}
                    </span>
                  </div>

                  <p className="font-sans text-xs text-on-surface-variant font-medium mb-4">
                    {pet.breed} • {pet.gender}
                  </p>

                  <button
                    onClick={() => onSelectPet(pet)}
                    className="mt-auto w-full py-3 bg-[#2A9D8F] hover:bg-[#238276] text-white font-headline font-bold text-sm rounded-full shadow-md active:scale-95 transition-transform"
                    id={`adopt-action-btn-${pet.id}`}
                  >
                    Adoptar
                  </button>
                </div>
              </div>
            );
          })}
        </section>
      )}
    </div>
  );
}
