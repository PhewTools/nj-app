import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonList, IonItem, IonLabel, IonFab, IonFabButton, IonIcon, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { addOutline, cashOutline, cartOutline, peopleOutline, cubeOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { FormsModule } from '@angular/forms';
import { SalesService, DashboardStats, SalesByDay, Sale } from '../../services/sales.service';
import { ModalController } from '@ionic/angular/standalone';
import { AddSaleModal } from './add-sale.modal';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.page.html',
  styleUrls: ['dashboard.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonList, IonItem, IonLabel, IonFab, IonFabButton, IonIcon, IonSelect, IonSelectOption, FormsModule],
})
export class DashboardPage implements OnInit {
  selectedMonth = new Date().getMonth() + 1;
  selectedYear = new Date().getFullYear();
  stats: DashboardStats = { revenue: 0, salesCount: 0, clientsCount: 0, productsCount: 0 };
  salesByDay: SalesByDay[] = [];
  sales: Sale[] = [];

  months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];

  years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i);

  private _modalController: ModalController = inject(ModalController);
  private _router: Router = inject(Router);

  constructor(private salesService: SalesService) {
    addIcons({ addOutline, cashOutline, cartOutline, peopleOutline, cubeOutline });
  }

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    // Load stats
    this.salesService.getDashboardStats(this.selectedMonth, this.selectedYear).subscribe({
      next: (stats) => {
        this.stats = stats;
      },
      error: (error) => {
        console.error('Error loading dashboard stats:', error);
        // Use mock data for now
        this.stats = { 
          revenue: 481.96, 
          salesCount: 5, 
          clientsCount: 5, 
          productsCount: 7 
        };
      }
    });

    // Load sales by day
    this.salesService.getSalesByMonth(this.selectedMonth, this.selectedYear).subscribe({
      next: (sales: Sale[]) => {
        this.sales = sales;
        this.salesByDay = this.salesService.sortSalesByDate(sales);
      },
      error: (error) => {
        console.error('Error loading sales:', error);
        // Use mock data for now
      }
    });
  }

  onMonthYearChange() {
    this.loadDashboardData();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  getMonthLabel(): string {
    const month = this.months.find(m => m.value === this.selectedMonth);
    return month ? `${month.label} ${this.selectedYear}` : 'Select Month';
  }

  async addSale() {
    const modal = await this._modalController.create({
      component: AddSaleModal
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm' && data) {
      // Create the sale
      this.salesService.createSale(data).subscribe({
        next: (sale) => {
          console.log('Sale created:', sale);
          // Reload dashboard data
          this.loadDashboardData();
        },
        error: (error) => {
          console.error('Error creating sale:', error);
        }
      });
    }
  }

  viewSaleDetails(sale: Sale) {
    this._router.navigate(['/tabs/sale-details', sale.id], {
      state: { sale } // Pass sale data in state as fallback
    });
  }
}
