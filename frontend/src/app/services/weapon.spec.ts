import { TestBed } from '@angular/core/testing';

import { Weapon } from './weapon';

describe('Weapon', () => {
  let service: Weapon;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Weapon);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
