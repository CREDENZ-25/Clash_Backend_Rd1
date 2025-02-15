import express from 'express';
import dotenv from 'dotenv';
import { syncDatabase} from './config/db.js'; 
import userRoutes from './routes/userRoutes.js'
// import loginRoutes from './routes/loginRoute.js'; 
// import startController from './controllers/startcontroller.js'
// import leaderBoardRoute from './routes/leaderBoardRoute.js'
// import authMiddleware from './middlewares/authMiddleware.js';
// import qscontroller from './controllers/qscontroller.js'
dotenv.config();
import cookieParser from 'cookie-parser';


const app = express();

// Middleware
app.use(cookieParser());
app.use(express.json({strict:false}));
app.use(express.urlencoded({ extended: true }));

app.use('/',userRoutes);


// app.use('/login', loginRoutes);
// app.use('/start',authMiddleware,startController);
// app.use('/next',authMiddleware,qscontroller);
// app.use('/leaderboard',authMiddleware,leaderBoardRoute);


app.get('/', (req, res) => {
  res.send('Server is up and running!');
});
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await syncDatabase();
});
