import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RoomService } from '../../services/roomService/room.service';
import { Room } from '../../interfaces/room';
import Swal from 'sweetalert2';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-room-update-form',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule],
  templateUrl: './room-update-form.component.html',
  styleUrl: './room-update-form.component.css'
})
export class RoomUpdateFormComponent {
  room: Room = { nombre: '', estado: 'disponible', capacidad: 5, id: '' }; // Recibe los datos de la sala a actualizar
  rooms: Room[] = []; // Lista de salas para validación
  @Output() roomUpdated = new EventEmitter<Room>(); // Emite la sala actualizada
  validationErrors = {
    nombre: '',
    estado: '',
    capacidad: ''
  };

  isModalOpen = false; // Controla si el modal está abierto o cerrado

  constructor(private roomService: RoomService) {}

  // Abre el modal con los datos de la sala que se desea actualizar
  openModal(room: Room): void {
    this.room = { ...room }; // Establece los valores del formulario con la sala que se quiere actualizar
    this.isModalOpen = true;
    this.loadRooms();
  }

  // Cierra el modal
  closeModal(): void {
    this.isModalOpen = false;
    // Limpiar los campos después de la actualización
    this.resetForm();
  }

  private loadRooms(): void {
    this.roomService.getRooms().subscribe({
      next: (rooms) => (this.rooms = rooms),
      error: (err) => console.error('Error al cargar las salas', err)
    });
  }

  // Envia los datos para actualizar la sala
  onSubmit(): void {
    this.clearValidationErrors(); // Limpia los errores previos
  
    // Validar que todos los campos sean obligatorios
    if (!this.room.nombre || !this.room.estado || !this.room.capacidad) {
      if (!this.room.nombre) {
        this.validationErrors.nombre = 'El nombre es obligatorio.';
      }
      if (!this.room.estado) {
        this.validationErrors.estado = 'El estado es obligatorio.';
      }
      if (!this.room.capacidad) {
        this.validationErrors.capacidad = 'La capacidad es obligatoria.';
      }
      return; // Detener el flujo si faltan campos
    }
  
    // Validar que el nombre no esté repetido
    const roomExists = this.rooms.some(
      (existingRoom) =>
        existingRoom.nombre === this.room.nombre && existingRoom._id !== this.room.id
    );
    if (roomExists) {
      Swal.fire({
        title: 'Advertencia',
        text: 'El nombre de la sala ya está en uso. Por favor, elige otro nombre.',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: 'rgb(180, 144, 3)' // Puedes cambiar el color aquí
      });
      return; // Detener el flujo si el nombre ya existe
    }
  
    // Si pasa las validaciones, proceder con la actualización
    this.roomService.updateRoom(this.room).subscribe({
      next: (updatedRoom) => {
        //console.log('Sala actualizada exitosamente', updatedRoom);
        this.closeModal();
        Swal.fire({
          title: '¡Actualizada!',
          text: 'La sala ha sido actualizada correctamente.',
          icon: 'success',
          confirmButtonColor: 'rgb(180, 144, 3)'
        });
      },
      error: (err) => {
        console.error('Error al actualizar la sala', err);
      }
    });
  }
  

  // Función para resetear el formulario
  private resetForm(): void {
    this.room = { nombre: '', estado: 'disponible', capacidad: 5, id: '' };
  }

  // Limpia los errores de validación
  private clearValidationErrors(): void {
    this.validationErrors = {
      nombre: '',
      estado: '',
      capacidad: ''
    };
  }
}
