import NextAuth from 'next-auth'

import { authOptions } from '~/server/auth'

// next-auth v4 route-handler typings leak `any` here in strict-eslint mode.
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
