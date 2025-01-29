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
      // Verificar las reservaciones activas
      this.reservationService.getReservations().subscribe((reservations) => {
        this.updateRoomStates(reservations);  // Actualiza los estados de las salas
      });
    }, 600);  // Verificar
  }

  private updateRoomStates(reservations: Reservation[]): void {
    const currentDate = new Date(); // Obtener la fecha actual
  
    // Crear un conjunto de IDs de salas con reservas activas
    const activeRoomIds = new Set(
      reservations.filter(reservation => reservation.estado === 'activo').map(reservation => reservation.idSala)
    );
  
    // Iterar sobre todas las salas para actualizar sus estados
    this.rooms.forEach(room => {
      if (!room._id) {
        console.warn(`La sala "${room.nombre}" no tiene un ID válido.`);
        return; // Saltar a la siguiente sala si _id es undefined
      }
  
      if (activeRoomIds.has(room._id)) {
        // Si la sala tiene una reserva activa, verificar su estado
        const activeReservation = reservations.find(
          reservation => reservation.idSala === room._id && reservation.estado === 'activo'
        );
        if (activeReservation) {
          const reservationStart = new Date(activeReservation.fechaInicio);
          const reservationEnd = new Date(activeReservation.fechaFin);

          if (currentDate > reservationEnd) {
            // La reserva ha expirado, marcar la sala como disponible
            room.estado = 'disponible';
            this.updateRoomStatus(room._id, 'disponible');
          } else if (currentDate >= reservationStart && currentDate < reservationEnd) {
            // La reserva sigue activa, marcar la sala como ocupada
            room.estado = 'ocupada';
            this.updateRoomStatus(room._id, 'ocupada');
          }
        }
      } else {
        // Si la sala no tiene reservas activas, marcarla como disponible
        if (room.estado !== 'mantenimiento') { // Mantener las salas en mantenimiento si ya están así
          room.estado = 'disponible';
          this.updateRoomStatus(room._id, 'disponible');
        }
      }
    });
  }
  
  // Método auxiliar para actualizar el estado de una sala en el backend
  private updateRoomStatus(roomId: string, status: string): void {
    if (!roomId) {
      console.error('No se puede actualizar el estado de la sala: el ID es inválido.');
      return;
    }
  
    this.roomService.updateRoomStatus(roomId, status).subscribe({
      next: () => {
        //console.log(`Estado de la sala ${roomId} actualizado a ${status}`);
      },
      error: (error) => {
        console.error(`Error al actualizar el estado de la sala ${roomId}:`, error);
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
