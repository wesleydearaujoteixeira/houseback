import { Schema, model } from "mongoose";

const HouseSchema = new Schema({
    images: { type: String, required: true },
    description: { type: String, required: true},
    price: { type: Number, required: true},
    location: { type: String, required: true},
    status: { type: Boolean, required: true},
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
});

export default model('House', HouseSchema);