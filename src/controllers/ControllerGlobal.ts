
import { Request, Response } from "express";
import User from "../model/User";
import House from "../model/House";

export default class Controller {

    static async Teste (req: Request, res: Response): Promise<any> { 

        return res.status(200).json({ message: 'Teste de API' });

    }

    static async Register (req: Request, res: Response): Promise<any> {
        
        try {

            const { email } = req.body;


            let user = await User.findOne({ email });

            if(!user) {
                user  = await User.create({ email });
            }



    
            return res.status(201).json({ message: 'Usuário criado', user});


        } catch (error) {
            return res.status(500).json({ message:"error", error})
        }
     
    }


    static async Login (req: Request, res: Response): Promise<any> {

        try {

            const { email } = req.body;
            const user = await User.findOne({email});


            return res.status(200).json({ message: 'Usuário cadastrado', info: user});


        } catch (error) {
            return res.status(400).json({ message:"error", error})
        }
    
    }


    static async Listar (req: Request, res: Response): Promise<any> {

        const alluser = await User.find();
        return res.status(200).json({ message: 'Listando todos os usuários', users: alluser});


    }

    static async DeleteEmail (req: Request, res: Response): Promise<any> {

        const { id } = req.params;

        const user = await User.findOneAndDelete({_id: String(id) });
        return res.status(200).json({ message: 'Usuário excluído', user});

    }


    static async CreateHouser (req: Request, res: Response): Promise<any> {
        
       let fileimage = req.file?.filename;

       const {description, price, location, status } = req.body;
       const { user_id } = req.headers;

       try {

        const house = await House.create({
            user: user_id as string,
            images: fileimage,
            description: description as string,
            price: price as number,
            location: location as string,
            status: status as boolean,

        })

            return res.json({message: "casa cadastrada com sucesso hein", house});
       } catch (error) {
            return res.status(400).json({ message: 'Houve um erro inesperado aí', error});
       }
        
    }
    
    static async ListarCasas (req: Request, res: Response): Promise<any> {
        
      try {
        const allhouses = await House.find();
            return res.status(200).json({ message: 'Listando todas as casas', houses: allhouses});
      
        } catch (error) {
        return res.status(400).json({ message: 'Houve um erro inesperado na listagem das casas', error});

      }

    }

    static async UpdateHouse (req: Request, res: Response): Promise<any> {
        
        const { id } = req.params;

        let fileimage = req.file?.filename;

       const {description, price, location, status } = req.body;
       const { user_id } = req.headers;


       try {

        const user = await User.findById(user_id);
        const home = await House.findById(id);

        if(user) {

            if(String(user._id) !== String(home?.user)) {
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

            return res.json({message: "casa atualizada com sucesso", house});

       } catch (error) {
            return res.status(400).json({ message: 'Houve um erro inesperado aí', error});
       }
        
    }
   
    
    static async DeleteHouse (req: Request, res: Response): Promise<any> {
        
        const { id } = req.params;
        const { user_id } = req.headers;

        const user = await User.findById(user_id);
        const home = await House.findById(id);
    
        try {
                
              if(String(user?._id) !== String(home?.user)) {
                return res.status(401).json({ message:"Não pode excluir uma casa que n te pertence"});
            }
        

            const house = await House.findByIdAndDelete(id);

            return res.status(200).json({message: "casa excluída com sucesso"});



        } catch (error) {
            return res.status(400).json({ message: 'Houve um erro inesperado aí', error});
            
        }
    
    
    
    }


}

