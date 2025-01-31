import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Room } from '../../interfaces/room';
import { RoomService } from '../../services/roomService/room.service';
import { ReservationService } from '../../services/reservationService/reservation.service';
import { Reservation } from '../../interfaces/reservation';
import { CommonModule, DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { ReservationFormComponent } from '../../reservationComponents/reservation-form/reservation-form.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-room-details',
  standalone: true,
  imports: [CommonModule, DatePipe, ReservationFormComponent],
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
    private reservationService: ReservationService,
    private router: Router // Inyecta el router
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
        //console.log("Reservacion ",this.reservation);
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
    if (!this.room) {
      console.error('No hay información de la sala.');
      return;
    }
    // Cerrar el popup antes de navegar
    this.isPopupVisible = false;
    // Navegar al componente de reservas pasando el roomId en la URL
    this.router.navigate(['/room', this.room._id]);
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
      id: this.room._id,
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

          // Verificar que exista un ID en la reserva antes de actualizar
          if (this.reservation?._id) {
            const updatedReservation = {
              ...this.reservation,
              estado: 'inactivo', // Cambiar el estado de la reserva a inactivo
            };

            // Llamar al servicio para actualizar la reservación
            this.reservationService.updateReservation(this.reservation._id, updatedReservation).subscribe({
              next: (updatedReservationResponse) => {
                this.reservation = updatedReservationResponse; // Actualizar la información de la reserva en el frontend
                console.log('Reservación cancelada (estado cambiado a inactivo).', this.reservation);
              },
              error: (error) => {
                console.error('Error al cancelar la reservación:', error.message);
              },
            });
          } else {
            console.error('No se encontró un ID válido para la reservación.');
          }
        }
    });
    // Cerrar el popup antes de navegar
    this.closePopup();
  }
  

  closePopup(): void {
    this.isPopupVisible = false; // Ocultar el popup cuando se haga clic en la X
    this.onClose.emit();  // Emitir el evento para que el componente padre cierre el popup
  }
}
