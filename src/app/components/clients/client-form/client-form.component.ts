import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar.component';
import { ClientService } from '../../../services/client.service';
import { Client } from '../../../models/client.model';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent],
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.css']
})
export class ClientFormComponent implements OnInit {
  client: Client = {
    nom: '',
    prenom: '',
    dateNaissance: '',
    sexe: 'MASCULIN',
    adresse: '',
    numeroTelephone: '',
    courriel: '',
    nationalite: ''
  };

  isEditMode: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';
  clientId: number | null = null;

  constructor(
    private clientService: ClientService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.clientId = +params['id'];
        this.loadClient(this.clientId);
      }
    });
  }

  loadClient(id: number): void {
    this.clientService.getClientById(id).subscribe({
      next: (data) => {
        this.client = data;
      },
      error: (error) => {
        console.error('Erreur lors du chargement du client', error);
        this.errorMessage = 'Erreur lors du chargement du client';
      }
    });
  }

  onSubmit(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Loggez les données avant l'envoi
    console.log('Données envoyées:', this.client);

    if (this.isEditMode && this.clientId) {
      this.clientService.updateClient(this.clientId, this.client).subscribe({
        next: () => {
          this.router.navigate(['/clients']);
        },
        error: (error) => {
          console.error('Erreur complète:', error);
          console.error('Message d\'erreur:', error.error);
          this.errorMessage = error.error?.message || error.error?.details?.join(', ') || 'Erreur lors de la modification du client';
          this.isLoading = false;
        }
      });
    } else {
      this.clientService.createClient(this.client).subscribe({
        next: () => {
          this.router.navigate(['/clients']);
        },
        error: (error) => {
          console.error('Erreur complète:', error);
          console.error('Message d\'erreur:', error.error);
          this.errorMessage = error.error?.message || error.error?.details?.join(', ') || 'Erreur lors de la création du client';
          this.isLoading = false;
        }
      });
    }
  }
}
