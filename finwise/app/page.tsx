"use client"

import { useActionState } from "react"
import { login } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, null)

  return (
    <div className="max-w-md mx-auto mt-20">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">Login to FinWise</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username">Username</label>
              <Input id="username" name="username" placeholder="Enter your username" required />
            </div>
            <div className="space-y-2">
              <label htmlFor="password">Password</label>
              <Input id="password" name="password" type="password" placeholder="Enter your password" required />
            </div>
            {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}
            <Button type="submit" className="w-full bg-lime-500 hover:bg-lime-600" disabled={isPending}>
              {isPending ? "Logging in..." : "Log in"}
            </Button>
            <div className="flex items-center justify-between text-sm">
              <span>New to FinWise?</span>
              <Link href="/register" className="text-lime-500 hover:text-lime-600">
                Register
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

