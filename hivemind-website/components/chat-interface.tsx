'use client'

import { useState, useRef, useEffect, useTransition } from "react"
import { sendMessage } from "@/app/actions/chat"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Send, User } from "lucide-react"

type ChatUser = {
  id: string
  name: string | null
  email: string | null
  image: string | null
}

type Message = {
  id: string
  content: string
  createdAt: Date
  senderId: string
  sender: { name: string | null, image: string | null }
}

interface ChatInterfaceProps {
  users: ChatUser[]
  initialMessages?: Message[]
  currentUserId?: string
}

export function ChatInterface({ users }: ChatInterfaceProps) {
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [currentUserId, setCurrentUserId] = useState<string>("")
  const [inputText, setInputText] = useState("")
  const [isPending, startTransition] = useTransition()
  
  // Ref for the bottom of the chat list
  const bottomRef = useRef<HTMLDivElement>(null)

  // 1. Auto-scroll to bottom whenever messages update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // 2. Poll for messages
  useEffect(() => {
    if (!selectedUser) return

    const fetchMsgs = async () => {
        const { getMessages } = await import("@/app/actions/chat")
        const result = await getMessages(selectedUser.id)
        if (Array.isArray(result)) return 
        
        setMessages(result.messages)
        setCurrentUserId(result.currentUserId)
    }

    fetchMsgs() 
    const interval = setInterval(fetchMsgs, 3000)

    return () => clearInterval(interval)
  }, [selectedUser])

  const handleSend = async () => {
    if (!selectedUser || !inputText.trim()) return

    const optimisicMsg: Message = {
        id: Date.now().toString(),
        content: inputText,
        createdAt: new Date(),
        senderId: currentUserId,
        sender: { name: "Me", image: null } 
    }
    
    setMessages(prev => [...prev, optimisicMsg])
    setInputText("")

    await sendMessage(selectedUser.id, optimisicMsg.content)
  }

  return (
    // FIX: Use a dynamic height calculation to fit screen minus navbar/padding
    <div className="flex h-[calc(100vh-120px)] w-full gap-4 p-4">
      
      {/* LEFT: Users List */}
      <Card className="w-1/3 flex flex-col overflow-hidden">
        <div className="p-4 border-b bg-zinc-50 font-bold">
            People
        </div>
        <div className="flex-1 overflow-y-auto p-2"> 
          <div className="flex flex-col gap-1">
            {users.map(user => (
              <button
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className={`flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                  selectedUser?.id === user.id 
                    ? "bg-zinc-900 text-white" 
                    : "hover:bg-zinc-100"
                }`}
              >
                <Avatar className="h-10 w-10 border">
                  <AvatarImage src={user.image || ""} />
                  <AvatarFallback className="text-zinc-900">{user.name?.[0] || "?"}</AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <p className="font-medium truncate">{user.name || "Unknown"}</p>
                  <p className={`text-xs truncate ${selectedUser?.id === user.id ? "text-zinc-300" : "text-zinc-500"}`}>
                    {user.email}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* RIGHT: Chat Window */}
      <Card className="flex-1 flex flex-col overflow-hidden shadow-xl">
        {selectedUser ? (
          <>
            <div className="p-4 border-b bg-zinc-50 flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={selectedUser.image || ""} />
                <AvatarFallback>{selectedUser.name?.[0]}</AvatarFallback>
              </Avatar>
              <span className="font-bold">{selectedUser.name}</span>
            </div>

            {/* FIX: Use native div with overflow-y-auto instead of ScrollArea component */}
            <div className="flex-1 overflow-y-auto p-4 bg-white/50">
              <div className="flex flex-col gap-4">
                {messages.length === 0 && (
                    <div className="text-center text-zinc-400 mt-10">No messages yet. Say hi!</div>
                )}
                {messages.map((msg) => {
                  const isMe = msg.senderId === currentUserId
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${
                          isMe
                            ? "bg-blue-600 text-white rounded-br-none"
                            : "bg-zinc-200 text-zinc-900 rounded-bl-none"
                        }`}
                      >
                        <p>{msg.content}</p>
                        <p className={`text-[10px] mt-1 opacity-70 ${isMe ? "text-blue-100" : "text-zinc-500"}`}>
                           {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                      </div>
                    </div>
                  )
                })}
                {/* Invisible div to scroll to */}
                <div ref={bottomRef} className="pt-2" />
              </div>
            </div>

            <div className="p-4 border-t bg-white flex gap-2">
              <Input 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type a message..."
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1"
              />
              <Button onClick={handleSend} size="icon" className="rounded-full">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-400">
            <User className="h-16 w-16 mb-4 opacity-20" />
            <p>Select a user to start chatting</p>
          </div>
        )}
      </Card>
    </div>
  )
}