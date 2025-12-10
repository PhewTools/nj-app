import { Component, Input, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonButton, IonContent, IonItem, IonLabel, IonInput, IonIcon, IonSelect, IonSelectOption, IonTextarea } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ModalController } from '@ionic/angular/standalone';
import { close } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { Item } from './items.utils';

@Component({
  selector: 'app-edit-item-modal',
  templateUrl: './edit-item.modal.html',
  styleUrls: ['./edit-item.modal.scss'],
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
export class EditItemModal implements OnInit {
  @Input() itemData!: Item;

  item: {
    type: 'product' | 'service';
    name: string;
    cost: string;
    description: string;
  } = {
    type: 'product',
    name: '',
    cost: '',
    description: ''
  };

  constructor(private modalController: ModalController) {
    addIcons({ close });
  }

  ngOnInit() {
    if (this.itemData) {
      this.item = {
        type: this.itemData.type,
        name: this.itemData.name,
        cost: this.itemData.cost.toString(),
        description: this.itemData.description || ''
      };
    }
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

