import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { RoomListComponent } from './roomComponents/room-list/room-list.component';
import { ReservationListComponent } from './reservationComponents/reservation-list/reservation-list.component';
import { DatePipe } from '@angular/common';
import { RoomCreationFormComponent } from './roomComponents/room-creation-form/room-creation-form.component';
import { FormsModule } from '@angular/forms';
import { RoomsListReservationsComponent } from './mainRoomListComponents/rooms-list-reservations/rooms-list-reservations.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, RoomListComponent, ReservationListComponent, RoomCreationFormComponent, RoomsListReservationsComponent, DatePipe, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'meeting_room_management_app';
}
