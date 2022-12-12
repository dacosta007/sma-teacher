import { MONGO_URI } from "$env/static/private"
// import { MONGO_URI_DEV } from "$env/static/private"
import { MongoClient } from "mongodb";


let client = new MongoClient(MONGO_URI)

// connect to db
export function startDB() {
  console.log('Starting DB!...')
  return client.connect()
}

export let db = client.db('sch') 