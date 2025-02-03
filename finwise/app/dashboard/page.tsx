import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"

export default async function DashboardPage() {
  const cookieStore = cookies()
  const auth = (await cookieStore).get("auth")

  if (!auth) {
    redirect("/")
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Welcome, {auth.value}!</h1>
      <p className="text-gray-600 mb-4">You have successfully logged into your FinWise account.</p>
      <form
        action={async () => {
          "use server"
          await (await cookies()).delete("auth")
          redirect("/")
        }}
      >
        <Button type="submit" variant="outline">
          Sign Out
        </Button>
      </form>
    </div>
  )
}

