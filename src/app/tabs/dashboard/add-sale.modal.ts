import { Component, inject, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonButton, IonContent, IonItem, IonLabel, IonInput, IonIcon, IonSelect, IonSelectOption, IonCard, IonCardContent } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ModalController } from '@ionic/angular/standalone';
import { close, trash } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { ClientsService } from 'src/app/services/clients.service';
import { ItemService } from 'src/app/services/item.service';

interface SaleItemInput {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

@Component({
  selector: 'app-add-sale-modal',
  templateUrl: './add-sale.modal.html',
  styleUrls: ['./add-sale.modal.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonIcon,
    IonSelect,
    IonSelectOption,
    IonCard,
    IonCardContent,
    FormsModule,
    CommonModule
  ]
})
export class AddSaleModal implements OnInit {
  
  private _clientsService: ClientsService = inject(ClientsService);
  private _itemService: ItemService = inject(ItemService);

  clients: any[] = [];
  items: any[] = [];
  
  selectedClientId: string = '';
  selectedItemId: string = '';
  quantity: number = 1;
  
  saleItems: SaleItemInput[] = [];
  total: number = 0;

  constructor(private modalController: ModalController) {
    addIcons({ close, trash });
  }

  ngOnInit() {
    // this.loadMockData();
    this.loadClients();
    this.loadItems();
  }

  loadClients() {
    this._clientsService.getClients().subscribe({
      next: (clients) => {
        this.clients = clients;
      },
      error: (error) => {
        console.error('Error loading clients:', error);
      }
    });
  }

  loadItems() {
    this._itemService.getItems().subscribe({
      next: (items) => {
        this.items = items;
      },
      error: (error) => {
        console.error('Error loading items:', error);
      }
    });
  }

  loadMockData() {
    // Mock clients data
    this.clients = [
      {
        id: '1',
        name: 'John',
        lastname: 'Doe',
        email: 'john.doe@example.com',
        phonenumber: '555-0101'
      },
      {
        id: '2',
        name: 'Jane',
        lastname: 'Smith',
        email: 'jane.smith@example.com',
        phonenumber: '555-0102'
      },
      {
        id: '3',
        name: 'Michael',
        lastname: 'Johnson',
        email: 'michael.johnson@example.com',
        phonenumber: '555-0103'
      },
      {
        id: '4',
        name: 'Emily',
        lastname: 'Williams',
        email: 'emily.williams@example.com',
        phonenumber: '555-0104'
      }
    ];

    // Mock items data
    this.items = [
      {
        id: '1',
        name: 'item',
        type: 'product',
        price: 12.00,
        description: 'someitem'
      },
      {
        id: '2',
        name: 'cejas',
        type: 'service',
        price: 200.00
      },
      {
        id: '3',
        name: 'Haircut',
        type: 'service',
        price: 50.00,
        description: 'Professional haircut service'
      },
      {
        id: '4',
        name: 'Shampoo',
        type: 'product',
        price: 15.99,
        description: 'Premium hair shampoo'
      },
      {
        id: '5',
        name: 'Hair Color',
        type: 'service',
        price: 120.00,
        description: 'Full hair coloring service'
      },
      {
        id: '6',
        name: 'Hair Treatment',
        type: 'service',
        price: 80.00,
        description: 'Deep conditioning treatment'
      }
    ];
  }

  getClientName(clientId: string): string {
    const client = this.clients.find(c => c.id === clientId);
    return client ? `${client.name} ${client.lastname}` : '';
  }

  getItemName(itemId: string): string {
    const item = this.items.find(i => i.id === itemId);
    return item ? item.name : '';
  }

  addItem() {
    if (!this.selectedItemId || this.quantity <= 0) {
      return;
    }

    const item = this.items.find(i => i.id === this.selectedItemId);
    if (!item) return;

    const saleItem: SaleItemInput = {
      productId: item.id,
      productName: item.name,
      quantity: this.quantity,
      unitPrice: item.cost,
      total: this.quantity * item.cost
    };

    this.saleItems.push(saleItem);
    this.calculateTotal();
    
    // Reset form
    this.selectedItemId = '';
    this.quantity = 1;
  }

  removeItem(index: number) {
    this.saleItems.splice(index, 1);
    this.calculateTotal();
  }

  calculateTotal() {
    this.total = this.saleItems.reduce((sum, item) => sum + item.total, 0);
  }

  cancel() {
    this.modalController.dismiss(null, 'cancel');
  }

  completeSale() {
    if (!this.selectedClientId || this.saleItems.length === 0) {
      return;
    }

    const client = this.clients.find(c => c.id === this.selectedClientId);
    if (!client) return;

    const saleData = {
      date: new Date().toISOString().split('T')[0],
      clientId: this.selectedClientId,
      clientName: `${client.name} ${client.lastname}`,
      items: this.saleItems,
      total: this.total
    };

    this.modalController.dismiss(saleData, 'confirm');
  }

  formatPrice(cost: number): string {
    return `$${cost.toFixed(2)}`;
  }
}

