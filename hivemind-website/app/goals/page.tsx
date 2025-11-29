import { auth } from "@/app/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { QuestCard } from "@/components/game/quest-card"
import { CreateMilestoneBtn, CreateQuestBtn } from "@/components/game/creation-forms"
import { Progress } from "@/components/ui/progress"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export const dynamic = 'force-dynamic'

export default async function GoalsPage() {
  const session = await auth()
  if (!session?.user?.email) redirect("/auth/login")

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      milestones: {
        orderBy: { createdAt: 'desc' },
        include: {
          quests: {
            orderBy: { createdAt: 'asc' },
            include: { tasks: { orderBy: { createdAt: 'asc' } } }
          }
        }
      }
    }
  })

  if (!user) return null

  // Level Logic
  const xpForNextLevel = 1000
  const currentLevelProgress = (user.score % xpForNextLevel) / 10 // Percentage

  return (
    <div className="min-h-screen bg-zinc-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header / Stats */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-200 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Your Progression</h1>
            <p className="text-zinc-500">Keep completing quests to level up.</p>
          </div>
          <div className="w-64">
             <div className="flex justify-between text-sm font-bold mb-2">
                <span>Level {user.level}</span>
                <span className="text-blue-600">{user.score} XP</span>
             </div>
             <Progress value={currentLevelProgress} className="h-3" />
          </div>
        </div>

        {/* Milestones Area */}
        <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Active Milestones</h2>
            <CreateMilestoneBtn />
        </div>

        <div className="grid gap-6">
          {user.milestones.length === 0 && (
            <div className="text-center p-12 text-zinc-400 border-2 border-dashed rounded-lg">
                No milestones yet. Create one to get started!
            </div>
          )}

          {user.milestones.map((milestone) => (
            <div key={milestone.id} className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden">
              <div className="p-6 border-b bg-zinc-50/50 flex justify-between items-center">
                 <div>
                    <h3 className="text-xl font-bold">{milestone.title}</h3>
                    <p className="text-zinc-500">{milestone.description}</p>
                 </div>
                 <CreateQuestBtn milestoneId={milestone.id} />
              </div>

              <div className="p-6 bg-zinc-50/30">
                {milestone.quests.length === 0 ? (
                    <p className="text-sm text-zinc-400 italic">No quests added to this milestone yet.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {milestone.quests.map(quest => (
                            <QuestCard key={quest.id} quest={quest} />
                        ))}
                    </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}