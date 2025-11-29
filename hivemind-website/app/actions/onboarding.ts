'use server'

import { auth } from "@/app/auth"
import { prisma } from "@/lib/prisma"
import { userInfoSchema, type UserInfoValues } from "@/lib/schemas/user-info"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function submitOnboarding(data: UserInfoValues) {
  const session = await auth()

  console.log("SERVER SESSION CHECK:", session)

  if (!session?.user?.email) {
    return { error: "You must be logged in to save your profile." }
  }

  const validatedFields = userInfoSchema.safeParse(data)

  if (!validatedFields.success) {
    return { error: "Invalid data submitted." }
  }

  try {
    await prisma.user.update({
      where: { email: session.user.email },
      data: validatedFields.data,
    })
  } catch (error) {

    return { error: "Failed to save profile." }
  }

  revalidatePath("/dashboard")
  redirect("/dashboard")
}