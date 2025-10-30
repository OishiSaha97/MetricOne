import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproHierarchyPopUpComponent } from './appro-hierarchy-pop-up.component';

describe('ApproHierarchyPopUpComponent', () => {
  let component: ApproHierarchyPopUpComponent;
  let fixture: ComponentFixture<ApproHierarchyPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApproHierarchyPopUpComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ApproHierarchyPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
