import { z } from "zod"

export const userInfoSchema = z.object({
  // Step 1: Demographics
  age: z.number().min(10).max(120),
  gender: z.enum(["male", "female", "non-binary", "other"]),
  education: z.string().min(1, "Please select an education level"),
  maritalStatus: z.string().min(1, "Required"),
  
  // Step 2: Household & Social
  householdSize: z.number().min(1),
  childrenCount: z.number().optional(),
  socialSupportLevel: z.enum(["low", "medium", "high"]), // Simpler metric for networks
  
  // Step 3: Childhood (Optional mostly)
  childhoodMathSkill: z.number().min(1).max(10).optional(),
  booksInHome: z.enum(["0-10", "11-25", "26-100", "100+"]).optional(),
  
  // Step 4: Health
  bmi: z.number().min(10).max(50).optional(),
  smoking: z.enum(["never", "former", "current"]),
  alcoholConsumption: z.enum(["none", "social", "regular"]),
  mentalHealthScore: z.number().min(0).max(10), // 0 = happy, 10 = depressed
  
  // Step 5: Work & Money
  employmentStatus: z.string().min(1),
  incomePercentile: z.number().min(0).max(100),
})

export type UserInfoValues = z.infer<typeof userInfoSchema>