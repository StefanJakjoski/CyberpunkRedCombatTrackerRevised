import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackerSession } from './tracker-session';

describe('TrackerSession', () => {
  let component: TrackerSession;
  let fixture: ComponentFixture<TrackerSession>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackerSession]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrackerSession);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
