import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
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
  @ViewChild('clientForm') clientForm!: NgForm;

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
        // Formater la date pour l'input HTML
        if (this.client.dateNaissance) {
          this.client.dateNaissance = this.formatDateForInput(this.client.dateNaissance);
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement du client', error);
        this.errorMessage = 'Erreur lors du chargement du client';
      }
    });
  }

  formatDateForInput(dateString: string): string {
    // Convertir la date au format YYYY-MM-DD pour l'input date
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  onSubmit(): void {
    // Vérifier la validation du formulaire
    if (this.clientForm.invalid) {
      this.markFormGroupTouched(this.clientForm);
      this.errorMessage = 'Veuillez corriger les erreurs dans le formulaire';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    if (this.isEditMode && this.clientId) {
      this.clientService.updateClient(this.clientId, this.client).subscribe({
        next: () => {
          this.router.navigate(['/clients']);
        },
        error: (error) => {
          console.error('Erreur lors de la modification:', error);
          this.errorMessage = error.error?.message || 
            error.error?.details?.join(', ') || 
            'Erreur lors de la modification du client';
          this.isLoading = false;
        }
      });
    } else {
      this.clientService.createClient(this.client).subscribe({
        next: () => {
          this.router.navigate(['/clients']);
        },
        error: (error) => {
          console.error('Erreur lors de la création:', error);
          this.errorMessage = error.error?.message || 
            error.error?.details?.join(', ') || 
            'Erreur lors de la création du client';
          this.isLoading = false;
        }
      });
    }
  }

  // Méthode pour marquer tous les champs comme touchés (validation)
  private markFormGroupTouched(formGroup: NgForm): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }
}