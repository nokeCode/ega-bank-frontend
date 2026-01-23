// src/app/models/client.model.ts
export interface Client {
  id?: number;
  nom: string;
  prenom: string;
  dateNaissance: string;
  sexe: 'MASCULIN' | 'FEMININ' | 'AUTRE';
  adresse: string;
  numeroTelephone: string;
  courriel: string;
  nationalite: string;
  dateCreation?: string;

  comptes?: any[];
  totalSolde?: number;

  // Propriétés optionnelles pour le frontend
  vip?: boolean;                    // Client VIP
  active?: boolean;                 // Statut actif/inactif
  lastActivity?: string;            // Dernière activité          // Solde total des comptes
  
  // Dates
   // Date de création
  dateModification?: Date | string; // Date de modification
}

