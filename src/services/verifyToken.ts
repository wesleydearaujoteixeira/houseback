import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../model/User";
import { ExtendRequest } from "../types/RequestType";

const dotenv = require('dotenv');
dotenv.config();

export default class VerificationService {

    static async getVerification(req: ExtendRequest, res: Response, next: NextFunction): Promise<any> {
        
        const authHeaders = req.headers['authorization'];

        if (!authHeaders) {
            return res.status(401).json({ error: 'Acesso negado, problemas com o token' });
        }

        const token = authHeaders.split(' ')[1];

        jwt.verify(
            token,
            process.env.SECRET_KEY as string,

            async (err, decoded: any) => {
                if (err) {
                    return res.status(403).json({ error: 'Token inválido' + err.message });
                }
                const user = await User.findOne({username: decoded.username});

                if(!user) {
                    return res.status(404).json({ error: 'Usuário não encontrado' });
                }

                req.username = user.username;

                next();
                
            }
        )


    }


}