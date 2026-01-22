import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar.component';
import { ClientService } from '../../../services/client.service';
import { Client } from '../../../models/client.model';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']
})
export class ClientListComponent implements OnInit {
  clients: Client[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private clientService: ClientService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('ClientList - ngOnInit appelé');
    this.loadClients();
  }

  loadClients(): void {
    this.isLoading = true;
    console.log('ClientList - Chargement des clients...');

    this.clientService.getAllClients().subscribe({
      next: (data) => {
        console.log('ClientList - Clients reçus:', data);
        this.clients = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('ClientList - Erreur:', error);
        this.errorMessage = 'Erreur lors du chargement des clients';
        this.isLoading = false;
      }
    });
  }

  deleteClient(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      this.clientService.deleteClient(id).subscribe({
        next: () => {
          this.loadClients();
        },
        error: (error) => {
          console.error('Erreur lors de la suppression', error);
          alert('Erreur lors de la suppression du client');
        }
      });
    }
  }

  editClient(id: number): void {
    this.router.navigate(['/clients/edit', id]);
  }
}
