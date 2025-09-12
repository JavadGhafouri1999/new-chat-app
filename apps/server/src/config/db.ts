import mongoose from "mongoose";
import { MONGO_URI } from "../utils/env";

export default async function connectDB() {
	try {
		await mongoose.connect(MONGO_URI);
		console.log("Data base(Mongo) is connected");
	} catch (error) {
		console.log("Something went wrong wiht database:\n", error);
		process.exit(1);
	}
}
