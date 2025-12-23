import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonButton, IonContent, IonItem, IonLabel, IonInput, IonIcon, ToastController } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ModalController } from '@ionic/angular/standalone';
import { close } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-add-client-modal',
  templateUrl: './add-client.modal.html',
  styleUrls: ['./add-client.modal.scss'],
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
export class AddClientModal {
  client = {
    name: '',
    lastname: '',
    address: '',
    email: '',
    birth_date: '',
    phone_number: ''
  };

  constructor(private modalController: ModalController, private toastController: ToastController) {
    addIcons({ close });
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

  validateEmail(email: string): boolean {
    const emailRegex = /^[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})$/;
    if(emailRegex.test(email)){
      return true
    }
    else {
      this.toastController.create({
        message: 'Invalid email address',
        duration: 2000,
        position: 'top',
        color: 'danger'
      }).then(toast => toast.present());
      return false;
    }
  }

  save() {
    if (this.client.name && this.client.lastname && this.validateEmail(this.client.email)) {
      this.modalController.dismiss(this.client, 'confirm');
    }
  }
}