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
    phone_number: ''
  };

  constructor(private modalController: ModalController) {
    addIcons({ close });
  }

  ngOnInit() {
    if (this.clientData) {
      this.client = {
        name: this.clientData.name || '',
        lastname: this.clientData.lastname || '',
        email: this.clientData.email || '',
        birth_date: this.clientData.birth_date || '',
        phone_number: this.clientData.phone_number || ''
      };
    }
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

