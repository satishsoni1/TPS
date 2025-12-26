import { type NextRequest, NextResponse } from "next/server"

// Mock user database - in production use real database
const USERS = [
  { id: "1", email: "admin@tms.com", password: "admin123", role: "admin", name: "Admin User" },
  { id: "2", email: "ops@tms.com", password: "ops123", role: "operations", name: "Operations Manager" },
  { id: "3", email: "acc@tms.com", password: "acc123", role: "accounts", name: "Accounts Executive" },
  { id: "4", email: "trans@tms.com", password: "trans123", role: "transport", name: "Transport Coordinator" },
]

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    const user = USERS.find((u) => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({ user: userWithoutPassword }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
