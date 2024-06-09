import Credentials from 'next-auth/providers/credentials';
import postgres from '@/databases/postgres';
import bcrypt from 'bcrypt';

export default Credentials({
  credentials: { email: {}, password: {} },
  authorize: async (credentials) => {
    const user = await postgres.user.findUnique({
      where: {
        email: credentials.email as string,
      },
    });

    if (!user) throw new Error('Invalid Credentials');
    const isValidPassword = await bcrypt.compare(
      credentials.password as string,
      user.password!,
    );

    if (!isValidPassword) throw new Error('Invalid Credentials');

    // return json object with the user data
    return user;
  },
});
