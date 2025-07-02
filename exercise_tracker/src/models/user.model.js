import mongoose, { Schema } from 'mongoose';

import dotenv from 'dotenv';

dotenv.config({
    path: './.env'
});

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    exercise: [{
        type: Schema.Types.ObjectId,
        ref: 'Exercise',
    }]
});

export const User = mongoose.model('User', UserSchema)
