import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { verifyPassword } from "../../../lib/auth";
import { connectDB } from "../../../lib/db";

// we execute the nex auth function and in that function we pass an object which will be the configuration of this function.
export default NextAuth({
  providers: [
    Providers.Credentials({
      session: {
        jwt: true,
      },
      // credentials: {
      // this will create a auto generated log in form
      // }
      async authorize(credentials) {
        const client = await connectDB();

        const usersCollection = client.db().collection("registeredUsers");
        const user = await usersCollection.findOne({
          email: credentials.email,
        });
        console.log(user);

        if (!user) {
          throw new Error("No User Found!");
        }

        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );

        if (!isValid) {
          client.close();
          throw new Error("Incorrect password!");
        }

        client.close();
        return {
          email: user.email,
        };
      },
    }),
  ],
});
