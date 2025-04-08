
# Clínica Movimentar - Backend

Backend API for the Clínica Movimentar physiotherapy management system.

## Setup

1. Install dependencies:
```
npm install
```

2. Configure environment variables by creating a `.env` file with:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/clinica-movimentar
JWT_SECRET=clinica_movimentar_secret_key
```

3. Make sure MongoDB is running on your local machine

4. Seed the database with sample data:
```
npm run data:import
```

5. Start the development server:
```
npm run dev
```

The API will be available at http://localhost:5000

## API Endpoints

### Users
- POST /api/users/login - Login with email and password
- POST /api/users - Register a new user (admin only)
- GET /api/users - Get all users (admin only)
- GET /api/users/profile - Get current user profile

### Patients
- GET /api/patients - Get all patients
- GET /api/patients/:id - Get patient by ID
- POST /api/patients - Create a new patient
- PUT /api/patients/:id - Update a patient
- DELETE /api/patients/:id - Delete a patient

### Medical Records
- GET /api/records - Get all medical records
- GET /api/records/patient/:patientId - Get records by patient ID
- GET /api/records/:id - Get record by ID
- POST /api/records - Create a new record
- PUT /api/records/:id - Update a record
- DELETE /api/records/:id - Delete a record

## Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with hot reload
- `npm run data:import` - Import sample data to database
- `npm run data:destroy` - Clear all data from database
