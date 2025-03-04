import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomCreationFormComponent } from './room-creation-form.component';

describe('RoomCreationFormComponent', () => {
  let component: RoomCreationFormComponent;
  let fixture: ComponentFixture<RoomCreationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomCreationFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RoomCreationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
