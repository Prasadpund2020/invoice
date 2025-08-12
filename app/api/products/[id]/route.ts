// app/api/products/[id]/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/connectDB";
import { auth } from "@/lib/auth";
import Product from "@/models/products";

interface Params {
  params: { id: string };
}

export async function DELETE(req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const deletedProduct = await Product.findOneAndDelete({
    _id: params.id,
    user: session.user.id,
  });

  if (!deletedProduct) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Product deleted successfully" });
}
