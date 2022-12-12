import { db } from "$db/mongo";

export const subjects = db.collection('subjects')