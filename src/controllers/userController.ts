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

        console.log("Login attempt:", { email, password });

        const user = await UserModel.getUserByEmail(db, email) as IUser | null;
        if (!user) {
            console.log("User not found:", email);
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }

        console.log("User found:", user);
        console.log("Raw password from req.body:", password);
        console.log("Trimmed password:", password.trim());
        console.log("Hashed password in DB:", user.password);

        const passwordMatch = await bcrypt.compare(password, user.password);
        console.log("Password match result:", passwordMatch);

        if (!passwordMatch) {
            console.log("Invalid credentials for user:", email);
            return res
                .status(401)
                .json({ success: false, message: "Invalid credentials" });
        }

        console.log("Password match for user:", email);

        const tokenPayload = { id: user._id, email: user.email };
        const token: string = jwt.sign(tokenPayload, secretKey, { expiresIn: "1h" });

        res.status(200).json({ success: true, token });
    } catch (err) {
        console.error("Error during login:", err);
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

        if (!username || !email || !password) {
            res.status(400).json({ success: false, message: 'Missing required fields' });
            return;
        }

        console.log("Raw password:", password);

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Hashed password:", hashedPassword);

        const userData: Omit<IUser, '_id'> = {
            username,
            email,
            password: hashedPassword,
        };

        const user = await UserModel.createUser(db, userData);
        console.log("User created with hashed password:", user);

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