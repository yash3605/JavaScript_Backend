import mongoose, { Schema } from 'mongoose';

const exerciseSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    date: {
        type: String,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, { timestamps: true });


export const Exercise = mongoose.model('Exercise', exerciseSchema);
