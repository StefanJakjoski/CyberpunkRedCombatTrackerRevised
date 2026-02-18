import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Character } from '../../services/character';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-character-card',
  imports: [CommonModule, FormsModule],
  templateUrl: './character-card.html',
  styleUrl: './character-card.css',
})
export class CharacterCard {

  @Input() character!: Character;
  @Input() weaponName: string = 'Sheer Moxie'
  @Input() isActive = false;
  @Input() inputValue?: number;
  @Output() inputValueChange = new EventEmitter<number>();

  @Output() rangedAttack = new EventEmitter<Character>();
  @Output() meleeAttack = new EventEmitter<Character>();
  @Output() setHealth = new EventEmitter<Character>();
  @Output() changeName = new EventEmitter<Character>();
  @Output() changeArmor = new EventEmitter<Character>();
  @Output() changeInit = new EventEmitter<Character>();
  @Output() delete = new EventEmitter<Character>();
  @Output() saveWeapon = new EventEmitter<Character>();

  // emit changes whenever input changes
  onInputChange(value: number) {
    this.inputValueChange.emit(value);
  }
}
