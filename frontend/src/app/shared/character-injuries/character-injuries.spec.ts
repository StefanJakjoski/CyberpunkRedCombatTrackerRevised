import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterInjuries } from './character-injuries';

describe('CharacterInjuries', () => {
  let component: CharacterInjuries;
  let fixture: ComponentFixture<CharacterInjuries>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterInjuries]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharacterInjuries);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
