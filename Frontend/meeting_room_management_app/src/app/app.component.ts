import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RoomListComponent } from './roomComponents/room-list/room-list.component';
import { ReservationListComponent } from './reservationComponents/reservation-list/reservation-list.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RoomListComponent, ReservationListComponent, DatePipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'meeting_room_management_app';
}
