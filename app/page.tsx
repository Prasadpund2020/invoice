import Logo from "@/components/Logo";
import { buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <main className="relative min-h-screen pb-10">  {/* 🔧 Ensure full height on all screens */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)]"></div>

        {/* 🔧 Made header taller on larger screens, padding adjusts with screen */}
        <header className="flex items-center backdrop-blur-2xl px-4 py-4 lg:py-8">
          <div className="container mx-auto flex items-center justify-between gap-4">
            <Logo />   {/* Left side: Logo stays left */}

            <Link
              href={"/Signup"}
              className={buttonVariants()}   // Right side: Button stays right
            >
              Get Started
            </Link>
          </div>
        </header>


        <section className="px-4">
          <div className="flex items-center justify-center mt-14 lg:mt-28 flex-col gap-4 text-center">
            <h1 className="text-2xl font-bold md:text-4xl lg:text-5xl max-w-xl">
              Easy Invoicing, Happy Business
            </h1>
            <p className="max-w-md text-gray-700">We make it effortless so your business stays happy.</p>
          </div>
        </section>

        {/* 🔧 Made image responsive */}
        <section className="flex w-full items-center justify-center mt-10 px-4">
          <Image
            src={"/Screenshot.png"}
            alt="dashboard"
            width={1000}
            height={700}
            className="rounded shadow-2xl drop-shadow-2xl w-full max-w-4xl h-auto"
            priority
          />
        </section>
      </main>

      <footer className="bg-primary text-white flex justify-center items-center py-6 px-4">
        <p className="font-semibold text-base sm:text-lg text-center">
          Made by{" "}
          <Link
            href={"https://www.linkedin.com/in/prasad-pund/"}
            className="italic hover:underline cursor-pointer text-blue-500"
          >
            Prasad Pund
          </Link>
        </p>
      </footer>
    </>
  );
}
