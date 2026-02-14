import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloatingRerouteMenu } from './floating-reroute-menu';

describe('FloatingRerouteMenu', () => {
  let component: FloatingRerouteMenu;
  let fixture: ComponentFixture<FloatingRerouteMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FloatingRerouteMenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FloatingRerouteMenu);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
