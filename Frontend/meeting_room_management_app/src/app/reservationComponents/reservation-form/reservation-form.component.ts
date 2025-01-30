import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Room } from '../../interfaces/room';
import { Reservation } from '../../interfaces/reservation';
import { ReservationService } from '../../services/reservationService/reservation.service';
import { RoomService } from '../../services/roomService/room.service';
import { format } from 'date-fns-tz';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reservation-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './reservation-form.component.html',
  styleUrl: './reservation-form.component.css'
})
export class ReservationFormComponent implements OnInit {
  @Input() roomId: string | null = null; // Aquí recibimos el roomId
  room: Room | null = null;
  allReservations: Reservation[] = []; // Todas las reservas del sistema
  reservations: Reservation[] = []; // Reservas filtradas para esta sala
  @Output() submitReservation = new EventEmitter<{ startTime: Date; endTime: Date }>();

  startTime: string = '';
  endTime: string = '';
  user: string = '';  // Campo para el usuario

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

  handleFormSubmit(): void {
    if (!this.user || !this.startTime || !this.endTime) {
      Swal.fire('Error', 'Por favor, completa todos los campos del formulario.', 'error');
      return;
    }
  
    const startDate = new Date(this.startTime);
    const endDate = new Date(this.endTime);
    const currentDate = new Date(); // Fecha y hora actual
  
    // Validar que las fechas no estén en el pasado
    if (startDate < currentDate || endDate < currentDate) {
      Swal.fire('Error', 'Las fechas no pueden ser anteriores a la fecha y hora actual.', 'error');
      return;
    }
  
    // Validar que la fecha inicial sea anterior a la fecha final
    if (startDate >= endDate) {
      Swal.fire('Error', 'La hora de inicio debe ser anterior a la hora de fin.', 'error');
      return;
    }
  
    // Calcular duración en minutos
    const durationInMinutes = (endDate.getTime() - startDate.getTime()) / (1000 * 60);
  
    // Validar que la reserva sea de al menos 15 minutos y no más de 2 horas (120 minutos)
    if (durationInMinutes < 15) {
      Swal.fire('Error', 'La reserva debe durar al menos 15 minutos.', 'error');
      return;
    }
    if (durationInMinutes > 120) {
      Swal.fire('Error', 'La reserva no puede durar más de 2 horas.', 'error');
      return;
    }
  
    // Validar que la reserva no traslape con otras
    if (!this.validateReservation(startDate, endDate)) {
      Swal.fire('Error', 'Los horarios seleccionados traslapan con una reserva existente.', 'error');
      return;
    }
  
    // Crear la nueva reserva con el usuario incluido
    const newReservation: Reservation = {
      fechaInicio: startDate,
      fechaFin: endDate,
      idSala: this.roomId!,
      estado: 'activo',
      usuario: this.user, // El usuario que hace la reserva
    };
  
    // Llamamos al servicio para crear la nueva reserva
    this.reservationService.createReservation(newReservation).subscribe({
      next: (createdReservation) => {
        console.log('Reserva creada exitosamente:');
        Swal.fire('Éxito', 'La reserva ha sido creada con éxito.', 'success');
        this.loadAllReservations(); // Para actualizar la lista despues de reservar y no duplicar reservas
        this.submitReservation.emit({ startTime: startDate, endTime: endDate });
      },
      error: (err) => {
        console.error('Error al crear la reserva:', err);
        Swal.fire('Error', 'Hubo un problema al crear la reserva. Inténtalo nuevamente.', 'error');
      }
    });
  }
  
  

  returnToRoomList(): void {
    window.history.back(); // Regresar a la lista de salas
  }
}
