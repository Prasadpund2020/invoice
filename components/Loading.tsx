import Image from "next/image";







export default function Loading() {
    return (
       <div className="animate-bounce duration-[2s] flex flex-col gap-4 justify-center items-center mt-16">
  <Image
    src="/Invoice-ly (2).png"
    alt="Loading"
    width={250}
    height={25}
    className="select-none"
  />
  <p className="text-lg font-semibold">Loading...</p>
</div>





    )
}