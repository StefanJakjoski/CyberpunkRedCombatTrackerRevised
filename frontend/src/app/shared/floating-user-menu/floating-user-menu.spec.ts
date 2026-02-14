import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FloatingUserMenu } from './floating-user-menu';

describe('FloatingUserMenu', () => {
  let component: FloatingUserMenu;
  let fixture: ComponentFixture<FloatingUserMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FloatingUserMenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FloatingUserMenu);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
