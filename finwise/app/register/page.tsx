"use client"

import { useActionState } from "react"
import { register } from "../actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(register, null)

  return (
    <div className="max-w-md mx-auto mt-20">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">Create a FinWise Account</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username">Username</label>
              <Input id="username" name="username" placeholder="Choose a username" required />
            </div>
            <div className="space-y-2">
              <label htmlFor="password">Password</label>
              <Input id="password" name="password" type="password" placeholder="Choose a password" required />
            </div>
            {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}
            <Button type="submit" className="w-full bg-lime-500 hover:bg-lime-600" disabled={isPending}>
              {isPending ? "Creating account..." : "Register"}
            </Button>
            <div className="flex items-center justify-between text-sm">
              <span>Already have an account?</span>
              <Link href="/" className="text-lime-500 hover:text-lime-600">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

