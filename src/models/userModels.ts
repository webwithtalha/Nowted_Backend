import {ObjectId} from 'mongodb';
import type {Db} from 'mongodb';

export interface IUser{
    _id?: ObjectId;
    username: string;
    email: string;
    password: string;
}

export const UserModel = {
    async createUser(db:Db, user: Omit<IUser, '_id'>){
        const result = await db.collection('users').insertOne(user);
        const insertedUser = await db.collection('users').findOne({_id: result.insertedId});
        return insertedUser;
    },

    async getUsers(db:Db){
        return db.collection('users').find().toArray();
    },

    async getUserById(db:Db, id:string){
        return db.collection('users').findOne({_id: new ObjectId(id)});
    },

    async getUserByEmail(db:Db, email:string){
        return db.collection('users').findOne
        ({email});
    },

    async updateUser(db:Db, id:string, update:Partial<IUser>){
        return db.collection('users').findOneAndUpdate(
            {_id: new ObjectId(id)},
            {$set: update},
            {returnDocument: 'after'}
        );
    },

    async deleteUser(db:Db, id:string){
        return db.collection('users').deleteOne({_id: new ObjectId(id)});
    },


};