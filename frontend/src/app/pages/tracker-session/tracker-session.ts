import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Character, CharacterService } from '../../services/character';
import { Auth } from '../../services/auth';
import { Session } from '../../services/session';
import { CharacterCard } from "../../shared/character-card/character-card";

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
  inputValues: Record<string, number> = {};

  // create gonk helper
  newCharacterName: string | undefined = '';
  newCharacterHealth: number | undefined = undefined;
  newCharacterInit: number | undefined = undefined;
  newCharacterArmor: number | undefined = undefined;

  constructor(private route: ActivatedRoute, private cdr: ChangeDetectorRef, private characterService: CharacterService,
    private auth: Auth, private sessionService: Session
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
      initiative: this.newCharacterInit, health: this.newCharacterHealth, armor: this.newCharacterArmor
    };

    if(!gonk.name || gonk.name === '')
        gonk.name = 'Gonk';

    if(gonk.health == null)
        gonk.health = Math.floor(Math.random()*30 + 20);

    if(gonk.armor == null)
        gonk.armor = Math.floor(Math.random()*4 + 7);

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
  }

  generateGonk(){
    let gonk: Character = { sessionId: this.sessionId, ownerId: this.userId, name: this.newCharacterName,
      initiative: this.newCharacterInit, health: this.newCharacterHealth, armor: this.newCharacterArmor
    };

    if(!gonk.name || gonk.name === '')
        gonk.name = 'Gonk';

    if(gonk.health == null)
        gonk.health = Math.floor(Math.random()*30 + 20);

    if(gonk.armor == null)
        gonk.armor = Math.floor(Math.random()*4 + 7);

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
  }

  // END OF LEFT SIDE CONTROLS

  // START OF ACTIONS 

  rangedAttack(character: Character) {
    if(character.health == null)
      return;

    if(character.armor == null)
      character.armor = 0;

    let deathCheck = false;
    const damage = this.inputValues[character._id!] || 0;

    var newDamage = Math.max(0, damage-character.armor!);
    character.health -= newDamage;
    if(newDamage > 0)
        character.armor > 0 ? character.armor -= 1 : character.armor = 0;

    if(character.health! <= 0)
        deathCheck = true;

    if(deathCheck)
      character.health = 0;

    this.updateCharacterLocally(character);
    this.updateCharacterInBackend(character);
  }

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

  setHealth(character: Character) {
    if(character.health == null)
      character.health = 0;

    const value = this.inputValues[character._id!] || character.health;
    character.health = Math.max(value, 0);
    
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

    const value = this.inputValues[character._id!] || character.armor;
    character.armor = Math.max(value, 0);

    this.updateCharacterLocally(character);
    this.updateCharacterInBackend(character);
  }

  changeInit(character: Character) {
    if(character.initiative == null)
      character.initiative = 0;

    const value = this.inputValues[character._id!] || character.initiative;
    character.initiative = Math.max(value, 0);

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

    this.characterService.deleteCharacter(character._id).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (err) => console.error(err)
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
}
