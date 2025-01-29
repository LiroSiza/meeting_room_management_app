
# Reservation Management System

## Descripción
Esta es una aplicación de reservas para la gestión de salas dentro de una empresa. Permite a los usuarios reservar salas de reuniones, visualizar las reservas existentes y evitar conflictos de horarios. La aplicación se conecta a un backend para manejar las solicitudes de reservas y obtener la información necesaria sobre las salas y las reservas previas.

## Funciones
1. **Visualización de Salas**: Los usuarios pueden ver las salas disponibles dentro de la empresa.
2. **Reserva de Salas**: Los usuarios pueden hacer una reserva indicando la sala, el nombre del usuario y los horarios de inicio y fin de la reserva.
3. **Confirmación de Reserva**: El sistema verifica si la reserva se solapa con otras existentes y valida si la duración está dentro de un rango permitido.
4. **Cancelación de Reserva**: Los administradores pueden cancelar una reserva activa, poniendo la sala nuevamente disponible.
5. **Interfaz de Usuario Interactiva**: El usuario puede ver las reservas actuales y hacer nuevas reservas en un formulario interactivo.
6. **Notificaciones**: Se muestran mensajes para confirmar o informar sobre errores en la reserva, como conflictos de horarios o duración no válida.
7. **Tiempo Real**: El sistema actualiza las reservas mostradas cada minuto para reflejar cambios recientes.

## Tecnologías Utilizadas

### Frontend
- **Angular**: Framework de desarrollo de aplicaciones web utilizado para la construcción de la interfaz de usuario.
- **HTML5/CSS3**: Para la estructuración y estilización de la interfaz.
- **TypeScript**: Lenguaje utilizado para el desarrollo de la lógica de la aplicación en Angular.
- **SweetAlert2**: Librería para mostrar alertas interactivas y notificaciones.
- **Date-fns-tz**: Utilizado para el manejo y formato de fechas y horas en la aplicación.

### Backend
- **Node.js**: Plataforma de servidor para manejar las peticiones de la aplicación.
- **Express.js**: Framework para Node.js que facilita la creación de rutas y la lógica del servidor.
- **MongoDB**: Base de datos no relacional utilizada para almacenar las salas y reservas.
- **Mongoose**: ORM de MongoDB que facilita la interacción con la base de datos.

## Librerías y Dependencias
### Frontend:
- **@angular/forms**: Para la creación de formularios reactivos y validaciones.
- **@angular/common**: Utilizado para funcionalidades comunes como el manejo de fechas.
- **@angular/router**: Para la navegación dentro de la aplicación.
- **rxjs**: Para la gestión de flujo de datos y observables.
- **sweetalert2**: Para mostrar alertas interactivas y mensajes de confirmación.

### Backend:
- **express**: Framework para Node.js.
- **mongoose**: Librería de modelado de datos para MongoDB.
- **cors**: Middleware para permitir solicitudes entre diferentes orígenes.
- **dotenv**: Para gestionar variables de entorno.
- **Socket.IO**: Para permitir la comunicación en tiempo real entre el servidor y el cliente.

## Herramientas:
- **Mongo Compass:** Herramienta gráfica para gestionar la base de datos MongoDB, realizar consultas y administrar colecciones.
- **Postman:** Herramienta para realizar pruebas y enviar solicitudes HTTP a la API durante el desarrollo.

## Instrucciones para Correr el Proyecto

### 1. Clonar el Repositorio
Clona el repositorio en tu máquina local usando el siguiente comando:

```bash
git clone https://github.com/LiroSiza/reservation-management-system.git
```

### 2. Configuración del Backend
1. Navega al directorio del backend:

```bash
cd backend
```

2. Instala las dependencias de Node.js:

```bash
npm install
```

3. Crea un archivo `.env` en el directorio raíz del backend de cada servidor y configura las variables de entorno (puedes usar el archivo `variables.env` como guía):

```env
MONGO_DB=MONGO_DB=mongodb+srv://lionintel:"password"@cluster0.ee06n.mongodb.net/"nombreDB"
```

4. Inicia los servidores:

```bash
node server
```

El backend estará disponible en `http://localhost:3000` y `http://localhost:3001`.

### 3. Configuración del Frontend
1. Navega al directorio del frontend:

```bash
cd frontend
```

2. Instala las dependencias de Angular:

```bash
npm install
```

3. Inicia el servidor de desarrollo:

```bash
ng serve
```

El frontend estará disponible en `http://localhost:4200`.

### 4. Prueba de la Aplicación
- Abre `http://localhost:4200` en tu navegador.
- Si todo está configurado correctamente, deberías ver la interfaz de usuario de la aplicación de reservas.
- Puedes interactuar con la aplicación para realizar reservas, visualizar salas y cancelar reservas.

## Contribuciones
Si deseas contribuir a este proyecto, por favor abre un *pull request* con tus cambios y mejoras. Asegúrate de seguir las convenciones de código del proyecto y escribir pruebas para cualquier nueva funcionalidad.

## Licencia
Este proyecto está bajo la Licencia Apache.
