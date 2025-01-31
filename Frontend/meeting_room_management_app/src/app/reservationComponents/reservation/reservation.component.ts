import { Component, Input, OnInit } from '@angular/core';
import { Room } from '../../interfaces/room';
import { Reservation } from '../../interfaces/reservation';
import { ActivatedRoute } from '@angular/router';
import { RoomService } from '../../services/roomService/room.service';
import { ReservationService } from '../../services/reservationService/reservation.service';
import { CommonModule, DatePipe } from '@angular/common';
import { ReservationFormComponent } from '../reservation-form/reservation-form.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [CommonModule, DatePipe, ReservationFormComponent],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.css'
})
export class ReservationComponent implements OnInit {
  @Input() roomId: string | null = null; // Aquí recibimos el roomId
  room: Room | null = null;
  allReservations: Reservation[] = []; // Todas las reservas del sistema
  reservations: Reservation[] = []; // Reservas filtradas para esta sala
  private intervalId: any;

  constructor(
    private route: ActivatedRoute,
    private roomService: RoomService,
    private reservationService: ReservationService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.roomId = params.get('roomId');
      if (this.roomId) {
        this.loadRoomDetails();
        this.loadAllReservations();
        this.startAutoCheckReservations();  // Inicia la verificación periódica de las reservas
      }
    });
  }

  loadRoomDetails(): void {
    this.roomService.getRoomById(this.roomId!).subscribe((room) => {
      this.room = room;
    });
  }

  loadAllReservations(): void {
    this.reservationService.getReservations().subscribe((reservations) => {
      // Filtrar las reservas que pertenecen a la sala con roomId y que están activas
      this.reservations = reservations
      .filter(reservation => reservation.idSala === this.roomId && reservation.estado === 'activo')
      .sort((a, b) => new Date(a.fechaInicio).getTime() - new Date(b.fechaInicio).getTime());
    });
  }

  private startAutoCheckReservations(): void {
    this.intervalId = setInterval(() => {
      this.loadAllReservations()
    }, 600);  // Verificar
  }

  validateReservation(startTime: Date, endTime: Date): boolean {
    for (const reservation of this.reservations) {
      const reservationStart = new Date(reservation.fechaInicio);
      const reservationEnd = new Date(reservation.fechaFin);

      if (
        (startTime >= reservationStart && startTime < reservationEnd) || // Inicio traslapa
        (endTime > reservationStart && endTime <= reservationEnd) || // Fin traslapa
        (startTime <= reservationStart && endTime >= reservationEnd) // Cubre otra reserva
      ) {
        return false; // Hay traslape
      }
    }
    return true; // No hay traslapes
  }

  handleSubmitReservation(data: { startTime: Date; endTime: Date }): void {
    /*if (!this.validateReservation(data.startTime, data.endTime)) {
      Swal.fire('Error', 'Los horarios seleccionados traslapan con una reserva existente.', 'error');
      return;
    }*/

    //Swal.fire('Éxito', 'La reserva no tiene conflictos y puede proceder.', 'success');
    // agregar lógica para enviar los datos al backend
    //console.log('Reserva enviada:', data);
    clearInterval(this.intervalId);
    
  }

  returnToRoomList(): void {
    window.history.back(); // Regresar a la lista de salas
    clearInterval(this.intervalId);
  }
}
