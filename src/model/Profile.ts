import { Schema, model } from "mongoose";

const ProfileSchema = new Schema({
    images: { type: String, required: true },
    description: { type: String, required: true},
    telefone: { type: String, required: true},
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
},

{

    toJSON: {
        virtuals: true
    }

}

);


ProfileSchema.virtual('images_url').get( function(){
    return `https://houseback-api.onrender.com/files/${this.images}`;
})

export default model('Profile', ProfileSchema);