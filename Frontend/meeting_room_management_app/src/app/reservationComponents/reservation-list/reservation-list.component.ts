import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../../services/reservationService/reservation.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { format } from 'date-fns-tz';
import { RoomService } from '../../services/roomService/room.service';
import { catchError, forkJoin, map, of } from 'rxjs';

@Component({
  selector: 'app-reservation-list',
  standalone: true,
  imports: [HttpClientModule, CommonModule],
  templateUrl: './reservation-list.component.html',
  styleUrl: './reservation-list.component.css'
})
export class ReservationListComponent implements OnInit{
  reservations: any[] = []; // Propiedad para almacenar las salas
  error: string | null = null;  // Para mostrar el error en caso de haber

  constructor(private reservationService: ReservationService, private roomService: RoomService){}  // Inyectamos el servicio que se cominica con la DB

  ngOnInit(): void {
    this.loadReservations(); // Carga inicial de las salas
    this.listenForUpdates();  // Escucha las actualizaciones en tiempo real
  }

  
  private loadReservations(): void {
    this.reservationService.getReservations().subscribe({
      next: (data) => {
        // Mapeamos las reservaciones y buscamos los detalles de la sala
        const reservationsWithRoomDetails = data.map((reservation) => {
          return this.roomService.getRoomById(reservation.idSala).pipe(
            map((room) => ({
              ...reservation,
              nombreSala: room.nombre,
              capacidad: room.capacidad,
              fechaInicio: this.convertToMexicoTime(reservation.fechaInicio),
              fechaFin: this.convertToMexicoTime(reservation.fechaFin),
            })),
            catchError(() => {
              // Si no se encuentra la sala, asignamos valores predeterminados
              return of({
                ...reservation,
                nombreSala: 'Sala no encontrada',
                capacidad: 'N/A',
                fechaInicio: this.convertToMexicoTime(reservation.fechaInicio),
                fechaFin: this.convertToMexicoTime(reservation.fechaFin),
              });
            })
          );
        });
  
        // Resolvemos todas las observables para obtener las reservaciones completas
        forkJoin(reservationsWithRoomDetails).subscribe({
          next: (reservations) => {
            this.reservations = reservations;
            this.sort();
          },
          error: (err) => {
            this.error = 'Error al cargar las reservaciones con los detalles de las salas.';
            console.error(err);
          },
        });
      },
      error: (err) => {
        this.error = 'Error al cargar las reservaciones.';
        console.error('Error en el componente:', err);
      },
    });
  }
  

  // Escucha las actualizaciones en tiempo real de las salas a través del servicio
  private listenForUpdates(): void {
    this.reservationService.listenToReservationUpdates().subscribe({ // Se suscribe al observable devuelto por `listenToRoomUpdates` del servicio `RoomService`
      next: (updatedReservations) => {
        this.reservations = updatedReservations; // se actualiza la propiedad `rooms`
        this.sort();
        this.loadReservations(); // Carga inicial de las salas
        console.log('Reservaciones actualizadas:', this.reservations);
      }
    });
  }

  private sort(): void {
    // Ordenar primero por fecha (más reciente primero) y luego por estado ("activo" primero)
    this.reservations.sort((a, b) => {
      // Luego ordenamos por estado: "activo" antes que "inactivo"
      if (a.estado === 'activo' && b.estado !== 'activo') return -1;
      if (a.estado !== 'activo' && b.estado === 'activo') return 1;
      // Primero ordenamos por fecha de creación (más reciente primero)
      const dateComparison = b.fechaInicio - a.fechaInicio;
      if (dateComparison !== 0) return dateComparison;

      // Luego ordenamos por estado: "activo" antes que "inactivo"
      if (a.estado === 'activo' && b.estado !== 'activo') return -1;
      if (a.estado !== 'activo' && b.estado === 'activo') return 1;
      
      return 0;
    });
  }

  // Método para eliminar una reservacion por ID
    deleteReservation(reservationId: string): void {
      // Mostrar un cuadro de confirmación con SweetAlert2
      Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'rgb(180, 144, 3)',
        cancelButtonColor: '#808080',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          // Si el usuario confirma, proceder con la eliminación
          this.reservationService.deleteReservation(reservationId).subscribe({
            next: () => {
              console.log('Sala eliminada exitosamente');
              // Mostrar alerta de éxito
              Swal.fire({
                title: '¡Eliminada!',
                text: 'La reservacion ha sido eliminada correctamente.',
                icon: 'success',
                confirmButtonColor: 'rgb(180, 144, 3)'
              });
            },
            error: (err) => {
              // this.error = err.message;
              // console.error('Error al eliminar la reservacion:', err);
              // alert(this.error || 'Error desconocido al eliminar la reservacion');
            }
          });
        } else {
          // Si el usuario cancela, no hacer nada
          console.log('Eliminación cancelada');
        }
      });
    }
  
    private convertToMexicoTime(date: Date): string {
      const mexicoTimezone = 'America/Mexico_City'; // Zona horaria de México
      return format(date, 'yyyy-MM-dd HH:mm:ss', { timeZone: mexicoTimezone });
    }
    
}
