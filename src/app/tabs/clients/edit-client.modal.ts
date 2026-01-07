import { Component, Input, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonButton, IonContent, IonItem, IonLabel, IonInput, IonIcon } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ModalController } from '@ionic/angular/standalone';
import { close } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-edit-client-modal',
  templateUrl: './edit-client.modal.html',
  styleUrls: ['./edit-client.modal.scss'],
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
    FormsModule,
    CommonModule
  ]
})
export class EditClientModal implements OnInit {
  @Input() clientData!: any;

  client = {
    name: '',
    lastname: '',
    email: '',
    birth_date: '',
    phone_number: '',
    address: ''
  };

  constructor(private modalController: ModalController) {
    addIcons({ close });
  }

  private formatPhoneNumberString(phoneNumber: string): string {
    if (!phoneNumber) return '';
    let value = phoneNumber.replace(/\D/g, ''); // Remove all non-digits
    if (value.length > 10) {
      value = value.substring(0, 10); // Limit to 10 digits
    }
    
    // Format as ###-###-####
    if (value.length > 6) {
      value = value.substring(0, 3) + '-' + value.substring(3, 6) + '-' + value.substring(6);
    } else if (value.length > 3) {
      value = value.substring(0, 3) + '-' + value.substring(3);
    }
    
    return value;
  }

  private formatDateForInput(dateString: string): string {
    if (!dateString) return '';
    
    // Extract date part (YYYY-MM-DD) from datetime string if present
    // Handles formats like: YYYY-MM-DD, YYYY-MM-DDTHH:mm:ss, YYYY-MM-DDTHH:mm:ss.sssZ
    if (dateString.includes('T')) {
      return dateString.split('T')[0];
    }
    
    // If already in YYYY-MM-DD format, return as is
    return dateString;
  }

  ngOnInit() {
    if (this.clientData) {
      console.log(this.clientData);
      this.client = {
        name: this.clientData.name || '',
        lastname: this.clientData.lastname || '',
        email: this.clientData.email || '',
        birth_date: this.formatDateForInput(this.clientData.birth_date || ''),
        phone_number: this.formatPhoneNumberString(this.clientData.phone_number || ''),
        address: this.clientData.address || ''
      };
    }
  }

  cancel() {
    this.modalController.dismiss(null, 'cancel');
  }

  formatPhoneNumber(event: any) {
    let value = event.target.value.replace(/\D/g, ''); // Remove all non-digits
    if (value.length > 10) {
      value = value.substring(0, 10); // Limit to 10 digits
    }
    
    // Format as ###-###-####
    if (value.length > 6) {
      value = value.substring(0, 3) + '-' + value.substring(3, 6) + '-' + value.substring(6);
    } else if (value.length > 3) {
      value = value.substring(0, 3) + '-' + value.substring(3);
    }
    
    this.client.phone_number = value;
    event.target.value = value;
  }

  save() {
    if (this.client.name && this.client.lastname) {
      this.modalController.dismiss(this.client, 'confirm');
    }
  }
}

