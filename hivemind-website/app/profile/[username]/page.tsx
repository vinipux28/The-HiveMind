import { auth } from "@/app/auth"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link" // <--- Import Link
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { FollowButton } from "@/components/follow-button"
import { Badge } from "@/components/ui/badge"
import { Trophy, Calendar, Map, Users, MessageSquare, MapPin, Briefcase, BookOpen } from "lucide-react" // <--- Import MessageSquare

// Next.js 15: params is a Promise
export default async function PublicProfilePage(props: { params: Promise<{ username: string }> }) {
  const params = await props.params;
  const { username } = params;
  const session = await auth()

  // Fetch target user public info
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      _count: {
        select: {
          followedBy: true,
          following: true,
          milestones: true,
          quests: true 
        }
      },
      quests: {
        where: { status: "COMPLETED" },
        take: 5,
        orderBy: { updatedAt: 'desc' }
      }
    }
  })

  if (!user) return notFound()

  // Check if viewing own profile
  const isOwnProfile = session?.user?.email === user.email
  
  // Check follow status
  let isFollowing = false
  if (session?.user?.email && !isOwnProfile) {
    const currentUser = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { following: true }
    })
    isFollowing = currentUser?.following.some(f => f.followingId === user.id) ?? false
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Header Card */}
        <Card className="overflow-hidden border-zinc-200 shadow-md">
          <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
          <div className="px-8 pb-8">
            <div className="relative flex justify-between items-end -mt-12 mb-6">
              <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                <AvatarImage src={user.image || ""} />
                <AvatarFallback className="text-2xl font-bold bg-zinc-100">{user.name?.[0]}</AvatarFallback>
              </Avatar>
              
              {/* Actions Area: Message & Follow */}
              {!isOwnProfile && session?.user && (
                 <div className="mb-2 flex gap-2">
                    {/* Message Button */}
                    <Link 
                        href={`/messages?username=${user.username}`}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 rounded-md hover:bg-zinc-50 transition-colors shadow-sm"
                    >
                        <MessageSquare className="w-4 h-4" />
                        Message
                    </Link>

                    {/* Follow Button */}
                    <FollowButton targetUserId={user.id} initialIsFollowing={isFollowing} />
                 </div>
              )}
            </div>

            <div>
              <h1 className="text-3xl font-bold text-zinc-900">{user.name}</h1>
              <p className="text-sm text-zinc-400">@{user.username}</p>
              <p className="text-zinc-500 font-medium">Level {user.level} Explorer</p>
                
              {/* Header small details */}
              <div className="flex gap-4 mt-4 text-sm text-zinc-600">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> Joined {new Date(user.createdAt).getFullYear()}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" /> {user._count.followedBy} Followers
                </span>
                {user.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> {user.location}
                  </span>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Total XP" value={user.score} icon={<Trophy className="text-yellow-500" />} />
            <StatCard label="Quests Done" value={user.quests.length} icon={<Trophy className="text-green-500" />} />
            <StatCard label="Active Goals" value={user._count.milestones} icon={<Map className="text-blue-500" />} />
            <StatCard label="Following" value={user._count.following} icon={<Users className="text-purple-500" />} />
        </div>

        {/* About / Details */}
        <Card className="border-zinc-200 shadow-sm">
          <CardHeader>
            <h3 className="text-lg font-bold flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-500" /> About
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Bio */}
              {user.bio ? (
                <p className="text-sm text-zinc-700">{user.bio}</p>
              ) : (
                <p className="text-sm text-zinc-400 italic">No bio provided.</p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {user.dateOfBirth && (
                  <div className="flex items-center gap-2 text-sm text-zinc-600">
                      <Calendar className="w-4 h-4" /> Age {getAgeFromDOB(user.dateOfBirth)}
                  </div>
                )}

                {user.education && (
                  <div className="flex items-center gap-2 text-sm text-zinc-600">
                      <BookOpen className="w-4 h-4" /> {formatEducation(user.education)}
                  </div>
                )}

                {user.employmentStatus && (
                  <div className="flex items-center gap-2 text-sm text-zinc-600">
                      <Briefcase className="w-4 h-4" /> {formatEmployment(user.employmentStatus)}
                  </div>
                )}

                {user.householdSize !== null && user.householdSize !== undefined && (
                  <div className="flex items-center gap-2 text-sm text-zinc-600">
                      <Users className="w-4 h-4" /> Household: {user.householdSize}
                  </div>
                )}
              </div>

              {/* Interests list */}
              {user.interests && user.interests.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {user.interests.map((interest: string) => (
                      <Badge key={interest} className="bg-zinc-50 text-zinc-700 border-zinc-100">{interest}</Badge>
                    ))}
                  </div>
              )}

              {/* Show more sensitive info only to self */}
              {isOwnProfile && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t">
                  {user.bmi !== null && user.bmi !== undefined && (
                    <div className="text-sm text-zinc-600">BMI: {user.bmi}</div>
                  )}
                  {user.mentalHealthScore !== null && user.mentalHealthScore !== undefined && (
                    <div className="text-sm text-zinc-600">Mental Health: {user.mentalHealthScore}/10</div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Achievements (Trophy Case) */}
        <Card className="border-zinc-200 shadow-sm">
            <CardHeader>
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    Recent Achievements
                </h3>
            </CardHeader>
            <CardContent>
                {user.quests.length === 0 ? (
                    <p className="text-zinc-400 text-sm italic">No completed quests yet.</p>
                ) : (
                    <div className="space-y-3">
                        {user.quests.map(quest => (
                            <div key={quest.id} className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg border border-zinc-100">
                                <span className="font-medium text-zinc-700">{quest.title}</span>
                                <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
                                    +{quest.completionPoints} XP
                                </Badge>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>

      </div>
    </div>
  )
}

function StatCard({ label, value, icon }: any) {
    return (
        <Card className="flex flex-col items-center justify-center p-4 shadow-sm border-zinc-200">
            <div className="mb-2 p-2 bg-zinc-50 rounded-full">{icon}</div>
            <span className="text-2xl font-bold text-zinc-900">{value}</span>
            <span className="text-xs font-bold uppercase tracking-wide text-zinc-400">{label}</span>
        </Card>
    )
}

// Small helpers
function getAgeFromDOB(dob: Date | string) {
  try {
    const birth = new Date(dob)
    const now = new Date()
    let age = now.getFullYear() - birth.getFullYear()
    const m = now.getMonth() - birth.getMonth()
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--
    return age
  } catch (e) {
    return null
  }
}

function formatEducation(education?: string) {
  switch (education) {
    case 'high_school': return "High School"
    case 'bachelors': return "Bachelor's"
    case 'masters': return "Master's"
    case 'phd': return "PhD"
    default: return education || "—"
  }
}

function formatEmployment(status?: string) {
  switch (status) {
    case 'employed': return "Employed full-time"
    case 'part_time': return "Part-time"
    case 'self_employed': return "Self-employed"
    case 'retired': return "Retired"
    case 'unemployed': return "Unemployed"
    default: return status || "—"
  }
}