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

export const getIsEnterprise = (priceId: string) => {
  return {
    price_1QMzgSHtuZjaClnWwXU6h1i4: true, //test: Enterprise Plan
    price_1QMzhRHtuZjaClnWqUVZhjtG: true, //test: Enterprise Plan
    price_1PYVXyRwNg4vrfp4tAbUiUhs: true, // main: Enterprise Plan monthly
    price_1PYVXzRwNg4vrfp4WHVxUKse: true, // main: Enterprise Plan yearly
    price_1QpZ6lRwNg4vrfp4NEkHzxhG: true, // main: new Enterprise Plan monthly
    price_1QpZ7QRwNg4vrfp4OnwkJWp5: true, // main: new Enterprise Plan yearly
    price_1PYVK6RwNg4vrfp4nhequUiJ: false, // Standard Plan
    price_1PYVK5RwNg4vrfp4O2dS6MCT: false, // Standard Plan
    price_1QpYt1RwNg4vrfp4PISlD6Vc: false, // new monthly Standard Plan
    price_1QpZ6KRwNg4vrfp4PjNkyXDB: false, // new yearly Standard Plan
  }[priceId];
};
