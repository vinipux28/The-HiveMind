'use client'

import { useActionState } from "react"
import { login } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const [state, action, isPending] = useActionState(login, undefined)

  return (
    <div className="flex h-screen items-center justify-center">
      <form action={action} className="w-full max-w-sm space-y-6 border p-8 shadow-md rounded-lg">
        <h1 className="text-2xl font-bold">Login</h1>
        
        <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input name="email" id="email" type="email" required />
        </div>

        <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input name="password" id="password" type="password" required />
        </div>

        {state?.error && (
          <p className="text-sm text-red-500">{state.error}</p>
        )}

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Signing In..." : "Sign In"}
        </Button>
      </form>
    </div>
  )
}