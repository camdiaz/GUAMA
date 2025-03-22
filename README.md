# Sistema de Gestión de Transacciones

Este proyecto implementa un sistema para gestionar transacciones con un backend en Spring Boot y un frontend en React.

## Requisitos

- Java 17+
- Node.js 16+
- Maven
- Npm

## Estructura del proyecto

- `/backend`: API REST con Spring Boot
- `/frontend`: Aplicación React con TypeScript

## Instrucciones de ejecución

### Backend

1. Navegar al directorio backend:
```bash
cd backend
```

2. Compilar y ejecutar la aplicación:
```bash
mvn clean install
mvn spring-boot:run
```

El servidor se ejecutará en http://localhost:8080

La consola H2 estará disponible en http://localhost:8080/h2-console con los siguientes parámetros:
- JDBC URL: jdbc:h2:mem:transaccionesdb
- Usuario: sa
- Contraseña: password

### Frontend

1. Navegar al directorio frontend:
```bash
cd frontend
```

2. Instalar dependencias:
```bash
npm install
```

3. Ejecutar la aplicación:
```bash
npm start
```

La aplicación estará disponible en http://localhost:3000

## Funcionalidades

### 1. Registro de Transacciones

- Agregar nuevas transacciones con nombre, fecha y valor
- Editar transacciones existentes
- Eliminar transacciones

### 2. Visualización de Transacciones

- Ver lista completa de transacciones
- Filtrar por nombre, fecha y estado
- Las transacciones pagadas no pueden ser editadas ni eliminadas

### 3. Realizar Pagos

- Procesar pagos que automáticamente se aplican a las transacciones más antiguas
- Actualización automática del estado de las transacciones tras el pago
- El sistema solo paga transacciones completas (no pagos parciales)

## API REST

### Endpoints

- `GET /api/transactions`: Obtener todas las transacciones (soporta filtros)
- `POST /api/transactions`: Crear una nueva transacción
- `PUT /api/transactions/{id}`: Actualizar una transacción existente
- `DELETE /api/transactions/{id}`: Eliminar una transacción
- `POST /api/transactions/process-payment`: Procesar un pago

## Pruebas

### Backend

Ejecutar pruebas unitarias:
```bash
cd backend
mvn test
```

## Notas sobre la implementación

- Se utiliza H2 como base de datos en memoria para simplicidad
- Las transacciones pagadas se muestran con estado diferente y sin opciones de edición