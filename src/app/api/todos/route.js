import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Fetch all todos
export async function GET() {
  const todos = await prisma.todo.findMany();
  return NextResponse.json(todos);
}

// POST: Create a new todo
export async function POST(req) {
  const { title } = await req.json();
  const todo = await prisma.todo.create({
    data: { title },
  });
  return NextResponse.json(todo);
}

// PUT: Toggle completed status
export async function PUT(req) {
  const { id, completed } = await req.json();
  const updatedTodo = await prisma.todo.update({
    where: { id },
    data: { completed },
  });
  return NextResponse.json(updatedTodo);
}

// DELETE: Remove a todo
export async function DELETE(req) {
  const { id } = await req.json();
  await prisma.todo.delete({ where: { id } });
  return NextResponse.json({ message: "Deleted" });
}
