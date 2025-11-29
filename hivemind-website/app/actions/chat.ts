'use server'

import { auth } from "@/app/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function sendMessage(receiverId: string, content: string, attachmentUrl?: string) {
  const session = await auth()
  if (!session?.user?.email) return { error: "Unauthorized" }

  const sender = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true }
  })

  if (!sender) return { error: "User not found" }

  try {
    await prisma.message.create({
      data: {
        senderId: sender.id,
        receiverId: receiverId,
        content: content || "",
        attachmentUrl: attachmentUrl,
      },
    })
    
    revalidatePath("/messages") 
    return { success: true }
  } catch (error) {
    return { error: "Failed to send" }
  }
}

export async function getUsersToChatWith() {
  const session = await auth()
  if (!session?.user?.email) return []

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true }
  })

  if (!currentUser) return []

  return await prisma.user.findMany({
    where: {
      id: { not: currentUser.id }
    },
    select: {
      id: true,
      name: true,
      image: true,
      email: true
    }
  })
}

// 3. Get messages between current user and selected user
export async function getMessages(otherUserId: string) {
  const session = await auth()
  if (!session?.user?.email) return []

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true }
  })

  if (!currentUser) return []

  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: currentUser.id, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: currentUser.id },
      ],
    },
    orderBy: {
      createdAt: 'asc',
    },
    include: {
        sender: { select: { name: true, image: true } },
        receiver: { select: { name: true, image: true } }
    }
  })

  return { messages, currentUserId: currentUser.id }
}