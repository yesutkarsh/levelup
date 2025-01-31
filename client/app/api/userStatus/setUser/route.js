import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { MongoClient } from "mongodb";

export async function POST() {
    try {
        const headersList = headers();
        const emailHeader = headersList.get("email");
        
        if (!emailHeader) {
            return NextResponse.json({ 
                message: "Email header is missing!" 
            }, { status: 400 });
        }

        // Create a proper document object with the email
        const documentToInsert = {
            email: emailHeader,
            createdAt: new Date(),
            approved: false,
            status: "pending",
            category:"user",
        };
        
        const uri = process.env.MONGODB_URI;
        const client = new MongoClient(uri);
        
        try {
            await client.connect();
            console.log("Connected to MongoDB");

            const database = client.db("LEVEL_UP");
            const collection = database.collection("all_users");

            const result = await collection.insertOne(documentToInsert);
            console.log("Insert result:", result);

            return NextResponse.json({ 
                message: "Data saved successfully!",
                data: documentToInsert,
                insertedId: result.insertedId
            });

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

    } catch (error) {
        console.error("General error:", error);
        return NextResponse.json({ 
            message: "Something went wrong!",
            error: error.message
        }, { status: 500 });
    }
}