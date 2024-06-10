import NextAuth, { type DefaultSession } from 'next-auth';
import postgres from '@/databases/postgres';
import { PrismaAdapter } from '@auth/prisma-adapter';

import CredentialsProvider from '@/auth-providers/CredentialsProvider';
declare module 'next-auth' {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      password?: string;
      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    } & DefaultSession['user'];
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(postgres),
  providers: [CredentialsProvider],
  session: { strategy: 'jwt', maxAge: 60 * 60 * 24 * 30 },
  callbacks: {},
  // useSecureCookies: true,
  pages: {
    signIn: '/auth/register',
    signOut: '/auth/logout',
    error: '/auth/error', // Error code passed in query string as ?error=
    verifyRequest: '/auth/verify-request', // (used for check email message)
    // newUser: '/auth/new-user', // New users will be directed here on first sign in (leave the property out if not of interest)
  },
});
