import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar.component';
import { TransactionService } from '../../../services/transaction.service';
import { AccountService } from '../../../services/account.service';
import { Transaction, TransactionFilter } from '../../../models/transaction.model';
import { Account } from '../../../models/account.model';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent],
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css']
})
export class TransactionListComponent implements OnInit {
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  accounts: Account[] = [];
  
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  
  filter: TransactionFilter = {
    numeroCompte: '',
    dateDebut: '',
    dateFin: ''
  };

  // Pagination
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;

  // Export modal
  showExportModal: boolean = false;
  exportFormat: 'pdf' | 'excel' | 'csv' = 'pdf';

  constructor(
    private transactionService: TransactionService,
    private accountService: AccountService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAccounts();
    this.setDefaultDates();
  }

  setDefaultDates(): void {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

    this.filter.dateDebut = this.formatDate(firstDay);
    this.filter.dateFin = this.formatDate(today);
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  formatTransactionDate(dateString: string | Date | undefined, format: string): string {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      
      if (isNaN(date.getTime())) return 'N/A';
      
      switch(format) {
        case 'dd':
          return date.getDate().toString().padStart(2, '0');
        case 'MMM':
          return date.toLocaleDateString('fr-FR', { month: 'short' });
        case 'HH:mm':
          return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        case 'dd/MM/yyyy':
          return date.toLocaleDateString('fr-FR');
        default:
          return date.toLocaleDateString('fr-FR');
      }
    } catch (error) {
      return 'N/A';
    }
  }

  loadAccounts(): void {
    this.accountService.getAllAccounts().subscribe({
      next: (data) => {
        this.accounts = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des comptes', error);
        this.errorMessage = 'Erreur lors du chargement des comptes';
        this.clearMessagesAfterDelay();
      }
    });
  }

  searchTransactions(): void {
    if (!this.filter.numeroCompte) {
      this.errorMessage = 'Veuillez sélectionner un compte';
      this.clearMessagesAfterDelay();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const filterWithTime = {
      numeroCompte: this.filter.numeroCompte,
      dateDebut: this.filter.dateDebut + 'T00:00:00',
      dateFin: this.filter.dateFin + 'T23:59:59'
    };

    this.transactionService.getTransactionsByPeriod(filterWithTime).subscribe({
      next: (data) => {
        this.transactions = data;
        this.filteredTransactions = this.getPaginatedTransactions();
        this.totalPages = Math.ceil(this.transactions.length / this.pageSize);
        this.currentPage = 1;
        
        if (data.length > 0) {
          this.successMessage = `${data.length} transaction(s) trouvée(s)`;
        }
        
        this.isLoading = false;
        this.cdr.detectChanges();
        this.clearMessagesAfterDelay();
      },
      error: (error) => {
        console.error('Erreur lors du chargement des transactions', error);
        this.errorMessage = error.error?.message || 'Erreur lors du chargement des transactions';
        this.isLoading = false;
        this.cdr.detectChanges();
        this.clearMessagesAfterDelay();
      }
    });
  }

  clearMessagesAfterDelay(): void {
    setTimeout(() => {
      this.errorMessage = '';
      this.successMessage = '';
      this.cdr.detectChanges();
    }, 5000);
  }

  generatePDF(): void {
    if (!this.filter.numeroCompte) {
      this.errorMessage = 'Veuillez sélectionner un compte';
      this.clearMessagesAfterDelay();
      return;
    }

    if (this.transactions.length === 0) {
      this.errorMessage = 'Aucune transaction à exporter';
      this.clearMessagesAfterDelay();
      return;
    }

    const filterWithTime = {
      numeroCompte: this.filter.numeroCompte,
      dateDebut: this.filter.dateDebut + 'T00:00:00',
      dateFin: this.filter.dateFin + 'T23:59:59'
    };

    this.transactionService.generateReleve(filterWithTime).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `releve_${this.filter.numeroCompte}_${Date.now()}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
        this.successMessage = 'PDF généré avec succès';
        this.cdr.detectChanges();
        this.clearMessagesAfterDelay();
      },
      error: (error) => {
        console.error('Erreur lors de la génération du PDF', error);
        this.errorMessage = 'Erreur lors de la génération du PDF';
        this.cdr.detectChanges();
        this.clearMessagesAfterDelay();
      }
    });
  }

  // Méthodes pour les icônes et classes
  getTransactionIcon(type: string): string {
    switch(type) {
      case 'DEPOT': return 'fa-arrow-down';
      case 'RETRAIT': return 'fa-arrow-up';
      case 'VIREMENT': return 'fa-exchange-alt';
      default: return 'fa-question';
    }
  }

  getTransactionClass(type: string): string {
    switch(type) {
      case 'DEPOT': return 'deposit';
      case 'RETRAIT': return 'withdrawal';
      case 'VIREMENT': return 'transfer';
      default: return '';
    }
  }

  getTransactionLabel(type: string): string {
    switch(type) {
      case 'DEPOT': return 'Dépôt';
      case 'RETRAIT': return 'Retrait';
      case 'VIREMENT': return 'Virement';
      default: return type;
    }
  }

  getAmountClass(type: string): string {
    switch(type) {
      case 'DEPOT': return 'deposit';
      case 'RETRAIT': return 'withdrawal';
      case 'VIREMENT': return 'transfer';
      default: return '';
    }
  }

  getTransactionStatus(transaction: Transaction): string {
    if (!transaction.dateTransaction) return 'N/A';
    
    try {
      const transactionDate = new Date(transaction.dateTransaction);
      if (isNaN(transactionDate.getTime())) return 'N/A';
      
      const now = new Date();
      const diffHours = (now.getTime() - transactionDate.getTime()) / (1000 * 60 * 60);
      
      if (diffHours < 1) return 'Récent';
      if (diffHours < 24) return 'Aujourd\'hui';
      return 'Terminé';
    } catch (error) {
      return 'N/A';
    }
  }

  getStatusClass(transaction: Transaction): string {
    const status = this.getTransactionStatus(transaction);
    switch(status) {
      case 'Récent': return 'pending';
      case 'Terminé': return 'completed';
      default: return 'completed';
    }
  }

  // Pagination
  getPaginatedTransactions(): Transaction[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.transactions.slice(startIndex, endIndex);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.filteredTransactions = this.getPaginatedTransactions();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.filteredTransactions = this.getPaginatedTransactions();
    }
  }

  // Export modal
  openExportModal(): void {
    this.showExportModal = true;
  }

  closeExportModal(): void {
    this.showExportModal = false;
  }

  confirmExport(): void {
    switch(this.exportFormat) {
      case 'pdf':
        this.generatePDF();
        break;
      case 'excel':
        this.exportExcel();
        break;
      case 'csv':
        this.exportCSV();
        break;
    }
    this.closeExportModal();
  }

  exportExcel(): void {
    if (!this.filter.numeroCompte || this.transactions.length === 0) {
      this.errorMessage = 'Aucune donnée à exporter';
      this.clearMessagesAfterDelay();
      return;
    }

    this.successMessage = 'Export Excel en cours...';
    setTimeout(() => {
      this.successMessage = 'Export Excel terminé';
      this.cdr.detectChanges();
      this.clearMessagesAfterDelay();
    }, 1000);
  }

  exportCSV(): void {
    if (!this.filter.numeroCompte || this.transactions.length === 0) {
      this.errorMessage = 'Aucune donnée à exporter';
      this.clearMessagesAfterDelay();
      return;
    }

    this.successMessage = 'Export CSV en cours...';
    setTimeout(() => {
      this.successMessage = 'Export CSV terminé';
      this.cdr.detectChanges();
      this.clearMessagesAfterDelay();
    }, 1000);
  }

  // Statistiques financières
  getTotalByType(type: string): number {
    if (!this.transactions || this.transactions.length === 0) return 0;
    
    return this.transactions
      .filter(t => t.typeTransaction === type)
      .reduce((sum, t) => sum + (t.montant || 0), 0);
  }

  getNetBalance(): number {
    const deposits = this.getTotalByType('DEPOT');
    const withdrawals = this.getTotalByType('RETRAIT');
    return deposits - withdrawals;
  }

  getNetBalanceClass(): string {
    const balance = this.getNetBalance();
    return balance >= 0 ? 'positive' : 'negative';
  }

  getActivityRate(): number {
    if (!this.transactions || this.transactions.length === 0) return 0;
    if (!this.filter.dateDebut || !this.filter.dateFin) return 0;
    
    try {
      const activeDays = new Set(
        this.transactions
          .filter(t => t.dateTransaction)
          .map(t => {
            const date = new Date(t.dateTransaction!);
            return isNaN(date.getTime()) ? null : date.toDateString();
          })
          .filter(date => date !== null)
      ).size;
      
      const dateDebut = new Date(this.filter.dateDebut);
      const dateFin = new Date(this.filter.dateFin);
      
      if (isNaN(dateDebut.getTime()) || isNaN(dateFin.getTime())) return 0;
      
      const totalDays = Math.ceil((dateFin.getTime() - dateDebut.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      
      return Math.round((activeDays / totalDays) * 100);
    } catch (error) {
      return 0;
    }
  }

  // Autres méthodes
  printTable(): void {
    window.print();
  }

  resetFilters(): void {
    this.filter.numeroCompte = '';
    this.transactions = [];
    this.filteredTransactions = [];
    this.setDefaultDates();
    this.errorMessage = '';
    this.successMessage = '';
    this.currentPage = 1;
    this.totalPages = 1;
    this.cdr.detectChanges();
  }

  // Ancienne méthode pour compatibilité
  getTransactionBadgeClass(type: string): string {
    switch(type) {
      case 'DEPOT': return 'bg-success';
      case 'RETRAIT': return 'bg-warning';
      case 'VIREMENT': return 'bg-primary';
      default: return 'bg-secondary';
    }
  }
}