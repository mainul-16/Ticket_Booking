import express from "express";
import { getFavorites, getUserBookings, updateFavorite } from "../controllers/userController.js"; // removed space in path

const userRouter = express.Router(); // added '=' and fixed spacing

userRouter.get('/bookings', getUserBookings)
userRouter.post('/update-favorite', updateFavorite)
userRouter.get('/favorites', getFavorites)

export default userRouter;
