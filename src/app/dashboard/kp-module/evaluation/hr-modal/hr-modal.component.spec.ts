import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrModalComponent } from './hr-modal.component';

describe('HrModalComponent', () => {
  let component: HrModalComponent;
  let fixture: ComponentFixture<HrModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HrModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HrModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
