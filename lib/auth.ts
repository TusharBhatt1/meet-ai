import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/app/db";
import * as schema from "@/app/db/schema";
import { polar, checkout, portal } from "@polar-sh/better-auth"; 
import { polarClient } from "./polar";


export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  plugins: [
    polar({ 
      client: polarClient, 
      createCustomerOnSignUp: true, 
      use: [ 
        checkout({ 
          successUrl: "/upgrade", 
          authenticatedUsersOnly: true,
        }), 
        portal(), 
        // usage(), 
        // webhooks({ 
        //   secret: process.env.POLAR_WEBHOOK_SECRET, 
        //   onCustomerStateChanged: (payload) => {
        //     console.log("Customer state changed", payload);
        //   },
        //   onOrderPaid: (payload) => {
        //     console.log("Order paid", payload);
        //   },
        //   onPayload: (payload) => {
        //     console.log("Received payload", payload);
        //   },
        // }), 
      ], 
    }), 
  ],
});
