import mongoose from "mongoose";
import { MONGO_URI } from "../utils/env";

export default async function connectDB() {
	try {
		await mongoose.connect(MONGO_URI);
		console.log("✅ Database (Mongo) is connected");
	} catch (error) {
		console.log("❌ Something went wrong in database:\n", error);
		process.exit(1);
	}
}
