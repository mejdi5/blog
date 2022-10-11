import express from 'express'
import cors from 'cors'
import { db } from './database.js';
import userRoutes from './routes/users.js'
import postRoutes from './routes/posts.js'
import morgan from 'morgan'
import dotenv from 'dotenv'


const app = express();
app.use(express.json());
app.use(cors())
app.use(morgan("dev"));
dotenv.config()

db.connect((err) => {
  if (err) {
    console.log("database not connected", err)
  } else {
    console.log("database Connected!")
  }
});

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);


const port = 5000 

app.listen(port, () => {
  console.log("server running..");
});