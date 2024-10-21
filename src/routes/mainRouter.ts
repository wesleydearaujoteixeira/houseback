import { Router } from 'express';
import Controller from '../controllers/ControllerGlobal';

import multer from 'multer';
import config from '../images/config';

const upload = multer(config);

const mainRouter = Router();

mainRouter.post('/create', Controller.Register);
mainRouter.post('/login', Controller.Login);
mainRouter.get('/', Controller.Listar);
mainRouter.delete('/:id', Controller.DeleteEmail);

// cadastro de casas 
// OBS falta fazer a autenticação das rotas abaixo

mainRouter.post('/createHouser', upload.single('images'), Controller.CreateHouser);
mainRouter.get('/listarCasas', Controller.ListarCasas);
mainRouter.patch('/atualizar/:id', upload.single('images'), Controller.UpdateHouse)
mainRouter.delete('/delete/:id', Controller.DeleteHouse);
mainRouter.get('/casas/minhas', Controller.ListarOwnHouses);
mainRouter.post('/reservas/:house_id', Controller.FazerReservas);
mainRouter.get('/reservaslist', Controller.ListarReservas);
mainRouter.delete('/reservas/:reserve_id', Controller.CancelReserve);


export default mainRouter;
