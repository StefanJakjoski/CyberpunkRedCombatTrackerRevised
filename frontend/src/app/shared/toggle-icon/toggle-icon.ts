import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-toggle-icon',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './toggle-icon.html',
  styleUrl: './toggle-icon.css',
})
export class ToggleIcon {
  @Input() value = false;

  @Input() onIcon = '';
  @Input() offIcon = '';

  @Input() size = 35;

  @Input() tooltip = '';

  @Output() valueChange = new EventEmitter<boolean>();

  toggle(){
    this.value = !this.value;
    this.valueChange.emit(this.value);
  }

  get currentIcon(): string{
    return this.value ? this.onIcon : this.offIcon;
  }
}
