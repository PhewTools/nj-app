import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { HttpService } from '../shared/http.service';

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Sale {
  id: string;
  date: string;
  clientId: string;
  clientName: string;
  items: SaleItem[];
  total: number;
}

export interface DashboardStats {
  revenue: number;
  salesCount: number;
  clientsCount: number;
  productsCount: number;
}

export interface SalesByDay {
  date: string;
  sales: Sale[];
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  private readonly baseUrl = '/entry';
  private readonly dashboardUrl = '/dashboard';

  constructor(private http: HttpService) {}

  getDashboardStats(month: number, year: number): Observable<DashboardStats> {
    // Mock data for testing
    const mockStats: DashboardStats = {
      revenue: 481.96,
      salesCount: 5,
      clientsCount: 5,
      productsCount: 7
    };

    // Return mock data for testing (simulate API delay)
    return of(mockStats).pipe(delay(300));
    
    // Uncomment below to use real API
    // return this.http.get<DashboardStats>(`${this.dashboardUrl}/stats`, { month, year });
  }

  getSalesByMonth(month: number, year: number): Observable<SalesByDay[]> {
    // Mock data for testing
    // Create mock sales flat, then group by date
    const mockSalesFlat: Sale[] = [
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
      },
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
      },
      { 
        id: '3', 
        date: '2025-01-16T09:15:00', 
        clientId: '3',
        clientName: 'Michael Johnson',
        items: [
          { productId: '1', productName: 'Haircut', quantity: 1, unitPrice: 50.00, total: 50.00 }
        ], 
        total: 50.00 
      },
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
      },
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
    ];

    // Group sales by date (YYYY-MM-DD)
    const salesByDateMap = new Map<string, Sale[]>();
    for (const sale of mockSalesFlat) {
      const date = sale.date.slice(0, 10); // 'YYYY-MM-DD'
      if (!salesByDateMap.has(date)) {
        salesByDateMap.set(date, []);
      }
      salesByDateMap.get(date)!.push(sale);
    }

    const mockSalesByDay: SalesByDay[] = Array.from(salesByDateMap.entries()).map(([date, sales]) => ({
      date,
      sales,
      total: sales.reduce((sum, sale) => sum + sale.total, 0)
    }));

    // Optionally, sort by date ascending
    mockSalesByDay.sort((a, b) => a.date.localeCompare(b.date));


    // Return mock data for testing (simulate API delay)
    return of(mockSalesByDay).pipe(delay(300));
    
    // Uncomment below to use real API
    // return this.http.get<SalesByDay[]>(this.baseUrl, { month, year });
  }

  createSale(sale: Omit<Sale, 'id'>): Observable<Sale> {
    return this.http.post<Sale>(this.baseUrl, sale);
  }

  getSaleById(id: string): Observable<Sale> {
    // Mock data for testing
    const mockSales: { [key: string]: Sale } = {
      '1': {
        id: '1',
        date: '2025-01-15T10:30:00',
        clientId: '1',
        clientName: 'John Doe',
        items: [
          { productId: '1', productName: 'Haircut', quantity: 1, unitPrice: 50.00, total: 50.00 },
          { productId: '2', productName: 'Shampoo', quantity: 2, unitPrice: 15.99, total: 31.98 }
        ],
        total: 81.98
      },
      '2': {
        id: '2',
        date: '2025-01-16T14:20:00',
        clientId: '2',
        clientName: 'Jane Smith',
        items: [
          { productId: '3', productName: 'Hair Color', quantity: 1, unitPrice: 120.00, total: 120.00 },
          { productId: '4', productName: 'Hair Treatment', quantity: 1, unitPrice: 45.00, total: 45.00 }
        ],
        total: 165.00
      },
      '3': {
        id: '3',
        date: '2025-01-17T09:15:00',
        clientId: '3',
        clientName: 'Michael Johnson',
        items: [
          { productId: '1', productName: 'Haircut', quantity: 1, unitPrice: 50.00, total: 50.00 }
        ],
        total: 50.00
      },
      '4': {
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
      },
      '5': {
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
    };

    // Try to get from mock data first
    if (mockSales[id]) {
      return of(mockSales[id]).pipe(delay(500)); // Simulate API delay
    }

    // Fallback to API call
    return this.http.get<Sale>(`${this.baseUrl}/${id}`);
  }

  updateSale(id: string, sale: Partial<Sale>): Observable<Sale> {
    return this.http.put<Sale>(`${this.baseUrl}/${id}`, sale);
  }

  deleteSale(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
