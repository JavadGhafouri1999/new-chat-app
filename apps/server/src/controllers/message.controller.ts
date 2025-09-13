import mongoose from "mongoose";
import AppErrorCode from "../constants/errorCode";
import { BAD_REQUEST, CREATED, NOT_FOUND, OK } from "../constants/httpStatusCode";
import MessageModel from "../models/message.model";
import UserModel from "../models/user.model";
import appAssert from "../utils/appAssert";
import catchErrors from "../utils/catchErrors";
import cloudinary from "../utils/cloudinary";

export const sendMessageHandler = catchErrors(async (req, res) => {
	const senderId = req.userId;
	const { id: receiverId } = req.params;
	const { text, image } = req.body;
	appAssert(receiverId, BAD_REQUEST, "User was not found");

	let imageUrl;
	if (image) {
		const uplaodResponse = await cloudinary.uploader.upload(image);
		imageUrl = uplaodResponse.secure_url;
	}
	appAssert(!text && !image, BAD_REQUEST, "Text or image is required");

	appAssert(
		senderId.toString() !== receiverId.toString(),
		BAD_REQUEST,
		"You can't send message to yourself"
	);

	const newMessage = await MessageModel.create({
		senderId,
		receiverId,
		text,
		image: imageUrl,
	});

	// TODO: SOCKET.IO

	return res.status(CREATED).json(newMessage);
});

export const getAllContactsHandler = catchErrors(async (req, res) => {
	const loggedInUserId = req.userId;
	const filteredUsers = await UserModel.find({ _id: { $ne: loggedInUserId } }).select("-password");

	return res.status(OK).json(filteredUsers);
});

export const getMessageByUSerIdHandler = catchErrors(async (req, res) => {
	const myId = req.userId;
	const { id: userToChat } = req.params;
	appAssert(userToChat, BAD_REQUEST, "There is no userID");

	const validId = mongoose.Types.ObjectId.isValid(userToChat);
	appAssert(validId, BAD_REQUEST, "userID is not valid");

	const otherUser = await UserModel.findById(userToChat);
	appAssert(otherUser, NOT_FOUND, "User was not found!", AppErrorCode.UserNotFound);

	const messages = await MessageModel.find({
		$or: [
			{ senderId: myId, receiverId: userToChat },
			{ senderId: userToChat, receiverId: myId },
		],
	});

	return res.status(OK).json(messages);
});

export const getChatParnerHandler = catchErrors(async (req, res) => {
	const myId = new mongoose.Types.ObjectId(req.userId);

	// ! This was not really optimized
	// const messages = await MessageModel.find({
	// 	$or: [{ receiverId: myId }, { senderId: myId }],
	// });

	// const partners = [
	// 	...new Set(
	// 		messages.map((msg) =>
	// 			msg.senderId.toString() === myId ? msg.receiverId.toString() : msg.senderId.toString()
	// 		)
	// 	),
	// ];

	// * User distinct in mongo then merge and deduplicate
	// const sendtTo = await MessageModel.distinct("receiverId", { senderId: myId });
	// const receivedFrom = await MessageModel.distinct("senderId", { receiverId: myId });

	// ** Best option is Aggregation Query
	const partners = await MessageModel.aggregate([
		// 1. Only messages where I'm sender or receiver
		{
			$match: {
				$or: [{ senderId: myId }, { receiverId: myId }],
			},
		},
		// 2. Create a new field "partnerId" = the other person's ID
		{
			$project: {
				partnerId: {
					$cond: [
						{ $eq: ["$senderId", myId] }, // if I'm sender
						"$receiverId", // partner is receiver
						"$senderId", // else partner is sender
					],
				},
			},
		},
		// 3. Group by partnerId to get unique partners
		{
			$group: { _id: "$partnerId" },
		},
		// 4. Join with the users collection to get full user data
		{
			$lookup: {
				from: "users", // collection name in MongoDB
				localField: "_id", // partnerId value
				foreignField: "_id", // _id in users collection
				as: "partner",
			},
		},
		// 5. Flatten the partner array (since lookup returns an array)
		{
			$unwind: "$partner",
		},
		// 6. Replace root so we just return the user object
		{
			$replaceRoot: { newRoot: "$partner" },
		},
	]);

	return res.status(OK).json(partners);
});
