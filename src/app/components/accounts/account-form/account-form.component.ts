import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { NavbarComponent } from "../../navbar/navbar.component";
import { AccountService } from '../../../services/account.service';
import { ClientService } from '../../../services/client.service';
import { Account } from '../../../models/account.model';
import { Client } from '../../../models/client.model';

@Component({
  selector: 'app-account-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent],
  templateUrl: './account-form.component.html',
  styleUrls: ['./account-form.component.css']
})
export class AccountFormComponent implements OnInit {
  account: Account = {
    typeCompte: 'COMPTE_COURANT',
    proprietaireId: 0
  };

  clients: Client[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  selectedClientId: number | null = null;

  constructor(
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
        this.account.proprietaireId = this.selectedClientId;
      }
    });
    
    this.loadClients();
  }

  loadClients(): void {
    this.clientService.getAllClients().subscribe({
      next: (data) => {
        this.clients = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des clients', error);
        this.errorMessage = 'Erreur lors du chargement des clients. Veuillez réessayer.';
      }
    });
  }

  // Méthode pour obtenir le nom du client sélectionné
  getSelectedClientName(): string {
    if (!this.account.proprietaireId) return '';
    const client = this.clients.find(c => c.id === this.account.proprietaireId);
    return client ? `${client.prenom} ${client.nom}` : '';
  }

  onSubmit(): void {
    if (!this.accountFormValid()) {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires correctement.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.accountService.createAccount(this.account).subscribe({
      next: () => {
        this.isLoading = false;
        // Redirection après succès
        setTimeout(() => {
          this.router.navigate(['/accounts']);
        }, 1500);
      },
      error: (error) => {
        console.error('Erreur lors de la création', error);
        this.errorMessage = error.error?.message || 
          'Erreur lors de la création du compte. Veuillez vérifier les informations.';
        this.isLoading = false;
      }
    });
  }

  // Validation du formulaire
  private accountFormValid(): boolean {
    return !!this.account.typeCompte && 
           !!this.account.proprietaireId && 
           this.account.proprietaireId !== 0;
  }
}