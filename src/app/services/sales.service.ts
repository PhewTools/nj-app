import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpService } from '../shared/http.service';
import { Client } from '../tabs/clients/clients.utils';

export interface SaleItem {
  id: number;
  name: string;
  quantity: number;
  cost: number;
  total: number;
  description: string;
}

export interface Sale {
  id: string;
  date: string;
  clientId: number;
  client: Client;
  items: SaleItem[];
  total_cost: number;
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
  private readonly statsUrl = '/stats';

  constructor(private http: HttpService) {}

  getDashboardStats(month: number, year: number): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.statsUrl}`, { month, year });
  }

  getSalesByMonth(month: number, year: number): Observable<Sale[]> {
    return this.http.get<Sale[]>(`${this.baseUrl}/byMonth`, { month, year });
  }

  sortSalesByDate(sales: Sale[])  {
    // Group sales by date (YYYY-MM-DD, ignore time)
    const grouped: { [date: string]: Sale[] } = {};

    for (const sale of sales) {
      // Extract only the date part (remove time)
      const dateObj = new Date(sale.date);
      const dateStr = dateObj.toISOString().slice(0, 10); // 'YYYY-MM-DD'
      if (!grouped[dateStr]) {
        grouped[dateStr] = [];
      }
      grouped[dateStr].push(sale);
    }

    // Return array of { date, sales, total } sorted descending by date
    return Object.keys(grouped)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
      .map(date => {
        const daySales = grouped[date];
        const total = daySales.reduce((sum, s) => sum + (s.total_cost || 0), 0);
        return {
          date,
          sales: daySales,
          total
        };
      });
  }

  createSale(sale: Omit<Sale, 'id'>): Observable<Sale> {
    return this.http.post<Sale>(this.baseUrl, sale);
  }

  getSaleById(id: string): Observable<Sale> {
    return this.http.get<Sale>(`${this.baseUrl}/${id}`);
  }

  updateSale(id: string, sale: Partial<Sale>): Observable<Sale> {
    return this.http.put<Sale>(`${this.baseUrl}/${id}`, sale);
  }

  deleteSale(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
