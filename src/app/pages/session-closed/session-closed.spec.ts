import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionClosed } from './session-closed';

describe('SessionClosed', () => {
  let component: SessionClosed;
  let fixture: ComponentFixture<SessionClosed>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionClosed]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionClosed);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
