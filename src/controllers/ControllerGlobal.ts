
import { Request, Response } from "express";
import User from "../model/User";
import House from "../model/House";
import Reserve from "../model/Reserve";
import { createToken } from "../services/create-toke";

import bcrypt from "bcrypt";
import { ExtendRequest } from "../types/RequestType";
import Profile from "../model/Profile";



export default class Controller {

    static async Teste (req: ExtendRequest, res: Response): Promise<any> {
            res.json({
            message: "Ok, autenticado"
        })
    } 



    static async Register (req: ExtendRequest, res: Response): Promise<any> {
        
        try {

            const { email, username, password } = req.body;


            if(!email || !username || !password) {
                return res.status(400).json({ message: 'Preencha todos os campos' });
            }


            let user = await User.findOne({ email });


            if(!user) {
                user  = await User.create({ username, email, password });
            }

            const token = createToken(username);

            return res.status(201).json({ message: 'Usuário criado', user, token});


        } catch (error) {
            return res.status(500).json({ message: "erro no register: ", error})
        }
     
    }


    static async Login (req: Request, res: Response): Promise<any> {

        try {

            const { email, password } = req.body;


            const user = await User.findOne({email}).select('+password');
            

            if(!user) {
                return res.status(401).json({ message: 'Usuário não encontrado' });
            }


            if(typeof user?.password !== "string") {
                return res.status(500).json({ message: "Senha incompátivel" })
            }
            
            
           
            const passwordValid = await bcrypt.compare(password, user.password);

            if(!passwordValid) {
                return res.status(401).json({ message: 'Senha inválida' });
            }

            const token = createToken(user.username);

            return res.status(200).json({ message: 'Usuário logado', info: user, token});


        } catch (error) {
            return res.status(400).json({ message:" erro na senha aí ", error})
        }
    
    }


    static async Listar (req: ExtendRequest, res: Response): Promise<any> {

        const alluser = await User.find();
        return res.status(200).json({ message: 'Listando todos os usuários', users: alluser});

    }

    static async DeleteEmail (req: ExtendRequest, res: Response): Promise<any> {

        const { id } = req.params;

        const user = await User.findOneAndDelete({_id: String(id) });
        return res.status(200).json({ message: 'Usuário excluído', user});

    }


    static async CreateHouser (req: ExtendRequest, res: Response): Promise<any> {
        
       let fileimage = req.file?.filename;

       const {description, price, location, status } = req.body;
       const { id } = req.params;


       if(!fileimage) {
            return res.status(401).json({ message: 'Imagem é obrigatório'});
       }

       if(!price){
        return res.status(401).json({ message: 'price is required'})
       }

       if(!description) {
        return res.status(401).json({ message: 'Descrição é obrigatório'});
       }

       if(!location) {
        return res.status(401).json({ message: 'Local é obrigatório'});
       }
       
       if(!status) {
        return res.status(401).json({ message: 'Status é obrigatório'});
       }
       
       const user = await User.findOne({_id: id});


       if(!user) {
        return res.status(404).json({
            message: 'Usuário não encontrado'
        });

       }
       
       console.log(user._id);



       try {

        const house = await House.create({
            owner: id as string,
            images: fileimage,
            description: description as string,
            price: price as number,
            location: location as string,
            status: status as boolean,

        })

            return res.json({message: "casa cadastrada com sucesso hein", house});
       } catch (error) {
            return res.status(400).json({ message: 'Houve um erro inesperado aí', error});
       }finally {
        console.log(user);

       }
        
    }
    
    static async ListarCasas (req: ExtendRequest, res: Response): Promise<any> {
        
      try {
        const allhouses = await House.find();
            return res.status(200).json({ message: 'Listando todas as casas', houses: allhouses});
      
        } catch (error) {
        return res.status(400).json({ message: 'Houve um erro inesperado na listagem das casas', error});

      }

    }

    static async UpdateHouse (req: ExtendRequest, res: Response): Promise<any> {
        
        const { id } = req.params;

        let fileimage = req.file?.filename;

       const {description, price, location, status } = req.body;
       const { user_id } = req.headers;


       try {

        const user = await User.findById(user_id);
        const home = await House.findById(id);

        if(user) {

            if(String(user._id) !== String(home?.owner)) {
                return res.status(401).json({ message:"Não pode editar uma casa que não é sua"});
            }
        }


        const house = await House.updateOne({_id: id}, {
            user: user_id as string,
            images: fileimage,
            description: description as string,
            price: price as number,
            location: location as string,
            status: status as boolean,
        })

            return res.json(
                {message: "casa atualizada com sucesso", 
                house,
            
            });

       } catch (error) {
            return res.status(400).json({ message: 'Houve um erro inesperado aí', error});
       }
        
    }
   
    
    static async DeleteHouse (req: Request, res: Response): Promise<any> {
    

        const { id_house, user_id } = req.params;


        const user = await User.findById(user_id);
        const home = await House.findById(id_house);


        console.log(user?._id);
        console.log(home?._id);

        if (!user_id || !id_house) {
            return res.status(400).json({ message: "Parâmetros user_id e id_house são obrigatórios" });
        }
    
        try {
                
              if(String(user?._id) !== String(home?.owner)) {
                return res.status(401).json({ message:"Não pode excluir uma casa que n te pertence"});
            }
        

            const house = await House.findByIdAndDelete(id_house);

            return res.status(200).json({message: "casa excluída com sucesso"});



        } catch (error) {
            return res.status(400).json({ message: 'Houve um erro inesperado aí', error});
            
        }
    
    
    
    }

  

    static async FazerReservas (req: Request, res: Response): Promise<any> {
        
        const { house_id } = req.params;  
        const { user_id } = req.headers;

        const horaBrasilia = new Date().toLocaleString("pt-BR", {
            timeZone: "America/Sao_Paulo",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false, // Formato 24 horas
          });



        try {

          const user = await User.findById(user_id);
          const house = await House.findById(house_id);


          if(String(user?._id) === String(house?.owner)) {
                return res.status(401).json({ message:"Não é possível fazer reservas para casas que você é dono"});
            
             }

            if(!house) {
                return res.status(404).json({ message:"Casa não encontrada"});
            }


            if(house.status !== true) {
                return res.status(400).json({ message:"Casa não está disponível para reservas"});
            }

            const reserva = await Reserve.create({
                user: user_id as string,
                house: house_id as string,
                date: new Date(),
                hour: horaBrasilia,
            });

            const appointment = await (await reserva.populate('house')).populate('user')

            res.status(201).json({
                message: "Reserva realizada com sucesso",
                appointment
            })


        } catch (error) {
             return res.status(400).json({ message: 'Houve um erro inesperado aí', error});
        }
    
    }

    static async ListarReservas (req: Request, res: Response): Promise<any> {

        try {

            const { id } = req.params;
            const houses = await Reserve.find({user: id}).populate('house');

            return res.status(200).json({
                message: "Listando reservas do usuário",
                houses,
            });     
            
        } catch (error) {
            return res.status(400).json({ message: 'Houve um erro', error });
        }



    }

    static async CancelReserve (req: Request, res: Response): Promise<any> {
        
    
        try {
            
            const { reserve_id } = req.params;
            const { user_id } = req.headers;


            if(user_id === undefined || user_id === "") {
                return res.status(401).json({ message: "Token não fornecido"});
            }


            const cancelReserve = await Reserve.findByIdAndDelete({_id: reserve_id});

            if(!cancelReserve) {
                return res.status(404).json({ message: "Reserva não encontrada"});
            }


            return res.status(200).json({
                message: "Reserva cancelada com sucesso",
                cancelReserve,
            })

        } catch (error) {
            return res.status(400).json({ message: 'Houve um erro', error });
            
        }




    }

    static async ProfileUser (req: Request, res: Response): Promise<any> {
        
        let fileimage = req.file?.filename;

       const { description, telefone } = req.body;
       const { user_id } = req.headers;

       try {

        const perfil = await Profile.create({
            owner: user_id as string,
            images: fileimage,
            description: description as string,
            telefone: telefone as string

        })

            return res.json({message: "Perfil cadastrado com sucesso", perfil});
       } catch (error) {
            return res.status(400).json({ message: 'Houve um erro inesperado aí', error});
       }
        

    }


    static async MyHomes (req: Request, res: Response): Promise<any> {

       try {
        
        const  { id } = req.params;

        const casas = await House.find({ owner: String(id) });

        if(!casas) {
            return res.status(404).json({ message: "Casas não encontradas"});
        }
        
        return res.status(200).json({ message: "Listando casas do usuário", casas});

       } catch (error) {

        return res.status(500).json({ message:'Error in casas do usuário', error})
        
       }
    }

 


}
