import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      id: "Dev-Login",
      name: "Gov Gpt",
      async authorize(credentials) {
        const { password } = credentials as {
          password: string;
        };
        if (password === process.env.AUTH_PASSWORD) return { id: "Test Login" };
        throw new Error("Incorrect Email or Password");
      },
      credentials: {
        password: { label: "Password", type: "password" },
      },
    }),
  ],
};
