'use server'

import { auth } from "@/app/auth"
import { prisma } from "@/lib/prisma"
import { userInfoSchema, type UserInfoValues } from "@/lib/schemas/user-info"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function submitOnboarding(data: UserInfoValues) {
  const session = await auth()

  if (!session?.user?.email) {
    return { error: "You must be logged in to save your profile." }
  }

  // Validate with Zod
  const validatedFields = userInfoSchema.safeParse(data)

  if (!validatedFields.success) {
    console.error("Validation Error:", validatedFields.error)
    return { error: "Invalid data submitted." }
  }

  // Destructure fields that need manual transformation
  const { dateOfBirth, interests, ...otherData } = validatedFields.data

  try {
    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        ...otherData,
        // 1. Convert string date to Date object
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        
        // 2. Convert comma-separated string to Array of strings
        interests: interests 
          ? interests.split(',').map(s => s.trim()).filter(Boolean) 
          : [],
      },
    })
  } catch (error) {
    console.error("DB Update Error:", error)
    return { error: "Failed to save profile." }
  }

  revalidatePath("/dashboard")
  redirect("/dashboard")
}