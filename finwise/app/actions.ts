"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

interface ActionState {
  error?: string;
  success?: boolean;
}
export async function register(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const username = formData.get("username") as string
  const password = formData.get("password") as string

  try {
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    if (!response.ok) {
    return { error: data.error || "Registration failed" };
  }

    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const loginData = await loginResponse.json();
    if (!loginResponse.ok) {
      return { error: loginData.error || "Login after registration failed" };
    }

    (await cookies()).set("auth", loginData.token);
    redirect("/");
  } catch (error) {
    if (error instanceof Error && !error.message.includes('NEXT_REDIRECT')) {
      console.error('Registration error:', error);
      return { error: "An error occurred during registration" };
  }
    throw error;
}
}

export async function login(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const username = formData.get("username") as string
  const password = formData.get("password") as string

  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || "Login failed" };
    }

    (await cookies()).set("auth", data.token);

    return { success: true };

  } catch (error) {
    if (error instanceof Error && !error.message.includes('NEXT_REDIRECT')) {
      console.error('Login error:', error);
      return { error: "An error occurred during login" };
    }
    throw error;
  }
}