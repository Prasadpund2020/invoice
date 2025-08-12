// app/api/products/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";
import { auth } from "@/lib/auth";
import Product from "@/models/products";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  await connectDB();
  const products = await Product.find({ user: session.user.id }).sort({ createdAt: -1 });
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  await connectDB();

  const newProduct = await Product.create({
    ...body,
    user: session.user.id,
  });

  return NextResponse.json({ message: "Product added", productId: newProduct._id });
}
