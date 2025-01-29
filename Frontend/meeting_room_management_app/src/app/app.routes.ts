import { Routes } from '@angular/router';
import { RoomListComponent } from './roomComponents/room-list/room-list.component';
import { ReservationComponent } from './reservationComponents/reservation/reservation.component';
import { RoomsListReservationsComponent } from './mainRoomListComponents/rooms-list-reservations/rooms-list-reservations.component';
import { ReservationListComponent } from './reservationComponents/reservation-list/reservation-list.component';

export const routes: Routes = [
    { path: 'room/:roomId', component: ReservationComponent }, // Ruta para las reservas
    { path: '', redirectTo: '/reservasiones', pathMatch: 'full' }, // Redirección por defecto
    { path: 'reservasiones', component: RoomsListReservationsComponent }, // Ruta a reservasiones
    { path: 'salas', component: RoomListComponent }, // Ruta a salas
    { path: 'reservas', component: ReservationListComponent } // Ruta a reservas
];
