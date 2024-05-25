import bcrypt from 'bcrypt'

import prisma from '@/app/libs/prisma.db'
import { NextResponse } from 'next/server'


export async function POST(request:Request){

    const body = await request.json()

    const  {email, name, password} = body

    if(!email || !name || !password){
        return new NextResponse('Invalid Credentials', {status: 400})
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    try {
        const user = await prisma.user.create({
            data: {
                email,
                name,
                hashedPassword
            }
        })

        return NextResponse.json(user)
    } catch (error) {
        return new NextResponse('User already exists', {status: 400})
    }

}