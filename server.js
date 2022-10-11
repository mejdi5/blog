import express from 'express'
import cors from 'cors'
import { db } from './database.js';
import userRoutes from './routes/users.js'
import postRoutes from './routes/posts.js'
import morgan from 'morgan'


const app = express();
app.use(express.json());
app.use(cors())
app.use(morgan("dev"));

db.connect((err) => {
  if (err) {
    console.log("database not connected", err)
  } else {
    console.log("database Connected!")
  }
});

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log("server running..");
});