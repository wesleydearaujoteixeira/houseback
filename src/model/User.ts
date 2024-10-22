import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";



const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    password: { type: String, required: true, select: false}
});

UserSchema.pre("save", async function (next) {
    // Hnpm ash the password before saving it to the database
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

export default model('User', UserSchema);