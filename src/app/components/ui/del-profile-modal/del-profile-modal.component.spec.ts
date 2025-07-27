import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelProfileModalComponent } from './del-profile-modal.component';

describe('DelProfileModalComponent', () => {
  let component: DelProfileModalComponent;
  let fixture: ComponentFixture<DelProfileModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DelProfileModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DelProfileModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
