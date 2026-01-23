import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegisterRequest } from '../../models/auth.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerData: RegisterRequest = {
    username: '',
    password: '',
    email: '',
    firstName: '',
    lastName: ''
  };

  confirmPassword: string = '';
  acceptedTerms: boolean = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  errorMessage: string = '';
  isLoading: boolean = false;

  // Variables pour la force du mot de passe
  passwordStrength: number = 0;
  hasUppercase: boolean = false;
  hasNumber: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.register(this.registerData).subscribe({
      next: (response) => {
        console.log('Inscription réussie', response);
        this.isLoading = false;
        
        // Redirection après inscription réussie
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (error) => {
        console.error('Erreur d\'inscription', error);
        this.errorMessage = error.error?.message || 
          error.error?.details?.join(', ') || 
          'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.';
        this.isLoading = false;
      }
    });
  }

  // Validation complète du formulaire
  private validateForm(): boolean {
    if (!this.registerData.username || !this.registerData.password || 
        !this.registerData.email || !this.registerData.firstName || 
        !this.registerData.lastName) {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires';
      return false;
    }

    if (this.registerData.password !== this.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas';
      return false;
    }

    if (!this.acceptedTerms) {
      this.errorMessage = 'Vous devez accepter les conditions d\'utilisation';
      return false;
    }

    if (this.registerData.password.length < 6) {
      this.errorMessage = 'Le mot de passe doit contenir au moins 6 caractères';
      return false;
    }

    return true;
  }

  // Vérifier si les mots de passe correspondent
  passwordsMatch(): boolean {
    return this.registerData.password === this.confirmPassword;
  }

  // Vérifier la force du mot de passe
  checkPasswordStrength(): void {
    const password = this.registerData.password;
    if (!password) {
      this.passwordStrength = 0;
      return;
    }

    let strength = 0;
    
    // Longueur
    if (password.length >= 6) strength += 25;
    if (password.length >= 10) strength += 15;
    
    // Majuscule
    this.hasUppercase = /[A-Z]/.test(password);
    if (this.hasUppercase) strength += 20;
    
    // Chiffre
    this.hasNumber = /\d/.test(password);
    if (this.hasNumber) strength += 20;
    
    // Caractère spécial
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 20;
    
    this.passwordStrength = Math.min(strength, 100);
  }

  // Obtenir la couleur selon la force
  getStrengthColor(): string {
    if (this.passwordStrength < 40) return '#DC3545'; // Faible
    if (this.passwordStrength < 70) return '#FFC107'; // Moyen
    return '#28A745'; // Fort
  }

  // Obtenir le texte selon la force
  getStrengthText(): string {
    if (this.passwordStrength < 40) return 'Faible';
    if (this.passwordStrength < 70) return 'Moyen';
    return 'Fort';
  }

  // Basculer la visibilité du mot de passe principal
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // Basculer la visibilité de la confirmation
  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}