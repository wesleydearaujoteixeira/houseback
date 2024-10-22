import jwt from "jsonwebtoken";
const dotenv = require('dotenv');
dotenv.config();

export const createToken = (username: string) => jwt.sign({username}, process.env.SECRET_KEY as string);