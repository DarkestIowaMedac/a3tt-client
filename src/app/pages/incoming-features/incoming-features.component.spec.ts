import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingFeaturesComponent } from './incoming-features.component';

describe('IncomingFeaturesComponent', () => {
  let component: IncomingFeaturesComponent;
  let fixture: ComponentFixture<IncomingFeaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IncomingFeaturesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomingFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
