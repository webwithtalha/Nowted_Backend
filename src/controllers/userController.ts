import type { Request, Response, NextFunction } from 'express';
import type {ObjectId} from 'mongodb';
import {connectDB} from '../config/db.js';
import {UserModel} from '../models/userModels.js';

export interface IUser{
    _id?: ObjectId;
    username: string;
    email: string;
    password: string;
}


export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const db = await connectDB();
        const userData = req.body as Omit<IUser, '_id'>;
        const user = await UserModel.createUser(db, userData);
        res.status(201).json({success:true , data:user});
    }catch(err){
        next(err);
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