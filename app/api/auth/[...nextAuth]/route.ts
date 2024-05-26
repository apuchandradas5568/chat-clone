import bcrypt from 'bcrypt'
import NextAuth, {AuthOptions} from 'next-auth'
import  CredentialsProvider from 'next-auth/providers/credentials'
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import prisma from '@/app/libs/prisma.db'


export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID as string,
            clientSecret: process.env.GOOGLE_SECRET as string
        }),
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: {label: 'email', type: 'text'},
                password: {label: 'Password', type: 'password'}
            },
            async authorize(credentials) {
               if(!credentials?.email || !credentials?.password){
                throw new Error('Invalid Credentials')
               }               

               const user  = await prisma.user.findUnique({
                where: {
                    email: credentials.email
                }
               })
            //    console.log(user);
               

               if(!user || !user?.hashedPassword) {
                throw new Error('Invalid Credentials')
               }

               const isValid = await bcrypt.compare(credentials.password, user.hashedPassword)

                if(!isValid) {
                 throw new Error('Invalid Credentials')
                }

                return user

            }
        })
    ],
    debug: process.env.NODE_ENV === 'development',
    session: {
        strategy: 'jwt'
    },
    secret: process.env.NEXTAUTH_SECRET as string,
}

const handler = NextAuth(authOptions)



export {handler as GET , handler as POST}