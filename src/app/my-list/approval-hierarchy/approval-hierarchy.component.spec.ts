import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalHierarchyComponent } from './approval-hierarchy.component';

describe('ApprovalHierarchyComponent', () => {
  let component: ApprovalHierarchyComponent;
  let fixture: ComponentFixture<ApprovalHierarchyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovalHierarchyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovalHierarchyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
