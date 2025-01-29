import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomsListReservationsComponent } from './rooms-list-reservations.component';

describe('RoomsListReservationsComponent', () => {
  let component: RoomsListReservationsComponent;
  let fixture: ComponentFixture<RoomsListReservationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomsListReservationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RoomsListReservationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
