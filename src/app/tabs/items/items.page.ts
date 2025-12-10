import { Component, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonIcon, IonCard, IonCardContent, IonFab, IonFabButton } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ItemService } from '../../services/item.service';
import { ModalController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, pencil, trash } from 'ionicons/icons';
import { AddItemModal } from './add-item.modal';
import { EditItemModal } from './edit-item.modal';
import { Item } from './items.utils';


@Component({
  selector: 'app-items',
  templateUrl: 'items.page.html',
  styleUrls: ['items.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonFab,
    IonFabButton,
    IonSearchbar,
    IonIcon,
    IonCard,
    IonCardContent,
    FormsModule,
    CommonModule
  ]
})
export class ItemsPage {
  items: Item[] = [];
  filteredItems: Item[] = [];
  searchTerm: string = '';

  private _itemService: ItemService = inject(ItemService);
  private _modalController: ModalController = inject(ModalController);

  constructor() {
    addIcons({ add, pencil, trash });
    this.getAllItems(); // Uncomment when API is ready
  }

  loadMockData() {
    this.items = [
      {
        id: '1',
        name: 'item',
        type: 'product',
        cost: 200.00,
        description: 'someitem'
      },
      {
        id: '2',
        name: 'cejas',
        type: 'service',
        cost: 200.00
      },
      {
        id: '3',
        name: 'Haircut',
        type: 'service',
        cost: 50.00,
        description: 'Professional haircut service'
      },
      {
        id: '4',
        name: 'Shampoo',
        type: 'product',
        cost: 15.99,
        description: 'Premium hair shampoo'
      },
      {
        id: '5',
        name: 'Hair Color',
        type: 'service',
        cost: 120.00,
        description: 'Full hair coloring service'
      }
    ];
    this.filteredItems = [...this.items];
  }

  getAllItems() {
    this._itemService.getItems().subscribe({
      next: (items: any) => {
        this.items = items || [];
        this.filteredItems = [...this.items];
      },
      error: (msg: any) => {
        console.log(`Error: ${msg}`);
        this.loadMockData();
      }
    });
  }

  onSearchChange(event: any) {
    this.searchTerm = event.detail.value || '';
    this.filterItems();
  }

  filterItems() {
    if (!this.searchTerm.trim()) {
      this.filteredItems = [...this.items];
      return;
    }

    const searchLower = this.searchTerm.toLowerCase().trim();
    this.filteredItems = this.items.filter(item => {
      const name = (item.name || '').toLowerCase();
      const description = (item.description || '').toLowerCase();
      return name.includes(searchLower) || description.includes(searchLower);
    });
  }

  async addItem() {
    const modal = await this._modalController.create({
      component: AddItemModal
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm' && data) {
      const newItem: Item = {
        ...data
      };

      this.items.push(newItem);
      this.filterItems();

      this._itemService.createItem(newItem).subscribe({
        next: (item) => {
          // Update with server response if needed
        },
        error: (error) => {
          console.error('Error creating item:', error);
        }
      });
    }
  }

  async editItem(item: Item) {
    const modal = await this._modalController.create({
      component: EditItemModal,
      componentProps: {
        itemData: item
      }
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm' && data) {
      const itemIndex = this.items.findIndex(i => i.id === item.id);
      if (itemIndex !== -1) {
        this._itemService.updateItem(item.id, data).subscribe({
          next: (updatedItem) => {
            this.getAllItems();
          },
          error: (error) => {
            console.error('Error updating item:', error);
          }
        });
      }
    }
  }

  deleteItem(item: Item) {
    this._itemService.deleteItem(item.id).subscribe({
      next: () => {
        this.getAllItems();
      },
      error: (error) => {
        console.error('Error deleting item:', error);
      }
    });
  }

  formatPrice(cost: number): string {
    return `$${cost.toFixed(2)}`;
  }
}
