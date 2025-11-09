import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectiveSetComponent } from './objective-set.component';

describe('ObjectiveSetComponent', () => {
  let component: ObjectiveSetComponent;
  let fixture: ComponentFixture<ObjectiveSetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObjectiveSetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObjectiveSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
