'use client'

import { useState, useRef, useEffect } from "react"
import { sendMessage } from "@/app/actions/chat"
import { uploadImages } from "@/app/actions/upload"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Send, User, Loader2, X, Paperclip } from "lucide-react"

type ChatUser = {
  id: string
  name: string | null
  email: string | null
  image: string | null
}

type Message = {
  id: string
  content: string | null
  attachments: { url: string }[]
  createdAt: Date
  senderId: string
  sender: { name: string | null, image: string | null }
}

interface ChatInterfaceProps {
  users: ChatUser[]
}

export function ChatInterface({ users }: ChatInterfaceProps) {
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [currentUserId, setCurrentUserId] = useState<string>("")
  const [inputText, setInputText] = useState("")
  
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [isSending, setIsSending] = useState(false)
  
  const bottomRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, previewUrls])

  useEffect(() => {
    if (!selectedUser) return

    const fetchMsgs = async () => {
        const { getMessages } = await import("@/app/actions/chat")
        const result = await getMessages(selectedUser.id)
        if (Array.isArray(result)) return 
        
        setMessages(result.messages as unknown as Message[])
        setCurrentUserId(result.currentUserId)
    }

    fetchMsgs() 
    const interval = setInterval(fetchMsgs, 3000)
    return () => clearInterval(interval)
  }, [selectedUser])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      setSelectedFiles(prev => [...prev, ...newFiles])
      
      const newUrls = newFiles.map(file => URL.createObjectURL(file))
      setPreviewUrls(prev => [...prev, ...newUrls])
    }
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
    setPreviewUrls(prev => prev.filter((_, i) => i !== index))
  }

  const handleSend = async () => {
    if (!selectedUser) return
    if (!inputText.trim() && selectedFiles.length === 0) return

    setIsSending(true)

    try {
      let uploadedUrls: string[] = []

      if (selectedFiles.length > 0) {
        const formData = new FormData()
        selectedFiles.forEach(file => formData.append("file", file))
        
        const uploadRes = await uploadImages(formData)
        if (uploadRes.urls) {
            uploadedUrls = uploadRes.urls
        }
      }

      const optimisicMsg: Message = {
        id: Date.now().toString(),
        content: inputText,
        attachments: uploadedUrls.map(url => ({ url })),
        createdAt: new Date(),
        senderId: currentUserId,
        sender: { name: "Me", image: null } 
      }
      
      setMessages(prev => [...prev, optimisicMsg])
      
      await sendMessage(selectedUser.id, inputText, uploadedUrls)

      setInputText("")
      setSelectedFiles([])
      setPreviewUrls([])
      if (fileInputRef.current) fileInputRef.current.value = ""

    } catch (error) {
      console.error("Failed to send", error)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="flex h-[calc(100vh-120px)] w-full gap-4 p-4">
      {/* Sidebar */}
      <Card className="w-1/3 flex flex-col overflow-hidden">
        <div className="p-4 border-b bg-zinc-50 font-bold">People</div>
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
                  <AvatarFallback className="text-zinc-900">{user.name?.[0]}</AvatarFallback>
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

      {/* Main Chat */}
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

            <div className="flex-1 overflow-y-auto p-4 bg-white/50">
              <div className="flex flex-col gap-4">
                {messages.length === 0 && (
                    <div className="text-center text-zinc-400 mt-10">No messages yet. Say hi!</div>
                )}
                {messages.map((msg) => {
                  const isMe = msg.senderId === currentUserId
                  return (
                    <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${
                          isMe ? "bg-blue-600 text-white rounded-br-none" : "bg-zinc-200 text-zinc-900 rounded-bl-none"
                        }`}>
                        
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className={`grid gap-1 mb-2 ${msg.attachments.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                            {msg.attachments.map((att, i) => (
                                <img key={i} src={att.url} alt="attachment" className="rounded-lg object-cover w-full h-auto max-h-48 border border-black/10" />
                            ))}
                          </div>
                        )}
                        
                        {msg.content && <p>{msg.content}</p>}
                        <p className={`text-[10px] mt-1 opacity-70 ${isMe ? "text-blue-100" : "text-zinc-500"}`}>
                           {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                      </div>
                    </div>
                  )
                })}
                <div ref={bottomRef} className="pt-2" />
              </div>
            </div>

            <div className="p-4 border-t bg-white flex flex-col gap-2">
              {/* Preview Area */}
              {previewUrls.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {previewUrls.map((url, index) => (
                        <div key={index} className="relative shrink-0">
                            <img src={url} alt="Preview" className="h-20 w-auto rounded-md border" />
                            <button 
                                onClick={() => removeFile(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 shadow-sm"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    ))}
                </div>
              )}

              {/* Input Bar */}
              <div className="flex gap-2 items-center">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  multiple 
                  onChange={handleFileSelect}
                />
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full shrink-0"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isSending}
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                
                <Input 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type a message..."
                  onKeyDown={(e) => e.key === "Enter" && !isSending && handleSend()}
                  className="flex-1"
                  disabled={isSending}
                />
                <Button 
                  onClick={handleSend} 
                  size="icon" 
                  className="rounded-full shrink-0" 
                  disabled={isSending || (!inputText.trim() && selectedFiles.length === 0)}
                >
                  {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
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