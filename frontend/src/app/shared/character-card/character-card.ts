import { Component, Input, Output, EventEmitter, AfterViewInit, ViewChild, ElementRef, HostListener, OnDestroy, Renderer2, ChangeDetectorRef } from '@angular/core';
import { Character } from '../../services/character';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Weapon, WeaponTypes, WeaponSkills, WeaponService } from '../../services/weapon';

@Component({
  selector: 'app-character-card',
  imports: [CommonModule, FormsModule],
  templateUrl: './character-card.html',
  styleUrl: './character-card.css',
})
export class CharacterCard{

  constructor(private weaponService: WeaponService, private cdr: ChangeDetectorRef) {}

  @Input() character!: Character;
  @Input() isActive = false;
  @Input() inputValue?: number;
  @Output() inputValueChange = new EventEmitter<number>();
  @Input() isHeadshot?: boolean;
  @Output() isHeadshotChange = new EventEmitter<boolean>();
  @Input() halfArmor?: boolean;
  @Output() halfArmorChange = new EventEmitter<boolean>();
  @Input() ignoreArmor?: boolean;
  @Output() ignoreArmorChange = new EventEmitter<boolean>();

  @Output() rangedAttack = new EventEmitter<Character>();
  @Output() meleeAttack = new EventEmitter<Character>();
  @Output() setHealth = new EventEmitter<Character>();
  @Output() changeName = new EventEmitter<Character>();
  @Output() changeArmor = new EventEmitter<Character>();
  @Output() changeInit = new EventEmitter<Character>();
  @Output() delete = new EventEmitter<Character>();
  @Output() saveWeapon = new EventEmitter<Weapon>();

  // add weapon helper
  @ViewChild('addWeaponBtn') addWeaponBtn!: ElementRef;
  weapon: Weapon = { weaponType: 'Select Weapon Type', weaponSkill: 'Select Weapon Skill' };
  weaponTypes = Object.values(WeaponTypes);
  weaponSkills = Object.values(WeaponSkills);
  showAddWeapon = false;
  formTop = '0px';
  formLeft = '0px';
  formWidth = '50%';

  // display weapon details helper
  showDetails: { [weaponId: string]: boolean } = {};

  // emit changes whenever input changes
  onInputChange(value: number) {
    this.inputValueChange.emit(value);
  }

  onIsHeadshotChange(value: boolean) {
    this.isHeadshotChange.emit(value);
  }

  onHalfArmorChange(value: boolean) {
    this.halfArmorChange.emit(value);
  }

  onIgnoreArmorChange(value: boolean) {
    this.ignoreArmorChange.emit(value);
  }

  toggleAddWeapon() {
    this.showAddWeapon = !this.showAddWeapon;
    if (this.showAddWeapon) {
      this.setFormPosition();
    }
  }

  closeForm() {
    this.showAddWeapon = false;
    this.weapon = { weaponType: 'Select Weapon Type', weaponSkill: 'Select Weapon Skill' };
  }


  private setFormPosition() {
    if (!this.addWeaponBtn) return;

    const btnRect = this.addWeaponBtn.nativeElement.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    let top = btnRect.bottom + 5; // 5px below button
    let left = btnRect.left;

    // Flip above button if not enough space below
    const formHeight = 150; // approximate form height, adjust as needed
    if (btnRect.bottom + formHeight + 10 > viewportHeight) {
      top = btnRect.top - formHeight - 5;
    }

    this.formTop = `${top}px`;
    this.formLeft = `${left}px`;

    // optional: responsive width
    const viewportWidth = window.innerWidth * 0.5;
    this.formWidth = `${Math.min(500, viewportWidth)}px`; // max 300px or 30% viewport
  }

  // Track scroll & resize
  @HostListener('window:scroll')
  @HostListener('window:resize')
  onScrollOrResize() {
    if (this.showAddWeapon) this.setFormPosition();
  }

  /*
  // Close when clicking outside
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (
      this.showAddWeapon &&
      this.addWeaponBtn &&
      !this.addWeaponBtn.nativeElement.contains(target)
    ) {
      this.closeForm();
    }
  }
  */

  addWeapon(){
    this.toggleAddWeapon();

    this.weapon.characterId = this.character._id;
    if(this.weapon.characterId == null || this.weapon.characterId == '') return;

    this.character.weapons?.push({weaponType: 'Loading...'});

    console.log(this.weapon);
    this.weaponService.createWeapon(this.weapon).subscribe({
      next: (response) => {
        console.log(response);
        this.character.weapons?.pop();
        this.character.weapons?.push(response);
        this.cdr.detectChanges();
        console.log(this.character);
      },
      error: (err) => {
        this.character.weapons?.pop();
        console.error(err);
      }
    });
  }

  deleteWeapon(weapon: Weapon){
    if(weapon._id == null || weapon._id == '') return;

    console.log(weapon);

    const index = this.character.weapons?.indexOf(weapon);
    if(index !== -1 && index != null)
      this.character.weapons?.splice(index!, 1);

    this.weaponService.deleteWeaponById(weapon._id!).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  trackWeapon(weapon: Weapon) {
    return weapon._id;
  }


  onWeaponTypeChange(type: WeaponTypes) {
    if(type == WeaponTypes.MediumPistol){
      this.weapon.weaponSkill = WeaponSkills.Handgun;
      this.weapon.singleShotDice = 2;
      this.weapon.singleShotDamage = 6;
      this.weapon.magazineSize = 12;
      this.weapon.rateOfFire = 2;
      this.weapon.concealable = true;
    }else if(type == WeaponTypes.HeavyPistol){
      this.weapon.weaponSkill = WeaponSkills.Handgun;
      this.weapon.singleShotDice = 3;
      this.weapon.singleShotDamage = 6;
      this.weapon.magazineSize = 8;
      this.weapon.rateOfFire = 2;
      this.weapon.concealable = true;
    }else if(type == WeaponTypes.VeryHeavyPistol){
      this.weapon.weaponSkill = WeaponSkills.Handgun;
      this.weapon.singleShotDice = 4;
      this.weapon.singleShotDamage = 6;
      this.weapon.magazineSize = 8;
      this.weapon.rateOfFire = 1;
      this.weapon.concealable = false;
    }else if(type == WeaponTypes.SMG){
      this.weapon.weaponSkill = WeaponSkills.Handgun;
      this.weapon.singleShotDice = 2;
      this.weapon.singleShotDamage = 6;
      this.weapon.magazineSize = 30;
      this.weapon.rateOfFire = 1;
      this.weapon.concealable = true;
    }else if(type == WeaponTypes.HeavySMG){
      this.weapon.weaponSkill = WeaponSkills.Handgun;
      this.weapon.singleShotDice = 3;
      this.weapon.singleShotDamage = 6;
      this.weapon.magazineSize = 40;
      this.weapon.rateOfFire = 1;
      this.weapon.concealable = false;
    }else if(type == WeaponTypes.Shotgun){
      this.weapon.weaponSkill = WeaponSkills.ShoulderArms;
      this.weapon.singleShotDice = 5;
      this.weapon.singleShotDamage = 6;
      this.weapon.magazineSize = 4;
      this.weapon.rateOfFire = 1;
      this.weapon.concealable = false;
    }else if(type == WeaponTypes.AssaultRifle){
      this.weapon.weaponSkill = WeaponSkills.ShoulderArms;
      this.weapon.singleShotDice = 5;
      this.weapon.singleShotDamage = 6;
      this.weapon.magazineSize = 25;
      this.weapon.rateOfFire = 1;
      this.weapon.concealable = false;
    }else if(type == WeaponTypes.SniperRifle){
      this.weapon.weaponSkill = WeaponSkills.ShoulderArms;
      this.weapon.singleShotDice = 5;
      this.weapon.singleShotDamage = 6;
      this.weapon.magazineSize = 4;
      this.weapon.rateOfFire = 1;
      this.weapon.concealable = false;
    }else if(type == WeaponTypes.BowOrCrossbow){
      this.weapon.weaponSkill = WeaponSkills.Archery;
      this.weapon.singleShotDice = 4;
      this.weapon.singleShotDamage = 6;
      this.weapon.magazineSize = 1;
      this.weapon.rateOfFire = 1;
      this.weapon.concealable = false;
    }else if(type == WeaponTypes.GrenadeLauncher){
      this.weapon.weaponSkill = WeaponSkills.HeavyWeapons;
      this.weapon.singleShotDice = 6;
      this.weapon.singleShotDamage = 6;
      this.weapon.magazineSize = 2;
      this.weapon.rateOfFire = 1;
      this.weapon.concealable = false;
    }else if(type == WeaponTypes.RocketLauncher){
      this.weapon.weaponSkill = WeaponSkills.HeavyWeapons;
      this.weapon.singleShotDice = 8;
      this.weapon.singleShotDamage = 6;
      this.weapon.magazineSize = 1;
      this.weapon.rateOfFire = 1;
      this.weapon.concealable = false;
    }
  }
}
