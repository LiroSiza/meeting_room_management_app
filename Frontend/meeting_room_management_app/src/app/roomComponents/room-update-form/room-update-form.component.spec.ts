import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomUpdateFormComponent } from './room-update-form.component';

describe('RoomUpdateFormComponent', () => {
  let component: RoomUpdateFormComponent;
  let fixture: ComponentFixture<RoomUpdateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomUpdateFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RoomUpdateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
