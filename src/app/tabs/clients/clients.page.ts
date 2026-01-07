import { Component, importProvidersFrom, inject, Inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonSelect, IonSelectOption, IonDatetime, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, IonInput, IonSearchbar, IonIcon, IonFab, IonFabButton } from '@ionic/angular/standalone';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClientsService } from '../../services/clients.service';
import { ModalController, AlertController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, pencil, trash } from 'ionicons/icons';
import { AddClientModal } from './add-client.modal';
import { EditClientModal } from './edit-client.modal';

@Component({
  selector: 'app-clients',
  templateUrl: 'clients.page.html',
  styleUrls: ['clients.page.scss'],
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
    ReactiveFormsModule,
    CommonModule,
  ]
})
export class ClientsPage {
  clients: any[] = [];
  filteredClients: any[] = [];
  searchTerm: string = '';

  private _clientsService: ClientsService = inject(ClientsService);
  private _modalController: ModalController = inject(ModalController);
  private _alertController: AlertController = inject(AlertController);
  
  constructor(){
    addIcons({ add, pencil, trash });
    this.getAllClients();

  }

  loadMockData() {
    this.clients = [
      {
        id: '1',
        name: 'John',
        lastname: 'Doe',
        email: 'john.doe@example.com',
        birthdate: '1990-05-15',
        phonenumber: '555-0101'
      },
      {
        id: '2',
        name: 'Jane',
        lastname: 'Smith',
        email: 'jane.smith@example.com',
        birthdate: '1985-08-22',
        phonenumber: '555-0102'
      },
      {
        id: '3',
        name: 'Michael',
        lastname: 'Johnson',
        email: 'michael.johnson@example.com',
        birthdate: '1992-03-10',
        phonenumber: '555-0103'
      },
      {
        id: '4',
        name: 'Emily',
        lastname: 'Williams',
        email: 'emily.williams@example.com',
        birthdate: '1988-11-30',
        phonenumber: '555-0104'
      },
      {
        id: '5',
        name: 'David',
        lastname: 'Brown',
        email: 'david.brown@example.com',
        birthdate: '1995-01-18',
        phonenumber: '555-0105'
      },
      {
        id: '6',
        name: 'Sarah',
        lastname: 'Davis',
        email: 'sarah.davis@example.com',
        birthdate: '1991-07-25',
        phonenumber: '555-0106'
      }
    ];
    this.filteredClients = [...this.clients];
  }

  getAllClients(){
    this._clientsService.getClients().subscribe({
      next: (clients: any) => {
        this.clients = clients || [];
        this.filteredClients = [...this.clients];
      },
      error: (msg: any) => {
        console.log(`Error: ${msg}`)
        // Fallback to mock data on error
        this.loadMockData();
      }
    }) 
  }

  onSearchChange(event: any) {
    this.searchTerm = event.detail.value || '';
    this.filterClients();
  }

  filterClients() {
    if (!this.searchTerm.trim()) {
      this.filteredClients = [...this.clients];
      return;
    }

    const searchLower = this.searchTerm.toLowerCase().trim();
    this.filteredClients = this.clients.filter(client => {
      const name = `${client.name || ''} ${client.lastname || ''}`.toLowerCase();
      const email = (client.email || '').toLowerCase();
      return name.includes(searchLower) || email.includes(searchLower);
    });
  }

  async addClient() {
    const modal = await this._modalController.create({
      component: AddClientModal
    });
    
    await modal.present();
    
    const { data, role } = await modal.onWillDismiss();
    
    if (role === 'confirm' && data) {
      // Generate a temporary ID for the new client
      const newClient = {
        ...data
      };
      
      // Add to clients array
      this._clientsService.createClient(newClient).subscribe({
        next: (client) => {
          this.getAllClients();
        },
        error: (error) => {
          console.error('Error creating client:', error);
        }
      });
    }
  }

  async editClient(client: any) {
    const modal = await this._modalController.create({
      component: EditClientModal,
      componentProps: {
        clientData: client
      }
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm' && data) {
      const clientIndex = this.clients.findIndex(c => c.id === client.id);
      if (clientIndex !== -1) {
        this._clientsService.updateClient(client.id, data).subscribe({
          next: (updatedClient) => {
            // Update with server response if needed
            this.clients[clientIndex] = updatedClient;
            this.getAllClients();
          },
          error: (error) => {
            console.error('Error updating client:', error);
            this.getAllClients();
          }
        });
      } else {
        this.getAllClients();
      }
    } else {
      this.getAllClients();
    }
  }

  async deleteClient(id: number) {
    const alert = await this._alertController.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete this client? This action cannot be undone.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this._clientsService.deleteClient(id).subscribe({
              next: () => {
                this.getAllClients();
              },
              error: (error) => {
                console.error('Error deleting client:', error);
                this.getAllClients();
              }
            });
          }
        }
      ]
    });

    await alert.present();
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'short', 
      day: 'numeric' 
    });
  }
}
