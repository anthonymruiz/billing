import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmCancelation } from './confirm-cancelation';

describe('ConfirmCancelation', () => {
  let component: ConfirmCancelation;
  let fixture: ComponentFixture<ConfirmCancelation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmCancelation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmCancelation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
