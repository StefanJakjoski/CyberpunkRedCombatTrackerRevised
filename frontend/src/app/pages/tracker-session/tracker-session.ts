import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, NgModule, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Character, CharacterService } from '../../services/character';
import { Auth } from '../../services/auth';
import { Session } from '../../services/session';
import { CharacterCard } from "../../shared/character-card/character-card";
import { Weapon, WeaponService, WeaponTypes } from '../../services/weapon';

interface LogEntry {
  message: string;
  timestamp: number;
}

@Component({
  selector: 'app-tracker-session',
  imports: [CommonModule, FormsModule, CharacterCard, ],
  templateUrl: './tracker-session.html',
  styleUrl: './tracker-session.css',
})
export class TrackerSession {
  useBackgroundImage = true;

  // session-info
  sessionInfo: any = null;
  sessionId!: string;
  userId: string = '';
  sessionName: string = '';
  loadingSessionName: boolean = false;

  characters: Character[] = [];
  turn: number = 0;
  loadingCharacters: boolean = false;

  // UI-only helper state (not persisted)
  activeCharacterId?: string;
  inputValues: Record<string, string> = {};
  headshotChecks: Record<string, boolean> = {}
  halfArmorChecks: Record<string, boolean> = {}
  ignoreArmorChecks: Record<string, boolean> = {}

  // create gonk helper
  newCharacterName: string | undefined = '';
  newCharacterHealth: number | undefined = undefined;
  newCharacterInit: number | undefined = undefined;
  newCharacterArmor: number | undefined = undefined;
  newCharacterHeadArmor: number | undefined = undefined;

  // create weapon helper
  newWeaponType: string | undefined = '';
  newWeaponSkill: string | undefined = '';
  newSingleShotDice: number | undefined = undefined;
  newSingleShotDamage: number | undefined = undefined;
  newMagazineSize: number | undefined = undefined;
  newROF: number | undefined = undefined;
  newConcealable: boolean | undefined = undefined;
  newAmmunition: string | undefined = '';
  newWeaponName: string | undefined = '';
  newWeaponNotes: string | undefined = '';

  // dice roll helper
  lastDiceCommand: number[] = []; //0 - number, 1 - dice type
  lastDiceOutputs: number[] = []; //[1, 4, 6]
  lastDiceNumberOfSixes: number = 0;

  // log helper
  logs: LogEntry[] = [];
  visibleLogs: string[] = [];
  @ViewChild('logBox') logBox!: ElementRef;

  constructor(private route: ActivatedRoute, private cdr: ChangeDetectorRef, private characterService: CharacterService,
    private auth: Auth, private sessionService: Session, private weaponService: WeaponService
  ) {}

  ngOnInit() {
    this.loadingCharacters = true;
    this.loadingSessionName = true;
    this.sessionId = this.route.snapshot.paramMap.get('sessionId')!;
    this.auth.getTokenVerification().subscribe({
      next: (response) => {
        this.userId = response.data.id;
        this.getStartingCharacters();
        this.getSessionInfo();
      },
      error: (err) => console.error(err)
    });
  }

  getStartingCharacters(){
    this.characterService.getCharactersBySessionId(this.sessionId).subscribe({
      next: (response) => {
        this.characters = response;
        this.sortCharacters();
        //this.cdr.detectChanges();
      },
      error: (err) => console.error(err),
      complete: () => {
        this.loadingCharacters = false;
        this.cdr.detectChanges();
      } 
    });
  }

  getSessionInfo(){
    this.sessionService.getSessionById(this.sessionId).subscribe({
      next: (response) => {
        this.sessionName = response.name;
        this.sessionInfo = response;
        console.log(response);
      },
      error: (err) => console.error(err),
      complete: () => {
        this.loadingSessionName = false;
        this.cdr.detectChanges();
      }
    });
  }

  isTurn(character: Character): boolean {
    return this.characters.indexOf(character) === this.turn;
  }

  onTitleDefocus(){
    console.log("defocus");
    this.sessionInfo.name = this.sessionName;
    console.log(`New name: ${this.sessionInfo.name}`);
    this.sessionService.updateSession(this.sessionId, this.sessionInfo).subscribe();
  }


  // START OF LEFT SIDE CONTROLS

  nextTurn(){
    this.turn < this.characters.length -1 ? this.turn += 1 : this.turn = 0;
    console.log(this.turn);
    this.cdr.detectChanges();
  }

  previousTurn(){
    this.turn > 0 ? this.turn -= 1 : this.turn = this.characters.length -1;
    console.log(this.turn);
    this.cdr.detectChanges();
  }

  generateRandomGonk(){
    let gonk: Character = { sessionId: this.sessionId, ownerId: this.userId, name: this.newCharacterName,
      initiative: this.newCharacterInit, health: this.newCharacterHealth, armor: this.newCharacterArmor,
      headArmor: this.newCharacterHeadArmor, portrait: 'samurai-icon.png'
    };

    if(!gonk.name || gonk.name === '')
        gonk.name = 'Gonk';

    if(gonk.health == null)
        gonk.health = Math.floor(Math.random()*30 + 20);

    if(gonk.armor == null)
        gonk.armor = Math.floor(Math.random()*4 + 7);

    if(gonk.headArmor == null)
        gonk.headArmor = 0;

    if(gonk.initiative == null)
        gonk.initiative = Math.floor(Math.random()*17 + 3);

    this.characters.push(gonk);
    this.sortCharacters();
    this.cdr.detectChanges();

    this.characterService.createCharacter(gonk).subscribe({
      next: (response) => {
        gonk._id = response._id;
        console.log("Character successfully saved.");
      },
      error: (err) => console.error(err)
    });

    let logMsg = `NET.ALERT // ASSAILANT ${gonk.name.toUpperCase()} DETECTED`
    this.addLog(logMsg);
  }

  generateGonk(){
    let gonk: Character = { sessionId: this.sessionId, ownerId: this.userId, name: this.newCharacterName,
      initiative: this.newCharacterInit, health: this.newCharacterHealth, armor: this.newCharacterArmor,
      headArmor: this.newCharacterHeadArmor, portrait: 'samurai-icon.png'
    };

    if(!gonk.name || gonk.name === '')
        gonk.name = 'Gonk';

    if(gonk.health == null)
        gonk.health = Math.floor(Math.random()*30 + 20);

    if(gonk.armor == null)
        gonk.armor = Math.floor(Math.random()*4 + 7);

    if(gonk.headArmor == null)
        gonk.headArmor = 0;

    if(gonk.initiative == null)
        gonk.initiative = Math.floor(Math.random()*17 + 3);

    this.characters.push(gonk);
    this.sortCharacters();
    this.cdr.detectChanges();

    this.characterService.createCharacter(gonk).subscribe({
      next: (response) => {
        gonk._id = response._id;
        console.log("Character successfully saved.");
      },
      error: (err) => console.error(err)
    });

    let logMsg = `NET.ALERT // ASSAILANT ${gonk.name.toUpperCase()} DETECTED`
    this.addLog(logMsg);
  }

  generateWeapon(){
    let weapon: Weapon = { 
      weaponType: this.newWeaponType, weaponSkill: this.newWeaponSkill, 
      weaponName: this.newWeaponName, weaponNotes: this.newWeaponNotes,
      singleShotDice: this.newSingleShotDice, singleShotDamage: this.newSingleShotDamage,
      magazineSize: this.newMagazineSize, rateOfFire: this.newROF,
      concealable: this.newConcealable, ammunition: this.newAmmunition
    }
  }

  // END OF LEFT SIDE CONTROLS

  // START OF ACTIONS 

  rangedAttack(character: Character) {
    if(character.health == null)
      return;

    if(character.armor == null)
      character.armor = 0;

    if(character.headArmor == null){
      character.headArmor = 0;
    }

    const isHeadshot = this.headshotChecks[character._id!] || false;
    const halfArmor = this.halfArmorChecks[character._id!] || false;
    const ignoreArmor = this.ignoreArmorChecks[character._id!] || false;

    let logMsg = `NET.LOG // ATTACK :: TARGET: ${character.name?.toUpperCase()}`

    let deathCheck = false;
    let damageCheck = this.inputValues[character._id!] || '0';
    let damage = 0;

    let isCrit = false;
    let isTarotCrit = false; 
    
    if(this.isDiceNotation(damageCheck)){
      damage = this.rollDice(damageCheck);
      
      isCrit = this.lastDiceNumberOfSixes >= 2 ? true : false
      isTarotCrit = this.lastDiceNumberOfSixes >= 3 ? true : false
    }else if(this.isStrictlyNumeric(damageCheck)){
      damage = Number(damageCheck);
    }

    if(isTarotCrit){
      logMsg += ` // WARNING :: TAROT CRIT`
    }else if(isCrit){
      logMsg += ` // WARNING :: CRIT`
    }

    let armor = isHeadshot ? character.headArmor : character.armor;
    let effectiveArmor = armor;
    effectiveArmor = halfArmor ? Math.ceil(effectiveArmor / 2) : effectiveArmor;
    effectiveArmor = ignoreArmor ? 0 : effectiveArmor;

    var newDamage = Math.max(0, damage-effectiveArmor);
    newDamage = isHeadshot ? newDamage*2 : newDamage;

    character.health -= newDamage;
    if(newDamage > 0){
      armor > 0 ? armor -= 1 : armor = 0;
      logMsg += ` // ARMOR :: PENETRATED // DMG: ${newDamage}`;

      if(isHeadshot){
        character.headArmor = armor;
      }else{
        character.armor = armor;
      }
    }

    if(character.health! <= 0)
      deathCheck = true;

    if(deathCheck){
      character.health = 0;
      logMsg += ` // SYSTEM :: ${character.name?.toUpperCase()} FLATLINED`;
    }

    this.addLog(logMsg);

    this.updateCharacterLocally(character);
    this.updateCharacterInBackend(character);
  }

  /*
  meleeAttack(character: Character) {
    if(character.health == null)
      return;

    if(character.armor == null)
      character.armor = 0;

    let deathCheck = false;
    const damage = this.inputValues[character._id!] || 0;

    var newDamage = Math.max(0, damage-Math.trunc((character.armor+1)/2));
    character.health! -= newDamage;
    if(newDamage > 0)
        character.armor! > 0 ? character.armor! -= 1 : character.armor = 0;

    if(character.health! <= 0)
        deathCheck = true;

    if(deathCheck)
      character.health = 0;

    this.updateCharacterLocally(character);
    this.updateCharacterInBackend(character);
  }
  */

  setHealth(character: Character) {
    if(character.health == null)
      character.health = 0;

    //const value = this.inputValues[character._id!] || character.health;
    character.health = Math.max(character.health, 0);
    
    this.updateCharacterLocally(character);
    this.updateCharacterInBackend(character);
  }

  changeName(character: Character) {
    console.log(character.name);
    if(character.name === '')
      character.name = 'Gonk';

    //this.updateCharacterLocally(character);
    this.updateCharacterInBackend(character);
  }

  changeArmor(character: Character) {
    if(character.armor == null)
      character.armor = 0;

    //const value = this.inputValues[character._id!] || character.armor;
    character.armor = Math.max(character.armor, 0);
    character.headArmor = Math.max(character.headArmor ?? 0, 0);

    this.updateCharacterLocally(character);
    this.updateCharacterInBackend(character);
  }

  changeInit(character: Character) {
    if(character.initiative == null)
      character.initiative = 0;

    //const value = this.inputValues[character._id!] || character.initiative;
    character.initiative = Math.max(character.initiative, 0);

    this.sortCharacters();
    this.updateCharacterLocally(character);
    this.updateCharacterInBackend(character);
  }

  deleteCharacter(character: Character) {
    const characterIndex = this.characters.indexOf(character);

    this.characters = this.characters.filter(c => c._id !== character._id);
    this.deleteCharacterInBackend(character);

    // adjust turn
    if(characterIndex === -1)
      return;

    if(this.turn > characterIndex){
      this.turn -= 1;
      this.cdr.detectChanges();
    }else if(this.turn === characterIndex && characterIndex >= this.characters.length){
      this.turn = 0;
      this.cdr.detectChanges();
    }


    console.log(this.characters);  
  }

  saveWeapon(weapon: Weapon) {
    console.log("Save weapon emit")
    if(weapon.characterId == null || weapon.characterId == ''){
      console.error("Invalid character ID");
    }

    this.weaponService.createWeapon(weapon).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  // END OF ACTIONS

  private updateCharacterLocally(updated: Character) {
    const idx = this.characters.findIndex(c => c._id === updated._id);
    if (idx > -1) this.characters[idx] = updated;
    this.cdr.detectChanges();
  }

  private updateCharacterInBackend(updated: Character){
    if(updated._id == null){
      console.error("Update failed: character id is null");
      return;
    }

    this.characterService.updateCharacter(updated._id, updated).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (err) => console.error(err)
    });
  }

  private deleteCharacterInBackend(character: Character){
    if(character._id == null){
      console.error("Delete failed: character id is null");
      return;
    }

    this.weaponService.deleteAllWeaponsFromCharacterId(character._id).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (err) => {
        console.error(err);
      }
    });

    this.characterService.deleteCharacter(character._id!).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (err) => console.error(err)
    });

  }

  private deleteWeaponsFromCharacterInBackend(character: Character){
    if(character._id == null){
      console.error("Delete failed: character id is null");
      return;
    }

    this.weaponService.deleteAllWeaponsFromCharacterId(character._id).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  private sortCharacters(){
    const currentActiveCharacter = this.characters[this.turn];

    this.characters.sort((a, b) => {
      if(a.initiative == null)
        a.initiative = 0;
      if(b.initiative == null)
        b.initiative = 0;

      return b.initiative-a.initiative;
    });

    const newTurn = this.characters.indexOf(currentActiveCharacter);
    if(newTurn !== -1)
      this.turn = newTurn;
  }

  private isStrictlyNumeric(input: string): boolean {
    return /^\d+$/.test(input);
  }

  private isDiceNotation(input: string): boolean {
    return /^\d+d\d+(\+\d+)?$/.test(input);
  }

  private rollDice(input: string): number {
    const match = input.match(/^(\d+)d(\d+)(\+(\d+))?$/);

    if(!match)
      throw new Error(`Invalid dice notation: ${input}`);

    const count = Number(match[1]);
    const sides = Number(match[2]);
    const bonus = match[4] ? Number(match[4]) : 0;

    this.lastDiceCommand = [count, sides];

    if (count > 100 || sides > 1000) 
      throw new Error("Dice too large");

    let total = 0;

    this.lastDiceOutputs = [];
    this.lastDiceNumberOfSixes = 0;
    for (let i = 0; i < count; i++) {
      let roll = Math.floor(Math.random() * sides) + 1;
      total += roll;

      this.lastDiceOutputs.push(roll);

      if(roll === 6)
        this.lastDiceNumberOfSixes += 1;
    }

    this.addLog(`// ROLLED ${count}d${sides} // ${this.lastDiceOutputs}`);
    return total + bonus;
  }

  addLog(message: string) {
    this.logs.push({
      message,
      timestamp: Date.now()
    });

    setTimeout(() => {
      if (this.logBox) {
        const el = this.logBox.nativeElement;
        el.scrollTop = el.scrollHeight;
      }
    });
  }
}
