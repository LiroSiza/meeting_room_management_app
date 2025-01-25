import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RoomListComponent } from './roomComponents/room-list/room-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RoomListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'meeting_room_management_app';
}
