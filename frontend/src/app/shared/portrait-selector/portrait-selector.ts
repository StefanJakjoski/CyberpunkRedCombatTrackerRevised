import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-portrait-selector',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './portrait-selector.html',
  styleUrl: './portrait-selector.css',
})
export class PortraitSelector implements OnInit{
  @Input() selectedPortrait = 'samurai-icon.png';
  @Output() selectedPortraitChange = new EventEmitter<string>();

  showSelector = false;

  portraits = [
    'samurai-icon.png',
    'samurai-icon.png',
    'samurai-icon.png',
    'samurai-icon.png',
    'samurai-icon.png',
    'samurai-icon.png',
  ]


  ngOnInit(): void {
    this.selectedPortrait = 'samurai-icon.png';
  }

  toggle(){
    this.showSelector = !this.showSelector;
  }

  selectPortrait(icon: string){
    this.selectedPortrait = icon;
    this.selectedPortraitChange.emit(icon);
    this.showSelector = false;
  }
}
