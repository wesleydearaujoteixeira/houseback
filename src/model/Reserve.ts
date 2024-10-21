import { Schema, model } from "mongoose";

const ReservaSchema = new Schema({

    date: {
        type: Date,
        required: true,
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    house: {
        type: Schema.Types.ObjectId,
        ref: 'House',
        required: true,
    }
});

export default model('Reserve', ReservaSchema);