import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB || '', {
      // Caso precise adicionar outras opções, como autenticação, faça aqui.
    });
    console.log('Conectado ao MongoDB!');
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error);
    process.exit(1); // Encerra o processo com status de erro.
  }
};

export default connectDB;
