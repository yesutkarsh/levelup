import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { MongoClient } from "mongodb";


export async function POST() {
    try {
        const headersList = await headers();
        const emailHeader = await headersList.get("email");
        if (!emailHeader) {
            return NextResponse.json({ 
                message: "Email header is missing!" 
            }, { status: 400 });
        }


        const uri = process.env.MONGODB_URI;
        const client = new MongoClient(uri);
        
        try {
            await client.connect();
            console.log("Connected to MongoDB");
    
            const database = client.db("LEVEL_UP");
            const collection = database.collection("all_users");
            const result = await collection.findOne({ email: emailHeader });
            return NextResponse.json(result);
    
        } catch (dbError) {
            console.error("Database error:", dbError);
            return NextResponse.json({ 
                message: "Database operation failed!",
                error: dbError.message
            }, { status: 500 });
        } finally {
            await client.close();
            console.log("MongoDB connection closed");
        }
    }catch (error) {
        return error;
    }
}