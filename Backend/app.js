// app.js
import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './src/routes/user.routes.js';
import connectToDB from './src/db/db.js';

dotenv.config();
const app = express();
connectToDB();



app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  console.log('Request Received');
  res.send('Hello world');
});
app.use('/users', userRoutes);






export default app;
