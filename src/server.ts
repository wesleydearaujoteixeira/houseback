import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import mainRouter from './routes/mainRouter';
import conectDB from './database/db';

const server = express();

dotenv.config();

server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(cors());
server.use(helmet());

server.use('/user', mainRouter);

conectDB();


server.listen(5000, () => {
    console.log(`Server is running on port ${process.env.URL}:${process.env.PORT}/ `);
});
