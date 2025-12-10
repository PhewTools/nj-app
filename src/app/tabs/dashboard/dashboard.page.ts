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
      next: (sales) => {
        this.salesByDay = sales;
      },
      error: (error) => {
        console.error('Error loading sales:', error);
        // Use mock data for now
        this.salesByDay = [
          {
            date: '2025-01-15',
            total: 81.98,
            sales: [
              { 
                id: '1', 
                date: '2025-01-15T10:30:00', 
                clientId: '1',
                clientName: 'John Doe',
                items: [
                  { productId: '1', productName: 'Haircut', quantity: 1, unitPrice: 50.00, total: 50.00 },
                  { productId: '2', productName: 'Shampoo', quantity: 2, unitPrice: 15.99, total: 31.98 }
                ], 
                total: 81.98 
              }
            ]
          },
          {
            date: '2025-01-16',
            total: 165.00,
            sales: [
              { 
                id: '2', 
                date: '2025-01-16T14:20:00', 
                clientId: '2',
                clientName: 'Jane Smith',
                items: [
                  { productId: '3', productName: 'Hair Color', quantity: 1, unitPrice: 120.00, total: 120.00 },
                  { productId: '4', productName: 'Hair Treatment', quantity: 1, unitPrice: 45.00, total: 45.00 }
                ], 
                total: 165.00 
              }
            ]
          },
          {
            date: '2025-01-17',
            total: 50.00,
            sales: [
              { 
                id: '3', 
                date: '2025-01-17T09:15:00', 
                clientId: '3',
                clientName: 'Michael Johnson',
                items: [
                  { productId: '1', productName: 'Haircut', quantity: 1, unitPrice: 50.00, total: 50.00 }
                ], 
                total: 50.00 
              }
            ]
          },
          {
            date: '2025-01-18',
            total: 109.98,
            sales: [
              { 
                id: '4', 
                date: '2025-01-18T16:45:00', 
                clientId: '4',
                clientName: 'Emily Williams',
                items: [
                  { productId: '5', productName: 'Hair Styling', quantity: 1, unitPrice: 75.00, total: 75.00 },
                  { productId: '2', productName: 'Shampoo', quantity: 1, unitPrice: 15.99, total: 15.99 },
                  { productId: '6', productName: 'Conditioner', quantity: 1, unitPrice: 18.99, total: 18.99 }
                ], 
                total: 109.98 
              }
            ]
          },
          {
            date: '2025-01-19',
            total: 75.00,
            sales: [
              { 
                id: '5', 
                date: '2025-01-19T11:00:00', 
                clientId: '5',
                clientName: 'David Brown',
                items: [
                  { productId: '1', productName: 'Haircut', quantity: 1, unitPrice: 50.00, total: 50.00 },
                  { productId: '7', productName: 'Beard Trim', quantity: 1, unitPrice: 25.00, total: 25.00 }
                ], 
                total: 75.00 
              }
            ]
          }
        ];
      }
    });
  }

  onMonthYearChange() {
    this.loadDashboardData();
  }

  formatDate(dateString: string): string {
    console.log(dateString);
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
