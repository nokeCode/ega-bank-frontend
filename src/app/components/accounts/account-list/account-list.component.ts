import { 
  Component, 
  OnInit, 
  Inject, 
  PLATFORM_ID, 
  ChangeDetectorRef 
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { NavbarComponent } from '../../navbar/navbar.component';
import { AccountService } from '../../../services/account.service';
import { Account } from '../../../models/account.model';

@Component({
  selector: 'app-account-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NavbarComponent],
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.css']
})
export class AccountListComponent implements OnInit {
  accounts: Account[] = [];
  filteredAccounts: Account[] = [];
  
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  
  searchTerm: string = '';
  activeFilter: 'all' | 'current' | 'savings' = 'all';
  
  showDeleteModal: boolean = false;
  accountToDelete?: Account;
  
  newAccountsThisMonth: number = 0;
  
  private isBrowser: boolean;

  constructor(
    private accountService: AccountService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.loadAccounts();
    }
  }

  loadAccounts(): void {
    this.isLoading = true;
    
    this.accountService.getAllAccounts().subscribe({
      next: (data) => {
        this.accounts = data;
        this.filteredAccounts = [...data];
        this.newAccountsThisMonth = this.getNewAccountsThisMonth();
        
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erreur:', error);
        this.errorMessage = 'Erreur lors du chargement des comptes';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Recherche
  onSearch(): void {
    const term = this.searchTerm.toLowerCase();
    
    this.filteredAccounts = this.accounts.filter(account =>
      account.numeroCompte?.toLowerCase().includes(term) ||
      account.proprietaireNom?.toLowerCase().includes(term) ||
      account.typeCompte?.toLowerCase().includes(term)
    );
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredAccounts = [...this.accounts];
  }

  // Filtres
  filterAccounts(type: 'all' | 'current' | 'savings'): void {
    this.activeFilter = type;
    
    switch (type) {
      case 'current':
        this.filteredAccounts = this.accounts.filter(a => a.typeCompte === 'COMPTE_COURANT');
        break;
      case 'savings':
        this.filteredAccounts = this.accounts.filter(a => a.typeCompte === 'COMPTE_EPARGNE');
        break;
      default:
        this.filteredAccounts = [...this.accounts];
    }
  }

  // Statistiques
  getCountByType(type: string): number {
    return this.accounts.filter(account => account.typeCompte === type).length;
  }

  getTotalBalance(): number {
    return this.accounts.reduce((sum, account) => sum + (account.solde || 0), 0);
  }

  getAverageBalance(): number {
    return this.accounts.length > 0 ? this.getTotalBalance() / this.accounts.length : 0;
  }

  getNewAccountsThisMonth(): number {
    // Simulation - à adapter avec vos données réelles
    return Math.floor(Math.random() * 5) + 1;
  }

  // Fonctions utilitaires
  isAccountActive(account: Account): boolean {
    // Logique pour déterminer si un compte est actif
    // Par défaut, tous les comptes sont actifs
    return account.solde !== undefined && account.solde >= 0;
  }

  getClientInitials(account: Account): string {
    if (!account.proprietaireNom) return '??';
    const names = account.proprietaireNom.split(' ');
    return names.map(name => name[0]).join('').toUpperCase().substring(0, 2);
  }

  getClientColor(account: Account): string {
    const colors = [
      'linear-gradient(135deg, #4A90E2, #6A9EFF)',  // Bleu
      'linear-gradient(135deg, #20B2AA, #3DC8C0)',  // Turquoise
      'linear-gradient(135deg, #9B59B6, #B57EDC)',  // Violet
      'linear-gradient(135deg, #E74C3C, #FF6B6B)',  // Rouge
      'linear-gradient(135deg, #2ECC71, #4CD964)',  // Vert
    ];
    const index = account.id ? account.id % colors.length : 0;
    return colors[index];
  }

  getInterestRate(account: Account): number {
    return account.typeCompte === 'COMPTE_EPARGNE' ? 2.5 : 0.5;
  }

  getAccountStatus(account: Account): string {
    const solde = account.solde || 0;
    if (solde > 1000000) return 'Premium';
    if (solde < 10000) return 'Basique';
    return 'Standard';
  }

  getBalancePercentage(account: Account): number {
    const maxBalance = 10000000; // 10 millions comme maximum de référence
    const solde = account.solde || 0;
    return Math.min((solde / maxBalance) * 100, 100);
  }

  // Copier le numéro de compte
  copyAccountNumber(number: string | undefined): void {
    if (!number) return;
    
    navigator.clipboard.writeText(number).then(() => {
      this.successMessage = 'Numéro de compte copié !';
      setTimeout(() => {
        this.successMessage = '';
        this.cdr.detectChanges();
      }, 2000);
    });
  }

  // Gestion de la suppression
  confirmDelete(account: Account): void {
    this.accountToDelete = account;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.accountToDelete = undefined;
  }

  // Suppression
  deleteAccount(): void {
    if (!this.accountToDelete) return;
    
    this.accountService.deleteAccount(this.accountToDelete.id!).subscribe({
      next: () => {
        this.successMessage = `Compte ${this.accountToDelete?.numeroCompte} supprimé avec succès`;
        this.closeDeleteModal();
        this.loadAccounts();
        
        setTimeout(() => {
          this.successMessage = '';
          this.cdr.detectChanges();
        }, 3000);
      },
      error: (error) => {
        console.error('Erreur suppression:', error);
        this.errorMessage = 'Erreur lors de la suppression du compte';
        this.closeDeleteModal();
        
        setTimeout(() => {
          this.errorMessage = '';
          this.cdr.detectChanges();
        }, 3000);
      }
    });
  }

  // Ancienne méthode pour compatibilité
  deleteAccountOld(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce compte ?')) {
      this.accountService.deleteAccount(id).subscribe({
        next: () => {
          this.loadAccounts();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression', error);
          alert('Erreur lors de la suppression du compte');
        }
      });
    }
  }
}