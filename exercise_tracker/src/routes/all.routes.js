import { Router } from "express";
import { saveUser, getUsers, createExercise, exerciseLogs } from "../controllers/all.controller.js";


const router = Router();

router.route("/users").post(saveUser)
router.route("/users").get(getUsers)
router.route("/users/:id/exercise").post(createExercise)
router.route("/users/:id/logs").get(exerciseLogs)


export default router;
