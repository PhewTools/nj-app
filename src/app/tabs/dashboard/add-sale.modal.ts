import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonButton, IonContent, IonLabel, IonInput, IonIcon, IonCard, IonCardContent, IonDatetime, IonModal, IonDatetimeButton } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ModalController } from '@ionic/angular/standalone';
import { close, trash } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { ClientsService } from 'src/app/services/clients.service';
import { ItemService } from 'src/app/services/item.service';
import { DropdownSearchComponent } from 'src/app/components/dropdown-search/dropdown-search.component';

interface SaleItemInput {
  id: string;
  name: string;
  type: string;
  quantity: number;
  cost: number;
  total: number;
  discount: number;
  description: string;
  date?: Date;
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
    IonLabel,
    IonInput,
    IonIcon,
    IonCard,
    IonCardContent,
    FormsModule,
    CommonModule,
    DropdownSearchComponent,
    IonDatetime,
    IonModal,
    IonDatetimeButton
]
})
export class AddSaleModal implements OnInit {

  private _clientsService: ClientsService = inject(ClientsService);
  private _itemService: ItemService = inject(ItemService);

  @ViewChild('itemDropdown') itemDropdown!: DropdownSearchComponent;

  clients: any[] = [];
  items: any[] = [];

  selectedClient: any = null;
  selectedItem: any = null;
  date: string = new Date().toISOString().split('T')[0];
  quantity: number = 1;
  discount: number = 0;

  saleItems: SaleItemInput[] = [];
  total: number = 0;

  constructor(private modalController: ModalController) {
    addIcons({ close, trash });
  }

  ngOnInit() {
    this.loadClients();
    this.loadItems();
  }

  loadClients() {
    this._clientsService.getClients().subscribe({
      next: (clients) => {
        this.clients = clients.map(client => ({
          ...client,
          fullName: `${client.name} ${client.lastname}`
        }));
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

  onClientSelected(client: any) {
    this.selectedClient = client;
  }

  onItemSelected(item: any) {
    this.selectedItem = item;
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
    if (!this.selectedItem || this.quantity <= 0) {
      return;
    }

    const item = this.selectedItem;

    const saleItem: SaleItemInput = {
      id: item.id,
      name: item.name,
      description: item.description,
      type: item.type,
      quantity: this.quantity,
      cost: item.cost,
      discount: this.discount,
      total: this.quantity * item.cost - (item.cost * this.quantity * this.discount / 100),
    };

    this.saleItems.push(saleItem);
    this.calculateTotal();

    // Reset form
    this.selectedItem = null;
    this.quantity = 1;
    this.discount = 0;

    // Clear the dropdown search input
    if (this.itemDropdown) {
      this.itemDropdown.clearSelection();
    }
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
    if (!this.selectedClient || this.saleItems.length === 0) {
      return;
    }

    const saleData = {
      client_id: this.selectedClient.id,
      items: this.saleItems,
      total_cost: this.total,
      date: this.date
    };

    this.modalController.dismiss(saleData, 'confirm');
  }

  formatPrice(cost: number): string {
    return `$${cost.toFixed(2)}`;
  }
}

