import { Component, OnInit } from '@angular/core';
import { RoomService } from '../../services/roomService/room.service';
import { Room } from '../../interfaces/room';
import { CommonModule } from '@angular/common';
import { RoomDetailsComponent } from '../room-details/room-details.component';

@Component({
  selector: 'app-rooms-list-reservations',
  standalone: true,
  imports: [CommonModule, RoomDetailsComponent],
  templateUrl: './rooms-list-reservations.component.html',
  styleUrl: './rooms-list-reservations.component.css'
})
export class RoomsListReservationsComponent implements OnInit {
  rooms: Room[] = [];
  selectedRoomId: string | null = null;  // Cambiado a string | null

  constructor(private roomService: RoomService) {}

  ngOnInit(): void {
    this.loadRooms();
    this.listenForUpdates();  // Escucha las actualizaciones en tiempo real
  }

  loadRooms(): void {
    this.roomService.getRooms().subscribe((rooms) => {
      this.rooms = rooms;
    });
  }

  // Escucha las actualizaciones en tiempo real de las salas a través del servicio
  private listenForUpdates(): void {
    this.roomService.listenToRoomUpdates().subscribe({ // Se suscribe al observable devuelto por `listenToRoomUpdates` del servicio `RoomService`
      next: (updatedRooms) => {
        this.rooms = updatedRooms; // se actualiza la propiedad `rooms`
        // console.log('Salas actualizadas:', this.rooms);
      }
    });
  }

  openRoomDetails(roomId: string | undefined): void {
    if (!roomId) {
      console.error('El ID de la sala no es válido.');
      return;
    }
    this.selectedRoomId = roomId;
  }

  closeRoomDetails(): void {
    this.selectedRoomId = null;  // Cambiado a null para cerrar el popup
  }

  getBackgroundColor(estado: string): string {
    switch (estado) {
      case 'disponible':
        return '#d4edda';
      case 'ocupada':
        return '#f8d7da';
      case 'mantenimiento':
        return '#fff3cd';
      default:
        return '#f9f9f9';
    }
  }
}
