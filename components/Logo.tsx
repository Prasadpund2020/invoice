import Image from "next/image"

export default function Logo(){
    return (
        <div>
            <Image
                src="/Invoice-ly.png"
                alt="generate invoice"
                width={240}
                height={30}
                priority
                style={{ height: "auto" }}  // <-- recommended
            />
        </div>
    )
}
