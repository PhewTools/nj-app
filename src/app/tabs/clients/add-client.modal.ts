import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonButton, IonContent, IonItem, IonLabel, IonInput, IonIcon } from '@ionic/angular/standalone';
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

  constructor(private modalController: ModalController) {
    addIcons({ close });
  }

  cancel() {
    this.modalController.dismiss(null, 'cancel');
  }

  save() {
    if (this.client.name && this.client.lastname) {
      this.modalController.dismiss(this.client, 'confirm');
    }
  }
}