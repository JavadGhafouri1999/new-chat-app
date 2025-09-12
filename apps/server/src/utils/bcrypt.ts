import bcrypt from "bcryptjs";

export const hashValue = async (value: string, saltRound?: number) => bcrypt.hash(value, saltRound || 10);

export const compareValues = async (value: string, hashedValue: string) =>
	bcrypt.compare(value, hashedValue).catch(() => false);
