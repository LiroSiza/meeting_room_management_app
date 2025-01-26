import { Component, EventEmitter, Output } from '@angular/core';
import { Room } from '../../interfaces/room';
import { RoomService } from '../../services/roomService/room.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-room-creation-form',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule],
  templateUrl: './room-creation-form.component.html',
  styleUrl: './room-creation-form.component.css'
})
export class RoomCreationFormComponent {
  @Output() roomCreated = new EventEmitter<Room>();
  isModalOpen = false; // Controla si el modal está abierto o cerrado
  rooms: Room[] = []; // Lista de salas para validación

  room: Room = {
    nombre: '',
    estado: 'disponible',
    capacidad: 5,
    id: ''
  };

  constructor(private roomService: RoomService) {}

  // Abre el modal
  openModal(): void {
    this.isModalOpen = true;
    this.loadRooms();
  }

  // Cierra el modal
  closeModal(): void {
    this.isModalOpen = false;
    // Limpiar los campos después de la creación
    this.resetForm();
  }

  // Cargar las salas para la validación
  private loadRooms(): void {
    this.roomService.getRooms().subscribe({
      next: (rooms) => (this.rooms = rooms),
      error: (err) => console.error('Error al cargar las salas', err)
    });
  }

  // Envia los datos para crear una nueva sala
  onSubmit(): void {
    if (!this.room.nombre || !this.room.estado || !this.room.capacidad) {
      Swal.fire('Error', 'Todos los campos son obligatorios', 'error');
      return;
    }

    // Validar que el nombre de la sala no se repita
    const roomExists = this.rooms.some((existingRoom) => existingRoom.nombre === this.room.nombre);
    if (roomExists) {
      Swal.fire('Error', 'El nombre de la sala ya está registrado', 'error');
      return;
    }

    // Crear la sala si pasa las validaciones
    this.roomService.createRoom(this.room).subscribe({
      next: (newRoom) => {
        Swal.fire({
          title: 'Éxito',
          text: 'Sala creada exitosamente',
          icon: 'success',
          confirmButtonColor: 'rgb(180, 144, 3)'
        });
        this.roomCreated.emit(newRoom);
        this.closeModal();
      },
      error: (err) => {
        console.error('Error al crear la sala', err);
        Swal.fire('Error', 'No se pudo crear la sala', 'error');
      }
    });
  }

  // Función para resetear el formulario
  private resetForm(): void {
    this.room = {
      nombre: '',
      estado: 'disponible',
      capacidad: 5,
      id: ''
    };
  }
}
