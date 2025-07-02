import { ApiResponse } from '../utils/ApiResponse.js'
import mongoose from 'mongoose'
import { ApiError } from '../utils/ApiError.js'
import { User } from '../models/user.model.js'
import { Exercise } from '../models/exercise.model.js'
import { asyncHandler } from '../utils/asyncHandler.js'


const saveUser = asyncHandler(async (req, res) => {
    const username = req.body.username;

    if (!username) {
        throw new ApiError(409, "username cannot be empty");
    }

    const existedUser = await User.findOne({ username });

    if (existedUser) {
        throw new ApiError(402, "username already exists");
    }

    const user = await User.create({
        username: username.toLowerCase()
    });

    const CreatedUser = await User.findById(user._id);

    if (!CreatedUser) {
        throw new ApiError(409, "Failed to create user");
    }

    return res.status(201).json(
        new ApiResponse(200, "User created successfully", CreatedUser)
    )
})

const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}, 'username _id').lean();

    if (!users) {
        throw new ApiError(410, "Failed to get users");
    }


    return res.status(201).json(
        new ApiResponse(200, "All Users fetched", users)
    )
})


const createExercise = asyncHandler(async (req, res) => {
    const { description, duration, date } = req.body;
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, "Invalid User ID");
    }

    const checkUser = await User.findById(userId);
    if (!checkUser) {
        throw new ApiError(410, "You're not a registered user");
    }

    if (!(description && duration)) {
        throw new ApiError(401, "Description and duration are required");
    }

    const finalDate = date ? new Date(date).toDateString() : new Date().toDateString();

    const exercise = await Exercise.create({
        user: checkUser._id,
        description,
        duration,
        date: finalDate,
    });

    checkUser.exercise.push(exercise);
    await checkUser.save();

    return res.status(201).json(
        new ApiResponse(201, "Exercise created successfully", {
            exercise,
            user: checkUser._id,
        })
    );
});

const exerciseLogs = asyncHandler(async (req, res) => {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, "Invalid User ID");
    }

    const userWithExercises = await User.findById(userId)
        .populate('exercise') // this pulls exercise docs
        .lean(); // makes result a plain JS object

    if (!userWithExercises) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(
        new ApiResponse(200, "Exercise logs fetched successfully", userWithExercises)
    );
});



export {
    createExercise,
    saveUser,
    getUsers,
    exerciseLogs
}
