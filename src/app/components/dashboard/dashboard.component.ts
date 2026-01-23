import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { ClientService } from '../../services/client.service';
import { AccountService } from '../../services/account.service';
import { TransactionService } from '../../services/transaction.service';
import { Chart, registerables } from 'chart.js';
import { Transaction } from '../../models/transaction.model';
import { Client } from '../../models/client.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  totalClients: number = 0;
  totalAccounts: number = 0;
  totalBalance: number = 0;
  recentTransactions: Transaction[] = [];
  isLoading: boolean = false;
  chart: any;
  topClients: Client[] = [];
  private isBrowser: boolean;

  performanceStats = {
    clientsGrowth: 15.2,
    accountsGrowth: 8.5,
    balanceGrowth: 12.3
  };

  dValue: string; // Déclaration de la propriété dValue

  // Données dynamiques pour les statistiques du jour
  todayStats = {
    transactions: 0,
    newClients: 0,
    newAccounts: 0
  };

  constructor(
    private clientService: ClientService,
    private accountService: AccountService,
    private transactionService: TransactionService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    Chart.register(...registerables);
    this.isBrowser = isPlatformBrowser(platformId);
    this.dValue = '...'; // Initialisation de dValue avec une valeur appropriée
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.loadDashboardData();
      this.calculateWeeklyStats();
      this.calculateTodayStats();
      setTimeout(() => this.initChart(), 500);
    }
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  loadDashboardData(): void {
    this.isLoading = true;

    // Charger les clients
    this.clientService.getAllClients().subscribe({
      next: (clients) => {
        this.totalClients = clients.length;
        this.topClients = clients.slice(0, 5);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erreur chargement clients:', error);
      }
    });

    // Charger les comptes
    this.accountService.getAllAccounts().subscribe({
      next: (accounts) => {
        this.totalAccounts = accounts.length;
        this.totalBalance = accounts.reduce((sum, account) => sum + (account.solde || 0), 0);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erreur chargement comptes:', error);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });

    // Charger les transactions récentes
    this.loadRecentTransactions();
  }

  loadRecentTransactions(): void {
    this.transactionService.getRecentTransactions(5).subscribe({
      next: (transactions) => {
        this.recentTransactions = transactions;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erreur chargement transactions:', error);
        this.recentTransactions = [];
        this.cdr.detectChanges();
      }
    });
  }

  initChart(): void {
    if (!this.isBrowser) return;

    const ctx = document.getElementById('performanceChart') as HTMLCanvasElement;
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'],
        datasets: [
          {
            label: 'Clients',
            data: [12, 19, 15, 25, 22, this.totalClients],
            borderColor: '#667eea',
            backgroundColor: 'rgba(102, 126, 234, 0.1)',
            tension: 0.4,
            fill: true
          },
          {
            label: 'Comptes',
            data: [7, 11, 9, 15, 18, this.totalAccounts],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.4,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              display: true
            },
            border: {
              display: false
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });
  }

  formatCurrency(value: number | undefined): string {
    const amount = value || 0;
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount) + ' FCFA';
  }

  getCurrentDate(): string {
    return new Date().toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getCurrentTime(): string {
    return new Date().toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  get Math(): any {
    return Math;
  }
  getTransactionTypeLabel(transaction: Transaction): string {
    const type = transaction.type || transaction.typeTransaction;
    switch (type) {
      case 'DEPOT':
        return 'Dépôt';
      case 'RETRAIT':
        return 'Retrait';
      case 'VIREMENT':
        return 'Virement';
      case 'CREDIT':
        return 'Crédit';
      case 'DEBIT':
        return 'Débit';
      default:
        return 'Transaction';
    }
  }

  cardAnimationStates = {
    clients: 'normal',
    accounts: 'normal',
    balance: 'normal'
  };

  particleCount = 5;
  particles: Array<{ left: number, size: number, delay: number }> = [];


  initParticles(): void {
    // Générer des particules aléatoires pour chaque carte
    this.particles = Array.from({ length: this.particleCount }, (_, i) => ({
      left: Math.random() * 100,
      size: 2 + Math.random() * 3,
      delay: Math.random() * 5
    }));
  }

  // Méthode pour déclencher l'animation de pulse
  triggerPulse(card: string): void {
    this.cardAnimationStates[card as keyof typeof this.cardAnimationStates] = 'pulse';

    setTimeout(() => {
      this.cardAnimationStates[card as keyof typeof this.cardAnimationStates] = 'normal';
    }, 2000);
  }

  // Méthode pour obtenir la classe d'animation
  getCardAnimationClass(card: string): string {
    return this.cardAnimationStates[card as keyof typeof this.cardAnimationStates];
  }

  // Méthode pour obtenir le style des particules
  getParticleStyle(particle: any): any {
    return {
      left: `${particle.left}%`,
      width: `${particle.size}px`,
      height: `${particle.size}px`,
      animationDelay: `${particle.delay}s`
    };
  }

  // Méthode pour obtenir le style de progression
  getProgressStyle(value: number, max: number): any {
    const percentage = Math.min((value / max) * 100, 100);
    return {
      width: `${percentage}%`,
      background: `linear-gradient(90deg,
        rgba(255, 255, 255, 0.8),
        rgba(255, 255, 255, 1),
        rgba(255, 255, 255, 0.8))`
    };
  }

  // Données hebdomadaires pour les graphiques
  clientsWeeklyData = [
    { day: 'Lundi', value: 0 },
    { day: 'Mardi', value: 0 },
    { day: 'Mercredi', value: 0 },
    { day: 'Jeudi', value: 0 },
    { day: 'Vendredi', value: 0 },
    { day: 'Samedi', value: 0 },
    { day: 'Dimanche', value: 0 }
  ];

  accountsWeeklyData = [
    { day: 'Lundi', value: 0 },
    { day: 'Mardi', value: 0 },
    { day: 'Mercredi', value: 0 },
    { day: 'Jeudi', value: 0 },
    { day: 'Vendredi', value: 0 },
    { day: 'Samedi', value: 0 },
    { day: 'Dimanche', value: 0 }
  ];

  revenueWeeklyData = [
    { day: 'Lundi', value: 0 },
    { day: 'Mardi', value: 0 },
    { day: 'Mercredi', value: 0 },
    { day: 'Jeudi', value: 0 },
    { day: 'Vendredi', value: 0 },
    { day: 'Samedi', value: 0 },
    { day: 'Dimanche', value: 0 }
  ];

  newClientsThisWeek = 0;
  newAccountsThisWeek = 0;
  dailyRevenueThisWeek = 0; // Moyenne quotidienne
  revenueGrowth = 0;

  // Méthode pour calculer la hauteur des barres
  getBarHeight(value: number, data: any[]): number {
    if (!data || data.length === 0) return 0;
    const max = Math.max(...data.map(d => d.value));
    return max > 0 ? (value / max) * 100 : 0;
  }

  // Méthode pour calculer la position Y sur la courbe
  getY(index: number): number {
    const data = this.clientsWeeklyData; // Utilisez la donnée appropriée
    const value = data[index]?.value || 0;
    const max = Math.max(...data.map(d => d.value));
    return max > 0 ? 100 - (value / max) * 80 : 100; // Inversé pour SVG
  }

  // Méthode pour calculer les statistiques hebdomadaires
  calculateWeeklyStats(): void {
    this.transactionService.getRecentTransactions(100).subscribe({
      next: (transactions) => {
        this.initializeWeeklyData();
        this.processTransactionsForWeeklyData(transactions);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erreur chargement transactions pour statistiques:', error);
      }
    });

    this.clientService.getAllClients().subscribe({
      next: (clients) => {
        this.processClientsForWeeklyData(clients);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erreur chargement clients pour statistiques:', error);
      }
    });

    this.accountService.getAllAccounts().subscribe({
      next: (accounts) => {
        this.processAccountsForWeeklyData(accounts);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erreur chargement comptes pour statistiques:', error);
      }
    });
  }

  // Initialiser les données hebdomadaires à zéro
  private initializeWeeklyData(): void {
    this.clientsWeeklyData.forEach(d => d.value = 0);
    this.accountsWeeklyData.forEach(d => d.value = 0);
    this.revenueWeeklyData.forEach(d => d.value = 0);
  }

  // Traiter les transactions pour les revenus hebdomadaires
  private processTransactionsForWeeklyData(transactions: Transaction[]): void {
    const today = new Date();
    const dayOfWeek = today.getDay();
    
    transactions.forEach(transaction => {
      const dateValue = transaction.date || transaction.dateTransaction;
      if (dateValue) {
        const transDate = new Date(dateValue as string);
        const daysDiff = this.getDaysDifference(today, transDate);
        
        if (daysDiff >= -6 && daysDiff <= 0) {
          const dayIndex = (dayOfWeek + daysDiff + 7) % 7;
          const amount = transaction.amount || transaction.montant || 0;
          this.revenueWeeklyData[dayIndex].value += amount;
        }
      }
    });

    // Calculer la moyenne quotidienne
    const totalRevenue = this.revenueWeeklyData.reduce((sum, d) => sum + d.value, 0);
    this.dailyRevenueThisWeek = totalRevenue > 0 ? Math.floor(totalRevenue / 7) : 0;
  }

  // Traiter les clients pour les données hebdomadaires
  private processClientsForWeeklyData(clients: Client[]): void {
    const today = new Date();
    const dayOfWeek = today.getDay();
    
    clients.forEach(client => {
      if (client.dateCreation) {
        const createdDate = new Date(client.dateCreation);
        const daysDiff = this.getDaysDifference(today, createdDate);
        
        if (daysDiff >= -6 && daysDiff <= 0) {
          const dayIndex = (dayOfWeek + daysDiff + 7) % 7;
          this.clientsWeeklyData[dayIndex].value++;
        }
      }
    });

    this.newClientsThisWeek = this.clientsWeeklyData.reduce((sum, d) => sum + d.value, 0);
  }

  // Traiter les comptes pour les données hebdomadaires
  private processAccountsForWeeklyData(accounts: any[]): void {
    const today = new Date();
    const dayOfWeek = today.getDay();
    
    accounts.forEach(account => {
      if (account.dateCreation) {
        const createdDate = new Date(account.dateCreation);
        const daysDiff = this.getDaysDifference(today, createdDate);
        
        if (daysDiff >= -6 && daysDiff <= 0) {
          const dayIndex = (dayOfWeek + daysDiff + 7) % 7;
          this.accountsWeeklyData[dayIndex].value++;
        }
      }
    });

    this.newAccountsThisWeek = this.accountsWeeklyData.reduce((sum, d) => sum + d.value, 0);
  }

  // Calculer la différence en jours entre deux dates
  private getDaysDifference(date1: Date, date2: Date): number {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.floor((date1.getTime() - date2.getTime()) / oneDay);
  }

  // Calculer les statistiques d'aujourd'hui
  calculateTodayStats(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    this.transactionService.getRecentTransactions(100).subscribe({
      next: (transactions) => {
        this.todayStats.transactions = transactions.filter(t => {
          const dateValue = t.date || t.dateTransaction;
          if (!dateValue) return false;
          const transDate = new Date(dateValue as string);
          transDate.setHours(0, 0, 0, 0);
          return transDate.getTime() === today.getTime();
        }).length;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erreur chargement transactions pour aujourd\'hui:', error);
      }
    });

    this.clientService.getAllClients().subscribe({
      next: (clients) => {
        this.todayStats.newClients = clients.filter(c => {
          if (!c.dateCreation) return false;
          const createdDate = new Date(c.dateCreation as string);
          createdDate.setHours(0, 0, 0, 0);
          return createdDate.getTime() === today.getTime();
        }).length;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erreur chargement clients pour aujourd\'hui:', error);
      }
    });

    this.accountService.getAllAccounts().subscribe({
      next: (accounts) => {
        this.todayStats.newAccounts = accounts.filter(a => {
          if (!a.dateCreation) return false;
          const createdDate = new Date(a.dateCreation as string);
          createdDate.setHours(0, 0, 0, 0);
          return createdDate.getTime() === today.getTime();
        }).length;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erreur chargement comptes pour aujourd\'hui:', error);
      }
    });
  }}