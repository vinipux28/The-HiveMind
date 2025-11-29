'use server'

import { auth } from "@/app/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { Difficulty, QuestStatus } from "@/lib/generated/prisma/enums"

// --- MILESTONES ---

export async function createMilestone(title: string, description: string) {
  const session = await auth()
  if (!session?.user?.email) return { error: "Unauthorized" }

  try {
    await prisma.milestone.create({
      data: {
        title,
        description,
        user: { connect: { email: session.user.email } }
      }
    })
    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    return { error: "Failed to create milestone" }
  }
}

export async function deleteMilestone(id: string) {
  const session = await auth()
  if (!session?.user?.email) return { error: "Unauthorized" }

  try {
    await prisma.milestone.delete({
      where: { id }
    })
    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    return { error: "Failed to delete" }
  }
}

// --- QUESTS ---

export async function createQuest(
  milestoneId: string, 
  title: string, 
  difficulty: Difficulty, 
  tasks: string[] // Array of task content strings
) {
  const session = await auth()
  if (!session?.user?.email) return { error: "Unauthorized" }

  try {
    // Determine points based on difficulty
    let completionPoints = 50
    if (difficulty === 'EASY') completionPoints = 20
    if (difficulty === 'HARD') completionPoints = 100
    if (difficulty === 'EPIC') completionPoints = 500

    await prisma.quest.create({
      data: {
        title,
        difficulty,
        completionPoints,
        status: "IN_PROGRESS",
        milestone: { connect: { id: milestoneId } },
        user: { connect: { email: session.user.email } },
        // Create all tasks at once
        tasks: {
          create: tasks.map(content => ({
            content,
            points: 10, // Default points per task
            isCompleted: false
          }))
        }
      }
    })
    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    return { error: "Failed to create quest" }
  }
}

// --- TASKS ---

export async function toggleTask(taskId: string, isCompleted: boolean) {
  try {
    await prisma.task.update({
      where: { id: taskId },
      data: { isCompleted }
    })
    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    return { error: "Failed to update task" }
  }
}


export async function completeQuest(questId: string) {
  const session = await auth()
  if (!session?.user?.email) return { error: "Unauthorized" }

  // 1. Fetch Quest and its Tasks
  const quest = await prisma.quest.findUnique({
    where: { id: questId },
    include: { tasks: true }
  })

  if (!quest) return { error: "Quest not found" }
  if (quest.status === "COMPLETED") return { error: "Already completed" }

  // 2. Validate all tasks are done
  const allTasksDone = quest.tasks.every(t => t.isCompleted)
  if (!allTasksDone) return { error: "Complete all tasks first" }

  // 3. Calculate Score
  const taskPoints = quest.tasks.reduce((acc, t) => acc + t.points, 0)
  const totalPoints = quest.completionPoints + taskPoints

  try {
    await prisma.$transaction(async (tx) => {
      await tx.quest.update({
        where: { id: questId },
        data: { status: QuestStatus.COMPLETED }
      })

      // Get current user data
      const user = await tx.user.findUnique({
        where: { email: session.user!.email! }
      })

      if (!user) throw new Error("User not found")

      const newScore = user.score + totalPoints
      const newLevel = Math.floor(newScore / 1000) + 1

      // Update User
      await tx.user.update({
        where: { email: session.user!.email! },
        data: {
          score: newScore,
          level: newLevel
        }
      })
    })

    revalidatePath("/dashboard")
    return { success: true, pointsGained: totalPoints }
  } catch (error) {
    return { error: "Failed to complete quest" }
  }
}