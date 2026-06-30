import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleIcon } from './toggle-icon';

describe('ToggleIcon', () => {
  let component: ToggleIcon;
  let fixture: ComponentFixture<ToggleIcon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToggleIcon]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToggleIcon);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
