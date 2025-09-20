import mongoose, { Types } from "mongoose";
import { compareValues, hashValue } from "../utils/bcrypt";

export interface UserDocument extends mongoose.Document {
	_id: Types.ObjectId;
	username: string;
	email: string;
	password: string;
	profileImage: string;
	verified: boolean;
	createdAt: Date;
	updatedAt: Date;
	comparePassword: (val: string) => Promise<Boolean>;
	omitPassword(): Pick<
		UserDocument,
		"_id" | "email" | "username" | "verified" | "profileImage" | "createdAt" | "updatedAt"
	>;
}

const userSchema = new mongoose.Schema<UserDocument>(
	{
		username: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			unique: true,
			required: true,
		},
		password: {
			type: String,

			required: true,
		},
		profileImage: { type: String, default: "" },
		verified: { type: Boolean, required: true, default: false },
	},
	{ timestamps: true }
);

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();
	this.password = await hashValue(this.password);

	next();
});

userSchema.methods.comparePassword = async function (val: string) {
	return compareValues(val, this.password);
};

userSchema.methods.omitPassword = function () {
	const user = this.toObject();
	delete user.password;
	return user;
};

const UserModel = mongoose.model<UserDocument>("User", userSchema);

export default UserModel;
