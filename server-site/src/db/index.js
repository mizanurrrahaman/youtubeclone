import  mongoose from "mongoose";

import dotenv from 'dotenv';

dotenv.config();

//const MONGODB_URL = "mongodb+srv://muradchowdhury0077:murad@todoapp.rbetano.mongodb.net/youtubeclon?retryWrites=true&w=majority&appName=todoApp";



const connectDB = async () => {

    try {
        await mongoose.connect(process.env.MONGODB_URL, {
          useNewUrlParser: true, // If using Mongoose version < 4.0.0
          useUnifiedTopology: true, // If using Mongoose version < 4.0.0
        });
        console.log('MongoDB connected');
      } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1);
      }
    };



export default connectDB;

