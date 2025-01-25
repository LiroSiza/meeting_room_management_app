import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RoomService } from '../../services/roomService/room.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-room-list',
  standalone: true,
  imports: [HttpClientModule, CommonModule], //CommonModule para ngIf | ngFor
  templateUrl: './room-list.component.html',
  styleUrl: './room-list.component.css'
})
export class RoomListComponent implements OnInit{

  rooms: any[] = []; // Propiedad para almacenar las salas
  error: string | null = null;  // Para mostrar el error en caso de haber

  constructor(private roomService: RoomService){}  // Inyectamos el servicio que se cominica con la DB

  ngOnInit(): void {
    this.loadRooms(); // Carga inicial de las salas
    this.listenForUpdates();  // Escucha las actualizaciones en tiempo real
  }

  private loadRooms(): void {
    this.roomService.getRooms().subscribe({
      next: (data) => {
        this.rooms = data;
        console.log(this.rooms);
      },
      error: (err) => {
        this.error = err.message;
        console.error('Error en el componente:', err);
      }
    });
  }

  // Escucha las actualizaciones en tiempo real de las salas a través del servicio
  private listenForUpdates(): void {
    this.roomService.listenToRoomUpdates().subscribe({ // Se suscribe al observable devuelto por `listenToRoomUpdates` del servicio `RoomService`
      next: (updatedRooms) => {
        this.rooms = updatedRooms; // se actualiza la propiedad `rooms`
        console.log('Salas actualizadas:', this.rooms);
      }
    });
  }

  // Método para eliminar una sala por ID
  deleteRoom(roomId: string): void {
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
        this.roomService.deleteRoom(roomId).subscribe({
          next: () => {
            console.log('Sala eliminada exitosamente');
            // Mostrar alerta de éxito
            Swal.fire({
              title: '¡Eliminado!',
              text: 'La sala ha sido eliminada correctamente.',
              icon: 'success',
              confirmButtonColor: 'rgb(180, 144, 3)'
            });
          },
          error: (err) => {
            this.error = err.message;
            console.error('Error al eliminar la sala:', err);
            alert(this.error || 'Error desconocido al eliminar la sala');
          }
        });
      } else {
        // Si el usuario cancela, no hacer nada
        console.log('Eliminación cancelada');
      }
    });
  }

  editRoom(roomId: any): void {
    console.log('Editando sala:', roomId);
  }
}
