import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar.component';
import { TransactionService } from '../../../services/transaction.service';
import { AccountService } from '../../../services/account.service';
import { ClientService } from '../../../services/client.service';
import { Account } from '../../../models/account.model';
import { DepotRequest, RetraitRequest, VirementRequest } from '../../../models/transaction.model';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent],
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.css']
})
export class TransactionFormComponent implements OnInit {

  /* ================== ÉTAT GLOBAL ================== */
  transactionType: 'DEPOT' | 'RETRAIT' | 'VIREMENT' = 'DEPOT';
  accounts: Account[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  selectedClientId: number | null = null;

  /* ================== DONNÉES FORMULAIRES ================== */
  depotData: DepotRequest = {
    numeroCompte: '',
    montant: 0,
    description: ''
  };

  retraitData: RetraitRequest = {
    numeroCompte: '',
    montant: 0,
    description: ''
  };

  virementData: VirementRequest = {
    numeroCompteSource: '',
    numeroCompteDestination: '',
    montant: 0,
    description: ''
  };

  /* ================== ALIAS POUR LE HTML ================== */
  get depositDescription(): string {
    return this.depotData.description || '';
  }

  get withdrawalDescription(): string {
    return this.retraitData.description || '';
  }

  get transferDescription(): string {
    return this.virementData.description || '';
  }

  constructor(
    private transactionService: TransactionService,
    private accountService: AccountService,
    private clientService: ClientService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Récupérer le clientId depuis les paramètres de requête
    this.route.queryParams.subscribe(params => {
      if (params['clientId']) {
        this.selectedClientId = parseInt(params['clientId'], 10);
      }
    });
    
    this.loadAccounts();
  }

  /* ================== COMPTES ================== */
  loadAccounts(): void {
    if (this.selectedClientId) {
      // Si un client est sélectionné, charger ses comptes
      this.accountService.getAllAccounts().subscribe({
        next: (data) => {
          // Filtrer les comptes du client sélectionné
          this.accounts = data.filter(acc => acc.proprietaireId === this.selectedClientId);
        },
        error: () => this.errorMessage = 'Erreur lors du chargement des comptes'
      });
    } else {
      // Sinon, charger tous les comptes
      this.accountService.getAllAccounts().subscribe({
        next: (data) => this.accounts = data,
        error: () => this.errorMessage = 'Erreur lors du chargement des comptes'
      });
    }
  }

  getSelectedAccount(numeroCompte?: string): Account | undefined {
    if (!numeroCompte) return undefined;
    return this.accounts.find(acc => acc.numeroCompte === numeroCompte);
  }

  /* ================== ACTIONS MONTANT ================== */
  setAmount(amount: number): void {
    if (this.transactionType === 'DEPOT') {
      this.depotData.montant = amount;
    } else if (this.transactionType === 'RETRAIT') {
      this.retraitData.montant = amount;
    } else {
      this.virementData.montant = amount;
    }
  }

  setMaxAmount(): void {
    if (this.transactionType === 'RETRAIT') {
      const acc = this.getSelectedAccount(this.retraitData.numeroCompte);
      this.retraitData.montant = acc?.solde ?? 0;
    }

    if (this.transactionType === 'VIREMENT') {
      const acc = this.getSelectedAccount(this.virementData.numeroCompteSource);
      this.virementData.montant = acc?.solde ?? 0;
    }
  }

  /* ================== CALCULS ================== */
  calculateNewBalance(type: 'depot' | 'retrait'): number {
    if (type === 'depot') {
      const acc = this.getSelectedAccount(this.depotData.numeroCompte);
      return (acc?.solde ?? 0) + (this.depotData.montant || 0);
    }

    const acc = this.getSelectedAccount(this.retraitData.numeroCompte);
    return (acc?.solde ?? 0) - (this.retraitData.montant || 0);
  }

  calculateTransferNewBalance(target: 'source' | 'destination'): number {
    if (target === 'source') {
      const acc = this.getSelectedAccount(this.virementData.numeroCompteSource);
      return (acc?.solde ?? 0) - (this.virementData.montant || 0);
    }

    const acc = this.getSelectedAccount(this.virementData.numeroCompteDestination);
    return (acc?.solde ?? 0) + (this.virementData.montant || 0);
  }

  /* ================== SOUMISSION ================== */
  onSubmit(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.transactionType === 'DEPOT') this.makeDepot();
    if (this.transactionType === 'RETRAIT') this.makeRetrait();
    if (this.transactionType === 'VIREMENT') this.makeVirement();
  }

  makeDepot(): void {
    this.transactionService.depot(this.depotData).subscribe({
      next: () => this.handleSuccess('Dépôt effectué avec succès !'),
      error: (err) => this.handleError(err, 'Erreur lors du dépôt')
    });
  }

  makeRetrait(): void {
    this.transactionService.retrait(this.retraitData).subscribe({
      next: () => this.handleSuccess('Retrait effectué avec succès !'),
      error: (err) => this.handleError(err, 'Erreur lors du retrait')
    });
  }

  makeVirement(): void {
    this.transactionService.virement(this.virementData).subscribe({
      next: () => this.handleSuccess('Virement effectué avec succès !'),
      error: (err) => this.handleError(err, 'Erreur lors du virement')
    });
  }

  /* ================== HELPERS ================== */
  private handleSuccess(message: string): void {
    this.successMessage = message;
    this.isLoading = false;
    setTimeout(() => this.router.navigate(['/transactions']), 2000);
  }

  private handleError(error: any, fallback: string): void {
    this.errorMessage = error?.error?.message || fallback;
    this.isLoading = false;
  }
}
