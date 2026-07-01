import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { Character } from '../../services/character';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface CriticalInjury {
  id: string;
  name: string;
  description: string;
  quickFix: string;
  treatment: string;
  location: "Head" | "Body";
  icon: string;
}

@Component({
  selector: 'app-character-injuries',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './character-injuries.html',
  styleUrl: './character-injuries.css',
})
export class CharacterInjuries {
  @Input() character!: Character;

  @Output() changeInjuries = new EventEmitter<Character>();

  headInjuries = HEAD_CRITICAL_INJURIES;
  bodyInjuries = BODY_CRITICAL_INJURIES;

  addMenuOpen = false;

  selectedInjury?: CriticalInjury;

  searchTerm = "";

  @ViewChild('menu') menu?: ElementRef;
  @ViewChild('addButton') addButton?: ElementRef;
  menuAbove = false;

  get filteredHeadInjuries() {
    return this.headInjuries.filter(i =>
      i.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  get filteredBodyInjuries() {
    return this.bodyInjuries.filter(i =>
      i.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    
    if (!target.closest('.effects-container')) {
      this.addMenuOpen = false;
    }
  }

  toggleAddMenu() {
    this.addMenuOpen = !this.addMenuOpen;
    if(this.addMenuOpen){
      setTimeout(() => {
        if(this.addButton){
          const buttonRect = this.addButton.nativeElement.getBoundingClientRect();
          const spaceBelow = window.innerHeight - buttonRect.bottom;
          const menuHeight = 300; // approximate popup height
          this.menuAbove = spaceBelow < menuHeight;
        }
      });
    }
  }

  openDetails(injury: CriticalInjury){
    this.selectedInjury = injury;
  }

  closeDetails(){
    this.selectedInjury = undefined;
  }

  addInjury(injury: CriticalInjury){
    if(!this.character.injuries){
      this.character.injuries = [];
    }

    if(this.character.injuries.includes(injury.id))
      return;

    this.character.injuries.push(injury.id);
    this.changeInjuries.emit(this.character);
    this.addMenuOpen = false;
  }

  removeInjury(){
    if(!this.selectedInjury)
      return;

    this.character.injuries = this.character.injuries.filter(id => id !== this.selectedInjury!.id);
    this.changeInjuries.emit(this.character);
    this.selectedInjury = undefined;
  }

  getInjury(id: string): CriticalInjury | undefined {
    return [
      ...this.headInjuries,
      ...this.bodyInjuries
    ].find(i => i.id === id);
  }

}

export const HEAD_CRITICAL_INJURIES: CriticalInjury[] = [
  {
    id: "lost_eye",
    name: "Lost Eye",
    description: "The lost eye is gone. -4 to Ranged Attacks and Perception Checks involving vision. Base Death Save Penalty is increased by 1.",
    quickFix: "N/A",
    treatment: "Surgery DV17",
    location: "Head",
    icon: "lost_eye"
  },
  {
    id: "brain_injury",
    name: "Brain Injury",
    description: "-2 to all Actions. Base Death Save Penalty is increased by 1.",
    quickFix: "N/A",
    treatment: "Surgery DV17",
    location: "Head",
    icon: "brain_injury"
  },
  {
    id: "damaged_eye",
    name: "Damaged Eye",
    description: "-2 to Ranged Attacks and Perception Checks involving vision.",
    quickFix: "Paramedic DV15",
    treatment: "Surgery DV13",
    location: "Head",
    icon: "damaged_eye"
  },
  {
    id: "concussion",
    name: "Concussion",
    description: "-2 to all Actions.",
    quickFix: "First Aid or Paramedic DV13",
    treatment: "Quick Fix removes Injury Effect permanently",
    location: "Head",
    icon: "concussion"
  },
  {
    id: "broken_jaw",
    name: "Broken Jaw",
    description: "-4 to all Actions involving speech.",
    quickFix: "Paramedic DV13",
    treatment: "Paramedic or Surgery DV13",
    location: "Head",
    icon: "broken_jaw"
  },
  {
    id: "foreign_object_head",
    name: "Foreign Object",
    description: "At the end of every Turn where you move further than 4m/yds on foot, you re-suffer this Critical Injury's Bonus Damage directly to your Hit Points.",
    quickFix: "First Aid or Paramedic DV13",
    treatment: "Quick Fix removes Injury Effect permanently",
    location: "Head",
    icon: "foreign_object_head"
  },
  {
    id: "whiplash",
    name: "Whiplash",
    description: "Base Death Save Penalty is increased by 1.",
    quickFix: "Paramedic DV13",
    treatment: "Paramedic or Surgery DV13",
    location: "Head",
    icon: "whiplash"
  },
  {
    id: "cracked_skull",
    name: "Cracked Skull",
    description: "Aimed Shots to your head multiply the damage that gets through your SP by 3 instead of 2. Base Death Save Penalty is increased by 1.",
    quickFix: "Paramedic DV15",
    treatment: "Paramedic or Surgery DV15",
    location: "Head",
    icon: "cracked_skull"
  },
  {
    id: "damaged_ear",
    name: "Damaged Ear",
    description: "Whenever you move further than 4m/yds on foot in a Turn, you cannot take a Move Action on your next Turn. Additionally, you take a -2 to Perception Checks involving hearing.",
    quickFix: "Paramedic DV13",
    treatment: "Surgery DV13",
    location: "Head",
    icon: "damaged_ear"
  },
  {
    id: "crushed_windpipe",
    name: "Crushed Windpipe",
    description: "You cannot speak. Base Death Save Penalty is increased by 1.",
    quickFix: "N/A",
    treatment: "Surgery DV15",
    location: "Head",
    icon: "crushed_windpipe"
  },
  {
    id: "lost_ear",
    name: "Lost Ear",
    description: "The lost ear is gone. Whenever you move further than 4m/yds on foot in a Turn, you cannot take a Move Action on your next Turn. Additionally, you take a -4 to Perception Checks involving hearing. Base Death Save Penalty is increased by 1.",
    quickFix: "N/A",
    treatment: "Surgery DV17",
    location: "Head",
    icon: "lost_ear"
  }
];

export const BODY_CRITICAL_INJURIES: CriticalInjury[] = [
  {
    id: "dismembered_arm",
    name: "Dismembered Arm",
    description: "The dismembered arm is gone. You immediately drop any items held in that arm's hand. Base Death Save Penalty is increased by 1.",
    quickFix: "N/A",
    treatment: "Surgery DV17",
    location: "Body",
    icon: "dismembered_arm"
  },
  {
    id: "dismembered_hand",
    name: "Dismembered Hand",
    description: "The dismembered hand is gone. You immediately drop any items held in the dismembered hand. Base Death Save Penalty is increased by 1.",
    quickFix: "N/A",
    treatment: "Surgery DV17",
    location: "Body",
    icon: "dismembered_hand"
  },
  {
    id: "collapsed_lung",
    name: "Collapsed Lung",
    description: "-2 to MOVE (minimum 1). Base Death Save Penalty is increased by 1.",
    quickFix: "Paramedic DV15",
    treatment: "Surgery DV15",
    location: "Body",
    icon: "collapsed_lung"
  },
  {
    id: "broken_ribs",
    name: "Broken Ribs",
    description: "At the end of every Turn where you move further than 4m/yds on foot, you re-suffer this Critical Injury's Bonus Damage directly to your Hit Points.",
    quickFix: "Paramedic DV13",
    treatment: "Paramedic DV15 or Surgery DV13",
    location: "Body",
    icon: "broken_ribs"
  },
  {
    id: "broken_arm",
    name: "Broken Arm",
    description: "The broken arm cannot be used. You immediately drop any items held in that arm's hand.",
    quickFix: "Paramedic DV13",
    treatment: "Paramedic DV15 or Surgery DV13",
    location: "Body",
    icon: "broken_arm"
  },
  {
    id: "foreign_object_body",
    name: "Foreign Object",
    description: "At the end of every Turn where you move further than 4m/yds on foot, you re-suffer this Critical Injury's Bonus Damage directly to your Hit Points.",
    quickFix: "First Aid or Paramedic DV13",
    treatment: "Quick Fix removes Injury Effect permanently",
    location: "Body",
    icon: "foreign_object_body"
  },
  {
    id: "broken_leg",
    name: "Broken Leg",
    description: "-4 to MOVE (minimum 1).",
    quickFix: "Paramedic DV13",
    treatment: "Paramedic DV15 or Surgery DV13",
    location: "Body",
    icon: "broken_leg"
  },
  {
    id: "torn_muscle",
    name: "Torn Muscle",
    description: "-2 to Melee Attacks.",
    quickFix: "First Aid or Paramedic DV13",
    treatment: "Quick Fix removes Injury Effect permanently",
    location: "Body",
    icon: "torn_muscle"
  },
  {
    id: "spinal_injury",
    name: "Spinal Injury",
    description: "On your next Turn, you cannot take an Action, but you can still take a Move Action. Base Death Save Penalty is increased by 1.",
    quickFix: "Paramedic DV15",
    treatment: "Surgery DV15",
    location: "Body",
    icon: "spinal_injury"
  },
  {
    id: "crushed_fingers",
    name: "Crushed Fingers",
    description: "-4 to all Actions involving that hand.",
    quickFix: "Paramedic DV13",
    treatment: "Surgery DV15",
    location: "Body",
    icon: "crushed_fingers"
  },
  {
    id: "dismembered_leg",
    name: "Dismembered Leg",
    description: "The dismembered leg is gone. -6 to MOVE (minimum 1). You cannot dodge attacks. Base Death Save Penalty is increased by 1.",
    quickFix: "N/A",
    treatment: "Surgery DV17",
    location: "Body",
    icon: "dismembered_leg"
  }
];