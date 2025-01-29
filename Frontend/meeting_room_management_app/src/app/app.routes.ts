import { Routes } from '@angular/router';
import { RoomListComponent } from './roomComponents/room-list/room-list.component';
import { ReservationComponent } from './reservationComponents/reservation/reservation.component';

export const routes: Routes = [
    { path: 'room/:roomId', component: ReservationComponent }, // Ruta para las reservas
    { path: '**', redirectTo: '', pathMatch: 'full' }, // Redirección por defecto
];
