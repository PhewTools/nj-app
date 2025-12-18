import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonSpinner,
  ToastController,
  LoadingController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { eyeOutline, eyeOffOutline, alertCircleOutline } from 'ionicons/icons';
import { LoginService } from '../services/login.service';
import { AuthService } from '../services/auth.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonIcon,
    IonSpinner,
    CommonModule,
    FormsModule
  ]
})
export class LoginPage implements OnInit {
  credentials = {
    email: '',
    password: ''
  };

  showPassword = false;
  isLoading = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private loginService: LoginService,
    private authService: AuthService
  ) {
    addIcons({ eyeOutline, eyeOffOutline, alertCircleOutline });
  }

  ngOnInit() {
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  async onLogin() {
    if (!this.credentials.email || !this.credentials.password) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.loginService.login(this.credentials.email, this.credentials.password)
      .pipe(
        catchError((error) => {
          const errorMessage = error.error?.message || error.message || 'Login failed. Please try again.';
          return of({ error: errorMessage });
        })
      )
      .subscribe({
        next: (response: any) => {
          if (response.error) {
            this.errorMessage = response.error;
            this.isLoading = false;
            return;
          }

          // Store authentication data
          this.authService.setAuth(response);

          // Show success message
          this.toastController.create({
            message: 'Login successful!',
            duration: 2000,
            color: 'success',
            position: 'top'
          }).then(toast => toast.present());

          // Navigate to tabs after successful login
          this.router.navigate(['/tabs/dashboard']);
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = error.error?.message || error.message || 'Login failed. Please try again.';
          this.isLoading = false;
        }
      });
  }
}
