import { Component, Input, Output, EventEmitter, ElementRef, HostListener, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonInput, IonList, IonItem, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronDown, chevronUp, closeCircle } from 'ionicons/icons';

@Component({
  selector: 'app-dropdown-search',
  templateUrl: './dropdown-search.component.html',
  styleUrls: ['./dropdown-search.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonInput, IonList, IonItem, IonIcon]
})
export class DropdownSearchComponent implements OnInit, OnChanges {

  @Input() options: any[] = [];
  @Input() selectedOption: any = null;
  @Output() selectedOptionChange = new EventEmitter<any>();
  @Input() placeholder: string = 'Select an option';
  @Input() displayField: string = 'name';
  @Input() valueField: string = 'id';
  @Input()
  set allowClear(value: boolean | string) {
    this._allowClear = typeof value === 'string' ? value === 'true' : value;
  }
  get allowClear(): boolean {
    return this._allowClear;
  }
  private _allowClear: boolean = false;

  searchTerm: string = '';
  isDropdownOpen: boolean = false;
  filteredOptions: any[] = [];

  constructor(private elementRef: ElementRef) {
    addIcons({ chevronDown, chevronUp, closeCircle });
  }

  ngOnInit() {
    this.updateFilteredOptions();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['options'] || changes['selectedOption']) {
      this.updateFilteredOptions();
    }
  }

  private updateFilteredOptions() {
    this.filteredOptions = this.options ? [...this.options] : [];
    this.filterOptions();
  }

  onInputFocus() {
    this.isDropdownOpen = true;
    this.filterOptions();
  }

  onSearchChange() {
    this.filterOptions();
    this.isDropdownOpen = true;
  }

  filterOptions() {
    if (!this.searchTerm.trim()) {
      this.filteredOptions = [...this.options];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredOptions = this.options.filter(option =>
        this.getDisplayValue(option).toLowerCase().includes(term)
      );
    }
  }

  selectOption(option: any) {
    this.selectedOption = option;
    this.selectedOptionChange.emit(option);
    this.searchTerm = this.getDisplayValue(option);
    this.isDropdownOpen = false;
  }

  clearSelection() {
    this.selectedOption = null;
    this.selectedOptionChange.emit(null);
    this.searchTerm = '';
    this.isDropdownOpen = false;
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
    if (this.isDropdownOpen) {
      this.filterOptions();
    }
  }

  getDisplayValue(option: any): string {
    if (!option) return '';
    if (typeof option === 'string') return option;
    return option[this.displayField] || option.name || option.title || '';
  }

  getSelectedDisplayValue(): string {
    return this.getDisplayValue(this.selectedOption);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isDropdownOpen = false;
    }
  }

}

