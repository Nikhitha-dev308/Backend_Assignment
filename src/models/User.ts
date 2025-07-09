import mongoose, { Schema } from "mongoose";

const AltibbeHealthUsers: any = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    profession: { type: String, required: true },
    status: { type: String, required: true },
},
    { timestamps: true }

);

export default mongoose.model('AltibbeHealthUsers', AltibbeHealthUsers);