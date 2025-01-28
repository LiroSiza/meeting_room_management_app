import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { Reservation } from '../../interfaces/reservation';
import Swal from 'sweetalert2';
import { format } from 'date-fns-tz';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  private socket: Socket;
  private reservations: Reservation[] = []; // Para almacenar las reservaciones obtenidas

  constructor(private http: HttpClient) {
    this.socket = io('http://localhost:3001'); // Conexion al servidor WebSocket
    this.updateReservationsPeriodically();  // Inicia el proceso de actualización periódica
  }

  private urlAPI: string = "http://localhost:3001/api/reservation";

  // Método para obtener las reservaciones filtradas (inactivas eliminadas)
  getFilteredReservations(): Reservation[] {
    return this.reservations.filter(reservation => reservation.estado !== 'inactivo');
  }

  // Método para actualizar las reservaciones periódicamente
  private updateReservationsPeriodically(): void {
    setInterval(() => {
      this.getReservations().subscribe(reservations => {
        this.reservations = reservations;
        this.updateRoomStates();  // Actualiza el estado de las salas
        //console.log("Actualizado", reservations);
      });
    }, 6000);  // Actualiza despues de un tiempo
  }

  // Método para actualizar el estado de las salas
  private updateRoomStates(): void {
    const currentDate = new Date();  // Hora actual
    
    this.reservations.forEach(reservation => {
      const reservationStart = new Date(reservation.fechaInicio);
      const reservationEnd = new Date(reservation.fechaFin);

      if (currentDate >= reservationStart && currentDate <= reservationEnd) {
        // Si la hora actual está dentro del rango de la reservación, cambiar estado a 'inactiva'
        reservation.estado = 'inactivo';
      } else {
        // Si no, cambiar estado a 'disponible'
        reservation.estado = 'activo';
      }
    });

    // Emitir las actualizaciones al frontend
    this.socket.emit('reservationsUpdated', this.reservations);
  }

  // Método para obtener la lista de reservacion
  getReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.urlAPI).pipe(
      catchError((error) => {
        console.error('Error al obtener las reservaciones:', error);
        return throwError(() => new Error('No se pudieron cargar las reservaciones. Inténtalo más tarde.'));
      })
    );
  }

  // Método para obtener la reservación activa por el ID de la sala
  getActiveReservationByRoomId(idSala: string): Observable<Reservation> {
    const url = `${this.urlAPI}/active/${idSala}`
    return this.http.get<Reservation>(url).pipe(
      catchError((error) => {
        console.error('Error al obtener la reservación activa:', error);
        return throwError(() => new Error('Error al obtener la reservación activa.'));
      })
    );
  }
  

  // Método para obtener una reservacion por su ID
    getReservationById(reservationId: string): Observable<Reservation> {
      return this.http.get<Reservation>(`${this.urlAPI}/${reservationId}`).pipe(
        catchError((error) => {
          console.error('Error al obtener la reservation:', error);
          return throwError(() => new Error('No se pudo cargar la reservation. Inténtalo más tarde.'));
        })
      );
    }

  // Escucha actualizaciones en tiempo real de las reservacion a través de WebSocket.
  listenToReservationUpdates(): Observable<any[]> {
    return new Observable((subscriber) => { // Crea un nuevo `Observable` que se suscribe a eventos del socket | Usa el método `on` del socket para escuchar el evento `reservationsUpdated`
      this.socket.on('reservationsUpdated', (data) => { // Cuando el evento es recibido, se llama a `subscriber.next(data)` para emitir los datos a todos los suscriptores de este observable
        subscriber.next(data);
      });
    });
  }

  deleteReservation(reservationId: string): Observable<any> {
    // Verificar si la reservación existe
    return this.getReservationById(reservationId).pipe(
      catchError((error) => {
        console.error('Error al obtener la reservación:', error);
        return throwError(() => new Error('Reservación no encontrada'));  // Emitir un error explícito
      }),
      switchMap((reservation) => {
        if (!reservation) {
          // Si la reservación no existe, detenemos el flujo
          return throwError(() => new Error('La reservación con el ID proporcionado no existe.'));
        }
  
        // Obtener la hora actual en la zona horaria de México
        const currentDate = new Date();
        const mexicoCurrentDate = this.convertToMexicoTime(currentDate);  // Hora actual en la zona horaria de México
  
        // Convertir las fechas de inicio y fin de la reservación a objetos Date en la zona horaria de México
        const reservationStart = new Date(reservation.fechaInicio);
        const reservationEnd = new Date(reservation.fechaFin);
        const mexicoReservationStart = this.convertToMexicoTime(reservationStart);
        const mexicoReservationEnd = this.convertToMexicoTime(reservationEnd);
  
        // Verificar si la reserva está en curso
        if (mexicoCurrentDate >= mexicoReservationStart && mexicoCurrentDate <= mexicoReservationEnd) {
          // Si la reservación está en curso, mostrar un SweetAlert y detener la eliminación
          Swal.fire({
            icon: 'warning',
            title: 'No se puede eliminar',
            text: 'La reservación está en curso y no puede ser eliminada en este momento.',
            confirmButtonColor: '#3085d6'
          });
          return throwError(() => new Error('La reservación está en curso y no puede ser eliminada.'));
        }
  
        // Si la reservación no está en curso, proceder con la eliminación
        console.log('Procediendo con la eliminación...');
        return this.http.delete(`${this.urlAPI}/${reservationId}`).pipe(
          catchError((error) => {
            console.error('Error al eliminar la reservación:', error);
            return throwError(() => new Error('Error al eliminar la reservación'));
          })
        );
      })
    );
  }

  // Desactivar las reservaciones asociadas a una sala
  deactivateReservations(roomId: string): Observable<any> {
    if (!roomId) {
      console.error('Error: El ID de la sala no está definido.');
      return throwError(() => new Error('El ID de la sala no está definido.'));
    }

    const url = `${this.urlAPI}/deactivate/${roomId}`;
    //console.log('URL para desactivar reservaciones:', url);

    return this.http.put(url, {}).pipe(
      catchError((error) => {
        console.error('Error al desactivar las reservaciones:', error);
        return throwError(() => new Error('Error al desactivar las reservaciones.'));
      })
    );
  }



  private convertToMexicoTime(date: Date): Date {
    const mexicoTimezone = 'America/Mexico_City'; // Zona horaria de México
    return new Date(format(date, 'yyyy-MM-dd HH:mm:ss', { timeZone: mexicoTimezone }));
  }
}
