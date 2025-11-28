'use client'

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion, AnimatePresence } from "motion/react"
import { userInfoSchema, type UserInfoValues } from "@/lib/schemas/user-info"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const steps = [
  { id: 1, title: "Who You Are", description: "Basic demographics" },
  { id: 2, title: "Home & Heart", description: "Household and social circle" },
  { id: 3, title: "Origins", description: "Childhood conditions" },
  { id: 4, title: "Health Metrics", description: "Physical and mental well-being" },
  { id: 5, title: "Work & Wealth", description: "Career and financial status" },
]

export function UserInfoWizard() {
  const [currentStep, setCurrentStep] = useState(0)
  const [previousStep, setPreviousStep] = useState(0)
  
  const form = useForm<UserInfoValues>({
    resolver: zodResolver(userInfoSchema),
    defaultValues: {
      age: 25,
      householdSize: 1,
      childrenCount: 0,
      mentalHealthScore: 5,
      incomePercentile: 50,
      childhoodMathSkill: 5,
    },
    mode: "onChange", 
  })

  // Smooth slide animation variants
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0,
    }),
  }

  const direction = currentStep > previousStep ? 1 : -1

  const nextStep = async () => {
    // Validate current fields before moving
    const fieldsToValidate = getFieldsForStep(currentStep)
    const isValid = await form.trigger(fieldsToValidate)
    
    if (isValid) {
      setPreviousStep(currentStep)
      if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1)
      } else {
        onSubmit(form.getValues())
      }
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep)
      setCurrentStep(prev => prev - 1)
    }
  }

  function onSubmit(data: UserInfoValues) {
    console.log("Final Data Submitted:", data)
    alert("Data submitted! Check console.")
    // Here you would call your Server Action to save to Prisma
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      {/* Progress Bar */}
      <div className="mb-8 space-y-2">
        <div className="flex justify-between text-sm font-medium text-zinc-500">
          <span>Step {currentStep + 1} of {steps.length}</span>
          <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
        </div>
        <Progress value={((currentStep + 1) / steps.length) * 100} className="h-2" />
      </div>

      <Form {...form}>
        <form onSubmit={(e) => e.preventDefault()}>
          <Card className="border-zinc-200 shadow-xl overflow-hidden min-h-[500px] flex flex-col justify-between">
            <CardHeader className="bg-zinc-50 border-b pb-6">
              <CardTitle className="text-2xl">{steps[currentStep].title}</CardTitle>
              <CardDescription>{steps[currentStep].description}</CardDescription>
            </CardHeader>

            <CardContent className="pt-8 flex-grow relative overflow-hidden">
              <AnimatePresence custom={direction} mode="wait">
                <motion.div
                  key={currentStep}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="space-y-6"
                >
                  {renderStepContent(currentStep, form)}
                </motion.div>
              </AnimatePresence>
            </CardContent>

            <CardFooter className="flex justify-between border-t bg-zinc-50 p-6">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="w-32"
              >
                Back
              </Button>
              <Button onClick={nextStep} className="w-32 bg-zinc-900 text-white hover:bg-zinc-800">
                {currentStep === steps.length - 1 ? "Finish" : "Next"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  )
}

// Helper to decide which fields belong to which step for validation
function getFieldsForStep(step: number): any[] {
  switch (step) {
    case 0: return ["age", "gender", "education", "maritalStatus"]
    case 1: return ["householdSize", "childrenCount", "socialSupportLevel"]
    case 2: return ["childhoodMathSkill", "booksInHome"]
    case 3: return ["bmi", "smoking", "alcoholConsumption", "mentalHealthScore"]
    case 4: return ["employmentStatus", "incomePercentile"]
    default: return []
  }
}

// The actual form fields content
function renderStepContent(step: number, form: any) {
  switch (step) {
    case 0: // Demographics
      return (
        <>
          <FormField control={form.control} name="age" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Age: {field.value}</FormLabel>
              <FormControl>
                <Slider min={10} max={100} step={1} defaultValue={[field.value]} onValueChange={(val) => field.onChange(val[0])} />
              </FormControl>
            </FormItem>
          )} />

          <FormField control={form.control} name="gender" render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger></FormControl>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="non-binary">Non-binary</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )} />
          
           <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="education" render={({ field }) => (
                <FormItem>
                <FormLabel>Education</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Highest degree" /></SelectTrigger></FormControl>
                    <SelectContent>
                    <SelectItem value="high_school">High School</SelectItem>
                    <SelectItem value="bachelors">Bachelor's</SelectItem>
                    <SelectItem value="masters">Master's</SelectItem>
                    <SelectItem value="phd">PhD</SelectItem>
                    </SelectContent>
                </Select>
                </FormItem>
            )} />

            <FormField control={form.control} name="maritalStatus" render={({ field }) => (
                <FormItem>
                <FormLabel>Marital Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl>
                    <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="married">Married</SelectItem>
                    <SelectItem value="divorced">Divorced</SelectItem>
                    <SelectItem value="widowed">Widowed</SelectItem>
                    </SelectContent>
                </Select>
                </FormItem>
            )} />
           </div>
        </>
      )

    case 1: // Household
      return (
        <>
           <FormField control={form.control} name="householdSize" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">People in Household: {field.value}</FormLabel>
              <FormControl>
                <Slider min={1} max={10} step={1} defaultValue={[field.value]} onValueChange={(val) => field.onChange(val[0])} />
              </FormControl>
              <FormDescription>Includes yourself.</FormDescription>
            </FormItem>
          )} />

          <FormField control={form.control} name="socialSupportLevel" render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>How strong is your social support network?</FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl><RadioGroupItem value="low" /></FormControl>
                    <FormLabel className="font-normal">Low (I often feel alone)</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl><RadioGroupItem value="medium" /></FormControl>
                    <FormLabel className="font-normal">Medium (I have some help)</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl><RadioGroupItem value="high" /></FormControl>
                    <FormLabel className="font-normal">High (Strong community/family)</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
            </FormItem>
          )} />
        </>
      )
    
    case 2: // Childhood
      return (
        <div className="space-y-8">
            <FormField control={form.control} name="booksInHome" render={({ field }) => (
                <FormItem>
                <FormLabel>Books in home at age 10</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select range" /></SelectTrigger></FormControl>
                    <SelectContent>
                    <SelectItem value="0-10">0-10 (Almost none)</SelectItem>
                    <SelectItem value="11-25">11-25 (A shelf)</SelectItem>
                    <SelectItem value="26-100">26-100 (A bookcase)</SelectItem>
                    <SelectItem value="100+">100+ (A library)</SelectItem>
                    </SelectContent>
                </Select>
                </FormItem>
            )} />

            <FormField control={form.control} name="childhoodMathSkill" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Math Skills at Age 10 (1-10)</FormLabel>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">Struggled</span>
                <Slider min={1} max={10} step={1} defaultValue={[field.value || 5]} onValueChange={(val) => field.onChange(val[0])} className="flex-1" />
                <span className="text-sm text-muted-foreground">Genius</span>
              </div>
            </FormItem>
          )} />
        </div>
      )

    case 3: // Health
      return (
        <>
           <div className="grid grid-cols-2 gap-8">
             <FormField control={form.control} name="smoking" render={({ field }) => (
                <FormItem>
                <FormLabel>Smoking History</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger></FormControl>
                    <SelectContent>
                    <SelectItem value="never">Never</SelectItem>
                    <SelectItem value="former">Former Smoker</SelectItem>
                    <SelectItem value="current">Current Smoker</SelectItem>
                    </SelectContent>
                </Select>
                </FormItem>
            )} />

             <FormField control={form.control} name="alcoholConsumption" render={({ field }) => (
                <FormItem>
                <FormLabel>Alcohol</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger></FormControl>
                    <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="social">Socially</SelectItem>
                    <SelectItem value="regular">Regularly</SelectItem>
                    </SelectContent>
                </Select>
                </FormItem>
            )} />
           </div>

           <FormField control={form.control} name="mentalHealthScore" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg">Recent Mood (0 = Happy, 10 = Depressed)</FormLabel>
              <div className="flex items-center gap-4">
                <span className="text-2xl">😊</span>
                <Slider min={0} max={10} step={1} defaultValue={[field.value]} onValueChange={(val) => field.onChange(val[0])} className="flex-1" />
                <span className="text-2xl">😔</span>
              </div>
              <p className="text-center font-bold text-xl mt-2">{field.value}</p>
            </FormItem>
          )} />
        </>
      )

    case 4: // Work & Money
        return (
            <>
              <FormField control={form.control} name="employmentStatus" render={({ field }) => (
                <FormItem>
                <FormLabel>Current Employment</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl>
                    <SelectContent>
                    <SelectItem value="employed">Employed Full-Time</SelectItem>
                    <SelectItem value="part_time">Part-Time</SelectItem>
                    <SelectItem value="self_employed">Self Employed</SelectItem>
                    <SelectItem value="retired">Retired</SelectItem>
                    <SelectItem value="unemployed">Unemployed</SelectItem>
                    </SelectContent>
                </Select>
                </FormItem>
              )} />

            <FormField control={form.control} name="incomePercentile" render={({ field }) => (
                <FormItem>
                <FormLabel className="text-lg">Household Income Percentile: Top {100 - field.value}%</FormLabel>
                <FormControl>
                    <Slider min={1} max={99} step={1} defaultValue={[field.value]} onValueChange={(val) => field.onChange(val[0])} />
                </FormControl>
                <FormDescription>0 = Lowest Income, 100 = Highest Income</FormDescription>
                </FormItem>
            )} />
            </>
        )
  }
}