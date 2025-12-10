import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonButton, IonContent, IonItem, IonLabel, IonInput, IonIcon, IonSelect, IonSelectOption, IonTextarea } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ModalController } from '@ionic/angular/standalone';
import { close } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-add-item-modal',
  templateUrl: './add-item.modal.html',
  styleUrls: ['./add-item.modal.scss'],
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
    IonTextarea,
    FormsModule,
    CommonModule
  ]
})
export class AddItemModal {
  item = {
    type: 'product' as 'product' | 'service',
    name: '',
    cost: '',
    description: ''
  };

  constructor(private modalController: ModalController) {
    addIcons({ close });
  }

  cancel() {
    this.modalController.dismiss(null, 'cancel');
  }

  save() {
    if (this.item.name && this.item.cost) {
      const itemData = {
        type: this.item.type,
        name: this.item.name,
        cost: parseFloat(this.item.cost),
        description: this.item.description || undefined
      };
      this.modalController.dismiss(itemData, 'confirm');
    }
  }
}

