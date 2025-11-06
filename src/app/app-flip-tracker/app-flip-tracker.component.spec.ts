import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppFlipTrackerComponent } from './app-flip-tracker.component';

describe('AppFlipTrackerComponent', () => {
  let component: AppFlipTrackerComponent;
  let fixture: ComponentFixture<AppFlipTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppFlipTrackerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppFlipTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
