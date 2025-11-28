import { UserInfoWizard } from "@/components/user-wizard"

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-10 space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight">Let's build your profile</h1>
        <p className="text-zinc-500">We need a few details to personalize your Hivemind experience.</p>
      </div>
      
      <UserInfoWizard />
    </div>
  )
}