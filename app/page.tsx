import Logo from "@/components/Logo";
import { buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <main className="relative min-h-screen pb-10">
        <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)]"></div>

        <header className="py-4 sm:py-6">
          <div className="container mx-auto flex flex-row items-center justify-between px-4">
            <Logo />
            <Link href="/login" className={buttonVariants()}>
              Get Started
            </Link>
          </div>
        </header>

        <div className="px-4">
          <div className="flex items-center justify-center mt-8 sm:mt-10 lg:mt-14 flex-col gap-4">
            <h1 className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              Easy Invoicing, Happy Business
            </h1>
            <p className="text-center text-base sm:text-lg md:text-xl">
              We make it effortless so your business stays happy
            </p>
          </div>
        </div>

        <div className="flex w-full items-center justify-center mt-10 px-4">
          <div className="w-full max-w-[90%] sm:max-w-[700px] md:max-w-[900px] lg:max-w-[1000px]">
            <Image
              src="/Screenshot (106).png"
              alt="dashboard"
              width={1000}
              height={700}
              className="rounded shadow-2xl drop-shadow-2xl w-full h-auto"
            />
          </div>
        </div>
      </main>

      <footer className="bg-primary text-white flex justify-center items-center py-6 sm:py-8 px-4 text-center">
        <p className="font-medium text-base sm:text-lg">
          Made by{" "}
          <Link
            href="https://www.linkedin.com/in/prasad-pund/"
            className="italic hover:underline cursor-pointer text-blue-400"
          >
            Prasad Pund
          </Link>
        </p>
      </footer>
    </>
  );
}
