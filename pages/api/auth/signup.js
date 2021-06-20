import { hashPassword } from "../../../lib/auth";
import { connectDB } from "../../../lib/db";

async function handler(req, res) {
  // chekcing if the request is post to initiate this function
  if (req.method !== "POST") {
    return;
  }

  // reading data from request object
  const data = req.body;

  // destructuring the properties of req.body in different variables
  // This is a plain password and it should be hashed so it is not compromised.
  const { email, password } = data;

  // Connecting to Database
  const client = await connectDB();

  //get access to databas
  const db = client.db();

  // Checking if the user is already registered
  const registeredUser = await db
    .collection("registeredUsers")
    .findOne({ email: email });

  if (registeredUser) {
    res.status(422).json({ message: "User already exists" });
    client.close();
    return;
  }

  // Hashing Password
  const hashedPassword = await hashPassword(password);

  // check if input is valid
  if (
    !email ||
    !email.includes("@") ||
    !password ||
    password.trim().length < 7
  ) {
    res.status(402).json({ message: "Invalid field(s) data sent." });
    return;
  }

  // storing data in DB
  const result = await db.collection("registeredUsers").insertOne({
    email,
    password: hashedPassword,
  });

  res.status(201).json({ message: "User successfully created!" });
  client.close();
}

export default handler;
