import { auth } from "@/app/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic'

export default async function Home() {
    const session = await auth()
    console.log("DASHBOARD SESSION:", session)

    if (!session?.user?.email) redirect("/auth/login")

    const user = await prisma.user.findUnique({
        where: { email: session.user.email }
    })
    if (!user?.age) {
        redirect("/onboarding")
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-24">
            <h1 className="text-4xl font-bold">Dashboard!</h1>
            <p className="mt-4 text-lg">Welcome back, {JSON.stringify(user, null, 4)}!</p>
        </div>
    );
}