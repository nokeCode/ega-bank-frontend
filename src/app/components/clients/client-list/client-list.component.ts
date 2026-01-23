import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  PLATFORM_ID,
  ChangeDetectorRef
} from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { NavbarComponent } from '../../navbar/navbar.component';
import { ClientService } from '../../../services/client.service';
import { Client } from '../../../models/client.model';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NavbarComponent
  ],
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']
})
export class ClientListComponent implements OnInit, OnDestroy {

  /* =======================
     DONNÉES PRINCIPALES
  ======================= */
  clients: Client[] = [];
  filteredClients: Client[] = [];

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  /* =======================
     STATS / HEADER
  ======================= */
  totalClients = 0;
  activeAccounts = 0;
  newClientsThisMonth = 0;
  growthRate = 0;

  /* =======================
     RECHERCHE / FILTRES
  ======================= */
  searchTerm = '';
  activeFilter: 'all' | 'recent' | 'vip' = 'all';

  /* =======================
     SÉLECTION
  ======================= */
  selectedClients = new Set<number>();

  /* =======================
     PAGINATION
  ======================= */
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;

  /* =======================
     MODAL SUPPRESSION
  ======================= */
  showDeleteModal = false;
  clientToDelete?: Client;

  /* =======================
     QUICK STATS & ACTIONS
  ======================= */
  showQuickStats = true;
  private quickStatsTimeout?: any;
  expandedActionsClientId?: number;

  private isBrowser: boolean;

  constructor(
    private clientService: ClientService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  /* =======================
     INIT
  ======================= */
  ngOnInit(): void {
    if (this.isBrowser) {
      this.loadClients();
      this.startQuickStatsTimer();
      // Fermer le menu déroulant quand on clique ailleurs
      if (this.isBrowser) {
        document.addEventListener('click', (event) => {
          const target = event.target as HTMLElement;
          if (!target.closest('.action-dropdown')) {
            this.expandedActionsClientId = undefined;
            this.cdr.detectChanges();
          }
        });
      }
    }
  }

  ngOnDestroy(): void {
    if (this.quickStatsTimeout) {
      clearTimeout(this.quickStatsTimeout);
    }
  }

  /* =======================
     CHARGEMENT CLIENTS
  ======================= */
  loadClients(): void {
    this.isLoading = true;

    this.clientService.getAllClients().subscribe({
      next: (data) => {
        this.clients = data.map(client => ({
          ...client,
          // Ajouter des propriétés par défaut si elles n'existent pas
          vip: client.vip ?? (Math.random() > 0.7), // 30% de chance d'être VIP
          active: client.active ?? true,
          lastActivity: client.lastActivity ?? this.getRandomActivityDate(),
          comptes: client.comptes ?? []
        }));
        
        this.filteredClients = [...this.clients];

        // Mettre à jour les statistiques
        this.totalClients = data.length;
        this.activeAccounts = this.clients.reduce((sum, client) => 
          sum + (client.comptes?.length || 0), 0);
        this.newClientsThisMonth = Math.floor(Math.random() * 10);
        this.growthRate = Math.floor(Math.random() * 30);
        this.totalPages = Math.ceil(this.filteredClients.length / this.pageSize);

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erreur:', error);
        this.errorMessage = 'Erreur lors du chargement des clients';
        this.isLoading = false;
      }
    });
  }

  /* =======================
     GÉNÉRER DATE ALÉATOIRE
  ======================= */
  private getRandomActivityDate(): string {
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    
    return daysAgo === 0 ? 'Aujourd\'hui' : 
           daysAgo === 1 ? 'Hier' : 
           `Il y a ${daysAgo} jours`;
  }

  /* =======================
     RECHERCHE
  ======================= */
  onSearch(): void {
    const term = this.searchTerm.toLowerCase();

    this.filteredClients = this.clients.filter(c =>
      `${c.prenom} ${c.nom}`.toLowerCase().includes(term) ||
      c.courriel?.toLowerCase().includes(term) ||
      c.numeroTelephone?.toLowerCase().includes(term)
    );

    this.totalPages = Math.ceil(this.filteredClients.length / this.pageSize);
    this.currentPage = 1;
    this.cdr.detectChanges();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredClients = [...this.clients];
    this.totalPages = Math.ceil(this.filteredClients.length / this.pageSize);
    this.currentPage = 1;
  }

  /* =======================
     FILTRES
  ======================= */
  filterClients(type: 'all' | 'recent' | 'vip'): void {
    this.activeFilter = type;

    switch (type) {
      case 'vip':
        this.filteredClients = this.clients.filter(c => c.vip);
        break;
      case 'recent':
        // Simuler des clients récents (créés il y a moins de 7 jours)
        this.filteredClients = this.clients.filter(() => Math.random() > 0.5);
        break;
      default:
        this.filteredClients = [...this.clients];
    }

    this.totalPages = Math.ceil(this.filteredClients.length / this.pageSize);
    this.currentPage = 1;
  }

  /* =======================
     SÉLECTION
  ======================= */
  isSelected(id: number): boolean {
    return this.selectedClients.has(id);
  }

  toggleSelect(id: number): void {
    this.isSelected(id)
      ? this.selectedClients.delete(id)
      : this.selectedClients.add(id);
    this.cdr.detectChanges();
  }

  /* =======================
     AVATAR
  ======================= */
  getInitials(client: Client): string {
    return `${client.prenom?.[0] ?? ''}${client.nom?.[0] ?? ''}`.toUpperCase();
  }

  getAvatarColor(client: Client): string {
    const colors = [
      'linear-gradient(135deg, #4A90E2, #6A9EFF)',  // Bleu
      'linear-gradient(135deg, #20B2AA, #3DC8C0)',  // Turquoise
      'linear-gradient(135deg, #9B59B6, #B57EDC)',  // Violet
      'linear-gradient(135deg, #E74C3C, #FF6B6B)',  // Rouge
      'linear-gradient(135deg, #2ECC71, #4CD964)',  // Vert
      'linear-gradient(135deg, #F39C12, #FFC107)'   // Orange
    ];
    return colors[client.id! % colors.length];
  }

  /* =======================
     SUPPRESSION
  ======================= */
  confirmDelete(client: Client): void {
    this.clientToDelete = client;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.clientToDelete = undefined;
  }

  deleteClient(): void {
    if (!this.clientToDelete) return;

    this.clientService.deleteClient(this.clientToDelete.id!).subscribe({
      next: () => {
        this.successMessage = `Client ${this.clientToDelete?.prenom} ${this.clientToDelete?.nom} supprimé avec succès`;
        this.closeDeleteModal();
        this.loadClients();
        
        // Auto-hide success message
        setTimeout(() => {
          this.successMessage = '';
          this.cdr.detectChanges();
        }, 3000);
      },
      error: (error) => {
        console.error('Erreur suppression:', error);
        this.errorMessage = 'Erreur lors de la suppression du client';
        
        // Auto-hide error message
        setTimeout(() => {
          this.errorMessage = '';
          this.cdr.detectChanges();
        }, 3000);
      }
    });
  }

  /* =======================
     NAVIGATION
  ======================= */
  editClient(id: number): void {
    this.router.navigate(['/clients/edit', id]);
  }

  /* =======================
     PAGINATION
  ======================= */
  getPages(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    
    if (this.totalPages <= maxVisible) {
      return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }
    
    let start = Math.max(1, this.currentPage - 2);
    let end = Math.min(this.totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.cdr.detectChanges();
    }
  }

  /* =======================
     PAGINATION CONTROLS
  ======================= */
  get paginatedClients(): Client[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.filteredClients.slice(startIndex, endIndex);
  }

  /* =======================
     EXPORT
  ======================= */
  exportClients(): void {
    const csvData = this.generateCSV();
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `clients_export_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    this.successMessage = 'Export effectué avec succès';
    setTimeout(() => {
      this.successMessage = '';
      this.cdr.detectChanges();
    }, 3000);
  }

  private generateCSV(): string {
    const headers = ['ID', 'Prénom', 'Nom', 'Email', 'Téléphone', 'Nationalité', 'Date Naissance', 'Nombre Comptes', 'Statut'];
    const rows = this.filteredClients.map(client => [
      client.id,
      client.prenom,
      client.nom,
      client.courriel,
      client.numeroTelephone,
      client.nationalite,
      new Date(client.dateNaissance || '').toLocaleDateString('fr-FR'),
      client.comptes?.length || 0,
      client.active ? 'Actif' : 'Inactif'
    ]);

    const headerRow = headers.join(';');
    const dataRows = rows.map(row => row.join(';')).join('\n');
    
    return `${headerRow}\n${dataRows}`;
  }

  /* =======================
     QUICK STATS TIMER
  ======================= */
  startQuickStatsTimer(): void {
    this.showQuickStats = true;
    
    if (this.quickStatsTimeout) {
      clearTimeout(this.quickStatsTimeout);
    }
    
    this.quickStatsTimeout = setTimeout(() => {
      this.showQuickStats = false;
      this.cdr.detectChanges();
    }, 5000); // 5 secondes
  }

  /* =======================
     ACTIONS CLIENT
  ======================= */
  toggleClientActions(clientId: number): void {
    this.expandedActionsClientId = this.expandedActionsClientId === clientId ? undefined : clientId;
    this.cdr.detectChanges();
  }

  createTransactionForClient(clientId: number, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/transactions/new'], { queryParams: { clientId } });
  }

  createAccountForClient(clientId: number, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/accounts/new'], { queryParams: { clientId } });
  }

  viewClientDetails(clientId: number, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/clients', clientId]);
  }
}