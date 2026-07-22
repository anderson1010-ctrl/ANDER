export type PetCategory = 'Todos' | 'Perros' | 'Gatos' | 'Otros';

export type PetStatus = 'Saludable' | 'Urgente' | 'En Proceso' | 'Adoptado';

export interface Pet {
  id: string;
  name: string;
  breed: string;
  gender: 'Macho' | 'Hembra';
  age: string;
  image: string;
  category: 'Perros' | 'Gatos' | 'Otros';
  status: PetStatus;
  description: string;
  temperament?: string[];
  location?: string;
  size?: string;
  vaccinated?: boolean;
  neutered?: boolean;
}

export interface LostPetReport {
  id: string;
  name: string;
  breed: string;
  description: string;
  image: string;
  lastLocation: string;
  lastSeenTime: string;
  reportedAt: string;
  contactNumber: string;
  isUrgent: boolean;
  ownerName: string;
  ownerAvatar?: string;
}

export type ViewType = 'onboarding' | 'welcome' | 'inicio' | 'adoptar' | 'perdidos' | 'reportar' | 'mis_reportes' | 'favoritos';
