import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../shared/http.service';
import { Item } from '../tabs/items/items.utils';


@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private readonly baseUrl = '/item';

  constructor(private http: HttpService) {}

  getItems(params?: any): Observable<Item[]> {
    return this.http.get<Item[]>(this.baseUrl, params);
  }

  getItemById(id: string): Observable<Item> {
    return this.http.get<Item>(`${this.baseUrl}/${id}`);
  }

  createItem(product: Omit<Item, 'id'>): Observable<Item> {
    return this.http.post<Item>(this.baseUrl, product);
  }

  updateItem(id: string, product: Partial<Item>): Observable<Item> {
    return this.http.put<Item>(`${this.baseUrl}/${id}`, product);
  }

  deleteItem(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
