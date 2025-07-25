import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdProfileModalComponent } from './ed-profile-modal.component';

describe('EdProfileModalComponent', () => {
  let component: EdProfileModalComponent;
  let fixture: ComponentFixture<EdProfileModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EdProfileModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EdProfileModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
