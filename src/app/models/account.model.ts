export interface Account {
  id?: number;
  numeroCompte?: string;
  typeCompte: 'COMPTE_EPARGNE' | 'COMPTE_COURANT';
  dateCreation?: string;
  solde?: number;
  proprietaireId: number;
  proprietaireNom?: string;

  // Propriétés optionnelles pour le frontend
  active?: boolean;                    // Compte actif/inactif
  tauxInteret?: number;               // Taux d'intérêt
  plafond?: number;                   // Plafond du compte
  derniereOperation?: Date | string;  // Date dernière opération
  statut?: string;                    // Statut du compte
  
  // Relations
  client?: any;                       // Client propriétaire
  transactions?: any[];               // Transactions associées
  
  // Métadonnées
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
