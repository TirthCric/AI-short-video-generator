"use client"

import { db } from '@/configs/db';
import { useUser } from '@clerk/nextjs'
import { eq } from 'drizzle-orm';
import { Users } from '@/configs/schema';
import { useEffect } from 'react'

function Provider({ children }) {

  const { user } = useUser();

  useEffect(() => {
    user && isNewUser()
  }, [user]);

  const isNewUser = async () => {

    const result = await db.select().from(Users).where(eq(Users.email, user?.primaryEmailAddress.emailAddress));

    if(!result[0]){
      await db.insert(Users).values({
        name: user?.fullName || "User",
        email: user?.primaryEmailAddress.emailAddress,
        imageUrl: user?.imageUrl, 
        createdAt: new Date(),
    })
  }
}

  return (
    <div>
      {children}
    </div>
  )
}

export default Provider;