"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function register(prevState: any, formData: FormData) {
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
    console.log('Registration response:', data);

    if (!response.ok) {
    return { error: data.error || "Registration failed" };
  }

    // If registration is successful, proceed with login
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const loginData = await loginResponse.json();
    console.log('Login response:', loginData);

    if (!loginResponse.ok) {
      return { error: loginData.error || "Login after registration failed" };
    }

    // Set the cookie and redirect
    (await cookies()).set("auth", loginData.token);
    redirect("/dashboard");
  } catch (error) {
    // Only catch actual errors, not redirects
    if (error instanceof Error && !error.message.includes('NEXT_REDIRECT')) {
      console.error('Registration error:', error);
      return { error: "An error occurred during registration" };
  }
    throw error; // Re-throw redirect errors
}
}

export async function login(prevState: any, formData: FormData) {
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
    console.log('Login response:', data);

    if (!response.ok) {
      return { error: data.error || "Login failed" };
    }

    // Set the cookie and redirect
    (await cookies()).set("auth", data.token);
    redirect("/dashboard");

  } catch (error) {
    // Only catch actual errors, not redirects
    if (error instanceof Error && !error.message.includes('NEXT_REDIRECT')) {
      console.error('Login error:', error);
      return { error: "An error occurred during login" };
    }
    throw error; // Re-throw redirect errors
  }
}
