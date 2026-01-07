import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonContent,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonList,
  IonBackButton,
  IonButtons,
  IonSpinner,
  AlertController
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { SalesService, Sale } from '../../services/sales.service';
import { addIcons } from 'ionicons';
import { arrowBack, personOutline, calendarOutline, receiptOutline, cashOutline, trashOutline } from 'ionicons/icons';
import { formatDateTime } from '../../shared/utils';

@Component({
  selector: 'app-sale-details',
  templateUrl: './sale-details.page.html',
  styleUrls: ['./sale-details.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonContent,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonList,
    IonBackButton,
    IonButtons,
    IonSpinner,
    CommonModule
  ]
})
export class SaleDetailsPage implements OnInit {
  sale: Sale | null = null;
  isLoading = true;
  saleId: string | null = null;

  private _salesService: SalesService = inject(SalesService);
  private _route: ActivatedRoute = inject(ActivatedRoute);
  private _router: Router = inject(Router);
  private _alertController: AlertController = inject(AlertController);

  constructor() {
    addIcons({ arrowBack, personOutline, calendarOutline, receiptOutline, cashOutline, trashOutline });
  }

  ngOnInit() {
    this.saleId = this._route.snapshot.paramMap.get('id');
    
    if (this.saleId) {
      this.loadSaleDetails();
    } else {
      // If no ID, try to get sale from state (if navigated with state)
      const navigation = this._router.currentNavigation();
      if (navigation?.extras?.state?.['sale']) {
        this.sale = navigation.extras.state['sale'];
        this.isLoading = false;
      } else {
        // Redirect back if no sale data
        this._router.navigate(['/tabs/dashboard']);
      }
    }
  }

  loadSaleDetails() {
    if (!this.saleId) return;

    this._salesService.getSaleById(this.saleId).subscribe({
      next: (sale) => {
        this.sale = sale;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading sale details:', error);
        this.isLoading = false;
        
        // Try to get sale from navigation state as fallback
        const navigation = this._router.getCurrentNavigation();
        const historyState = window.history.state;
        if (historyState?.sale) {
          this.sale = historyState.sale;
        } else if (navigation?.extras?.state?.['sale']) {
          this.sale = navigation.extras.state['sale'];
        } else {
          // Redirect back if no sale data available
          this._router.navigate(['/tabs/dashboard']);
        }
      }
    });
  }

  formatDate(dateString: string): string {
    return formatDateTime(dateString);
  }

  formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }

  goBack() {
    this._router.navigate(['/tabs/dashboard']);
  }
  async deleteSale() {
    if (!this.saleId) return;

    const alert = await this._alertController.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete this sale? This action cannot be undone.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Delete',
          role: 'destructive',
          cssClass: 'danger',
          handler: () => {
            this._salesService.deleteSale(this.saleId!).subscribe({
              next: () => {
                this._router.navigate(['/tabs/dashboard']);
              },
              error: (error) => {
                console.error('Error deleting sale:', error);
              }
            });
          }
        }
      ]
    });

    await alert.present();
  }
}
