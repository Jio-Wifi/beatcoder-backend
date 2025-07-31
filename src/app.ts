import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { urlencoded } from 'express';
import errorHandler from './middleware/error.middleware';
import routes from './routes';
import config from './config';

const app = express();


app.get("/",(_req,res) => {
  res.status(200).send("BeatCoder Landing Page")
})

//Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: config.FRONTEND_URL, // frontend URL
  credentials: true,
}));
// routes
app.use('/api/v1', routes);

// Use Global Error handler
app.use(errorHandler);

export default app;
