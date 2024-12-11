import { loadEnv } from './load-env.js';
loadEnv();

import { MongoClient } from "mongodb";
import type {Db} from "mongodb";

const mongoUri: string = process.env.MONGO_URI || "mongodb://localhost:27017";
const client = new MongoClient(mongoUri);

let db: Db;

export const connectDB = async (): Promise<Db> => {
    if(!db){
        try{
            await client.connect();
            console.log("Connected to MongoDB");
            db = client.db("Nowted-cluster");
        }catch (err){
            console.error("Error connecting to MongoDB", err);
            process.exit(1);
        }
    }
    return db;
};   