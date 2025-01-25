import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { Room } from '../../interfaces/room';
import { io, Socket } from 'socket.io-client';


@Injectable({
  providedIn: 'root'
})
export class RoomService {

  private socket: Socket;

  constructor(private http: HttpClient) {
    this.socket = io('http://localhost:3000'); // Conexion al servidor WebSocket
  }

  private urlAPI: string = "http://localhost:3000/api/rooms";

  // Método para obtener la lista de salas
  getRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(this.urlAPI).pipe(
      catchError((error) => {
        console.error('Error al obtener las salas:', error);
        return throwError(() => new Error('No se pudieron cargar las salas. Inténtalo más tarde.'));
      })
    );
  }

  // Método para obtener una sala por su ID
  getRoomById(roomId: string): Observable<Room> {
    return this.http.get<Room>(`${this.urlAPI}/${roomId}`).pipe(
      catchError((error) => {
        console.error('Error al obtener la sala:', error);
        return throwError(() => new Error('No se pudo cargar la sala. Inténtalo más tarde.'));
      })
    );
  }

  // Escucha actualizaciones en tiempo real de las salas a través de WebSocket.
  listenToRoomUpdates(): Observable<any[]> {
    return new Observable((subscriber) => { // Crea un nuevo `Observable` que se suscribe a eventos del socket | Usa el método `on` del socket para escuchar el evento `roomsUpdated`
      this.socket.on('roomsUpdated', (data) => { // Cuando el evento es recibido, se llama a `subscriber.next(data)` para emitir los datos a todos los suscriptores de este observable
        subscriber.next(data);
      });
    });
  }

  // Método para eliminar una sala por ID
  deleteRoom(roomId: string): Observable<any> {
    // Verificar si la sala existe
    return this.getRoomById(roomId).pipe(
      catchError((error) => {
        console.error('Error al obtener la sala:', error);
        //alert('La sala con el ID proporcionado no existe.');
        return throwError(() => new Error('Sala no encontrada'));  // Emitir un error explícito
      }),
      switchMap((room) => {
        if (!room) {
          // Si la sala no existe, detenemos el flujo
          return throwError(() => new Error('La sala con el ID proporcionado no existe.'));
        }
  
        console.log('Procediendo con la eliminación...');
        return this.http.delete(`${this.urlAPI}/${roomId}`).pipe(
          catchError((error) => {
            console.error('Error al eliminar la salaaaaa:', error);
            //alert('Error al eliminar la sala');
            return throwError(() => new Error('Error al eliminar la sala'));
          })
        );
      })
    );
  }
  
}
