import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackerHub } from './tracker-hub';

describe('TrackerHub', () => {
  let component: TrackerHub;
  let fixture: ComponentFixture<TrackerHub>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackerHub]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrackerHub);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
