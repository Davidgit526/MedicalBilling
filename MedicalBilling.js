const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3007;

// Function to connect to MongoDB
/*async function connectToDatabase() {
  try {
    await mongoose.connect('mongodb://mongo/medicalBillingApp', { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit the process if there's an error in connecting to the database
  }
}
*/

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongo:27017/medicalBillingApp';
 
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB connected');
  // Once connected, you can start querying and displaying data from MongoDB
  Patient.find({})
    .then(patients => {
      console.log('Patient:', patients);
    })
    .catch(err => {
      console.error('Error fetching transactions:', err);
    });
})
.catch(err => {
  console.error('Error connecting to MongoDB:', err);
});
 
// MongoDB Schema
const patientSchema = new mongoose.Schema({
  fullName: String,
  dob: String,
  gender: String,
  address: String,
  phone: String,
  email: String,
  insuranceInfo: String,
  serviceName: String,
  cost: Number,
  numDays: Number,
  totalCost: Number
});
 
// Create the Patient model
const Patient = mongoose.model('Patient', patientSchema);

// Function to get patient details
async function getPatientDetails(formData) {
  // Implement your logic to extract patient details from formData
  // ...

  return formData;
}

// Schema definition for the Patient model
/*const patientSchema = new mongoose.Schema({
  fullName: String,
  dob: String,
  gender: String,
  address: String,
  phone: String,
  email: String,
  insuranceInfo: String,
  serviceName: String,
  cost: Number,
  numDays: Number,
  totalCost: Number
});

// Create the Patient model
const Patient = mongoose.model('Patient', patientSchema);*/

// Middleware to parse URL-encoded form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve HTML form
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Handle form submission
app.post('/submit', async (req, res) => {
  try {
    const patientDetails = await getPatientDetails(req.body);
    const newPatient = new Patient(patientDetails);
    await newPatient.save();
    res.send('Data saved successfully!');
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).send('Error saving data.');
  }
});

// Start the server
async function startServer() {
  //await connectToDatabase(); // Connect to MongoDB
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

startServer();

// Close the MongoDB connection when the application finishes
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('MongoDB disconnected through app termination');
    process.exit(0);
  });
});
