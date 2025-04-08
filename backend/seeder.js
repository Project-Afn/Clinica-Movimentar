
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/userModel');
const Patient = require('./models/patientModel');
const Record = require('./models/recordModel');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected for seeding'))
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });

// Sample data
const users = [
  {
    name: 'Admin User',
    email: 'admin@movimentar.com',
    password: '123456',
    role: 'admin'
  },
  {
    name: 'Dr. Maria Silva',
    email: 'maria@movimentar.com',
    password: '123456',
    role: 'physiotherapist'
  },
  {
    name: 'Dr. João Pereira',
    email: 'joao@movimentar.com',
    password: '123456',
    role: 'physiotherapist'
  }
];

const patients = [
  {
    name: 'Ana Santos',
    cpf: '123.456.789-00',
    birthDate: '1985-05-15',
    phone: '(11) 98765-4321',
    address: 'Rua das Flores, 123 - São Paulo, SP'
  },
  {
    name: 'Carlos Oliveira',
    cpf: '987.654.321-00',
    birthDate: '1978-11-22',
    phone: '(11) 91234-5678',
    address: 'Av. Paulista, 1000 - São Paulo, SP'
  },
  {
    name: 'Mariana Costa',
    cpf: '456.789.123-00',
    birthDate: '1990-07-30',
    phone: '(11) 95555-9999',
    address: 'Rua Augusta, 500 - São Paulo, SP'
  },
  {
    name: 'Roberto Almeida',
    cpf: '321.654.987-00',
    birthDate: '1965-03-12',
    phone: '(11) 92222-3333',
    address: 'Rua Oscar Freire, 200 - São Paulo, SP'
  }
];

// Import data into database
const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Patient.deleteMany();
    await Record.deleteMany();
    
    // Create users with hashed passwords
    const hashedUsers = await Promise.all(users.map(async (user) => {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      return user;
    }));
    
    const createdUsers = await User.insertMany(hashedUsers);
    console.log('Users imported!');
    
    // Create patients
    const createdPatients = await Patient.insertMany(patients);
    console.log('Patients imported!');
    
    // Create some sample records
    const records = [
      {
        patientId: createdPatients[0]._id,
        description: 'Avaliação inicial - Dor lombar',
        observations: 'Paciente relata dor lombar há 2 semanas. Recomendado exercícios de fortalecimento e alongamento.',
        therapistId: createdUsers[1]._id,
        therapistName: createdUsers[1].name
      },
      {
        patientId: createdPatients[0]._id,
        description: 'Sessão de fisioterapia - Tratamento lombar',
        observations: 'Paciente apresentou melhora significativa após exercícios. Continuar com o tratamento atual.',
        therapistId: createdUsers[1]._id,
        therapistName: createdUsers[1].name
      },
      {
        patientId: createdPatients[1]._id,
        description: 'Avaliação inicial - Recuperação pós-cirúrgica joelho',
        observations: 'Paciente em recuperação de artroscopia no joelho direito. Iniciado protocolo de reabilitação.',
        therapistId: createdUsers[2]._id,
        therapistName: createdUsers[2].name
      },
      {
        patientId: createdPatients[2]._id,
        description: 'Avaliação inicial - Tendinite',
        observations: 'Paciente com tendinite no ombro direito. Iniciado tratamento com ultrassom e exercícios.',
        therapistId: createdUsers[1]._id,
        therapistName: createdUsers[1].name
      }
    ];
    
    const createdRecords = await Record.insertMany(records);
    console.log('Records imported!');
    
    console.log('Data import complete!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Delete all data from database
const destroyData = async () => {
  try {
    await User.deleteMany();
    await Patient.deleteMany();
    await Record.deleteMany();
    
    console.log('Data destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Run script based on command line argument
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
