"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

type User = {
  username: string
  password: string
}

// In a real app, you would store users in a database
const users: User[] = []

export async function login(prevState: any, formData: FormData) {
  const username = formData.get("username") as string
  const password = formData.get("password") as string

  const user = users.find((u) => u.username === username && u.password === password)

  if (user) {
    (await cookies()).set("auth", username)
    redirect("/dashboard")
  }

  return { error: "Invalid credentials" }
}

export async function register(prevState: any, formData: FormData) {
  const username = formData.get("username") as string
  const password = formData.get("password") as string

  if (users.find((u) => u.username === username)) {
    return { error: "Username already exists" }
  }

  users.push({ username, password })
  ;(await cookies()).set("auth", username)
  redirect("/dashboard")
}

