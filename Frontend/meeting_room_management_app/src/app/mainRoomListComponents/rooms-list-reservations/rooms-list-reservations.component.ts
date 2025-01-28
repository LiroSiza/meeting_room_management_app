import { Component, OnInit } from '@angular/core';
import { RoomService } from '../../services/roomService/room.service';
import { Room } from '../../interfaces/room';
import { CommonModule } from '@angular/common';
import { RoomDetailsComponent } from '../room-details/room-details.component';
import { ReservationService } from '../../services/reservationService/reservation.service';
import { Reservation } from '../../interfaces/reservation';

@Component({
  selector: 'app-rooms-list-reservations',
  standalone: true,
  imports: [CommonModule, RoomDetailsComponent],
  templateUrl: './rooms-list-reservations.component.html',
  styleUrl: './rooms-list-reservations.component.css'
})
export class RoomsListReservationsComponent implements OnInit {
  rooms: Room[] = [];
  selectedRoomId: string | null = null;  
  private intervalId: any;

  constructor(private roomService: RoomService, private reservationService: ReservationService) {}

  ngOnInit(): void {
    this.loadRooms();
    this.listenForUpdates();  // Escucha las actualizaciones en tiempo real
    this.startAutoCheckReservations();  // Inicia la verificación periódica de las reservas
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);  // Limpiar intervalo al destruir el componente
    }
  }

  loadRooms(): void {
    this.roomService.getRooms().subscribe((rooms) => {
      this.rooms = rooms;
    });
  }

  private listenForUpdates(): void {
    this.reservationService.listenToReservationUpdates().subscribe(updatedReservations => {
      this.updateRoomStates(updatedReservations);
    });
  }

  private startAutoCheckReservations(): void {
    this.intervalId = setInterval(() => {
      // Verificar las reservaciones activas cada minuto
      this.reservationService.getReservations().subscribe((reservations) => {
        this.updateRoomStates(reservations);  // Actualiza los estados de las salas
      });
    }, 60000);  // Verificar cada 1 minuto (60000 ms)
  }

  private updateRoomStates(reservations: Reservation[]): void {
    const currentDate = new Date();  // Obtener la fecha actual

    reservations.forEach(reservation => {
      if (reservation.estado === 'activo') {
        const reservationEnd = new Date(reservation.fechaFin);

        // Si la fecha actual es posterior a la fecha de fin de la reserva, desocupar la sala
        if (currentDate > reservationEnd) {
          const room = this.rooms.find(r => r._id === reservation.idSala);
          if (room) {
            room.estado = 'disponible';  // Cambiar el estado de la sala a 'disponible'
            
            // Llamar al servicio para actualizar el estado de la sala en la base de datos
            if (room && room._id) {  // Verifica si 'room' y '_id' son válidos
              this.roomService.updateRoomStatus(room._id, 'disponible').subscribe({
                next: (response) => {
                  console.log(`Estado de la sala ${room.nombre} actualizado a 'disponible'`);
                },
                error: (error) => {
                  console.error(`Error al actualizar el estado de la sala ${room.nombre}:`, error);
                }
              });
            }            
          }
        } else {
          const room = this.rooms.find(r => r._id === reservation.idSala);
          if (room) {
            room.estado = 'ocupada';  // Cambiar el estado a 'ocupada' si la reserva está activa
          }
        }
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
