# CONTROLPD
CONTROLPD - Herramienta de Control y Seguimiento
Descripción General
Herramienta de control y seguimiento para las funciones de producción visual y de tareas que obedezcan al desarrollo de otras herramientas y productos del área de marketing de HGIO.
Características Principales
Autenticación con Google: Inicio de sesión seguro restringido a cuentas del dominio corporativo.

Gestión de Tareas: Crear, editar, asignar y visualizar tareas con títulos, descripciones y fechas de entrega.

Flujo de Aprobación Multinivel: Las tareas siguen un ciclo de vida desde "Pendiente" hasta "Aprobado por Dirección" y "Finalizado", pasando por revisiones y posibles rechazos.

Vista de Calendario: Visualización interactiva de todas las tareas, codificadas por color según su estado para una fácil identificación.

Dashboard de Estadísticas: Gráficos que muestran métricas clave sobre el rendimiento del equipo, tareas completadas, y tiempos de ciclo.

Gestión de Usuarios (Rol Director): Permite asignar roles (Equipo, Coordinador, Director) a los usuarios del sistema para controlar los permisos.

Configuración de Firebase
Para que la aplicación funcione, es crucial configurar correctamente el proyecto de Firebase.

1. Crear el Archivo firebase-config.js
Este es el paso más importante para la seguridad. Crea un archivo llamado firebase-config.js en la raíz de tu proyecto. NO subas este archivo a GitHub. Su contenido debe ser:

export const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "TU_AUTH_DOMAIN",
    projectId: "TU_PROJECT_ID",
    storageBucket: "TU_STORAGE_BUCKET",
    messagingSenderId: "TU_MESSAGING_SENDER_ID",
    appId: "TU_APP_ID"
};

Reemplaza los valores TU_* con las credenciales de tu proyecto de Firebase.

2. Estructura de la Base de Datos (Firestore)
Crea las siguientes colecciones en tu base de datos de Firestore:

users: Almacena la información de los usuarios y sus roles.

Cada documento tendrá como ID el UID del usuario de Firebase.

Campos: uid, email, displayName, role (string: 'equipo', 'coordinador', o 'director').

tasks: Almacena toda la información de las tareas.

Cada documento es una tarea con un ID autogenerado.

Campos: title, description, assigneeId, assigneeName, creatorId, creatorName, dueDate, status, createdAt, updatedAt, approvalHistory (array).

3. Reglas de Seguridad de Firestore
Ve a la sección Firestore Database > Rules en tu consola de Firebase y reemplaza el contenido con las reglas del archivo database.rules.json.

4. Autenticación
Ve a la sección Authentication > Sign-in method en tu consola de Firebase.

Habilita el proveedor de inicio de sesión de Google.
