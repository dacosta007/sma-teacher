import { db } from "$db/mongo";

export const teachers = db.collection('teachers')