import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Room } from '../../interfaces/room';
import { RoomService } from '../../services/roomService/room.service';
import { ReservationService } from '../../services/reservationService/reservation.service';
import { Reservation } from '../../interfaces/reservation';
import { CommonModule, DatePipe } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-room-details',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './room-details.component.html',
  styleUrl: './room-details.component.css'
})
export class RoomDetailsComponent implements OnInit {
  @Input() roomId!: string; // ID de la sala recibida desde el padre
  @Output() onClose = new EventEmitter<void>();

  room: Room | null = null;
  reservation: Reservation | null = null;
  isPopupVisible: boolean = false; // Variable para controlar la visibilidad del popup

  constructor(
    private roomService: RoomService,
    private reservationService: ReservationService
  ) {}

  ngOnInit(): void {
    if (this.roomId) {
      this.loadRoomDetails();
    }
  }

  loadRoomDetails(): void {
    this.roomService.getRoomById(this.roomId).subscribe((room) => {
      this.room = room;
      if (room.estado === 'ocupada') {
        this.loadReservationDetails();
      } else {
        // Usar setTimeout para retrasar la visibilidad del popup
        setTimeout(() => {
          this.isPopupVisible = true; // Mostrar el popup después de un retraso
        }, 500); // Retraso de 500 milisegundos (puedes ajustar el tiempo)
      }
    });
  }

  loadReservationDetails(): void {
    if (!this.roomId) {
      console.error('Error: No se proporcionó el ID de la sala.');
      return;
    }

    this.reservationService.getActiveReservationByRoomId(this.roomId).subscribe({
      next: (reservation) => {
        this.reservation = reservation; // Aquí se almacena la reservación activa
        this.isPopupVisible = true; // Mostrar el popup después de un retraso
        
        /*setTimeout(() => {
          this.isPopupVisible = true; 
        }, 0); // Retraso demilisegundos*/
      },
      error: (error) => {
        console.error('Error al obtener la reservación activa:', error.message);
      },
    });
  }

  reserveRoom(): void {
    console.log('Reservar la sala:', this.roomId);
    // Implementar la lógica de reserva
  }

  cancelReservation(): void {
    if (!this.room) {
      console.error('No se puede cancelar la reserva porque no se encontró la sala.');
      return;
    }
  
    // Crear un objeto con los datos de la sala actualizados
    const updatedRoom: Room = {
      ...this.room, // Copiar todos los datos actuales de la sala
      estado: 'disponible', // Cambiar el estado a "disponible"
      id: this.roomId,
    };
  
    // Mostrar confirmación usando SweetAlert2
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción cancelará la reservación actual y pondrá la sala como disponible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        // Llamar al servicio para actualizar la sala
        this.roomService.updateRoom(updatedRoom).subscribe({
          next: (updatedRoomResponse) => {
            this.room = updatedRoomResponse; // Actualizar la información de la sala en el frontend
            this.reservation = null; // Limpiar la reserva actual
            console.log('Reservación cancelada y sala actualizada a disponible.');
          },
          error: (error) => {
            console.error('Error al cancelar la reservación:', error.message);
          },
        });
      }
    });
  }
  

  closePopup(): void {
    this.isPopupVisible = false; // Ocultar el popup cuando se haga clic en la X
    this.onClose.emit();  // Emitir el evento para que el componente padre cierre el popup
  }
}
