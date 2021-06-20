import { MongoClient } from "mongodb";

export async function connectDB() {
  const client = await MongoClient.connect(
    "mongodb+srv://admin:admin@cluster0.jpvvg.mongodb.net/users?retryWrites=true&w=majority"
  );

  return client;
}
