'use client'

import { useState, useTransition } from "react"
import { toggleTask, completeQuest } from "@/app/actions/game"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trophy, CheckCircle2, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

// Types based on your Prisma Schema
type Task = { id: string; content: string; isCompleted: boolean; points: number }
type Quest = { 
  id: string; 
  title: string; 
  difficulty: string; 
  status: string; 
  completionPoints: number;
  tasks: Task[] 
}

export function QuestCard({ quest }: { quest: Quest }) {
  const [isPending, startTransition] = useTransition()
  
  const allTasksCompleted = quest.tasks.every(t => t.isCompleted)
  const isQuestCompleted = quest.status === 'COMPLETED'

  const handleToggle = (taskId: string, currentStatus: boolean) => {
    startTransition(async () => {
      await toggleTask(taskId, !currentStatus)
    })
  }

  const handleComplete = () => {
    startTransition(async () => {
      await completeQuest(quest.id)
    })
  }

  return (
    <Card className={cn("border-l-4 transition-all", 
      isQuestCompleted ? "border-l-green-500 opacity-75" : "border-l-blue-500"
    )}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              {quest.title}
              {isQuestCompleted && <CheckCircle2 className="h-5 w-5 text-green-500" />}
            </CardTitle>
            <div className="flex gap-2 mt-2">
              <Badge variant="secondary">{quest.difficulty}</Badge>
              <Badge variant="outline" className="text-yellow-600 border-yellow-200 bg-yellow-50">
                +{quest.completionPoints} XP
              </Badge>
            </div>
          </div>
          
          {!isQuestCompleted && (
            <Button 
              size="sm" 
              onClick={handleComplete}
              disabled={!allTasksCompleted || isPending}
              className={cn(allTasksCompleted ? "bg-green-600 hover:bg-green-700" : "opacity-50")}
            >
              <Trophy className="w-4 h-4 mr-1" />
              Claim
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {quest.tasks.map(task => (
            <div key={task.id} className="flex items-center space-x-3 p-2 rounded hover:bg-zinc-50">
              <Checkbox 
                id={task.id} 
                checked={task.isCompleted}
                onCheckedChange={() => handleToggle(task.id, task.isCompleted)}
                disabled={isQuestCompleted || isPending}
              />
              <label 
                htmlFor={task.id} 
                className={cn(
                  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer w-full",
                  task.isCompleted && "line-through text-zinc-400"
                )}
              >
                {task.content} <span className="text-xs text-zinc-400 ml-1">(+{task.points}xp)</span>
              </label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}