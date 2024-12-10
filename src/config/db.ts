import { MongoClient } from "mongodb";
import type {Db} from "mongodb";

const mongoUri = "mongodb+srv://talha:talha123@nowted-cluster.rftue.mongodb.net/";
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