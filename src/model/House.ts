import { Schema, model } from "mongoose";

const HouseSchema = new Schema({
    images: { type: String, required: true },
    description: { type: String, required: true},
    price: { type: Number, required: true},
    location: { type: String, required: true},
    status: { type: Boolean, required: true},
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, {

    toJSON: {
        virtuals: true
    }

});


HouseSchema.virtual('images_url').get( function(){
    return `http://localhost:5000/files/${this.images}`;
})

export default model('House', HouseSchema);