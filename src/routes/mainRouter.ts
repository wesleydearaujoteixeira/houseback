import { Router } from 'express';
import Controller from '../controllers/ControllerGlobal';
import VerificationService from '../services/verifyToken';


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



mainRouter.get('/testes', VerificationService.getVerification, Controller.Teste);

mainRouter.post('/createHouser/:id', VerificationService.getVerification, upload.single('images'), Controller.CreateHouser);
mainRouter.get('/listarCasas', Controller.ListarCasas);


mainRouter.patch('/atualizar/:id', VerificationService.getVerification, upload.single('images'), Controller.UpdateHouse);
mainRouter.delete('/delete/:id', VerificationService.getVerification, Controller.DeleteHouse);
mainRouter.get('/casas/minhas/:id', VerificationService.getVerification, Controller.ListarOwnHouses);
mainRouter.post('/reservas/:house_id', VerificationService.getVerification, Controller.FazerReservas);
mainRouter.get('/reservaslist/:id', VerificationService.getVerification ,Controller.ListarReservas);
mainRouter.delete('/reservas/:reserve_id', VerificationService.getVerification, Controller.CancelReserve);

// rota para montagem do perfil do usuário em breve;

mainRouter.patch('/editarPerfil', VerificationService.getVerification, upload.single('images'), Controller.ProfileUser);



export default mainRouter;
