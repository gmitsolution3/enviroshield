import { sendEmail } from "@/lib/email";
import { resetPasswordEmail } from "@/lib/emails/reset-password-email";
import { verificationEmail } from "@/lib/emails/verification-email";
import clientPromise from "@/lib/mongodb";

import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin } from "better-auth/plugins";

const client = await clientPromise;

const db = client.db(process.env.MONGODB_DB);

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),

  user: {
    additionalFields: {
      phone: {
        type: "string",
        required: false,
      },

      imagePublicId: {
        type: "string",
        required: false,
      },
    },
  },

  plugins: [admin()],

  session: {
    expiresIn: 60 * 60 * 24,
    updateAge: 0,
    disableSessionRefresh: true,
  },

  emailAndPassword: {
    enabled: true,

    requireEmailVerification: true,

    sendResetPassword: async ({ user, url }) => {
      const email = resetPasswordEmail({ url });

      void sendEmail({
        to: user.email,
        subject: "Reset your Enviroshield password",
        text: email.text,
        html: email.html,
      });
    },

    resetPasswordTokenExpiresIn: 60 * 60,

    revokeSessionsOnPasswordReset: true,
  },

  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,

    sendVerificationEmail: async ({ user, url }) => {
      const email = verificationEmail({ url });

      void sendEmail({
        to: user.email,
        subject: "Verify your Enviroshield email",
        text: email.text,
        html: email.html,
      });
    },

    expiresIn: 60 * 60,
  },
});
