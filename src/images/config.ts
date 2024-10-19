import multer from 'multer';
import path from 'path';

export default {
    storage: multer.diskStorage({
        destination: path.join(__dirname, '..', '..', 'uploads'),
        filename: (req, file, cb) => {

            const ext = path.extname(file.originalname);
            const name = path.basename(file.originalname, ext);


            cb(null,`${name}-${Date.now()}-${ext}`);

        }

    })
}