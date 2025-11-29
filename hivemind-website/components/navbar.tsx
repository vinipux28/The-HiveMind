import Link from "next/link"
import { auth } from "@/app/auth"
import { UserNav } from "@/components/user-nav"
import { Button } from "@/components/ui/button"
import { Bot, Menu, Sparkles } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export async function Navbar() {
  const session = await auth()
  const user = session?.user

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-100 bg-white/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        
        {/* LEFT: Logo */}
        <div className="flex items-center gap-2">
            <div className="bg-black text-white p-1.5 rounded-lg">
                <Bot className="h-5 w-5" />
            </div>
            <Link href="/dashboard" className="text-xl font-bold tracking-tight">
                Hivemind
            </Link>
        </div>

        {/* MIDDLE: Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-600">
          <Link href="/dashboard" className="hover:text-black transition-colors">Dashboard</Link>
          <Link href="/community" className="hover:text-black transition-colors">Community</Link>
          <Link href="/resources" className="hover:text-black transition-colors">Resources</Link>
        </nav>

        {/* RIGHT: Actions */}
        <div className="flex items-center gap-4">
          
          {/* AI Chat Button */}
          <Button 
            className="hidden md:flex bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white border-0 hover:opacity-90 shadow-md"
          >
            <Sparkles className="mr-2 h-4 w-4 fill-white" />
            Ask AI
          </Button>

          {/* User Profile OR Login Button */}
          {user ? (
            <UserNav user={user} />
          ) : (
            <div className="flex gap-2">
                <Link href="/auth/login">
                    <Button variant="ghost">Log in</Button>
                </Link>
                <Link href="/auth/register">
                    <Button>Sign up</Button>
                </Link>
            </div>
          )}

          {/* Mobile Menu Trigger */}
          <div className="md:hidden">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Menu className="h-5 w-5" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="right">
                    <div className="flex flex-col gap-4 mt-8">
                        <Link href="/dashboard" className="text-lg font-medium">Dashboard</Link>
                        <Link href="/community" className="text-lg font-medium">Community</Link>
                        <Button className="w-full bg-gradient-to-r from-indigo-500 to-pink-500 border-0">
                            <Sparkles className="mr-2 h-4 w-4" />
                            Ask AI
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>
          </div>

        </div>
      </div>
    </header>
  )
}