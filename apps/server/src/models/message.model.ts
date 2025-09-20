import mongoose from "mongoose";

export interface MessageDocument extends mongoose.Document {
	senderId: mongoose.Types.ObjectId;
	receiverId: mongoose.Types.ObjectId;
	text: string;
	image: string;
	createdAt: Date;
}

const messageSchema = new mongoose.Schema<MessageDocument>(
	{
		senderId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			requird: true,
		},
		receiverId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			requird: true,
		},
		text: {
			type: String,
		},
		image: {
			type: String,
		},
	},
	{ timestamps: true }
);

messageSchema.index({ senderId: 1, receiverId: 1, createdAt: -1 });

const MessageModel = mongoose.model("Message", messageSchema);

export default MessageModel;
