import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mongoose from 'mongoose'; 
import dotenv from 'dotenv';
import authRoute from "./Routes/auth.js"
import userRoute from "./Routes/user.js"
import doctorRoute from "./Routes/doctor.js"
import reviewRoute from './Routes/review.js'



dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
  origin: true,
};

app.get('/', (req, res) => {
  res.send('API is working');
});

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true, // Corrected property name
      useUnifiedTopology: true,
    });
    console.log('MongoDB is connected');
  } catch (error) {
    console.error('MongoDB connection failed', error);
  }
};

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use('/api/v1/auth',authRoute) ;
app.use('/api/v1/users',userRoute);
app.use('/api/v1/doctors',doctorRoute);
app.use('/api/v1/reviews',reviewRoute)

app.listen(port, () => {
  connectDB();
  console.log('Server is running on port ' + port);
});