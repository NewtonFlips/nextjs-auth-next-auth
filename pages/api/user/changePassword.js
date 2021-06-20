import { getSession } from "next-auth/client";
import { hashPassword, verifyPassword } from "../../../lib/auth";
import { connectDB } from "../../../lib/db";

async function handler(req, res) {
  // 1.
  if (req.method !== "PATCH") {
    return;
  }

  // 2.
  const session = await getSession({ req: req });

  if (!session) {
    res.status(401).json({ message: "Unauthorised!" });
    return;
  }

  // Password change logic
  const userEmail = session.user.email;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;

  const client = await connectDB();
  const usersCollection = client.db().collection("registeredUsers");
  const user = await usersCollection.findOne({ email: userEmail });

  if (!user) {
    res.status(500).json({ message: "Internal server error." });
    client.close();
    return;
  }

  const currentPassword = user.password;
  const validPassword = await verifyPassword(oldPassword, currentPassword);

  if (!validPassword) {
    res.status(422).json({ message: "Incorrect password provided." });
    client.close();
    return;
  }

  const hashedNewPassword = await hashPassword(newPassword);

  const result = await usersCollection.updateOne(
    { email: userEmail },
    { $set: { password: hashedNewPassword } }
  );

  client.close();
  res.status(200).json({ message: "Password updated." });
}

export default handler;
