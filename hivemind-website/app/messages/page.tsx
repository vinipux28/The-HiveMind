import { getUsersToChatWith } from "@/app/actions/chat"
import { ChatInterface } from "@/components/chat-interface"

export const dynamic = 'force-dynamic'

export default async function MessagesPage() {
  const users = await getUsersToChatWith()

  return (
    <div className="min-h-screen bg-zinc-100 flex flex-col">
      {/* Main Content */}
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6 px-4">Messages</h1>
        <ChatInterface users={users} />
      </div>
    </div>
  )
}