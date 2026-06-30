import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortraitSelector } from './portrait-selector';

describe('PortraitSelector', () => {
  let component: PortraitSelector;
  let fixture: ComponentFixture<PortraitSelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortraitSelector]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortraitSelector);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
