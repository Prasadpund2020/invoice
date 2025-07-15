import Logo from "@/components/Logo";
import { buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <main className="relative lg:min-h-dvh pb-10">
        <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)]"></div>

        {/* ✅ Changed header padding for more balanced spacing */}
        <header className="py-3"> {/* was no padding or margin before */}
          <div className="container mx-auto flex flex-row items-center justify-between">
            <Logo />
            <Link href="/login" className={buttonVariants()}>
              Get Started
            </Link>
          </div>
        </header>

        <div className="px-4">
          {/* ✅ Reduced mt-14 / lg:mt-28 to mt-8 / lg:mt-14 for less gap */}
          <div className="flex items-center justify-center mt-8 lg:mt-14 flex-col gap-4">
            <div className="text-2xl font-bold lg:text-5xl text-center">
              Easy Invoicing, Happy Business
            </div>
            <p className="text-center">
              We make it effortless so your business stays happy
            </p>
          </div>
        </div>

        {/* ✅ Reduced mt-14 to mt-10 for slightly tighter layout */}
        <div className="flex w-full items-center justify-center mt-10 px-4">
          <Image
            src="/Screenshot (106).png"
            alt="dashboard"
            width={1000}
            height={700}
            className="rounded shadow-2xl drop-shadow-2xl"
          />
        </div>
      </main>

      <footer className="bg-primary text-white flex justify-center items-center py-8">
        <p className="font-semibold text-lg">
          Made by{" "}
          <Link
            href="https://www.linkedin.com/in/prasad-pund/"
            className="italic hover:underline cursor-pointer text-blue-500"
          >
            Prasad Pund
          </Link>
        </p>
      </footer>
    </>
  );
}
