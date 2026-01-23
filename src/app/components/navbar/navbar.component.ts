import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AuthResponse } from '../../models/auth.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  currentUser: AuthResponse | null = null;
  showDropdown: boolean = false;
  showNotification: boolean = false;
  hasNewClients: boolean = false;
  newClientsCount: number = 0;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  getUserInitial(): string {
    if (!this.currentUser || !this.currentUser.username) {
      return 'U';
    }
    return this.currentUser.username.charAt(0).toUpperCase();
  }

  getUserColor(): string {
    if (!this.currentUser || !this.currentUser.username) {
      return '#667eea';
    }
    
    // Générer une couleur basée sur le username
    const colors = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
      'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
    ];
    
    const index = this.currentUser.username.charCodeAt(0) % colors.length;
    return colors[index];
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  // Fermer le dropdown quand on clique ailleurs
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-dropdown')) {
      this.showDropdown = false;
    }
  }

  logout(): void {
    // Afficher la notification
    this.showNotification = true;
    
    // Fermer le dropdown
    this.showDropdown = false;
    
    // Déconnexion et redirection après un court délai
    setTimeout(() => {
      this.authService.logout();
      this.router.navigate(['/login']);
      this.showNotification = false;
    }, 1500);
  }
}