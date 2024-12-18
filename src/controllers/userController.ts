import type { Request, Response, NextFunction } from 'express';
import type {ObjectId} from 'mongodb';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import {connectDB} from '../config/db.js';
import {UserModel} from '../models/userModels.js';

export interface IUser {
  _id?: ObjectId;
  username: string;
  email: string;
  password: string;
}

interface CreateUserRequest extends Request {
  body: Pick<IUser, 'username' | 'email' | 'password'>;
}

const secretKey = process.env.JWT_SECRET;
if (!secretKey) {
    throw new Error("JWT_SECRET_KEY is not defined");
}

export const loginUser = async (
    req: CreateUserRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const db = await connectDB();
        const { email, password } = req.body;

        const user = await UserModel.getUserByEmail(db, email) as IUser;
        await bcrypt.compare(password, user.password);

        const tokenPayload = { id: user._id, email: user.email };
        const token: string = jwt.sign(tokenPayload, secretKey, { expiresIn: "1h" });
        res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=3600;`);

        return res.status(200).json({ success: true });
    } catch (err) {
        console.error("Error during login:", err);
        next(err);
    }
};

export const logoutUser = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            path: "/",
        });

        return res
            .status(200)
            .header("Content-Type", "application/json")
            .json({ success: true, message: "Logged out successfully" });
    } catch (err) {
        console.error("Error during logout:", err);
        next(err);
    }
};


export const createUser = async (
    req: CreateUserRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const db = await connectDB();
        const { username, email, password } = req.body;

        const existingUser = await UserModel.getUserByEmailOrUsername(db, email, username);
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const userData: Omit<IUser, '_id'> = {
            username,
            email,
            password: hashedPassword,
        };

        const user = await UserModel.createUser(db, userData);

        res.status(201).json({ success: true, data: user });
    } catch (err) {
        next(err instanceof Error ? err : new Error('Unknown error occurred'));
    }
};



export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const db = await connectDB();
        const users = await UserModel.getUsers(db);
        res.status(200).json({success:true , data:users});
    }catch(err){
        next(err);
    }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const db = await connectDB();
        const user = await UserModel.getUserById(db, req.params.id!);
        if(!user) return res.status(404).json({success:false, message:"User not found"});
        res.status(200).json({success:true , data:user});
    }catch(err){
        next(err);
    }
};

export const getUserByEmail = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const db = await connectDB();
        const user = await UserModel.getUserByEmail(db, req.params.email!);
        if(!user) return res.status(404).json({success:false, message:"User not found"});
        res.status(200).json({success:true , data:user});
    }catch(err){
        next(err);
    }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const db = await connectDB();
        const user = await UserModel.updateUser(db, req.params.id!, req.body as Partial<IUser>);
        if(!user) return res.status(404).json({success:false, message:"User not found"});
        res.status(200).json({success:true , data:user});
    }catch(err){
        next(err);
    }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const db = await connectDB();
        const result = await UserModel.deleteUser(db, req.params.id!);
        if(!result.deletedCount) return res.status(404).json({success:false, message:"User not found"});
        res.status(200).json({success:true , data:{}});
    }catch(err){
        next(err);
    }
};