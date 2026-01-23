export interface Transaction {
  id?: number;
  typeTransaction: 'DEPOT' | 'RETRAIT' | 'VIREMENT';
  montant: number;
  dateTransaction?: string;
  numeroCompte: string;
  compteDestination?: string;
  description?: string;

  // Propriétés compatibles pour le dashboard
  type?: 'DEPOT' | 'RETRAIT' | 'VIREMENT' | 'DEBIT' | 'CREDIT';
  amount?: number;
  date?: string;
  compte?: {  // ← AJOUTEZ CECI
    numeroCompte?: string;
    proprietaireNom?: string;
  };

  // Propriétés optionnelles
  reference?: string;                 // Référence de transaction
  statut?: string;                    // Statut (COMPLETED, PENDING, FAILED)
  frais?: number;                     // Frais de transaction
  soldeAvant?: number;                // Solde avant transaction
  soldeApres?: number;                // Solde après transaction
  emetteurNom?: string;               // Nom de l'émetteur
  beneficiaireNom?: string;           // Nom du bénéficiaire
  
  // Relations
                         // Compte source
  compteDest?: any;                   // Compte destination
  
  // Métadonnées
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface DepotRequest {
  numeroCompte: string;
  montant: number;
  description?: string;
}

export interface RetraitRequest {
  numeroCompte: string;
  montant: number;
  description?: string;
}

export interface VirementRequest {
  numeroCompteSource: string;
  numeroCompteDestination: string;
  montant: number;
  description?: string;
}

export interface TransactionFilter {
  numeroCompte: string;
  dateDebut: string;
  dateFin: string;
}


