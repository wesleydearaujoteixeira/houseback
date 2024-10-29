import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import mainRouter from './routes/mainRouter';
import conectDB from './database/db';
import path from 'path';

const server = express();

dotenv.config();

server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(helmet());

server.use(cors({ credentials: true, origin: "https://useback-api.onrender.com" }));
  

server.use(
    '/files', 
    express.static(path.resolve(__dirname, '..', 'uploads'))
);

server.use('/user', mainRouter);

conectDB();


server.listen(5000, () => {
    console.log(`Server is running on port ${process.env.URL}:${process.env.PORT}/ `);
});

