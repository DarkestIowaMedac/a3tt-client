import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelCategoryModalComponent } from './del-category-modal.component';

describe('DelCategoryModalComponent', () => {
  let component: DelCategoryModalComponent;
  let fixture: ComponentFixture<DelCategoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DelCategoryModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DelCategoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
