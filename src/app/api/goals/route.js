import { NextResponse } from "next/server";
import Goal from "@/models/goal";
import connectDB from "@/lib/mongodb";

export async function GET() {
  await connectDB();
  try {
    const goal = await Goal.findOne({});

    if (!goal) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    return NextResponse.json(goal, { status: 200 });
  } catch (error) {
    console.error("Error fetching goal:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
